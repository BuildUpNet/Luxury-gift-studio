// Hostinger entry point.
// Boots the Express app from server/server.js and records every startup log/error,
// so failures can be inspected at /api/debug?key=<DEBUG_KEY> and in startup.log.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, 'startup.log');
const MAX_LOGS = 300;

const bootLogs = [];
globalThis.__bootLogs = bootLogs;
globalThis.__bootInfo = { startedAt: new Date().toISOString(), startupError: null };

function record(level, args) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${args
    .map((a) => (a instanceof Error ? a.stack : typeof a === 'string' ? a : safeJson(a)))
    .join(' ')}`;
  bootLogs.push(line);
  if (bootLogs.length > MAX_LOGS) bootLogs.shift();
  try {
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch {
    /* log file not writable - ignore */
  }
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

for (const level of ['log', 'info', 'warn', 'error']) {
  const original = console[level].bind(console);
  console[level] = (...args) => {
    record(level, args);
    original(...args);
  };
}

process.on('uncaughtException', (err) => console.error('uncaughtException:', err));
process.on('unhandledRejection', (err) => console.error('unhandledRejection:', err));

console.log(
  `Booting: node ${process.version}, cwd=${process.cwd()}, PORT=${process.env.PORT ?? '(not set)'}, NODE_ENV=${process.env.NODE_ENV ?? '(not set)'}`
);

try {
  await import('./server/server.js');
  console.log('server/server.js loaded successfully');
} catch (err) {
  globalThis.__bootInfo.startupError = err?.stack || String(err);
  console.error('FAILED to load server/server.js:', err);
  startFallbackServer();
}

// Minimal dependency-free server used only when the real app fails to load.
function startFallbackServer() {
  const port = Number(process.env.PORT) || 5002;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const authorized = process.env.DEBUG_KEY && url.searchParams.get('key') === process.env.DEBUG_KEY;
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    if (!authorized) {
      res.end('Server failed to start. Open /api/debug?key=<DEBUG_KEY> for details.');
      return;
    }
    res.end(
      `STARTUP ERROR\n\n${globalThis.__bootInfo.startupError}\n\nLOGS\n\n${bootLogs.join('\n')}`
    );
  });
  server.on('error', (err) => console.error('Fallback server error:', err));
  server.listen(port, () => console.log(`Fallback debug server listening on port ${port}`));
}

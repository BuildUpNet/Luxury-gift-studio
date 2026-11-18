import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
dotenv.config();

const requiredVariables = ['DB_HOST', 'DB_USER', 'DB_NAME'];

const missingVariables = requiredVariables.filter(
  (key) => !process.env[key]
);

if (missingVariables.length) {
  throw new Error(
    `Missing database configuration: ${missingVariables.join(', ')}`
  );
}

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 10000,
  maxIdle: 10,
  idleTimeout: 60000
});

/**
 * Robust database query with automatic reconnection/retry logic.
 * Useful when connections become stale or during DB cold-start / wakeups.
 */
export async function executeWithRetry(sql, params = [], maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await dbPool.execute(sql, params);
    } catch (err) {
      attempt++;
      const isTransient = [
        'ECONNREFUSED',
        'PROTOCOL_CONNECTION_LOST',
        'ETIMEDOUT',
        'EPIPE',
        'ER_CON_COUNT_ERROR',
        'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
      ].includes(err.code);

      console.warn(`[DB executeWithRetry] Attempt ${attempt} failed: ${err.code || err.message}`);

      if (attempt > maxRetries || !isTransient) {
        throw err;
      }
      // Wait briefly before retrying
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
}

// Keep connection warm with periodic keepalive ping every 50 seconds
setInterval(async () => {
  try {
    await dbPool.query('SELECT 1');
  } catch (err) {
    console.warn('[DB Keepalive Ping] warning:', err.code || err.message);
  }
}, 50000);

try {
  const connection = await dbPool.getConnection();
  console.log(`Connected to MySQL: ${process.env.DB_NAME}`);
  connection.release();
} catch (error) {
  // Log but keep the server running so the site and /api/health stay reachable
  console.error('MySQL connection failed:', error.code, error.message);
}

export default dbPool;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import contactRoutes from './routes/contact.js';
import giftingBannerRoutes from './routes/giftingBanner.js';

import { uploadMiddleware } from './middlewares/upload.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dbPool from './config/db.js';
import fs from 'fs';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5002;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic CORS configuration from environment variables
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  CLIENT_ORIGIN
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.REQUEST_SIZE_LIMIT || '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded public static images
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '../public');
app.use(express.static(uploadsDir));

// API routes
app.use('/api/admin', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', giftingBannerRoutes);

// Image upload endpoint
app.post('/api/upload', uploadMiddleware.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const relativePath = `/images/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: relativePath,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Diagnostics: /api/debug?key=<DEBUG_KEY> (disabled unless DEBUG_KEY env is set)
app.get('/api/debug', async (req, res) => {
  if (!process.env.DEBUG_KEY || req.query.key !== process.env.DEBUG_KEY) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  const envKeys = [
    'PORT', 'NODE_ENV', 'CLIENT_ORIGIN', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD',
    'DB_NAME', 'JWT_SECRET', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
    'ADMIN_EMAIL', 'EMAIL_FROM'
  ];
  const visible = new Set(['PORT', 'NODE_ENV', 'CLIENT_ORIGIN', 'DB_HOST', 'DB_PORT', 'SMTP_HOST', 'SMTP_PORT']);
  const env = Object.fromEntries(
    envKeys.map((k) => [
      k,
      process.env[k] === undefined ? '(missing)' : visible.has(k) ? process.env[k] : '(set)'
    ])
  );

  let database;
  try {
    const [rows] = await dbPool.query('SHOW TABLES');
    database = { connected: true, tables: rows.map((r) => Object.values(r)[0]) };
  } catch (error) {
    database = { connected: false, code: error.code, message: error.message };
  }

  const distIndex = path.join(__dirname, '../dist/index.html');

  return res.json({
    node: process.version,
    cwd: process.cwd(),
    uptimeSeconds: Math.round(process.uptime()),
    boot: globalThis.__bootInfo || null,
    frontendBuilt: fs.existsSync(distIndex),
    env,
    database,
    logs: globalThis.__bootLogs || []
  });
});

// Serve the built React frontend (vite build -> ../dist) with SPA fallback
const distDir = path.join(__dirname, '../dist');
app.use(express.static(distDir));
app.get(/^\/(?!api\/).*/, (req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`The Gift Studio server running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error(`Failed to listen on port ${PORT}:`, error);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import contactRoutes from './routes/contact.js';
import giftingBannerRoutes from './routes/giftingBanner.js';
import testimonialsRoutes from './routes/testimonials.js';
import settingsRoutes from './routes/settings.js';
import heroSlidesRoutes from './routes/heroSlides.js';
// import subscribeRoutes from './routes/subscribe.js';
import occasionsRoutes from './routes/occasions.js';
import featureCardsRoutes from './routes/featureCards.js';

import { uploadMiddleware } from './middlewares/upload.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dbPool from './config/db.js';
import fs from 'fs';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseOrigins = (val) => {
  if (!val) return [];
  return val
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const configuredOrigins = parseOrigins(process.env.CLIENT_ORIGIN);
const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000'
];

const allowedOriginsSet = new Set([
  ...configuredOrigins,
  ...(process.env.NODE_ENV !== 'production' ? defaultLocalOrigins : [])
]);

const allowAllCors =
  process.env.CORS_ALLOW_ALL === 'true' ||
  process.env.CORS_ALLOW_ALL === '1' ||
  (!process.env.CLIENT_ORIGIN && process.env.NODE_ENV !== 'production');

const corsOptions = {
  origin(origin, callback) {
    // 1. Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Allow all when explicitly enabled or in open fallback mode
    if (allowAllCors) {
      return callback(null, true);
    }

    // 3. Allow if explicitly in configured/allowed origins
    if (allowedOriginsSet.has(origin)) {
      return callback(null, true);
    }

    // 4. In non-production or if localhost origin, allow localhost / 127.0.0.1 on any port
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocalhost && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // 5. Clean fallback: If CLIENT_ORIGIN is not set, reflect requesting origin safely
    if (configuredOrigins.length === 0) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.REQUEST_SIZE_LIMIT || '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded public static images
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '../public');
app.use(express.static(uploadsDir));

// API routes
app.use('/api/admin', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
// app.use('/api/subscribe', subscribeRoutes);
app.use('/api/occasions', occasionsRoutes);
app.use('/api/feature-cards', featureCardsRoutes);
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

// Multi-image upload endpoint (max 7 images)
app.post('/api/upload-multiple', uploadMiddleware.array('images', 7), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }

  const urls = req.files.map((file) => `/images/${file.filename}`);

  return res.status(200).json({
    success: true,
    message: `${req.files.length} image(s) uploaded successfully`,
    urls,
    files: req.files.map((file) => ({
      url: `/images/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }))
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
    'PORT', 'NODE_ENV', 'CLIENT_ORIGIN', 'CORS_ALLOW_ALL', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD',
    'DB_NAME', 'JWT_SECRET', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
    'ADMIN_EMAIL', 'EMAIL_FROM'
  ];
  const visible = new Set(['PORT', 'NODE_ENV', 'CLIENT_ORIGIN', 'CORS_ALLOW_ALL', 'DB_HOST', 'DB_PORT', 'SMTP_HOST', 'SMTP_PORT']);
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

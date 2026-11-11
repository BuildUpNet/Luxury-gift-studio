import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import contactRoutes from './routes/contact.js';

import { uploadMiddleware } from './middlewares/upload.js';
import { errorHandler } from './middlewares/errorHandler.js';

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
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', contactRoutes);

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

app.listen(PORT, () => {
  console.log(`The Gift Studio server running on port ${PORT}`);
});

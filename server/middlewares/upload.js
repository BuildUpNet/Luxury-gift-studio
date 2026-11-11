import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow configuring upload directory via UPLOAD_DIR or default to public/images
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../public/images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error('Only JPEG, PNG, GIF, WebP, SVG and AVIF images are allowed'),
    false
  );
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 5 * 1024 * 1024 // 5MB default
  }
});


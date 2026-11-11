import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message || err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds maximum allowed limit'
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed by CORS'
    });
  }

  if (err.message && err.message.startsWith('Only JPEG, PNG, GIF, WebP, SVG and AVIF')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
};


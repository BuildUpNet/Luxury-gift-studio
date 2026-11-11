import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: 'JWT secret not configured on server.'
    });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    req.user = user;
    next();
  });
};


import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import dbPool from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'the_gift_studio_secure_jwt_key_env';

// Dummy hash used when admin not found — prevents timing attacks
const DUMMY_HASH = '$2a$12$dummyhashfortimingattackmitigationxxxxxxxxxxxxxxxxxx';

// Rate limiter: max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Middleware: Verify JWT token ──────────────────────────────────────────────
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token is invalid or expired.' });
    }
    req.user = user;
    next();
  });
};

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username/email and password are required.' });
  }

  if (!dbPool) {
    return res.status(500).json({ success: false, message: 'Database not connected.' });
  }

  try {
    const identifier = username.trim().toLowerCase();

    console.log('Login attempt with username:', identifier);

    const [rows] = await dbPool.execute(
      `SELECT id, username, email, password_hash
       FROM admin
       WHERE LOWER(username) = ? OR LOWER(email) = ?
       LIMIT 1`,
      [identifier, identifier]
    );

    const admin = rows[0];

    console.log('Admin found in DB:', !!admin);
    if (admin) {
      console.log('DB Admin username:', admin.username);
      console.log('DB Password hash exists:', !!admin.password_hash);
    }

    const hashToCompare = admin ? admin.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    console.log('Password comparison result:', isMatch);
    console.log('Admin exists:', !!admin);
    console.log('Match result:', isMatch);

    if (!admin || !isMatch) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log('Login successful for admin:', admin.username);

    // Sign JWT (7 day expiry)
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

// ── GET /api/admin/verify ─────────────────────────────────────────────────────
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── POST /api/admin/logout ────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;


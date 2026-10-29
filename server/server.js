import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'the_gift_studio_secure_jwt_key_env';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());

let dbPool = null;

try {
  dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'luxury_gift_studio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  dbPool.getConnection()
    .then((conn) => {
      console.log('Connected to MySQL Database: ' + (process.env.DB_NAME || 'luxury_gift_studio'));
      conn.release();
    })
    .catch((err) => {
      console.error('MySQL connection error:', err.message);
    });
} catch (poolErr) {
  console.error('MySQL pool initialization error:', poolErr.message);
}

// Token Verification Middleware
const authenticateToken = (req, res, next) => {
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

// 1. POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both username/email and password are required.'
    });
  }

  const queryIdentifier = username.trim().toLowerCase();

  try {
    if (!dbPool) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not initialized. Please verify MySQL configuration.'
      });
    }

    const [rows] = await dbPool.execute(
      `SELECT id, username, email, password_hash, name, role, status 
       FROM admin_users 
       WHERE (LOWER(username) = ? OR LOWER(email) = ?) AND status = 'active' 
       LIMIT 1`,
      [queryIdentifier, queryIdentifier]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your username and password.'
      });
    }

    const adminRecord = rows[0];

    // Strictly verify password hash with bcrypt
    const isMatch = await bcrypt.compare(password, adminRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your username and password.'
      });
    }

    // Update last_login timestamp
    try {
      await dbPool.execute(
        'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
        [adminRecord.id]
      );
    } catch {}

    // Sign JWT Token
    const payload = {
      id: adminRecord.id,
      username: adminRecord.username,
      email: adminRecord.email,
      role: adminRecord.role || 'superadmin'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: adminRecord.id,
        username: adminRecord.username,
        email: adminRecord.email,
        name: adminRecord.name || 'Studio Administrator',
        role: adminRecord.role || 'superadmin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
});

// 2. GET /api/admin/verify
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 3. POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Session invalidated successfully.'
  });
});

// 4. GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: dbPool ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Luxury Gift Studio Auth Server running on http://localhost:${PORT}`);
});

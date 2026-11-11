import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

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
  keepAliveInitialDelay: 0
});

try {
  const connection = await dbPool.getConnection();

  console.log(`Connected to MySQL: ${process.env.DB_NAME}`);

  connection.release();
} catch (error) {
  // Log but keep the server running so the site and /api/health stay reachable
  console.error('MySQL connection failed:', error.code, error.message);
}

export default dbPool;
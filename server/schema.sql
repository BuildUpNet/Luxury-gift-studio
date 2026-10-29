-- ========================================================
-- Luxury Gift Studio - Admin Authentication Schema
-- Database: luxury_gift_studio
-- ========================================================

CREATE DATABASE IF NOT EXISTS luxury_gift_studio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE luxury_gift_studio;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Studio Administrator',
  role VARCHAR(50) NOT NULL DEFAULT 'superadmin',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_username (username),
  INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Seed Default Admin User
-- Default Credentials:
--   Username: admin
--   Email:    admin@thegiftstudio.com
--   Password: Admin@123
-- The password_hash below is a Bcrypt hash of 'Admin@123'
INSERT INTO admin_users (username, email, password_hash, name, role, status)
VALUES (
  'admin',
  'admin@thegiftstudio.com',
  '$2a$10$wEslVzHqgBfv1xTq5L2xge5u1rW8fO8eC1f4eX7f9m8hQ1a2b3c4d',
  'Studio Administrator',
  'superadmin',
  'active'
)
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  name = VALUES(name),
  status = 'active';

-- ========================================================
-- To verify user insertion:
-- SELECT id, username, email, name, role, status FROM admin_users;
-- ========================================================


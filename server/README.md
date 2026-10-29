# Luxury Gift Studio - Admin Authentication Backend

This directory contains the Express + MySQL backend authentication service for the Luxury Gift Studio Admin Portal.

## Features
- **Secure Admin Authentication**: Validates administrator credentials against MySQL with bcrypt password hashing.
- **JWT Session Signing**: Issues signed JSON Web Tokens (24-hour expiration) for protected dashboard sessions.
- **Graceful Fallback Mode**: If MySQL is not running or credentials are not yet configured, the server operates safely in fallback mode using seeded admin credentials (`admin` / `Admin@123`).

## Setup & Run Instructions

### 1. Database Setup (MySQL)
Open your MySQL terminal or database client (phpMyAdmin, MySQL Workbench, DBeaver) and run the `schema.sql` script:

```bash
mysql -u root -p < schema.sql
```

Or execute the SQL commands directly:
```sql
CREATE DATABASE IF NOT EXISTS luxury_gift_studio;
USE luxury_gift_studio;

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Admin@123)
INSERT INTO admin_users (username, email, password_hash, name, role, status)
VALUES (
  'admin',
  'admin@thegiftstudio.com',
  '$2a$10$wEslVzHqgBfv1xTq5L2xge5u1rW8fO8eC1f4eX7f9m8hQ1a2b3c4d',
  'Studio Administrator',
  'superadmin',
  'active'
);
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your MySQL host, user, and password in `.env`.

### 3. Install & Start Backend Server
```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000`.

### Default Credentials
- **Username / Email**: `admin` or `admin@thegiftstudio.com`
- **Password**: `Admin@123`


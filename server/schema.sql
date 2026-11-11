-- ==========================================================
-- The Gift Studio - Complete Database Schema & Initial Data
-- Use this file to import into Hostinger phpMyAdmin
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. Table structure for: admin
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` INT NOT NULL DEFAULT 1,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `only_one_admin` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Admin Login Credentials:
-- Username: admin
-- Email: admin@thegiftstudio.com
-- Password: password123 (bcrypt hash)
INSERT INTO `admin` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'admin', 'admin@thegiftstudio.com', '$2a$10$6rmGzhLGRUB6YewTFagsX.2Yc3qiqiMGRr5cSAafr2wUoPb2lns62')
ON DUPLICATE KEY UPDATE `id` = `id`;


-- ----------------------------------------------------------
-- 2. Table structure for: categories
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_name` (`name`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial manual categories
INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Home Decor', 'home-decor'),
(2, 'Diwali', 'diwali'),
(3, 'Hampers', 'hampers')
ON DUPLICATE KEY UPDATE `id` = `id`;


-- ----------------------------------------------------------
-- 3. Table structure for: products
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Home Decor',
  `category_id` INT UNSIGNED DEFAULT NULL,
  `priceNum` DECIMAL(10,2) NOT NULL,
  `originalPrice` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT UNSIGNED DEFAULT 10,
  `inStock` TINYINT(1) DEFAULT 1,
  `sameDayDelivery` TINYINT(1) DEFAULT 1,
  `image` LONGTEXT NOT NULL,
  `description` LONGTEXT,
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `reviews` INT UNSIGNED DEFAULT 8,
  `brand` VARCHAR(100) DEFAULT 'THE GIFT STUDIO',
  `discountBadge` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_inStock` (`inStock`),
  KEY `fk_products_category_id` (`category_id`),
  CONSTRAINT `fk_products_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------
-- 4. Table structure for: contacts
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


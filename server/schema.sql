-- Database Schema for The Gift Studio (MySQL)

CREATE DATABASE IF NOT EXISTS `gift_studio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gift_studio`;

-- Admin Table
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL DEFAULT '1',
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `only_one_admin` CHECK ((`id` = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table (strictly for product categories, parent-child subcategories, navbar limit & thumbnails)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `section_type` ENUM('category') NOT NULL DEFAULT 'category',
  `show_in_navbar` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_name` (`name`),
  KEY `idx_slug` (`slug`),
  KEY `fk_category_parent` (`parent_id`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts Table
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Home Decor',
  `category_id` int unsigned DEFAULT NULL,
  `occasion_id` int unsigned DEFAULT NULL,
  `priceNum` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `stock` int unsigned DEFAULT '10',
  `inStock` tinyint(1) DEFAULT '1',
  `sameDayDelivery` tinyint(1) DEFAULT '1',
  `is_best_collection` tinyint(1) NOT NULL DEFAULT 0,
  `image` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `rating` decimal(2,1) DEFAULT '4.8',
  `reviews` int unsigned DEFAULT '8',
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'THE GIFT STUDIO',
  `discountBadge` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_inStock` (`inStock`),
  KEY `idx_is_best_collection` (`is_best_collection`),
  KEY `fk_products_category_id` (`category_id`),
  KEY `fk_products_occasion_id` (`occasion_id`),
  CONSTRAINT `fk_products_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_occasion_id` FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gifting Banner Config Table
CREATE TABLE IF NOT EXISTS `gifting_banner_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eyebrow` varchar(150) NOT NULL DEFAULT 'BESPOKE GIFTING & BULK ORDERS',
  `heading` varchar(255) NOT NULL DEFAULT 'Curate Your Custom Gift Hamper',
  `subheading` text NOT NULL,
  `button_text` varchar(100) NOT NULL DEFAULT 'Request Custom Quote →',
  `bg_image` varchar(255) DEFAULT NULL,
  `overlay_opacity` decimal(3,2) NOT NULL DEFAULT '0.65',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Custom Gifting Inquiries Table
CREATE TABLE IF NOT EXISTS `custom_gifting_inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `city_pincode` varchar(150) NOT NULL,
  `message` text DEFAULT NULL,
  `agreed_to_terms` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(50) NOT NULL DEFAULT 'New',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials Table
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(150) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `product_image_url` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '5.0',
  `review_text` text NOT NULL,
  `occasion` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rating` (`rating`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Store Settings Table (Social links, contact info, concierge preferences)
CREATE TABLE IF NOT EXISTS `store_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `facebook_url` varchar(255) DEFAULT 'https://facebook.com/thegiftstudio',
  `whatsapp_url` varchar(255) DEFAULT 'https://wa.me/917506210892',
  `instagram_url` varchar(255) DEFAULT 'https://instagram.com/thegiftstudio',
  `bulk_enquiry_phone` varchar(50) DEFAULT '917506210892',
  `support_email` varchar(150) DEFAULT 'contact@thegiftstudio.com',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hero Slides Table (Homepage dynamic carousel banners)
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `tag_text` varchar(150) DEFAULT NULL,
  `heading` varchar(255) NOT NULL,
  `subtext` text DEFAULT NULL,
  `button_text` varchar(100) DEFAULT 'GIFT NOW',
  `button_link` varchar(255) DEFAULT '#shop-now',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscribers Table (Newsletter Subscriptions)
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Occasions Table (Dedicated Gifting Occasions)
CREATE TABLE IF NOT EXISTS `occasions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL UNIQUE,
  `slug` varchar(150) NOT NULL UNIQUE,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Occasions Junction Table (Assigning products to occasions)
CREATE TABLE IF NOT EXISTS `product_occasions` (
  `product_id` int unsigned NOT NULL,
  `occasion_id` int unsigned NOT NULL,
  PRIMARY KEY (`product_id`, `occasion_id`),
  KEY `fk_po_occasion` (`occasion_id`),
  CONSTRAINT `fk_po_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_occasion` FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

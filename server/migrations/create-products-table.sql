-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Home Decor',
  `priceNum` decimal(10, 2) NOT NULL,
  `originalPrice` decimal(10, 2),
  `stock` int(10) UNSIGNED DEFAULT 10,
  `inStock` tinyint(1) DEFAULT 1,
  `sameDayDelivery` tinyint(1) DEFAULT 1,
  `image` longtext NOT NULL,
  `description` longtext,
  `rating` decimal(2, 1) DEFAULT 4.8,
  `reviews` int(10) UNSIGNED DEFAULT 8,
  `brand` varchar(100) DEFAULT 'THE GIFT STUDIO',
  `discountBadge` varchar(50),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_inStock` (`inStock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

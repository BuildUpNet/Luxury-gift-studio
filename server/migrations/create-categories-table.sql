-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_name` (`name`),
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories to match existing product categories
INSERT IGNORE INTO `categories` (`name`, `slug`) VALUES
('Home Decor', 'home-decor'),
('Diwali', 'diwali'),
('Hampers', 'hampers'),
('Tableware & Serving', 'tableware-serving'),
('Corporate Gifts', 'corporate-gifts');

-- Update products table to add category_id column and foreign key (if column doesn't exist)
ALTER TABLE `products`
ADD COLUMN IF NOT EXISTS `category_id` INT UNSIGNED;

-- Add foreign key constraint (only if not exists)
ALTER TABLE `products`
ADD CONSTRAINT `fk_products_category_id`
FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) 
ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS `idx_category_id` ON `products` (`category_id`);

-- Migrate existing category strings to foreign keys
UPDATE `products` p
LEFT JOIN `categories` c ON 
  CASE 
    WHEN p.category = 'Home Decor' THEN c.slug = 'home-decor'
    WHEN p.category = 'Diwali' THEN c.slug = 'diwali'
    WHEN p.category = 'Hampers' THEN c.slug = 'hampers'
    WHEN p.category = 'Tableware & Serving' THEN c.slug = 'tableware-serving'
    WHEN p.category = 'Corporate Gifts' THEN c.slug = 'corporate-gifts'
    ELSE c.slug = 'home-decor'
  END
SET p.category_id = c.id
WHERE c.id IS NOT NULL;
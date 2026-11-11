-- Create contacts table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Example data (optional)
-- INSERT INTO contacts (name, email, subject, message, status) VALUES
-- ('John Doe', 'john@example.com', 'Question about delivery', 'How long does delivery take?', 'new'),
-- ('Jane Smith', 'jane@example.com', 'Product inquiry', 'Do you have chocolate hampers?', 'resolved');
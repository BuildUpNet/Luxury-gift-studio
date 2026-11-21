import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

const DEFAULT_SETTINGS = {
  id: 1,
  facebook_url: 'https://facebook.com/thegiftstudio',
  whatsapp_url: 'https://wa.me/917506210892',
  instagram_url: 'https://instagram.com/thegiftstudio',
  bulk_enquiry_phone: '917506210892',
  support_email: 'modient93@gmail.com'
};

// Ensure table exists & initial row is present
async function ensureSettingsTable() {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id int unsigned NOT NULL AUTO_INCREMENT,
        facebook_url varchar(255) DEFAULT 'https://facebook.com/thegiftstudio',
        whatsapp_url varchar(255) DEFAULT 'https://wa.me/917506210892',
        instagram_url varchar(255) DEFAULT 'https://instagram.com/thegiftstudio',
        bulk_enquiry_phone varchar(50) DEFAULT '917506210892',
        support_email varchar(150) DEFAULT 'modient93@gmail.com',
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [rows] = await dbPool.query('SELECT COUNT(*) as count FROM store_settings WHERE id = 1');
    if (rows[0].count === 0) {
      await dbPool.query(
        'INSERT INTO store_settings (id, facebook_url, whatsapp_url, instagram_url, bulk_enquiry_phone, support_email) VALUES (1, ?, ?, ?, ?, ?)',
        [
          DEFAULT_SETTINGS.facebook_url,
          DEFAULT_SETTINGS.whatsapp_url,
          DEFAULT_SETTINGS.instagram_url,
          DEFAULT_SETTINGS.bulk_enquiry_phone,
          DEFAULT_SETTINGS.support_email
        ]
      );
    }
  } catch (err) {
    console.error('Failed to ensure store_settings table:', err.message);
  }
}
ensureSettingsTable();

// -------------------------------------------------------------
// 1. GET /api/settings (Public - Fetch current store social & contact settings)
// -------------------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM store_settings WHERE id = 1 LIMIT 1');
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        settings: DEFAULT_SETTINGS
      });
    }

    return res.status(200).json({
      success: true,
      settings: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 2. PUT /api/settings (Protected - Admin update settings)
// -------------------------------------------------------------
router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      facebook_url,
      whatsapp_url,
      instagram_url,
      bulk_enquiry_phone,
      support_email
    } = req.body;

    const fb = facebook_url !== undefined ? facebook_url.trim() : DEFAULT_SETTINGS.facebook_url;
    const wa = whatsapp_url !== undefined ? whatsapp_url.trim() : DEFAULT_SETTINGS.whatsapp_url;
    const ig = instagram_url !== undefined ? instagram_url.trim() : DEFAULT_SETTINGS.instagram_url;
    const phone = bulk_enquiry_phone !== undefined ? bulk_enquiry_phone.trim() : DEFAULT_SETTINGS.bulk_enquiry_phone;
    const email = support_email !== undefined ? support_email.trim() : DEFAULT_SETTINGS.support_email;

    await dbPool.query(
      `INSERT INTO store_settings (id, facebook_url, whatsapp_url, instagram_url, bulk_enquiry_phone, support_email)
       VALUES (1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         facebook_url = VALUES(facebook_url),
         whatsapp_url = VALUES(whatsapp_url),
         instagram_url = VALUES(instagram_url),
         bulk_enquiry_phone = VALUES(bulk_enquiry_phone),
         support_email = VALUES(support_email)`,
      [fb, wa, ig, phone, email]
    );

    const [updatedRows] = await dbPool.query('SELECT * FROM store_settings WHERE id = 1 LIMIT 1');

    return res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updatedRows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;

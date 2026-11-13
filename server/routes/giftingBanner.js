import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dbPool from '../config/db.js';
import { authenticateToken } from '../middlewares/auth.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import {
  sendGiftingInquiryAdminNotification,
  sendGiftingInquiryCustomerConfirmation
} from '../utils/email.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../public/images');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;

const DEFAULT_BANNER = {
  id: 1,
  eyebrow: 'BESPOKE GIFTING & BULK ORDERS',
  heading: 'Curate Your Custom Gift Hamper',
  subheading: 'Celebrate Diwali, weddings, and corporate milestones with handcrafted luxury hampers tailored to your taste.',
  button_text: 'Request Custom Quote →',
  bg_image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop',
  overlay_opacity: 0.65,
  is_active: 1
};

// -------------------------------------------------------------
// 1. GET /api/gifting-banner
// Fetches active banner config & background image path for homepage
// -------------------------------------------------------------
router.get('/gifting-banner', async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      'SELECT id, eyebrow, heading, subheading, button_text, bg_image, overlay_opacity, is_active, updated_at FROM gifting_banner_config WHERE id = 1 LIMIT 1'
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        banner: DEFAULT_BANNER
      });
    }

    return res.status(200).json({
      success: true,
      banner: rows[0]
    });
  } catch (error) {
    console.error('Error fetching gifting banner config:', error);
    return res.status(200).json({
      success: true,
      banner: DEFAULT_BANNER,
      error: 'Using fallback config'
    });
  }
});

// -------------------------------------------------------------
// 2. PUT /api/admin/gifting-banner
// Admin updates banner text, overlay, is_active, and uploads festive image
// -------------------------------------------------------------
router.put('/admin/gifting-banner', authenticateToken, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const {
      eyebrow = 'BESPOKE GIFTING & BULK ORDERS',
      heading = 'Curate Your Custom Gift Hamper',
      subheading = 'Celebrate Diwali, weddings, and corporate milestones with handcrafted luxury hampers tailored to your taste.',
      button_text = 'Request Custom Quote →',
      overlay_opacity = 0.65,
      is_active = 1,
      bg_image: existingBgImage
    } = req.body;

    // Fetch existing banner config
    const [existingRows] = await dbPool.query('SELECT * FROM gifting_banner_config WHERE id = 1 LIMIT 1');
    const prevBanner = existingRows && existingRows[0] ? existingRows[0] : null;

    let finalBgImage = prevBanner ? prevBanner.bg_image : DEFAULT_BANNER.bg_image;

    // If new image was uploaded
    if (req.file) {
      finalBgImage = `/images/${req.file.filename}`;

      // Optional: Clean up old local image file if it was uploaded to /images/
      if (
        prevBanner &&
        prevBanner.bg_image &&
        prevBanner.bg_image.startsWith('/images/') &&
        !prevBanner.bg_image.includes('Hero Banner')
      ) {
        try {
          const oldFilename = path.basename(prevBanner.bg_image);
          const oldFilePath = path.join(uploadsDir, oldFilename);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (cleanupErr) {
          console.warn('Could not clean up old banner image:', cleanupErr.message);
        }
      }
    } else if (existingBgImage && typeof existingBgImage === 'string') {
      finalBgImage = existingBgImage.trim();
    }

    const numericOpacity = Math.max(0, Math.min(1, parseFloat(overlay_opacity) || 0.65));
    const activeState = (is_active === '0' || is_active === 0 || is_active === false) ? 0 : 1;

    if (prevBanner) {
      await dbPool.query(
        `UPDATE gifting_banner_config 
         SET eyebrow = ?, heading = ?, subheading = ?, button_text = ?, bg_image = ?, overlay_opacity = ?, is_active = ?
         WHERE id = 1`,
        [
          eyebrow.trim(),
          heading.trim(),
          subheading.trim(),
          button_text.trim(),
          finalBgImage,
          numericOpacity,
          activeState
        ]
      );
    } else {
      await dbPool.query(
        `INSERT INTO gifting_banner_config 
         (id, eyebrow, heading, subheading, button_text, bg_image, overlay_opacity, is_active)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eyebrow.trim(),
          heading.trim(),
          subheading.trim(),
          button_text.trim(),
          finalBgImage,
          numericOpacity,
          activeState
        ]
      );
    }

    const [updatedRows] = await dbPool.query('SELECT * FROM gifting_banner_config WHERE id = 1 LIMIT 1');

    return res.status(200).json({
      success: true,
      message: 'Festive gifting banner updated successfully',
      banner: updatedRows[0]
    });
  } catch (error) {
    console.error('Error updating gifting banner config:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update festive banner settings'
    });
  }
});

// -------------------------------------------------------------
// 3. POST /api/gifting-inquiries
// Customer inquiry submission with validation & notifications
// -------------------------------------------------------------
router.post('/gifting-inquiries', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city_pincode,
      message,
      agreed_to_terms
    } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name (at least 2 characters).'
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim().replace(/\s+/g, '')) || phone.replace(/\D/g, '').length < 7) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number with at least 8-10 digits.'
      });
    }

    if (!city_pincode || typeof city_pincode !== 'string' || city_pincode.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your delivery city or pincode.'
      });
    }

    if (agreed_to_terms !== true && agreed_to_terms !== 'true' && agreed_to_terms !== 1 && agreed_to_terms !== '1') {
      return res.status(400).json({
        success: false,
        message: 'Please agree to the Terms & Conditions and Privacy Policy.'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedCity = city_pincode.trim();
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    // Insert into database with safe column compatibility
    let result;
    try {
      // First attempt with modern schema (message, agreed_to_terms)
      const [insertRes] = await dbPool.execute(
        `INSERT INTO custom_gifting_inquiries 
         (name, email, phone, city_pincode, message, agreed_to_terms, status)
         VALUES (?, ?, ?, ?, ?, 1, 'New')`,
        [trimmedName, trimmedEmail, trimmedPhone, trimmedCity, trimmedMessage]
      );
      result = insertRes;
    } catch (insertErr) {
      // If table has legacy columns, fall back gracefully
      console.warn('Falling back to legacy insert query for custom_gifting_inquiries:', insertErr.message);
      const [fallbackRes] = await dbPool.execute(
        `INSERT INTO custom_gifting_inquiries 
         (name, email, phone, city_pincode, whatsapp_opt_in, delivery_timeline, gifting_type, notes, status)
         VALUES (?, ?, ?, ?, 1, 'Custom Quote', 'Bespoke Inquiry', ?, 'New')`,
        [trimmedName, trimmedEmail, trimmedPhone, trimmedCity, trimmedMessage || null]
      );
      result = fallbackRes;
    }

    const inquiryData = {
      id: result.insertId,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      city_pincode: trimmedCity,
      message: trimmedMessage,
      agreed_to_terms: true,
      createdAt: new Date()
    };

    // Send notifications asynchronously (failures will not break inquiry response)
    Promise.allSettled([
      sendGiftingInquiryAdminNotification(inquiryData),
      sendGiftingInquiryCustomerConfirmation(inquiryData)
    ]).catch((err) => {
      console.warn('Notification email error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your custom hamper inquiry has been submitted. Our concierge team will reach out to you shortly.',
      inquiryId: result.insertId,
      inquiry: inquiryData
    });
  } catch (error) {
    console.error('Error submitting gifting inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit your inquiry. Please try again or reach out directly.'
    });
  }
});

// -------------------------------------------------------------
// 4. GET /api/admin/gifting-inquiries
// Admin lists all hamper inquiries with optional search & filter
// -------------------------------------------------------------
router.get('/admin/gifting-inquiries', authenticateToken, async (req, res) => {
  try {
    const { search, status, gifting_type } = req.query;

    let query = 'SELECT * FROM custom_gifting_inquiries WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR city_pincode LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (gifting_type && gifting_type !== 'All') {
      query += ' AND gifting_type = ?';
      params.push(gifting_type);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await dbPool.query(query, params);

    return res.status(200).json({
      success: true,
      inquiries: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching gifting inquiries for admin:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch inquiries'
    });
  }
});

// -------------------------------------------------------------
// 5. PATCH /api/admin/gifting-inquiries/:id/status
// Update status of an inquiry (New, Contacted, Proposal Sent, Converted, Closed)
// -------------------------------------------------------------
router.patch('/admin/gifting-inquiries/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    if (notes !== undefined) {
      await dbPool.query(
        'UPDATE custom_gifting_inquiries SET status = ?, notes = ? WHERE id = ?',
        [status, notes, id]
      );
    } else {
      await dbPool.query(
        'UPDATE custom_gifting_inquiries SET status = ? WHERE id = ?',
        [status, id]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully'
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status'
    });
  }
});

// -------------------------------------------------------------
// 6. DELETE /api/admin/gifting-inquiries/:id
// Delete an inquiry
// -------------------------------------------------------------
router.delete('/admin/gifting-inquiries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await dbPool.query('DELETE FROM custom_gifting_inquiries WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete inquiry'
    });
  }
});

export default router;


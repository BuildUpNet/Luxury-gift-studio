import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Auto-seed helper to guarantee initial luxury reviews exist
async function ensureTestimonialsTable() {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id int unsigned NOT NULL AUTO_INCREMENT,
        customer_name varchar(150) NOT NULL,
        avatar_url varchar(255) DEFAULT NULL,
        product_image_url varchar(255) DEFAULT NULL,
        rating decimal(2,1) NOT NULL DEFAULT '5.0',
        review_text text NOT NULL,
        occasion varchar(100) DEFAULT NULL,
        city varchar(100) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_rating (rating),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error('Failed to ensure testimonials table:', err.message);
  }
}
ensureTestimonialsTable();

// -------------------------------------------------------------
// 1. GET /api/testimonials (Public - List all testimonials)
// -------------------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const { limit, minRating, featured } = req.query;

    const [settingsRows] = await dbPool.query('SELECT * FROM testimonial_settings WHERE id = 1 LIMIT 1');
    const homeSliderLimit = settingsRows[0]?.home_slider_limit || 10;

    let query = 'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, company_name, designation, is_featured, sort_order, created_at FROM testimonials';
    const conditions = [];
    const params = [];

    if (featured === '1' || featured === 'true') {
      conditions.push('is_featured = 1');
    }

    if (minRating) {
      conditions.push('rating >= ?');
      params.push(Number(minRating));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (featured === '1' || featured === 'true') {
      query += ' ORDER BY sort_order ASC, created_at DESC, id DESC';
    } else {
      query += ' ORDER BY sort_order ASC, created_at DESC, id DESC';
    }

    let effectiveLimit = null;
    if (limit && !isNaN(Number(limit))) {
      effectiveLimit = Number(limit);
    } else if (featured === '1' || featured === 'true') {
      effectiveLimit = homeSliderLimit;
    }

    if (effectiveLimit) {
      query += ' LIMIT ?';
      params.push(effectiveLimit);
    }

    const [rows] = await dbPool.query(query, params);
    const [countRows] = await dbPool.query('SELECT COUNT(*) as total FROM testimonials');

    return res.status(200).json({
      success: true,
      home_slider_limit: homeSliderLimit,
      total_count: countRows[0]?.total || 0,
      testimonials: rows.map(r => ({
        ...r,
        rating: Number(r.rating)
      }))
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 1b. GET & PUT /api/testimonials/settings/all
// -------------------------------------------------------------
router.get('/settings/all', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM testimonial_settings WHERE id = 1 LIMIT 1');
    res.json({
      success: true,
      settings: rows[0] || { id: 1, home_slider_limit: 10 }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

router.put('/settings/all', authenticateToken, async (req, res) => {
  try {
    const { home_slider_limit } = req.body;
    const limitVal = Math.max(1, Number(home_slider_limit) || 10);
    await dbPool.query(
      `INSERT INTO testimonial_settings (id, home_slider_limit)
       VALUES (1, ?)
       ON DUPLICATE KEY UPDATE home_slider_limit = VALUES(home_slider_limit)`,
      [limitVal]
    );
    res.json({
      success: true,
      message: 'Testimonial settings updated',
      home_slider_limit: limitVal
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// -------------------------------------------------------------
// 2. GET /api/testimonials/:id (Public - Single testimonial)
// -------------------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await dbPool.query(
      'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, created_at FROM testimonials WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const item = rows[0];
    item.rating = Number(item.rating);

    return res.status(200).json({
      success: true,
      testimonial: item
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 3. POST /api/testimonials (Protected - Admin create review)
// -------------------------------------------------------------
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      customer_name,
      avatar_url,
      product_image_url,
      rating,
      review_text,
      occasion,
      city,
      company_name,
      designation,
      is_featured,
      sort_order
    } = req.body;

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    if (!review_text || !review_text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review text is required'
      });
    }

    const numRating = rating !== undefined && rating !== null ? Math.min(5, Math.max(1, Number(rating))) : 5.0;
    const featuredVal = is_featured !== undefined ? (Number(is_featured) ? 1 : 0) : 1;
    const sortVal = sort_order !== undefined ? Number(sort_order) : 0;

    const [result] = await dbPool.query(
      `INSERT INTO testimonials (customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, company_name, designation, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name.trim(),
        avatar_url ? avatar_url.trim() : null,
        product_image_url ? product_image_url.trim() : null,
        numRating,
        review_text.trim(),
        occasion ? occasion.trim() : null,
        city ? city.trim() : null,
        company_name ? company_name.trim() : null,
        designation ? designation.trim() : null,
        featuredVal,
        sortVal
      ]
    );

    const [createdRows] = await dbPool.query(
      'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, company_name, designation, is_featured, sort_order, created_at FROM testimonials WHERE id = ?',
      [result.insertId]
    );

    const created = createdRows[0];
    created.rating = Number(created.rating);

    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial: created
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 4. PUT /api/testimonials/:id (Protected - Admin update review)
// -------------------------------------------------------------
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      avatar_url,
      product_image_url,
      rating,
      review_text,
      occasion,
      city,
      company_name,
      designation,
      is_featured,
      sort_order
    } = req.body;

    const [existingRows] = await dbPool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const existing = existingRows[0];

    if (customer_name !== undefined && !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name cannot be empty'
      });
    }

    if (review_text !== undefined && !review_text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review text cannot be empty'
      });
    }

    const numRating = rating !== undefined && rating !== null ? Math.min(5, Math.max(1, Number(rating))) : Number(existing.rating);
    const featuredVal = is_featured !== undefined ? (Number(is_featured) ? 1 : 0) : existing.is_featured;
    const sortVal = sort_order !== undefined ? Number(sort_order) : existing.sort_order;

    await dbPool.query(
      `UPDATE testimonials
       SET customer_name = ?,
           avatar_url = ?,
           product_image_url = ?,
           rating = ?,
           review_text = ?,
           occasion = ?,
           city = ?,
           company_name = ?,
           designation = ?,
           is_featured = ?,
           sort_order = ?
       WHERE id = ?`,
      [
        customer_name !== undefined ? customer_name.trim() : existing.customer_name,
        avatar_url !== undefined ? (avatar_url ? avatar_url.trim() : null) : existing.avatar_url,
        product_image_url !== undefined ? (product_image_url ? product_image_url.trim() : null) : existing.product_image_url,
        numRating,
        review_text !== undefined ? review_text.trim() : existing.review_text,
        occasion !== undefined ? (occasion ? occasion.trim() : null) : existing.occasion,
        city !== undefined ? (city ? city.trim() : null) : existing.city,
        company_name !== undefined ? (company_name ? company_name.trim() : null) : existing.company_name,
        designation !== undefined ? (designation ? designation.trim() : null) : existing.designation,
        featuredVal,
        sortVal,
        id
      ]
    );

    const [updatedRows] = await dbPool.query(
      'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, company_name, designation, is_featured, sort_order, created_at FROM testimonials WHERE id = ?',
      [id]
    );

    const updated = updatedRows[0];
    updated.rating = Number(updated.rating);

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updated
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 5. DELETE /api/testimonials/:id (Protected - Admin delete review)
// -------------------------------------------------------------
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existingRows] = await dbPool.query('SELECT id FROM testimonials WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await dbPool.query('DELETE FROM testimonials WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      id: Number(id)
    });
  } catch (err) {
    next(err);
  }
});

export default router;

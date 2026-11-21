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
    const { limit, minRating } = req.query;
    let query = 'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, created_at FROM testimonials';
    const params = [];

    if (minRating) {
      query += ' WHERE rating >= ?';
      params.push(Number(minRating));
    }

    query += ' ORDER BY created_at DESC, id DESC';

    if (limit && !isNaN(Number(limit))) {
      query += ' LIMIT ?';
      params.push(Number(limit));
    }

    const [rows] = await dbPool.query(query, params);

    return res.status(200).json({
      success: true,
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
      city
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

    const [result] = await dbPool.query(
      `INSERT INTO testimonials (customer_name, avatar_url, product_image_url, rating, review_text, occasion, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name.trim(),
        avatar_url ? avatar_url.trim() : null,
        product_image_url ? product_image_url.trim() : null,
        numRating,
        review_text.trim(),
        occasion ? occasion.trim() : null,
        city ? city.trim() : null
      ]
    );

    const [createdRows] = await dbPool.query(
      'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, created_at FROM testimonials WHERE id = ?',
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
      city
    } = req.body;

    const [existingRows] = await dbPool.query('SELECT id FROM testimonials WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

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

    await dbPool.query(
      `UPDATE testimonials
       SET customer_name = ?,
           avatar_url = ?,
           product_image_url = ?,
           rating = ?,
           review_text = ?,
           occasion = ?,
           city = ?
       WHERE id = ?`,
      [
        customer_name.trim(),
        avatar_url ? avatar_url.trim() : null,
        product_image_url ? product_image_url.trim() : null,
        numRating,
        review_text.trim(),
        occasion ? occasion.trim() : null,
        city ? city.trim() : null,
        id
      ]
    );

    const [updatedRows] = await dbPool.query(
      'SELECT id, customer_name, avatar_url, product_image_url, rating, review_text, occasion, city, created_at FROM testimonials WHERE id = ?',
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

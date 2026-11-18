import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from '../middlewares/auth.js';
import { uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Auto-seed default hero slides if table empty
async function ensureHeroSlides() {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id int unsigned NOT NULL AUTO_INCREMENT,
        image_url varchar(255) NOT NULL,
        tag_text varchar(150) DEFAULT NULL,
        heading varchar(255) NOT NULL,
        subtext text DEFAULT NULL,
        button_text varchar(100) DEFAULT 'GIFT NOW',
        button_link varchar(255) DEFAULT '#shop-now',
        sort_order int NOT NULL DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_sort_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [rows] = await dbPool.query('SELECT COUNT(*) as count FROM hero_slides');
    if (rows[0].count === 0) {
      const defaultSlides = [
        ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop', 'THE ART OF LUXURY GIFTING', 'Curated Hampers For Every Celebration', 'Discover exquisite gift hampers crafted with artisanal treats, fine confectionery, and memorable keepsakes.', 'GIFT NOW', '#shop-now', 1],
        ['https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop', 'CELEBRATE SPECIAL MILESTONES', 'Thoughtful Presents, Unforgettable Smiles', 'Handcrafted with warmth and presented in signature designer packaging delivered directly to their doorstep.', 'UNWRAP JOY', '#shop-now', 2],
        ['https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop', 'CORPORATE & BESPOKE GIFTING', 'Elevate Business Relationships with Signature Gifts', 'Custom-branded boxes, premium gourmet selections, and seamless multi-address Pan-India shipping.', 'BUILD YOUR HAMPER', '#build-hamper-section', 3]
      ];
      for (const s of defaultSlides) {
        await dbPool.query(
          'INSERT INTO hero_slides (image_url, tag_text, heading, subtext, button_text, button_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
          s
        );
      }
    }
  } catch (err) {
    console.error('Failed to ensure hero_slides:', err.message);
  }
}
ensureHeroSlides();

// -------------------------------------------------------------
// 1. GET /api/hero-slides (Public - List all slides ordered by sort_order)
// -------------------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await dbPool.query(
      'SELECT id, image_url, tag_text, heading, subtext, button_text, button_link, sort_order, created_at, updated_at FROM hero_slides ORDER BY sort_order ASC, id ASC'
    );

    return res.status(200).json({
      success: true,
      slides: rows.map(r => ({ ...r, sort_order: Number(r.sort_order) }))
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 2. GET /api/hero-slides/:id (Public - Single slide)
// -------------------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await dbPool.query(
      'SELECT id, image_url, tag_text, heading, subtext, button_text, button_link, sort_order, created_at, updated_at FROM hero_slides WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    const slide = rows[0];
    slide.sort_order = Number(slide.sort_order);

    return res.status(200).json({
      success: true,
      slide
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 3. POST /api/hero-slides (Protected - Create new slide)
// -------------------------------------------------------------
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      image_url,
      tag_text,
      heading,
      subtext,
      button_text,
      button_link,
      sort_order
    } = req.body;

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ success: false, message: 'Slide image URL or uploaded file is required' });
    }

    if (!heading || !heading.trim()) {
      return res.status(400).json({ success: false, message: 'Heading is required' });
    }

    let resolvedSortOrder = sort_order !== undefined && sort_order !== null && !isNaN(Number(sort_order))
      ? Number(sort_order)
      : null;

    if (resolvedSortOrder === null) {
      const [[maxRow]] = await dbPool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM hero_slides');
      resolvedSortOrder = maxRow?.nextOrder || 1;
    }

    const [result] = await dbPool.query(
      `INSERT INTO hero_slides (image_url, tag_text, heading, subtext, button_text, button_link, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        image_url.trim(),
        tag_text ? tag_text.trim() : null,
        heading.trim(),
        subtext ? subtext.trim() : null,
        button_text ? button_text.trim() : 'GIFT NOW',
        button_link ? button_link.trim() : '#shop-now',
        resolvedSortOrder
      ]
    );

    const [createdRows] = await dbPool.query('SELECT * FROM hero_slides WHERE id = ?', [result.insertId]);
    const created = createdRows[0];
    created.sort_order = Number(created.sort_order);

    return res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      slide: created
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 4. PUT /api/hero-slides/:id (Protected - Update slide)
// -------------------------------------------------------------
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      image_url,
      tag_text,
      heading,
      subtext,
      button_text,
      button_link,
      sort_order
    } = req.body;

    const [existing] = await dbPool.query('SELECT id FROM hero_slides WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ success: false, message: 'Slide image URL is required' });
    }

    if (!heading || !heading.trim()) {
      return res.status(400).json({ success: false, message: 'Heading is required' });
    }

    const order = sort_order !== undefined && !isNaN(Number(sort_order)) ? Number(sort_order) : 0;

    await dbPool.query(
      `UPDATE hero_slides
       SET image_url = ?,
           tag_text = ?,
           heading = ?,
           subtext = ?,
           button_text = ?,
           button_link = ?,
           sort_order = ?
       WHERE id = ?`,
      [
        image_url.trim(),
        tag_text ? tag_text.trim() : null,
        heading.trim(),
        subtext ? subtext.trim() : null,
        button_text ? button_text.trim() : 'GIFT NOW',
        button_link ? button_link.trim() : '#shop-now',
        order,
        id
      ]
    );

    const [updatedRows] = await dbPool.query('SELECT * FROM hero_slides WHERE id = ?', [id]);
    const updated = updatedRows[0];
    updated.sort_order = Number(updated.sort_order);

    return res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      slide: updated
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 5. POST /api/hero-slides/reorder (Protected - Reorder all slides)
// -------------------------------------------------------------
router.post('/reorder', authenticateToken, async (req, res, next) => {
  try {
    const { order } = req.body; // e.g. [{ id: 1, sort_order: 1 }, { id: 2, sort_order: 2 }]
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Order array is required' });
    }

    for (const item of order) {
      if (item?.id !== undefined && item?.sort_order !== undefined) {
        await dbPool.query('UPDATE hero_slides SET sort_order = ? WHERE id = ?', [
          Number(item.sort_order),
          item.id
        ]);
      }
    }

    const [rows] = await dbPool.query('SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC');

    return res.status(200).json({
      success: true,
      message: 'Hero slides reordered successfully',
      slides: rows.map(r => ({ ...r, sort_order: Number(r.sort_order) }))
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 6. DELETE /api/hero-slides/:id (Protected - Delete slide)
// -------------------------------------------------------------
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await dbPool.query('SELECT id FROM hero_slides WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }

    await dbPool.query('DELETE FROM hero_slides WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully',
      id: Number(id)
    });
  } catch (err) {
    next(err);
  }
});

export default router;

import express from 'express';
import dbPool, { executeWithRetry } from '../config/db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Helper to generate URL-safe slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * GET /api/occasions
 * Fetch all occasions with their assigned products count
 */
router.get('/', async (req, res) => {
  try {
    const [occasions] = await executeWithRetry(`
      SELECT o.*,
             COUNT(DISTINCT po.product_id) AS products_count
      FROM occasions o
      LEFT JOIN product_occasions po ON o.id = po.occasion_id
      GROUP BY o.id
      ORDER BY o.sort_order ASC, o.name ASC
    `);

    return res.json({
      success: true,
      occasions: occasions.map((o) => ({
        ...o,
        products_count: Number(o.products_count) || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching occasions:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch occasions'
    });
  }
});

/**
 * GET /api/occasions/:idOrSlug
 * Fetch a single occasion by ID or slug, along with assigned products
 */
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  const isNumeric = /^\d+$/.test(idOrSlug);

  try {
    const [rows] = await executeWithRetry(
      `SELECT * FROM occasions WHERE ${isNumeric ? 'id = ?' : 'slug = ?'} LIMIT 1`,
      [idOrSlug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Occasion not found'
      });
    }

    const occasion = rows[0];

    // Fetch assigned products
    const [products] = await executeWithRetry(
      `SELECT p.*
       FROM products p
       INNER JOIN product_occasions po ON p.id = po.product_id
       WHERE po.occasion_id = ?
       ORDER BY p.id DESC`,
      [occasion.id]
    );

    return res.json({
      success: true,
      occasion,
      products
    });
  } catch (error) {
    console.error('Error fetching occasion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch occasion'
    });
  }
});

/**
 * POST /api/occasions
 * Create a new occasion (Protected)
 */
router.post('/', authenticateToken, async (req, res) => {
  const { name, slug, image_url, description, product_ids, sort_order } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Occasion name is required'
    });
  }

  const cleanName = name.trim();
  const cleanSlug = (slug && slug.trim()) ? slugify(slug) : slugify(cleanName);

  try {
    // Check uniqueness
    const [existing] = await executeWithRetry(
      'SELECT id FROM occasions WHERE LOWER(name) = ? OR slug = ? LIMIT 1',
      [cleanName.toLowerCase(), cleanSlug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An occasion with this name or slug already exists'
      });
    }

    const [result] = await executeWithRetry(
      'INSERT INTO occasions (name, slug, image_url, description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanSlug, image_url || null, description || null, Number(sort_order) || 0]
    );

    const occasionId = result.insertId;

    // Assign products if provided
    if (Array.isArray(product_ids) && product_ids.length > 0) {
      for (const prodId of product_ids) {
        await executeWithRetry(
          'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
          [prodId, occasionId]
        );
      }
    }

    const [createdRows] = await executeWithRetry(
      'SELECT * FROM occasions WHERE id = ?',
      [occasionId]
    );

    return res.status(201).json({
      success: true,
      message: 'Occasion created successfully',
      occasion: createdRows[0]
    });
  } catch (error) {
    console.error('Error creating occasion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create occasion'
    });
  }
});

/**
 * PUT /api/occasions/:id
 * Update an occasion & its product assignments (Protected)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, slug, image_url, description, product_ids, sort_order } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Occasion name is required'
    });
  }

  const cleanName = name.trim();
  const cleanSlug = (slug && slug.trim()) ? slugify(slug) : slugify(cleanName);

  try {
    // Verify occasion exists
    const [existing] = await executeWithRetry('SELECT id FROM occasions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Occasion not found'
      });
    }

    // Check uniqueness excluding self
    const [duplicate] = await executeWithRetry(
      'SELECT id FROM occasions WHERE (LOWER(name) = ? OR slug = ?) AND id != ? LIMIT 1',
      [cleanName.toLowerCase(), cleanSlug, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Another occasion with this name or slug already exists'
      });
    }

    const sortClause = sort_order !== undefined ? `, sort_order = ${Number(sort_order)}` : '';
    await executeWithRetry(
      `UPDATE occasions SET name = ?, slug = ?, image_url = ?, description = ?${sortClause} WHERE id = ?`,
      [cleanName, cleanSlug, image_url || null, description || null, id]
    );

    // Sync product assignments if provided
    if (Array.isArray(product_ids)) {
      // Clear existing junction links
      await executeWithRetry('DELETE FROM product_occasions WHERE occasion_id = ?', [id]);

      // Re-insert assigned products
      for (const prodId of product_ids) {
        await executeWithRetry(
          'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
          [prodId, id]
        );
      }
    }

    const [updatedRows] = await executeWithRetry('SELECT * FROM occasions WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Occasion updated successfully',
      occasion: updatedRows[0]
    });
  } catch (error) {
    console.error('Error updating occasion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update occasion'
    });
  }
});

/**
 * POST /api/occasions/:id/assign-products
 * Quick assign / unassign products for an occasion (Protected)
 */
router.post('/:id/assign-products', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { product_ids } = req.body;

  if (!Array.isArray(product_ids)) {
    return res.status(400).json({
      success: false,
      message: 'product_ids must be an array of product IDs'
    });
  }

  try {
    const occasionId = Number(id);

    // Verify occasion exists
    const [occRows] = await executeWithRetry('SELECT id FROM occasions WHERE id = ? LIMIT 1', [occasionId]);
    if (occRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Occasion not found'
      });
    }

    // 1. Delete previous associations for this occasion
    await executeWithRetry('DELETE FROM product_occasions WHERE occasion_id = ?', [occasionId]);

    // 2. Insert new associations
    const cleanProductIds = product_ids
      .map((pid) => Number(pid))
      .filter((pid) => !isNaN(pid) && pid > 0);

    for (const prodId of cleanProductIds) {
      await executeWithRetry(
        'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
        [prodId, occasionId]
      );

      // Keep products.occasion_id in sync if not already set or updating
      try {
        await executeWithRetry(
          'UPDATE products SET occasion_id = ? WHERE id = ? AND (occasion_id IS NULL OR occasion_id = ?)',
          [occasionId, prodId, occasionId]
        );
      } catch (err) {}
    }

    // 3. Clear products.occasion_id for products that were unassigned from this occasion and had occasion_id = this occasion
    try {
      if (cleanProductIds.length > 0) {
        const placeholders = cleanProductIds.map(() => '?').join(',');
        await executeWithRetry(
          `UPDATE products SET occasion_id = NULL WHERE occasion_id = ? AND id NOT IN (${placeholders})`,
          [occasionId, ...cleanProductIds]
        );
      } else {
        await executeWithRetry(
          'UPDATE products SET occasion_id = NULL WHERE occasion_id = ?',
          [occasionId]
        );
      }
    } catch (err) {}

    // Return the updated count
    const [countRows] = await executeWithRetry(
      'SELECT COUNT(DISTINCT product_id) as count FROM product_occasions WHERE occasion_id = ?',
      [occasionId]
    );
    const updatedCount = Number(countRows[0]?.count) || 0;

    return res.json({
      success: true,
      message: `Assigned ${cleanProductIds.length} product(s) to occasion successfully`,
      count: updatedCount
    });
  } catch (error) {
    console.error('Error assigning products to occasion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to assign products'
    });
  }
});

/**
 * DELETE /api/occasions/:id
 * Delete an occasion (Protected)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await executeWithRetry('SELECT id FROM occasions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Occasion not found'
      });
    }

    await executeWithRetry('DELETE FROM occasions WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Occasion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting occasion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete occasion'
    });
  }
});

/**
 * POST /api/occasions/reorder
 * Reorder occasions batch update (Protected)
 */
router.post('/reorder', authenticateToken, async (req, res) => {
  const { order } = req.body; // array of { id, sort_order }
  if (!Array.isArray(order)) {
    return res.status(400).json({ success: false, message: 'Order array is required' });
  }

  try {
    for (const item of order) {
      if (item?.id !== undefined && item?.sort_order !== undefined) {
        await executeWithRetry('UPDATE occasions SET sort_order = ? WHERE id = ?', [
          Number(item.sort_order),
          item.id
        ]);
      }
    }

    const [occasions] = await executeWithRetry(`
      SELECT o.*,
             COUNT(DISTINCT po.product_id) AS products_count
      FROM occasions o
      LEFT JOIN product_occasions po ON o.id = po.occasion_id
      GROUP BY o.id
      ORDER BY o.sort_order ASC, o.name ASC
    `);

    return res.json({
      success: true,
      message: 'Occasions reordered successfully',
      occasions: occasions.map((o) => ({
        ...o,
        products_count: Number(o.products_count) || 0
      }))
    });
  } catch (err) {
    console.error('Error reordering occasions:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder occasions' });
  }
});

export default router;

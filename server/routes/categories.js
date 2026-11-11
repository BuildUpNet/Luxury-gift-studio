import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from './auth.js';
import slugify from 'slugify';

const router = express.Router();

// ── GET /api/categories ─────────────────────────────────────────────────────
// Get all categories with product count
router.get('/', async (req, res) => {
  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Get categories with product count
    const [categories] = await dbPool.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/categories/:slug ───────────────────────────────────────────────
// Get single category by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const [categories] = await dbPool.execute(
      'SELECT * FROM categories WHERE slug = ? LIMIT 1',
      [slug]
    );

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      category: categories[0]
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── POST /api/categories ────────────────────────────────────────────────────
// Create a new category (admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Generate slug from name
    const slug = slugify(name.trim(), {
      lower: true,
      strict: true,
      replacement: '-'
    });

    // Check for duplicate name or slug
    const [existing] = await dbPool.execute(
      'SELECT id FROM categories WHERE name = ? OR slug = ? LIMIT 1',
      [name.trim(), slug]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A category with this name or slug already exists.'
      });
    }

    // Insert new category
    const [result] = await dbPool.execute(
      'INSERT INTO categories (name, slug) VALUES (?, ?)',
      [name.trim(), slug]
    );

    // Get the newly created category
    const [newCategory] = await dbPool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A category with this name or slug already exists.'
      });
    }
    
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── PUT /api/categories/:id ─────────────────────────────────────────────────
// Update a category (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Check if category exists
    const [existingCategory] = await dbPool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Generate new slug from name
    const newSlug = slugify(name.trim(), {
      lower: true,
      strict: true,
      replacement: '-'
    });

    // Check for duplicate name or slug (excluding current category)
    const [duplicate] = await dbPool.execute(
      'SELECT id FROM categories WHERE (name = ? OR slug = ?) AND id != ? LIMIT 1',
      [name.trim(), newSlug, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Another category with this name or slug already exists.'
      });
    }

    // Update category
    await dbPool.execute(
      'UPDATE categories SET name = ?, slug = ?, updated_at = NOW() WHERE id = ?',
      [name.trim(), newSlug, id]
    );

    // Get updated category
    const [updatedCategory] = await dbPool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Another category with this name or slug already exists.'
      });
    }
    
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── DELETE /api/categories/:id ──────────────────────────────────────────────
// Delete a category (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Check if category exists
    const [existingCategory] = await dbPool.execute(
      'SELECT id, name FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check if category has products
    const [products] = await dbPool.execute(
      'SELECT COUNT(*) as product_count FROM products WHERE category_id = ?',
      [id]
    );

    if (products[0].product_count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${existingCategory[0].name}" because it has ${products[0].product_count} product(s) assigned to it. Please reassign or delete those products first.`
      });
    }

    // Delete category
    const [result] = await dbPool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/categories/:id/products ────────────────────────────────────────
// Get products for a specific category
router.get('/:id/products', async (req, res) => {
  const { id } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const [products] = await dbPool.execute(
      'SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get category products error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from './auth.js';
import slugify from 'slugify';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dedicated categories upload directory under public/uploads/categories
const categoriesUploadDir = path.join(__dirname, '../../public/uploads/categories');
if (!fs.existsSync(categoriesUploadDir)) {
  fs.mkdirSync(categoriesUploadDir, { recursive: true });
}

// Multer storage for category images
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoriesUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `cat-${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter: strict allow only jpg, jpeg, png, webp
const categoryFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    return cb(null, true);
  }
  return cb(new Error('Only JPG, JPEG, PNG, and WebP images are allowed (max 2MB).'), false);
};

const categoryUpload = multer({
  storage: categoryStorage,
  fileFilter: categoryFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  }
});

// Helper to safely delete an old category image file from disk
const deleteCategoryImageFile = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  try {
    // Only delete if it belongs to uploads/categories
    if (imageUrl.includes('/uploads/categories/')) {
      const fileName = path.basename(imageUrl);
      const filePath = path.join(categoriesUploadDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Failed to delete category image file:', err.message);
  }
};

// ── POST /api/categories/upload-image ───────────────────────────────────────
// Upload a category thumbnail image (admin only)
router.post('/upload-image', authenticateToken, (req, res) => {
  categoryUpload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Image size exceeds the 2MB limit.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const relativeUrl = `/uploads/categories/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Category image uploaded successfully',
      imageUrl: relativeUrl,
      filename: req.file.filename
    });
  });
});

// ── GET /api/categories ─────────────────────────────────────────────────────
// Get all categories with product count, ordered so parents come before their children
router.get('/', async (req, res) => {
  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const [categories] = await dbPool.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY COALESCE(c.parent_id, c.id), c.parent_id IS NOT NULL, c.name ASC
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
  const {
    name,
    show_in_navbar = 1,
    parent_id = null,
    image_url = null,
    section_type = 'category'
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  // Validate section_type
  const resolvedSectionType = section_type === 'occasion' ? 'occasion' : 'category';

  // Normalise parent_id: treat 0, '', null as NULL
  const resolvedParentId = parent_id ? Number(parent_id) : null;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Validate parent exists and is itself a top-level category (no nested subcategories)
    if (resolvedParentId !== null) {
      const [[parent]] = await dbPool.execute(
        'SELECT id, parent_id FROM categories WHERE id = ? LIMIT 1',
        [resolvedParentId]
      );
      if (!parent) {
        return res.status(400).json({ success: false, message: 'Selected parent category does not exist.' });
      }
      if (parent.parent_id !== null) {
        return res.status(400).json({ success: false, message: 'Cannot create a subcategory of a subcategory.' });
      }
    }

    // Enforce max 10 navbar categories — only top-level categories count
    const navbarValue = resolvedParentId === null ? (Number(show_in_navbar) === 1 ? 1 : 0) : 0;
    if (navbarValue === 1) {
      const [[{ navCount }]] = await dbPool.execute(
        'SELECT COUNT(*) as navCount FROM categories WHERE show_in_navbar = 1 AND parent_id IS NULL'
      );
      if (navCount >= 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 categories can be shown in navbar.'
        });
      }
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
      'INSERT INTO categories (parent_id, name, slug, image_url, section_type, show_in_navbar) VALUES (?, ?, ?, ?, ?, ?)',
      [
        resolvedParentId,
        name.trim(),
        slug,
        image_url?.trim() || null,
        resolvedSectionType,
        navbarValue
      ]
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
  const {
    name,
    show_in_navbar,
    parent_id,
    image_url,
    section_type
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  // Normalise parent_id
  const resolvedParentId = parent_id ? Number(parent_id) : null;

  // Prevent a category from being its own parent
  if (resolvedParentId !== null && resolvedParentId === Number(id)) {
    return res.status(400).json({ success: false, message: 'A category cannot be its own parent.' });
  }

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Check if category exists and get current values
    const [existingRows] = await dbPool.execute(
      'SELECT id, show_in_navbar, parent_id, image_url, section_type FROM categories WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const existing = existingRows[0];

    // Validate new parent exists and is top-level
    if (resolvedParentId !== null) {
      const [[parent]] = await dbPool.execute(
        'SELECT id, parent_id FROM categories WHERE id = ? LIMIT 1',
        [resolvedParentId]
      );
      if (!parent) {
        return res.status(400).json({ success: false, message: 'Selected parent category does not exist.' });
      }
      if (parent.parent_id !== null) {
        return res.status(400).json({ success: false, message: 'Cannot nest a subcategory under another subcategory.' });
      }
    }

    // If being moved under a parent, it cannot be in the navbar (subcategories don't count toward limit)
    const newNavbarValue = resolvedParentId !== null
      ? 0
      : (show_in_navbar !== undefined ? (Number(show_in_navbar) === 1 ? 1 : 0) : existing.show_in_navbar);

    // Enforce max 10 navbar top-level categories when enabling a currently-disabled one
    if (newNavbarValue === 1 && existing.show_in_navbar === 0) {
      const [[{ navCount }]] = await dbPool.execute(
        'SELECT COUNT(*) as navCount FROM categories WHERE show_in_navbar = 1 AND parent_id IS NULL AND id != ?',
        [id]
      );
      if (navCount >= 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 categories can be shown in navbar.'
        });
      }
    }

    // Determine new image_url and clean up old image file if changed
    const resolvedImageUrl = image_url !== undefined ? (image_url?.trim() || null) : existing.image_url;
    if (existing.image_url && resolvedImageUrl !== existing.image_url) {
      deleteCategoryImageFile(existing.image_url);
    }

    // Section type
    const resolvedSectionType = section_type !== undefined
      ? (section_type === 'occasion' ? 'occasion' : 'category')
      : (existing.section_type || 'category');

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
      `UPDATE categories 
       SET parent_id = ?, name = ?, slug = ?, image_url = ?, section_type = ?, show_in_navbar = ?, updated_at = NOW() 
       WHERE id = ?`,
      [resolvedParentId, name.trim(), newSlug, resolvedImageUrl, resolvedSectionType, newNavbarValue, id]
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
      'SELECT id, name, image_url FROM categories WHERE id = ?',
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

    // Delete image file from disk if present
    if (existingCategory[0].image_url) {
      deleteCategoryImageFile(existingCategory[0].image_url);
    }

    // Delete category
    await dbPool.execute(
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

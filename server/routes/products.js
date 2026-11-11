import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// ── GET /api/products ─────────────────────────────────────────────────────
// Get all products with category details
router.get('/', async (req, res) => {
  try {
    const { category: categoryParam } = req.query;
    
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    let queryParams = [];

    // Filter by category if provided
    if (categoryParam) {
      // Check if categoryParam is numeric (ID) or string (slug)
      if (!isNaN(categoryParam)) {
        query = `
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.category_id = ?
          ORDER BY p.created_at DESC
        `;
        queryParams = [categoryParam];
      } else {
        query = `
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ?
          ORDER BY p.created_at DESC
        `;
        queryParams = [categoryParam];
      }
    }

    const [rows] = await dbPool.execute(query, queryParams);

    // Transform data to maintain backward compatibility
    const transformedProducts = rows.map(product => ({
      ...product,
      // Keep original category field for backward compatibility during transition
      category: product.category_name || product.category || 'Home Decor'
    }));

    res.json({
      success: true,
      products: transformedProducts
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/products
// Create a new product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /api/products called');
  console.log('Authenticated User:', req.user);
  
  const {
    title,
    category_id,
    category, // For backward compatibility during transition
    priceNum,
    originalPrice,
    stock,
    inStock,
    sameDayDelivery,
    image,
    description,
    rating,
    reviews,
    brand,
    discountBadge
  } = req.body;

  if (!title || !priceNum || !image) {
    console.log('Missing required fields:', { title: !!title, priceNum: !!priceNum, image: !!image });
    return res.status(400).json({ success: false, message: 'Title, price, and image are required.' });
  }

  try {
    if (!dbPool) {
      console.log('Database not connected');
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Determine category_id - prioritize category_id param, fall back to category name
    let finalCategoryId = null;
    if (category_id) {
      finalCategoryId = category_id;
    } else if (category) {
      // Look up category by name to get its ID
      const [categoryResult] = await dbPool.execute(
        'SELECT id FROM categories WHERE name = ? LIMIT 1',
        [category]
      );
      
      if (categoryResult.length > 0) {
        finalCategoryId = categoryResult[0].id;
      } else {
        // Default to Home Decor category
        const [defaultCategory] = await dbPool.execute(
          'SELECT id FROM categories WHERE slug = ? LIMIT 1',
          ['home-decor']
        );
        finalCategoryId = defaultCategory[0]?.id || null;
      }
    }

    // Check for duplicate product (same title, category_id, price)
    const [existing] = await dbPool.execute(
      'SELECT id FROM products WHERE title = ? AND category_id = ? AND priceNum = ? LIMIT 1',
      [title.trim(), finalCategoryId, priceNum]
    );

    if (existing.length > 0) {
      console.log('Duplicate product detected, returning existing ID:', existing[0].id);
      return res.json({
        success: true,
        message: 'Product already exists',
        productId: existing[0].id
      });
    }

    console.log('Inserting product into database...');
    const [result] = await dbPool.execute(
      `INSERT INTO products (title, category_id, category, priceNum, originalPrice, stock, inStock, sameDayDelivery, image, description, rating, reviews, brand, discountBadge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        finalCategoryId,
        category || 'Home Decor', // Keep for backward compatibility
        priceNum,
        originalPrice || null,
        stock || 10,
        inStock !== false ? 1 : 0,
        sameDayDelivery !== false ? 1 : 0,
        image.trim(),
        description?.trim() || '',
        rating || 4.8,
        reviews || 8,
        brand || 'THE GIFT STUDIO',
        discountBadge || ''
      ]
    );

    console.log('Product inserted successfully, ID:', result.insertId);
    res.json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    console.error('Full error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────────────────
// Update a product (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category_id,
    category, // For backward compatibility during transition
    priceNum,
    originalPrice,
    stock,
    inStock,
    sameDayDelivery,
    image,
    description,
    rating,
    reviews,
    brand,
    discountBadge
  } = req.body;

  if (!title || !priceNum || !image) {
    return res.status(400).json({ success: false, message: 'Title, price, and image are required.' });
  }

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Determine category_id - prioritize category_id param, fall back to category name
    let finalCategoryId = null;
    if (category_id) {
      finalCategoryId = category_id;
    } else if (category) {
      // Look up category by name to get its ID
      const [categoryResult] = await dbPool.execute(
        'SELECT id FROM categories WHERE name = ? LIMIT 1',
        [category]
      );
      
      if (categoryResult.length > 0) {
        finalCategoryId = categoryResult[0].id;
      } else {
        // Default to Home Decor category
        const [defaultCategory] = await dbPool.execute(
          'SELECT id FROM categories WHERE slug = ? LIMIT 1',
          ['home-decor']
        );
        finalCategoryId = defaultCategory[0]?.id || null;
      }
    }

    await dbPool.execute(
      `UPDATE products SET title = ?, category_id = ?, category = ?, priceNum = ?, originalPrice = ?, stock = ?, inStock = ?, sameDayDelivery = ?, image = ?, description = ?, rating = ?, reviews = ?, brand = ?, discountBadge = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        finalCategoryId,
        category || 'Home Decor', // Keep for backward compatibility
        priceNum,
        originalPrice || null,
        stock || 10,
        inStock !== false ? 1 : 0,
        sameDayDelivery !== false ? 1 : 0,
        image.trim(),
        description?.trim() || '',
        rating || 4.8,
        reviews || 8,
        brand || 'THE GIFT STUDIO',
        discountBadge || '',
        id
      ]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── DELETE /api/products/:id ──────────────────────────────────────────────
// Delete a product (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const [result] = await dbPool.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;

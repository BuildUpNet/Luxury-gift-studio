import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dbPool from '../config/db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../public/images');

// ── Database Schema Migration Helper ──────────────────────────────────────
async function ensureProductColumns() {
  if (!dbPool) return;
  try {
    const [cols] = await dbPool.execute('DESCRIBE products');
    const fieldNames = cols.map((c) => c.Field.toLowerCase());

    if (!fieldNames.includes('images')) {
      await dbPool.execute('ALTER TABLE products ADD COLUMN images LONGTEXT NULL AFTER image');
      console.log('Added missing "images" column to products table.');
    }
    if (!fieldNames.includes('slug')) {
      await dbPool.execute('ALTER TABLE products ADD COLUMN slug VARCHAR(255) NULL AFTER title');
      try {
        await dbPool.execute('CREATE INDEX idx_products_slug ON products (slug)');
      } catch (e) {
        // Index might already exist
      }
      console.log('Added missing "slug" column to products table.');
    }
    if (!fieldNames.includes('occasion_id')) {
      await dbPool.execute('ALTER TABLE products ADD COLUMN occasion_id INT UNSIGNED DEFAULT NULL AFTER category_id');
      try {
        await dbPool.execute('ALTER TABLE products ADD CONSTRAINT fk_products_occasion_id FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE SET NULL');
      } catch (e) {}
      console.log('Added missing "occasion_id" column to products table.');
    }

    // Ensure product_occasions table exists
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS product_occasions (
        product_id INT UNSIGNED NOT NULL,
        occasion_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (product_id, occasion_id),
        KEY fk_po_occasion (occasion_id),
        CONSTRAINT fk_po_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        CONSTRAINT fk_po_occasion FOREIGN KEY (occasion_id) REFERENCES occasions (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err) {
    console.error('Failed to ensure product columns/tables:', err.message);
  }
}
ensureProductColumns();

// ── Slugify & Helper Utilities ─────────────────────────────────────────────
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(title, currentId = null) {
  const baseSlug = slugify(title) || 'product';
  let slug = baseSlug;
  let counter = 1;

  while (counter <= 500) {
    let query = 'SELECT id FROM products WHERE slug = ?';
    let params = [slug];
    if (currentId) {
      query += ' AND id != ?';
      params.push(currentId);
    }
    const [existing] = await dbPool.execute(query, params);
    if (existing.length === 0) {
      return slug;
    }
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  // Fallback to high-entropy unique slug if 500 collisions occur
  return `${baseSlug}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

export function parseProductImages(productOrImages, fallbackCover = '') {
  let raw = productOrImages;
  let cover = typeof fallbackCover === 'string' ? fallbackCover.trim() : '';

  if (productOrImages && typeof productOrImages === 'object' && !Array.isArray(productOrImages)) {
    raw = productOrImages.images;
    if (typeof productOrImages.image === 'string' && productOrImages.image.trim()) {
      cover = productOrImages.image.trim();
    }
  }

  let list = [];

  if (raw) {
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) {
        try {
          let parsed = JSON.parse(trimmed);
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              parsed = [parsed];
            }
          }
          if (Array.isArray(parsed)) {
            list = parsed;
          } else if (typeof parsed === 'string' && parsed.trim()) {
            list = [parsed.trim()];
          }
        } catch {
          if (trimmed.includes(',')) {
            list = trimmed.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
          } else {
            list = [trimmed.replace(/^["']|["']$/g, '')];
          }
        }
      }
    }
  }

  // Filter valid string URLs
  list = list
    .filter((img) => img && typeof img === 'string')
    .map((img) => img.trim())
    .filter((img) => img.length > 0);

  // If cover image exists and is not at index 0, place it at index 0
  if (cover) {
    const existingIndex = list.indexOf(cover);
    if (existingIndex > 0) {
      list.splice(existingIndex, 1);
      list.unshift(cover);
    } else if (existingIndex === -1) {
      list.unshift(cover);
    }
  } else if (list.length === 0 && cover) {
    list = [cover];
  }

  // Deduplicate while preserving order and limit to 7 images (1 cover + 6 gallery)
  return Array.from(new Set(list)).slice(0, 7);
}

function getFilenameFromImageUrl(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') return null;
  try {
    let pathname = imgUrl;
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      const parsed = new URL(imgUrl);
      pathname = parsed.pathname;
    }
    if (pathname.includes('/images/')) {
      const filename = path.basename(pathname);
      if (filename && /^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return filename;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  return null;
}

async function safelyDeleteImageFile(filename, excludeProductId = null) {
  if (!filename || !dbPool) return;
  try {
    const searchPattern = `%${filename}%`;
    let query = 'SELECT id FROM products WHERE (image LIKE ? OR images LIKE ?)';
    let params = [searchPattern, searchPattern];
    if (excludeProductId) {
      query += ' AND id != ?';
      params.push(excludeProductId);
    }
    query += ' LIMIT 1';

    const [productRows] = await dbPool.execute(query, params);
    if (productRows.length > 0) return; // Still used by another product

    // Also verify categories and gifting banner
    const [catRows] = await dbPool.execute(
      'SELECT id FROM categories WHERE image_url LIKE ? LIMIT 1',
      [searchPattern]
    );
    if (catRows.length > 0) return;

    const [bannerRows] = await dbPool.execute(
      'SELECT id FROM gifting_banner_config WHERE bg_image LIKE ? LIMIT 1',
      [searchPattern]
    );
    if (bannerRows.length > 0) return;

    const filePath = path.join(uploadsDir, filename);
    const resolvedPath = path.resolve(filePath);
    // Strict path traversal protection
    if (!resolvedPath.startsWith(uploadsDir)) return;

    if (fs.existsSync(resolvedPath)) {
      await fs.promises.unlink(resolvedPath);
      console.log(`Safely unlinked orphaned product image: ${filename}`);
    }
  } catch (err) {
    console.error('Safe image cleanup error:', err.message);
  }
}

// ── GET /api/products ─────────────────────────────────────────────────────
// Get all products with category and occasion details (optional ?category=ID_OR_SLUG filter)
router.get('/', async (req, res) => {
  try {
    const { category: categoryParam, occasion: occasionParam } = req.query;

    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    let query = `
      SELECT p.*,
             c.name as category_name,
             c.slug as category_slug,
             o.name as occasion_name,
             o.slug as occasion_slug,
             GROUP_CONCAT(DISTINCT po.occasion_id) as occasion_ids,
             GROUP_CONCAT(DISTINCT occ.name SEPARATOR ', ') as occasion_names
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN occasions o ON p.occasion_id = o.id
      LEFT JOIN product_occasions po ON p.id = po.product_id
      LEFT JOIN occasions occ ON po.occasion_id = occ.id
    `;
    let queryParams = [];
    let whereClauses = [];

    // Filter by category if provided
    if (categoryParam) {
      if (!isNaN(categoryParam)) {
        whereClauses.push('p.category_id = ?');
        queryParams.push(categoryParam);
      } else {
        whereClauses.push('(c.slug = ? OR c.name = ?)');
        queryParams.push(categoryParam, categoryParam);
      }
    }

    // Filter by occasion if provided
    if (occasionParam) {
      if (!isNaN(occasionParam)) {
        whereClauses.push('(p.occasion_id = ? OR po.occasion_id = ?)');
        queryParams.push(occasionParam, occasionParam);
      } else {
        whereClauses.push('(o.slug = ? OR o.name = ? OR occ.slug = ? OR occ.name = ?)');
        queryParams.push(occasionParam, occasionParam, occasionParam, occasionParam);
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [rows] = await dbPool.execute(query, queryParams);

    // Transform data to ensure backward compatibility and clean formatting
    const transformedProducts = rows.map((product) => {
      const parsedImages = parseProductImages(product);
      const parsedOccasionIds = product.occasion_ids
        ? String(product.occasion_ids)
            .split(',')
            .map((id) => Number(id.trim()))
            .filter((id) => !isNaN(id) && id > 0)
        : (product.occasion_id ? [Number(product.occasion_id)] : []);

      return {
        ...product,
        category: product.category_name || product.category || 'Home Decor',
        occasion_id: product.occasion_id ? Number(product.occasion_id) : (parsedOccasionIds[0] || null),
        occasion_ids: parsedOccasionIds,
        images: parsedImages,
        image: parsedImages[0] || product.image || '',
        slug: product.slug || `product-${product.id}`
      };
    });

    res.json({
      success: true,
      products: transformedProducts
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/products/:idOrSlug ───────────────────────────────────────────
// Get single product by numeric ID or unique slug
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const isNumericId = /^\d+$/.test(idOrSlug);
    const query = `
      SELECT p.*,
             c.name as category_name,
             c.slug as category_slug,
             o.name as occasion_name,
             o.slug as occasion_slug,
             GROUP_CONCAT(DISTINCT po.occasion_id) as occasion_ids,
             GROUP_CONCAT(DISTINCT occ.name SEPARATOR ', ') as occasion_names
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN occasions o ON p.occasion_id = o.id
      LEFT JOIN product_occasions po ON p.id = po.product_id
      LEFT JOIN occasions occ ON po.occasion_id = occ.id
      WHERE ${isNumericId ? '(p.id = ? OR p.slug = ?)' : 'p.slug = ?'}
      GROUP BY p.id
      LIMIT 1
    `;
    const queryParams = isNumericId ? [Number(idOrSlug), idOrSlug] : [idOrSlug];

    const [rows] = await dbPool.execute(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const parsedImages = parseProductImages(rows[0]);
    const parsedOccasionIds = rows[0].occasion_ids
      ? String(rows[0].occasion_ids)
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id) && id > 0)
      : (rows[0].occasion_id ? [Number(rows[0].occasion_id)] : []);

    const product = {
      ...rows[0],
      category: rows[0].category_name || rows[0].category || 'Home Decor',
      occasion_id: rows[0].occasion_id ? Number(rows[0].occasion_id) : (parsedOccasionIds[0] || null),
      occasion_ids: parsedOccasionIds,
      images: parsedImages,
      image: parsedImages[0] || rows[0].image || '',
      slug: rows[0].slug || `product-${rows[0].id}`
    };

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product by ID or slug error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── POST /api/products ────────────────────────────────────────────────────
// Create a new product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  const {
    title,
    category_id,
    category,
    occasion_id,
    occasion_ids,
    priceNum,
    originalPrice,
    stock,
    inStock,
    sameDayDelivery,
    image,
    images: incomingImages,
    description,
    rating,
    reviews,
    brand,
    discountBadge
  } = req.body;

  // Process images array (1 to 7 images required, cover image first)
  const imagesArray = parseProductImages({ images: incomingImages, image });

  if (!title || !priceNum || imagesArray.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title, selling price, and at least one product image are required.'
    });
  }

  const primaryImage = imagesArray[0];
  const imagesJson = JSON.stringify(imagesArray);

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    // Determine category_id: prioritize category_id, fallback to category name; if neither is provided, allow NULL
    let finalCategoryId = null;
    let finalCategoryName = null;

    if (category_id !== undefined && category_id !== null && category_id !== '') {
      finalCategoryId = Number(category_id);
      const [catRow] = await dbPool.execute(
        'SELECT name FROM categories WHERE id = ? LIMIT 1',
        [finalCategoryId]
      );
      if (catRow.length > 0) {
        finalCategoryName = catRow[0].name;
      }
    } else if (category && typeof category === 'string' && category.trim()) {
      const [categoryResult] = await dbPool.execute(
        'SELECT id, name FROM categories WHERE name = ? LIMIT 1',
        [category.trim()]
      );

      if (categoryResult.length > 0) {
        finalCategoryId = categoryResult[0].id;
        finalCategoryName = categoryResult[0].name;
      } else {
        finalCategoryName = category.trim();
      }
    }

    // Normalize occasion assignments (supports single occasion_id or multiple occasion_ids array)
    let assignedOccasionIds = [];
    if (Array.isArray(occasion_ids)) {
      assignedOccasionIds = occasion_ids
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0);
    } else if (occasion_id !== undefined && occasion_id !== null && occasion_id !== '') {
      const numOcc = Number(occasion_id);
      if (!isNaN(numOcc) && numOcc > 0) {
        assignedOccasionIds = [numOcc];
      }
    }
    const primaryOccasionId = assignedOccasionIds.length > 0 ? assignedOccasionIds[0] : null;

    // Multiple products in the same category can share titles, prices, or MRP without artificial duplicate blocking
    let uniqueSlug = await generateUniqueSlug(req.body.slug || title.trim());
    const resolvedStock = stock !== undefined ? Math.max(0, parseInt(stock, 10)) : 10;
    const resolvedInStock = inStock !== undefined ? (inStock ? 1 : 0) : (resolvedStock > 0 ? 1 : 0);
    const resolvedSameDay = sameDayDelivery !== undefined ? (sameDayDelivery ? 1 : 0) : 1;

    let insertSuccess = false;
    let result = null;
    let attempts = 0;

    while (!insertSuccess && attempts < 3) {
      attempts += 1;
      try {
        [result] = await dbPool.execute(
          `INSERT INTO products (
            title,
            slug,
            category_id,
            category,
            occasion_id,
            priceNum,
            originalPrice,
            stock,
            inStock,
            sameDayDelivery,
            image,
            images,
            description,
            rating,
            reviews,
            brand,
            discountBadge
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title.trim(),
            uniqueSlug,
            finalCategoryId,
            finalCategoryName,
            primaryOccasionId,
            Number(priceNum),
            originalPrice ? Number(originalPrice) : null,
            resolvedStock,
            resolvedInStock,
            resolvedSameDay,
            primaryImage,
            imagesJson,
            description?.trim() || '',
            rating ? Number(rating) : 4.8,
            reviews ? parseInt(reviews, 10) : 8,
            brand?.trim() || 'THE GIFT STUDIO',
            discountBadge?.trim() || ''
          ]
        );
        insertSuccess = true;
      } catch (insertErr) {
        if (insertErr.code === 'ER_DUP_ENTRY' && attempts < 3) {
          // If a slug collision occurred concurrently, append a unique timestamp and retry
          uniqueSlug = `${slugify(title.trim()) || 'product'}-${Date.now().toString(36)}-${attempts}`;
        } else {
          throw insertErr;
        }
      }
    }

    const newProductId = result.insertId;

    // Sync product_occasions junction table
    if (assignedOccasionIds.length > 0) {
      for (const occId of assignedOccasionIds) {
        await dbPool.execute(
          'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
          [newProductId, occId]
        );
      }
    }

    const newProduct = {
      id: newProductId,
      title: title.trim(),
      slug: uniqueSlug,
      category_id: finalCategoryId,
      category: finalCategoryName,
      occasion_id: primaryOccasionId,
      occasion_ids: assignedOccasionIds,
      priceNum: Number(priceNum),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: resolvedStock,
      inStock: resolvedInStock,
      sameDayDelivery: resolvedSameDay,
      image: primaryImage,
      images: imagesArray,
      description: description?.trim() || '',
      rating: rating ? Number(rating) : 4.8,
      reviews: reviews ? parseInt(reviews, 10) : 8,
      brand: brand?.trim() || 'THE GIFT STUDIO',
      discountBadge: discountBadge?.trim() || ''
    };

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: newProductId,
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────────────────
// Update a product (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!dbPool) {
      return res.status(500).json({ success: false, message: 'Database not connected.' });
    }

    const [existingRows] = await dbPool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const current = existingRows[0];
    const oldImages = parseProductImages(current);

    // Determine category_id and category name
    let finalCategoryId = current.category_id;
    let finalCategoryName = current.category;

    if (req.body.category_id !== undefined) {
      if (req.body.category_id === null || req.body.category_id === '' || req.body.category_id === 0) {
        finalCategoryId = null;
        finalCategoryName = null;
      } else {
        finalCategoryId = Number(req.body.category_id);
        const [catRow] = await dbPool.execute('SELECT name FROM categories WHERE id = ? LIMIT 1', [finalCategoryId]);
        finalCategoryName = catRow.length > 0 ? catRow[0].name : null;
      }
    } else if (req.body.category !== undefined) {
      if (!req.body.category || !String(req.body.category).trim()) {
        finalCategoryId = null;
        finalCategoryName = null;
      } else {
        finalCategoryName = String(req.body.category).trim();
        const [categoryResult] = await dbPool.execute(
          'SELECT id, name FROM categories WHERE name = ? LIMIT 1',
          [finalCategoryName]
        );
        if (categoryResult.length > 0) {
          finalCategoryId = categoryResult[0].id;
          finalCategoryName = categoryResult[0].name;
        }
      }
    }

    // Determine occasion assignments
    let hasOccasionUpdate = false;
    let updatedOccasionIds = [];

    if (req.body.occasion_ids !== undefined) {
      hasOccasionUpdate = true;
      if (Array.isArray(req.body.occasion_ids)) {
        updatedOccasionIds = req.body.occasion_ids
          .map((oid) => Number(oid))
          .filter((oid) => !isNaN(oid) && oid > 0);
      }
    } else if (req.body.occasion_id !== undefined) {
      hasOccasionUpdate = true;
      if (req.body.occasion_id !== null && req.body.occasion_id !== '') {
        const numOcc = Number(req.body.occasion_id);
        if (!isNaN(numOcc) && numOcc > 0) {
          updatedOccasionIds = [numOcc];
        }
      }
    }

    const finalPrimaryOccasionId = hasOccasionUpdate
      ? (updatedOccasionIds.length > 0 ? updatedOccasionIds[0] : null)
      : current.occasion_id;

    const title = req.body.title !== undefined ? String(req.body.title).trim() : current.title;
    const priceNum = req.body.priceNum !== undefined ? Number(req.body.priceNum) : current.priceNum;
    const originalPrice = req.body.originalPrice !== undefined
      ? (req.body.originalPrice ? Number(req.body.originalPrice) : null)
      : current.originalPrice;
    const stock = req.body.stock !== undefined ? Math.max(0, parseInt(req.body.stock, 10)) : current.stock;
    const inStock = req.body.inStock !== undefined
      ? (req.body.inStock ? 1 : 0)
      : (req.body.stock !== undefined ? (stock > 0 ? 1 : 0) : current.inStock);
    const sameDayDelivery = req.body.sameDayDelivery !== undefined
      ? (req.body.sameDayDelivery ? 1 : 0)
      : current.sameDayDelivery;

    // Handle images array (1 to 7 images, cover image first)
    let imagesArray = null;
    if (req.body.images !== undefined || req.body.image !== undefined) {
      const candidateImages = req.body.images !== undefined ? req.body.images : current.images;
      const candidateCover = req.body.image !== undefined ? req.body.image : current.image;
      imagesArray = parseProductImages({ images: candidateImages, image: candidateCover });
      if (imagesArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least 1 product image is required.'
        });
      }
    }

    const finalImages = imagesArray !== null ? imagesArray : oldImages;
    const primaryImage = finalImages[0] || (req.body.image !== undefined ? String(req.body.image).trim() : current.image);
    const imagesJson = JSON.stringify(finalImages);

    const description = req.body.description !== undefined ? String(req.body.description).trim() : current.description;
    const rating = req.body.rating !== undefined ? Number(req.body.rating) : current.rating;
    const reviews = req.body.reviews !== undefined ? parseInt(req.body.reviews, 10) : current.reviews;
    const brand = req.body.brand !== undefined ? String(req.body.brand).trim() : current.brand;
    const discountBadge = req.body.discountBadge !== undefined ? String(req.body.discountBadge).trim() : current.discountBadge;

    // Slug management
    let finalSlug = current.slug;
    if (!finalSlug || (req.body.slug && req.body.slug.trim() !== current.slug) || (req.body.title && req.body.title.trim() !== current.title && !req.body.slug)) {
      finalSlug = await generateUniqueSlug(req.body.slug || title, id);
    }

    let updateSuccess = false;
    let attempts = 0;

    while (!updateSuccess && attempts < 3) {
      attempts += 1;
      try {
        await dbPool.execute(
          `UPDATE products SET
            title = ?,
            slug = ?,
            category_id = ?,
            category = ?,
            occasion_id = ?,
            priceNum = ?,
            originalPrice = ?,
            stock = ?,
            inStock = ?,
            sameDayDelivery = ?,
            image = ?,
            images = ?,
            description = ?,
            rating = ?,
            reviews = ?,
            brand = ?,
            discountBadge = ?,
            updated_at = NOW()
           WHERE id = ?`,
          [
            title,
            finalSlug,
            finalCategoryId,
            finalCategoryName,
            finalPrimaryOccasionId,
            priceNum,
            originalPrice,
            stock,
            inStock,
            sameDayDelivery,
            primaryImage,
            imagesJson,
            description,
            rating,
            reviews,
            brand,
            discountBadge,
            id
          ]
        );
        updateSuccess = true;
      } catch (updateErr) {
        if (updateErr.code === 'ER_DUP_ENTRY' && attempts < 3) {
          finalSlug = `${slugify(title) || 'product'}-${Date.now().toString(36)}-${attempts}`;
        } else {
          throw updateErr;
        }
      }
    }

    // Update product_occasions if occasion assignments were provided
    if (hasOccasionUpdate) {
      await dbPool.execute('DELETE FROM product_occasions WHERE product_id = ?', [id]);
      for (const occId of updatedOccasionIds) {
        await dbPool.execute(
          'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
          [id, occId]
        );
      }
    }

    // Safely cleanup removed image files
    if (imagesArray) {
      const removedImages = oldImages.filter((oldImg) => !imagesArray.includes(oldImg));
      for (const removedImg of removedImages) {
        const filename = getFilenameFromImageUrl(removedImg);
        if (filename) {
          safelyDeleteImageFile(filename, id).catch(() => {});
        }
      }
    }

    // Fetch refreshed occasion_ids for response
    const [poRows] = await dbPool.execute(
      'SELECT occasion_id FROM product_occasions WHERE product_id = ?',
      [id]
    );
    const finalOccasionIds = poRows.map((r) => r.occasion_id);

    const updatedProduct = {
      id: Number(id),
      title,
      slug: finalSlug,
      category_id: finalCategoryId,
      category: finalCategoryName,
      occasion_id: finalPrimaryOccasionId,
      occasion_ids: finalOccasionIds,
      priceNum,
      originalPrice,
      stock,
      inStock,
      sameDayDelivery,
      image: primaryImage,
      images: finalImages,
      description,
      rating,
      reviews,
      brand,
      discountBadge
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
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

    const [existingRows] = await dbPool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const current = existingRows[0];
    const imagesToDelete = parseProductImages(current);

    const [result] = await dbPool.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Safely remove associated files if not used elsewhere
    for (const imgUrl of imagesToDelete) {
      const filename = getFilenameFromImageUrl(imgUrl);
      if (filename) {
        safelyDeleteImageFile(filename, id).catch(() => {});
      }
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

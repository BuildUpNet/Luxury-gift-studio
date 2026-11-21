import express from 'express';
import dbPool from '../config/db.js';
import { authenticateToken } from '../middlewares/auth.js';
import { uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Auto-seed default trust / feature badges if table empty
async function ensureFeatureCardsTable() {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS feature_cards (
        id int unsigned NOT NULL AUTO_INCREMENT,
        title varchar(150) NOT NULL,
        subtitle varchar(150) DEFAULT NULL,
        description text DEFAULT NULL,
        image_url varchar(255) DEFAULT NULL,
        badge_tag varchar(50) DEFAULT NULL,
        link_url varchar(255) DEFAULT NULL,
        sort_order int NOT NULL DEFAULT 0,
        is_active tinyint(1) NOT NULL DEFAULT 1,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_sort_order (sort_order),
        KEY idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Settings table for marquee section enabled / disabled
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS marquee_settings (
        id int unsigned NOT NULL DEFAULT 1,
        is_enabled tinyint(1) NOT NULL DEFAULT 1,
        min_cards_required int NOT NULL DEFAULT 5,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [settingsRow] = await dbPool.query('SELECT COUNT(*) as count FROM marquee_settings WHERE id = 1');
    if (settingsRow[0].count === 0) {
      await dbPool.query('INSERT INTO marquee_settings (id, is_enabled, min_cards_required) VALUES (1, 1, 5)');
    }

  } catch (err) {
    console.error('Failed to ensure feature_cards table:', err.message);
  }
}
ensureFeatureCardsTable();

// 1. GET /api/feature-cards (Public - List all active cards + section enabled status)
router.get('/', async (req, res) => {
  try {
    const [settingsRows] = await dbPool.query('SELECT * FROM marquee_settings WHERE id = 1 LIMIT 1');
    const settings = settingsRows[0] || { is_enabled: 1, min_cards_required: 5 };

    const [cards] = await dbPool.query(
      'SELECT * FROM feature_cards WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );

    // Section is enabled if admin turned it ON AND there are at least min_cards_required cards
    const minRequired = Number(settings.min_cards_required) || 5;
    const isSectionVisible = Boolean(settings.is_enabled) && cards.length >= minRequired;

    res.json({
      success: true,
      is_enabled: Boolean(settings.is_enabled),
      min_cards_required: minRequired,
      is_visible: isSectionVisible,
      cards: isSectionVisible ? cards : []
    });
  } catch (err) {
    console.error('Error fetching feature cards:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch cards' });
  }
});

// 2. GET /api/feature-cards/admin/all (Protected - List all cards + settings for admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const [settingsRows] = await dbPool.query('SELECT * FROM marquee_settings WHERE id = 1 LIMIT 1');
    const settings = settingsRows[0] || { is_enabled: 1, min_cards_required: 5 };

    const [rows] = await dbPool.query(
      'SELECT * FROM feature_cards ORDER BY sort_order ASC, id ASC'
    );

    res.json({
      success: true,
      settings: {
        is_enabled: Boolean(settings.is_enabled),
        min_cards_required: Number(settings.min_cards_required) || 5
      },
      cards: rows
    });
  } catch (err) {
    console.error('Error fetching admin feature cards:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch cards' });
  }
});

// 2b. PUT /api/feature-cards/admin/settings (Protected - Toggle section ON/OFF or update min required)
router.put('/admin/settings', authenticateToken, async (req, res) => {
  try {
    const { is_enabled, min_cards_required } = req.body;
    const enabledVal = is_enabled !== undefined ? (Number(is_enabled) ? 1 : 0) : 1;
    const minVal = min_cards_required !== undefined ? Number(min_cards_required) : 5;

    await dbPool.query(
      `INSERT INTO marquee_settings (id, is_enabled, min_cards_required)
       VALUES (1, ?, ?)
       ON DUPLICATE KEY UPDATE is_enabled = VALUES(is_enabled), min_cards_required = VALUES(min_cards_required)`,
      [enabledVal, minVal]
    );

    res.json({
      success: true,
      message: 'Marquee settings updated successfully',
      settings: {
        is_enabled: Boolean(enabledVal),
        min_cards_required: minVal
      }
    });
  } catch (err) {
    console.error('Error updating marquee settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// 3. POST /api/feature-cards (Protected - Create new card)
router.post('/', authenticateToken, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, badge_tag, link_url, sort_order, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    let imageUrl = req.body.image_url || '';
    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    const [maxOrderRow] = await dbPool.query('SELECT MAX(sort_order) as maxOrder FROM feature_cards');
    const nextOrder = sort_order !== undefined && sort_order !== '' ? Number(sort_order) : (maxOrderRow[0].maxOrder || 0) + 1;

    const [result] = await dbPool.query(
      `INSERT INTO feature_cards (title, subtitle, description, image_url, badge_tag, link_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        (subtitle || '').trim(),
        (description || '').trim(),
        imageUrl.trim(),
        (badge_tag || '').trim(),
        (link_url || '').trim(),
        nextOrder,
        is_active !== undefined ? (Number(is_active) ? 1 : 0) : 1
      ]
    );

    const [created] = await dbPool.query('SELECT * FROM feature_cards WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card: created[0]
    });
  } catch (err) {
    console.error('Error creating feature card:', err);
    res.status(500).json({ success: false, message: 'Failed to create card' });
  }
});

// 4. PUT /api/feature-cards/:id (Protected - Update card)
router.put('/:id', authenticateToken, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, badge_tag, link_url, sort_order, is_active } = req.body;

    const [existing] = await dbPool.query('SELECT * FROM feature_cards WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    let imageUrl = existing[0].image_url;
    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    } else if (req.body.image_url !== undefined) {
      imageUrl = req.body.image_url;
    }

    await dbPool.query(
      `UPDATE feature_cards
       SET title = ?, subtitle = ?, description = ?, image_url = ?, badge_tag = ?, link_url = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        title !== undefined ? title.trim() : existing[0].title,
        subtitle !== undefined ? subtitle.trim() : existing[0].subtitle,
        description !== undefined ? description.trim() : existing[0].description,
        imageUrl,
        badge_tag !== undefined ? badge_tag.trim() : existing[0].badge_tag,
        link_url !== undefined ? link_url.trim() : existing[0].link_url,
        sort_order !== undefined ? Number(sort_order) : existing[0].sort_order,
        is_active !== undefined ? (Number(is_active) ? 1 : 0) : existing[0].is_active,
        id
      ]
    );

    const [updated] = await dbPool.query('SELECT * FROM feature_cards WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Card updated successfully',
      card: updated[0]
    });
  } catch (err) {
    console.error('Error updating feature card:', err);
    res.status(500).json({ success: false, message: 'Failed to update card' });
  }
});

// 5. DELETE /api/feature-cards/:id (Protected - Delete card)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query('DELETE FROM feature_cards WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (err) {
    console.error('Error deleting feature card:', err);
    res.status(500).json({ success: false, message: 'Failed to delete card' });
  }
});

export default router;

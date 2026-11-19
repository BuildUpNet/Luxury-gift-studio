import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gift_studio'
  });

  console.log('Connected to DB for migration');

  // 1. Ensure occasion_id column on products table
  try {
    const [cols] = await conn.query('SHOW COLUMNS FROM products LIKE ?', ['occasion_id']);
    if (cols.length === 0) {
      await conn.query('ALTER TABLE products ADD COLUMN occasion_id INT UNSIGNED DEFAULT NULL AFTER category_id');
      await conn.query('ALTER TABLE products ADD CONSTRAINT fk_products_occasion_id FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE SET NULL');
      console.log('Added occasion_id column to products table.');
    }
  } catch (err) {
    console.log('occasion_id column check/alter notice:', err.message);
  }

  // 2. Find all categories with section_type = 'occasion'
  const [occasionCats] = await conn.query("SELECT * FROM categories WHERE section_type = 'occasion'");
  console.log('Found occasion categories to migrate:', occasionCats.length);

  for (const cat of occasionCats) {
    let [existingOcc] = await conn.query(
      'SELECT * FROM occasions WHERE LOWER(name) = ? OR slug = ?',
      [cat.name.toLowerCase(), cat.slug]
    );
    let occasionId;
    if (existingOcc.length > 0) {
      occasionId = existingOcc[0].id;
      console.log(`Occasion "${cat.name}" already exists in occasions with id: ${occasionId}`);
    } else {
      const [insertRes] = await conn.query(
        'INSERT INTO occasions (name, slug, image_url, description) VALUES (?, ?, ?, ?)',
        [cat.name, cat.slug, cat.image_url || null, `Curated gifts and luxury hampers for ${cat.name}`]
      );
      occasionId = insertRes.insertId;
      console.log(`Created occasion "${cat.name}" with id: ${occasionId}`);
    }

    // Find all products linked to this category
    const [linkedProds] = await conn.query('SELECT id, title FROM products WHERE category_id = ?', [cat.id]);
    console.log(`Found ${linkedProds.length} products linked to category "${cat.name}"`);

    // Pick a fallback valid category for products
    const [validCats] = await conn.query(
      "SELECT id, name FROM categories WHERE section_type = 'category' AND id != ? LIMIT 1",
      [cat.id]
    );
    const fallbackCat = validCats[0] || null;

    for (const prod of linkedProds) {
      // 1. Add to product_occasions
      await conn.query(
        'INSERT IGNORE INTO product_occasions (product_id, occasion_id) VALUES (?, ?)',
        [prod.id, occasionId]
      );

      // 2. Also set occasion_id on products table
      await conn.query('UPDATE products SET occasion_id = ? WHERE id = ?', [occasionId, prod.id]);

      // 3. Set category_id to fallbackCat or NULL
      if (fallbackCat) {
        await conn.query(
          'UPDATE products SET category_id = ?, category = ? WHERE id = ?',
          [fallbackCat.id, fallbackCat.name, prod.id]
        );
        console.log(`Product ${prod.id} (${prod.title}) linked to occasion ${occasionId} and assigned category ${fallbackCat.name}`);
      } else {
        await conn.query('UPDATE products SET category_id = NULL WHERE id = ?', [prod.id]);
      }
    }

    // Delete the row from categories
    await conn.query('DELETE FROM categories WHERE id = ?', [cat.id]);
    console.log(`Deleted category "${cat.name}" (ID ${cat.id}) from categories table.`);
  }

  // 3. Check results
  const [cats] = await conn.query('SELECT id, name, slug, section_type FROM categories');
  console.log('Categories table now:', cats);

  const [occasions] = await conn.query('SELECT o.*, COUNT(po.product_id) as products_count FROM occasions o LEFT JOIN product_occasions po ON o.id = po.occasion_id GROUP BY o.id');
  console.log('Occasions table now:', occasions);

  await conn.end();
}

migrate().catch(console.error);

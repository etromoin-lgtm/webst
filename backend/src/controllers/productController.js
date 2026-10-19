const db = require('../config/database');

const getProducts = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ products: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, category, image_url, price_label, link_url, features_json } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO products (name, description, category, image_url, price_label, link_url, features_json) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, image_url || null, price_label || null, link_url || null, features_json || null]
    );
    const row = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, product: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, category, image_url, price_label, link_url, features_json } = req.body;
  try {
    await db.run(
      'UPDATE products SET name = ?, description = ?, category = ?, image_url = ?, price_label = ?, link_url = ?, features_json = ? WHERE id = ?',
      [name, description, category, image_url || null, price_label || null, link_url || null, features_json || null, req.params.id]
    );
    const row = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, product: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

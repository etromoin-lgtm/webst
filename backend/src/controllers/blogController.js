const db = require('../config/database');

const getBlogBySlug = async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM blogs WHERE slug = ?', [req.params.slug]);
    if (row) {
      res.json({ success: true, blog: row });
    } else {
      res.status(404).json({ success: false, error: 'Blog not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM blogs ORDER BY published_date DESC');
    res.json({ blogs: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createBlog = async (req, res) => {
  const { title, content, author_id, image_url, category } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  try {
    const result = await db.run(
      'INSERT INTO blogs (title, content, author_id, slug, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, author_id || 'Admin', slug, image_url || null, category || 'General']
    );
    const row = await db.get('SELECT * FROM blogs WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, blog: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getBlogBySlug,
  getAllBlogs,
  createBlog,
  deleteBlog
};

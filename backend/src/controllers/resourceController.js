const db = require('../config/database');

const getAllResources = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM resources ORDER BY updated_at DESC, id DESC');
    const resources = rows.map(r => ({
      ...r,
      downloadable: !!r.downloadable,
      excerpt: r.excerpt || (r.content ? r.content.replace(/<[^>]*>?/gm, '').trim().slice(0, 160) + '...' : ''),
      readTime: `${Math.max(3, Math.ceil((r.content ? r.content.length : 500) / 400))} min read`
    }));
    res.json({ resources });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getResourceBySlug = async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM resources WHERE slug = ?', [req.params.slug]);
    if (row) {
      res.json({ success: true, resource: { ...row, downloadable: !!row.downloadable } });
    } else {
      res.status(404).json({ success: false, error: 'Resource not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createResource = async (req, res) => {
  const { title, content, author_id, image_url, category, slug: inputSlug, type, description, excerpt, pdf_url, downloadable, tags, seo_title, seo_description } = req.body;
  const baseSlug = (inputSlug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = baseSlug || `resource-${Date.now()}`;

  try {
    const existing = await db.get('SELECT id FROM resources WHERE slug = ?', [slug]);
    if (existing) {
      await db.run(
        `UPDATE resources SET title=?, content=?, author_id=?, image_url=?, category=?, type=?, description=?, excerpt=?, pdf_url=?, downloadable=?, tags=?, seo_title=?, seo_description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [title, content, author_id || 'Admin', image_url || null, category || 'General', type || 'Technical Guide', description || null, excerpt || null, pdf_url || null, downloadable ? 1 : 0, tags || null, seo_title || null, seo_description || null, existing.id]
      );
      const row = await db.get('SELECT * FROM resources WHERE id = ?', [existing.id]);
      return res.status(200).json({ success: true, resource: row });
    }

    const result = await db.run(
      `INSERT INTO resources (title, content, author_id, slug, image_url, category, type, description, excerpt, pdf_url, downloadable, tags, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, author_id || 'Admin', slug, image_url || null, category || 'General', type || 'Technical Guide', description || null, excerpt || null, pdf_url || null, downloadable ? 1 : 0, tags || null, seo_title || null, seo_description || null]
    );
    const row = await db.get('SELECT * FROM resources WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, resource: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    await db.run('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getResourcePdf = async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM resources WHERE slug = ?', [req.params.slug]);
    if (!row) return res.status(404).send('Not found');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${row.title}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#111}h1{font-size:24px}img{max-width:100%}</style></head><body><h1>${row.title}</h1><p>${row.description || ''}</p><div>${row.content || ''}</div><script>window.print();</script></body></html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = { getAllResources, getResourceBySlug, createResource, deleteResource, getResourcePdf };

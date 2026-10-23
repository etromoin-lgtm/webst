const db = require('../config/database');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>?/gm, '').trim();
}

function calcReadTime(content) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}

function mapBlog(r) {
  return {
    ...r,
    featured: !!r.featured,
    author: {
      name: r.author_id || 'Editorial Team',
      role: 'Etromo Architecture & Research',
      avatar: '/logo.png',
      bio: 'Technical playbooks, system architectures, and workflow automation insights from the Etromo engineering group.'
    },
    excerpt: r.excerpt || stripHtml(r.content).slice(0, 160) + '…',
    readTime: calcReadTime(r.content),
    tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : []
  };
}

// ─── Public Routes ─────────────────────────────────────────────────────────────

const getAllBlogs = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = "SELECT * FROM blogs WHERE status = 'published'";
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (featured)  { query += ' AND featured = 1'; }
    query += ' ORDER BY published_date DESC';

    const rows = await db.all(query, params);
    res.json({ blogs: rows.map(mapBlog) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const rows = await db.all(
      "SELECT * FROM blogs WHERE status = 'published' AND featured = 1 ORDER BY published_date DESC LIMIT 3"
    );
    res.json({ blogs: rows.map(mapBlog) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;
    const current = await db.get("SELECT id, category FROM blogs WHERE slug = ? AND status = 'published'", [slug]);
    if (!current) return res.json({ blogs: [] });

    const rows = await db.all(
      "SELECT * FROM blogs WHERE status = 'published' AND category = ? AND id != ? ORDER BY published_date DESC LIMIT 3",
      [current.category, current.id]
    );
    res.json({ blogs: rows.map(mapBlog) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const row = await db.get("SELECT * FROM blogs WHERE slug = ? AND status = 'published'", [req.params.slug]);
    if (row) {
      res.json({ success: true, blog: mapBlog(row) });
    } else {
      res.status(404).json({ success: false, error: 'Article not found.' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ─── Admin Routes (require auth) ───────────────────────────────────────────────

const getAllBlogsAdmin = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM blogs ORDER BY published_date DESC');
    res.json({ blogs: rows.map(mapBlog) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createBlog = async (req, res) => {
  const {
    title, subtitle, content, author_id, image_url, image_alt,
    category, slug: inputSlug, status, excerpt,
    seo_title, seo_description, tags, featured
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Title is required.' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, error: 'Content is required.' });
  }

  const slug = slugify(inputSlug || title) || `article-${Date.now()}`;

  try {
    const existing = await db.get('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existing) {
      await db.run(
        `UPDATE blogs SET title=?, subtitle=?, content=?, author_id=?, image_url=?, image_alt=?,
         category=?, status=?, excerpt=?, seo_title=?, seo_description=?, tags=?, featured=?,
         updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [
          title, subtitle || null, content, author_id || 'Admin', image_url || null,
          image_alt || null, category || 'General', status || 'published',
          excerpt || null, seo_title || null, seo_description || null,
          Array.isArray(tags) ? tags.join(',') : (tags || null),
          featured ? 1 : 0, existing.id
        ]
      );
      const row = await db.get('SELECT * FROM blogs WHERE id = ?', [existing.id]);
      return res.status(200).json({ success: true, blog: mapBlog(row) });
    }

    const result = await db.run(
      `INSERT INTO blogs (title, subtitle, content, author_id, slug, image_url, image_alt,
       category, status, excerpt, seo_title, seo_description, tags, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, subtitle || null, content, author_id || 'Admin', slug,
        image_url || null, image_alt || null, category || 'General',
        status || 'published', excerpt || null, seo_title || null,
        seo_description || null,
        Array.isArray(tags) ? tags.join(',') : (tags || null),
        featured ? 1 : 0
      ]
    );
    const row = await db.get('SELECT * FROM blogs WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, blog: mapBlog(row) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const {
    title, subtitle, content, author_id, image_url, image_alt,
    category, status, excerpt, seo_title, seo_description, tags, featured
  } = req.body;

  try {
    const existing = await db.get('SELECT id FROM blogs WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Blog not found.' });

    await db.run(
      `UPDATE blogs SET title=?, subtitle=?, content=?, author_id=?, image_url=?, image_alt=?,
       category=?, status=?, excerpt=?, seo_title=?, seo_description=?, tags=?, featured=?,
       updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [
        title, subtitle || null, content, author_id || 'Admin', image_url || null,
        image_alt || null, category || 'General', status || 'published',
        excerpt || null, seo_title || null, seo_description || null,
        Array.isArray(tags) ? tags.join(',') : (tags || null),
        featured ? 1 : 0, id
      ]
    );
    const row = await db.get('SELECT * FROM blogs WHERE id = ?', [id]);
    res.json({ success: true, blog: mapBlog(row) });
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

// ─── PDF Export (stub — real PDF implemented in Phase 2) ──────────────────────

const getBlogPdf = async (req, res) => {
  try {
    const row = await db.get("SELECT * FROM blogs WHERE slug = ? AND status = 'published'", [req.params.slug]);
    if (!row) return res.status(404).send('Article not found.');

    const date = row.published_date
      ? new Date(row.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

    // Phase 2 will replace this with html-pdf-node.
    // For now, serve a print-optimised HTML page the user can Ctrl+P → Save as PDF.
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${row.title} — Etromo</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,'Times New Roman',serif;font-size:12pt;line-height:1.7;color:#111;padding:40px;max-width:800px;margin:0 auto}
  header{border-bottom:2px solid #1B3FD8;padding-bottom:16px;margin-bottom:32px}
  .brand{font-family:Arial,sans-serif;font-size:10pt;color:#1B3FD8;font-weight:700;text-transform:uppercase;letter-spacing:2px}
  h1{font-size:22pt;line-height:1.2;margin:12px 0 8px;color:#0A1530}
  .meta{font-family:Arial,sans-serif;font-size:9pt;color:#555;margin-bottom:8px}
  .excerpt{font-size:12pt;color:#333;font-style:italic;border-left:3px solid #1B3FD8;padding-left:12px;margin:16px 0}
  h2{font-size:16pt;margin:28px 0 10px;color:#0A1530}
  h3{font-size:13pt;margin:20px 0 8px;color:#0A1530}
  p{margin-bottom:14px}
  blockquote{border-left:3px solid #1B3FD8;padding:8px 16px;margin:20px 0;font-style:italic;color:#444}
  table{width:100%;border-collapse:collapse;margin:20px 0;font-family:Arial,sans-serif;font-size:10pt}
  th{background:#f0f4ff;padding:8px 12px;text-align:left;border:1px solid #ddd}
  td{padding:8px 12px;border:1px solid #ddd}
  img{max-width:100%;height:auto;margin:16px 0}
  footer{margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-family:Arial,sans-serif;font-size:8pt;color:#888}
  @media print{body{padding:20px}button{display:none}}
</style>
</head>
<body>
<header>
  <div class="brand">Etromo — etromo.com</div>
  <h1>${row.title}</h1>
  ${row.subtitle ? `<div class="excerpt">${row.subtitle}</div>` : ''}
  <div class="meta">By ${row.author_id || 'Etromo Editorial Team'} &nbsp;·&nbsp; ${date} &nbsp;·&nbsp; © ${new Date().getFullYear()} Etromo. All rights reserved.</div>
</header>
<main>${row.content || ''}</main>
<footer>
  Original article: https://www.etromo.com/blog/${row.slug}<br>
  © ${new Date().getFullYear()} Etromo. Unauthorised reproduction prohibited.
</footer>
<script>
  // Auto-trigger print dialog
  window.addEventListener('load', () => window.print());
</script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    res.status(500).send('Error generating PDF.');
  }
};

module.exports = {
  getAllBlogs,
  getAllBlogsAdmin,
  getFeaturedBlogs,
  getRelatedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogPdf
};

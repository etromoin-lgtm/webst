const db = require('../config/database');

const getSiteSettings = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json({ settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateSiteSettings = async (req, res) => {
  const settings = req.body;
  try {
    for (const key in settings) {
      await db.run(
        'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP',
        [key, settings[key]]
      );
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getSeoSettings = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM seo_settings');
    res.json({ seo: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateSeoSettings = async (req, res) => {
  const { page, title, description, og_image } = req.body;
  try {
    await db.run(
      'INSERT INTO seo_settings (page, title, description, og_image) VALUES (?, ?, ?, ?) ON CONFLICT(page) DO UPDATE SET title=excluded.title, description=excluded.description, og_image=excluded.og_image, updated_at=CURRENT_TIMESTAMP',
      [page, title, description, og_image || null]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  getSeoSettings,
  updateSeoSettings
};

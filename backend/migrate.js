const db = require('./database');

async function migrate() {
  const migrations = [
    { col: 'sort_order on team_members', sql: 'ALTER TABLE team_members ADD COLUMN sort_order INTEGER DEFAULT 0' },
    { col: 'category on blogs', sql: 'ALTER TABLE blogs ADD COLUMN category TEXT DEFAULT "General"' },
    { col: 'price_label on products', sql: 'ALTER TABLE products ADD COLUMN price_label TEXT' },
    { col: 'status on contacts', sql: 'ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT "New"' },
    { col: 'notes on partner_applications', sql: 'ALTER TABLE partner_applications ADD COLUMN notes TEXT' },
    { col: 'seo_settings table', sql: `CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT UNIQUE NOT NULL,
      title TEXT, description TEXT, og_image TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )` },
  ];

  for (const m of migrations) {
    try {
      await db.run(m.sql);
      console.log('  ✓ Added:', m.col);
    } catch (e) {
      console.log('  ~ Skipped (already exists):', m.col);
    }
  }

  console.log('\nMigration complete. Re-seeding...');
  process.exit(0);
}

setTimeout(() => migrate().catch(e => { console.error(e); process.exit(1); }), 500);

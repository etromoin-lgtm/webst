const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const usePostgres = Boolean(
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.startsWith('postgres') &&
  !process.env.DATABASE_URL.includes('username:password')
);

let pgPool = null;
let sqliteDb = null;

if (usePostgres) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
  });
  console.log('PostgreSQL/Supabase pool initialized with connection string.');
} else {
  // Primary database location is in the root database/ folder
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const primaryDbPath = path.resolve(__dirname, '../../../database/database.sqlite');
  const fallbackDbPath = path.resolve(__dirname, '../../database.sqlite');
  const dbPath = isServerless 
    ? path.join('/tmp', 'database.sqlite')
    : (fs.existsSync(primaryDbPath) ? primaryDbPath : fallbackDbPath);

  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database', err.message);
    } else {
      console.log('SQLite database connected at ' + dbPath);
      initDB();
    }
  });
}

function initDB() {
  if (usePostgres) return; // Supabase tables created via migration / schema
  const db = sqliteDb;
  sqliteDb.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS partner_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      product_name TEXT,
      website TEXT,
      agency_name TEXT,
      experience TEXT,
      linkedin TEXT,
      code TEXT UNIQUE,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT,
      category TEXT DEFAULT 'General',
      published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'published'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      features_json TEXT,
      image_url TEXT,
      price_label TEXT,
      link_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`ALTER TABLE products ADD COLUMN link_url TEXT`, () => {});
    db.run(`ALTER TABLE products ADD COLUMN features_json TEXT`, () => {});

    db.run(`CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      department TEXT,
      short_desc TEXT,
      bio TEXT,
      email TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      x_url TEXT,
      instagram_url TEXT,
      facebook_url TEXT,
      youtube_url TEXT,
      website_url TEXT,
      image_url TEXT,
      skills TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const teamCols = [
      'department TEXT',
      'short_desc TEXT',
      'email TEXT',
      'github_url TEXT',
      'x_url TEXT',
      'instagram_url TEXT',
      'facebook_url TEXT',
      'youtube_url TEXT',
      'website_url TEXT',
      'skills TEXT',
      'is_active INTEGER DEFAULT 1'
    ];
    teamCols.forEach(col => {
      db.run(`ALTER TABLE team_members ADD COLUMN ${col}`, () => {});
    });

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      country TEXT,
      topics TEXT,
      message TEXT,
      date TEXT,
      time TEXT,
      status TEXT DEFAULT 'Scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT UNIQUE NOT NULL,
      title TEXT,
      description TEXT,
      og_image TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS case_studies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      industry TEXT NOT NULL,
      client_name TEXT NOT NULL,
      is_client_confidential INTEGER DEFAULT 0,
      cover_image TEXT,
      duration TEXT,
      services TEXT,
      technologies TEXT,
      business_type TEXT,
      challenge_overview TEXT,
      challenge_points TEXT,
      goals_baseline TEXT,
      approach_phases TEXT,
      solution_overview TEXT,
      solution_features TEXT,
      solution_architecture_image TEXT,
      before_after_metrics TEXT,
      key_results TEXT,
      methodology TEXT,
      lessons_learned TEXT,
      external_links TEXT,
      custom_tables TEXT,
      testimonial TEXT,
      status TEXT DEFAULT 'published',
      featured INTEGER DEFAULT 0,
      featured_on_homepage INTEGER DEFAULT 0,
      featured_in_trusted_by INTEGER DEFAULT 0,
      embedded_link TEXT,
      custom_favicon_url TEXT,
      sort_order INTEGER DEFAULT 0,
      author TEXT DEFAULT 'Engineering Team',
      seo_title TEXT,
      seo_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Safe migrations for existing database files
    db.run("ALTER TABLE case_studies ADD COLUMN embedded_link TEXT", () => {});
    db.run("ALTER TABLE case_studies ADD COLUMN featured_on_homepage INTEGER DEFAULT 0", () => {});
    db.run("ALTER TABLE case_studies ADD COLUMN featured_in_trusted_by INTEGER DEFAULT 0", () => {});
    db.run("ALTER TABLE case_studies ADD COLUMN custom_favicon_url TEXT", () => {});

    // --- CLIENT PORTAL & B2B TABLES ---
    db.run(`CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      legal_name TEXT NOT NULL,
      brand_name TEXT,
      tax_id TEXT,
      primary_email TEXT UNIQUE NOT NULL,
      phone TEXT,
      website TEXT,
      verification_status TEXT DEFAULT 'VERIFIED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'CLIENT',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      project_code TEXT UNIQUE,
      name TEXT NOT NULL,
      scope_summary TEXT,
      project_type TEXT DEFAULT 'CUSTOM_DEV',
      progress_percentage INTEGER DEFAULT 0,
      status TEXT DEFAULT 'IN_PROGRESS',
      is_historical_record INTEGER DEFAULT 0,
      start_date TEXT,
      target_or_completion_date TEXT,
      assigned_admin_name TEXT DEFAULT 'Engineering Team',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'PENDING',
      completion_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES portal_projects(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_product_purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      license_key TEXT UNIQUE,
      purchase_date TEXT,
      entitlement_type TEXT DEFAULT 'LIFETIME',
      entitlement_end_date TEXT,
      status TEXT DEFAULT 'ACTIVE',
      price_paid TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_historical_claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      user_id INTEGER,
      claim_type TEXT NOT NULL,
      declared_name TEXT NOT NULL,
      declared_reference_number TEXT,
      declared_old_email TEXT,
      approximate_date TEXT,
      notes TEXT,
      verification_status TEXT DEFAULT 'PENDING',
      admin_decision_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      project_id INTEGER,
      invoice_number TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      total_amount REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      due_date TEXT,
      status TEXT DEFAULT 'PAID',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      project_id INTEGER,
      product_id INTEGER,
      ticket_code TEXT UNIQUE,
      subject TEXT NOT NULL,
      priority TEXT DEFAULT 'MEDIUM',
      status TEXT DEFAULT 'OPEN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message_body TEXT NOT NULL,
      attachment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES portal_tickets(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      project_id INTEGER,
      title TEXT NOT NULL,
      document_type TEXT DEFAULT 'REPORT',
      file_url TEXT NOT NULL,
      file_size TEXT,
      version TEXT DEFAULT 'v1.0',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_direct_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      title TEXT NOT NULL,
      message_body TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'NORMAL',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS portal_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      actor_name TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Demo Client Organization & Data if empty
    db.get("SELECT COUNT(*) as count FROM organizations", (err, row) => {
      if (!err && row && row.count === 0) {
        db.run(
          `INSERT INTO organizations (legal_name, brand_name, primary_email, phone, website, verification_status)
           VALUES ('Acme Enterprises Inc', 'Acme Global', 'client@acme.com', '+1 (555) 234-5678', 'https://acme.com', 'VERIFIED')`,
          function (err2) {
            if (!err2) {
              const orgId = this.lastID;
              // Demo User (password: client123)
              db.run(`INSERT INTO portal_users (organization_id, email, password_hash, full_name, phone, role)
                      VALUES (?, 'client@acme.com', 'client123', 'John Doe', '+1 (555) 234-5678', 'CLIENT')`, [orgId]);

              // Demo Products
              db.run(`INSERT INTO portal_product_purchases (organization_id, product_name, license_key, purchase_date, entitlement_type, status, price_paid)
                      VALUES (?, 'Real Estate CRM Enterprise', 'ETRO-RE-9821-X', '2025-11-10', 'ANNUAL', 'ACTIVE', '$1,200')`, [orgId]);
              db.run(`INSERT INTO portal_product_purchases (organization_id, product_name, license_key, purchase_date, entitlement_type, status, price_paid)
                      VALUES (?, 'WhatsApp Business Automation Suite', 'ETRO-WA-4412-B', '2026-02-14', 'LIFETIME', 'ACTIVE', '$850')`, [orgId]);

              // Demo Projects (Historical + Active)
              db.run(`INSERT INTO portal_projects (organization_id, project_code, name, scope_summary, project_type, progress_percentage, status, is_historical_record, start_date, target_or_completion_date)
                      VALUES (?, 'PRJ-2025-01', 'Multi-tenant CRM Backend & API Integration', 'Complete cloud database design, webhook pipeline and lead distributor system.', 'AUTOMATION', 100, 'COMPLETED', 1, '2025-08-01', '2025-10-15')`, [orgId]);

              db.run(`INSERT INTO portal_projects (organization_id, project_code, name, scope_summary, project_type, progress_percentage, status, is_historical_record, start_date, target_or_completion_date)
                      VALUES (?, 'PRJ-2026-02', 'Custom AI Agent Lead Qualification Pipeline', 'Integrating LLM automated lead intake and voice bot transcription to WhatsApp CRM.', 'CUSTOM_DEV', 65, 'IN_PROGRESS', 0, '2026-03-01', '2026-05-30')`, [orgId], function (err3) {
                        if (!err3) {
                          const activePrjId = this.lastID;
                          db.run(`INSERT INTO portal_milestones (project_id, title, notes, status, completion_date)
                                  VALUES (?, 'Architecture & Schema Approval', 'Database schemas, security keys and API tokens verified.', 'SHIPPED', '2026-03-10')`, [activePrjId]);
                          db.run(`INSERT INTO portal_milestones (project_id, title, notes, status, completion_date)
                                  VALUES (?, 'AI Agent & WhatsApp Webhook Engine', 'Real-time conversational intake and prompt engineering.', 'IN_PROGRESS', '2026-04-15')`, [activePrjId]);
                          db.run(`INSERT INTO portal_milestones (project_id, title, notes, status, completion_date)
                                  VALUES (?, 'UAT & Production Deployment', 'Final load testing, security audit and client handover.', 'PENDING', '2026-05-30')`, [activePrjId]);
                        }
                      });

              // Demo Invoices
              db.run(`INSERT INTO portal_invoices (organization_id, invoice_number, title, total_amount, amount_paid, due_date, status)
                      VALUES (?, 'INV-2025-089', 'CRM Backend Integration - Final Payment', 4500, 4500, '2025-10-15', 'PAID')`, [orgId]);
              db.run(`INSERT INTO portal_invoices (organization_id, invoice_number, title, total_amount, amount_paid, due_date, status)
                      VALUES (?, 'INV-2026-014', 'AI Agent Pipeline - Milestone 1 & 2', 6000, 3900, '2026-04-30', 'PARTIAL')`, [orgId]);

              // Demo Documents
              db.run(`INSERT INTO portal_documents (organization_id, title, document_type, file_url, file_size, version)
                      VALUES (?, 'CRM Backend Handover & Architecture Document', 'DELIVERABLE', '/uploads/crm-backend-handover.pdf', '2.4 MB', 'v1.0')`, [orgId]);
              db.run(`INSERT INTO portal_documents (organization_id, title, document_type, file_url, file_size, version)
                      VALUES (?, 'AI Agent Specifications & Prompt Matrix', 'SPECIFICATION', '/uploads/ai-agent-spec.pdf', '1.1 MB', 'v2.1')`, [orgId]);

              // Demo Direct Messages
              db.run(`INSERT INTO portal_direct_messages (organization_id, sender_name, title, message_body, is_read, priority)
                      VALUES (?, 'Etromo Engineering Team', 'Milestone 2 Sprint Update', 'Hello John, your AI Agent lead qualification pipeline is now 65% complete. We have deployed the WhatsApp webhook staging server for your preliminary review.', 0, 'HIGH')`, [orgId]);

              // Demo Ticket
              db.run(`INSERT INTO portal_tickets (organization_id, user_id, ticket_code, subject, priority, status)
                      VALUES (?, 1, 'TCK-1092', 'Webhook retry logic on WhatsApp template failure', 'HIGH', 'IN_PROGRESS')`, [orgId], function(err4) {
                        if (!err4) {
                          const tckId = this.lastID;
                          db.run(`INSERT INTO portal_ticket_messages (ticket_id, sender_name, sender_role, message_body)
                                  VALUES (?, 'John Doe', 'CLIENT', 'We noticed occasional retry delays when meta servers return 429 rate limit. Could you check?')`, [tckId]);
                          db.run(`INSERT INTO portal_ticket_messages (ticket_id, sender_name, sender_role, message_body)
                                  VALUES (?, 'Etromo Support Lead', 'ADMIN', 'We have isolated this to Meta API burst limits and added an exponential backoff worker queue. Deployed on staging.')`, [tckId]);
                        }
                      });
            }
          }
        );
      }
    });
  });
}

// Convert question mark placeholders (? -> $1, $2, ...) for PostgreSQL
const toPgSql = (sql) => {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

// Helper: run insert/update/delete
const run = async (text, params = []) => {
  if (usePostgres) {
    let pgText = toPgSql(text);
    // If INSERT and lacks RETURNING id, add RETURNING id for lastID parity
    const isInsert = /^\s*INSERT\s+INTO/i.test(pgText);
    if (isInsert && !/RETURNING/i.test(pgText)) {
      pgText += ' RETURNING id';
    }
    const res = await pgPool.query(pgText, params);
    const lastID = res.rows && res.rows[0] && res.rows[0].id ? res.rows[0].id : null;
    return { lastID, changes: res.rowCount, rowCount: res.rowCount, rows: res.rows };
  }

  return new Promise((resolve, reject) => {
    const sqliteText = text.replace(/\$\d+/g, '?');
    sqliteDb.run(sqliteText, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Helper: get all rows
const all = async (text, params = []) => {
  if (usePostgres) {
    const pgText = toPgSql(text);
    const res = await pgPool.query(pgText, params);
    return res.rows || [];
  }

  return new Promise((resolve, reject) => {
    const sqliteText = text.replace(/\$\d+/g, '?');
    sqliteDb.all(sqliteText, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Helper: get single row
const get = async (text, params = []) => {
  if (usePostgres) {
    const pgText = toPgSql(text);
    const res = await pgPool.query(pgText, params);
    return res.rows && res.rows.length > 0 ? res.rows[0] : null;
  }

  return new Promise((resolve, reject) => {
    const sqliteText = text.replace(/\$\d+/g, '?');
    sqliteDb.get(sqliteText, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

module.exports = { 
  run, 
  all, 
  get, 
  db: sqliteDb, 
  pgPool, 
  isPostgres: usePostgres 
};

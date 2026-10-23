const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const { hashPassword } = require('../middleware/authMiddleware');

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
      subtitle TEXT,
      content TEXT NOT NULL,
      author_id TEXT,
      category TEXT DEFAULT 'General',
      published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT,
      image_alt TEXT,
      excerpt TEXT,
      tags TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published'
    )`);

    // Safe migrations for existing blogs tables
    [
      'subtitle TEXT',
      'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
      'image_alt TEXT',
      'excerpt TEXT',
      'tags TEXT',
      'seo_title TEXT',
      'seo_description TEXT',
      'featured INTEGER DEFAULT 0'
    ].forEach(col => {
      db.run(`ALTER TABLE blogs ADD COLUMN ${col}`, () => {});
    });

    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      author_id TEXT,
      category TEXT DEFAULT 'General',
      type TEXT DEFAULT 'Technical Guide',
      description TEXT,
      excerpt TEXT,
      subtitle TEXT,
      image_alt TEXT,
      published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT,
      pdf_url TEXT,
      downloadable INTEGER DEFAULT 1,
      tags TEXT,
      seo_title TEXT,
      seo_description TEXT,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published'
    )`);

    // Safe migrations for resources table (existing databases)
    ['subtitle TEXT', 'image_alt TEXT', 'featured INTEGER DEFAULT 0'].forEach(col => {
      db.run(`ALTER TABLE resources ADD COLUMN ${col}`, () => {});
    });

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

    // Ensure initial industry products are seeded
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && (!row || row.count < 3)) {
        const seedList = [
          {
            name: 'Real Estate CRM Pro',
            category: 'Real Estate',
            price_label: 'Subscription Based',
            link_url: '/products/real-estate-crm',
            description: 'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, and site visit tracking.',
            features_json: JSON.stringify({
              boostValue: '+65%',
              boostLabel: 'Lead Conversion',
              timeReducedValue: '-40%',
              timeReducedLabel: 'Time Reduced',
              benefits: [
                { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
                { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
                { icon: 'shield', text: 'Role-Based Access & Database Security' }
              ]
            })
          },
          {
            name: 'WhatsApp CRM',
            category: 'Communication & AI',
            price_label: 'One-Time + Subscription',
            link_url: '/products/whatsapp-crm',
            description: 'Connect directly with customers on their favorite platform. Multi-agent routing, automated message flows, broadcast campaigns, and analytics.',
            features_json: JSON.stringify({
              boostValue: '3.5x',
              boostLabel: 'Response Speed',
              timeReducedValue: '-60%',
              timeReducedLabel: 'Resolution Time',
              benefits: [
                { icon: 'zap', text: 'Official WhatsApp Business Cloud API Integration' },
                { icon: 'refresh', text: 'Multi-Agent Routing & Shared Inbox' },
                { icon: 'trending', text: 'High-Open-Rate Automated Broadcasts' }
              ]
            })
          },
          {
            name: 'Café Management Suite',
            category: 'Hospitality',
            price_label: 'Subscription Based',
            link_url: '/products/cafe-crm',
            description: 'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, and digital menus.',
            features_json: JSON.stringify({
              boostValue: '+32%',
              boostLabel: 'Repeat Customers',
              timeReducedValue: '-50%',
              timeReducedLabel: 'Inventory Waste',
              benefits: [
                { icon: 'target', text: 'Centralized Multi-Outlet Inventory Control' },
                { icon: 'trending', text: 'Integrated Loyalty Programs & Digital Menus' },
                { icon: 'shield', text: 'Real-time Cross-Branch Sales Analytics' }
              ]
            })
          },
          {
            name: 'EduSphere Academy CRM',
            category: 'Education',
            price_label: 'Subscription Based',
            link_url: '/contact?topic=education-crm',
            description: 'All-in-one education lifecycle operating system for academies, institutes, and coaching schools. Streamlined inquiry intake, admission stages, batch allocations, and automated fee reminders.',
            features_json: JSON.stringify({
              boostValue: '+78%',
              boostLabel: 'Admission Ratio',
              timeReducedValue: '-55%',
              timeReducedLabel: 'Admin Workload',
              benefits: [
                { icon: 'target', text: 'Omnichannel Inquiry Intake & Fast Follow-up' },
                { icon: 'refresh', text: 'Automated Fee Reminders & Payment Receipts' },
                { icon: 'shield', text: 'Student Lifecycle, Batches & Attendance Logs' }
              ]
            })
          }
        ];

        seedList.forEach(p => {
          db.run(
            'INSERT OR IGNORE INTO products (name, category, price_label, link_url, description, features_json) VALUES (?, ?, ?, ?, ?, ?)',
            [p.name, p.category, p.price_label, p.link_url, p.description, p.features_json],
            () => {}
          );
        });
      }
    });

    // Ensure initial blogs are seeded
    db.get('SELECT COUNT(*) as count FROM blogs', (err, row) => {
      if (!err && (!row || row.count === 0)) {
        const seedBlogs = [
          {
            title: 'The Future of AI in Real Estate Operations',
            slug: 'future-of-ai-in-real-estate',
            category: 'Technology',
            author_id: 'Sarah Jenkins',
            image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>The real estate industry has traditionally been slow to adopt new technologies. But in 2026, the landscape has fundamentally shifted. Artificial intelligence is no longer a buzzword—it is the baseline for competitive operations.</p>
              <h2>The Data-Driven Pipeline</h2>
              <p>Before implementing intelligent systems, developers and brokers relied on fragmented data across Excel sheets, WhatsApp messages, and disconnected CRMs. Today, AI unifies this data.</p>
              <blockquote>"The companies that will survive the next decade are those that treat their lead data as an interconnected nervous system rather than isolated spreadsheets."</blockquote>
              <p>By automating the initial qualification process, sales teams are saving an average of 14 hours per week, allowing them to focus entirely on closing deals and building relationships.</p>
              <h2>Comparing Legacy and Modern Systems</h2>
              <p>Let's look at a direct comparison of traditional operations versus an AI-driven workflow.</p>
              <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="border-bottom: 2px solid rgba(255,255,255,0.2);">
                    <th style="padding: 10px; text-align: left;">Feature</th>
                    <th style="padding: 10px; text-align: left;">Legacy Systems</th>
                    <th style="padding: 10px; text-align: left;">AI-Powered CRM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 10px;">Lead Qualification</td>
                    <td style="padding: 10px;">Manual calls (Days)</td>
                    <td style="padding: 10px;">Instant via WhatsApp Bot (Seconds)</td>
                  </tr>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 10px;">Follow-ups</td>
                    <td style="padding: 10px;">Manual notes</td>
                    <td style="padding: 10px;">Predictive automated cadence</td>
                  </tr>
                </tbody>
              </table>
              <h2>Conclusion</h2>
              <p>The transition to intelligent workflows isn't just about saving time; it's about providing a superior customer experience. The future belongs to those who adapt.</p>
            `
          },
          {
            title: 'Scaling Design Systems Across Enterprise Teams',
            slug: 'design-systems-scale',
            category: 'Design',
            author_id: 'David Chen',
            image_url: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>A comprehensive guide to building, maintaining, and evolving design systems that empower developers without stifling creativity.</p>
              <h2>Foundational Principles</h2>
              <p>Every scalable design system starts with design tokens: colors, spacing, typography scales, and shadows that remain immutable across platforms.</p>
              <h2>Bridging Figma and Production Code</h2>
              <p>Automating design token extraction via GitHub Actions and Figma APIs eliminates tedious CSS recreation and human error.</p>
              <h2>Measuring Adoption and ROI</h2>
              <p>Teams leveraging a centralized token library ship user interfaces 42% faster and resolve UI inconsistencies in half the time.</p>
            `
          },
          {
            title: '5 Automation Workflows That Will Save You 10 Hours a Week',
            slug: 'automation-workflows',
            category: 'Productivity',
            author_id: 'Elena Rodriguez',
            image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>Stop doing manual data entry. These five simple automated workflows will revolutionize how your team operates.</p>
              <h2>1. Automated Inbound Lead Triage</h2>
              <p>Instant webhook dispatching from web forms directly into your sales team's WhatsApp queue with intelligent round-robin allocation.</p>
              <h2>2. Meeting Booking Calendar Sync</h2>
              <p>Sync bookings instantly to Google Calendar and trigger automatic email confirmations and reminders.</p>
              <h2>3. Daily Metric Pulse Digests</h2>
              <p>An automated cron worker aggregates daily signups, conversion rates, and revenue numbers and delivers them to Slack or WhatsApp every morning at 8:00 AM.</p>
            `
          },
          {
            title: 'Enterprise CRM Migration & Data Normalization Playbook',
            slug: 'enterprise-crm-migration-playbook',
            category: 'Architecture Playbook',
            author_id: 'Etromo Solutions Architecture',
            image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>A comprehensive operational framework for decoupling legacy lead pipelines, mitigating data loss, and implementing resilient webhook queues.</p>
              <h2>Executive Summary</h2>
              <p>Large enterprise migrations fail when companies attempt 'big bang' cutovers. This playbook details our verified dual-write migration architecture that runs legacy and modern CRMs concurrently with zero downtime.</p>
              <h2>Phase 1: Ingestion Buffer & CDC</h2>
              <p>Implement Change Data Capture (CDC) listening on primary transaction logs, queueing normalized payloads into Apache Kafka or BullMQ.</p>
              <h2>Phase 2: Reconciliation & Data Integrity</h2>
              <p>Automated parity scripts continuously compare primary key checksums between the legacy DB and target Postgres cluster.</p>
              <h2>Conclusion & Rollback Plan</h2>
              <p>With rollback checkpoints at every boundary, risk is effectively eliminated before final DNS cutover.</p>
            `
          },
          {
            title: 'Sub-Minute KYC & Zero-Trust AML Architecture Whitepaper',
            slug: 'sub-minute-kyc-aml-architecture',
            category: 'Security & Compliance',
            author_id: 'Security Engineering Team',
            image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>Architecting cryptographic audit vaults, real-time sanction list screening, and computer vision document verification pipelines.</p>
              <h2>Zero-Trust Verification Pipeline</h2>
              <p>Customer identity verification requires balance between strict regulatory compliance and friction-free onboarding.</p>
              <h2>Cryptographic Proofs & Audit Vaults</h2>
              <p>All sensitive PII is encrypted with customer-held KMS keys before storage, guaranteeing that no raw documents are leaked.</p>
              <h2>Real-time Watchlist Matching</h2>
              <p>Using in-memory Trie data structures, incoming applicants are screened against UN and OFAC sanction lists in sub-15ms.</p>
            `
          },
          {
            title: 'High-Volume Kitchen Display Systems & Offline-First Sync Specification',
            slug: 'kds-offline-first-sync-spec',
            category: 'Autonomous Systems',
            author_id: 'Hardware & Edge Systems',
            image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>Designing distributed local SQLite edge daemons for uninterrupted point-of-sale transaction processing during network loss.</p>
              <h2>The Offline Problem</h2>
              <p>When high-throughput restaurants lose internet connectivity during peak rush hours, traditional cloud-only POS systems halt operations entirely.</p>
              <h2>Local SQLite Edge Architecture</h2>
              <p>Each kitchen terminal runs an embedded SQLite replica. All orders write locally first, returning instant UI confirmation.</p>
              <h2>Conflict-Free Replicated Data Types (CRDTs)</h2>
              <p>When connectivity is restored, mutations resolve automatically using state-based CRDTs without human intervention.</p>
            `
          },
          {
            title: 'WhatsApp Cloud API for High-Velocity Sales: Production Engineering Guide',
            slug: 'whatsapp-cloud-api-production-guide',
            category: 'Messaging & AI',
            author_id: 'Etromo Messaging Group',
            image_url: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            content: `
              <p>Technical walkthrough of Meta Cloud API webhook reliability, session state management, rate limit buffering, and message templates.</p>
              <h2>Webhook Architecture & Acknowledgement</h2>
              <p>Meta requires 200 OK responses within 3 seconds. Our worker decouples webhook reception from downstream processing via Redis streams.</p>
              <h2>Handling High-Concurrency Broadcasts</h2>
              <p>Token bucket rate limiters prevent account suspensions while delivering up to 500 messages per second with optimal throughput.</p>
              <h2>Dynamic Template Ingestion</h2>
              <p>Real-time template synchronization with Meta Graph API guarantees that sales reps only dispatch approved messaging copy.</p>
            `
          }
        ];

        seedBlogs.forEach(b => {
          db.run(
            'INSERT OR IGNORE INTO blogs (title, slug, category, author_id, image_url, content) VALUES (?, ?, ?, ?, ?, ?)',
            [b.title, b.slug, b.category, b.author_id, b.image_url, b.content],
            () => {}
          );
        });
      }
    });

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
                      VALUES (?, 'client@acme.com', ?, 'John Doe', '+1 (555) 234-5678', 'CLIENT')`, [orgId, hashPassword('client123')]);

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

-- 001_initial_schema.sql
-- Upload this to Supabase (SQL Editor) to initialize the production schema.
-- Runs idempotently where possible; re-run only on a fresh/empty project.

-- ============================================
-- Core content tables
-- ============================================

CREATE TABLE IF NOT EXISTS partner_applications (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT,
  category TEXT DEFAULT 'General',
  published_date TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'published'
);

-- Technical resources / whitepapers / playbooks
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id TEXT,
  category TEXT DEFAULT 'General',
  type TEXT DEFAULT 'Technical Guide',
  description TEXT,
  excerpt TEXT,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  pdf_url TEXT,
  downloadable INTEGER DEFAULT 1,
  tags TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  features_json TEXT,
  image_url TEXT,
  price_label TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id SERIAL PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Case studies
-- ============================================

CREATE TABLE IF NOT EXISTS case_studies (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Client portal & B2B tables
-- ============================================

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  legal_name TEXT NOT NULL,
  brand_name TEXT,
  tax_id TEXT,
  primary_email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  verification_status TEXT DEFAULT 'VERIFIED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_users (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'CLIENT',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS portal_projects (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS portal_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'PENDING',
  completion_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES portal_projects(id)
);

CREATE TABLE IF NOT EXISTS portal_product_purchases (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  license_key TEXT UNIQUE,
  purchase_date TEXT,
  entitlement_type TEXT DEFAULT 'LIFETIME',
  entitlement_end_date TEXT,
  status TEXT DEFAULT 'ACTIVE',
  price_paid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS portal_historical_claims (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_invoices (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  project_id INTEGER,
  invoice_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  total_amount REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  due_date TEXT,
  status TEXT DEFAULT 'PAID',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (project_id) REFERENCES portal_projects(id)
);

CREATE TABLE IF NOT EXISTS portal_tickets (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  project_id INTEGER,
  product_id INTEGER,
  ticket_code TEXT UNIQUE,
  subject TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (project_id) REFERENCES portal_projects(id)
);

CREATE TABLE IF NOT EXISTS portal_ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message_body TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (ticket_id) REFERENCES portal_tickets(id)
);

CREATE TABLE IF NOT EXISTS portal_documents (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  project_id INTEGER,
  title TEXT NOT NULL,
  document_type TEXT DEFAULT 'REPORT',
  file_url TEXT NOT NULL,
  file_size TEXT,
  version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (project_id) REFERENCES portal_projects(id)
);

CREATE TABLE IF NOT EXISTS portal_direct_messages (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  sender_name TEXT NOT NULL,
  title TEXT NOT NULL,
  message_body TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'NORMAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS portal_audit_logs (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

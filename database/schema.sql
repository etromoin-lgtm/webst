-- Schema for SQLite Database

CREATE TABLE IF NOT EXISTS partner_applications (
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
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT,
  category TEXT DEFAULT 'General',
  published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  features_json TEXT,
  image_url TEXT,
  price_label TEXT,
  link_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
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
);

CREATE TABLE IF NOT EXISTS bookings (
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
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_studies (
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
  sort_order INTEGER DEFAULT 0,
  author TEXT DEFAULT 'Engineering Team',
  seo_title TEXT,
  seo_description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

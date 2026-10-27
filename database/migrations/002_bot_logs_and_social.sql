-- ==============================================================================
-- 002_bot_logs_and_social.sql
-- Run this script in the Supabase Dashboard -> SQL Editor
-- Includes: AI Agent Tracking Logs, Site Settings (Social Links), and SEO Settings
-- ==============================================================================

-- 1. Bot & AI Agent Real-time Tracking Logs
CREATE TABLE IF NOT EXISTS bot_logs (
  id SERIAL PRIMARY KEY,
  bot_name TEXT NOT NULL,
  bot_category TEXT NOT NULL, -- 'AI Agent', 'Search Engine', 'Social Crawler', 'Developer Agent'
  user_agent TEXT NOT NULL,
  ip_address TEXT,
  path TEXT NOT NULL,
  method TEXT DEFAULT 'GET',
  status_code INTEGER DEFAULT 200,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_logs_category ON bot_logs(bot_category);
CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at ON bot_logs(created_at DESC);

-- 2. Global Site Settings (Social Media links, Contact coordinates, Company info)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial social and contact coordinates if not present
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Etromo Technologies'),
  ('site_tagline', 'Engineering Intelligent Software, Systems & Autonomous Workflows'),
  ('site_url', 'https://etromo.in'),
  ('contact_email', 'contact@etromo.in'),
  ('contact_phone', '+91 99999 99999'),
  ('email', 'contact@etromo.in'),
  ('phone', '+91 99999 99999'),
  ('location', 'Bangalore, India & London, UK'),
  ('hours', 'Mon - Fri, 9:00 AM - 7:00 PM IST'),
  ('linkedin_url', 'https://www.linkedin.com/company/etromo'),
  ('x_url', 'https://x.com/etromoin'),
  ('github_url', 'https://github.com/etromo'),
  ('instagram_url', 'https://www.instagram.com/etromo.in'),
  ('youtube_url', 'https://www.youtube.com/@etromo'),
  ('whatsapp_url', 'https://wa.me/919999999999'),
  ('facebook_url', 'https://www.facebook.com/etromoin')
ON CONFLICT (key) DO NOTHING;

-- 3. Dynamic Page SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id SERIAL PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial SEO defaults for home page
INSERT INTO seo_settings (page, title, description, og_image) VALUES
  ('home', 'Etromo | Intelligent Enterprise Software, AI Automation & Systems', 'Next-generation software engineering, autonomous AI workflows, and enterprise operating systems designed for ambitious companies.', '/logo.png')
ON CONFLICT (page) DO NOTHING;


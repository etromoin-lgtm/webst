-- 002_bot_logs_and_social.sql
-- Migration for AI Agent & Bot Tracking Logs and Extended Site Settings

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

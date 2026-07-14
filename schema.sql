-- Cloudflare D1 Database Schema
-- Stores birthday data for short URL generation

CREATE TABLE IF NOT EXISTS birthday_links (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expires ON birthday_links(expires_at);

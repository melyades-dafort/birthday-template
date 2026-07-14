-- Create table for storing birthday customizations
CREATE TABLE IF NOT EXISTS birthday_links (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_expires_at ON birthday_links(expires_at);

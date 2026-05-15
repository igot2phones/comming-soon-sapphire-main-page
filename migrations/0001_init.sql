-- Subscribers for the Sapphire Servers waitlist.
-- The application only ever INSERTs rows. Reads happen exclusively via
-- `wrangler d1 execute --remote` from an authenticated Cloudflare account.
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at
  ON subscribers (created_at);

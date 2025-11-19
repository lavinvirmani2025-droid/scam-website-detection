-- Example PostgreSQL schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  normalized_url TEXT,
  reporter_id INTEGER REFERENCES users(id),
  description TEXT,
  screenshot_path TEXT,
  status TEXT DEFAULT 'pending',
  admin_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  reviewed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  normalized_url TEXT UNIQUE,
  verdict TEXT,
  source TEXT,
  confidence REAL,
  last_checked_at TIMESTAMP
);

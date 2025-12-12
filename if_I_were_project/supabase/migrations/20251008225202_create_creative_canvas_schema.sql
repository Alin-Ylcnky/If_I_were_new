/*
  # Creative Canvas - Collaborative Weekly Journal Schema

  1. New Tables
    - `authorized_users`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Whitelisted email addresses
      - `created_at` (timestamptz)
    
    - `weeks`
      - `id` (uuid, primary key)
      - `week_number` (integer, 1-52, unique)
      - `title` (text) - Week title
      - `created_at` (timestamptz)
    
    - `contributions`
      - `id` (uuid, primary key)
      - `week_id` (uuid, foreign key to weeks)
      - `contributor_type` (text) - Either 'A' or 'B'
      - `image_url` (text) - External image URL
      - `prompt_html` (text) - Rich text HTML for prompt
      - `quote_html` (text) - Rich text HTML for quote
      - `updated_at` (timestamptz)
      - Unique constraint on (week_id, contributor_type)

  2. Security
    - Enable RLS on all tables
    - Public SELECT access for weeks and contributions (read-only mode)
    - INSERT/UPDATE/DELETE restricted to whitelisted users only
    - authorized_users table only accessible by authenticated users

  3. Important Notes
    - All 52 weeks will be pre-populated
    - Only two users can edit content (via email whitelist)
    - Public can view all content without authentication
*/

-- Create authorized_users table
CREATE TABLE IF NOT EXISTS authorized_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create weeks table
CREATE TABLE IF NOT EXISTS weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number integer UNIQUE NOT NULL CHECK (week_number >= 1 AND week_number <= 52),
  title text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  contributor_type text NOT NULL CHECK (contributor_type IN ('A', 'B')),
  image_url text DEFAULT '',
  prompt_html text DEFAULT '',
  quote_html text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(week_id, contributor_type)
);

-- Enable Row Level Security
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authorized_users
CREATE POLICY "Authenticated users can view authorized emails"
  ON authorized_users
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for weeks
CREATE POLICY "Public can view all weeks"
  ON weeks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authorized users can update weeks"
  ON weeks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

-- RLS Policies for contributions
CREATE POLICY "Public can view all contributions"
  ON contributions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authorized users can insert contributions"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Authorized users can update contributions"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Authorized users can delete contributions"
  ON contributions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weeks_week_number ON weeks(week_number);
CREATE INDEX IF NOT EXISTS idx_contributions_week_id ON contributions(week_id);
CREATE INDEX IF NOT EXISTS idx_contributions_contributor_type ON contributions(contributor_type);

-- Pre-populate all 52 weeks
INSERT INTO weeks (week_number, title)
SELECT 
  generate_series AS week_number,
  'Week ' || generate_series AS title
FROM generate_series(1, 52)
ON CONFLICT (week_number) DO NOTHING;

-- Create contributions entries for all weeks (both contributors A and B)
INSERT INTO contributions (week_id, contributor_type)
SELECT 
  w.id,
  contributor
FROM weeks w
CROSS JOIN (VALUES ('A'), ('B')) AS contributors(contributor)
ON CONFLICT (week_id, contributor_type) DO NOTHING;
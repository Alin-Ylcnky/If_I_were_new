/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key) - Unique identifier
      - `setting_key` (text, unique) - Setting name (e.g., 'instagram_url', 'facebook_url', 'contact_email')
      - `setting_value` (text) - Setting value (URL or email)
      - `is_active` (boolean) - Whether the setting should be displayed
      - `created_at` (timestamptz) - When the setting was created
      - `updated_at` (timestamptz) - When the setting was last updated

  2. Initial Data
    - Insert placeholder rows for social media links and contact email
    - All social links start as inactive until URLs are added

  3. Security
    - Enable RLS on `site_settings` table
    - Add policy for public users to read active settings
    - Add policy for authenticated users to update settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text DEFAULT '',
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

INSERT INTO site_settings (setting_key, setting_value, is_active)
VALUES 
  ('instagram_url', '', false),
  ('contact_email', '', true),
  ('contact_email_secondary', '', false)
ON CONFLICT (setting_key) DO NOTHING;
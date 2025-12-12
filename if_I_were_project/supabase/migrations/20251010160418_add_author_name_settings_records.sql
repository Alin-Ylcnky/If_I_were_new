/*
  # Add Author Name Settings Records

  1. Changes
    - Insert `author_name_a` setting record into site_settings table
    - Insert `author_name_b` setting record into site_settings table
    - Both records set to active so they appear in Settings page
    - Both start with empty values until user enters names

  2. Notes
    - These settings will be displayed in the Footer as "Created by [name_a] & [name_b]"
    - Can be edited through the Settings page by authenticated users
    - The Footer component and Settings page UI already support these fields
    - Uses ON CONFLICT to avoid errors if records already exist
*/

INSERT INTO site_settings (setting_key, setting_value, is_active)
VALUES 
  ('author_name_a', '', true),
  ('author_name_b', '', true)
ON CONFLICT (setting_key) DO NOTHING;

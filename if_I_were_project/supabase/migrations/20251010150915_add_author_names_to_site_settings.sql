/*
  # Add Author Names to Site Settings

  1. Changes
    - Add `author_name_a` field to store first creator's name
    - Add `author_name_b` field to store second creator's name
    - Set default values to empty strings

  2. Notes
    - These fields will be displayed in the footer
    - Can be updated through the Settings page by authorized users
    - Existing RLS policies already cover these new fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'author_name_a'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN author_name_a text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'author_name_b'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN author_name_b text DEFAULT '';
  END IF;
END $$;

/*
  # Remove Unused Contribution Fields

  1. Changes
    - Drop `prompt_html` column from contributions table
    - Drop `quote_html` column from contributions table
    - Drop `link_url` column from contributions table
    - Drop `text_content` column from contributions table (keeping only text_content_html)
  
  2. Notes
    - These fields are being removed to simplify the contribution structure
    - Only image_url and text_content_html will remain as content fields
    - Using IF EXISTS to prevent errors if columns don't exist
*/

-- Drop unused columns from contributions table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'prompt_html'
  ) THEN
    ALTER TABLE contributions DROP COLUMN prompt_html;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'quote_html'
  ) THEN
    ALTER TABLE contributions DROP COLUMN quote_html;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE contributions DROP COLUMN link_url;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'text_content'
  ) THEN
    ALTER TABLE contributions DROP COLUMN text_content;
  END IF;
END $$;
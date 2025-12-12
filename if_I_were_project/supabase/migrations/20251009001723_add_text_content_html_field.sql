/*
  # Add Text Content HTML Field to Contributions

  1. Changes
    - Add `text_content_html` column to contributions table for storing rich HTML text content
  
  2. Details
    - `text_content_html` (text, nullable) - Stores rich HTML content with formatting and links
    - Optional field to maintain backward compatibility with existing data
    - Allows for formatted text, links, bold, italic, and other rich text features
  
  3. Security
    - No RLS changes needed as existing policies already cover this new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'text_content_html'
  ) THEN
    ALTER TABLE contributions ADD COLUMN text_content_html text;
  END IF;
END $$;

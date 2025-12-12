/*
  # Add Text and Link Content Fields to Contributions

  1. Changes
    - Add `text_content` column to contributions table for storing text-based entries
    - Add `link_url` column to contributions table for storing hyperlinks
  
  2. Details
    - `text_content` (text, nullable) - Stores multi-line text content for each contribution
    - `link_url` (text, nullable) - Stores URL links associated with contributions
    - Both fields are optional to maintain backward compatibility with existing data
  
  3. Security
    - No RLS changes needed as existing policies already cover these new columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'text_content'
  ) THEN
    ALTER TABLE contributions ADD COLUMN text_content text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE contributions ADD COLUMN link_url text;
  END IF;
END $$;
/*
  # Add font family support to contributions

  1. Changes
    - Add `font_family` column to `contributions` table
      - Type: text
      - Default: 'sans-serif'
      - Allows users to choose from 4 font families for their text content
  
  2. Notes
    - Default value ensures backward compatibility with existing contributions
    - Font options will be: serif, sans-serif, handwriting, and monospace
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'font_family'
  ) THEN
    ALTER TABLE contributions ADD COLUMN font_family text DEFAULT 'sans-serif';
  END IF;
END $$;
/*
  # Add image size preferences

  1. Changes
    - Add `image_size` column to `contributions` table
      - Stores the max width for image display (e.g., '400px', '600px', '800px')
      - Defaults to '600px'
    - Add `image_size` column to `our_story_images` table
      - Stores the max width for image display
      - Defaults to '600px'
  
  2. Notes
    - This allows users to control image display size independent of aspect ratio
    - The actual aspect ratio is always preserved, only the max width changes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'image_size'
  ) THEN
    ALTER TABLE contributions ADD COLUMN image_size text DEFAULT '600px';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'our_story_images' AND column_name = 'image_size'
  ) THEN
    ALTER TABLE our_story_images ADD COLUMN image_size text DEFAULT '600px';
  END IF;
END $$;
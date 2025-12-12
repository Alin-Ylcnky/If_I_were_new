/*
  # Add Text Content to Our Story Images

  1. Changes
    - Add `text_content` column to `our_story_images` table
      - Type: text (allows rich text/HTML content)
      - Nullable: allows images with or without text
      - Default: empty string

  2. Purpose
    - Enable story entries to include both images and text content
    - Support rich text formatting for storytelling
    - Maintain backward compatibility with existing image-only entries
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'our_story_images' AND column_name = 'text_content'
  ) THEN
    ALTER TABLE our_story_images ADD COLUMN text_content text DEFAULT '';
  END IF;
END $$;
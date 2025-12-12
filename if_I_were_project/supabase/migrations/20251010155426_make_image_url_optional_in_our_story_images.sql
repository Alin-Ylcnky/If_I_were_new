/*
  # Make image_url optional in our_story_images table

  1. Changes
    - Alter the `image_url` column in `our_story_images` table to be nullable
    - Add a check constraint to ensure at least one of `image_url` or `text_content` is provided
    
  2. Purpose
    - Allow entries with text content only (no image)
    - Allow entries with image only (no text)
    - Allow entries with both image and text
    - Prevent entries with neither image nor text
    
  3. Notes
    - This migration maintains data integrity by requiring at least one content type
    - Existing data will not be affected as all current entries have image_url values
*/

-- Make image_url nullable
ALTER TABLE our_story_images
ALTER COLUMN image_url DROP NOT NULL;

-- Add constraint to ensure at least one content type exists
ALTER TABLE our_story_images
ADD CONSTRAINT at_least_one_content_type 
CHECK (
  (image_url IS NOT NULL AND image_url != '') 
  OR 
  (text_content IS NOT NULL AND text_content != '')
);

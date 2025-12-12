/*
  # Create Our Story Images Table

  1. New Tables
    - `our_story_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `image_url` (text) - URL of the image
      - `caption` (text) - Caption or description for the image
      - `display_order` (integer) - Order in which images should be displayed
      - `created_at` (timestamptz) - Timestamp when image was added
      - `updated_at` (timestamptz) - Timestamp when image was last updated

  2. Security
    - Enable RLS on `our_story_images` table
    - Add policy for public read access (anyone can view the images)
    - Add policy for authorized users to insert images
    - Add policy for authorized users to update images
    - Add policy for authorized users to delete images

  3. Indexes
    - Create index on `display_order` for efficient sorting
*/

CREATE TABLE IF NOT EXISTS our_story_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE our_story_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view our story images"
  ON our_story_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authorized users can insert our story images"
  ON our_story_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Authorized users can update our story images"
  ON our_story_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Authorized users can delete our story images"
  ON our_story_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE INDEX IF NOT EXISTS idx_our_story_images_display_order 
  ON our_story_images(display_order);

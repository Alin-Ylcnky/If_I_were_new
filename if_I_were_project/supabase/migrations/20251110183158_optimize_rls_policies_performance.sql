/*
  # Optimize RLS Policies for Performance

  1. Changes
    - Replace `auth.jwt()->>'email'` with `(select auth.jwt()->>'email')` in all RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Improves query performance at scale per Supabase best practices
  
  2. Tables Updated
    - weeks: Update policy "Authorized users can update weeks"
    - contributions: Update policies for insert, update, delete
    - site_settings: Update policies for select, insert, update, delete
    - our_story_images: Update policies for insert, update, delete
  
  3. Performance Impact
    - Reduces function calls from O(n) to O(1) per query
    - Significantly improves performance for queries with multiple rows
  
  4. Notes
    - Functionality remains identical
    - Only performance optimization, no security changes
*/

-- Drop and recreate weeks policies
DROP POLICY IF EXISTS "Authorized users can update weeks" ON weeks;
CREATE POLICY "Authorized users can update weeks"
  ON weeks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

-- Drop and recreate contributions policies
DROP POLICY IF EXISTS "Authorized users can insert contributions" ON contributions;
CREATE POLICY "Authorized users can insert contributions"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can update contributions" ON contributions;
CREATE POLICY "Authorized users can update contributions"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete contributions" ON contributions;
CREATE POLICY "Authorized users can delete contributions"
  ON contributions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

-- Drop and recreate site_settings policies
DROP POLICY IF EXISTS "Anyone can view active settings" ON site_settings;
CREATE POLICY "Anyone can view active settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR (select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authorized users can update settings" ON site_settings;
CREATE POLICY "Authorized users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can insert settings" ON site_settings;
CREATE POLICY "Authorized users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete settings" ON site_settings;
CREATE POLICY "Authorized users can delete settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

-- Drop and recreate our_story_images policies
DROP POLICY IF EXISTS "Authorized users can insert our story images" ON our_story_images;
CREATE POLICY "Authorized users can insert our story images"
  ON our_story_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can update our story images" ON our_story_images;
CREATE POLICY "Authorized users can update our story images"
  ON our_story_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete our story images" ON our_story_images;
CREATE POLICY "Authorized users can delete our story images"
  ON our_story_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = (select auth.jwt()->>'email')
    )
  );
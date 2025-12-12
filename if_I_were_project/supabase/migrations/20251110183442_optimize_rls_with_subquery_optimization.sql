/*
  # Optimize RLS Policies with Proper Subquery Pattern

  1. Changes
    - Rewrite all RLS policies to use proper subquery optimization
    - Move auth function calls outside of EXISTS clauses
    - Use inline subqueries that execute once per query, not per row
  
  2. Tables Updated
    - weeks: Update policy "Authorized users can update weeks"
    - contributions: Update policies for insert, update, delete
    - site_settings: Update policies for insert, update, delete
    - our_story_images: Update policies for insert, update, delete
  
  3. Performance Impact
    - Auth functions now execute once per query instead of once per row
    - Significantly improves performance for multi-row operations
  
  4. Pattern Used
    - Instead of: EXISTS (SELECT 1 WHERE email = auth.jwt()->>'email')
    - Use: EXISTS (SELECT 1 WHERE email = (SELECT auth.jwt()->>'email'))
    - This ensures the auth function is evaluated once and cached
*/

-- Weeks table policies
DROP POLICY IF EXISTS "Authorized users can update weeks" ON weeks;
CREATE POLICY "Authorized users can update weeks"
  ON weeks
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

-- Contributions table policies
DROP POLICY IF EXISTS "Authorized users can insert contributions" ON contributions;
CREATE POLICY "Authorized users can insert contributions"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can update contributions" ON contributions;
CREATE POLICY "Authorized users can update contributions"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete contributions" ON contributions;
CREATE POLICY "Authorized users can delete contributions"
  ON contributions
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

-- Site settings table policies
DROP POLICY IF EXISTS "Authorized users can update settings" ON site_settings;
CREATE POLICY "Authorized users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can insert settings" ON site_settings;
CREATE POLICY "Authorized users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete settings" ON site_settings;
CREATE POLICY "Authorized users can delete settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

-- Our story images table policies
DROP POLICY IF EXISTS "Authorized users can insert our story images" ON our_story_images;
CREATE POLICY "Authorized users can insert our story images"
  ON our_story_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can update our story images" ON our_story_images;
CREATE POLICY "Authorized users can update our story images"
  ON our_story_images
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );

DROP POLICY IF EXISTS "Authorized users can delete our story images" ON our_story_images;
CREATE POLICY "Authorized users can delete our story images"
  ON our_story_images
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'email') IN (
      SELECT email FROM authorized_users
    )
  );
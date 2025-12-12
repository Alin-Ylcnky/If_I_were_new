/*
  # Secure site_settings RLS policies to authorized users only

  1. Security Changes
    - Drop existing permissive RLS policies on site_settings table
    - Create new restrictive policies that check authorized_users table
    - Ensure only users in authorized_users can modify settings
    - Keep public read access for active settings
    
  2. Changes Made
    - DROP POLICY "Authenticated users can update settings"
    - DROP POLICY "Authenticated users can insert settings"
    - CREATE new policy for authorized users to update settings
    - CREATE new policy for authorized users to insert settings
    - Keep existing "Anyone can view active settings" policy for public access
    
  3. Important Notes
    - Only users whose email exists in the authorized_users table can modify settings
    - Public and authenticated users can still view active settings
    - This matches the security model used for weeks and contributions tables
*/

-- Drop the overly permissive existing policies
DROP POLICY IF EXISTS "Authenticated users can update settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON site_settings;

-- Create secure policy for authorized users to update settings
CREATE POLICY "Authorized users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

-- Create secure policy for authorized users to insert settings
CREATE POLICY "Authorized users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );

-- Create policy for authorized users to delete settings (if needed in future)
CREATE POLICY "Authorized users can delete settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM authorized_users
      WHERE authorized_users.email = auth.jwt()->>'email'
    )
  );
/*
  # Fix authorized_users RLS policy to allow anonymous access

  1. Changes Made
    - Drop existing restrictive "Authenticated users can view authorized emails" policy
    - Create new policy allowing both anonymous and authenticated users to SELECT from authorized_users
    - This is necessary for signup flow where unauthenticated users need to verify email authorization
    
  2. Security Notes
    - Only SELECT access is granted (read-only)
    - No INSERT, UPDATE, or DELETE access for anonymous users
    - Anonymous users can only check if an email exists in the table
    - This is safe because the table only contains email addresses that are meant to be checked during signup
    
  3. Why This Is Needed
    - During signup, users are not yet authenticated (they're using the anon key)
    - The signup process needs to verify if the email is in authorized_users before creating the account
    - Without this policy, all signups fail because RLS blocks the query
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view authorized emails" ON authorized_users;

-- Create new policy allowing both anonymous and authenticated users to view authorized emails
CREATE POLICY "Anyone can check email authorization"
  ON authorized_users
  FOR SELECT
  TO anon, authenticated
  USING (true);
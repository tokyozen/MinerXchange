/*
  # Fix permissions and queries

  1. Changes
    - Add policies for auth.users access
    - Fix cooperative and member queries
    - Add helper functions for user roles

  2. Security
    - Add proper RLS policies for user role checking
    - Ensure proper access to user metadata
*/

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update members policies
DROP POLICY IF EXISTS "Members can be viewed by their cooperative admins" ON members;
CREATE POLICY "Members can be viewed by themselves and their admins"
  ON members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR 
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE contact_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Update cooperatives policies
DROP POLICY IF EXISTS "Public cooperatives are viewable by everyone" ON cooperatives;
CREATE POLICY "Cooperatives are viewable by members and admins"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    id IN (
      SELECT cooperative_id FROM members 
      WHERE user_id = auth.uid()
    )
  );
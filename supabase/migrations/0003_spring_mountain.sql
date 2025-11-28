/*
  # Fix recursive RLS policies

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Add direct user role checks
    - Improve policy efficiency

  2. Security
    - Maintain proper access control
    - Fix infinite recursion issues
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Members can be viewed by themselves and their admins" ON members;
DROP POLICY IF EXISTS "Cooperatives are viewable by members and admins" ON cooperatives;

-- Simplified members policies
CREATE POLICY "Members can view their own data"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view cooperative members"
  ON members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
      AND email IN (
        SELECT contact_email FROM cooperatives
        WHERE id = members.cooperative_id
      )
    )
  );

-- Simplified cooperatives policies
CREATE POLICY "Users can view their cooperative"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = (
      SELECT email FROM auth.users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Members can view their associated cooperative"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.cooperative_id = cooperatives.id
      AND members.user_id = auth.uid()
    )
  );
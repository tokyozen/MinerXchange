/*
  # Fix Recursive Policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify member and cooperative access policies
    - Add proper indexes for performance
    - Update RLS policies to be more direct and efficient

  2. Security
    - Maintain proper access control
    - Ensure data isolation between cooperatives
    - Prevent unauthorized access
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "member_self_access" ON members;
DROP POLICY IF EXISTS "admin_member_access" ON members;
DROP POLICY IF EXISTS "cooperative_admin_access" ON cooperatives;
DROP POLICY IF EXISTS "cooperative_member_access" ON cooperatives;
DROP POLICY IF EXISTS "cooperative_admin_insert_members" ON members;

-- Create efficient indexes
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_cooperative_id ON members(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperatives_contact_email ON cooperatives(contact_email);

-- Simple policy for members to view their own data
CREATE POLICY "view_own_member_data"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Simple policy for cooperative admins to view their members
CREATE POLICY "admin_view_cooperative_members"
  ON members FOR SELECT
  TO authenticated
  USING (
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE contact_email = auth.jwt()->>'email'
    )
  );

-- Simple policy for cooperative admins to insert members
CREATE POLICY "admin_insert_members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE contact_email = auth.jwt()->>'email'
    )
  );

-- Simple policy for viewing cooperatives
CREATE POLICY "view_cooperative"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = auth.jwt()->>'email'
    OR
    id IN (
      SELECT cooperative_id FROM members
      WHERE user_id = auth.uid()
    )
  );

-- Simple policy for inserting cooperatives
CREATE POLICY "insert_cooperative"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');
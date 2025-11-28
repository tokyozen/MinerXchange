/*
  # Fix RLS Policies and Add Indexes

  1. Changes
    - Further simplify RLS policies to prevent recursion
    - Add indexes for better query performance
    - Update member access patterns
    - Optimize cooperative access

  2. Security
    - Maintain secure access control
    - Prevent unauthorized access
    - Optimize query performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Members access their own data" ON members;
DROP POLICY IF EXISTS "Cooperatives access control" ON cooperatives;
DROP POLICY IF EXISTS "Members insert control" ON members;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS members_user_id_idx ON members(user_id);
CREATE INDEX IF NOT EXISTS members_cooperative_id_idx ON members(cooperative_id);
CREATE INDEX IF NOT EXISTS cooperatives_contact_email_idx ON cooperatives(contact_email);

-- Simplified member policies
CREATE POLICY "member_self_access"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admin_member_access"
  ON members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM cooperatives 
      WHERE id = members.cooperative_id 
      AND contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Simplified cooperative policies
CREATE POLICY "cooperative_admin_access"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (contact_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "cooperative_member_access"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT cooperative_id 
      FROM members 
      WHERE members.user_id = auth.uid()
    )
  );

-- Direct insert policy for members
CREATE POLICY "cooperative_admin_insert_members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM cooperatives 
      WHERE id = cooperative_id 
      AND contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
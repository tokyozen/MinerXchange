/*
  # Fix Recursive Policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create new non-recursive policies for members and cooperatives
    - Add optimized indexes for better performance
    - Simplify policy logic to prevent recursion
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "member_select_policy" ON members;
DROP POLICY IF EXISTS "member_insert_policy" ON members;
DROP POLICY IF EXISTS "cooperative_select_policy" ON cooperatives;
DROP POLICY IF EXISTS "cooperative_insert_policy" ON cooperatives;

-- Create base indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_cooperative_id ON members(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperatives_contact_email ON cooperatives(contact_email);

-- Member policies
CREATE POLICY "member_read_own"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "member_read_cooperative"
  ON members FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' IN (
      SELECT contact_email 
      FROM cooperatives 
      WHERE id = cooperative_id
    )
  );

CREATE POLICY "member_insert_by_admin"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'email' IN (
      SELECT contact_email 
      FROM cooperatives 
      WHERE id = cooperative_id
    )
  );

-- Cooperative policies
CREATE POLICY "cooperative_read_own"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (contact_email = auth.jwt()->>'email');

CREATE POLICY "cooperative_read_member"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT cooperative_id 
      FROM members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cooperative_insert"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');
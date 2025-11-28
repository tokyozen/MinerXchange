/*
  # Fix Member and Cooperative Issues

  1. Changes
    - Drop problematic policies
    - Add proper single-row member lookup
    - Fix cooperative policies
    - Add proper error handling for no rows
    - Update member stats function
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "member_select_self" ON members;
DROP POLICY IF EXISTS "member_select_as_admin" ON members;
DROP POLICY IF EXISTS "member_insert_as_admin" ON members;
DROP POLICY IF EXISTS "cooperative_select_as_admin" ON cooperatives;
DROP POLICY IF EXISTS "cooperative_select_as_member" ON members;
DROP POLICY IF EXISTS "cooperative_insert_self" ON cooperatives;

-- Create proper member lookup function
CREATE OR REPLACE FUNCTION get_current_member()
RETURNS members AS $$
  SELECT *
  FROM members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create proper cooperative lookup function
CREATE OR REPLACE FUNCTION get_current_cooperative()
RETURNS cooperatives AS $$
  SELECT *
  FROM cooperatives
  WHERE contact_email = auth.jwt()->>'email'
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_cooperative_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM cooperatives 
    WHERE contact_email = auth.jwt()->>'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Member policies
CREATE POLICY "members_select_policy"
  ON members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM cooperatives 
      WHERE id = members.cooperative_id 
      AND contact_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "members_insert_policy"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM cooperatives 
      WHERE id = cooperative_id 
      AND contact_email = auth.jwt()->>'email'
    )
  );

-- Cooperative policies
CREATE POLICY "cooperatives_select_policy"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = auth.jwt()->>'email' OR
    id IN (
      SELECT cooperative_id 
      FROM members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cooperatives_insert_policy"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');

-- Update member stats function to handle no rows
CREATE OR REPLACE FUNCTION get_member_stats(member_id uuid)
RETURNS TABLE (
  total_listings bigint,
  total_submissions bigint,
  total_quantity numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ms.total_listings, 0::bigint) as total_listings,
    COALESCE(ms.total_submissions, 0::bigint) as total_submissions,
    COALESCE(ms.total_quantity, 0::numeric) as total_quantity
  FROM member_stats ms
  WHERE ms.member_id = $1;
  
  -- If no rows returned, return zeros
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0::bigint, 0::bigint, 0::numeric;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
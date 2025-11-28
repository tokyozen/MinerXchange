/*
  # Fix Recursive Policies

  1. Changes
    - Drop all existing policies on members and cooperatives
    - Create new non-recursive policies using direct user comparisons
    - Add helper functions for policy checks
    - Update member stats view
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "members_self_access" ON members;
DROP POLICY IF EXISTS "members_admin_access" ON members;
DROP POLICY IF EXISTS "cooperative_select_policy" ON cooperatives;
DROP POLICY IF EXISTS "cooperative_insert_policy" ON cooperatives;

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin_of_cooperative(cooperative_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM cooperatives 
    WHERE id = cooperative_id 
    AND contact_email = auth.jwt()->>'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple member policies
CREATE POLICY "member_select_self"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "member_select_as_admin"
  ON members FOR SELECT
  TO authenticated
  USING (is_admin_of_cooperative(cooperative_id));

CREATE POLICY "member_insert_as_admin"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_of_cooperative(cooperative_id));

-- Simple cooperative policies
CREATE POLICY "cooperative_select_as_admin"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (contact_email = auth.jwt()->>'email');

CREATE POLICY "cooperative_select_as_member"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "cooperative_insert_self"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');

-- Drop and recreate member stats view without recursive joins
DROP MATERIALIZED VIEW IF EXISTS member_stats;
CREATE MATERIALIZED VIEW member_stats AS
WITH listing_stats AS (
  SELECT 
    member_id,
    COUNT(*) as total_listings
  FROM mineral_listings
  GROUP BY member_id
),
submission_stats AS (
  SELECT 
    member_id,
    COUNT(*) as total_submissions,
    COALESCE(SUM(quantity), 0) as total_quantity
  FROM mineral_submissions
  GROUP BY member_id
)
SELECT 
  m.id as member_id,
  COALESCE(l.total_listings, 0) as total_listings,
  COALESCE(s.total_submissions, 0) as total_submissions,
  COALESCE(s.total_quantity, 0) as total_quantity
FROM members m
LEFT JOIN listing_stats l ON l.member_id = m.id
LEFT JOIN submission_stats s ON s.member_id = m.id;
/*
  # Fix Member Policies and Stats

  1. Changes
    - Drop problematic policies
    - Create simplified, non-recursive policies
    - Add materialized view for stats
    - Add function for member stats
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "member_read_own" ON members;
DROP POLICY IF EXISTS "member_read_cooperative" ON members;
DROP POLICY IF EXISTS "member_insert_by_admin" ON members;

-- Create simplified policies
CREATE POLICY "members_self_access"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "members_admin_access"
  ON members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM cooperatives
      WHERE cooperatives.id = members.cooperative_id
      AND cooperatives.contact_email = current_user
    )
  );

-- Create materialized view for member stats
CREATE MATERIALIZED VIEW IF NOT EXISTS member_stats AS
SELECT 
  m.id AS member_id,
  COUNT(DISTINCT ml.id) AS total_listings,
  COUNT(DISTINCT ms.id) AS total_submissions,
  COALESCE(SUM(ms.quantity), 0) AS total_quantity
FROM members m
LEFT JOIN mineral_listings ml ON ml.member_id = m.id
LEFT JOIN mineral_submissions ms ON ms.member_id = m.id
GROUP BY m.id;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS member_stats_member_id_idx ON member_stats(member_id);

-- Create function to refresh stats
CREATE OR REPLACE FUNCTION refresh_member_stats()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY member_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh stats
CREATE TRIGGER refresh_member_stats_on_listing
AFTER INSERT OR UPDATE OR DELETE ON mineral_listings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_member_stats();

CREATE TRIGGER refresh_member_stats_on_submission
AFTER INSERT OR UPDATE OR DELETE ON mineral_submissions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_member_stats();

-- Create function to get member stats
CREATE OR REPLACE FUNCTION get_member_stats(member_id uuid)
RETURNS TABLE (
  total_listings bigint,
  total_submissions bigint,
  total_quantity numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ms.total_listings,
    ms.total_submissions,
    ms.total_quantity
  FROM member_stats ms
  WHERE ms.member_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
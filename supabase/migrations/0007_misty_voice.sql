-- Drop existing problematic policies
DROP POLICY IF EXISTS "view_own_member_data" ON members;
DROP POLICY IF EXISTS "admin_view_cooperative_members" ON members;
DROP POLICY IF EXISTS "admin_insert_members" ON members;
DROP POLICY IF EXISTS "view_cooperative" ON cooperatives;
DROP POLICY IF EXISTS "insert_cooperative" ON cooperatives;

-- Create non-recursive policies for members
CREATE POLICY "members_read_policy"
  ON members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM cooperatives c
      WHERE c.id = members.cooperative_id
      AND c.contact_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "members_insert_policy"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cooperatives c
      WHERE c.id = cooperative_id
      AND c.contact_email = auth.jwt()->>'email'
    )
  );

-- Create non-recursive policies for cooperatives
CREATE POLICY "cooperatives_read_policy"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = auth.jwt()->>'email' OR
    id IN (
      SELECT cooperative_id FROM members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cooperatives_insert_policy"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');
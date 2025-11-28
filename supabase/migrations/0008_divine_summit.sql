-- Drop existing problematic policies
DROP POLICY IF EXISTS "members_read_policy" ON members;
DROP POLICY IF EXISTS "members_insert_policy" ON members;
DROP POLICY IF EXISTS "cooperatives_read_policy" ON cooperatives;
DROP POLICY IF EXISTS "cooperatives_insert_policy" ON cooperatives;

-- Create simplified member policies
CREATE POLICY "member_select_policy"
  ON members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE contact_email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "member_insert_policy"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE contact_email = auth.jwt()->>'email'
    )
  );

-- Create simplified cooperative policies
CREATE POLICY "cooperative_select_policy"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    contact_email = auth.jwt()->>'email' OR
    id IN (
      SELECT cooperative_id FROM members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cooperative_insert_policy"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (contact_email = auth.jwt()->>'email');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_user_cooperative ON members(user_id, cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperatives_email ON cooperatives(contact_email);
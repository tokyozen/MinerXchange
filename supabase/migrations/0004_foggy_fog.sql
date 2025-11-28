/*
  # Fix RLS Policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify member access policies
    - Update cooperative access policies
    - Add direct user-based policies

  2. Security
    - Maintain proper access control
    - Prevent unauthorized access
    - Enable proper member and admin access patterns
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Members can view their own data" ON members;
DROP POLICY IF EXISTS "Admins can view cooperative members" ON members;
DROP POLICY IF EXISTS "Users can view their cooperative" ON cooperatives;
DROP POLICY IF EXISTS "Members can view their associated cooperative" ON cooperatives;

-- Simplified members policies
CREATE POLICY "Members access their own data"
  ON members FOR SELECT
  TO authenticated
  USING (
    -- Direct user match
    user_id = auth.uid()
    OR
    -- Admin access through cooperative
    EXISTS (
      SELECT 1 FROM cooperatives
      WHERE cooperatives.id = members.cooperative_id
      AND cooperatives.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Simplified cooperatives policies
CREATE POLICY "Cooperatives access control"
  ON cooperatives FOR SELECT
  TO authenticated
  USING (
    -- Direct admin access
    contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- Member access
    id IN (
      SELECT cooperative_id FROM members
      WHERE user_id = auth.uid()
    )
  );

-- Update insert policies to be more direct
CREATE POLICY "Members insert control"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cooperatives
      WHERE cooperatives.id = cooperative_id
      AND cooperatives.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
/*
  # Initial Schema for Miner Exchange Platform

  1. New Tables
    - `cooperatives`
      - Basic information about mining cooperatives
      - Managed by cooperative admins
    - `members`
      - Individual miners belonging to cooperatives
      - Linked to cooperatives and auth.users
    - `mineral_listings`
      - Details of minerals listed by members
      - Tracks quantity, type, and status
    - `mineral_submissions`
      - Records of mineral submissions
      - Includes verification status and timestamps

  2. Security
    - Enable RLS on all tables
    - Policies for cooperative admins and members
    - Public read access for aggregated data
*/

-- Cooperatives table
CREATE TABLE cooperatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  cooperative_id uuid REFERENCES cooperatives NOT NULL,
  full_name text NOT NULL,
  member_id text NOT NULL,
  phone_number text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cooperative_id, member_id)
);

-- Mineral listings table
CREATE TABLE mineral_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members NOT NULL,
  mineral_type text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  quality_grade text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold')),
  price_per_unit numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mineral submissions table
CREATE TABLE mineral_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES mineral_listings NOT NULL,
  member_id uuid REFERENCES members NOT NULL,
  quantity numeric NOT NULL,
  submission_date timestamptz DEFAULT now(),
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by uuid REFERENCES auth.users,
  verification_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mineral_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mineral_submissions ENABLE ROW LEVEL SECURITY;

-- Cooperative admin role
CREATE TYPE user_role AS ENUM ('admin', 'member');

-- Add role to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'member';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS cooperative_id uuid REFERENCES cooperatives;

-- Policies for cooperatives
CREATE POLICY "Public cooperatives are viewable by everyone"
  ON cooperatives FOR SELECT
  USING (true);

CREATE POLICY "Cooperatives can be created by admin users"
  ON cooperatives FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for members
CREATE POLICY "Members can be viewed by their cooperative admins"
  ON members FOR SELECT
  TO authenticated
  USING (
    cooperative_id = (SELECT cooperative_id FROM auth.users WHERE id = auth.uid())
    OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Members can be managed by cooperative admins"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    cooperative_id = (SELECT cooperative_id FROM auth.users WHERE id = auth.uid())
    AND
    auth.jwt() ->> 'role' = 'admin'
  );

-- Policies for mineral listings
CREATE POLICY "Listings are viewable by everyone"
  ON mineral_listings FOR SELECT
  USING (true);

CREATE POLICY "Members can create their own listings"
  ON mineral_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- Policies for submissions
CREATE POLICY "Submissions are viewable by related parties"
  ON mineral_submissions FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
    OR
    member_id IN (
      SELECT id FROM members 
      WHERE cooperative_id = (
        SELECT cooperative_id FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can create their own submissions"
  ON mineral_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- Functions for aggregated totals
CREATE OR REPLACE FUNCTION get_cooperative_totals(cooperative_id uuid)
RETURNS TABLE (
  total_submissions bigint,
  total_quantity numeric,
  total_verified numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_submissions,
    SUM(s.quantity) as total_quantity,
    SUM(CASE WHEN s.verification_status = 'verified' THEN s.quantity ELSE 0 END) as total_verified
  FROM mineral_submissions s
  JOIN members m ON s.member_id = m.id
  WHERE m.cooperative_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
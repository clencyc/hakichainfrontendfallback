/*
  # Initial Schema Setup for HakiChain

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - role (text)
      - avatar_url (text)
      - bio (text)
      - location (text)
      - lsk_number (text) - for lawyers
      - organization (text) - for NGOs
      - specializations (text[]) - for lawyers
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - bounties
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - ngo_id (uuid, references users)
      - total_amount (numeric)
      - raised_amount (numeric)
      - status (text)
      - category (text)
      - location (text)
      - due_date (timestamptz)
      - tags (text[])
      - impact (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - milestones
      - id (uuid, primary key)
      - bounty_id (uuid, references bounties)
      - title (text)
      - description (text)
      - amount (numeric)
      - due_date (timestamptz)
      - status (text)
      - proof_required (text)
      - proof_submitted (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - donations
      - id (uuid, primary key)
      - bounty_id (uuid, references bounties)
      - donor_id (uuid, references users)
      - amount (numeric)
      - tx_hash (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations based on user roles
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('lawyer', 'ngo', 'donor')),
  avatar_url text,
  bio text,
  location text,
  lsk_number text,
  organization text,
  specializations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bounties table
CREATE TABLE bounties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ngo_id uuid REFERENCES users(id) NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  raised_amount numeric NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  category text NOT NULL,
  location text NOT NULL,
  due_date timestamptz NOT NULL,
  tags text[],
  impact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'completed')),
  proof_required text NOT NULL,
  proof_submitted jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  donor_id uuid REFERENCES users(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  tx_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for bounties
CREATE POLICY "Anyone can read bounties"
  ON bounties
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can create bounties"
  ON bounties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ngo'
    )
  );

CREATE POLICY "NGOs can update their own bounties"
  ON bounties
  FOR UPDATE
  TO authenticated
  USING (ngo_id = auth.uid());

-- RLS Policies for milestones
CREATE POLICY "Anyone can read milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can create milestones"
  ON milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bounties b
      WHERE b.id = bounty_id
      AND b.ngo_id = auth.uid()
    )
  );

CREATE POLICY "NGOs and lawyers can update milestones"
  ON milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bounties b
      WHERE b.id = bounty_id
      AND (
        b.ngo_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role = 'lawyer'
        )
      )
    )
  );

-- RLS Policies for donations
CREATE POLICY "Anyone can read donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

-- Create function to update bounty raised amount
CREATE OR REPLACE FUNCTION update_bounty_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE bounties
    SET raised_amount = raised_amount + NEW.amount
    WHERE id = NEW.bounty_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE bounties
    SET raised_amount = raised_amount - OLD.amount
    WHERE id = OLD.bounty_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating bounty raised amount
CREATE TRIGGER update_bounty_raised_amount
AFTER INSERT OR DELETE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_bounty_raised_amount();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bounties_updated_at
BEFORE UPDATE ON bounties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON milestones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
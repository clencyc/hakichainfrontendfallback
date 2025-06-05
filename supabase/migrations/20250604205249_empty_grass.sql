/*
  # Create donor-related tables

  1. New Tables
    - `donor_preferences`
      - Stores donor preferences for cause recommendations
    - `donor_tax_documents`
      - Stores tax-related documents for donations
    - `recurring_donations`
      - Manages recurring donation settings
    - `donation_shares`
      - Tracks social sharing of donations

  2. Security
    - Enable RLS on all tables
    - Add policies for donor access
*/

-- Donor Preferences Table
CREATE TABLE IF NOT EXISTS donor_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id) NOT NULL,
  preferred_categories text[] DEFAULT '{}',
  preferred_locations text[] DEFAULT '{}',
  min_amount numeric DEFAULT 0,
  max_amount numeric,
  notification_frequency text DEFAULT 'weekly',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(donor_id)
);

ALTER TABLE donor_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can manage their preferences"
  ON donor_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Donor Tax Documents Table
CREATE TABLE IF NOT EXISTS donor_tax_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id) NOT NULL,
  year integer NOT NULL,
  document_url text NOT NULL,
  total_donations numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donor_tax_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can view their tax documents"
  ON donor_tax_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

-- Recurring Donations Table
CREATE TABLE IF NOT EXISTS recurring_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  frequency text NOT NULL,
  next_donation_date timestamptz NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recurring_donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can manage their recurring donations"
  ON recurring_donations
  FOR ALL
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Donation Shares Table
CREATE TABLE IF NOT EXISTS donation_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES donations(id) NOT NULL,
  donor_id uuid REFERENCES users(id) NOT NULL,
  platform text NOT NULL,
  share_url text NOT NULL,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donation_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can manage their shares"
  ON donation_shares
  FOR ALL
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Add trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_donor_preferences_updated_at
  BEFORE UPDATE ON donor_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donor_tax_documents_updated_at
  BEFORE UPDATE ON donor_tax_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_donations_updated_at
  BEFORE UPDATE ON recurring_donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
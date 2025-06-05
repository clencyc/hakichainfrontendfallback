/*
  # Add lawyer-specific tables and relationships

  1. New Tables
    - lawyer_applications (for tracking bounty applications)
    - lawyer_reviews (for storing lawyer ratings and reviews)
    - lawyer_specializations (for managing lawyer expertise areas)

  2. Security
    - Enable RLS on all new tables
    - Add policies for appropriate access control
*/

-- Create lawyer_applications table
CREATE TABLE lawyer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  cover_letter text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lawyer_id, bounty_id)
);

-- Create lawyer_reviews table
CREATE TABLE lawyer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  reviewer_id uuid REFERENCES users(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, bounty_id)
);

-- Create lawyer_specializations table
CREATE TABLE lawyer_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  specialization text NOT NULL,
  years_experience integer NOT NULL CHECK (years_experience >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(lawyer_id, specialization)
);

-- Enable RLS
ALTER TABLE lawyer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specializations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lawyer_applications
CREATE POLICY "Lawyers can read their own applications"
  ON lawyer_applications
  FOR SELECT
  TO authenticated
  USING (lawyer_id = auth.uid());

CREATE POLICY "Lawyers can create applications"
  ON lawyer_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lawyer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'lawyer'
    )
  );

CREATE POLICY "NGOs can read applications for their bounties"
  ON lawyer_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bounties
      WHERE id = bounty_id
      AND ngo_id = auth.uid()
    )
  );

-- RLS Policies for lawyer_reviews
CREATE POLICY "Anyone can read reviews"
  ON lawyer_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can create reviews for their bounties"
  ON lawyer_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bounties
      WHERE id = bounty_id
      AND ngo_id = auth.uid()
    )
  );

-- RLS Policies for lawyer_specializations
CREATE POLICY "Anyone can read specializations"
  ON lawyer_specializations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Lawyers can manage their specializations"
  ON lawyer_specializations
  FOR ALL
  TO authenticated
  USING (lawyer_id = auth.uid())
  WITH CHECK (lawyer_id = auth.uid());

-- Create trigger for updating timestamps
CREATE TRIGGER update_lawyer_applications_updated_at
  BEFORE UPDATE ON lawyer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
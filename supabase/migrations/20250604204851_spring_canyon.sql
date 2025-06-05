-- Create lawyer_matching_preferences table
CREATE TABLE lawyer_matching_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  max_active_cases integer NOT NULL DEFAULT 5,
  preferred_locations text[],
  preferred_case_types text[],
  min_bounty_amount numeric,
  max_travel_distance integer, -- in kilometers
  available_hours jsonb, -- weekly availability
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lawyer_id)
);

-- Create lawyer_matching_scores table to cache matching results
CREATE TABLE lawyer_matching_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  factors jsonb NOT NULL, -- detailed scoring factors
  created_at timestamptz DEFAULT now(),
  UNIQUE(lawyer_id, bounty_id)
);

-- Enable RLS
ALTER TABLE lawyer_matching_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_matching_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Lawyers can manage their matching preferences"
  ON lawyer_matching_preferences
  FOR ALL
  TO authenticated
  USING (lawyer_id = auth.uid())
  WITH CHECK (lawyer_id = auth.uid());

CREATE POLICY "Anyone can read matching scores"
  ON lawyer_matching_scores
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to calculate matching score
CREATE OR REPLACE FUNCTION calculate_lawyer_matching_score(
  lawyer_id uuid,
  bounty_id uuid
)
RETURNS numeric AS $$
DECLARE
  lawyer_record RECORD;
  bounty_record RECORD;
  preferences_record RECORD;
  total_score numeric := 0;
  specialization_score numeric := 0;
  location_score numeric := 0;
  experience_score numeric := 0;
  availability_score numeric := 0;
  factors jsonb;
BEGIN
  -- Get lawyer details
  SELECT * INTO lawyer_record
  FROM users
  WHERE id = lawyer_id AND role = 'lawyer';

  -- Get bounty details
  SELECT * INTO bounty_record
  FROM bounties
  WHERE id = bounty_id;

  -- Get lawyer preferences
  SELECT * INTO preferences_record
  FROM lawyer_matching_preferences
  WHERE lawyer_id = lawyer_record.id;

  -- Calculate specialization match (30%)
  SELECT 
    CASE 
      WHEN bounty_record.category = ANY(lawyer_record.specializations) THEN 30
      WHEN EXISTS (
        SELECT 1 FROM lawyer_specializations
        WHERE lawyer_id = lawyer_record.id
        AND specialization = bounty_record.category
      ) THEN 25
      ELSE 10
    END
  INTO specialization_score;

  -- Calculate location match (25%)
  SELECT 
    CASE
      WHEN bounty_record.location = lawyer_record.location THEN 25
      WHEN bounty_record.location = ANY(preferences_record.preferred_locations) THEN 20
      ELSE 10
    END
  INTO location_score;

  -- Calculate experience score (25%)
  SELECT 
    CASE
      WHEN EXISTS (
        SELECT 1 FROM lawyer_cases
        WHERE lawyer_id = lawyer_record.id
        AND status = 'completed'
        AND bounty_id IN (
          SELECT id FROM bounties
          WHERE category = bounty_record.category
        )
      ) THEN 25
      ELSE 15
    END
  INTO experience_score;

  -- Calculate availability score (20%)
  SELECT 
    CASE
      WHEN (
        SELECT COUNT(*) FROM lawyer_cases
        WHERE lawyer_id = lawyer_record.id
        AND status = 'active'
      ) < COALESCE(preferences_record.max_active_cases, 5) THEN 20
      ELSE 10
    END
  INTO availability_score;

  -- Calculate total score
  total_score := specialization_score + location_score + experience_score + availability_score;

  -- Store factors
  factors := jsonb_build_object(
    'specialization', specialization_score,
    'location', location_score,
    'experience', experience_score,
    'availability', availability_score
  );

  -- Update or insert matching score
  INSERT INTO lawyer_matching_scores (lawyer_id, bounty_id, score, factors)
  VALUES (lawyer_id, bounty_id, total_score, factors)
  ON CONFLICT (lawyer_id, bounty_id)
  DO UPDATE SET 
    score = total_score,
    factors = factors,
    created_at = now();

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Create function to get top matching lawyers for a bounty
CREATE OR REPLACE FUNCTION get_matching_lawyers(
  bounty_id uuid,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  lawyer_id uuid,
  name text,
  email text,
  location text,
  specializations text[],
  matching_score numeric,
  matching_factors jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as lawyer_id,
    u.name,
    u.email,
    u.location,
    u.specializations,
    ms.score as matching_score,
    ms.factors as matching_factors
  FROM users u
  LEFT JOIN lawyer_matching_scores ms ON ms.lawyer_id = u.id AND ms.bounty_id = $1
  WHERE u.role = 'lawyer'
  ORDER BY ms.score DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update matching scores when relevant data changes
CREATE OR REPLACE FUNCTION update_matching_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate matching scores for affected bounty/lawyer
  PERFORM calculate_lawyer_matching_score(
    CASE 
      WHEN TG_TABLE_NAME = 'users' THEN NEW.id
      WHEN TG_TABLE_NAME = 'lawyer_specializations' THEN NEW.lawyer_id
      WHEN TG_TABLE_NAME = 'lawyer_cases' THEN NEW.lawyer_id
    END,
    CASE 
      WHEN TG_TABLE_NAME = 'bounties' THEN NEW.id
      ELSE NULL
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lawyer_matching_scores
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
WHEN (NEW.role = 'lawyer')
EXECUTE FUNCTION update_matching_scores();

CREATE TRIGGER update_bounty_matching_scores
AFTER INSERT OR UPDATE ON bounties
FOR EACH ROW
EXECUTE FUNCTION update_matching_scores();

CREATE TRIGGER update_specialization_matching_scores
AFTER INSERT OR UPDATE ON lawyer_specializations
FOR EACH ROW
EXECUTE FUNCTION update_matching_scores();

CREATE TRIGGER update_cases_matching_scores
AFTER INSERT OR UPDATE ON lawyer_cases
FOR EACH ROW
EXECUTE FUNCTION update_matching_scores();
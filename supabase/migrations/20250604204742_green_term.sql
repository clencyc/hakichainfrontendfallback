-- Create lawyer_cases table
CREATE TABLE lawyer_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  billable_hours numeric NOT NULL DEFAULT 0,
  hourly_rate numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create case_notes table
CREATE TABLE case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES lawyer_cases(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create case_events table
CREATE TABLE case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES lawyer_cases(id) NOT NULL,
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('hearing', 'meeting', 'deadline', 'other')),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create case_invoices table
CREATE TABLE case_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES lawyer_cases(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  due_date timestamptz NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lawyer_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Lawyers can read their own cases"
  ON lawyer_cases
  FOR SELECT
  TO authenticated
  USING (lawyer_id = auth.uid());

CREATE POLICY "Lawyers can manage their case notes"
  ON case_notes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE id = case_id
      AND lawyer_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can manage their case events"
  ON case_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE id = case_id
      AND lawyer_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can manage their invoices"
  ON case_invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawyer_cases
      WHERE id = case_id
      AND lawyer_id = auth.uid()
    )
  );

-- Create triggers for updating timestamps
CREATE TRIGGER update_lawyer_cases_updated_at
  BEFORE UPDATE ON lawyer_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_notes_updated_at
  BEFORE UPDATE ON case_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_events_updated_at
  BEFORE UPDATE ON case_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_invoices_updated_at
  BEFORE UPDATE ON case_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
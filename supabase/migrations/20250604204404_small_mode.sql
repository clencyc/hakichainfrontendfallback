/*
  # Add document management system

  1. New Tables
    - `documents` table for storing document metadata
      - `id` (uuid, primary key)
      - `name` (text)
      - `path` (text)
      - `uploaded_by` (uuid, references users)
      - `bounty_id` (uuid, references bounties, nullable)
      - `milestone_id` (uuid, references milestones, nullable)
      - `size` (bigint)
      - `type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for document access control
*/

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  uploaded_by uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id),
  milestone_id uuid REFERENCES milestones(id),
  size bigint NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can read documents for their bounties"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bounties
      WHERE id = bounty_id
      AND (
        ngo_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role = 'lawyer'
        )
      )
    )
  );

CREATE POLICY "Users can upload documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Create trigger for updating timestamps
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
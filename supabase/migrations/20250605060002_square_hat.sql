/*
  # Add assigned lawyer to bounties table

  1. Changes
    - Add `assigned_lawyer_id` column to bounties table
    - Add foreign key constraint to users table
    - Add index for performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add assigned_lawyer_id column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bounties' AND column_name = 'assigned_lawyer_id'
  ) THEN
    ALTER TABLE bounties 
    ADD COLUMN assigned_lawyer_id uuid REFERENCES users(id);

    -- Add an index for better query performance
    CREATE INDEX IF NOT EXISTS bounties_assigned_lawyer_id_idx 
    ON bounties(assigned_lawyer_id);
  END IF;
END $$;
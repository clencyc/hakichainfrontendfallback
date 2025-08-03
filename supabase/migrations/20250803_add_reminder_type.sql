-- Add reminder_type column to lawyer_reminders table
ALTER TABLE lawyer_reminders 
ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT 'follow_up';

-- Add lawyer_id column if it doesn't exist (without foreign key constraint for now)
ALTER TABLE lawyer_reminders 
ADD COLUMN IF NOT EXISTS lawyer_id text;

-- Drop the foreign key constraint if it exists
ALTER TABLE lawyer_reminders 
DROP CONSTRAINT IF EXISTS lawyer_reminders_lawyer_id_fkey;

-- Create an index on lawyer_id for better performance
CREATE INDEX IF NOT EXISTS idx_lawyer_reminders_lawyer_id ON lawyer_reminders(lawyer_id);

-- Update any existing records to have a default reminder_type
UPDATE lawyer_reminders 
SET reminder_type = 'follow_up' 
WHERE reminder_type IS NULL;

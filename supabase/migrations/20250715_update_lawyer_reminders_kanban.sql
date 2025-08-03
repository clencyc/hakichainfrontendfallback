-- Migration: Update lawyer_reminders table for Kanban functionality
-- Add new status values and reminder_type field

-- Update the status column to support new Kanban statuses
ALTER TABLE lawyer_reminders 
DROP CONSTRAINT IF EXISTS lawyer_reminders_status_check;

ALTER TABLE lawyer_reminders 
ADD CONSTRAINT lawyer_reminders_status_check 
CHECK (status IN ('pending', 'in_progress', 'sent', 'completed'));

-- Add reminder_type field
ALTER TABLE lawyer_reminders 
ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT 'follow_up';

-- Add constraint for reminder_type
ALTER TABLE lawyer_reminders 
ADD CONSTRAINT lawyer_reminders_reminder_type_check 
CHECK (reminder_type IN ('court_date', 'deadline', 'meeting', 'follow_up', 'document_review'));

-- Add case_id field for future case linking
ALTER TABLE lawyer_reminders 
ADD COLUMN IF NOT EXISTS case_id uuid;

-- Add lawyer_id field if it doesn't exist (for proper user association)
ALTER TABLE lawyer_reminders 
ADD COLUMN IF NOT EXISTS lawyer_id uuid REFERENCES auth.users(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyer_reminders_lawyer_id ON lawyer_reminders(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_reminders_status ON lawyer_reminders(status);
CREATE INDEX IF NOT EXISTS idx_lawyer_reminders_reminder_date ON lawyer_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_lawyer_reminders_priority ON lawyer_reminders(priority);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lawyer_reminders_updated_at ON lawyer_reminders;
CREATE TRIGGER update_lawyer_reminders_updated_at
    BEFORE UPDATE ON lawyer_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

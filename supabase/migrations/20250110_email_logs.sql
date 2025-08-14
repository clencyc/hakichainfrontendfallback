-- Create email_logs table for tracking email sending attempts
CREATE TABLE email_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email text NOT NULL,
    email_type text NOT NULL,
    subject text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
    error_message text,
    user_role text DEFAULT 'lawyer',
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Add indexes for better performance
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);

-- Add RLS policies
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow lawyers to view their own email logs
CREATE POLICY "Lawyers can view their email logs" ON email_logs
FOR SELECT USING (
    metadata->>'user_id' = auth.uid()::text OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = email_logs.recipient_email
    )
);

-- Allow service accounts to insert email logs
CREATE POLICY "Service can insert email logs" ON email_logs
FOR INSERT WITH CHECK (true);

-- Update function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_email_logs_updated_at();

-- Add some sample data for testing
INSERT INTO email_logs (recipient_email, email_type, subject, status, metadata) VALUES
('lawyer1@example.com', 'lawyer_reminder', 'Legal Reminder: Court Date Tomorrow', 'sent', '{"reminder_id": "test-1", "priority": "high"}'),
('lawyer2@example.com', 'lawyer_reminder', 'Legal Reminder: Client Meeting', 'sent', '{"reminder_id": "test-2", "priority": "medium"}'),
('lawyer3@example.com', 'lawyer_reminder', 'Legal Reminder: Document Review', 'failed', '{"reminder_id": "test-3", "priority": "low", "error": "Invalid email address"}');

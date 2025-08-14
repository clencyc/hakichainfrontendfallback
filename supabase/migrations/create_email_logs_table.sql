-- Create email_logs table for tracking sent emails
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL, -- 'lawyer_welcome', 'verification', 'reminder', etc.
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  error_message TEXT,
  user_role TEXT, -- 'lawyer', 'ngo', 'donor'
  metadata JSONB, -- Additional data like LSK number, signup date, etc.
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Enable Row Level Security (RLS)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin can view all email logs" ON email_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for users to view their own email logs
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (auth.jwt() ->> 'email' = recipient_email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_logs_updated_at_trigger
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_email_logs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Tracks all emails sent through the HakiChain platform';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email: lawyer_welcome, verification, reminder, notification, etc.';
COMMENT ON COLUMN email_logs.status IS 'Email delivery status: pending, sent, failed, bounced';
COMMENT ON COLUMN email_logs.metadata IS 'Additional email-specific data as JSON';

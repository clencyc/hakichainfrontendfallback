/*
  # HakiLens Database Tables
  
  This migration creates the database schema for HakiLens case search and AI analysis functionality.
  
  ## Tables:
  1. cases - Stores scraped case information
  2. case_chats - Chat history for specific cases  
  3. chat_history - General chat history
*/

-- Cases table for storing scraped legal case data
CREATE TABLE IF NOT EXISTS cases (
    id SERIAL PRIMARY KEY,
    case_number TEXT,
    case_title TEXT,
    court_name TEXT,
    judge_name TEXT,
    hearing_date TEXT,
    hearing_time TEXT,
    case_type TEXT,
    status TEXT,
    legal_representation TEXT,
    subject_matter TEXT,
    additional_details TEXT,
    source_url TEXT NOT NULL,
    scraped_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    full_content TEXT,
    comprehensive_data JSONB,  -- Stores the structured scraped data
    ai_analysis JSONB,         -- Stores AI analysis results
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Case-specific chat history
CREATE TABLE IF NOT EXISTS case_chats (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    user_question TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- General chat history (not tied to specific cases)
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    session_id TEXT,  -- Optional session tracking
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_cases_court_name ON cases(court_name);
CREATE INDEX IF NOT EXISTS idx_cases_case_type ON cases(case_type);
CREATE INDEX IF NOT EXISTS idx_cases_scraped_at ON cases(scraped_at);
CREATE INDEX IF NOT EXISTS idx_cases_source_url ON cases(source_url);
CREATE INDEX IF NOT EXISTS idx_case_chats_case_id ON case_chats(case_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp);

-- Full-text search indexes for case content
CREATE INDEX IF NOT EXISTS idx_cases_title_search ON cases USING gin(to_tsvector('english', case_title));
CREATE INDEX IF NOT EXISTS idx_cases_content_search ON cases USING gin(to_tsvector('english', full_content));

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at column
CREATE TRIGGER update_cases_updated_at 
    BEFORE UPDATE ON cases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all cases
CREATE POLICY "Anyone can view cases" ON cases FOR SELECT USING (true);

-- Allow authenticated users to insert cases
CREATE POLICY "Authenticated users can create cases" ON cases FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update cases
CREATE POLICY "Authenticated users can update cases" ON cases FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own case chats
CREATE POLICY "Users can manage case chats" ON case_chats FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage chat history
CREATE POLICY "Users can manage chat history" ON chat_history FOR ALL USING (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE cases IS 'Stores legal cases scraped from Kenya Law and other sources';
COMMENT ON TABLE case_chats IS 'Chat history for specific legal cases';
COMMENT ON TABLE chat_history IS 'General legal chat history not tied to specific cases';
COMMENT ON COLUMN cases.comprehensive_data IS 'JSON containing all scraped data including content, links, images, tables, documents, metadata';
COMMENT ON COLUMN cases.ai_analysis IS 'JSON containing AI analysis results including structured case info, content analysis, quality assessment';

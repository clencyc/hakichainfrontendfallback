-- Create HakiLens tables for case scraping and management

-- Cases table
CREATE TABLE IF NOT EXISTS hakilens_cases (
    id SERIAL PRIMARY KEY,
    url VARCHAR(1000) UNIQUE NOT NULL,
    court VARCHAR(255),
    case_number VARCHAR(255),
    parties VARCHAR(1000),
    judges VARCHAR(1000),
    date VARCHAR(64),
    citation VARCHAR(255),
    title VARCHAR(1000),
    summary TEXT,
    content_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS hakilens_documents (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES hakilens_cases(id) ON DELETE CASCADE,
    file_path VARCHAR(2000) NOT NULL,
    url VARCHAR(1000),
    content_type VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table
CREATE TABLE IF NOT EXISTS hakilens_images (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES hakilens_cases(id) ON DELETE CASCADE,
    file_path VARCHAR(2000) NOT NULL,
    url VARCHAR(1000),
    alt_text VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_url ON hakilens_cases(url);
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_court ON hakilens_cases(court);
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_case_number ON hakilens_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_title ON hakilens_cases USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_content ON hakilens_cases USING gin(to_tsvector('english', content_text));
CREATE INDEX IF NOT EXISTS idx_hakilens_cases_created_at ON hakilens_cases(created_at);

CREATE INDEX IF NOT EXISTS idx_hakilens_documents_case_id ON hakilens_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_hakilens_images_case_id ON hakilens_images(case_id);

-- Enable Row Level Security
ALTER TABLE hakilens_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hakilens_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hakilens_images ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
CREATE POLICY "Users can view all hakilens cases" ON hakilens_cases FOR SELECT USING (true);
CREATE POLICY "Users can insert hakilens cases" ON hakilens_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update hakilens cases" ON hakilens_cases FOR UPDATE USING (true);
CREATE POLICY "Users can delete hakilens cases" ON hakilens_cases FOR DELETE USING (true);

CREATE POLICY "Users can view all hakilens documents" ON hakilens_documents FOR SELECT USING (true);
CREATE POLICY "Users can insert hakilens documents" ON hakilens_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update hakilens documents" ON hakilens_documents FOR UPDATE USING (true);
CREATE POLICY "Users can delete hakilens documents" ON hakilens_documents FOR DELETE USING (true);

CREATE POLICY "Users can view all hakilens images" ON hakilens_images FOR SELECT USING (true);
CREATE POLICY "Users can insert hakilens images" ON hakilens_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update hakilens images" ON hakilens_images FOR UPDATE USING (true);
CREATE POLICY "Users can delete hakilens images" ON hakilens_images FOR DELETE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_hakilens_cases_updated_at 
    BEFORE UPDATE ON hakilens_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

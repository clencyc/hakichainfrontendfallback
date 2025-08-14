-- Migration: Create Metrics Table for HakiChain Dashboard
-- File: supabase/migrations/create_metrics_table.sql

-- Create the metrics table
CREATE TABLE IF NOT EXISTS metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    service TEXT NOT NULL CHECK (service IN ('haki_draft', 'haki_reviews', 'haki_lens', 'haki_reminder', 'haki_bot')),
    metric_type TEXT NOT NULL CHECK (metric_type IN ('usage', 'engagement', 'outcome')),
    metric_name TEXT NOT NULL,
    value DECIMAL NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_service ON metrics(service);
CREATE INDEX idx_metrics_metric_type ON metrics(metric_type);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp);
CREATE INDEX idx_metrics_service_metric ON metrics(service, metric_name);
CREATE INDEX idx_metrics_composite ON metrics(service, metric_type, timestamp);

-- Create a view for dashboard aggregations
CREATE OR REPLACE VIEW dashboard_metrics_summary AS
SELECT 
    service,
    metric_type,
    metric_name,
    COUNT(*) as total_records,
    SUM(value) as total_value,
    AVG(value) as average_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    DATE_TRUNC('day', timestamp) as date_group
FROM metrics
GROUP BY service, metric_type, metric_name, DATE_TRUNC('day', timestamp)
ORDER BY date_group DESC;

-- Create a view for daily metrics summary
CREATE OR REPLACE VIEW daily_metrics_summary AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    service,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_id) as unique_users
FROM metrics
GROUP BY DATE_TRUNC('day', timestamp), service
ORDER BY date DESC;

-- Create a view for user engagement summary
CREATE OR REPLACE VIEW user_engagement_summary AS
SELECT 
    user_id,
    service,
    COUNT(*) as total_actions,
    COUNT(DISTINCT DATE_TRUNC('day', timestamp)) as active_days,
    MIN(timestamp) as first_activity,
    MAX(timestamp) as last_activity
FROM metrics
GROUP BY user_id, service;

-- Create a function to get service metrics for a specific date range
CREATE OR REPLACE FUNCTION get_service_metrics(
    p_service TEXT,
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    metric_type TEXT,
    metric_name TEXT,
    total_value DECIMAL,
    average_value DECIMAL,
    total_records BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.metric_type,
        m.metric_name,
        SUM(m.value) as total_value,
        AVG(m.value) as average_value,
        COUNT(*) as total_records
    FROM metrics m
    WHERE m.service = p_service
        AND m.timestamp >= p_start_date
        AND m.timestamp <= p_end_date
    GROUP BY m.metric_type, m.metric_name
    ORDER BY m.metric_type, m.metric_name;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get top performing metrics
CREATE OR REPLACE FUNCTION get_top_performing_metrics(
    p_limit INTEGER DEFAULT 10,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    service TEXT,
    metric_name TEXT,
    total_value DECIMAL,
    unique_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.service,
        m.metric_name,
        SUM(m.value) as total_value,
        COUNT(DISTINCT m.user_id) as unique_users
    FROM metrics m
    WHERE m.timestamp >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY m.service, m.metric_name
    ORDER BY total_value DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
INSERT INTO metrics (user_id, service, metric_type, metric_name, value, metadata) VALUES
-- Haki Draft sample data
(gen_random_uuid(), 'haki_draft', 'usage', 'documents_generated', 1, '{"document_type": "contract"}'),
(gen_random_uuid(), 'haki_draft', 'engagement', 'document_generation_time', 15.5, '{"complexity": "medium"}'),
(gen_random_uuid(), 'haki_draft', 'outcome', 'user_satisfaction_score', 4.2, '{"feedback": "excellent"}'),

-- Haki Reviews sample data
(gen_random_uuid(), 'haki_reviews', 'usage', 'cases_uploaded', 1, '{"case_type": "civil"}'),
(gen_random_uuid(), 'haki_reviews', 'engagement', 'review_time', 25.0, '{"complexity": "high"}'),
(gen_random_uuid(), 'haki_reviews', 'outcome', 'user_satisfaction_score', 4.5, '{"reviewer": "senior_lawyer"}'),

-- Haki Lens sample data
(gen_random_uuid(), 'haki_lens', 'usage', 'research_requests_submitted', 1, '{"research_area": "constitutional_law"}'),
(gen_random_uuid(), 'haki_lens', 'engagement', 'session_length', 45.0, '{"deep_research": true}'),
(gen_random_uuid(), 'haki_lens', 'outcome', 'user_satisfaction_score', 4.8, '{"research_quality": "excellent"}'),

-- Haki Reminder sample data
(gen_random_uuid(), 'haki_reminder', 'usage', 'reminders_created', 1, '{"reminder_type": "court_date"}'),
(gen_random_uuid(), 'haki_reminder', 'engagement', 'reminders_acknowledged', 1, '{"response_time_hours": 2}'),
(gen_random_uuid(), 'haki_reminder', 'outcome', 'reminder_success', 1, '{"task_completed": true}'),

-- Haki Bot sample data
(gen_random_uuid(), 'haki_bot', 'usage', 'bot_queries_made', 1, '{"query_type": "legal_advice"}'),
(gen_random_uuid(), 'haki_bot', 'engagement', 'session_duration', 12.5, '{"questions_asked": 3}'),
(gen_random_uuid(), 'haki_bot', 'outcome', 'query_resolution', 1, '{"satisfied": true});

-- Add RLS (Row Level Security) policies
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Policy for users to only see their own metrics
CREATE POLICY "Users can view their own metrics" ON metrics
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own metrics
CREATE POLICY "Users can insert their own metrics" ON metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for service users (admin) to view all metrics
CREATE POLICY "Service users can view all metrics" ON metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@hakichain.com'
        )
    );

-- Grant permissions
GRANT ALL ON metrics TO authenticated;
GRANT SELECT ON dashboard_metrics_summary TO authenticated;
GRANT SELECT ON daily_metrics_summary TO authenticated;
GRANT SELECT ON user_engagement_summary TO authenticated;

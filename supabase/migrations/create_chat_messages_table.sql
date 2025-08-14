-- Migration: Create Chat Messages Table for HakiBot History
-- File: supabase/migrations/create_chat_messages_table.sql

-- Create chat_messages table for storing individual messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chat_history(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    message_id TEXT NOT NULL, -- The client-side message ID
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
CREATE INDEX idx_chat_messages_content_search ON chat_messages USING gin(to_tsvector('english', content));

-- Update chat_history table to include better metadata
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_history_timestamp
    BEFORE UPDATE ON chat_history
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_history_timestamp();

-- Add RLS (Row Level Security) policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to only see their own messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy for users to insert their own messages
CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy for users to update their own messages
CREATE POLICY "Users can update their own chat messages" ON chat_messages
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy for users to delete their own messages
CREATE POLICY "Users can delete their own chat messages" ON chat_messages
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create a view for chat sessions with message counts
CREATE OR REPLACE VIEW chat_sessions_with_stats AS
SELECT 
    ch.id,
    ch.title,
    ch.user_id,
    ch.created_at,
    ch.updated_at,
    ch.metadata,
    COUNT(cm.id) as message_count,
    MAX(cm.timestamp) as last_message_at,
    ARRAY_AGG(
        json_build_object(
            'id', cm.message_id,
            'role', cm.role,
            'content', CASE 
                WHEN LENGTH(cm.content) > 100 
                THEN LEFT(cm.content, 100) || '...' 
                ELSE cm.content 
            END,
            'timestamp', cm.timestamp
        ) ORDER BY cm.timestamp ASC
    ) FILTER (WHERE cm.id IS NOT NULL) as messages_preview
FROM chat_history ch
LEFT JOIN chat_messages cm ON ch.id = cm.session_id
GROUP BY ch.id, ch.title, ch.user_id, ch.created_at, ch.updated_at, ch.metadata
ORDER BY ch.updated_at DESC;

-- Create a function to get full chat session with messages
CREATE OR REPLACE FUNCTION get_chat_session_with_messages(
    session_id_param UUID,
    user_id_param UUID
)
RETURNS TABLE (
    session_id UUID,
    session_title TEXT,
    session_created_at TIMESTAMPTZ,
    session_updated_at TIMESTAMPTZ,
    message_id TEXT,
    message_role TEXT,
    message_content TEXT,
    message_timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.id as session_id,
        ch.title as session_title,
        ch.created_at as session_created_at,
        ch.updated_at as session_updated_at,
        cm.message_id,
        cm.role as message_role,
        cm.content as message_content,
        cm.timestamp as message_timestamp
    FROM chat_history ch
    LEFT JOIN chat_messages cm ON ch.id = cm.session_id
    WHERE ch.id = session_id_param 
        AND ch.user_id = user_id_param
    ORDER BY cm.timestamp ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to search chat history
CREATE OR REPLACE FUNCTION search_chat_history(
    user_id_param UUID,
    search_query TEXT,
    limit_param INTEGER DEFAULT 20
)
RETURNS TABLE (
    session_id UUID,
    session_title TEXT,
    session_updated_at TIMESTAMPTZ,
    message_content TEXT,
    message_timestamp TIMESTAMPTZ,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        ch.id as session_id,
        ch.title as session_title,
        ch.updated_at as session_updated_at,
        cm.content as message_content,
        cm.timestamp as message_timestamp,
        ts_rank(to_tsvector('english', cm.content), plainto_tsquery('english', search_query)) as relevance_score
    FROM chat_history ch
    JOIN chat_messages cm ON ch.id = cm.session_id
    WHERE ch.user_id = user_id_param
        AND to_tsvector('english', cm.content) @@ plainto_tsquery('english', search_query)
    ORDER BY relevance_score DESC, session_updated_at DESC
    LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON chat_messages TO authenticated;
GRANT SELECT ON chat_sessions_with_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_chat_session_with_messages TO authenticated;
GRANT EXECUTE ON FUNCTION search_chat_history TO authenticated;

-- Insert sample data for testing
DO $$
DECLARE
    sample_user_id UUID := gen_random_uuid();
    sample_session_id UUID;
BEGIN
    -- Create a sample chat session
    INSERT INTO chat_history (id, title, user_id, metadata)
    VALUES (gen_random_uuid(), 'Legal advice about contracts', sample_user_id, '{"source": "hakilens_bot"}')
    RETURNING id INTO sample_session_id;
    
    -- Insert sample messages
    INSERT INTO chat_messages (session_id, user_id, message_id, role, content, timestamp) VALUES
    (sample_session_id, sample_user_id, 'msg_1', 'assistant', 'Hello! I''m HakiBot, your legal AI assistant. How can I help you today?', NOW() - INTERVAL '1 hour'),
    (sample_session_id, sample_user_id, 'msg_2', 'user', 'I need help understanding employment contracts in Kenya', NOW() - INTERVAL '59 minutes'),
    (sample_session_id, sample_user_id, 'msg_3', 'assistant', 'I''d be happy to help you understand employment contracts in Kenya. Here are the key aspects you should know...', NOW() - INTERVAL '58 minutes');
END $$;

-- Add comments for documentation
COMMENT ON TABLE chat_messages IS 'Stores individual chat messages for HakiBot conversations';
COMMENT ON COLUMN chat_messages.session_id IS 'References the chat session this message belongs to';
COMMENT ON COLUMN chat_messages.message_id IS 'Client-side unique identifier for the message';
COMMENT ON COLUMN chat_messages.role IS 'Whether the message is from user or assistant';
COMMENT ON COLUMN chat_messages.content IS 'The actual message content';
COMMENT ON COLUMN chat_messages.timestamp IS 'When the message was created on the client side';

COMMENT ON VIEW chat_sessions_with_stats IS 'Shows chat sessions with message counts and previews';
COMMENT ON FUNCTION get_chat_session_with_messages IS 'Retrieves a complete chat session with all messages';
COMMENT ON FUNCTION search_chat_history IS 'Searches through chat history using full-text search';

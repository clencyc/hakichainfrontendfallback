import { supabase } from '../lib/supabase';
import type { ChatMessage } from '../lib/geminiChat';

interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  metadata?: ChatHistoryMetadata;
  messages?: ChatMessage[];
  message_count?: number;
  last_message_at?: string;
}

interface ChatHistoryMetadata {
  source?: string;
  tags?: string[];
  summary?: string;
  auto_scroll_disabled?: boolean;
}

/**
 * Create a new chat session
 */
export async function createSession(
  title: string, 
  userId: string,
  metadata: ChatHistoryMetadata = {}
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        title,
        user_id: userId,
        metadata: {
          ...metadata,
          source: metadata.source || 'hakilens_bot'
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }

    if (!data?.id) {
      throw new Error('No session ID returned');
    }

    console.log('Chat session created:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error in createSession:', error);
    throw error;
  }
}

/**
 * Save a message to a chat session
 */
export async function saveMessage(
  sessionId: string, 
  message: ChatMessage,
  userId: string
): Promise<void> {
  try {
    // Insert message into chat_messages table
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        message_id: message.id,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        metadata: {}
      });

    if (messageError) {
      console.error('Error saving message:', messageError);
      throw new Error(`Failed to save message: ${messageError.message}`);
    }

    // Update the session's updated_at timestamp
    const { error: sessionError } = await supabase
      .from('chat_history')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (sessionError) {
      console.warn('Error updating session timestamp:', sessionError);
    }

    console.log('Message saved successfully');
  } catch (error) {
    console.error('Error in saveMessage:', error);
    throw error;
  }
}

/**
 * Load messages from a chat session
 */
export async function loadSession(sessionId: string, userId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('message_id, role, content, timestamp')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return (data || []).map(msg => ({
      id: msg.message_id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }));
  } catch (error) {
    console.error('Error loading session:', error);
    return [];
  }
}

/**
 * Get all chat sessions for a user
 */
export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions_with_stats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching user sessions:', error);
      throw new Error(`Failed to fetch sessions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    return [];
  }
}

/**
 * Update session metadata (including auto-scroll preference)
 */
export async function updateSessionMetadata(
  sessionId: string,
  userId: string,
  metadata: Partial<ChatHistoryMetadata>
): Promise<void> {
  try {
    // Get existing metadata
    const { data: session } = await supabase
      .from('chat_history')
      .select('metadata')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    const updatedMetadata = {
      ...(session?.metadata || {}),
      ...metadata
    };

    const { error } = await supabase
      .from('chat_history')
      .update({ 
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to update session metadata: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating session metadata:', error);
    throw error;
  }
}

/**
 * Delete a chat session and all its messages
 */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  try {
    // Messages will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }

    console.log('Session deleted successfully');
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}

/**
 * Search through chat history
 */
export async function searchChatHistory(
  userId: string, 
  query: string
): Promise<Array<{
  session_id: string;
  session_title: string;
  message_content: string;
  message_timestamp: string;
  relevance_score: number;
}>> {
  try {
    const { data, error } = await supabase
      .rpc('search_chat_history', {
        user_id_param: userId,
        search_query: query,
        limit_param: 20
      });

    if (error) {
      console.error('Error searching chat history:', error);
      throw new Error(`Failed to search chat history: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchChatHistory:', error);
    return [];
  }
}

/**
 * Export chat session as JSON
 */
export async function exportChatSession(sessionId: string, userId: string): Promise<string> {
  try {
    // Get session details and messages
    const { data, error } = await supabase
      .rpc('get_chat_session_with_messages', {
        session_id_param: sessionId,
        user_id_param: userId
      });

    if (error) {
      throw new Error(`Failed to export session: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Session not found or empty');
    }

    // Group data into session format
    const session = {
      id: sessionId,
      title: data[0].session_title,
      created_at: data[0].session_created_at,
      updated_at: data[0].session_updated_at,
      messages: data
        .filter((row: any) => row.message_id) // Filter out rows without messages
        .map((row: any) => ({
          id: row.message_id,
          role: row.message_role,
          content: row.message_content,
          timestamp: row.message_timestamp
        }))
    };

    return JSON.stringify(session, null, 2);
  } catch (error) {
    console.error('Error exporting chat session:', error);
    throw error;
  }
}

/**
 * Set auto-scroll preference for a session
 */
export async function setAutoScrollPreference(
  sessionId: string,
  userId: string,
  disabled: boolean
): Promise<void> {
  try {
    await updateSessionMetadata(sessionId, userId, {
      auto_scroll_disabled: disabled
    });
  } catch (error) {
    console.error('Error setting auto-scroll preference:', error);
    throw error;
  }
}

/**
 * Get auto-scroll preference for a session
 */
export async function getAutoScrollPreference(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('chat_history')
      .select('metadata')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    return data?.metadata?.auto_scroll_disabled === true;
  } catch (error) {
    console.error('Error getting auto-scroll preference:', error);
    return false; // Default to auto-scroll enabled
  }
}

// Export types for use in components
export type { ChatSession, ChatHistoryMetadata };

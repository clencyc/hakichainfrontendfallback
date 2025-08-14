import { supabase } from '../lib/supabase';
import type { ChatMessage } from '../lib/geminiChat';

interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  message_count?: number;
}

/**
 * Create a new chat session
 */
export async function createSession(
  title: string, 
  userId: string
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        title,
        user_id: userId
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
        role: message.role,
        content: message.content
      });

    if (messageError) {
      console.error('Error saving message:', messageError);
      throw new Error(`Failed to save message: ${messageError.message}`);
    }

    // Update the session's message count and updated_at
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .update({ 
        updated_at: new Date().toISOString(),
        message_count: await getMessageCount(sessionId)
      })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (sessionError) {
      console.warn('Error updating session:', sessionError);
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
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((msg, index) => ({
      id: (index + 1).toString(),
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at)
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
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20);

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
 * Delete a chat session and all its messages
 */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  try {
    // Messages will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('chat_sessions')
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
 * Export chat session as JSON
 */
export async function exportChatSession(sessionId: string, userId: string): Promise<string> {
  try {
    const messages = await loadSession(sessionId, userId);
    
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('title, created_at')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    const exportData = {
      id: sessionId,
      title: session?.title || 'Chat Session',
      created_at: session?.created_at || new Date().toISOString(),
      exported_at: new Date().toISOString(),
      message_count: messages.length,
      messages: messages
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting chat session:', error);
    throw error;
  }
}

/**
 * Set auto-scroll preference for a session (simplified - just in memory for now)
 */
export async function setAutoScrollPreference(
  sessionId: string,
  userId: string,
  disabled: boolean
): Promise<void> {
  // For now, just store in localStorage as a simple solution
  localStorage.setItem(`autoscroll_${sessionId}`, disabled.toString());
}

/**
 * Get auto-scroll preference for a session
 */
export async function getAutoScrollPreference(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    const stored = localStorage.getItem(`autoscroll_${sessionId}`);
    return stored === 'true';
  } catch (error) {
    console.error('Error getting auto-scroll preference:', error);
    return false; // Default to auto-scroll enabled
  }
}

// Helper function to get message count
async function getMessageCount(sessionId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting message count:', error);
    return 0;
  }
}

// Export types for use in components
export type { ChatSession };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const generateChatResponse = async (
  message: string,
  chatHistory: ChatMessage[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // Build conversation context
  const context = chatHistory
    .slice(-10)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const requestBody = {
    message,
    context,
    chatHistory: chatHistory.slice(-10) // Send last 10 messages for context
  };

  // Use environment variables with fallback to production URL
  const API_BASE_URL = import.meta.env.VITE_NODEJS_BACKEND_URL || 
                       import.meta.env.VITE_HAKILENS_API_URL || 
                       'https://hakilens-v77g.onrender.com';
  
  const API_ENDPOINT = `${API_BASE_URL}/api/chatbot`;

  // Debug logging to track what URL is being used
  console.log('🔍 API Debug Info:');
  console.log('  VITE_NODEJS_BACKEND_URL:', import.meta.env.VITE_NODEJS_BACKEND_URL);
  console.log('  VITE_HAKILENS_API_URL:', import.meta.env.VITE_HAKILENS_API_URL);
  console.log('  Final API_ENDPOINT:', API_ENDPOINT);
  console.log('  Environment MODE:', import.meta.env.MODE);
  console.log('  Is PROD:', import.meta.env.PROD);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response supports streaming
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    async function* streamResponse() {
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader!.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          
          // Handle Server-Sent Events (SSE) format if your backend uses it
          if (chunk.startsWith('data: ')) {
            const data = chunk.slice(6).trim();
            if (data && data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  yield parsed.content;
                }
              } catch {
                // If not JSON, yield as plain text
                yield data;
              }
            }
          } else {
            // Handle JSON response format
            try {
              const jsonResponse = JSON.parse(chunk);
              if (jsonResponse.response) {
                // Return the markdown content from the response
                yield jsonResponse.response;
              } else if (jsonResponse.content) {
                yield jsonResponse.content;
              } else {
                yield chunk;
              }
            } catch {
              // Handle plain text streaming
              yield chunk;
            }
          }
        }
      } finally {
        reader!.releaseLock();
      }
    }

    return streamResponse();
    
  } catch (error) {
    console.error('❌ Error calling API:', error);
    console.error('🔗 Failed endpoint:', API_ENDPOINT);
    console.error('🌍 Environment:', {
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      VITE_NODEJS_BACKEND_URL: import.meta.env.VITE_NODEJS_BACKEND_URL,
      VITE_HAKILENS_API_URL: import.meta.env.VITE_HAKILENS_API_URL
    });
    
    // Fallback: return error message as a stream
    async function* errorResponse() {
      yield `I'm sorry, I'm having trouble connecting to the chat service at ${API_ENDPOINT}. Please try again later.`;
    }
    
    return errorResponse();
  }
};

export const generateQuickSuggestions = (userInput: string): string[] => {
  const suggestions = [
    "What are my rights as a tenant in Kenya?",
    "How do I file for divorce in Kenya?",
    "What is the process for registering a business?",
    "How do I report domestic violence?",
    "What are the steps to adopt a child?",
    "How do I write a will?",
    "What should I do if I'm arrested?",
    "How do I sue for defamation?",
    "What are employment rights in Kenya?",
    "How do I handle a landlord dispute?"
  ];

  if (!userInput.trim()) {
    return suggestions.slice(0, 4);
  }

  // Simple keyword matching for relevant suggestions
  const keywords = userInput.toLowerCase();
  const relevant = suggestions.filter(s => 
    s.toLowerCase().includes(keywords) || 
    keywords.split(' ').some(word => s.toLowerCase().includes(word))
  );

  return relevant.length > 0 ? relevant.slice(0, 4) : suggestions.slice(0, 4);
};
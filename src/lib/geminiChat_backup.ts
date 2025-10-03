import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDSmcctwb094ifsM1Dgb8B01brcVaNtq2Y';
const genAI = new GoogleGenerativeAI(API_KEY);

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
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const generateChatResponse = async (
  message: string,
  chatHistory: ChatMessage[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set your API key.');
  }

  try {
    // Use the same model that works in hakiDraftAI.ts
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation context
    const context = chatHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `
      You are HakiBot, an AI legal assistant specialized in Kenyan law and general legal guidance. You help users understand legal concepts, processes, and provide general legal information.

      IMPORTANT GUIDELINES:
      1. Always provide helpful, accurate legal information
      2. Clearly state when advice should come from a qualified lawyer
      3. Reference Kenyan law when applicable
      4. Be conversational but professional
      5. If unsure, recommend consulting a legal professional
      6. Keep responses concise but informative
      7. Use simple language to explain complex legal concepts
      8. Suggest relevant legal services from HakiChain when appropriate

      Conversation History:
      ${context}

      Current User Question: ${message}

      Please provide a helpful response as HakiBot:
    `;

    const result = await model.generateContentStream(prompt);
    
    async function* streamResponse() {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    }

    return streamResponse();
    
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response. Please check your API key and try again.');
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

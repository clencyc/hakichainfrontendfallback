import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '../lib/geminiChat';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm HakiBot, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      setMessages,
      unreadCount,
      setUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

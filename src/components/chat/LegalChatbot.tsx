import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Sparkles,
  Scale,
  AlertCircle,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  History,
  Pause,
  Play,
  Download,
  Search,
  Trash2
} from 'lucide-react';
import { generateChatResponse, generateQuickSuggestions, ChatMessage } from '../../lib/geminiChat';
import { 
  createSession, 
  saveMessage, 
  loadSession, 
  getUserSessions, 
  deleteSession,
  exportChatSession,
  setAutoScrollPreference,
  getAutoScrollPreference,
  type ChatSession 
} from '../../services/simpleChatHistoryService';
import { useAuth } from '../../hooks/useAuth';

export const LegalChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm HakiBot, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Auto-scroll control states
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  
  // History states
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced auto-scroll with generation awareness
  useEffect(() => {
    if (autoScrollEnabled && !userHasScrolled && (!isGenerating || isGenerating)) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Delay scroll during generation to prevent jumping
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToBottom();
      }, isGenerating ? 200 : 50);
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, autoScrollEnabled, userHasScrolled, isGenerating]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    setSuggestions(generateQuickSuggestions(inputMessage));
  }, [inputMessage]);

  // Load chat history when user opens the chat
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
      
      // Load auto-scroll preference for current session
      if (currentSessionId) {
        loadAutoScrollPreference();
      }
    }
  }, [isOpen, user, currentSessionId]);

  // Detect user scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
    
    setUserHasScrolled(!isAtBottom);
    
    // Reset user scroll detection after a delay
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (isAtBottom) {
        setUserHasScrolled(false);
      }
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const sessions = await getUserSessions(user.id);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  // Load auto-scroll preference
  const loadAutoScrollPreference = useCallback(async () => {
    if (!user || !currentSessionId) return;
    
    try {
      const disabled = await getAutoScrollPreference(currentSessionId, user.id);
      setAutoScrollEnabled(!disabled);
    } catch (error) {
      console.error('Error loading auto-scroll preference:', error);
    }
  }, [user, currentSessionId]);

  // Toggle auto-scroll and save preference
  const toggleAutoScroll = async () => {
    const newAutoScrollEnabled = !autoScrollEnabled;
    setAutoScrollEnabled(newAutoScrollEnabled);
    
    if (user && currentSessionId) {
      try {
        await setAutoScrollPreference(currentSessionId, user.id, !newAutoScrollEnabled);
      } catch (error) {
        console.error('Error saving auto-scroll preference:', error);
      }
    }
  };

  // Start new chat session
  const startNewSession = async () => {
    if (!user) return;
    
    try {
      const sessionTitle = `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const sessionId = await createSession(sessionTitle, user.id);
      setCurrentSessionId(sessionId);
      clearChat();
      await loadChatHistory();
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  // Load a specific chat session
  const loadChatSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const sessionMessages = await loadSession(sessionId, user.id);
      setMessages(sessionMessages.length > 0 ? sessionMessages : [
        {
          id: '1',
          role: 'assistant',
          content: "👋 Hi! I'm HakiBot, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
          timestamp: new Date()
        }
      ]);
      setCurrentSessionId(sessionId);
      setShowHistory(false);
      await loadAutoScrollPreference();
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  // Delete a chat session
  const handleDeleteSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      await deleteSession(sessionId, user.id);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        clearChat();
      }
      await loadChatHistory();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Export current session
  const handleExportSession = async () => {
    if (!user || !currentSessionId) return;
    
    try {
      const exportData = await exportChatSession(currentSessionId, user.id);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hakilens-chat-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting session:', error);
    }
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/(?:^|\n)(\d+\.\s)/g, '<br><strong>$1</strong>')
      .replace(/(?:^|\n)(-\s)/g, '<br>• ');
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isTyping) return;

    // Create session if user is logged in but no session exists
    if (user && !currentSessionId) {
      try {
        const sessionTitle = `Chat ${new Date().toLocaleDateString()}`;
        const sessionId = await createSession(sessionTitle, user.id);
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsGenerating(true);

    // Save user message to history if user is logged in
    if (user && currentSessionId) {
      try {
        await saveMessage(currentSessionId, userMessage, user.id);
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    try {
      const generator = await generateChatResponse(text, messages);
      
      let botResponse = '';
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      for await (const chunk of generator) {
        botResponse += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessage.id 
              ? { ...msg, content: botResponse }
              : msg
          )
        );
      }

      // Save complete bot response to history
      if (user && currentSessionId) {
        try {
          const completeMessage = { ...botMessage, content: botResponse };
          await saveMessage(currentSessionId, completeMessage, user.id);
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to history
      if (user && currentSessionId) {
        try {
          await saveMessage(currentSessionId, errorMessage, user.id);
        } catch (error) {
          console.error('Error saving error message:', error);
        }
      }
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm HakiBot, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
        timestamp: new Date()
      }
    ]);
  };

  const chatHeight = isExpanded ? 'h-[80vh]' : isMinimized ? 'h-16' : 'h-[500px]';
  const chatWidth = isExpanded ? 'w-[600px]' : 'w-96';

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
          >
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ask HakiBot - Legal AI Assistant
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0
            }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 ${chatWidth} ${chatHeight} bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">HakiBot</h3>
                  <p className="text-blue-100 text-xs flex items-center">
                    Legal AI Assistant
                    {isGenerating && (
                      <span className="ml-2 flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                        Generating...
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Auto-scroll toggle */}
                <button
                  onClick={toggleAutoScroll}
                  className={`p-1.5 rounded-lg transition-colors ${
                    autoScrollEnabled 
                      ? 'bg-white/20 hover:bg-white/30' 
                      : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                  title={autoScrollEnabled ? "Disable auto-scroll" : "Enable auto-scroll"}
                >
                  {autoScrollEnabled ? (
                    <Play className="w-4 h-4 text-white" />
                  ) : (
                    <Pause className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* History toggle */}
                {user && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      showHistory 
                        ? 'bg-white/30 hover:bg-white/40' 
                        : 'hover:bg-white/20'
                    }`}
                    title="Chat History"
                  >
                    <History className="w-4 h-4 text-white" />
                  </button>
                )}

                {/* Export current chat */}
                {user && currentSessionId && (
                  <button
                    onClick={handleExportSession}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title="Export Chat"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                )}

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? "Shrink" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat History Sidebar */}
                {showHistory && user && (
                  <div className="border-b border-gray-200 max-h-48 overflow-y-auto bg-gray-50">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Chat History</h4>
                        <button
                          onClick={startNewSession}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          New Chat
                        </button>
                      </div>
                      
                      {/* Search */}
                      <div className="relative mb-3">
                        <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search chats..."
                          value={historySearchQuery}
                          onChange={(e) => setHistorySearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Sessions List */}
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {isLoadingHistory ? (
                          <div className="text-xs text-gray-500 text-center py-2">Loading...</div>
                        ) : chatSessions
                          .filter(session => 
                            !historySearchQuery || 
                            session.title.toLowerCase().includes(historySearchQuery.toLowerCase())
                          )
                          .slice(0, 10)
                          .map((session) => (
                            <div
                              key={session.id}
                              className={`flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer ${
                                currentSessionId === session.id ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                              onClick={() => loadChatSession(session.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {session.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {session.message_count || 0} messages • {
                                    new Date(session.updated_at || session.created_at).toLocaleDateString()
                                  }
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                                title="Delete chat"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          ))
                        }
                        {chatSessions.length === 0 && !isLoadingHistory && (
                          <div className="text-xs text-gray-500 text-center py-2">
                            No chat history yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {/* Auto-scroll indicator */}
                  {userHasScrolled && isGenerating && (
                    <div className="fixed bottom-24 right-8 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-xs flex items-center space-x-2 z-10">
                      <Pause className="w-3 h-3" />
                      <span>Auto-scroll paused</span>
                      <button
                        onClick={() => {
                          setUserHasScrolled(false);
                          scrollToBottom();
                        }}
                        className="ml-2 underline hover:no-underline"
                      >
                        Resume
                      </button>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessage(message.content) 
                            }}
                          />
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {suggestions.length > 0 && inputMessage.length === 0 && !isTyping && (
                  <div className="px-4 pb-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 pt-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, isExpanded ? 4 : 2).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {suggestion.length > (isExpanded ? 50 : 25) 
                            ? suggestion.substring(0, isExpanded ? 50 : 25) + '...' 
                            : suggestion
                          }
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about Kenyan law..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        disabled={isTyping}
                      />
                    </div>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
                      className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>For personalized advice, consult a qualified lawyer</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Sparkles, Bot, Send, User } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { generateChatResponse, generateQuickSuggestions, ChatMessage } from '../../lib/geminiChat';

export const HakiLens = () => {
  const [keywords, setKeywords] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [year, setYear] = useState('');
  const [caseUrl, setCaseUrl] = useState('');
  const [caseId, setCaseId] = useState('');
  const [urlError, setUrlError] = useState('');
  // AI Legal Assistant state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm HakiDraft, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Add useEffect to update suggestions when input changes
  useEffect(() => {
    setSuggestions(generateQuickSuggestions(inputMessage));
  }, [inputMessage]);

  const handleSearchCases = () => {
    console.log('Searching cases with:', { keywords, caseNumber, courtName, year });
  };

  const handleDeepScrapeCase = () => {
    if (!caseUrl.trim()) {
      setUrlError('Please enter a valid URL');
      return;
    }
    setUrlError('');
    console.log('Deep scraping case:', caseUrl);
  };

  const handleGenerateSummary = () => {
    if (!caseId.trim()) {
      return;
    }
    console.log('Generating AI summary for case ID:', caseId);
  };

  // AI Legal Assistant functions
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const generator = await generateChatResponse(text, chatMessages);
      
      let botResponse = '';
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);

      for await (const chunk of generator) {
        botResponse += chunk;
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === botMessage.id
              ? { ...msg, content: botResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm HakiDraft, your AI legal assistant. I can help you understand Kenyan law, legal processes, and guide you to the right resources. What legal question can I help you with today?",
        timestamp: new Date()
      }
    ]);
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
  
  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#008080] to-[#006666] rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">🔍 HakiLens - Case Search</h1>
            </div>
          </div>
        </div>

        {/* Search Cases Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Contract dispute, inheritance..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="HCCC No. 123..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Name
              </label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="High Court, Court of Appeal..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2020, 2021..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>
          </div>

          <button
            onClick={handleSearchCases}
            className="bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Search Cases
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comprehensive Case Deep Research */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#008080]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Comprehensive Case Deep Research</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case URL
              </label>
              <input
                type="text"
                value={caseUrl}
                onChange={(e) => {
                  setCaseUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="https://new.kenyalaw.org/caselaw/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
              {urlError && (
                <p className="text-red-600 text-sm mt-1">{urlError}</p>
              )}
            </div>

            <button
              onClick={handleDeepScrapeCase}
              className="bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Deep Research Case</span>
            </button>

            {urlError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Please enter a valid URL</p>
              </div>
            )}
          </div>

          {/* Generate Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#008080]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Generate Summary</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case ID
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="Enter case ID..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={!caseId.trim()}
              className="bg-[#008080] hover:bg-[#006666] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Generate AI Summary
            </button>
          </div>
        </div>

        {/* AI Legal Assistant */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#008080]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">HakiDraft - AI Legal Assistant</h2>
          </div>
          
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-96">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-[#008080]'
                        : 'bg-gray-300'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-[#008080] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content)
                        }}
                      />
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-[#008080]/30' : 'text-gray-500'
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Quick Suggestions */}
            {suggestions.length > 0 && inputMessage.length === 0 && !isTyping && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-xs px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about Kenyan law..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080] resize-none text-sm"
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-[#008080] text-white rounded-xl hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-3 text-gray-500 hover:text-gray-700 rounded-xl transition-colors flex-shrink-0"
                  title="Clear chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>For personalized advice, consult a qualified lawyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

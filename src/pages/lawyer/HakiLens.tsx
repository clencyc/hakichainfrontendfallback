import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Sparkles, Bot, Send, User, Brain, Lightbulb, BookOpen, Scale } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { 
  generateLegalChatResponse, 
  generateLegalSuggestions, 
  analyzeLegalCase,
  generateSearchKeywords,
  LegalChatMessage 
} from '../../lib/hakiDraftAI';

export const HakiLens = () => {
  const [keywords, setKeywords] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [year, setYear] = useState('');
  const [caseUrl, setCaseUrl] = useState('');
  const [caseId, setCaseId] = useState('');
  const [urlError, setUrlError] = useState('');
  // HakiDraft AI Legal Assistant state
  const [chatMessages, setChatMessages] = useState<LegalChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm **HakiDraft**, your specialized AI legal research assistant. I can help you with:\n\n🔍 **Legal Case Research** - Find relevant precedents and case law\n📚 **Kenyan Law Analysis** - Constitutional, criminal, commercial, and family law\n⚖️ **Legal Document Review** - Analyze contracts, judgments, and legal documents\n🎯 **Research Strategy** - Guide your legal research approach\n\nWhat legal research can I assist you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Add useEffect to update suggestions when input changes
  useEffect(() => {
    setSuggestions(generateLegalSuggestions(inputMessage));
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

  // HakiDraft AI Legal Assistant functions
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage: LegalChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const generator = await generateLegalChatResponse(text, chatMessages);
      
      let botResponse = '';
      const botMessage: LegalChatMessage = {
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
      console.error('Error generating HakiDraft response:', error);
      const errorMessage: LegalChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ I apologize, but I encountered an error while processing your legal query. Please try again or rephrase your question. If the issue persists, please contact support.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Enhanced case analysis function
  const handleAnalyzeCase = async (caseText: string) => {
    if (!caseText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeLegalCase(caseText);
      setAnalysisResult(analysis);
      
      // Also add to chat
      const analysisMessage: LegalChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 **Case Analysis Complete**\n\n${analysis}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error analyzing case:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate search keywords from natural language
  const handleGenerateKeywords = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const keywords = await generateSearchKeywords(query);
      const keywordMessage: LegalChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔍 **Search Keywords Generated:**\n\n${keywords.map(k => `• ${k}`).join('\n')}\n\nUse these keywords in your case search for better results!`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, keywordMessage]);
    } catch (error) {
      console.error('Error generating keywords:', error);
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
        content: "👋 Hello! I'm **HakiDraft**, your specialized AI legal research assistant. I can help you with:\n\n🔍 **Legal Case Research** - Find relevant precedents and case law\n📚 **Kenyan Law Analysis** - Constitutional, criminal, commercial, and family law\n⚖️ **Legal Document Review** - Analyze contracts, judgments, and legal documents\n🎯 **Research Strategy** - Guide your legal research approach\n\nWhat legal research can I assist you with today?",
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
              <h1 className="text-3xl font-serif font-bold text-gray-900">🔍 HakiLens - Legal Research Hub</h1>
              <p className="text-lg text-gray-600">Advanced case search with HakiDraft AI assistance</p>
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
          {/* Comprehensive Case Scraper */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#008080]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Comprehensive Case Scraper</h2>
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
              <span>Deep Scrape Case</span>
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#008080] to-[#006666] rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">🤖 HakiDraft - AI Legal Research Assistant</h2>
              <p className="text-sm text-gray-600">Advanced legal analysis, case research, and document review</p>
            </div>
          </div>

          {/* AI Tools Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Keyword Generator</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">Convert natural language queries into effective legal search terms</p>
              <button
                onClick={() => handleGenerateKeywords(inputMessage || "recent contract dispute cases")}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Keywords
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-900">Case Analyzer</h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">Deep analysis of legal cases with structured summaries</p>
              <button
                onClick={() => handleSendMessage("Please explain how to analyze a legal case effectively")}
                className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Learn Analysis
              </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="font-medium text-emerald-900">Legal Research</h3>
              </div>
              <p className="text-sm text-emerald-700 mb-3">Expert guidance on research methodology and strategy</p>
              <button
                onClick={() => handleSendMessage("What's the best strategy for researching constitutional law cases in Kenya?")}
                className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get Strategy
              </button>
            </div>
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
              <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
                <p className="text-xs font-medium text-gray-700 mb-3 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-teal-600" />
                  Legal Research Suggestions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.slice(0, 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-xs px-3 py-2 bg-white border border-gray-300 hover:bg-teal-50 hover:border-teal-300 rounded-lg transition-all duration-200 text-left"
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
                    placeholder="Ask about legal research, case analysis, or Kenyan law..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-[#008080] resize-none text-sm"
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-[#008080] to-[#006666] text-white rounded-xl hover:from-[#006666] hover:to-[#004d4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                  title="Clear chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>AI assistance for research • Always consult qualified legal counsel</span>
                </div>
                <div className="text-xs text-teal-600 font-medium">
                  Powered by HakiDraft AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

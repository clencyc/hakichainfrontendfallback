import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Sparkles, 
  Bot, 
  Send, 
  User, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Scale,
  ExternalLink,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Gavel,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { 
  generateLegalChatResponse, 
  generateLegalSuggestions, 
  LegalChatMessage 
} from '../../lib/hakiDraftAI';
import {
  hakiLensAPI,
  CaseData,
  SearchFilters,
  ChatMessage,
  formatCaseTitle,
  formatHearingDate,
  getCaseTypeColor,
  getStatusColor,
  isValidKenyaLawUrl,
  validateSearchFilters,
  handleApiError
} from '../../services/hakiLensAPI';

export const HakiLensEnhanced = () => {
  const navigate = useNavigate();
  // Search and scraping state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<CaseData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingError, setScrapingError] = useState('');

  // Chat state
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

  // Case-specific chat state
  const [caseChatMessages, setCaseChatMessages] = useState<ChatMessage[]>([]);
  const [caseQuestion, setCaseQuestion] = useState('');
  const [isCaseChat, setIsCaseChat] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'search' | 'scrape' | 'chat' | 'case-details'>('search');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Update suggestions when input changes
  useEffect(() => {
    setSuggestions(generateLegalSuggestions(inputMessage));
  }, [inputMessage]);

  // Search cases
  const handleSearchCases = async () => {
    const validationErrors = validateSearchFilters(searchFilters);
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    setIsSearching(true);
    try {
      const result = await hakiLensAPI.searchCases(searchFilters);
      setSearchResults(result.cases);
      setActiveTab('search');
    } catch (error) {
      console.error('Search error:', error);
      alert(handleApiError(error));
    } finally {
      setIsSearching(false);
    }
  };

  // Scrape case
  const handleScrapeCase = async () => {
    if (!scrapingUrl.trim()) {
      setScrapingError('Please enter a valid URL');
      return;
    }

    // Enhanced URL validation
    if (!isValidKenyaLawUrl(scrapingUrl)) {
      setScrapingError('Please enter a valid Kenya Law URL (e.g., https://new.kenyalaw.org/caselaw/...)');
      return;
    }

    setScrapingError('');
    setIsScraping(true);

    console.log('Deep scraping case:', scrapingUrl);

    try {
      // Use the Python backend for scraping
      const response = await fetch('http://localhost:5007/scrape_case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: scrapingUrl })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('Python backend response:', result);
      
      // Handle the Python backend response format
      if (result.comprehensive_data) {
        // Extract case data from the comprehensive_data
        const comprehensiveData = result.comprehensive_data;
        const basicInfo = comprehensiveData.basic_info;
        
        // Handle cases where basic_info might have an error but still has data
        interface CaseDataFromAPI {
          case_number?: string;
          case_title?: string;
          court_name?: string;
          judge_name?: string;
          hearing_date?: string;
          hearing_time?: string;
          case_type?: string;
          status?: string;
          legal_representation?: string;
          subject_matter?: string;
          additional_details?: string;
        }
        
        let caseData: CaseDataFromAPI = {};
        if (basicInfo && basicInfo.cases && basicInfo.cases.length > 0) {
          caseData = basicInfo.cases[0];
        }
        
        const newCase: CaseData = {
          id: Date.now(), // Use timestamp as ID
          case_number: caseData.case_number || 'N/A',
          case_title: caseData.case_title || comprehensiveData.content?.title || result.title || 'Scraped Case',
          court_name: caseData.court_name || 'N/A',
          judge_name: caseData.judge_name || 'N/A',
          hearing_date: caseData.hearing_date || 'N/A',
          hearing_time: caseData.hearing_time || 'N/A',
          case_type: caseData.case_type || 'General',
          status: caseData.status || 'Active',
          legal_representation: caseData.legal_representation || 'N/A',
          subject_matter: caseData.subject_matter || 'Deep Reasearch from Kenya Law',
          additional_details: caseData.additional_details || '',
          source_url: scrapingUrl,
          scraped_at: comprehensiveData.scraped_at || new Date().toISOString(),
          full_content: comprehensiveData.content?.full_text || comprehensiveData.content || '',
          comprehensive_data: comprehensiveData,
          ai_analysis: result.ai_analysis || {},
          ai_summary: result.summary || 'Case Researched successfully. AI analysis may be limited due to backend configuration.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setSearchResults(prev => [newCase, ...prev]);
        // setSelectedCase(newCase);
        // setActiveTab('case-details');
        // Only navigate to the dedicated case details page from the case list UI
        
        // Clear the input
        setScrapingUrl('');
        
        // Show success message with warning if there was an AI error
        if (basicInfo?.error) {
          alert(`Case retrieved successfully! Note: AI analysis is limited due to backend configuration (${basicInfo.error.substring(0, 100)}...)`);
        } else {
          alert(`Case "${newCase.case_title}" researched successfully!`);
        }
      } else if (result.success && result.case_data) {
        // Convert Python backend response to our CaseData format
        const caseData = result.case_data;
        
        const newCase: CaseData = {
          id: Date.now(), // Use timestamp as ID since Python backend might not return database_id
          case_number: caseData.case_number || 'N/A',
          case_title: caseData.case_title || result.title || 'Researched Case',
          court_name: caseData.court_name || 'N/A',
          judge_name: caseData.judge_name || 'N/A',
          hearing_date: caseData.hearing_date || 'N/A',
          hearing_time: caseData.hearing_time || 'N/A',
          case_type: caseData.case_type || 'General',
          status: caseData.status || 'Active',
          legal_representation: caseData.legal_representation || 'N/A',
          subject_matter: caseData.subject_matter || result.summary || 'N/A',
          additional_details: caseData.additional_details || '',
          source_url: scrapingUrl,
          scraped_at: new Date().toISOString(),
          full_content: result.content || '',
          comprehensive_data: result,
          ai_analysis: result.analysis || {},
          ai_summary: result.summary || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setSearchResults(prev => [newCase, ...prev]);
        // setSelectedCase(newCase);
        // setActiveTab('case-details');
        // Only navigate to the dedicated case details page from the case list UI
        
        // Clear the input
        setScrapingUrl('');
        
        // Show success message
        alert(`Case "${newCase.case_title}" Researched successfully!`);
      } else {
        // Handle different response formats from Python backend
        setScrapingError(result.error || result.message || 'Failed to retrieve case data');
      }
    } catch (error) {
      console.error('thinking error:', error);
      setScrapingError(
        `thinking failed: ${
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error)
        }`
      );
    } finally {
      setIsScraping(false);
    }
  };

  // Generate case summary
  const handleGenerateSummary = async (caseId: number) => {
    setIsGeneratingSummary(true);
    try {
      const result = await hakiLensAPI.generateSummary(caseId);
      
      // Update the case in search results and selected case
      setSearchResults(prev => prev.map(c => 
        c.id === caseId ? { ...c, ai_summary: result.summary } : c
      ));
      
      if (selectedCase?.id === caseId) {
        setSelectedCase(prev => prev ? { ...prev, ai_summary: result.summary } : null);
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      alert(handleApiError(error));
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Handle general chat
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
        content: "⚠️ I apologize, but I encountered an error while processing your legal query. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle case-specific chat
  const handleCaseChatSend = async () => {
    if (!caseQuestion.trim() || !selectedCase || isCaseChat) return;

    setIsCaseChat(true);
    try {
      const result = await hakiLensAPI.caseChatChat(selectedCase.id, caseQuestion);
      
      const newMessage: ChatMessage = {
        id: Date.now(),
        user_question: caseQuestion,
        ai_response: result.response,
        timestamp: new Date().toISOString(),
        case_id: selectedCase.id
      };

      setCaseChatMessages(prev => [...prev, newMessage]);
      setCaseQuestion('');
    } catch (error) {
      console.error('Case chat error:', error);
      alert(handleApiError(error));
    } finally {
      setIsCaseChat(false);
    }
  };

  // Load case chat history when a case is selected
  useEffect(() => {
    if (selectedCase) {
      hakiLensAPI.getCaseChatHistory(selectedCase.id)
        .then(result => setCaseChatMessages(result.history))
        .catch(error => console.error('Failed to load chat history:', error));
    }
  }, [selectedCase]);

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
        content: "👋 Hello! I'm **HakiDraft**, your specialized AI legal research assistant. What legal research can I assist you with today?",
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
              <h1 className="text-3xl font-serif font-bold text-gray-900">🔍 HakiLens Enhanced - AI Legal Research</h1>
              <p className="text-lg text-gray-600">Advanced case search, scraping, and AI-powered analysis</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'search', label: 'Search Cases', icon: Search },
                { id: 'scrape', label: 'Research Case', icon: FileText },
                { id: 'chat', label: 'AI Assistant', icon: Brain },
                { id: 'case-details', label: 'Case Details', icon: Eye, disabled: !selectedCase }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'search' | 'scrape' | 'chat' | 'case-details')}
                  disabled={tab.disabled}
                  className={`${
                    activeTab === tab.id
                      ? 'border-[#008080] text-[#008080]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Legal Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={searchFilters.query || ''}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
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
                      value={searchFilters.case_number || ''}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, case_number: e.target.value }))}
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
                      value={searchFilters.court_name || ''}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, court_name: e.target.value }))}
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
                      value={searchFilters.year || ''}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="2020, 2021..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearchCases}
                  disabled={isSearching}
                  className="bg-[#008080] hover:bg-[#006666] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Cases</span>
                    </>
                  )}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Search Results ({searchResults.length} cases found)
                  </h3>
                  <div className="space-y-4">
                    {searchResults.map((caseData) => (
                      <div
                        key={caseData.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#008080] transition-colors cursor-pointer"
                        onClick={() => navigate(`/lawyer/hakilens/case/${caseData.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {formatCaseTitle(caseData)}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{caseData.court_name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatHearingDate(caseData.hearing_date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Gavel className="w-4 h-4" />
                                <span>{caseData.judge_name}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCaseTypeColor(caseData.case_type)}`}>
                                {caseData.case_type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData.status)}`}>
                                {caseData.status}
                              </span>
                            </div>
                            {caseData.ai_summary && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {caseData.ai_summary.substring(0, 200)}...
                              </p>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/lawyer/hakilens/case/${caseData.id}`);
                              }}
                              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                              <MessageSquare className="w-4 h-4 inline-block mr-1" /> Chat about case
                            </button>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(caseData.source_url, '_blank');
                              }}
                              className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                              title="View original source"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateSummary(caseData.id);
                              }}
                              disabled={isGeneratingSummary}
                              className="p-2 text-gray-400 hover:text-[#008080] transition-colors disabled:opacity-50"
                              title="Generate AI summary"
                            >
                              {isGeneratingSummary ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Scrape Tab */}
          {activeTab === 'scrape' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#008080]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Comprehensive Case Deep Research</h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case URL (Kenya Law Only)
                </label>
                <input
                  type="text"
                  value={scrapingUrl}
                  onChange={(e) => {
                    setScrapingUrl(e.target.value);
                    if (scrapingError) setScrapingError('');
                  }}
                  placeholder="https://new.kenyalaw.org/caselaw/cases/view/224752"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only Kenya Law URLs are supported (e.g., new.kenyalaw.org/caselaw/...)
                </p>
                {scrapingError && (
                  <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{scrapingError}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleScrapeCase}
                disabled={isScraping}
                className="bg-[#008080] hover:bg-[#006666] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Thinking on Case...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Deep Research Case</span>
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What This Tool Does:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Extracts comprehensive case information</li>
                  <li>• Performs AI-powered content analysis</li>
                  <li>• Generates structured case summaries</li>
                  <li>• Saves cases to your searchable database</li>
                  <li>• Enables case-specific AI chat</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* AI Tools Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Keyword Generator</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Convert natural language queries into effective legal search terms</p>
                  <button
                    onClick={() => handleSendMessage("Generate search keywords for recent contract dispute cases")}
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
                    onClick={() => handleSendMessage("Explain how to analyze a constitutional law case effectively")}
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

              {/* Chat Interface */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#008080] to-[#006666]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">HakiDraft - AI Legal Assistant</h2>
                      <p className="text-sm text-white/80">Advanced legal research and analysis</p>
                    </div>
                  </div>
                </div>

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
                            message.role === 'user' ? 'text-white/70' : 'text-gray-500'
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
            </motion.div>
          )}

          {/* Case Details Tab */}
          {activeTab === 'case-details' && selectedCase && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Case Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCaseTitle(selectedCase)}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedCase.court_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatHearingDate(selectedCase.hearing_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedCase.hearing_time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(selectedCase.source_url, '_blank')}
                      className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                      title="View original source"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleGenerateSummary(selectedCase.id)}
                      disabled={isGeneratingSummary}
                      className="p-2 text-gray-400 hover:text-[#008080] transition-colors disabled:opacity-50"
                      title="Regenerate AI summary"
                    >
                      {isGeneratingSummary ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCaseTypeColor(selectedCase.case_type)}`}>
                    {selectedCase.case_type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>

                {selectedCase.ai_summary && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>AI Summary</span>
                    </h3>
                    <div className="text-blue-800 text-sm whitespace-pre-line">
                      {selectedCase.ai_summary}
                    </div>
                  </div>
                )}
              </div>

              {/* Case Details and Chat */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Case Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Case Number</label>
                      <p className="text-gray-900">{selectedCase.case_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Judge</label>
                      <p className="text-gray-900">{selectedCase.judge_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Legal Representation</label>
                      <p className="text-gray-900">{selectedCase.legal_representation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject Matter</label>
                      <p className="text-gray-900">{selectedCase.subject_matter}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Additional Details</label>
                      <p className="text-gray-900">{selectedCase.additional_details}</p>
                    </div>
                  </div>
                </div>

                {/* Case-Specific Chat */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Case-Specific AI Chat</span>
                    </h3>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                    {caseChatMessages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-sm text-purple-900">
                            <strong>You:</strong> {message.user_question}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-800">
                            <strong>AI:</strong> {message.ai_response}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isCaseChat && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is thinking...</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={caseQuestion}
                        onChange={(e) => setCaseQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCaseChatSend()}
                        placeholder="Ask about this specific case..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                      <button
                        onClick={handleCaseChatSend}
                        disabled={!caseQuestion.trim() || isCaseChat}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

export default HakiLensEnhanced;

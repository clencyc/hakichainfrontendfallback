import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Database, Brain, Eye, FileText, 
  Download, Image as ImageIcon, Calendar, MapPin, Gavel,
  Users, Clock, AlertCircle, CheckCircle, X, Plus,
  ChevronLeft, ChevronRight, Loader2, Trash2, Edit3,
  ExternalLink, BookOpen, ArrowUpDown, RefreshCw
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

// Types based on your data models
interface Case {
  id: number;
  url: string;
  court?: string;
  case_number?: string;
  parties?: string;
  judges?: string;
  date?: string;
  citation?: string;
  title?: string;
  summary?: string;
  content_text?: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  case_id: number;
  file_path: string;
  url?: string;
  content_type?: string;
  created_at: string;
}

interface CaseImage {
  id: number;
  case_id: number;
  file_path: string;
  url?: string;
  alt_text?: string;
  created_at: string;
}

interface ScrapeResponse {
  status: string;
  case_ids?: number[];
  message?: string;
  processing_time?: string;
}

interface AIResponse {
  answer?: string;
  used_cases?: Case[];
  summary?: string;
}

interface AISummaryResponse {
  case_id: number;
  summary: string;
}

export const HakiLens = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('scrape');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Scrape states
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeType, setScrapeType] = useState('auto'); // auto, listing, case
  const [maxPages, setMaxPages] = useState(5);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse | null>(null);

  // Cases states
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCases, setTotalCases] = useState(0);
  const [casesPerPage] = useState(50);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Case details states
  const [caseDocuments, setCaseDocuments] = useState<Document[]>([]);
  const [caseImages, setCaseImages] = useState<CaseImage[]>([]);

  // AI states
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [summarizingCase, setSummarizingCase] = useState<number | null>(null);
  const [aiSummaries, setAiSummaries] = useState<{[key: number]: string}>({});
  const [viewingSummary, setViewingSummary] = useState<{caseId: number, summary: string} | null>(null);

  // API Configuration
  const API_BASE = '/api/hakilens'; // Use local proxy instead of direct ngrok URL

  // Utility functions
  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAISummary = (summary: string) => {
    // Remove markdown formatting and format for display
    return summary
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\n\n/g, '\n') // Reduce double line breaks
      .split('\n')
      .map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        // Handle numbered list items
        if (trimmed.match(/^\d+\.\s+\*\*/)) {
          const content = trimmed.replace(/^\d+\.\s+\*\*/, '').replace(/\*\*:?/, ':');
          return (
            <div key={index} className="mb-3">
              <h4 className="font-semibold text-blue-900 mb-1">{content}</h4>
            </div>
          );
        }
        
        // Handle sub-items with dash
        if (trimmed.startsWith('   - ')) {
          return (
            <div key={index} className="ml-4 mb-1 text-gray-700">
              • {trimmed.substring(5)}
            </div>
          );
        }
        
        // Handle regular content
        if (trimmed.length > 10) {
          return (
            <p key={index} className="mb-2 text-gray-800 leading-relaxed">
              {trimmed}
            </p>
          );
        }
        
        return null;
      })
      .filter(Boolean);
  };

  // API Functions
  const handleScrapeUrl = async () => {
    if (!scrapeUrl.trim()) {
      showError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setScrapeResult(null);

    try {
      let endpoint = '';
      let params = new URLSearchParams();
      
      if (scrapeType === 'auto') {
        endpoint = '/api/hakilens/scrape/url';
        params.append('url', scrapeUrl);
      } else if (scrapeType === 'listing') {
        endpoint = '/api/hakilens/scrape/listing';
        params.append('url', scrapeUrl);
        params.append('max_pages', maxPages.toString());
      } else if (scrapeType === 'case') {
        endpoint = '/api/hakilens/scrape/case';
        params.append('url', scrapeUrl);
      }

      const response = await fetch(`${API_BASE}${endpoint}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setScrapeResult(data);
      showSuccess(`Successfully scraped! ${data.case_ids?.length || 0} cases found.`);
      
      // Refresh cases list
      if (activeTab === 'cases') {
        loadCases();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to scrape URL');
    } finally {
      setLoading(false);
    }
  };

  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: casesPerPage.toString(),
        offset: ((currentPage - 1) * casesPerPage).toString()
      });

      if (searchQuery.trim()) {
        params.append('q', searchQuery);
      }

      console.log('Making API call to:', `${API_BASE}/cases?${params}`);

      const response = await fetch(`${API_BASE}/cases?${params}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different response formats
      let casesArray = [];
      let total = 0;
      
      if (Array.isArray(data)) {
        // Direct array response
        casesArray = data;
        total = data.length;
      } else if (data.items && Array.isArray(data.items)) {
        // Wrapped in items property (your API format)
        casesArray = data.items;
        total = data.total || data.items.length;
      } else if (data.cases && Array.isArray(data.cases)) {
        // Wrapped in cases property
        casesArray = data.cases;
        total = data.total || data.cases.length;
      } else if (data.data && Array.isArray(data.data)) {
        // Wrapped in data property
        casesArray = data.data;
        total = data.total || data.data.length;
      } else {
        console.warn('Unexpected API response format:', data);
        casesArray = [];
        total = 0;
      }
      
      console.log('Setting cases:', casesArray);
      setCases(casesArray);
      setTotalCases(total);
    } catch (err) {
      console.error('Failed to load cases:', err);
      showError(`Failed to load cases: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, casesPerPage, currentPage, searchQuery, showError]);

  const loadCaseDetails = async (caseId: number) => {
    try {
      // Load case details
      const caseResponse = await fetch(`${API_BASE}/cases/${caseId}`, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      if (caseResponse.ok) {
        const caseData = await caseResponse.json();
        setSelectedCase(caseData);
      }

      // Load documents
      const docsResponse = await fetch(`${API_BASE}/cases/${caseId}/documents`, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setCaseDocuments(docsData || []);
      }

      // Load images
      const imagesResponse = await fetch(`${API_BASE}/cases/${caseId}/images`, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setCaseImages(imagesData || []);
      }
    } catch (err) {
      console.error('Failed to load case details:', err);
      showError('Failed to load case details');
    }
  };

  const handleSummarizeCase = async (caseId: number) => {
    setSummarizingCase(caseId);
    try {
      const response = await fetch(`${API_BASE}/ai/summarize/${caseId}?model=gpt-4o-mini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: AISummaryResponse = await response.json();
      
      // Store the summary in our state
      setAiSummaries(prev => ({
        ...prev,
        [caseId]: data.summary
      }));
      
      showSuccess('Case summarized successfully!');
      
      // Refresh the case details if it's currently selected
      if (selectedCase?.id === caseId) {
        loadCaseDetails(caseId);
      }
    } catch (err) {
      console.error('Failed to summarize case:', err);
      showError('Failed to summarize case');
    } finally {
      setSummarizingCase(null);
    }
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) {
      showError('Please enter a question');
      return;
    }

    setLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: aiQuestion })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      showError('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (activeTab === 'cases') {
      loadCases();
    }
  }, [activeTab, loadCases]);

  // Render functions
  const renderScrapeTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Scraping Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { id: 'auto', label: 'Auto Detect', desc: 'Automatically detects case or listing' },
            { id: 'listing', label: 'Listing Crawl', desc: 'Crawl a listing with pagination' },
            { id: 'case', label: 'Single Case', desc: 'Scrape a single case detail page' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setScrapeType(option.id)}
              className={`p-3 text-left rounded-lg border transition-all ${
                scrapeType === option.id
                  ? 'border-blue-500 bg-blue-100 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL to Scrape
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="https://example.com/case-page-or-listing"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {scrapeType === 'listing' && (
            <input
              type="number"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value) || 5)}
              placeholder="Max pages"
              min="1"
              max="50"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          <button
            onClick={handleScrapeUrl}
            disabled={loading || !scrapeUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Search size={16} />
                Scrape
              </>
            )}
          </button>
        </div>
      </div>

      {scrapeResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-800 mb-3">
            <CheckCircle size={16} />
            <span className="font-medium">Scraping Completed</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 text-green-600">{scrapeResult.status}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cases Found:</span>
              <span className="ml-2">{scrapeResult.case_ids?.length || 0}</span>
            </div>
            {scrapeResult.processing_time && (
              <div>
                <span className="font-medium text-gray-700">Processing Time:</span>
                <span className="ml-2">{scrapeResult.processing_time}</span>
              </div>
            )}
            {scrapeResult.case_ids && scrapeResult.case_ids.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Case IDs:</span>
                <span className="ml-2">{scrapeResult.case_ids.join(', ')}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('cases')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            View Scraped Cases
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderCasesTab = () => (
    <div className="space-y-6">
      {/* Debug indicator */}
      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
        Debug: {cases.length} cases loaded, Loading: {loading.toString()}
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases by title, parties, or content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at">Date Created</option>
            <option value="title">Title</option>
            <option value="court">Court</option>
            <option value="case_number">Case Number</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowUpDown size={16} />
          </button>
          <button
            onClick={loadCases}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Cases grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Database size={48} className="mb-4" />
          <h3 className="text-lg font-medium mb-2">No Cases Found</h3>
          <p className="text-sm">Try adjusting your search or load more cases.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/lawyer/hakilens/case/${caseItem.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
                  {caseItem.title || `Case #${caseItem.case_number || caseItem.id}`}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSummarizeCase(caseItem.id);
                    }}
                    disabled={summarizingCase === caseItem.id}
                    className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Generate AI Summary"
                  >
                    {summarizingCase === caseItem.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Brain size={16} />
                    )}
                  </button>
                  {aiSummaries[caseItem.id] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingSummary({
                          caseId: caseItem.id,
                          summary: aiSummaries[caseItem.id]
                        });
                      }}
                      className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      title="View AI Summary"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {caseItem.court && (
                  <div className="flex items-center gap-2">
                    <Gavel size={14} />
                    <span>{caseItem.court}</span>
                  </div>
                )}
                {caseItem.parties && (
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span className="line-clamp-1">{caseItem.parties}</span>
                  </div>
                )}
                {caseItem.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{caseItem.date}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{formatDate(caseItem.created_at)}</span>
                </div>
              </div>

              {/* Show status if AI summary exists */}
              {aiSummaries[caseItem.id] && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-center gap-2 text-green-800">
                    <Brain size={12} />
                    <span className="font-medium">AI Summary Available</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingSummary({
                          caseId: caseItem.id,
                          summary: aiSummaries[caseItem.id]
                        });
                      }}
                      className="text-green-600 hover:text-green-800 underline"
                    >
                      View Summary
                    </button>
                  </div>
                </div>
              )}

              {/* Legacy summary display */}
              {caseItem.summary && !aiSummaries[caseItem.id] && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                  <div className="flex items-center gap-1 mb-1">
                    <Brain size={12} />
                    <span className="font-medium">Summary</span>
                  </div>
                  <p className="line-clamp-3">{caseItem.summary}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCases > casesPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * casesPerPage) + 1} to {Math.min(currentPage * casesPerPage, totalCases)} of {totalCases} cases
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * casesPerPage >= totalCases}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAITab = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-2">AI Legal Assistant</h3>
        <p className="text-purple-700 text-sm">
          Ask questions about your case database. The AI will search through case content and provide answers based on relevant cases.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ask a Legal Question
        </label>
        <div className="flex gap-3">
          <textarea
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="e.g., What are the key precedents for contract disputes in commercial law?"
            rows={3}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            disabled={loading}
          />
          <button
            onClick={handleAskAI}
            disabled={loading || !aiQuestion.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-start"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Brain size={16} />
                Ask AI
              </>
            )}
          </button>
        </div>
      </div>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {aiResponse.answer && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 text-purple-800 mb-3">
                <Brain size={16} />
                <span className="font-medium">AI Answer</span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">
                {aiResponse.answer}
              </div>
            </div>
          )}

          {aiResponse.used_cases && aiResponse.used_cases.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 mb-3">
                <BookOpen size={16} />
                <span className="font-medium">Referenced Cases ({aiResponse.used_cases.length})</span>
              </div>
              <div className="space-y-2">
                {aiResponse.used_cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/lawyer/hakilens/case/${caseItem.id}`)}
                  >
                    <div className="font-medium text-gray-900">
                      {caseItem.title || `Case #${caseItem.case_number || caseItem.id}`}
                    </div>
                    {caseItem.court && (
                      <div className="text-sm text-gray-600">{caseItem.court}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

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
              <h1 className="text-3xl font-serif font-bold text-gray-900">🔍 HakiLens - Comprehensive Legal Research Hub</h1>
              <p className="text-lg text-gray-600">Advanced case scraping, database management, and AI-powered analysis</p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
=======
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
>>>>>>> 23ba7ae863478c1338b397b2ffa380354049c9cd

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-800">{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'scrape', label: 'Research Cases', icon: Search },
            { id: 'cases', label: 'Case Database', icon: Database },
            { id: 'ai', label: 'AI Assistant', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'scrape' && renderScrapeTab()}
          {activeTab === 'cases' && renderCasesTab()}
          {activeTab === 'ai' && renderAITab()}
        </div>

        {/* Case Details Modal */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCase(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedCase.title || `Case #${selectedCase.case_number || selectedCase.id}`}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedCase.court} • {selectedCase.date}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                  {/* Case Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCase.parties && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parties</label>
                        <p className="text-gray-900">{selectedCase.parties}</p>
                      </div>
                    )}
                    {selectedCase.judges && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judges</label>
                        <p className="text-gray-900">{selectedCase.judges}</p>
                      </div>
                    )}
                    {selectedCase.citation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                        <p className="text-gray-900">{selectedCase.citation}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                      <a
                        href={selectedCase.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        View Original
                      </a>
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedCase.summary && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AI Summary</label>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">{selectedCase.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {selectedCase.content_text && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Content</label>
                      <div className="p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
                        <p className="text-gray-800 whitespace-pre-wrap text-sm">
                          {selectedCase.content_text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {caseDocuments.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                      <div className="space-y-2">
                        {caseDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.file_path.split('/').pop()}
                                </p>
                                <p className="text-sm text-gray-600">{doc.content_type}</p>
                              </div>
                            </div>
                            <a
                              href={`${API_BASE}/files/pdf/${doc.file_path.split('/').pop()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-800"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {caseImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {caseImages.map((img) => (
                          <div key={img.id} className="border border-gray-200 rounded-lg p-2">
                            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {img.file_path.split('/').pop()}
                            </p>
                            <a
                              href={`${API_BASE}/files/image/${img.file_path.split('/').pop()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Summary Modal */}
        <AnimatePresence>
          {viewingSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setViewingSummary(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="text-blue-600" size={24} />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">AI Case Summary</h2>
                        <p className="text-gray-600 mt-1">Case ID: {viewingSummary.caseId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingSummary(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="prose max-w-none">
                    {formatAISummary(viewingSummary.summary)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LawyerDashboardLayout>
  );
};

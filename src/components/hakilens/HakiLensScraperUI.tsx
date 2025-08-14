import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Globe, 
  FileText, 
  Eye,
  Layers,
  Brain,
  MessageCircle,
  Image,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  Zap,
  Database,
  Settings,
  BookOpen,
  Copy,
  Share2
} from 'lucide-react';

interface Case {
  id: string;
  title: string;
  court: string;
  date: string;
  summary?: string;
  documents?: Document[];
  images?: string[];
  status: 'new' | 'processing' | 'completed' | 'error';
}

interface Document {
  id: string;
  filename: string;
  type: 'pdf' | 'image';
  url: string;
  size?: number;
}

interface ScrapeResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  processingTime?: number;
}

export default function HakiLensScraperUI() {
  const [activeTab, setActiveTab] = useState<'scrape' | 'cases' | 'ai' | 'settings'>('scrape');
  const [activeSubTab, setActiveSubTab] = useState<'url' | 'listing' | 'case' | 'search'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);

  // Scraping states
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [deepExtraction, setDeepExtraction] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // AI states
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [summarizing, setSummarizing] = useState(false);

  // Base URL for the HakiLens API
  const API_BASE = 'https://f9e4cc818023.ngrok-free.app';

  useEffect(() => {
    checkHealth();
    loadCases();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      setHealth(data);
    } catch (err) {
      console.warn('Health check failed:', err);
    }
  };

  const loadCases = async () => {
    try {
      const response = await fetch(`${API_BASE}/cases`);
      if (response.ok) {
        const data = await response.json();
        setCases(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load cases:', err);
    }
  };

  const handleScrapeUrl = async () => {
    if (!scrapeUrl.trim()) {
      setError('Please enter a URL to scrape');
      return;
    }

    setIsLoading(true);
    clearMessages();
    setProgress(0);
    setProgressMessage('Initializing URL scraping...');

    try {
      const params = new URLSearchParams({
        url: scrapeUrl,
        deep: deepExtraction.toString()
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 20, 90);
          if (newProgress < 25) setProgressMessage('Connecting to URL...');
          else if (newProgress < 50) setProgressMessage('Extracting content...');
          else if (newProgress < 75) setProgressMessage('Processing data...');
          else setProgressMessage('Finalizing results...');
          return newProgress;
        });
      }, 600);

      const response = await fetch(`${API_BASE}/scrape/url?${params}`, {
        method: 'POST'
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Scraping complete!');

      const data = await response.json();
      
      if (response.ok) {
        setScrapeResults({ success: true, data });
        setSuccess('URL scraped successfully!');
        loadCases(); // Refresh cases
      } else {
        throw new Error(data.detail || 'Scraping failed');
      }
    } catch (err) {
      setError(`Scraping failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setScrapeResults({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  const handleScrapeListing = async () => {
    if (!scrapeUrl.trim()) {
      setError('Please enter a listing URL to scrape');
      return;
    }

    setIsLoading(true);
    clearMessages();
    setProgress(0);
    setProgressMessage('Initializing listing scrape...');

    try {
      const params = new URLSearchParams({
        url: scrapeUrl,
        max_pages: maxPages.toString(),
        deep: deepExtraction.toString()
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 15, 90);
          if (newProgress < 30) setProgressMessage('Connecting to target website...');
          else if (newProgress < 60) setProgressMessage('Extracting case listings...');
          else setProgressMessage('Processing case data...');
          return newProgress;
        });
      }, 800);

      const response = await fetch(`${API_BASE}/scrape/listing?${params}`, {
        method: 'POST'
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Complete!');

      const data = await response.json();
      
      if (response.ok) {
        setScrapeResults({ success: true, data });
        setSuccess(`Listing scraped successfully! Found ${data.total || 0} cases`);
        loadCases(); // Refresh cases
      } else {
        throw new Error(data.detail || 'Listing scraping failed');
      }
    } catch (err) {
      setError(`Listing scraping failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setScrapeResults({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  const handleScrapeCase = async () => {
    if (!scrapeUrl.trim()) {
      setError('Please enter a case URL to scrape');
      return;
    }

    setIsLoading(true);
    clearMessages();
    setProgress(0);
    setProgressMessage('Starting deep case scraping...');

    try {
      const params = new URLSearchParams({
        url: scrapeUrl,
        deep: deepExtraction.toString()
      });

      // Simulate progress updates with more detailed messages for case scraping
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 12, 90);
          if (newProgress < 20) setProgressMessage('Connecting to case URL...');
          else if (newProgress < 40) setProgressMessage('Extracting case metadata...');
          else if (newProgress < 60) setProgressMessage('Processing case documents...');
          else if (newProgress < 80) setProgressMessage('Analyzing legal content...');
          else setProgressMessage('Finalizing case data...');
          return newProgress;
        });
      }, 1000);

      const response = await fetch(`${API_BASE}/scrape/case?${params}`, {
        method: 'POST'
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Case scraping complete!');

      const data = await response.json();
      
      if (response.ok) {
        setScrapeResults({ success: true, data });
        setSuccess('Case scraped successfully with deep analysis!');
        loadCases(); // Refresh cases
      } else {
        throw new Error(data.detail || 'Case scraping failed');
      }
    } catch (err) {
      setError(`Case scraping failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setScrapeResults({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  const handleSummarizeCase = async (caseId: string) => {
    setSummarizing(true);
    clearMessages();

    try {
      const response = await fetch(`${API_BASE}/ai/summarize/${caseId}`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Case summarized successfully!');
        // Update the case with summary
        setCases(prev => prev.map(c => 
          c.id === caseId ? { ...c, summary: data.summary } : c
        ));
      } else {
        throw new Error(data.detail || 'Summarization failed');
      }
    } catch (err) {
      setError(`Summarization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSummarizing(false);
    }
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim()) {
      setError('Please enter a question for AI');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: aiQuery })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAiResponse(data.answer || data.response || 'No response');
        setSuccess('AI query completed!');
      } else {
        throw new Error(data.detail || 'AI query failed');
      }
    } catch (err) {
      setError(`AI query failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHealthStatus = () => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-gray-800">HakiLens Scraper API</span>
          {health && (
            <span className="text-sm text-gray-600">Status: Online</span>
          )}
        </div>
        <button
          onClick={checkHealth}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderScrapeTab = () => (
    <div className="space-y-6">
      {/* Scrape Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'url', label: 'Single URL', icon: Globe, desc: 'Scrape one case URL' },
          { key: 'listing', label: 'Listing', icon: Layers, desc: 'Scrape multiple cases' },
          { key: 'case', label: 'Case Search', icon: Search, desc: 'Search specific case' },
          { key: 'search', label: 'Full Search', icon: Database, desc: 'Advanced search' }
        ].map(({ key, label, icon: Icon, desc }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSubTab(key as typeof activeSubTab)}
            className={`p-4 rounded-xl border-2 transition-all ${
              activeSubTab === key
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <Icon className={`w-6 h-6 mx-auto mb-2 ${
              activeSubTab === key ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </motion.button>
        ))}
      </div>

      {/* Scrape Form */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          {activeSubTab === 'url' && <><Globe className="w-5 h-5 mr-2 text-blue-600" />URL Scraper</>}
          {activeSubTab === 'listing' && <><Layers className="w-5 h-5 mr-2 text-green-600" />Listing Scraper</>}
          {activeSubTab === 'case' && <><Search className="w-5 h-5 mr-2 text-purple-600" />Case Search</>}
          {activeSubTab === 'search' && <><Database className="w-5 h-5 mr-2 text-orange-600" />Full Search</>}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeSubTab === 'listing' ? 'Listing URL' : 'URL'}
            </label>
            <input
              type="url"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder={
                activeSubTab === 'listing' 
                  ? 'https://example.com/cases'
                  : 'https://example.com/case/123'
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="deepExtraction"
                checked={deepExtraction}
                onChange={(e) => setDeepExtraction(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="deepExtraction" className="text-sm font-medium text-gray-700">
                Deep Extraction (AKN/PDF)
              </label>
            </div>

            {activeSubTab === 'listing' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pages
                </label>
                <input
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {activeSubTab === 'url' && (
              <button
                onClick={handleScrapeUrl}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                Scrape URL
              </button>
            )}

            {activeSubTab === 'listing' && (
              <button
                onClick={handleScrapeListing}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
                Scrape Listing
              </button>
            )}

            {activeSubTab === 'case' && (
              <button
                onClick={handleScrapeCase}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Deep Scrape Case
              </button>
            )}

            {activeSubTab === 'search' && (
              <button
                onClick={() => {
                  setError('Search functionality coming soon!');
                }}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                Full Search
              </button>
            )}

            <button
              onClick={() => {
                setScrapeUrl('');
                setScrapeResults(null);
                setProgress(0);
                setProgressMessage('');
                clearMessages();
              }}
              className="flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>

          {/* Progress Bar */}
          {isLoading && progress > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{progressMessage}</span>
                <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Scrape Results */}
      {scrapeResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${
            scrapeResults.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            {scrapeResults.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            )}
            Scrape Results
          </h3>
          
          {scrapeResults.success ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <strong>Status:</strong> Success
              </div>
              {scrapeResults.data && (
                <div className="bg-white p-4 rounded-lg">
                  <pre className="text-xs text-gray-800 overflow-auto max-h-40">
                    {JSON.stringify(scrapeResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-700">
              <strong>Error:</strong> {scrapeResults.error}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderCasesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Scraped Cases</h2>
        <button
          onClick={loadCases}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cases.map((case_item, index) => (
          <motion.div
            key={case_item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {case_item.title || `Case ${case_item.id}`}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                case_item.status === 'completed' ? 'bg-green-100 text-green-800' :
                case_item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                case_item.status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {case_item.status}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              {case_item.court && <div><strong>Court:</strong> {case_item.court}</div>}
              {case_item.date && <div><strong>Date:</strong> {case_item.date}</div>}
            </div>

            {case_item.summary && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {case_item.summary}
              </p>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => console.log('View case:', case_item.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSummarizeCase(case_item.id)}
                  disabled={summarizing}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                >
                  {summarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex text-xs text-gray-500 space-x-3">
                {case_item.documents && (
                  <span className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {case_item.documents.length}
                  </span>
                )}
                {case_item.images && (
                  <span className="flex items-center">
                    <Image className="w-3 h-3 mr-1" />
                    {case_item.images.length}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No cases found. Start by scraping some URLs!</p>
        </div>
      )}
    </div>
  );

  const renderAITab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-600" />
          AI Assistant
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask AI about your cases
            </label>
            <textarea
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="What legal precedents are relevant to contract disputes in Kenya?"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <button
            onClick={handleAskAI}
            disabled={isLoading}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageCircle className="w-4 h-4 mr-2" />}
            Ask AI
          </button>
        </div>
      </div>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            AI Response
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(aiResponse)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-gray-600" />
          API Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <input
              type="url"
              value={API_BASE}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Health Status</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-blue-700">Connected</span>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">API Version</h3>
              <span className="text-sm text-purple-700">v0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <BookOpen className="w-10 h-10 mr-3 text-blue-600" />
            HakiLens Scraper
          </h1>
          <p className="text-gray-600">Intelligent legal case scraping and analysis platform</p>
        </div>

        {renderHealthStatus()}

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={clearMessages}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-green-700">{success}</span>
              <button
                onClick={clearMessages}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 bg-white rounded-t-xl">
            <nav className="-mb-px flex">
              {[
                { key: 'scrape', label: 'Scrape Data', icon: Globe },
                { key: 'cases', label: 'Cases', icon: FileText },
                { key: 'ai', label: 'AI Assistant', icon: Brain },
                { key: 'settings', label: 'Settings', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'scrape' && renderScrapeTab()}
              {activeTab === 'cases' && renderCasesTab()}
              {activeTab === 'ai' && renderAITab()}
              {activeTab === 'settings' && renderSettingsTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

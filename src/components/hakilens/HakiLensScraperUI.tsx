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

interface DeepResearchResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  processingTime?: number;
}

function HakiLensScraperUI() {
  const [activeTab, setActiveTab] = useState<'deep research' | 'cases' | 'ai'>('deep research');
  const [activeSubTab, setActiveSubTab] = useState<'url' | 'listing' | 'case' | 'search'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);

  // Deep research states
  const [researchUrl, setResearchUrl] = useState('');
  const [deepExtraction, setDeepExtraction] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [researchResults, setResearchResults] = useState<DeepResearchResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // AI states
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [summarizing, setSummarizing] = useState(false);

  // Base URL for the HakiLens API
  const API_BASE = '/api/hakilens';

  // Stub for checkHealth
  const checkHealth = async () => {
    // Example: setHealth({ status: 'ok' });
    setHealth({ status: 'ok' });
  };

  // Stub for loadCases
  const loadCases = async () => {
    // Example: setCases([]);
    setCases([]);
  };

  // Stub for clearMessages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Stub for handleSummarizeCase
  const handleSummarizeCase = async (caseId: string) => {
    setSummarizing(true);
    try {
      // Simulate API call
      const data = { summary: 'This is a summary.' };
      setSuccess('Case summarized successfully!');
      setCases(prev => prev.map(c => 
        c.id === caseId ? { ...c, summary: data.summary } : c
      ));
    } catch (err) {
      setError(`Summarization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSummarizing(false);
    }
  };

  useEffect(() => {
    checkHealth();
    loadCases();
  }, []);

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

  const handleDeepResearchUrl = async () => {
    if (!researchUrl.trim()) {
      setError('Please enter a URL for deep research');
      return;
    }

    setIsLoading(true);
    clearMessages();
    setProgress(0);
    setProgressMessage('Initializing deep research...');

    try {
      const params = new URLSearchParams({
        url: researchUrl,
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

      const response = await fetch(`${API_BASE}/deep-research/url?${params}`, {
        method: 'POST'
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Deep research complete!');

      const data = await response.json();
      
      if (response.ok) {
        setResearchResults({ success: true, data });
        setSuccess('URL researched successfully!');
        loadCases(); // Refresh cases
      } else {
        throw new Error(data.detail || 'Deep research failed');
      }
    } catch (err) {
      setError(`Deep research failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResearchResults({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  // Stub for renderHealthStatus
  const renderHealthStatus = () => (
    <div className="mb-4">
      {/* Example health status */}
      {health && health.status === 'ok' && (
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          API Connected
        </div>
      )}
    </div>
  );

  // Render Scrape Tab (moved misplaced JSX here)
  const renderScrapeTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {activeSubTab === 'url' && <><Globe className="w-5 h-5 mr-2 text-blue-600" />URL Deep Research</>}
        {activeSubTab === 'listing' && <><Layers className="w-5 h-5 mr-2 text-green-600" />Listing Deep Research</>}
        {activeSubTab === 'case' && <><Search className="w-5 h-5 mr-2 text-purple-600" />Case Research</>}
        {activeSubTab === 'search' && <><Database className="w-5 h-5 mr-2 text-orange-600" />Full Research</>}
      </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeSubTab === 'listing' ? 'Listing URL' : 'URL'}
            </label>
            <input
              type="url"
              value={researchUrl}
              onChange={(e) => setResearchUrl(e.target.value)}
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
                onClick={handleDeepResearchUrl}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                Deep Research URL
              </button>
            )}

            {activeSubTab === 'listing' && (
              <button
                onClick={handleDeepResearchUrl}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
                Deep Research Listing
              </button>
            )}

            {activeSubTab === 'case' && (
              <button
                onClick={handleDeepResearchUrl}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Deep Research Case
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
                setResearchUrl('');
                setResearchResults(null);
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

      {/* Deep Research Results */}
      {researchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${
            researchResults.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            {researchResults.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            )}
            Deep Research Results
          </h3>
          
          {researchResults.success ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <strong>Status:</strong> Success
              </div>
              {researchResults.data && (
                <div className="bg-white p-4 rounded-lg">
                  <pre className="text-xs text-gray-800 overflow-auto max-h-40">
                    {JSON.stringify(researchResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-700">
              <strong>Error:</strong> {researchResults.error}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderCasesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Researched Cases</h2>
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
          <p>No cases found. Start by running deep research on some URLs!</p>
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
            HakiLens Deep Research
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
          { key: 'deep research', label: 'Deep Research', icon: Globe },
          { key: 'cases', label: 'Cases', icon: FileText },
          { key: 'ai', label: 'AI Assistant', icon: Brain }
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
              {activeTab === 'deep research' && renderScrapeTab()}
              {activeTab === 'cases' && renderCasesTab()}
              {activeTab === 'ai' && renderAITab()}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

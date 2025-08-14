import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  QrCode, 
  Mic, 
  Heart, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Smartphone,
  MonitorSpeaker,
  WifiOff,
  Star,
  Layers,
  History
} from 'lucide-react';
import { hakiLensAPI, handleApiError } from '../../services/EnhancedHakiLensAPI';
import type { 
  QuickSearchResponse,
  ScanAnalysisResponse,
  VoiceQueryResponse,
  FavoritesListResponse,
  ComparisonResponse,
  HistoryResponse,
  FeaturesResponse
} from '../../services/EnhancedHakiLensAPI';

interface HealthStatus {
  python: { status: string; available: boolean };
  nodejs: { status: string; available: boolean };
}

export default function HakiLensPythonIntegration() {
  const [activeTab, setActiveTab] = useState<'search' | 'scan' | 'voice' | 'favorites' | 'compare' | 'history'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [features, setFeatures] = useState<FeaturesResponse | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    court: '',
    year: '',
    case_type: ''
  });
  const [searchResults, setSearchResults] = useState<QuickSearchResponse | null>(null);

  // Scan states
  const [scanData, setScanData] = useState('');
  const [scanType, setScanType] = useState<'qr_code' | 'document' | 'barcode'>('qr_code');
  const [scanResults, setScanResults] = useState<ScanAnalysisResponse | null>(null);

  // Voice states
  const [voiceText, setVoiceText] = useState('');
  const [voiceResults, setVoiceResults] = useState<VoiceQueryResponse | null>(null);

  // Favorites states
  const [favorites, setFavorites] = useState<FavoritesListResponse | null>(null);

  // Comparison states
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResponse | null>(null);

  // History states
  const [historyType, setHistoryType] = useState<'all' | 'search' | 'scan' | 'voice' | 'favorites'>('all');
  const [history, setHistory] = useState<HistoryResponse | null>(null);

  // Initialize component
  useEffect(() => {
    checkHealth();
    loadFeatures();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const checkHealth = async () => {
    try {
      const health = await hakiLensAPI.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      setError('Failed to check backend health: ' + handleApiError(err));
    }
  };

  const loadFeatures = async () => {
    try {
      const featuresData = await hakiLensAPI.getFeatures();
      setFeatures(featuresData);
    } catch (err) {
      console.warn('Python backend features unavailable:', err);
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const results = await hakiLensAPI.quickSearch(searchQuery, {
        court_name: searchFilters.court || undefined,
        year: searchFilters.year || undefined,
        case_number: searchFilters.case_type || undefined
      });
      
      setSearchResults(results);
      setSuccess(`Found ${results.total_found} cases in ${results.search_time}s`);
    } catch (err) {
      setError('Search failed: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Scan functionality
  const handleScan = async () => {
    if (!scanData.trim()) {
      setError('Please enter scan data');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const results = await hakiLensAPI.analyzeScan(scanData, scanType);
      setScanResults(results);
      
      if (results.success) {
        setSuccess('Scan analyzed successfully');
      } else {
        setError(results.message);
      }
    } catch (err) {
      setError('Scan analysis failed: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Voice functionality
  const handleVoiceQuery = async () => {
    if (!voiceText.trim()) {
      setError('Please enter voice text');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const results = await hakiLensAPI.processVoiceQuery(voiceText);
      setVoiceResults(results);
      setSuccess('Voice query processed successfully');
    } catch (err) {
      setError('Voice query failed: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Favorites functionality
  const loadFavorites = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const favData = await hakiLensAPI.getFavorites();
      setFavorites(favData);
      setSuccess(`Loaded ${favData.favorites.length} favorites`);
    } catch (err) {
      setError('Failed to load favorites: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (caseId: string) => {
    try {
      await hakiLensAPI.addFavorite(caseId);
      setSuccess('Added to favorites');
      loadFavorites(); // Refresh
    } catch (err) {
      setError('Failed to add favorite: ' + handleApiError(err));
    }
  };

  // Comparison functionality
  const handleComparison = async () => {
    if (selectedCases.length < 2) {
      setError('Please select at least 2 cases to compare');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const results = await hakiLensAPI.compareCases(selectedCases);
      setComparisonResults(results);
      setSuccess('Case comparison completed');
    } catch (err) {
      setError('Comparison failed: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // History functionality
  const loadHistory = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const historyData = await hakiLensAPI.getHistory(historyType, 10);
      setHistory(historyData);
      setSuccess(`Loaded ${historyData.history.length} history items`);
    } catch (err) {
      setError('Failed to load history: ' + handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderHealthStatus = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Backend Status</h3>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Python Backend:</span>
          {healthStatus?.python.available ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Online
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <WifiOff className="w-4 h-4 mr-1" />
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <MonitorSpeaker className="w-4 h-4" />
          <span className="text-sm font-medium">Node.js Backend:</span>
          {healthStatus?.nodejs.available ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Online
            </span>
          ) : (
            <span className="flex items-center text-amber-600">
              <WifiOff className="w-4 h-4 mr-1" />
              Offline
            </span>
          )}
        </div>
      </div>
      {features && (
        <div className="mt-2 text-xs text-gray-600">
          Available features: {Object.entries(features.mobile_features)
            .filter(([, enabled]) => enabled)
            .map(([feature]) => feature.replace('_', ' '))
            .join(', ')}
        </div>
      )}
    </div>
  );

  const renderSearchTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
          Search
        </button>
      </div>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Court name"
          value={searchFilters.court}
          onChange={(e) => setSearchFilters(prev => ({ ...prev, court: e.target.value }))}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Year"
          value={searchFilters.year}
          onChange={(e) => setSearchFilters(prev => ({ ...prev, year: e.target.value }))}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Case type"
          value={searchFilters.case_type}
          onChange={(e) => setSearchFilters(prev => ({ ...prev, case_type: e.target.value }))}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Search Results</h3>
          {searchResults.cases.map((case_item, index) => (
            <motion.div
              key={case_item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-600">{case_item.case_title}</h4>
                  <p className="text-sm text-gray-600">{case_item.case_number}</p>
                  <p className="text-sm text-gray-500">{case_item.court_name} • {case_item.hearing_date}</p>
                  {case_item.quick_summary && (
                    <p className="text-sm mt-2">{case_item.quick_summary}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToFavorites(case_item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCases(prev => 
                        prev.includes(case_item.id) 
                          ? prev.filter(id => id !== case_item.id)
                          : [...prev, case_item.id]
                      );
                    }}
                    className={`p-2 transition-colors ${
                      selectedCases.includes(case_item.id) 
                        ? 'text-blue-500' 
                        : 'text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderScanTab = () => (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value as 'qr_code' | 'document' | 'barcode')}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="qr_code">QR Code</option>
          <option value="document">Document</option>
          <option value="barcode">Barcode</option>
        </select>
        <input
          type="text"
          placeholder="Paste scan data here..."
          value={scanData}
          onChange={(e) => setScanData(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleScan}
          disabled={isLoading}
          className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <QrCode className="w-4 h-4 mr-2" />}
          Analyze
        </button>
      </div>

      {scanResults && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Scan Results</h3>
          <p className="text-sm text-gray-600 mb-3">{scanResults.message}</p>
          
          {scanResults.case_data && (
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold">{scanResults.case_data.case_title}</h4>
              <p className="text-sm text-gray-600">{scanResults.case_data.case_number}</p>
              <p className="text-sm text-gray-500">{scanResults.case_data.court_name}</p>
            </div>
          )}
          
          {scanResults.suggestion && (
            <div className="mt-3 p-3 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-800">{scanResults.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderVoiceTab = () => (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Enter voice query text..."
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleVoiceQuery()}
        />
        <button
          onClick={handleVoiceQuery}
          disabled={isLoading}
          className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          Process
        </button>
      </div>

      {voiceResults && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Voice Query Response</h3>
          <p className="mb-3">{voiceResults.response}</p>
          <p className="text-sm text-gray-600 mb-3">Confidence: {(voiceResults.confidence * 100).toFixed(1)}%</p>
          
          {voiceResults.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1">
                {voiceResults.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Favorites</h3>
        <button
          onClick={loadFavorites}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
          Refresh
        </button>
      </div>

      {favorites && (
        <div className="space-y-3">
          {favorites.favorites.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No favorites yet</p>
          ) : (
            favorites.favorites.map((favorite, index) => (
              <motion.div
                key={favorite.case_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-blue-600">{favorite.case_title}</h4>
                    <p className="text-sm text-gray-500">Added: {new Date(favorite.added_date).toLocaleDateString()}</p>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderComparisonTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Case Comparison</h3>
        <button
          onClick={handleComparison}
          disabled={isLoading || selectedCases.length < 2}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Layers className="w-4 h-4 mr-2" />}
          Compare ({selectedCases.length})
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Selected cases: {selectedCases.length}</p>
        <div className="flex flex-wrap gap-2">
          {selectedCases.map(caseId => (
            <span key={caseId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {caseId}
            </span>
          ))}
        </div>
      </div>

      {comparisonResults && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Comparison Analysis</h3>
          <p className="mb-4">{comparisonResults.analysis}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Similarities</h4>
              <ul className="list-disc list-inside space-y-1">
                {comparisonResults.similarities.map((similarity, index) => (
                  <li key={index} className="text-sm">{similarity}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Differences</h4>
              <ul className="list-disc list-inside space-y-1">
                {comparisonResults.differences.map((difference, index) => (
                  <li key={index} className="text-sm">{difference}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {comparisonResults.precedents && comparisonResults.precedents.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-purple-600 mb-2">Precedents</h4>
              <ul className="list-disc list-inside space-y-1">
                {comparisonResults.precedents.map((precedent, index) => (
                  <li key={index} className="text-sm">{precedent}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Activity History</h3>
        <div className="flex space-x-2">
          <select
            value={historyType}
            onChange={(e) => setHistoryType(e.target.value as typeof historyType)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="search">Search</option>
            <option value="scan">Scan</option>
            <option value="voice">Voice</option>
            <option value="favorites">Favorites</option>
          </select>
          <button
            onClick={loadHistory}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <History className="w-4 h-4 mr-2" />}
            Load
          </button>
        </div>
      </div>

      {history && (
        <div className="space-y-3">
          {history.history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history found</p>
          ) : (
            history.history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.action}</p>
                    {item.case_title && (
                      <p className="text-sm text-blue-600">{item.case_title}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HakiLens - Python Backend Integration</h1>
        <p className="text-gray-600">Enhanced case search with mobile-optimized features</p>
      </div>

      {renderHealthStatus()}

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
          >
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-700">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'search', label: 'Quick Search', icon: Search },
              { key: 'scan', label: 'Scan Analysis', icon: QrCode },
              { key: 'voice', label: 'Voice Query', icon: Mic },
              { key: 'favorites', label: 'Favorites', icon: Heart },
              { key: 'compare', label: 'Compare', icon: Layers },
              { key: 'history', label: 'History', icon: History }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'search' && renderSearchTab()}
            {activeTab === 'scan' && renderScanTab()}
            {activeTab === 'voice' && renderVoiceTab()}
            {activeTab === 'favorites' && renderFavoritesTab()}
            {activeTab === 'compare' && renderComparisonTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Enhanced HakiLens API Service for Python Backend Integration
// Frontend integration for HakiLens case search and AI analysis with Python backend

const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || 'http://localhost:5007';
const NODEJS_BACKEND_URL = import.meta.env.VITE_NODEJS_BACKEND_URL || 'http://localhost:8001';

// Mobile/Python backend specific interfaces
export interface QuickSearchRequest {
  query: string;
  filters?: {
    court?: string;
    year?: string;
    case_type?: string;
  };
  limit?: number;
  user_id: string;
}

export interface QuickSearchResponse {
  success: boolean;
  cases: Array<{
    id: string;
    case_title: string;
    case_number: string;
    court_name: string;
    hearing_date: string;
    case_type: string;
    status: string;
    quick_summary?: string;
  }>;
  total_found: number;
  search_time: number;
}

export interface ScanAnalysisRequest {
  scan_data: string;
  scan_type: 'qr_code' | 'document' | 'barcode';
  user_id: string;
}

export interface ScanAnalysisResponse {
  success: boolean;
  message: string;
  case_data?: {
    id: string;
    case_title: string;
    case_number: string;
    court_name: string;
    status: string;
  };
  suggestion?: string;
}

export interface VoiceQueryRequest {
  audio_text: string;
  confidence_score: number;
  user_id: string;
}

export interface VoiceQueryResponse {
  success: boolean;
  response: string;
  suggestions: string[];
  confidence: number;
}

export interface FavoriteRequest {
  case_id: string;
  user_id: string;
}

export interface FavoriteResponse {
  success: boolean;
  message: string;
}

export interface FavoritesListResponse {
  favorites: Array<{
    case_id: string;
    case_title: string;
    added_date: string;
  }>;
}

export interface ComparisonRequest {
  case_ids: string[];
  user_id: string;
}

export interface ComparisonResponse {
  success: boolean;
  analysis: string;
  similarities: string[];
  differences: string[];
  precedents?: string[];
}

export interface HistoryResponse {
  history: Array<{
    id: string;
    action: string;
    case_id?: string;
    case_title?: string;
    timestamp: string;
  }>;
}

export interface FeaturesResponse {
  mobile_features: {
    quick_search: boolean;
    qr_scanning: boolean;
    voice_search: boolean;
    favorites: boolean;
    case_comparison: boolean;
    offline_sync: boolean;
  };
}

// Keep existing interfaces from the previous implementation
export interface CaseBasicInfo {
  case_number: string;
  case_title: string;
  court_name: string;
  judge_name: string;
  hearing_date: string;
  hearing_time: string;
  case_type: string;
  status: string;
  legal_representation: string;
  subject_matter: string;
  additional_details: string;
}

export interface CaseData {
  id: number;
  case_number: string;
  case_title: string;
  court_name: string;
  judge_name: string;
  hearing_date: string;
  hearing_time: string;
  case_type: string;
  status: string;
  legal_representation: string;
  subject_matter: string;
  additional_details: string;
  source_url: string;
  scraped_at: string;
  full_content: string;
  ai_summary: string;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  query?: string;
  case_number?: string;
  court_name?: string;
  year?: string;
}

class EnhancedHakiLensAPI {
  private pythonBackendUrl: string;
  private nodejsBackendUrl: string;
  private userId: string;

  constructor(pythonUrl = PYTHON_BACKEND_URL, nodejsUrl = NODEJS_BACKEND_URL) {
    this.pythonBackendUrl = pythonUrl;
    this.nodejsBackendUrl = nodejsUrl;
    this.userId = this.getUserId();
  }

  private getUserId(): string {
    let userId = localStorage.getItem('hakichain_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('hakichain_user_id', userId);
    }
    return userId;
  }

  private async request<T = unknown>(
    url: string, 
    options: RequestInit = {}, 
    usePythonBackend = true
  ): Promise<T> {
    const baseUrl = usePythonBackend ? this.pythonBackendUrl : this.nodejsBackendUrl;
    const fullUrl = `${baseUrl}${url}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(fullUrl, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ===========================================
  // PYTHON BACKEND ENDPOINTS (Mobile/Enhanced)
  // ===========================================

  // Get available features from Python backend
  async getFeatures(): Promise<FeaturesResponse> {
    return this.request<FeaturesResponse>('/mobile/features');
  }

  // Quick search optimized for mobile
  async quickSearch(
    query: string, 
    filters: SearchFilters = {}, 
    limit = 10
  ): Promise<QuickSearchResponse> {
    return this.request<QuickSearchResponse>('/mobile/quick_search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filters: {
          court: filters.court_name,
          year: filters.year,
          case_type: filters.case_number
        },
        limit,
        user_id: this.userId
      })
    });
  }

  // Analyze scanned QR codes or documents
  async analyzeScan(
    scanData: string, 
    scanType: 'qr_code' | 'document' | 'barcode'
  ): Promise<ScanAnalysisResponse> {
    return this.request<ScanAnalysisResponse>('/mobile/scan_analysis', {
      method: 'POST',
      body: JSON.stringify({
        scan_data: scanData,
        scan_type: scanType,
        user_id: this.userId
      })
    });
  }

  // Process voice queries
  async processVoiceQuery(
    audioText: string, 
    confidenceScore = 1.0
  ): Promise<VoiceQueryResponse> {
    return this.request<VoiceQueryResponse>('/mobile/voice_query', {
      method: 'POST',
      body: JSON.stringify({
        audio_text: audioText,
        confidence_score: confidenceScore,
        user_id: this.userId
      })
    });
  }

  // Sync offline data
  async syncOfflineData(limit = 50): Promise<{ success: boolean; synced_count: number }> {
    return this.request<{ success: boolean; synced_count: number }>(`/mobile/sync?limit=${limit}`);
  }

  // Add case to favorites
  async addFavorite(caseId: string): Promise<FavoriteResponse> {
    return this.request<FavoriteResponse>('/mobile/favorites', {
      method: 'POST',
      body: JSON.stringify({
        case_id: caseId,
        user_id: this.userId
      })
    });
  }

  // Remove case from favorites
  async removeFavorite(caseId: string): Promise<FavoriteResponse> {
    return this.request<FavoriteResponse>('/mobile/favorites', {
      method: 'DELETE',
      body: JSON.stringify({
        case_id: caseId,
        user_id: this.userId
      })
    });
  }

  // Get user's favorite cases
  async getFavorites(): Promise<FavoritesListResponse> {
    return this.request<FavoritesListResponse>(`/mobile/favorites/${this.userId}`);
  }

  // Compare multiple cases
  async compareCases(caseIds: string[]): Promise<ComparisonResponse> {
    return this.request<ComparisonResponse>('/mobile/compare_cases', {
      method: 'POST',
      body: JSON.stringify({
        case_ids: caseIds,
        user_id: this.userId
      })
    });
  }

  // Get user activity history
  async getHistory(
    type: 'all' | 'search' | 'scan' | 'voice' | 'favorites' = 'all', 
    limit = 10
  ): Promise<HistoryResponse> {
    return this.request<HistoryResponse>(
      `/mobile/history/${this.userId}?type=${type}&limit=${limit}`
    );
  }

  // ===========================================
  // NODE.JS BACKEND ENDPOINTS (Original)
  // ===========================================

  // Get comprehensive case details (Node.js backend)
  async getCaseDetails(caseId: number): Promise<CaseData> {
    return this.request<CaseData>(`/case_details/${caseId}`, {}, false);
  }

  // General AI chat (Node.js backend)
  async chat(message: string): Promise<{ response: string }> {
    return this.request<{ response: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    }, false);
  }

  // Case-specific chat (Node.js backend)
  async caseChatChat(caseId: number, question: string): Promise<{ response: string }> {
    return this.request<{ response: string }>(`/case_chat/${caseId}`, {
      method: 'POST',
      body: JSON.stringify({ question })
    }, false);
  }

  // Generate case summary (Node.js backend)
  async generateSummary(caseId: number): Promise<{ summary: string }> {
    return this.request<{ summary: string }>(`/generate_summary/${caseId}`, {}, false);
  }

  // Search cases (Node.js backend - full search)
  async searchCases(filters: SearchFilters = {}): Promise<{ cases: CaseData[] }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/search_cases?${queryString}` : '/search_cases';
    
    return this.request<{ cases: CaseData[] }>(endpoint, {}, false);
  }

  // Scrape case from URL (Node.js backend)
  async scrapeCase(url: string): Promise<{ database_id: number; success: boolean }> {
    return this.request<{ database_id: number; success: boolean }>('/scrape_case', {
      method: 'POST',
      body: JSON.stringify({ url })
    }, false);
  }

  // ===========================================
  // HYBRID METHODS (Use both backends)
  // ===========================================

  // Smart search that tries Python backend first, falls back to Node.js
  async smartSearch(query: string, filters: SearchFilters = {}, limit = 10) {
    try {
      // Try Python backend first for quick search
      const quickResult = await this.quickSearch(query, filters, limit);
      return {
        source: 'python',
        cases: quickResult.cases,
        total: quickResult.total_found,
        searchTime: quickResult.search_time
      };
    } catch (error) {
      console.warn('Python backend unavailable, falling back to Node.js:', error);
      
      // Fallback to Node.js backend
      try {
        const fullResult = await this.searchCases({ query, ...filters });
        return {
          source: 'nodejs',
          cases: fullResult.cases.slice(0, limit),
          total: fullResult.cases.length,
          searchTime: null
        };
      } catch (nodeError) {
        console.error('Both backends failed:', nodeError);
        throw new Error('Search service unavailable. Please try again later.');
      }
    }
  }

  // Health check for both backends
  async healthCheck(): Promise<{
    python: { status: string; available: boolean };
    nodejs: { status: string; available: boolean };
  }> {
    const results = {
      python: { status: 'unknown', available: false },
      nodejs: { status: 'unknown', available: false }
    };

    // Check Python backend
    try {
      await this.request('/mobile/features');
      results.python = { status: 'healthy', available: true };
    } catch (error) {
      results.python = { status: `error: ${error}`, available: false };
    }

    // Check Node.js backend
    try {
      await this.request('/health', {}, false);
      results.nodejs = { status: 'healthy', available: true };
    } catch (error) {
      results.nodejs = { status: `error: ${error}`, available: false };
    }

    return results;
  }
}

// Create singleton instance
export const hakiLensAPI = new EnhancedHakiLensAPI();

// Helper functions for React components
export const formatCaseTitle = (caseData: CaseData | QuickSearchResponse['cases'][0]): string => {
  return caseData.case_title || `${caseData.case_number} - ${caseData.court_name}`;
};

export const formatHearingDate = (dateString: string): string => {
  if (!dateString || dateString === 'Not specified') return 'Date not specified';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getCaseTypeColor = (caseType: string): string => {
  const colors: Record<string, string> = {
    'Civil': 'bg-blue-100 text-blue-800',
    'Criminal': 'bg-red-100 text-red-800',
    'Constitutional': 'bg-purple-100 text-purple-800',
    'Commercial': 'bg-green-100 text-green-800',
    'Employment': 'bg-yellow-100 text-yellow-800',
    'Family': 'bg-pink-100 text-pink-800',
    'Land': 'bg-amber-100 text-amber-800',
  };
  
  return colors[caseType] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Dismissed': 'bg-red-100 text-red-800',
    'Judgment Reserved': 'bg-purple-100 text-purple-800',
    'Judgment Delivered': 'bg-green-100 text-green-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Error handling
export class HakiLensError extends Error {
  constructor(message: string, public statusCode?: number, public backend?: 'python' | 'nodejs') {
    super(message);
    this.name = 'HakiLensError';
  }
}

export const handleApiError = (error: Error | unknown): string => {
  if (error instanceof HakiLensError) {
    return `${error.backend ? `[${error.backend}] ` : ''}${error.message}`;
  }
  
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// URL validation
export const isValidKenyaLawUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('kenyalaw.org');
  } catch {
    return false;
  }
};

// Validation helpers
export const validateSearchFilters = (filters: SearchFilters): string[] => {
  const errors: string[] = [];
  
  if (filters.year && !/^\d{4}$/.test(filters.year)) {
    errors.push('Year must be a 4-digit number');
  }
  
  if (filters.case_number && filters.case_number.length < 3) {
    errors.push('Case number must be at least 3 characters');
  }
  
  return errors;
};

export default hakiLensAPI;

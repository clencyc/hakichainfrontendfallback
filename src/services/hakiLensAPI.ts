// HakiLens API Service
// Frontend integration for HakiLens case search and AI analysis

const HAKILENS_API_BASE = process.env.VITE_HAKILENS_API_URL || 'http://localhost:8001';

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

export interface DocumentLink {
  url: string;
  text: string;
  type: string;
  context: string;
}

export interface ComprehensiveData {
  basic_info: {
    cases: CaseBasicInfo[];
  };
  content: {
    title: string;
    headings: {
      h1: string[];
      h2: string[];
    };
    paragraphs: string[];
    full_text: string;
  };
  links: DocumentLink[];
  images: Array<{
    url: string;
    alt: string;
    title: string;
    context: string;
  }>;
  tables: Array<{
    caption: string;
    headers: string[];
    rows: string[][];
  }>;
  documents: DocumentLink[];
  metadata: {
    title: string;
    description?: string;
    keywords?: string;
    author?: string;
    language: string;
    charset: string;
  };
  scraped_at: string;
  source_url: string;
}

export interface AIAnalysis {
  structured_case_info: CaseBasicInfo;
  content_analysis: {
    document_type: string;
    complexity_score: number;
    key_topics: string[];
    legal_areas: string[];
    citation_count: number;
  };
  quality_assessment: {
    completeness: 'high' | 'medium' | 'low';
    data_quality: 'high' | 'medium' | 'low';
    extraction_confidence: number;
  };
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
  comprehensive_data: ComprehensiveData;
  ai_analysis: AIAnalysis;
  ai_summary: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  user_message?: string;
  user_question?: string;
  ai_response: string;
  timestamp: string;
  case_id?: number;
}

export interface SearchFilters {
  query?: string;
  case_number?: string;
  court_name?: string;
  year?: string;
}

export interface ScrapeResult {
  database_id: number;
  comprehensive_data: ComprehensiveData;
  structured_analysis: AIAnalysis;
  success: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success?: boolean;
}

export interface ApiInfo {
  service: string;
  version: string;
  description: string;
  endpoints: Record<string, string>;
  documentation: string;
}

class HakiLensAPI {
  private baseUrl: string;

  constructor(baseUrl: string = HAKILENS_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // 1. Comprehensive Case Scraping
  async scrapeCase(url: string): Promise<ScrapeResult> {
    return this.request('/scrape_case', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // 2. AI Chat Interface
  async chat(message: string): Promise<{ response: string }> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // 3. Case-Specific Chat
  async caseChatChat(caseId: number, question: string): Promise<{ response: string }> {
    return this.request(`/case_chat/${caseId}`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // 4. Generate Case Summary
  async generateSummary(caseId: number): Promise<{ summary: string }> {
    return this.request(`/generate_summary/${caseId}`);
  }

  // 5. Search Cases
  async searchCases(filters: SearchFilters = {}): Promise<{ cases: CaseData[] }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/search_cases?${queryString}` : '/search_cases';
    
    return this.request(endpoint);
  }

  // 6. Get Case Details
  async getCaseDetails(caseId: number): Promise<CaseData> {
    return this.request(`/case_details/${caseId}`);
  }

  // 7. Get Case Chat History
  async getCaseChatHistory(caseId: number): Promise<{ history: ChatMessage[] }> {
    return this.request(`/case_chat_history/${caseId}`);
  }

  // 8. Get General Chat History
  async getChatHistory(): Promise<{ history: ChatMessage[] }> {
    return this.request('/chat_history');
  }

  // 9. Download Case Documents
  async getCaseDocuments(caseId: number): Promise<{ documents: DocumentLink[] }> {
    return this.request<{ documents: DocumentLink[] }>(`/download_case_pdf/${caseId}`);
  }

  // 10. Get Case Full Content
  async getCaseFullContent(caseId: number): Promise<{
    full_content: string;
    source_url: string;
    scraped_at: string;
  }> {
    return this.request(`/case_full_content/${caseId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    return this.request('/health');
  }

  // Get API information
  async getApiInfo(): Promise<ApiInfo> {
    return this.request<ApiInfo>('/');
  }
}

// Create singleton instance
export const hakiLensAPI = new HakiLensAPI();

// Helper functions for the React components
export const formatCaseTitle = (caseData: CaseData): string => {
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

export const extractKeywords = (content: string, limit: number = 10): string[] => {
  if (!content) return [];
  
  // Simple keyword extraction - replace with more sophisticated NLP if needed
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'their', 'said', 'each', 'which', 'them', 'than', 'many', 'some', 'what', 'upon', 'during', 'through'].includes(word));
  
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
};

export const highlightText = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

// Error handling helpers
export class HakiLensError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'HakiLensError';
  }
}

export const handleApiError = (error: Error | unknown): string => {
  if (error instanceof HakiLensError) {
    return error.message;
  }
  
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Validation helpers
export const isValidKenyaLawUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('kenyalaw.org');
  } catch {
    return false;
  }
};

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

// Storage helpers for offline functionality
const CACHE_PREFIX = 'hakilens_cache_';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const cacheResult = (key: string, data: unknown): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

export const getCachedResult = <T = unknown>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
    return null;
  }
};

export const clearCache = (): void => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

export default hakiLensAPI;

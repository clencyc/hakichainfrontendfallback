import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDSmcctwb094ifsM1Dgb8B01brcVaNtq2Y';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface LegalChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  caseReferences?: string[];
  legalCitations?: string[];
}

export interface CaseSearchResult {
  caseName: string;
  caseNumber: string;
  court: string;
  year: string;
  summary: string;
  relevance: number;
  url?: string;
}

// Enhanced legal assistant specifically for case research and legal analysis
export const generateLegalChatResponse = async (
  message: string,
  chatHistory: LegalChatMessage[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Build conversation context
  const context = chatHistory
    .slice(-8) // Keep last 8 messages for context
    .map(msg => `${msg.role === 'user' ? 'User' : 'HakiDraft'}: ${msg.content}`)
    .join('\n');

  const prompt = `
    You are HakiDraft, an advanced AI legal research assistant specialized in Kenyan law, legal case analysis, and legal document review. You are integrated into HakiLens, a powerful legal case search and analysis platform.

    YOUR SPECIALIZED CAPABILITIES:
    1. Legal Case Research & Analysis
    2. Kenyan Legal System Expertise
    3. Case Law Interpretation
    4. Legal Document Review & Analysis
    5. Court Procedure Guidance
    6. Legal Precedent Identification
    7. Statutory Law Interpretation

    LEGAL RESEARCH FOCUS:
    - Constitutional Law cases and interpretations
    - Commercial and Contract Law precedents
    - Criminal Law cases and sentencing guidelines
    - Family Law procedures and precedents
    - Land and Property Law disputes
    - Employment Law cases
    - Human Rights cases in Kenya
    - Court of Appeal and High Court decisions

    RESPONSE GUIDELINES:
    1. Provide detailed legal analysis when discussing cases
    2. Reference specific Kenyan legal provisions when applicable
    3. Suggest relevant case searches and legal precedents
    4. Explain legal concepts in both technical and plain language
    5. Recommend specific case citations when relevant
    6. Guide users on effective legal research strategies
    7. Always emphasize the importance of professional legal counsel
    8. Provide structured analysis: Facts → Law → Application → Conclusion

    CASE RESEARCH ASSISTANCE:
    - Help identify relevant keywords for case searches
    - Suggest search strategies for finding precedents
    - Explain how to analyze case relevance
    - Guide on proper legal citation formats
    - Recommend additional research directions

    Conversation History:
    ${context}

    Current Legal Query: ${message}

    Please provide a comprehensive legal research response as HakiDraft, focusing on practical legal guidance and case research strategies:
  `;

  const result = await model.generateContentStream(prompt);
  
  async function* streamResponse() {
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  return streamResponse();
};

// Generate intelligent legal research suggestions
export const generateLegalSuggestions = (query: string): string[] => {
  const legalSuggestions = [
    "Constitutional law cases in Kenya",
    "Commercial contract disputes precedents",
    "Criminal sentencing guidelines Kenya",
    "Family law custody precedents",
    "Land law succession cases",
    "Employment law wrongful termination",
    "Human rights constitutional cases",
    "Court of Appeal landmark decisions",
    "High Court commercial rulings",
    "Magistrate court criminal procedures",
    "Alternative dispute resolution cases",
    "Intellectual property law Kenya",
    "Banking and finance law cases",
    "Environmental law compliance",
    "Tax law interpretation cases"
  ];

  if (query.trim() === '') {
    return legalSuggestions.slice(0, 5);
  }

  // Smart filtering based on query content
  const queryLower = query.toLowerCase();
  const filtered = legalSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(queryLower) ||
    queryLower.split(' ').some(word => 
      word.length > 3 && suggestion.toLowerCase().includes(word)
    )
  );

  return filtered.length > 0 ? filtered.slice(0, 6) : legalSuggestions.slice(0, 5);
};

// Case analysis and summarization
export const analyzeLegalCase = async (caseText: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are HakiDraft, an expert legal case analyst. Please analyze the following legal case and provide a comprehensive summary.

    ANALYSIS STRUCTURE:
    1. **Case Overview**
       - Case name and citation
       - Court and judges
       - Date of decision

    2. **Key Facts**
       - Summarize the material facts
       - Identify the parties involved

    3. **Legal Issues**
       - Main legal questions raised
       - Areas of law involved

    4. **Court's Reasoning**
       - Key legal principles applied
       - Judicial reasoning and analysis

    5. **Decision/Holding**
       - Court's final decision
       - Orders made

    6. **Legal Significance**
       - Precedential value
       - Impact on Kenyan law
       - Practical implications

    7. **Key Takeaways**
       - Important legal principles
       - Practical guidance for lawyers

    Case Text to Analyze:
    ${caseText}

    Please provide a detailed legal analysis following the above structure:
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate legal research keywords from natural language query
export const generateSearchKeywords = async (naturalQuery: string): Promise<string[]> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a legal research expert. Convert this natural language query into effective legal search keywords and phrases.

    Query: "${naturalQuery}"

    Provide 8-10 specific legal search terms that would be most effective for finding relevant cases, including:
    - Legal concepts and terminology
    - Relevant areas of law
    - Procedural terms
    - Alternative phrasings
    - Broader and narrower terms

    Return only the keywords/phrases, separated by commas:
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  return response.split(',').map(keyword => keyword.trim()).filter(k => k.length > 0);
};

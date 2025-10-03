import { GoogleGenerativeAI } from '@google/generative-ai';

// Type definitions
interface CaseDetails {
  caseType?: string;
  clientName?: string;
  description?: string;
  jurisdiction?: string;
}

interface ReviewResponse {
  suggestions?: Array<{ 
    kind: 'insertion' | 'deletion'; 
    text?: string; 
    at?: number 
  }>;
  summary?: string;
}

interface ResearchResponse {
  answer: string;
  sources?: any[];
}

// API Key configuration - ONLY use environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not configured. Please add it to your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Helper function to get available model
const getModel = () => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const models = [
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-pro'
  ];
  
  for (const modelName of models) {
    try {
      return genAI.getGenerativeModel({ model: modelName });
    } catch (error) {
      console.warn(`Model ${modelName} not available, trying next...`);
    }
  }
  
  throw new Error('No Gemini model available. Please check your API configuration.');
};

// Helper function to clean JSON response
const cleanJsonResponse = (response: string): string => {
  // Remove markdown code blocks if present
  return response
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
};

export const generateDocumentTemplate = async (
  documentType: string,
  caseDetails: CaseDetails,
  additionalPrompts: string[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  console.log('generateDocumentTemplate called with:', { documentType, caseDetails, additionalPrompts });
  
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  const prompt = `
You are a legal document assistant specialized in Kenyan law. Generate a professional ${documentType} template based on the following details:

Case Details:
- Case Type: ${caseDetails.caseType || 'Not specified'}
- Client Name: ${caseDetails.clientName || '[CLIENT_NAME]'}
- Case Description: ${caseDetails.description || 'Not specified'}
- Jurisdiction: ${caseDetails.jurisdiction || 'Kenya'}
- Date: ${new Date().toLocaleDateString()}

Additional Requirements:
${additionalPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

Please generate a complete, professional ${documentType} template that:
1. Follows Kenyan legal formatting standards
2. Includes all necessary legal clauses
3. Has placeholder fields marked with [FIELD_NAME] for easy customization
4. Is ready for use in legal proceedings
5. Includes proper legal language and terminology

Format the output as a professional legal document with proper headings, numbering, and structure.
  `;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Generating content...`);
      const result = await model.generateContentStream(prompt);
      console.log('Content stream created successfully');
      
      async function* streamResponse() {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log('Streaming chunk:', chunkText.substring(0, 50) + '...');
            yield chunkText;
          }
        } catch (streamError) {
          console.error('Error in stream:', streamError);
          throw streamError;
        }
      }

      return streamResponse();
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      // Check if it's a 503 overload error or rate limit
      const isOverloaded = error.message && (
        error.message.includes('503') || 
        error.message.includes('overloaded') ||
        error.message.includes('rate limit')
      );
      
      if (isOverloaded && attempt < maxRetries) {
        const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        console.log(`Service busy, waiting ${waitTime/1000} seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      } else if (attempt === maxRetries) {
        console.log('All retries failed, providing fallback content');
        return generateFallbackContent(documentType, caseDetails, additionalPrompts);
      }
    }
  }

  // If we get here, throw the last error or provide fallback
  if (lastError) {
    console.error('All attempts failed, using fallback');
    return generateFallbackContent(documentType, caseDetails, additionalPrompts);
  }
  
  throw new Error('Failed to generate document template');
};

// Fallback content generator when API is unavailable
function generateFallbackContent(
  documentType: string,
  caseDetails: CaseDetails,
  additionalPrompts: string[]
): AsyncGenerator<string, void, unknown> {
  const fallbackContent = `
${documentType.toUpperCase()}

This is a template for a ${documentType} under Kenyan law.

PARTIES:
This agreement is made between:
- Party 1: ${caseDetails.clientName || '[CLIENT_NAME]'}
- Party 2: [COUNTERPARTY_NAME]

CASE DETAILS:
- Case Type: ${caseDetails.caseType || 'Not specified'}
- Description: ${caseDetails.description || 'Not specified'}
- Jurisdiction: ${caseDetails.jurisdiction || 'Kenya'}
- Date: ${new Date().toLocaleDateString()}

ADDITIONAL REQUIREMENTS:
${additionalPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n') || 'None specified'}

1. PURPOSE AND SCOPE
This agreement sets forth the terms and conditions governing the relationship between the parties.

2. TERMS AND CONDITIONS
[Insert specific terms and conditions here]

3. REPRESENTATIONS AND WARRANTIES
Each party represents and warrants that:
a) They have the legal capacity to enter into this agreement
b) All information provided is accurate and complete
c) They will comply with all applicable laws and regulations

4. OBLIGATIONS
[Define specific obligations of each party]

5. PAYMENT TERMS
[Specify payment terms, amounts, and schedules]

6. DURATION AND TERMINATION
This agreement shall commence on [START_DATE] and continue until [END_DATE] or until terminated as provided herein.

7. CONFIDENTIALITY
All information exchanged under this agreement shall be treated as confidential.

8. GOVERNING LAW
This agreement shall be governed by and construed in accordance with the laws of Kenya.

9. DISPUTE RESOLUTION
Any disputes arising from this agreement shall be resolved through:
a) First, good faith negotiations between the parties
b) If unresolved, mediation in accordance with Kenyan law
c) Finally, arbitration under the Arbitration Act of Kenya

10. AMENDMENTS
This agreement may only be amended by written consent of all parties.

11. ENTIRE AGREEMENT
This agreement constitutes the entire agreement between the parties.

SIGNATURES:

_____________________
${caseDetails.clientName || '[PARTY_1_NAME]'}
Date: [DATE]

_____________________
[PARTY_2_NAME]
Date: [DATE]

NOTE: This is a fallback template generated when the AI service is temporarily unavailable. 
Please review and customize according to your specific legal requirements and consult with 
a qualified legal professional before use.
  `;

  async function* fallbackGenerator() {
    const chunks = fallbackContent.split('\n');
    for (const chunk of chunks) {
      yield chunk + '\n';
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  return fallbackGenerator();
}

// Haki Draft - Generate a new draft from metadata
export const generateDraft = async (
  metadata: Record<string, string>
): Promise<any> => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  const prompt = `
You are Haki Draft, an AI legal document generator specialized in Kenyan law. Generate a complete legal document based on the following metadata:

Document Metadata:
${Object.entries(metadata).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please generate a complete, professional legal document that:
1. Follows Kenyan legal formatting standards
2. Includes all necessary legal clauses and sections
3. Uses the provided metadata to fill in relevant fields
4. Is ready for legal review and use
5. Includes proper legal language and terminology
6. Has a clear structure with headings, numbering, and proper formatting

Return the document as a structured JSON object with the following format:
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Document Title" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Document content..." }]
    }
  ]
}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const cleanedResponse = cleanJsonResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.warn('Failed to parse JSON response, creating fallback structure');
      // If JSON parsing fails, create a simple document structure
      return {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Legal Document" }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: response }]
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error generating draft:', error);
    throw new Error('Failed to generate document draft. Please try again later.');
  }
};

// Haki Reviews - Review document and provide suggestions
export const reviewDocument = async (
  content: any,
  metadata: Record<string, string>
): Promise<ReviewResponse> => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  // Convert content to readable text for analysis
  const contentText = JSON.stringify(content, null, 2);

  const prompt = `
You are Haki Reviews, an AI legal document reviewer specialized in Kenyan law. Review the following legal document and provide suggestions for improvement:

Document Metadata:
${Object.entries(metadata).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Document Content:
${contentText}

Please analyze this document and provide:
1. Specific suggestions for improvements (insertions or deletions)
2. A summary of your review findings
3. Recommendations for legal compliance and best practices

Return your response as a JSON object with the following format:
{
  "suggestions": [
    {
      "kind": "insertion",
      "text": "suggested text to insert",
      "at": 0
    },
    {
      "kind": "deletion",
      "text": "text to delete"
    }
  ],
  "summary": "Brief summary of review findings and recommendations"
}

Focus on:
- Legal accuracy and compliance with Kenyan law
- Clarity and completeness of legal clauses
- Proper legal terminology and formatting
- Missing essential elements
- Potential legal risks or ambiguities
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const cleanedResponse = cleanJsonResponse(response);
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.warn('Failed to parse review response, providing summary only');
      return {
        suggestions: [],
        summary: response || "Document review completed. Please review manually for legal accuracy."
      };
    }
  } catch (error) {
    console.error('Error reviewing document:', error);
    return {
      suggestions: [],
      summary: "Error occurred during document review. Please try again later."
    };
  }
};

// Haki Lens - Research helper
export const researchQuery = async (
  query: string,
  content: any
): Promise<ResearchResponse> => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  const contentText = JSON.stringify(content, null, 2);

  const prompt = `
You are Haki Lens, an AI legal research assistant specialized in Kenyan law. Answer the following research question based on the provided legal document context:

Research Question: ${query}

Document Context:
${contentText}

Please provide:
1. A comprehensive answer to the research question
2. Relevant legal references and citations where applicable
3. Practical implications for the current document
4. Recommendations based on Kenyan legal framework

Focus on:
- Kenyan legal precedents and statutes
- Relevant case law
- Legal best practices
- Practical implications for the document
- Risk assessment and recommendations

Format your response as a clear, structured answer that can be directly used in legal document preparation.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return {
      answer: response,
      sources: [] // Could be enhanced to include actual legal citations
    };
  } catch (error) {
    console.error('Error researching query:', error);
    return {
      answer: "Unable to complete research at this time. Please try again later or consult with a legal professional.",
      sources: []
    };
  }
};
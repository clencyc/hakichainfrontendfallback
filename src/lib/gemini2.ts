import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDSmcctwb094ifsM1Dgb8B01brcVaNtq2Y';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateDocumentTemplate = async (
  documentType: string,
  caseDetails: any,
  additionalPrompts: string[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  console.log('generateDocumentTemplate called with:', { documentType, caseDetails, additionalPrompts });
  console.log('Gemini API Key available:', !!GEMINI_API_KEY);
  console.log('OpenAI API Key available:', !!OPENAI_API_KEY);
  
  // Update model name to the current version
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a legal document assistant specialized in Kenyan law. Generate a professional ${documentType} template based on the following details:

    Case Details:
    - Case Type: ${caseDetails.caseType}
    - Client Name: ${caseDetails.clientName}
    - Case Description: ${caseDetails.description}
    - Jurisdiction: ${caseDetails.jurisdiction}
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

  // Retry logic with fallback
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Generating content with prompt:`, prompt);
      const result = await model.generateContentStream(prompt);
      console.log('Content stream created successfully');
      
      async function* streamResponse() {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log('Streaming chunk:', chunkText);
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
      
             // Check if it's a 503 overload error
       if (error.message && error.message.includes('503') && error.message.includes('overloaded')) {
         if (attempt < maxRetries) {
           console.log(`Model overloaded, waiting ${attempt * 2} seconds before retry...`);
           await new Promise(resolve => setTimeout(resolve, attempt * 2000)); // Exponential backoff
           continue;
         } else {
           console.log('All retries failed, trying OpenAI fallback...');
           // Try OpenAI as fallback
           try {
             return await generateWithOpenAI(prompt);
           } catch (openaiError) {
             console.log('OpenAI also failed, providing fallback content');
             return generateFallbackContent(documentType, caseDetails, additionalPrompts);
           }
         }
       } else {
         // For other errors, try OpenAI as fallback
         if (OPENAI_API_KEY) {
           console.log('Gemini error, trying OpenAI fallback...');
           try {
             return await generateWithOpenAI(prompt);
           } catch (openaiError) {
             console.log('OpenAI fallback failed, providing fallback content');
             return generateFallbackContent(documentType, caseDetails, additionalPrompts);
           }
         } else {
           // No OpenAI key, provide fallback content
           console.log('No OpenAI key available, providing fallback content');
           return generateFallbackContent(documentType, caseDetails, additionalPrompts);
         }
       }
    }
  }

  throw lastError;
};

// OpenAI fallback generator
async function generateWithOpenAI(prompt: string): Promise<AsyncGenerator<string, void, unknown>> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not available');
  }

  console.log('Using OpenAI as fallback...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document assistant specialized in Kenyan law. Generate professional legal documents with proper formatting and legal compliance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    async function* streamResponse() {
      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  console.log('OpenAI streaming chunk:', content);
                  yield content;
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } finally {
        reader!.releaseLock();
      }
    }

    return streamResponse();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Fallback content generator when API is overloaded
function generateFallbackContent(
  documentType: string,
  caseDetails: any,
  additionalPrompts: string[]
): AsyncGenerator<string, void, unknown> {
  const fallbackContent = `
${documentType.toUpperCase()}

This is a template for a ${documentType} under Kenyan law.

PARTIES:
This agreement is made between:
- [PARTY_1_NAME]: ${caseDetails.clientName || '[CLIENT_NAME]'}
- [PARTY_2_NAME]: [COUNTERPARTY_NAME]

CASE DETAILS:
- Case Type: ${caseDetails.caseType || 'Not specified'}
- Description: ${caseDetails.description || 'Not specified'}
- Jurisdiction: ${caseDetails.jurisdiction || 'Kenya'}
- Date: ${new Date().toLocaleDateString()}

ADDITIONAL REQUIREMENTS:
${additionalPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

1. PURPOSE AND SCOPE
This agreement sets forth the terms and conditions governing the relationship between the parties.

2. TERMS AND CONDITIONS
[Insert specific terms and conditions here]

3. GOVERNING LAW
This agreement shall be governed by and construed in accordance with the laws of Kenya.

4. DISPUTE RESOLUTION
Any disputes arising from this agreement shall be resolved through mediation and arbitration in accordance with Kenyan law.

5. SIGNATURES
_____________________
[PARTY_1_NAME]
Date: [DATE]

_____________________
[PARTY_2_NAME]
Date: [DATE]

NOTE: This is a fallback template generated when the AI service is temporarily unavailable. Please review and customize according to your specific legal requirements.
  `;

  async function* fallbackGenerator() {
    // Simulate streaming by yielding the content in chunks
    const chunks = fallbackContent.split('\n');
    for (const chunk of chunks) {
      yield chunk + '\n';
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to simulate streaming
    }
  }

  return fallbackGenerator();
}

// Haki Draft - Generate a new draft from metadata
export const generateDraft = async (metadata: Record<string, string>): Promise<any> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    
    // Try to parse as JSON, fallback to plain text if parsing fails
    try {
      return JSON.parse(response);
    } catch {
      // If JSON parsing fails, create a simple document structure
      return {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: response }]
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error generating draft:', error);
    throw new Error('Failed to generate document draft');
  }
};

// Haki Reviews - Review document and provide suggestions
export const reviewDocument = async (
  content: any,
  metadata: Record<string, string>
): Promise<{
  suggestions?: Array<{ kind: 'insertion' | 'deletion'; text?: string; at?: number }>;
  summary?: string;
}> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      return JSON.parse(response);
    } catch {
      // Fallback response if JSON parsing fails
      return {
        suggestions: [],
        summary: "Document review completed. Please review manually for legal accuracy."
      };
    }
  } catch (error) {
    console.error('Error reviewing document:', error);
    return {
      suggestions: [],
      summary: "Error occurred during document review. Please try again."
    };
  }
};

// Haki Lens - Research helper
export const researchQuery = async (
  query: string,
  content: any
): Promise<{ answer: string; sources?: any[] }> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      answer: "Unable to complete research at this time. Please try again or consult with a legal professional.",
      sources: []
    };
  }
};

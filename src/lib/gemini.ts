import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDSmcctwb094ifsM1Dgb8B01brcVaNtq2Y';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateDocumentTemplate = async (
  documentType: string,
  caseDetails: any,
  additionalPrompts: string[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

  const result = await model.generateContentStream(prompt);
  
  async function* streamResponse() {
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  }

  return streamResponse();
};

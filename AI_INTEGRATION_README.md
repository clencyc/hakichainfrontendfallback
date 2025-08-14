# HakiChain AI Integration - Legal Document Editor

## Overview

This integration adds advanced AI-powered document editing capabilities to the HakiChain platform, featuring three core AI tools:

- **Haki Draft**: AI-powered document generation
- **Haki Reviews**: AI-powered document review and suggestions
- **Haki Lens**: AI-powered legal research assistant

## Features

### 🎯 Haki Draft (Document Generation)
- Generate complete legal documents from metadata
- Specialized for Kenyan legal context
- Supports multiple document types (NDAs, contracts, affidavits, etc.)
- Variable substitution for dynamic content
- Professional formatting and legal compliance

### 🔍 Haki Reviews (Document Review)
- AI-powered analysis of legal documents
- Suggests improvements and identifies potential issues
- Ensures legal compliance with Kenyan law
- Provides detailed review summaries
- Supports insertion and deletion suggestions

### 🔬 Haki Lens (Legal Research)
- Ask legal research questions in natural language
- Get answers based on Kenyan legal precedents
- Provides citations and references
- Context-aware responses based on current document
- Practical implications and recommendations

## Technical Architecture

### Core Components

1. **LegalDocEditor** (`src/components/common/LegalDocEditor.tsx`)
   - TipTap-based rich text editor
   - Custom extensions for suggestion tracking
   - Real-time collaboration support
   - Export capabilities

2. **AI Functions** (`src/lib/gemini.ts`)
   - `generateDraft()`: Document generation
   - `reviewDocument()`: Document review
   - `researchQuery()`: Legal research

3. **Enhanced LawyerAI** (`src/pages/lawyer/LawyerAI.tsx`)
   - Dual-mode interface (Advanced AI Editor / Simple Generator)
   - Integrated with existing HakiChain features
   - Seamless workflow integration

### Dependencies

```json
{
  "@tiptap/react": "^2.0.0",
  "@tiptap/starter-kit": "^2.0.0",
  "@tiptap/extension-placeholder": "^2.0.0",
  "@tiptap/extension-link": "^2.0.0",
  "@tiptap/extension-history": "^2.0.0",
  "@tiptap/extension-table": "^2.0.0",
  "@tiptap/extension-table-row": "^2.0.0",
  "@tiptap/extension-table-cell": "^2.0.0",
  "@tiptap/extension-table-header": "^2.0.0",
  "@tiptap/extension-mention": "^2.0.0"
}
```

## Usage Guide

### Basic Editor Modes

1. **Edit Mode**: Direct document editing with rich text formatting
2. **Suggest Mode**: Create insertion and deletion suggestions for review
3. **View Mode**: Read-only document viewing

### AI Tool Usage

#### Haki Draft
1. Fill in document metadata (type, client, case details)
2. Click "Haki Draft" button in the toolbar
3. AI generates a complete document based on metadata
4. Review and edit as needed

#### Haki Reviews
1. Have a document open in the editor
2. Click "Haki Reviews" button
3. AI analyzes the document and provides suggestions
4. Review suggestions in the suggestions panel
5. Accept or reject individual suggestions

#### Haki Lens
1. Type a legal research question in the search box
2. Click "Ask" button
3. AI provides research answer with context
4. Answer is inserted into the document as a research note

### Clause Library

- Predefined legal clauses available for insertion
- Variable substitution for dynamic content
- Organized by document type and legal area
- Easy one-click insertion

## Integration with HakiChain

### Existing Features Enhanced
- **Document Management**: Seamless integration with HakiDocs
- **User Authentication**: Respects existing user roles and permissions
- **Audit Trail**: Complete tracking of all AI interactions
- **Export Options**: Multiple format support (HTML, DOCX, PDF)

### New Features Added
- **AI-Powered Editing**: Advanced document creation and review
- **Collaborative Suggestions**: Team-based document review workflow
- **Legal Research**: Integrated research capabilities
- **Smart Clauses**: Dynamic clause insertion with variable substitution

## Configuration

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### AI Model Configuration
The integration uses Google's Gemini 1.5 Flash model for optimal performance and cost-effectiveness.

### Customization Options

#### Adding New Document Types
1. Update `documentTypes` array in `LawyerAI.tsx`
2. Add corresponding clauses to `legalClauses` array
3. Update AI prompts in `gemini.ts` if needed

#### Custom Clauses
```typescript
const customClause: Clause = {
  id: "custom-clause",
  title: "Custom Clause Title",
  body: "Clause text with {{variables}} for substitution",
  variables: { 
    variableName: "default value" 
  }
};
```

#### AI Prompt Customization
Modify the prompts in `src/lib/gemini.ts` to:
- Change legal jurisdiction focus
- Add specific legal requirements
- Customize output format
- Adjust AI behavior

## API Reference

### LegalDocEditor Props

```typescript
interface LegalDocEditorProps {
  docId: string;
  currentUser: { id: string; name: string };
  initialContent: JSONContent;
  mode?: "edit" | "suggest" | "view";
  clauses?: Clause[];
  metadata?: Record<string, string>;
  readOnly?: boolean;
  onChange?: (updated: JSONContent) => void;
  onAudit?: (event: AuditEvent) => void;
  onSuggestionsChange?: (items: SuggestionItem[]) => void;
  ai?: AIHandlers;
}
```

### AI Functions

```typescript
// Generate document draft
const content = await generateDraft(metadata);

// Review document
const review = await reviewDocument(content, metadata);

// Research query
const research = await researchQuery(query, content);
```

## Demo and Testing

### Demo Page
Access the demo at `/lawyer/ai-editor-demo` to see the full integration in action.

### Testing Features
1. **Document Generation**: Test with different document types and metadata
2. **AI Review**: Create documents and test review functionality
3. **Research**: Ask various legal research questions
4. **Collaboration**: Test suggestion and review workflow

## Performance Considerations

### Optimization Tips
- Use appropriate document sizes for AI processing
- Implement caching for frequently used clauses
- Consider rate limiting for AI API calls
- Monitor API usage and costs

### Error Handling
- Graceful fallbacks for AI service failures
- User-friendly error messages
- Retry mechanisms for transient failures
- Offline mode support for basic editing

## Security and Compliance

### Data Privacy
- No sensitive data sent to AI services without consent
- Local processing where possible
- Secure API key management
- Audit trail for all AI interactions

### Legal Compliance
- Kenyan legal context awareness
- Professional responsibility disclaimers
- Clear AI-generated content labeling
- Human review requirements for final documents

## Future Enhancements

### Planned Features
- **Multi-language Support**: Expand beyond Kenyan law
- **Advanced Collaboration**: Real-time multi-user editing
- **Template Library**: Pre-built document templates
- **Integration APIs**: Connect with external legal databases
- **Mobile Support**: Responsive design for mobile devices

### AI Improvements
- **Custom Training**: Domain-specific model fine-tuning
- **Better Context**: Enhanced document understanding
- **Citation Accuracy**: Improved legal reference handling
- **Multi-modal**: Support for images and diagrams

## Support and Maintenance

### Troubleshooting
1. **AI Not Responding**: Check API key and network connectivity
2. **Editor Issues**: Verify TipTap dependencies are installed
3. **Performance Problems**: Monitor API usage and implement caching
4. **Integration Errors**: Check component prop types and callbacks

### Maintenance
- Regular dependency updates
- API key rotation
- Performance monitoring
- User feedback collection

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run development server: `npm run dev`
4. Access the demo page to test features

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Comprehensive testing

---

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-history @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-mention
   ```

2. **Set Environment Variable**
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Access the Editor**
   - Navigate to `/lawyer/ai` for the main interface
   - Navigate to `/lawyer/ai-editor-demo` for the demo

4. **Start Using AI Features**
   - Fill in document metadata
   - Use Haki Draft to generate documents
   - Use Haki Reviews for AI-powered review
   - Use Haki Lens for legal research

The AI integration is now ready to enhance your legal document workflow with powerful AI capabilities!

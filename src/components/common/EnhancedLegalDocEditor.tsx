import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Edit3, 
  Eye, 
  Download, 
  Upload, 
  FolderOpen, 
  Save,
  FileDown,
  FileUp,
  Search,
  X,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDocumentManagement } from '../../hooks/useDocumentManagement';
import LegalDocEditor, { Clause, AuditEvent, SuggestionItem } from './LegalDocEditor';

export interface EnhancedLegalDocEditorProps {
  docId: string;
  currentUser: { id: string; name: string };
  initialContent: { type: string; content: Array<{ type: string; content: Array<{ type: string; text: string }> }> };
  mode?: "edit" | "preview" | "split";
  clauses?: Clause[];
  metadata?: any;
  onChange?: (content: { type: string; content: Array<{ type: string; content: Array<{ type: string; text: string }> }> }) => void;
  onAudit?: (event: AuditEvent) => void;
  onSuggestionsChange?: (items: SuggestionItem[]) => void;
}

export default function EnhancedLegalDocEditor({
  docId,
  currentUser,
  initialContent,
  mode = "edit",
  clauses = [],
  metadata = {},
  onChange,
  onAudit,
  onSuggestionsChange
}: EnhancedLegalDocEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(mode);
  const [currentDocument, setCurrentDocument] = useState(initialContent);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHakiDocsModal, setShowHakiDocsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'md'>('pdf');
  
  const { documents, isLoading: docsLoading, loadDocuments, uploadDocuments, downloadDocument } = useDocumentManagement();

  // Convert document content to markdown
  const convertToMarkdown = (doc: any): string => {
    if (!doc.content) return '';
    
    return doc.content.map((block: any) => {
      if (block.type === 'paragraph') {
        const text = block.content?.map((item: any) => item.text).join('') || '';
        return text + '\n\n';
      }
      if (block.type === 'heading') {
        const level = block.attrs?.level || 1;
        const text = block.content?.map((item: any) => item.text).join('') || '';
        return '#'.repeat(level) + ' ' + text + '\n\n';
      }
      if (block.type === 'bulletList') {
        return block.content?.map((item: any) => {
          if (item.type === 'listItem') {
            const text = item.content?.map((content: any) => content.text).join('') || '';
            return `- ${text}\n`;
          }
          return '';
        }).join('') + '\n';
      }
      if (block.type === 'orderedList') {
        return block.content?.map((item: any, index: number) => {
          if (item.type === 'listItem') {
            const text = item.content?.map((content: any) => content.text).join('') || '';
            return `${index + 1}. ${text}\n`;
          }
          return '';
        }).join('') + '\n';
      }
      return '';
    }).join('');
  };

  // Convert markdown to document format
  const convertFromMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    const content: any[] = [];
    let currentParagraph = '';
    let currentList: string[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#')) {
        // Flush any pending content
        if (currentParagraph) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
        if (currentList.length > 0) {
          content.push({
            type: 'bulletList',
            content: currentList.map(item => ({
              type: 'listItem',
              content: [{ type: 'text', text: item }]
            }))
          });
          currentList = [];
          inList = false;
        }

        // Add heading
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine.replace(/^#+\s*/, '');
        content.push({
          type: 'heading',
          attrs: { level },
          content: [{ type: 'text', text }]
        });
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        // Flush paragraph if in list
        if (currentParagraph && !inList) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
        
        inList = true;
        currentList.push(trimmedLine.substring(2));
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        // Flush paragraph if in list
        if (currentParagraph && !inList) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
        
        inList = true;
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''));
      } else if (trimmedLine === '') {
        // Empty line - flush content
        if (currentParagraph) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
        if (currentList.length > 0) {
          content.push({
            type: 'bulletList',
            content: currentList.map(item => ({
              type: 'listItem',
              content: [{ type: 'text', text: item }]
            }))
          });
          currentList = [];
          inList = false;
        }
      } else {
        // Regular text
        if (inList) {
          // Flush list and start paragraph
          content.push({
            type: 'bulletList',
            content: currentList.map(item => ({
              type: 'listItem',
              content: [{ type: 'text', text: item }]
            }))
          });
          currentList = [];
          inList = false;
        }
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
      }
    });

    // Flush remaining content
    if (currentParagraph) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: currentParagraph.trim() }]
      });
    }
    if (currentList.length > 0) {
      content.push({
        type: 'bulletList',
        content: currentList.map(item => ({
          type: 'listItem',
          content: [{ type: 'text', text: item }]
        }))
      });
    }

    return {
      type: 'doc',
      content: content.length > 0 ? content : [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
    };
  };

  // Update markdown when document changes
  useEffect(() => {
    const markdown = convertToMarkdown(currentDocument);
    setMarkdownContent(markdown);
  }, [currentDocument]);

  // Handle document changes
  const handleDocumentChange = (updatedContent: any) => {
    setCurrentDocument(updatedContent);
    onChange?.(updatedContent);
  };

  // Load documents from HakiDocs
  useEffect(() => {
    loadDocuments();
  }, []);

  // HakiDocs Integration Functions
  const loadFromHakiDocs = async (document: any) => {
    try {
      setIsLoading(true);
      // Simulate loading document content
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll create a sample document structure
      // In a real implementation, you'd fetch the actual document content
      const sampleContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: document.name }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'This is a sample document loaded from HakiDocs.' }]
          }
        ]
      };
      
      setCurrentDocument(sampleContent);
      setShowHakiDocsModal(false);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHakiDocs = async () => {
    try {
      setIsLoading(true);
      
      // Convert document to markdown
      const markdown = convertToMarkdown(currentDocument);
      
      // Create a blob with the markdown content
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const file = new File([blob], `${metadata.documentType || 'document'}_${Date.now()}.md`, { type: 'text/markdown' });
      
      // Upload to HakiDocs
      await uploadDocuments([file] as any);
      
      alert('Document saved to HakiDocs successfully!');
    } catch (error) {
      console.error('Error saving to HakiDocs:', error);
      alert('Failed to save document to HakiDocs');
    } finally {
      setIsLoading(false);
    }
  };

  const exportDocument = async (format: 'pdf' | 'docx' | 'md') => {
    try {
      setIsLoading(true);
      
      const markdown = convertToMarkdown(currentDocument);
      
      if (format === 'md') {
        // Download as markdown
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${metadata.documentType || 'document'}_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // For PDF and DOCX, you'd typically use a library like jsPDF or docx
        // For now, we'll simulate the export
        alert(`${format.toUpperCase()} export functionality would be implemented here`);
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Failed to export document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Legal Document Editor</h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'edit' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'preview' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'split' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                Split
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHakiDocsModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              disabled={isLoading}
            >
              <FolderOpen className="w-4 h-4" />
              Load from HakiDocs
            </button>
            
            <button
              onClick={saveToHakiDocs}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save to HakiDocs
            </button>

            <div className="relative">
              <button
                onClick={() => exportDocument(exportFormat)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Editor Panel */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
            <LegalDocEditor
              docId={docId}
              currentUser={currentUser}
              initialContent={currentDocument}
              mode="edit"
              clauses={clauses}
              metadata={metadata}
              onChange={handleDocumentChange}
              onAudit={onAudit}
              onSuggestionsChange={onSuggestionsChange}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
            <div className="prose prose-lg max-w-none">
              <div 
                className="markdown-preview"
                dangerouslySetInnerHTML={{ 
                  __html: markdownContent
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/__(.*?)__/g, '<em>$1</em>')
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/\*\s(.*)/g, '<li>$1</li>')
                    .replace(/^\d+\.\s(.*)/g, '<li>$1</li>')
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* HakiDocs Modal */}
      {showHakiDocsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Load Document from HakiDocs</h3>
              <button
                onClick={() => setShowHakiDocsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {docsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="ml-2 text-gray-600">Loading documents...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No documents found in HakiDocs</p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadFromHakiDocs(doc);
                        }}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Load
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

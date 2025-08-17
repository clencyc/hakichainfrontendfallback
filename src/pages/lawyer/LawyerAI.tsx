import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Mail,
  Copy,
  Wand2,
  Loader2,
  CheckCircle,
  Sparkles,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FolderOpen,
  Edit3,
  Eye,
  Save
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { generateDocumentTemplate } from '../../lib/gemini';
import { 
  documentCategories,
  getDocumentTypesByCategory, 
  getDocumentTypeById, 
  getCategoryById 
} from '../../utils/documentTypes';
import { useDocumentManagement } from '../../hooks/useDocumentManagement';
import LegalDocEditor, { Clause, AuditEvent, SuggestionItem } from '../../components/common/LegalDocEditor';
import { marked } from 'marked';

export const LawyerAI = () => {
  const [documentCategory, setDocumentCategory] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [caseDetails, setCaseDetails] = useState({
    caseType: '',
    clientName: '',
    description: '',
    jurisdiction: 'Kenya',
    jurisdictionList: [] as string[]
  });
  const [additionalPrompts, setAdditionalPrompts] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [currentDocument, setCurrentDocument] = useState<{ type: string; content: Array<{ type: string; content: Array<{ type: string; text: string }> }> }>({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "Start drafting your legal document..." }] }]
  });
  const [showHakiDocsModal, setShowHakiDocsModal] = useState(false);
  // Removed unused selectedDocument state

  // Document management hook
  const { uploadDocuments } = useDocumentManagement();
  const outputRef = useRef<HTMLDivElement>(null);

  // Fetch document types from database when component mounts
  useEffect(() => {
    // Using static document types - no need to fetch from database
    console.log('Document types loaded:', {
      categories: documentCategories.length,
      types: documentCategories.reduce((total, cat) => total + getDocumentTypesByCategory(cat.id).length, 0)
    });
  }, []);

  // Filter document types based on selected category
  const filteredDocumentTypes = documentCategory
    ? getDocumentTypesByCategory(documentCategory)
    : [];

  // Get available categories - using static types
  const availableCategories = documentCategories;
  
  // Document types for simple generator
  const documentTypes = [
    'Non-Disclosure Agreement',
    'Employment Contract',
    'Service Agreement',
    'Lease Agreement',
    'Purchase Agreement',
    'Partnership Agreement',
    'Consulting Agreement',
    'License Agreement'
  ];

  // Predefined legal clauses for different document types
  const legalClauses: Clause[] = [
    {
      id: "nda-conf",
      title: "Confidentiality Clause",
      body: "The Parties agree to keep {{InformationType}} confidential until {{ExpiryDate}}.",
      variables: { InformationType: "Confidential Information", ExpiryDate: "2026-12-31" },
    },
    {
      id: "nda-def",
      title: "Definition of Confidential Information",
      body: "For purposes of this Agreement, 'Confidential Information' means {{InformationDefinition}}.",
      variables: { InformationDefinition: "any information disclosed by one party to the other" },
    },
    {
      id: "nda-oblig",
      title: "Obligations",
      body: "The Receiving Party shall: (a) use the Confidential Information solely for {{Purpose}}; (b) maintain the confidentiality of the Confidential Information; and (c) not disclose the Confidential Information to any third party without prior written consent.",
      variables: { Purpose: "the purpose of this Agreement" },
    },
    {
      id: "nda-term",
      title: "Term and Termination",
      body: "This Agreement shall remain in effect for {{Duration}} and shall survive termination of any underlying business relationship between the Parties.",
      variables: { Duration: "a period of five (5) years" },
    },
    {
      id: "nda-remedy",
      title: "Remedies",
      body: "The Parties acknowledge that monetary damages may not be a sufficient remedy for unauthorized disclosure of Confidential Information and that the Disclosing Party shall be entitled, without waiving any other rights or remedies, to seek injunctive or equitable relief.",
    },
    {
      id: "contract-gov",
      title: "Governing Law",
      body: "This Agreement shall be governed by and construed in accordance with the laws of {{Jurisdiction}}.",
      variables: { Jurisdiction: "Kenya" },
    },
    {
      id: "contract-dispute",
      title: "Dispute Resolution",
      body: "Any dispute arising out of or relating to this Agreement shall be resolved through {{ResolutionMethod}}.",
      variables: { ResolutionMethod: "mediation and arbitration in accordance with Kenyan law" },
    },
    {
      id: "contract-force",
      title: "Force Majeure",
      body: "Neither party shall be liable for any failure or delay in performance under this Agreement due to circumstances beyond its reasonable control, including but not limited to acts of God, war, terrorism, riots, fire, natural disasters, or government actions.",
    }
  ];

  const formatContent = (content: string) => {
    return content
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]/g, '<span class="bg-yellow-200 px-1 rounded">[$1]</span>');
  };

  const splitIntoPages = (content: string) => {
    const formattedContent = formatContent(content);
    const wordsPerPage = 500;
    const words = formattedContent.split(' ');
    const pages = [];
    
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pages.push(words.slice(i, i + wordsPerPage).join(' '));
    }
    
    return pages.length > 0 ? pages : [''];
  };

  const pages = splitIntoPages(generatedContent);
  const totalPages = pages.length;

  const addPrompt = () => {
    setAdditionalPrompts([...additionalPrompts, '']);
  };

  const updatePrompt = (index: number, value: string) => {
    const updated = [...additionalPrompts];
    updated[index] = value;
    setAdditionalPrompts(updated);
  };

  const removePrompt = (index: number) => {
    setAdditionalPrompts(additionalPrompts.filter((_, i) => i !== index));
  };

  // Convert generated text to document format for Advanced Editor
  const convertTextToDocument = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const content = paragraphs.map(paragraph => ({
      type: 'paragraph',
      content: [{ type: 'text', text: paragraph.trim() }]
    }));

    return {
      type: 'doc',
      content: content.length > 0 ? content : [{ type: 'paragraph', content: [{ type: 'text', text: 'Start drafting your legal document...' }] }]
    };
  };

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
      return '';
    }).join('');
  };

  // Convert markdown to document format
  const convertFromMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    const content: any[] = [];
    let currentParagraph = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#')) {
        if (currentParagraph) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine.replace(/^#+\s*/, '');
        content.push({
          type: 'heading',
          attrs: { level },
          content: [{ type: 'text', text }]
        });
      } else if (trimmedLine === '') {
        if (currentParagraph) {
          content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: currentParagraph.trim() }]
          });
          currentParagraph = '';
        }
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
      }
    });

    if (currentParagraph) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: currentParagraph.trim() }]
      });
    }

    return {
      type: 'doc',
      content: content.length > 0 ? content : [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
    };
  };

  const handleGenerate = async () => {
    if (!documentType || !caseDetails.clientName) {
      console.log('Missing required fields:', { documentType, clientName: caseDetails.clientName });
      return;
    }

    console.log('Starting document generation with:', { documentType, caseDetails, additionalPrompts });
    setIsGenerating(true);
    setGeneratedContent('');
    setProgress(0);
    setCurrentStep('Initializing AI...');
    setCurrentPage(1);

    try {
      setCurrentStep('Analyzing case details...');
      setProgress(20);

      const filteredPrompts = additionalPrompts.filter(p => p.trim());
      
      // Get the document type information for better generation
      const selectedDocType = getDocumentTypeById(documentType);
      
      const documentTypeName = selectedDocType?.name || documentType;

      const generator = await generateDocumentTemplate(documentTypeName, caseDetails, filteredPrompts);

      setCurrentStep('Generating document...');
      setProgress(40);

      let content = '';
      let chunkCount = 0;
      for await (const chunk of generator) {
        chunkCount++;
        console.log(`Received chunk ${chunkCount}:`, chunk);
        content += chunk;
        setGeneratedContent(content);
        setProgress(Math.min(40 + (content.length / 100), 90));
      }

      console.log('Final content generated:', content);
      setCurrentStep('Finalizing document...');
      setProgress(100);
      
      // Update the Advanced Editor with generated content
      if (useAdvancedEditor) {
        const documentContent = convertTextToDocument(content);
        setCurrentDocument(documentContent);
      }
      
      setTimeout(() => {
        setCurrentStep('Document ready!');
        setIsGenerating(false);
      }, 500);

    } catch (error) {
      console.error('Error generating document:', error);
      setCurrentStep(`Error generating document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    const selectedDocType = getDocumentTypeById(documentType);
    const documentTypeName = selectedDocType?.name || documentType;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const fileName = `${documentType}_${caseDetails.clientName}_${new Date().toISOString().split('T')[0]}.txt`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTypeName.replace(/[^a-zA-Z0-9]/g, '_')}_${caseDetails.clientName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert(`Document "${fileName}" downloaded successfully!`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
  };

  const handleEmailSend = () => {
    const selectedDocType = getDocumentTypeById(documentType);
    
    const documentTypeName = selectedDocType?.name || documentType;

    const subject = encodeURIComponent(`Legal Document: ${documentTypeName} for ${caseDetails.clientName}`);
    const body = encodeURIComponent(generatedContent);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const saveToHakiDocs = async () => {
    if (!generatedContent) return;
    
    try {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const fileName = `${documentType}_${caseDetails.clientName}_${new Date().toISOString().split('T')[0]}.txt`;
      const file = new File([blob], fileName, {
        type: 'text/plain'
      });
      
      const fileList = new DataTransfer();
      fileList.items.add(file);
      await uploadDocuments(fileList.files);
      alert(`Document "${fileName}" saved to HakiDocs successfully!`);
    } catch (error) {
      console.error('Error saving to HakiDocs:', error);
      alert('Failed to save document to HakiDocs. Please try again.');
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Document editor callbacks
  const handleDocumentChange = (updatedContent: { type: string; content: Array<{ type: string; content: Array<{ type: string; text: string }> }> }) => {
    setCurrentDocument(updatedContent);
  };

  const handleAuditEvent = (event: AuditEvent) => {
    console.log('Audit Event:', event);
  };

  const handleSuggestionsChange = (items: SuggestionItem[]) => {
    console.log('Suggestions:', items);
  };

  // HakiDocs Integration Functions
  const loadFromHakiDocs = async (document: any) => {
    try {
      setIsGenerating(true);
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
      setIsGenerating(false);
    }
  };

  const exportDocument = async (format: 'pdf' | 'docx' | 'md') => {
    try {
      setIsGenerating(true);
      
      const markdown = convertToMarkdown(currentDocument);
      
      if (format === 'md') {
        // Download as markdown
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentType || 'document'}_${Date.now()}.md`;
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
      setIsGenerating(false);
    }
  };

  // Create metadata for AI functions
  const documentMetadata = {
    documentType,
    clientName: caseDetails.clientName,
    caseType: caseDetails.caseType,
    description: caseDetails.description,
    jurisdiction: caseDetails.jurisdiction,
    additionalRequirements: additionalPrompts.filter(p => p.trim()).join(', '),
    effectiveDate: new Date().toISOString().split('T')[0]
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">AI Document Generator</h1>
              <p className="text-lg text-gray-600">Generate professional legal documents with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Editor Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="advanced-editor"
                checked={useAdvancedEditor}
                onChange={() => setUseAdvancedEditor(true)}
                className="accent-purple-500"
              />
              <label htmlFor="advanced-editor" className="flex items-center gap-2 cursor-pointer">
                <Edit3 className="w-4 h-4" />
                <span className="font-medium">Advanced AI Editor</span>
                <span className="text-sm text-gray-500">(Haki Draft, Reviews, Lens)</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="simple-generator"
                checked={!useAdvancedEditor}
                onChange={() => setUseAdvancedEditor(false)}
                className="accent-purple-500"
              />
              <label htmlFor="simple-generator" className="flex items-center gap-2 cursor-pointer">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Simple Generator</span>
                <span className="text-sm text-gray-500">(Basic document generation)</span>
              </label>
            </div>
          </div>
        </div>

        {useAdvancedEditor ? (
          // Advanced AI Editor
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-8"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Wand2 className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-900">Document Configuration</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Category *
                    </label>
                    <select
                      value={documentCategory}
                      onChange={(e) => {
                        setDocumentCategory(e.target.value);
                        setDocumentType(''); // Reset document type when category changes
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      aria-label="Select document category"
                    >
                      <option value="">Select document category</option>
                      {availableCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon && `${category.icon} `}{category.name}
                        </option>
                      ))}
                    </select>
                    {documentCategory && getCategoryById(documentCategory) && (
                      <p className="mt-1 text-xs text-gray-500">
                        {getCategoryById(documentCategory)?.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type *
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      disabled={!documentCategory}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                      aria-label="Select document type"
                    >
                      <option value="">Select document type</option>
                      {filteredDocumentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {documentType && (
                      <p className="mt-1 text-xs text-gray-500">
                        {getDocumentTypeById(documentType)?.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-gray-900">Case Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={caseDetails.clientName}
                      onChange={(e) => setCaseDetails({...caseDetails, clientName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter client full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Type
                    </label>
                    <input
                      type="text"
                      value={caseDetails.caseType}
                      onChange={(e) => setCaseDetails({...caseDetails, caseType: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Civil, Criminal, Family Law"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Description
                    </label>
                    <textarea
                      value={caseDetails.description}
                      onChange={(e) => setCaseDetails({...caseDetails, description: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Provide a brief description of the case"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={caseDetails.jurisdiction}
                      onChange={(e) => setCaseDetails({ ...caseDetails, jurisdiction: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter jurisdiction (e.g., Nairobi, Kenya)"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Requirements
                    </label>
                    <button
                      onClick={addPrompt}
                      className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Requirement</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {additionalPrompts.map((prompt, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => updatePrompt(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Include specific clauses for..."
                        />
                        {additionalPrompts.length > 1 && (
                          <button
                            onClick={() => removePrompt(index)}
                            className="p-3 text-gray-400 hover:text-red-500"
                            title="Remove requirement"
                            aria-label="Remove requirement"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!documentType || !caseDetails.clientName || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Document</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Advanced Editor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {isGenerating ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[600px]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{currentStep}</h3>
                    <p className="text-gray-600 mb-4">Generating your legal document...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{progress}% complete</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Editor Header - Matching the image UI */}
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Legal Document Editor</h2>
                      
                      {/* Action Buttons - Top Row */}
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() => setViewMode('edit')}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            viewMode === 'edit' 
                              ? 'text-purple-600 bg-white border border-purple-300' 
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button> */}
                        <button
                          onClick={() => setViewMode('preview')}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            viewMode === 'preview' 
                              ? 'text-purple-600 bg-white border border-purple-300' 
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        {/* <button
                          onClick={() => setViewMode('split')}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            viewMode === 'split' 
                              ? 'text-purple-600 bg-white border border-purple-300' 
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          Split
                        </button> */}
                        <button
                          onClick={() => setShowHakiDocsModal(true)}
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                          disabled={isGenerating}
                        >
                          <FolderOpen className="w-4 h-4" />
                          Load from HakiDocs
                        </button>
                        <button
                          onClick={saveToHakiDocs}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          disabled={isGenerating}
                        >
                          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save to HakiDocs
                        </button>
                        <button
                          onClick={() => exportDocument('md')}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          disabled={isGenerating}
                        >
                          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          Export Document
                        </button>
                      </div>
                    </div>
                  </div>



                  {/* Editor Content */}
                  <div className="flex h-[calc(100vh-300px)]">
                    {/* Editor Panel */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                      <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
                        <LegalDocEditor
                          docId={`doc-${Date.now()}`}
                          currentUser={{ id: "lawyer-1", name: "Adv. Wanjiku" }}
                          initialContent={currentDocument}
                          mode="edit"
                          clauses={legalClauses}
                          metadata={documentMetadata}
                          onChange={handleDocumentChange}
                          onAudit={handleAuditEvent}
                          onSuggestionsChange={handleSuggestionsChange}
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
                              __html: marked(convertToMarkdown(currentDocument))
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          // Simple Generator (Original Implementation)
          <div className={`grid gap-8 transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-0 z-50 bg-white p-8 grid-cols-1' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {!isFullscreen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-8"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Wand2 className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-bold text-gray-900">Document Configuration</h2>
                </div>

                {/* HakiDocs Integration */}
                <div className="bg-blue-50 rounded-lg p-4 mb-2 space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      Document Export
                    </h3>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownload}
                        disabled={!generatedContent}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                      
                      <button
                        onClick={saveToHakiDocs}
                        disabled={!generatedContent}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Save to HakiDocs
                      </button>
                    </div>

                    {generatedContent && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Generated document ready for download:</p>
                        <div className="p-2 bg-white rounded border">
                          <span className="text-sm text-gray-700 font-medium">
                            {documentType}_{caseDetails.clientName}_{new Date().toISOString().split('T')[0]}.txt
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type *
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      aria-label="Select document type"
                    >
                      <option value="">Select document type</option>
                      {documentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-gray-900">Case Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={caseDetails.clientName}
                        onChange={(e) => setCaseDetails({...caseDetails, clientName: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter client full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Case Type
                      </label>
                      <input
                        type="text"
                        value={caseDetails.caseType}
                        onChange={(e) => setCaseDetails({...caseDetails, caseType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Civil, Criminal, Family Law"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Case Description
                      </label>
                      <textarea
                        value={caseDetails.description}
                        onChange={(e) => setCaseDetails({...caseDetails, description: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Provide a brief description of the case"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jurisdiction
                      </label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={caseDetails.jurisdiction}
                          onChange={(e) => setCaseDetails({ ...caseDetails, jurisdiction: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter jurisdiction (e.g., Nairobi, Kenya)"
                        />
                        
                        <div>
                          <label className="block text-xs text-gray-500 mt-1">
                            Or select one or multiple jurisdictions:
                          </label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {[
                              "Kenya",
                              "Uganda",
                              "Nigeria",
                              "Ghana"
                            ].map(j => (
                              <label key={j} className="flex items-center space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={caseDetails.jurisdictionList?.includes(j) || false}
                                  onChange={e => {
                                    const list = caseDetails.jurisdictionList || [];
                                    if (e.target.checked) {
                                      setCaseDetails({
                                        ...caseDetails,
                                        jurisdictionList: [...list, j],
                                        jurisdiction: [...list, j].join(", ")
                                      });
                                    } else {
                                      const newList = list.filter(item => item !== j);
                                      setCaseDetails({
                                        ...caseDetails,
                                        jurisdictionList: newList,
                                        jurisdiction: newList.join(", ")
                                      });
                                    }
                                  }}
                                  className="accent-purple-500"
                                />
                                <span>{j}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Requirements
                      </label>
                      <button
                        onClick={addPrompt}
                        className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Requirement</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {additionalPrompts.map((prompt, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={prompt}
                            onChange={(e) => updatePrompt(index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., Include specific clauses for..."
                          />
                          {additionalPrompts.length > 1 && (
                            <button
                              onClick={() => removePrompt(index)}
                              className="p-3 text-gray-400 hover:text-red-500"
                              title="Remove requirement"
                              aria-label="Remove requirement"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!documentType || !caseDetails.clientName || isGenerating}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Document</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col ${
                isFullscreen ? 'h-full' : 'min-h-[800px]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900">Generated Document</h2>
                  {totalPages > 1 && (
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {generatedContent && (
                    <>
                      <button
                        onClick={handleCopy}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleEmailSend}
                        className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Email document"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={saveToHakiDocs}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Save to HakiDocs"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isGenerating && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{currentStep}</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <div 
                  ref={outputRef}
                  className={`border border-gray-200 rounded-lg p-6 overflow-y-auto bg-gray-50 ${
                    isFullscreen ? 'h-[calc(100vh-200px)]' : 'flex-1'
                  }`}
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}
                >
                  {generatedContent ? (
                    <div 
                      className="text-gray-800 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: pages[currentPage - 1] || '' 
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FileText className="w-16 h-16 mb-4" />
                      <p className="text-lg font-medium mb-2">Ready to Generate</p>
                      <p className="text-center">Fill in the form and click "Generate Document" to create your legal template</p>
                    </div>
                  )}
                </div>

                {/* Document Export Section */}
                {generatedContent && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      Document Export
                    </h3>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                      
                      <button
                        onClick={saveToHakiDocs}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Save to HakiDocs
                      </button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Generated document ready for download:</p>
                      <div className="p-2 bg-white rounded border">
                        <span className="text-sm text-gray-700 font-medium">
                          {documentType}_{caseDetails.clientName}_{new Date().toISOString().split('T')[0]}.txt
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {totalPages > 1 && generatedContent && (
                  <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-purple-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!isGenerating && generatedContent && (
                <div className="mt-4 flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Document generated successfully</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
};

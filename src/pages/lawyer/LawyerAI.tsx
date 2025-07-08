import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  FileText,
  Download,
  Mail,
  Copy,
  Wand2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { generateDocumentTemplate } from '../../lib/gemini';

export const LawyerAI = () => {
  const [documentType, setDocumentType] = useState('');
  const [caseDetails, setCaseDetails] = useState({
    caseType: '',
    clientName: '',
    description: '',
    jurisdiction: 'Kenya'
  });
  const [additionalPrompts, setAdditionalPrompts] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const outputRef = useRef<HTMLDivElement>(null);

  const documentTypes = [
    'Affidavit',
    'Contract Agreement',
    'Power of Attorney',
    'Lease Agreement',
    'Employment Contract',
    'Non-Disclosure Agreement',
    'Court Application',
    'Legal Notice',
    'Memorandum of Understanding',
    'Will and Testament'
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

  const handleGenerate = async () => {
    if (!documentType || !caseDetails.clientName) return;

    setIsGenerating(true);
    setGeneratedContent('');
    setProgress(0);
    setCurrentStep('Initializing AI...');
    setCurrentPage(1);

    try {
      setCurrentStep('Analyzing case details...');
      setProgress(20);

      const filteredPrompts = additionalPrompts.filter(p => p.trim());
      const generator = await generateDocumentTemplate(documentType, caseDetails, filteredPrompts);

      setCurrentStep('Generating document...');
      setProgress(40);

      let content = '';
      for await (const chunk of generator) {
        content += chunk;
        setGeneratedContent(content);
        setProgress(Math.min(40 + (content.length / 100), 90));
      }

      setCurrentStep('Finalizing document...');
      setProgress(100);
      
      setTimeout(() => {
        setCurrentStep('Document ready!');
        setIsGenerating(false);
      }, 500);

    } catch (error) {
      console.error('Error generating document:', error);
      setCurrentStep('Error generating document');
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}_${caseDetails.clientName}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
  };

  const handleEmailSend = () => {
    const subject = encodeURIComponent(`Legal Document: ${documentType} for ${caseDetails.clientName}`);
    const body = encodeURIComponent(generatedContent);
    window.open(`mailto:?subject=${subject}&body=${body}`);
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

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">AI Document Generator</h1>
              <p className="text-lg text-gray-600">Generate professional legal documents with AI assistance</p>
            </div>
          </div>
        </div>

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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    <input
                      type="text"
                      value={caseDetails.jurisdiction}
                      onChange={(e) => setCaseDetails({...caseDetails, jurisdiction: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="flex-1 border border-gray-200 rounded-lg p-6 overflow-y-auto bg-gray-50"
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
      </div>
    </LawyerDashboardLayout>
  );
};

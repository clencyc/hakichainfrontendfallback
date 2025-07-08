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
  X
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
        
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
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

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">Document Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Document Type */}
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

              {/* Case Details */}
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

              {/* Additional Prompts */}
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

          {/* Right Side - Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Generated Document</h2>
              </div>
              
              {generatedContent && (
                <div className="flex items-center space-x-2">
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
                    className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Email document"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
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

            {/* Output Area */}
            <div 
              ref={outputRef}
              className="flex-1 border border-gray-200 rounded-lg p-4 overflow-y-auto bg-gray-50 font-mono text-sm"
            >
              {generatedContent ? (
                <pre className="whitespace-pre-wrap text-gray-800">{generatedContent}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium mb-2">Ready to Generate</p>
                  <p className="text-center">Fill in the form and click "Generate Document" to create your legal template</p>
                </div>
              )}
            </div>

            {/* Status Indicator */}
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

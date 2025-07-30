import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Bot,
  User,
  Edit3,
  MessageCircle,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  X,
  Sparkles,
  Eye,
  EyeOff,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DocumentError {
  message: string;
  details?: string;
}

export const AIReviewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<DocumentError | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'edit'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI document assistant. I can help you review, analyze, and edit your legal documents. Upload a document to get started!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setIsDocumentLoaded(false);
      setReview(null);
      setError(null);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `📄 I've loaded "${file.name}". I can help you review, analyze, or edit this document. What would you like me to help you with?`,
          timestamp: new Date()
        }
      ]);
      
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid PDF, DOCX, or DOC file.');
      return false;
    }
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB.');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
    setDocumentError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Document load error:', error);
    setDocumentError({
      message: 'Failed to load document',
      details: error.message.includes('worker') 
        ? 'PDF viewer is not available. Please try refreshing the page or use a different browser.'
        : error.message
    });
    setIsDocumentLoaded(false);
  };

  // Fallback for PDF worker issues
  useEffect(() => {
    const checkWorkerAvailability = async () => {
      try {
        // Test if the worker is available
        const testUrl = pdfjs.GlobalWorkerOptions.workerSrc;
        const response = await fetch(testUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('PDF worker not available, using fallback');
          // Try alternative worker source
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        }
      } catch (error) {
        console.warn('PDF worker check failed:', error);
        // Try alternative worker source
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      }
    };

    checkWorkerAvailability();
  }, []);

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(text, chatMode),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string, mode: 'chat' | 'edit'): string => {
    const chatResponses = {
      'review': 'I\'ve reviewed your document and found several key points:\n\n✅ **Strengths:**\n- Clear structure and formatting\n- Comprehensive coverage of main clauses\n\n⚠️ **Areas for Improvement:**\n- Clause 3.2 needs clarification\n- Missing signature section\n- Consider adding dispute resolution clause\n\nWould you like me to help you address any of these issues?',
      'analyze': 'Here\'s my analysis of your document:\n\n📊 **Document Type:** Legal Contract\n📏 **Length:** Standard (3 pages)\n🎯 **Key Sections:** 8 main clauses\n⚠️ **Risk Level:** Low to Medium\n\n**Recommendations:**\n1. Add force majeure clause\n2. Include termination conditions\n3. Specify governing law\n\nWould you like me to help implement these suggestions?',
      'default': 'I understand you\'re asking about your document. I can help you with:\n\n• **Review** - Identify issues and improvements\n• **Analyze** - Provide detailed analysis\n• **Edit** - Make specific changes\n• **Explain** - Clarify legal terms\n\nWhat specific aspect would you like me to focus on?'
    };

    const editResponses = {
      'add clause': 'I\'ll help you add a new clause. Here\'s a suggested addition:\n\n```\nCLAUSE 9: FORCE MAJEURE\n\n9.1 Neither party shall be liable for any failure or delay in performance under this Agreement due to circumstances beyond their reasonable control, including but not limited to acts of God, war, terrorism, riots, fire, natural disasters, or government actions.\n\n9.2 The affected party shall notify the other party within 48 hours of becoming aware of such circumstances.\n```\n\nWould you like me to integrate this into your document?',
      'modify': 'I can help you modify the document. Please specify:\n\n• Which section/clause to modify\n• What changes you want to make\n• Any specific legal requirements\n\nFor example: "Modify clause 3.2 to include payment terms"',
      'default': 'I\'m ready to help you edit your document. I can:\n\n• **Add new clauses** or sections\n• **Modify existing content**\n• **Improve language** and clarity\n• **Ensure legal compliance**\n\nWhat would you like to edit?'
    };

    const responses = mode === 'chat' ? chatResponses : editResponses;
    const lowerInput = userInput.toLowerCase();
    
    if (mode === 'chat') {
      if (lowerInput.includes('review')) return chatResponses.review;
      if (lowerInput.includes('analyze')) return chatResponses.analyze;
      return chatResponses.default;
    } else {
      if (lowerInput.includes('add') && lowerInput.includes('clause')) return editResponses['add clause'];
      if (lowerInput.includes('modify') || lowerInput.includes('change')) return editResponses.modify;
      return editResponses.default;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm your AI document assistant. I can help you review, analyze, and edit your legal documents. Upload a document to get started!",
        timestamp: new Date()
      }
    ]);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/(?:^|\n)(\d+\.\s)/g, '<br><strong>$1</strong>')
      .replace(/(?:^|\n)(-\s)/g, '<br>• ');
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">AI Document Reviewer</h1>
              <p className="text-lg text-gray-600">Upload, preview, and interact with your legal documents using AI</p>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-white p-6 grid-cols-1' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          
          {/* Document Canvas Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col ${
              isFullscreen ? 'h-full' : 'min-h-[800px]'
            }`}
          >
            {/* Canvas Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
                {file && (
                  <span className="text-sm text-gray-500">({file.name})</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {file && (
                  <>
                    <button
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 min-w-[60px] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setScale(1.0)}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Reset zoom"
                    >
                      <RotateCw className="w-4 h-4" />
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

            {/* Document Upload Area or Preview */}
            <div className="flex-1 p-6">
              {!file ? (
                <div
                  className="flex flex-col items-center justify-center h-full border-2 border-dashed border-blue-300 rounded-xl p-8 cursor-pointer hover:bg-blue-50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Document</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Drag and drop your PDF, DOCX, or DOC file here, or click to browse
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Supported formats: PDF, DOCX, DOC</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-label="Upload document"
                    title="Upload document"
                  />
                </div>
              ) : (
                                 <div className="h-full overflow-auto bg-gray-50 rounded-lg">
                   {fileUrl && (
                     <div className="flex justify-center p-4">
                       {file?.type === 'application/pdf' ? (
                         <Document
                           file={fileUrl}
                           onLoadSuccess={onDocumentLoadSuccess}
                           onLoadError={onDocumentLoadError}
                           loading={
                             <div className="flex items-center justify-center h-64">
                               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                               <span className="ml-2 text-blue-500">Loading document...</span>
                             </div>
                           }
                           error={
                             <div className="flex flex-col items-center justify-center h-64 text-red-500">
                               <AlertTriangle className="w-8 h-8 mb-2" />
                               <span>Error loading document</span>
                               {documentError?.details && (
                                 <span className="text-xs text-gray-500 mt-1">{documentError.details}</span>
                               )}
                               <button
                                 onClick={() => window.open(fileUrl, '_blank')}
                                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                               >
                                 Open in New Tab
                               </button>
                             </div>
                           }
                         >
                           <Page
                             pageNumber={currentPage}
                             scale={scale}
                             loading={
                               <div className="flex items-center justify-center h-64">
                                 <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                               </div>
                             }
                           />
                         </Document>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-64">
                           <FileText className="w-16 h-16 text-blue-500 mb-4" />
                           <h3 className="text-lg font-medium text-gray-900 mb-2">{file?.name}</h3>
                           <p className="text-gray-500 mb-4">Document preview not available for this file type</p>
                           <button
                             onClick={() => window.open(fileUrl, '_blank')}
                             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                           >
                             Open Document
                           </button>
                         </div>
                       )}
                     </div>
                   )}
                  
                  {numPages > 1 && (
                    <div className="flex items-center justify-center space-x-4 p-4 border-t border-gray-200">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {numPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                        disabled={currentPage >= numPages}
                        className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Chat Interface Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[800px]"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
                  <p className="text-sm text-gray-500">Chat & Edit Mode</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                {file && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChatMode('chat')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    chatMode === 'chat'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setChatMode('edit')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    chatMode === 'edit'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Edit
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(message.content) 
                        }}
                      />
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 bg-gray-100 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={chatMode === 'chat' ? "Ask me about your document..." : "Tell me what to edit..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    disabled={isTyping}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>
                  {chatMode === 'chat' 
                    ? 'Ask me to review, analyze, or explain your document' 
                    : 'Tell me what changes you want to make to your document'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            <span className="text-red-900">{error}</span>
          </motion.div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
}; 
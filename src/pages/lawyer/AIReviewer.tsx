import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Upload, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  Send,
  Bot,
  User,
  Edit3,
  MessageCircle,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Eye,
  RotateCw,
  ZoomIn,
  ZoomOut,
  FileSignature,
  UserPlus,
  PenTool,
  Type,
  Image as ImageIcon,
  Hash,
  Database
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { useESignature } from '../../hooks/useESignature';

// Set up PDF.js worker - Using CDN for better compatibility
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

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signature?: string;
  signedAt?: Date;
  position: { x: number; y: number };
}

export const AIReviewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<DocumentError | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'edit' | 'e-sign'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI document assistant. I can help you review, analyze, edit, and sign your legal documents. Upload a document to get started!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // E-signature state
  const [signers, setSigners] = useState<Signer[]>([]);
  const [showSignerForm, setShowSignerForm] = useState(false);
  const [newSigner, setNewSigner] = useState({ name: '', email: '', role: '' });
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signatureData, setSignatureData] = useState('');
  const [typedSignature, setTypedSignature] = useState('');
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // E-signature hook
  const { 
    registerDocument, 
    requestSignature, 
    signDocument, 
    createSignature, 
    generateDocumentHash,
    isLoading: isESignLoading,
    error: eSignError 
  } = useESignature();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
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
    setDocumentError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Document load error:', error);
    
    let errorMessage = 'Failed to load document';
    let errorDetails = error.message;
    
    if (error.message.includes('worker') || error.message.includes('PDF')) {
      errorMessage = 'PDF viewer is not available';
      errorDetails = 'The PDF viewer is currently unavailable. You can still download and view the document in your browser.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error';
      errorDetails = 'Unable to load the document due to a network issue. Please check your connection and try again.';
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = 'Invalid PDF file';
      errorDetails = 'The uploaded file appears to be corrupted or not a valid PDF. Please try a different file.';
    }
    
    setDocumentError({
      message: errorMessage,
      details: errorDetails
    });
  };

  // Fallback for PDF worker issues
  useEffect(() => {
    const setupPDFWorker = async () => {
      const workerSources = [
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
        `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
        `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
      ];

      for (const workerSrc of workerSources) {
        try {
          const response = await fetch(workerSrc, { method: 'HEAD' });
          if (response.ok) {
            pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
            console.log('PDF worker loaded from:', workerSrc);
            break;
          }
        } catch (error) {
          console.warn('Failed to load PDF worker from:', workerSrc);
          continue;
        }
      }
    };

    setupPDFWorker();
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
        content: file 
          ? `📄 I've loaded "${file.name}". I can help you review, analyze, edit, or sign this document. What would you like me to help you with?`
          : "👋 Hi! I'm your AI document assistant. I can help you review, analyze, edit, and sign your legal documents. Upload a document to get started!",
        timestamp: new Date()
      }
    ]);
  };

  // E-signature methods
  useEffect(() => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        setDrawingContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !drawingContext) return;
    
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingContext.beginPath();
    drawingContext.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingContext) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingContext.lineTo(x, y);
    drawingContext.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (drawingContext && signatureCanvasRef.current) {
      drawingContext.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height);
    }
    setTypedSignature('');
    setUploadedSignature(null);
  };

  const saveSignature = () => {
    if (signatureMode === 'draw' && signatureCanvasRef.current) {
      setSignatureData(signatureCanvasRef.current.toDataURL());
    } else if (signatureMode === 'type') {
      setSignatureData(typedSignature);
    } else if (signatureMode === 'upload' && uploadedSignature) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureData(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedSignature);
    }
  };

  const addSigner = () => {
    if (newSigner.name && newSigner.email) {
      const signer: Signer = {
        id: Date.now().toString(),
        name: newSigner.name,
        email: newSigner.email,
        role: newSigner.role || 'Signer',
        status: 'pending',
        position: { x: 100, y: 100 }
      };
      
      setSigners([...signers, signer]);
      setNewSigner({ name: '', email: '', role: '' });
      setShowSignerForm(false);
    }
  };

  const sendForSigning = async () => {
    if (!file || signers.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Generate document hash
      const documentHash = generateDocumentHash(file.name, {
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Register document on blockchain
      await registerDocument(documentHash, file.name);
      
      // Request signatures from all signers
      for (const signer of signers) {
        await requestSignature(documentHash, signer.email, signer.name, signer.email);
      }
      
      // Update signers status
      setSigners(signers.map(s => ({ ...s, status: 'pending' as const })));
      
    } catch (err) {
      console.error('Error sending for signing:', err);
    } finally {
      setIsProcessing(false);
    }
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
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">HakiReview</h1>
              <p className="text-lg text-gray-600">AI-powered document analysis and legal review</p>
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
                           <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
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
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">HakiReview Assistant</h2>
                  <p className="text-sm text-gray-500">AI Document Analysis & Chat</p>
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
                <button
                  onClick={() => setChatMode('e-sign')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    chatMode === 'e-sign'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileSignature className="w-4 h-4 inline mr-2" />
                  E-Sign
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {chatMode === 'e-sign' ? (
                // E-Sign Interface
                <div className="space-y-6">
                  {!file ? (
                    <div className="text-center py-12">
                      <FileSignature className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                      <p className="text-gray-500">Upload a document to start the e-signature process</p>
                    </div>
                  ) : (
                    <>
                      {/* Signers Management */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">Signers</h3>
                          <button
                            onClick={() => setShowSignerForm(true)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Add Signer</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {signers.map((signer) => (
                            <div key={signer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{signer.name}</p>
                                <p className="text-sm text-gray-500">{signer.email} • {signer.role}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                signer.status === 'signed' ? 'bg-green-100 text-green-800' :
                                signer.status === 'declined' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {signer.status}
                              </div>
                            </div>
                          ))}
                          
                          {signers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <UserPlus className="w-8 h-8 mx-auto mb-2" />
                              <p>No signers added yet</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Signature Tools */}
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Signature Tools</h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <button
                            onClick={() => setSignatureMode('draw')}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              signatureMode === 'draw'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <PenTool className="w-5 h-5 mx-auto mb-1" />
                            Draw
                          </button>
                          <button
                            onClick={() => setSignatureMode('type')}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              signatureMode === 'type'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Type className="w-5 h-5 mx-auto mb-1" />
                            Type
                          </button>
                          <button
                            onClick={() => setSignatureMode('upload')}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              signatureMode === 'upload'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                            Upload
                          </button>
                        </div>

                        {signatureMode === 'draw' && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium">Draw your signature</span>
                              <button
                                onClick={clearSignature}
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                Clear
                              </button>
                            </div>
                            <canvas
                              ref={signatureCanvasRef}
                              width={400}
                              height={200}
                              className="border border-gray-300 rounded-lg cursor-crosshair w-full"
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              title="Signature drawing canvas"
                              aria-label="Signature drawing area"
                            />
                          </div>
                        )}

                        {signatureMode === 'type' && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <input
                              type="text"
                              value={typedSignature}
                              onChange={(e) => setTypedSignature(e.target.value)}
                              placeholder="Type your signature"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}

                        {signatureMode === 'upload' && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setUploadedSignature(e.target.files?.[0] || null)}
                              className="w-full p-3 border border-gray-300 rounded-lg"
                              title="Upload signature image"
                              aria-label="Upload signature image file"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={sendForSigning}
                          disabled={signers.length === 0 || isProcessing}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                        >
                          {isProcessing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FileSignature className="w-4 h-4" />
                          )}
                          <span>{isProcessing ? 'Processing...' : 'Send for Signing'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Chat/Edit Interface
                <div className="space-y-4">
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
              )}
            </div>

            {/* Input Area - Hidden in E-sign mode */}
            {chatMode !== 'e-sign' && (
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
            )}
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

        {/* Add Signer Modal */}
        {showSignerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add Signer</h3>
                <button
                  onClick={() => setShowSignerForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newSigner.name}
                    onChange={(e) => setNewSigner({...newSigner, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter signer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSigner.email}
                    onChange={(e) => setNewSigner({...newSigner, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter signer email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={newSigner.role}
                    onChange={(e) => setNewSigner({...newSigner, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Client, Witness, Attorney"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowSignerForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addSigner}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Signer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
}; 
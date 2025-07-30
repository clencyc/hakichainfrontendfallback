import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Download,
  Send,
  UserPlus,
  PenTool,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Clock,
  Calendar,
  Users,
  Hash,
  Copy,
  Share2,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Image as ImageIcon,
  FileSignature,
  Shield,
  Database
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

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

interface Document {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  status: 'draft' | 'pending' | 'completed';
  signers: Signer[];
  hash?: string;
  blockchainTx?: string;
}

export const LawyerESign = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signatureData, setSignatureData] = useState('');
  const [typedSignature, setTypedSignature] = useState('');
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showSignerForm, setShowSignerForm] = useState(false);
  const [newSigner, setNewSigner] = useState({ name: '', email: '', role: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setIsUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          content: `PDF Document: ${file.name}`,
          uploadedAt: new Date(),
          status: 'draft',
          signers: [],
          hash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
        setDocuments([...documents, newDoc]);
        setCurrentDocument(newDoc);
        setIsUploading(false);
      }, 2000);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !drawingContext) return;
    
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    drawingContext.beginPath();
    drawingContext.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingContext) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
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
    if (newSigner.name && newSigner.email && currentDocument) {
      const signer: Signer = {
        id: Date.now().toString(),
        name: newSigner.name,
        email: newSigner.email,
        role: newSigner.role,
        status: 'pending',
        position: { x: 100, y: 100 }
      };
      
      setCurrentDocument({
        ...currentDocument,
        signers: [...currentDocument.signers, signer]
      });
      setNewSigner({ name: '', email: '', role: '' });
      setShowSignerForm(false);
    }
  };

  const sendForSigning = async () => {
    if (!currentDocument || currentDocument.signers.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      if (currentDocument) {
        const updatedDoc = {
          ...currentDocument,
          status: 'pending' as const,
          blockchainTx: `0x${Math.random().toString(16).substr(2, 64)}`
        };
        setCurrentDocument(updatedDoc);
        setDocuments(documents.map(doc => 
          doc.id === updatedDoc.id ? updatedDoc : doc
        ));
      }
      setIsProcessing(false);
    }, 3000);
  };

  const downloadSignedDocument = () => {
    if (!currentDocument) return;
    
    const blob = new Blob([`Signed Document: ${currentDocument.name}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_${currentDocument.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyDocumentHash = () => {
    if (currentDocument?.hash) {
      navigator.clipboard.writeText(currentDocument.hash);
    }
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">E-Signature Platform</h1>
              <p className="text-lg text-gray-600">Secure digital signatures with blockchain verification</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Document Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Documents</h2>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex flex-col items-center space-y-2 w-full"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isUploading ? 'Uploading...' : 'Upload PDF Document'}
                  </span>
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setCurrentDocument(doc)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    currentDocument?.id === doc.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.signers.length} signer{doc.signers.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Document Viewer and Signing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
              {currentDocument ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{currentDocument.name}</h2>
                      <p className="text-sm text-gray-500">
                        Uploaded {currentDocument.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentDocument.hash && (
                        <button
                          onClick={copyDocumentHash}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                          title="Copy document hash"
                        >
                          <Hash className="w-4 h-4" />
                          <span>Hash</span>
                        </button>
                      )}
                      {currentDocument.blockchainTx && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                          <Database className="w-4 h-4" />
                          <span>On-chain</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Document Preview</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                          title="Zoom out"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                        <button
                          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                          title="Zoom in"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">{currentDocument.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Document Hash: {currentDocument.hash?.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Signers Management */}
                  <div className="mb-6">
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
                      {currentDocument.signers.map((signer) => (
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
                    </div>
                  </div>

                  {/* Signature Tools */}
                  <div className="mb-6">
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
                           className="border border-gray-300 rounded-lg cursor-crosshair"
                           onMouseDown={startDrawing}
                           onMouseMove={draw}
                           onMouseUp={stopDrawing}
                           onMouseLeave={stopDrawing}
                           style={{ transform: `scale(${zoom})` }}
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
                      disabled={currentDocument.signers.length === 0 || isProcessing}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isProcessing ? 'Processing...' : 'Send for Signing'}</span>
                    </button>
                    
                    {currentDocument.status === 'completed' && (
                      <button
                        onClick={downloadSignedDocument}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Signed</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                  <p className="text-gray-500">Upload a document to get started with e-signatures</p>
                </div>
              )}
            </motion.div>
          </div>

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
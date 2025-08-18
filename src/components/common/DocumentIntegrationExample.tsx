import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, FolderOpen, X, CheckCircle } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentSelector } from './DocumentSelector';

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  url?: string;
}

interface DocumentIntegrationExampleProps {
  title?: string;
  description?: string;
  onDocumentsChange?: (documents: Document[]) => void;
  maxDocuments?: number;
  acceptedTypes?: string[];
}

export const DocumentIntegrationExample = ({
  title = "Document Integration",
  description = "Upload new documents or select from your Haki Docs",
  onDocumentsChange,
  maxDocuments = 5,
  acceptedTypes = ['*/*']
}: DocumentIntegrationExampleProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  const handleUploadComplete = (uploadedDocs: Document[]) => {
    setShowUploadModal(false);
    const newDocuments = [...selectedDocuments, ...uploadedDocs];
    if (newDocuments.length <= maxDocuments) {
      setSelectedDocuments(newDocuments);
      onDocumentsChange?.(newDocuments);
    }
  };

  const handleUploadError = (error: string) => {
    alert(`Upload failed: ${error}`);
  };

  const handleDocumentSelect = (selectedDocs: Document[]) => {
    setShowSelectorModal(false);
    const newDocuments = [...selectedDocuments, ...selectedDocs];
    if (newDocuments.length <= maxDocuments) {
      setSelectedDocuments(newDocuments);
      onDocumentsChange?.(newDocuments);
    } else {
      alert(`Maximum ${maxDocuments} documents allowed`);
    }
  };

  const removeDocument = (documentId: string) => {
    const newDocuments = selectedDocuments.filter(doc => doc.id !== documentId);
    setSelectedDocuments(newDocuments);
    onDocumentsChange?.(newDocuments);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowUploadModal(true)}
          disabled={selectedDocuments.length >= maxDocuments}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload New
        </button>
        
        <button
          onClick={() => setShowSelectorModal(true)}
          disabled={selectedDocuments.length >= maxDocuments}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Select from HakiDocs
        </button>
      </div>

      {/* Document Counter */}
      <div className="text-sm text-gray-500">
        {selectedDocuments.length} of {maxDocuments} documents selected
      </div>

      {/* Selected Documents List */}
      {selectedDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Selected Documents</h4>
          <div className="space-y-2">
            {selectedDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getFileIcon(doc.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <DocumentUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  acceptedTypes={acceptedTypes}
                  placeholder="Upload documents for this tool"
                  showPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Selector Modal */}
      {showSelectorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <DocumentSelector
                onDocumentSelect={handleDocumentSelect}
                placeholder="Select documents from your Haki Docs"
                showPreview={true}
                filterByType={acceptedTypes[0] !== '*/*' ? acceptedTypes : []}
                maxSelect={maxDocuments - selectedDocuments.length}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

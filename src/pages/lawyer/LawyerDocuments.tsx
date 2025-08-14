import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Download, Trash2, Filter, FileText, File, Image, FileArchive, FolderOpen, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentManagement } from '../../hooks/useDocumentManagement';
import { DocumentUpload } from '../../components/common/DocumentUpload';
import { DocumentSelector } from '../../components/common/DocumentSelector';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  bounty?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
}

export const LawyerDocuments = () => {
  const { user } = useAuth();
  const { documents, isLoading, error, loadDocuments, deleteDocument, downloadDocument, searchDocuments } = useDocumentManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  const handleUploadComplete = (uploadedDocs: Document[]) => {
    setShowUploadModal(false);
    // Documents are automatically refreshed by the hook
  };

  const handleUploadError = (error: string) => {
    alert(`Upload failed: ${error}`);
  };

  const handleDocumentSelect = (selectedDocs: Document[]) => {
    setShowSelectorModal(false);
    // Handle selected documents as needed
    console.log('Selected documents:', selectedDocs);
  };

  const handleDelete = async (documentId: string) => {
    const success = await deleteDocument(documentId);
    if (success) {
      setSelectedFiles(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleDownload = async (document: Document) => {
    await downloadDocument(document);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchDocuments(searchTerm, { type: typeFilter !== 'all' ? typeFilter : undefined });
    } else {
      loadDocuments({ type: typeFilter !== 'all' ? typeFilter : undefined });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <LawyerDashboardLayout>
      <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">HakiDocs</h1>
              <p className="text-lg text-gray-600">Central document repository for HakiChain</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
              aria-label="Filter by file type"
            >
              <option value="all">All Types</option>
              <option value="image/">Images</option>
              <option value="application/pdf">PDFs</option>
              <option value="application/msword">Word Docs</option>
              <option value="application/zip">Archives</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Files
            </button>
            <button
              onClick={() => setShowSelectorModal(true)}
              className="btn btn-outline"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              Select from HakiDocs
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-primary-700">{selectedFiles.length} files selected</span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline py-1.5 px-3">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button 
                className="btn btn-error py-1.5 px-3"
                onClick={() => {
                  selectedFiles.forEach(id => handleDelete(id));
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>

                    {(doc.bounty || doc.milestone) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {doc.bounty && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Case:</span> {doc.bounty.title}
                          </p>
                        )}
                        {doc.milestone && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Milestone:</span> {doc.milestone.title}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                                             <div className="flex space-x-2">
                         <button 
                           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                           onClick={() => handleDownload(doc)}
                           aria-label={`Download ${doc.name}`}
                           title={`Download ${doc.name}`}
                         >
                           <Download className="w-4 h-4 text-gray-500" />
                         </button>
                         <button 
                           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                           onClick={() => handleDelete(doc.id)}
                           aria-label={`Delete ${doc.name}`}
                           title={`Delete ${doc.name}`}
                         >
                           <Trash2 className="w-4 h-4 text-gray-500" />
                         </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-6">Upload your first document to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </button>
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
                      <h3 className="text-lg font-medium text-gray-900">Upload Documents to Haki Docs</h3>
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
                    placeholder="Upload documents to your Haki Docs"
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

              <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh]">
                <DocumentSelector
                  onDocumentSelect={handleDocumentSelect}
                  placeholder="Select documents from your Haki Docs"
                  showPreview={true}
                  isModal={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
};
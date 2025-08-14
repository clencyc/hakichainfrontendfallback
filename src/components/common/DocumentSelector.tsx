import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Image, FileArchive, File, CheckCircle, FolderOpen, Filter, Download, Eye, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface DocumentSelectorProps {
  onDocumentSelect?: (documents: Document[]) => void;
  multiple?: boolean;
  selectedDocuments?: Document[];
  showPreview?: boolean;
  className?: string;
  placeholder?: string;
  filterByType?: string[];
  maxSelect?: number;
  isModal?: boolean;
}

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  url?: string;
  bounty?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
}

export const DocumentSelector = ({
  onDocumentSelect,
  multiple = true,
  selectedDocuments = [],
  showPreview = true,
  className = '',
  placeholder = 'Select documents from Haki Docs',
  filterByType = [],
  maxSelect,
  isModal = false
}: DocumentSelectorProps) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDocs, setSelectedDocs] = useState<Document[]>(selectedDocuments);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      loadDocuments();
    }
  }, [showModal, user]);

  const loadDocuments = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          bounties (
            id,
            title
          ),
          milestones (
            id,
            title
          )
        `)
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for documents
      const documentsWithUrls = await Promise.all(
        (data || []).map(async (doc) => {
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(doc.path);
          
          return {
            ...doc,
            url: urlData.publicUrl
          };
        })
      );

      setDocuments(documentsWithUrls);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return FileArchive;
    return File;
  };

  const handleDocumentSelect = (document: Document) => {
    if (maxSelect && selectedDocs.length >= maxSelect && !selectedDocs.find(d => d.id === document.id)) {
      return; // Max selection reached
    }

    if (multiple) {
      const isSelected = selectedDocs.find(d => d.id === document.id);
      if (isSelected) {
        setSelectedDocs(prev => prev.filter(d => d.id !== document.id));
      } else {
        setSelectedDocs(prev => [...prev, document]);
      }
    } else {
      setSelectedDocs([document]);
    }
  };

  const handleConfirm = () => {
    onDocumentSelect?.(selectedDocs);
    setShowModal(false);
  };

  const handleRemove = (documentId: string) => {
    setSelectedDocs(prev => prev.filter(d => d.id !== documentId));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type.startsWith(typeFilter);
    const matchesFilter = filterByType.length === 0 || filterByType.some(type => doc.type.startsWith(type));
    return matchesSearch && matchesType && matchesFilter;
  });

  const isSelected = (documentId: string) => selectedDocs.find(d => d.id === documentId);

  return (
    <div className={className}>
      {/* Trigger Button - Only show if not in modal mode */}
      {!isModal && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors"
        >
          <div className="space-y-2">
            <FolderOpen className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-medium text-gray-900">{placeholder}</p>
            <p className="text-xs text-gray-500">
              {selectedDocs.length > 0 
                ? `${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''} selected`
                : 'Click to browse your documents'
              }
            </p>
          </div>
        </button>
      )}

      {/* Selected Documents Preview - Only show if not in modal mode */}
      {!isModal && showPreview && selectedDocs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Documents</h3>
          <div className="space-y-2">
            {selectedDocs.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                      <FileIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label={`Remove ${doc.name}`}
                      title={`Remove ${doc.name}`}
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

            {/* Modal - Only show if not in modal mode */}
      {!isModal && showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-900">Select Documents from Haki Docs</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                </div>

                {/* Documents Grid */}
                <div className="overflow-y-auto">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDocuments.map((doc) => {
                        const FileIcon = getFileIcon(doc.type);
                        const selected = isSelected(doc.id);
                        
                        return (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                              selected 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleDocumentSelect(doc)}
                          >
                            <div className="p-4">
                              <div className="flex items-start">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileIcon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                                  <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(doc.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {(doc.bounty || doc.milestone) && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  {doc.bounty && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Case:</span> {doc.bounty.title}
                                    </p>
                                  )}
                                  {doc.milestone && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Milestone:</span> {doc.milestone.title}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {selected && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-primary-600" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No documents found</h3>
                      <p className="text-gray-500">Upload documents to your Haki Docs to get started</p>
                    </div>
                  )}
                </div>

                {maxSelect && (
                  <p className="text-sm text-gray-500 mt-4">
                    {selectedDocs.length}/{maxSelect} documents selected
                  </p>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={selectedDocs.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select {selectedDocs.length > 0 ? `(${selectedDocs.length})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Content - Show when in modal mode */}
      {isModal && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Select Documents from Haki Docs</h3>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>

          {/* Documents Grid */}
          <div className="overflow-y-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
                  </div>
                ))}
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  const selected = isSelected(doc.id);
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                        selected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {(doc.bounty || doc.milestone) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {doc.bounty && (
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Case:</span> {doc.bounty.title}
                              </p>
                            )}
                            {doc.milestone && (
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Milestone:</span> {doc.milestone.title}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {selected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No documents found</h3>
                <p className="text-gray-500">Upload documents to your Haki Docs to get started</p>
              </div>
            )}
          </div>

          {maxSelect && (
            <p className="text-sm text-gray-500 mt-4">
              {selectedDocs.length}/{maxSelect} documents selected
            </p>
          )}

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedDocs.length === 0}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedDocs.length > 0 ? `(${selectedDocs.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => onDocumentSelect?.([])}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

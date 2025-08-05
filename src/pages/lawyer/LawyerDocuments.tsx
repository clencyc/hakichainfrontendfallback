import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Download, Trash2, Filter, FileText, File, Image, FileArchive, FolderOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
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
          .eq('uploaded_by', user?.id);

        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        console.error('Error loading documents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDocuments();
    }
  }, [user]);

  const handleUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: docError } = await supabase
          .from('documents')
          .insert({
            name: file.name,
            path: filePath,
            uploaded_by: user?.id,
            size: file.size,
            type: file.type,
          });

        if (docError) throw docError;

        // Refresh documents list
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('uploaded_by', user?.id);

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload document');
      }
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(d => d.id !== documentId));
      setSelectedFiles(prev => prev.filter(id => id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
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
              <h1 className="text-3xl font-serif font-bold text-gray-900">Document Management</h1>
              <p className="text-lg text-gray-600">Manage your case files and legal documents</p>
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
            >
              <option value="all">All Types</option>
              <option value="image/">Images</option>
              <option value="application/pdf">PDFs</option>
              <option value="application/msword">Word Docs</option>
              <option value="application/zip">Archives</option>
            </select>
          </div>

          <label className="btn btn-primary">
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) handleUpload(files);
              }}
            />
            <Upload className="w-5 h-5 mr-2" />
            Upload Files
          </label>
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
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => handleDelete(doc.id)}
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
            <label className="btn btn-primary">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) handleUpload(files);
                }}
              />
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </label>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
};
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Image, FileArchive, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface DocumentUploadProps {
  onUploadComplete?: (documents: Document[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  showPreview?: boolean;
  className?: string;
  placeholder?: string;
  bountyId?: string;
  milestoneId?: string;
}

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  url?: string;
}

export const DocumentUpload = ({
  onUploadComplete,
  onUploadError,
  multiple = true,
  acceptedTypes = ['*/*'],
  maxSize = 50 * 1024 * 1024, // 50MB default
  showPreview = true,
  className = '',
  placeholder = 'Upload documents',
  bountyId,
  milestoneId
}: DocumentUploadProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`;
    }
    
    if (acceptedTypes[0] !== '*/*') {
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });
      
      if (!isAccepted) {
        return `File type ${file.type} is not accepted`;
      }
    }
    
    return null;
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

  const handleUpload = async (files: FileList) => {
    if (!user?.id) {
      onUploadError?.('User not authenticated');
      return;
    }

    setIsUploading(true);
    const uploadedDocs: Document[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        continue;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        // Insert document record
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .insert({
            name: file.name,
            path: filePath,
            uploaded_by: user.id,
            size: file.size,
            type: file.type,
            bounty_id: bountyId || null,
            milestone_id: milestoneId || null,
          })
          .select()
          .single();

        if (docError) throw docError;

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        const document: Document = {
          ...docData,
          url: urlData.publicUrl
        };

        uploadedDocs.push(document);
        setUploadedFiles(prev => [...prev, document]);

      } catch (error) {
        console.error('Error uploading document:', error);
        errors.push(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadProgress({});

    if (uploadedDocs.length > 0) {
      onUploadComplete?.(uploadedDocs);
    }

    if (errors.length > 0) {
      onUploadError?.(errors.join('\n'));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (documentId: string) => {
    setUploadedFiles(prev => prev.filter(doc => doc.id !== documentId));
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          aria-label="File upload input"
          onChange={(e) => {
            const files = e.target.files;
            if (files) handleUpload(files);
          }}
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary-600" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">{placeholder}</p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files here, or{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
          </div>

          {acceptedTypes[0] !== '*/*' && (
            <p className="text-xs text-gray-400">
              Accepted types: {acceptedTypes.join(', ')}
            </p>
          )}
          
          {maxSize && (
            <p className="text-xs text-gray-400">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{fileName}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((doc) => {
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
                       onClick={() => removeFile(doc.id)}
                       className="p-1 hover:bg-gray-100 rounded"
                       aria-label={`Remove ${doc.name}`}
                       title={`Remove ${doc.name}`}
                     >
                       <X className="w-4 h-4 text-gray-400" />
                     </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isUploading && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Uploading files...</span>
        </div>
      )}
    </div>
  );
};

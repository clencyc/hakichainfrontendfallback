import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
  url?: string;
  bounty_id?: string;
  milestone_id?: string;
  bounty?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
}

interface UploadOptions {
  bountyId?: string;
  milestoneId?: string;
  onProgress?: (fileName: string, progress: number) => void;
}

export const useDocumentManagement = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's documents
  const loadDocuments = async (filters?: {
    bountyId?: string;
    milestoneId?: string;
    type?: string;
  }) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
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

      if (filters?.bountyId) {
        query = query.eq('bounty_id', filters.bountyId);
      }

      if (filters?.milestoneId) {
        query = query.eq('milestone_id', filters.milestoneId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

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
      setError('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload documents
  const uploadDocuments = async (files: FileList, options?: UploadOptions) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const uploadedDocs: Document[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      try {
        options?.onProgress?.(file.name, 0);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        options?.onProgress?.(file.name, 50);

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
            bounty_id: options?.bountyId || null,
            milestone_id: options?.milestoneId || null,
          })
          .select()
          .single();

        if (docError) throw docError;

        options?.onProgress?.(file.name, 100);

        const document: Document = {
          ...docData,
          url: urlData.publicUrl
        };

        uploadedDocs.push(document);

      } catch (error) {
        console.error('Error uploading document:', error);
        errors.push(`Failed to upload ${file.name}`);
      }
    }

    // Refresh documents list
    await loadDocuments();

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return uploadedDocs;
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    try {
      setError(null);

      // Get document path first
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('path')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      if (doc?.path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([doc.path]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== documentId));

      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
      return false;
    }
  };

  // Download document
  const downloadDocument = async (document: Document) => {
    try {
      if (!document.url) {
        throw new Error('Document URL not available');
      }

      const response = await fetch(document.url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
      return false;
    }
  };

  // Get document by ID
  const getDocument = async (documentId: string): Promise<Document | null> => {
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
        .eq('id', documentId)
        .single();

      if (error) throw error;

      if (data) {
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(data.path);

        return {
          ...data,
          url: urlData.publicUrl
        };
      }

      return null;
    } catch (err) {
      console.error('Error getting document:', err);
      setError('Failed to get document');
      return null;
    }
  };

  // Search documents
  const searchDocuments = async (searchTerm: string, filters?: {
    bountyId?: string;
    milestoneId?: string;
    type?: string;
  }) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
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
        .ilike('name', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (filters?.bountyId) {
        query = query.eq('bounty_id', filters.bountyId);
      }

      if (filters?.milestoneId) {
        query = query.eq('milestone_id', filters.milestoneId);
      }

      if (filters?.type) {
        query = query.ilike('type', `${filters.type}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

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
      console.error('Error searching documents:', err);
      setError('Failed to search documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Update document metadata
  const updateDocument = async (documentId: string, updates: {
    name?: string;
    bounty_id?: string;
    milestone_id?: string;
  }) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId ? { ...doc, ...data } : doc
        )
      );

      return data;
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document');
      return null;
    }
  };

  // Load documents on mount
  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user]);

  return {
    documents,
    isLoading,
    error,
    loadDocuments,
    uploadDocuments,
    deleteDocument,
    downloadDocument,
    getDocument,
    searchDocuments,
    updateDocument,
  };
};

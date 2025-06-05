import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Upload,
  FileText,
  ArrowRight,
  Download,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { cn } from '../../utils/cn';
import { useToast } from '../../components/common/Toaster';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in-review' | 'completed';
  proofRequired: string;
  proofSubmitted?: {
    documentHash: string;
    timestamp: string;
    url: string;
  };
}

interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  createdAt: string;
  milestoneId?: string;
}

interface Case {
  id: string;
  bounty: {
    id: string;
    title: string;
    category: string;
    location: string;
    due_date: string;
    total_amount: number;
    status: string;
  };
  status: string;
  priority: 'high' | 'medium' | 'low';
  billable_hours: number;
  milestones: Milestone[];
  documents: Document[];
  last_activity: string;
}

export const LawyerCases = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data: casesData, error: casesError } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            bounties (
              id,
              title,
              category,
              location,
              due_date,
              total_amount,
              status
            ),
            milestones (
              id,
              title,
              description,
              amount,
              due_date,
              status,
              proof_required,
              proof_submitted
            ),
            documents (
              id,
              name,
              path,
              size,
              type,
              created_at,
              milestone_id
            )
          `)
          .eq('lawyer_id', user?.id);

        if (casesError) throw casesError;

        // Transform the data
        const transformedCases = (casesData || []).map(c => ({
          id: c.id,
          bounty: c.bounties,
          status: c.status,
          priority: determinePriority(c.bounties.due_date),
          billable_hours: c.billable_hours || 0,
          milestones: c.milestones || [],
          documents: c.documents || [],
          last_activity: new Date().toISOString(),
        }));

        setCases(transformedCases);
      } catch (err) {
        console.error('Error loading cases:', err);
        showToast('error', 'Failed to load cases');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadCases();
    }
  }, [user]);

  const determinePriority = (dueDate: string): 'high' | 'medium' | 'low' => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) return 'high';
    if (daysRemaining <= 7) return 'medium';
    return 'low';
  };

  const handleFileUpload = async (file: File, caseId: string, milestoneId?: string) => {
    try {
      setIsUploadingDocument(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${caseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          path: filePath,
          uploaded_by: user?.id,
          case_id: caseId,
          milestone_id: milestoneId,
          size: file.size,
          type: file.type,
        });

      if (dbError) throw dbError;

      // If this is a milestone document, update the milestone status
      if (milestoneId) {
        const { error: milestoneError } = await supabase
          .from('milestones')
          .update({
            status: 'in-review',
            proof_submitted: {
              documentHash: fileName,
              timestamp: new Date().toISOString(),
              url: filePath,
            },
          })
          .eq('id', milestoneId);

        if (milestoneError) throw milestoneError;
      }

      showToast('success', 'Document uploaded successfully');

      // Refresh the case data
      const { data: updatedCase, error: caseError } = await supabase
        .from('lawyer_cases')
        .select(`
          *,
          bounties (*),
          milestones (*),
          documents (*)
        `)
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      setCases(prev => prev.map(c => 
        c.id === caseId ? {
          ...c,
          milestones: updatedCase.milestones || [],
          documents: updatedCase.documents || [],
        } : c
      ));

      if (selectedCase?.id === caseId) {
        setSelectedCase(prev => prev ? {
          ...prev,
          milestones: updatedCase.milestones || [],
          documents: updatedCase.documents || [],
        } : null);
      }

    } catch (error) {
      console.error('Error uploading document:', error);
      showToast('error', 'Failed to upload document');
    } finally {
      setIsUploadingDocument(false);
      setSelectedMilestone(null);
    }
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('case-documents')
        .download(document.path);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading document:', error);
      showToast('error', 'Failed to download document');
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('case-documents')
        .remove([document.path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      // Update local state
      setCases(prev => prev.map(c => ({
        ...c,
        documents: c.documents.filter(d => d.id !== document.id)
      })));

      if (selectedCase) {
        setSelectedCase(prev => prev ? {
          ...prev,
          documents: prev.documents.filter(d => d.id !== document.id)
        } : null);
      }

      showToast('success', 'Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      showToast('error', 'Failed to delete document');
    }
  };

  return (
    <LawyerDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">My Cases</h1>
            <p className="text-lg text-gray-600">Manage your active cases and track progress</p>
          </div>
          <Link to="/bounties" className="btn btn-primary">
            Browse Available Cases
          </Link>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cases..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{caseItem.bounty.title}</h3>
                      <p className="text-gray-600">{caseItem.bounty.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full font-medium",
                        caseItem.priority === 'high' ? 'bg-error-100 text-error-700' :
                        caseItem.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                        'bg-success-100 text-success-700'
                      )}>
                        {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)} Priority
                      </span>
                      <span className="text-accent-600 font-medium">${caseItem.bounty.total_amount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{caseItem.bounty.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Due: {new Date(caseItem.bounty.due_date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{caseItem.billable_hours} hours billed</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">
                        {caseItem.milestones.filter(m => m.status === 'completed').length} of {caseItem.milestones.length} milestones
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500"
                        style={{ 
                          width: `${(caseItem.milestones.filter(m => m.status === 'completed').length / caseItem.milestones.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {cases.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
                  <p className="text-gray-500 mb-4">Start by browsing available bounties</p>
                  <Link to="/bounties" className="btn btn-primary">
                    Browse Available Cases
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCase.bounty.title}</h2>
                    <p className="text-gray-600">{selectedCase.bounty.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Case Progress */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>
                          {Math.round((selectedCase.milestones.filter(m => m.status === 'completed').length / selectedCase.milestones.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500"
                          style={{ 
                            width: `${(selectedCase.milestones.filter(m => m.status === 'completed').length / selectedCase.milestones.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-lg font-semibold">{selectedCase.status}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Hours Billed</p>
                        <p className="text-lg font-semibold">{selectedCase.billable_hours}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="text-lg font-semibold">${selectedCase.bounty.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Milestones</h3>
                  <div className="space-y-4">
                    {selectedCase.milestones.map((milestone) => (
                      <div 
                        key={milestone.id}
                        className={cn(
                          "p-4 rounded-lg border",
                          milestone.status === 'completed' ? 'bg-success-50 border-success-200' :
                          milestone.status === 'in-review' ? 'bg-warning-50 border-warning-200' :
                          'bg-white border-gray-200'
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <span className="text-accent-600 font-medium">${milestone.amount}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          </div>
                          <span className={cn(
                            "px-2 py-1 text-xs rounded-full font-medium",
                            milestone.status === 'completed' ? 'bg-success-100 text-success-700' :
                            milestone.status === 'in-review' ? 'bg-warning-100 text-warning-700' :
                            'bg-gray-100 text-gray-700'
                          )}>
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Required Proof:</strong> {milestone.proofRequired}
                        </div>

                        {milestone.status === 'pending' && (
                          <div className="mt-3">
                            <button
                              onClick={() => setSelectedMilestone(milestone.id)}
                              className="btn btn-primary text-sm py-1.5"
                            >
                              Upload Proof
                            </button>
                          </div>
                        )}

                        {milestone.proofSubmitted && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Proof Submitted</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(milestone.proofSubmitted.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  const doc = selectedCase.documents.find(d => d.milestoneId === milestone.id);
                                  if (doc) handleDownloadDocument(doc);
                                }}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Case Documents</h3>
                  <div className="space-y-4">
                    {selectedCase.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(document.createdAt).toLocaleDateString()} • {(document.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownloadDocument(document)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Download className="w-5 h-5 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(document)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="border border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop files here, or click to select files
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, selectedCase.id, selectedMilestone);
                          }}
                          disabled={isUploadingDocument}
                        />
                        <button
                          type="button"
                          onClick={() => document.querySelector('input[type="file"]')?.click()}
                          className="btn btn-outline text-sm py-1.5"
                          disabled={isUploadingDocument}
                        >
                          {isUploadingDocument ? 'Uploading...' : 'Upload Document'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                  <button className="btn btn-primary">
                    Update Case
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
};
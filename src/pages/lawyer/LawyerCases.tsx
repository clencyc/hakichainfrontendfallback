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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { cn } from '../../utils/cn';
import { useToast } from '../../components/common/Toaster';

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
  milestones_completed: number;
  total_milestones: number;
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

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data, error } = await supabase
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
            )
          `)
          .eq('lawyer_id', user?.id);

        if (error) throw error;

        // Transform and add mock data for demo
        const transformedCases = (data || []).map(c => ({
          id: c.id,
          bounty: c.bounties,
          status: c.status,
          priority: determinePriority(c.bounties.due_date),
          billable_hours: c.billable_hours,
          milestones_completed: 2, // Mock data
          total_milestones: 4, // Mock data
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

  const handleFileUpload = async (file: File, caseId: string) => {
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
          size: file.size,
          type: file.type,
        });

      if (dbError) throw dbError;

      showToast('success', 'Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      showToast('error', 'Failed to upload document');
    } finally {
      setIsUploadingDocument(false);
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
                        {caseItem.milestones_completed} of {caseItem.total_milestones} milestones
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500"
                        style={{ 
                          width: `${(caseItem.milestones_completed / caseItem.total_milestones) * 100}%` 
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
                        <span>{Math.round((selectedCase.milestones_completed / selectedCase.total_milestones) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500"
                          style={{ 
                            width: `${(selectedCase.milestones_completed / selectedCase.total_milestones) * 100}%` 
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

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Documents</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="font-medium">Initial Filing.pdf</span>
                        </div>
                        <span className="text-sm text-gray-500">Uploaded 2 days ago</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">2.3 MB</span>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>

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
                            if (file) handleFileUpload(file, selectedCase.id);
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

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Milestones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-success-50 border border-success-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3" />
                      <div>
                        <p className="font-medium">Initial Documentation</p>
                        <p className="text-sm text-gray-600">Completed on March 15, 2025</p>
                      </div>
                      <span className="ml-auto text-success-600 font-medium">$500</span>
                    </div>

                    <div className="flex items-center p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <Clock className="w-5 h-5 text-primary-500 mr-3" />
                      <div>
                        <p className="font-medium">Court Appearance</p>
                        <p className="text-sm text-gray-600">Due on March 30, 2025</p>
                      </div>
                      <span className="ml-auto text-primary-600 font-medium">$800</span>
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
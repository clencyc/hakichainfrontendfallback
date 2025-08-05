import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, Eye, FileText, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

interface Case {
  id: string;
  status: 'applied' | 'in_review' | 'accepted' | 'rejected';
  application_date: string;
  bounty: {
    id: string;
    title: string;
    category: string;
    location: string;
    due_date: string;
    total_amount: number;
    description: string;
    required_skills: string[];
    ngo_name: string;
    status: string;
  };
}

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  case: Case | null;
}

const CaseDetailModal = ({ isOpen, onClose, case: selectedCase }: CaseDetailModalProps) => {
  if (!isOpen || !selectedCase) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCase.bounty.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedCase.bounty.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(selectedCase.bounty.due_date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${selectedCase.bounty.total_amount.toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{selectedCase.bounty.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCase.bounty.required_skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NGO Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{selectedCase.bounty.ngo_name}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCase.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                    selectedCase.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                    selectedCase.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-700">Applied on:</span>
                  <span className="text-gray-900">{new Date(selectedCase.application_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCases();
  }, [user]);

  const loadCases = async () => {
    try {
      // Mock data for demonstration
      const mockCases: Case[] = [
        {
          id: '1',
          status: 'applied',
          application_date: '2025-01-15T00:00:00.000Z',
          bounty: {
            id: 'b1',
            title: 'Domestic Violence Protection Case',
            category: 'Family Law',
            location: 'Nairobi, Kenya',
            due_date: '2025-03-15T00:00:00.000Z',
            total_amount: 2500,
            description: 'Seeking legal representation for a domestic violence case involving protective orders and child custody arrangements. The case requires expertise in family law and experience with domestic violence proceedings.',
            required_skills: ['Family Law', 'Domestic Violence', 'Child Custody', 'Court Representation'],
            ngo_name: 'Women\'s Rights Foundation',
            status: 'open'
          }
        },
        {
          id: '2',
          status: 'in_review',
          application_date: '2025-01-10T00:00:00.000Z',
          bounty: {
            id: 'b2',
            title: 'Land Rights Dispute Resolution',
            category: 'Property Law',
            location: 'Kisumu, Kenya',
            due_date: '2025-04-20T00:00:00.000Z',
            total_amount: 3200,
            description: 'Community land rights dispute involving multiple families and a development company. Requires expertise in property law, land rights, and community mediation.',
            required_skills: ['Property Law', 'Land Rights', 'Mediation', 'Community Law'],
            ngo_name: 'Community Land Rights Initiative',
            status: 'open'
          }
        },
        {
          id: '3',
          status: 'accepted',
          application_date: '2025-01-08T00:00:00.000Z',
          bounty: {
            id: 'b3',
            title: 'Small Business Legal Support',
            category: 'Business Law',
            location: 'Mombasa, Kenya',
            due_date: '2025-02-28T00:00:00.000Z',
            total_amount: 1800,
            description: 'Legal support for small businesses affected by regulatory changes. Includes contract review, compliance guidance, and business registration assistance.',
            required_skills: ['Business Law', 'Contract Law', 'Regulatory Compliance', 'Business Registration'],
            ngo_name: 'Small Business Development Center',
            status: 'active'
          }
        },
        {
          id: '4',
          status: 'applied',
          application_date: '2025-01-12T00:00:00.000Z',
          bounty: {
            id: 'b4',
            title: 'Immigration Legal Aid',
            category: 'Immigration Law',
            location: 'Nairobi, Kenya',
            due_date: '2025-05-10T00:00:00.000Z',
            total_amount: 2200,
            description: 'Immigration legal aid for refugees and asylum seekers. Includes application assistance, document preparation, and court representation.',
            required_skills: ['Immigration Law', 'Refugee Law', 'Document Preparation', 'Court Representation'],
            ngo_name: 'Refugee Support Network',
            status: 'open'
          }
        },
        {
          id: '5',
          status: 'rejected',
          application_date: '2025-01-05T00:00:00.000Z',
          bounty: {
            id: 'b5',
            title: 'Environmental Protection Case',
            category: 'Environmental Law',
            location: 'Nakuru, Kenya',
            due_date: '2025-03-30T00:00:00.000Z',
            total_amount: 4000,
            description: 'Environmental protection case against industrial pollution affecting local water sources. Requires expertise in environmental law and regulatory enforcement.',
            required_skills: ['Environmental Law', 'Regulatory Law', 'Litigation', 'Environmental Science'],
            ngo_name: 'Green Earth Initiative',
            status: 'closed'
          }
        }
      ];

      setCases(mockCases);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.bounty.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.bounty.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewCase = (case_: Case) => {
    setSelectedCase(case_);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusStats = () => {
    return {
      applied: cases.filter(c => c.status === 'applied').length,
      in_review: cases.filter(c => c.status === 'in_review').length,
      accepted: cases.filter(c => c.status === 'accepted').length,
      rejected: cases.filter(c => c.status === 'rejected').length,
    };
  };

  const stats = getStatusStats();

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">My Cases</h1>
                <p className="text-lg text-gray-600">Track your case applications and assignments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.in_review}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="in_review">In Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredCases.map((case_) => (
              <motion.div
                key={case_.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleViewCase(case_)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{case_.bounty.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{case_.bounty.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(case_.status)}`}>
                    {case_.status.charAt(0).toUpperCase() + case_.status.slice(1).replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{case_.bounty.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due: {new Date(case_.bounty.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${case_.bounty.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {case_.bounty.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCase(case_);
                    }}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCases.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'You haven\'t applied to any cases yet'
              }
            </p>
          </div>
        )}

        {/* Case Detail Modal */}
        <AnimatePresence>
          <CaseDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            case={selectedCase}
          />
        </AnimatePresence>
      </div>
    </LawyerDashboardLayout>
  );
};

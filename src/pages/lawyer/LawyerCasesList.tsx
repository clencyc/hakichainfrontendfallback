import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

interface Case {
  id: string;
  status: 'applied' | 'in_review' | 'accepted' | 'rejected';
  application_date: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  progress?: number;
  estimated_hours?: number;
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

export const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
          priority: 'critical',
          progress: 25,
          estimated_hours: 80,
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
          priority: 'high',
          progress: 50,
          estimated_hours: 120,
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
          priority: 'medium',
          progress: 75,
          estimated_hours: 60,
          bounty: {
            id: 'b3',
            title: 'Small Business Legal Support',
            category: 'Commercial Law',
            location: 'Mombasa, Kenya',
            due_date: '2025-02-28T00:00:00.000Z',
            total_amount: 1800,
            description: 'Legal support for small business owners dealing with contract disputes and regulatory compliance issues.',
            required_skills: ['Commercial Law', 'Contract Law', 'Business Compliance'],
            ngo_name: 'Entrepreneur Support Network',
            status: 'active'
          }
        },
        {
          id: '4',
          status: 'rejected',
          application_date: '2025-01-05T00:00:00.000Z',
          priority: 'low',
          progress: 0,
          estimated_hours: 40,
          bounty: {
            id: 'b4',
            title: 'Immigration Rights Defense',
            category: 'Immigration Law',
            location: 'Eldoret, Kenya',
            due_date: '2025-03-30T00:00:00.000Z',
            total_amount: 2800,
            description: 'Defense for immigrants facing deportation proceedings and assistance with asylum applications.',
            required_skills: ['Immigration Law', 'Asylum Procedures', 'Human Rights'],
            ngo_name: 'Immigration Justice Coalition',
            status: 'closed'
          }
        },
        {
          id: '5',
          status: 'applied',
          application_date: '2025-01-12T00:00:00.000Z',
          priority: 'high',
          progress: 15,
          estimated_hours: 100,
          bounty: {
            id: 'b5',
            title: 'Environmental Protection Case',
            category: 'Environmental Law',
            location: 'Nakuru, Kenya',
            due_date: '2025-05-15T00:00:00.000Z',
            total_amount: 3500,
            description: 'Legal action against industrial pollution affecting local communities and water sources.',
            required_skills: ['Environmental Law', 'Public Interest Law', 'Community Advocacy'],
            ngo_name: 'Green Earth Initiative',
            status: 'open'
          }
        },
        {
          id: '6',
          status: 'in_review',
          application_date: '2025-01-18T00:00:00.000Z',
          priority: 'medium',
          progress: 30,
          estimated_hours: 85,
          bounty: {
            id: 'b6',
            title: 'Youth Legal Aid Program',
            category: 'Criminal Law',
            location: 'Thika, Kenya',
            due_date: '2025-04-10T00:00:00.000Z',
            total_amount: 2200,
            description: 'Providing legal representation for youth offenders and advocacy for juvenile justice reform.',
            required_skills: ['Criminal Law', 'Juvenile Justice', 'Social Work', 'Court Advocacy'],
            ngo_name: 'Youth Justice Initiative',
            status: 'open'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit' 
    });
    const daysLeft = getDaysUntilDue(dueDate);
    
    if (daysLeft < 0) {
      return `${formattedDate} (${Math.abs(daysLeft)} days overdue)`;
    } else if (daysLeft === 0) {
      return `${formattedDate} (Due today)`;
    } else {
      return `${formattedDate} (${daysLeft} days left)`;
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

        {/* Cases Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-600">
              <div>CASE TITLE</div>
              <div>TYPE</div>
              <div>STATUS</div>
              <div>PRIORITY</div>
              <div>PROGRESS</div>
              <div>DUE DATE</div>
              <div>HOURS</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredCases.map((case_) => (
                <motion.div
                  key={case_.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <Link 
                    to={`/lawyer/cases/${case_.id}`}
                    className="block p-6"
                  >
                    <div className="grid grid-cols-7 gap-4 items-center">
                      {/* Case Title */}
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate">
                          {case_.bounty.title}
                        </h3>
                      </div>

                      {/* Type */}
                      <div className="text-sm text-gray-900">
                        {case_.bounty.category}
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                          {case_.status.charAt(0).toUpperCase() + case_.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>

                      {/* Priority */}
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(case_.priority)}`}>
                          {case_.priority ? case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1) : 'Medium'}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="min-w-0">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${case_.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 min-w-0">
                            {case_.progress || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-xs">
                            {formatDueDate(case_.bounty.due_date)}
                          </span>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{case_.estimated_hours || 0}h</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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
      </div>
    </LawyerDashboardLayout>
  );
};

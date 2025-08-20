import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Calendar,
  GavelIcon,
  Award,
  Star,
  HelpCircle,
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import AutomatedReminderDashboard from '../../components/common/AutomatedReminderDashboard';
import HakiLensComprehensiveUI from '../../components/hakilens/HakiLensComprehensiveUI';

export default function LawyerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>({
    activeCases: [], // Fix: should be an array, not a number
    completedCases: 45,
    totalEarnings: 25000,
    rating: 4.8,
    applications: [],
    matchingBounties: []
  });
  const [showTourPrompt, setShowTourPrompt] = useState(false);

  // Helper functions for table formatting
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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user has seen tour before
        const hasSeenTour = localStorage.getItem('hakichain-tour-completed');
        if (!hasSeenTour) {
          setTimeout(() => setShowTourPrompt(true), 2000); // Show after 2 seconds
        }

        // Load active cases
        const { data: cases, error: casesError } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            bounties (
              id,
              title,
              category,
              location,
              due_date,
              total_amount
            )
          `)
          .eq('lawyer_id', user?.id)
          .eq('status', 'active');

        if (casesError) throw casesError;

        // Load matching bounties
        const { data: matches, error: matchesError } = await supabase
          .rpc('get_matching_lawyers', { bounty_id: null, limit_count: 3 });

        if (matchesError) throw matchesError;

        // --- Inject fake bounties for demo/testing ---
        const fakeCases = [
          {
            id: 'fake-1',
            bounty_id: 'bounty-fake-1',
            status: 'active',
            priority: 'high',
            progress: 75,
            estimated_hours: 60,
            bounties: {
              id: 'bounty-fake-1',
              title: 'Domestic Violence Protection',
              category: 'Family Law',
              location: 'Mombasa, Kenya',
              due_date: '2025-02-28T00:00:00.000Z',
              total_amount: 1800,
            },
          },
          {
            id: 'fake-2',
            bounty_id: 'bounty-fake-2',
            status: 'active',
            priority: 'critical',
            progress: 45,
            estimated_hours: 80,
            bounties: {
              id: 'bounty-fake-2',
              title: 'Land Rights Dispute',
              category: 'Property Law',
              location: 'Kisumu, Kenya',
              due_date: '2025-03-15T00:00:00.000Z',
              total_amount: 2500,
            },
          },
          {
            id: 'fake-3',
            bounty_id: 'bounty-fake-3',
            status: 'active',
            priority: 'medium',
            progress: 90,
            estimated_hours: 40,
            bounties: {
              id: 'bounty-fake-3',
              title: 'Small Business Legal Support',
              category: 'Commercial Law',
              location: 'Nairobi, Kenya',
              due_date: '2025-02-20T00:00:00.000Z',
              total_amount: 1200,
            },
          },
        ];
        // --- End fake bounties ---

        setData((prev: any) => ({
          ...prev,
          activeCases: [...(cases || []), ...fakeCases],
          matchingBounties: matches || []
        }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  return (
    <LawyerDashboardLayout>
      <div className="max-w-[1600px] mx-auto mt-20">
        {/* Tour Prompt */}
        {showTourPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4 rounded-xl shadow-lg max-w-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <HelpCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Welcome to HakiChain! 🎉</h3>
                  <p className="text-sm text-teal-100 mb-3">Take a quick tour to discover all the powerful features of your legal dashboard.</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const tourBtn = document.querySelector('[data-tour="logo"]')?.closest('aside')?.querySelector('button[data-tour-trigger]') as HTMLButtonElement;
                        if (tourBtn) tourBtn.click();
                        setShowTourPrompt(false);
                        localStorage.setItem('hakichain-tour-completed', 'true');
                      }}
                      className="bg-white text-teal-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
                    >
                      Start Tour
                    </button>
                    <button
                      onClick={() => {
                        setShowTourPrompt(false);
                        localStorage.setItem('hakichain-tour-completed', 'true');
                      }}
                      className="text-teal-100 hover:text-white text-sm"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTourPrompt(false)}
                className="text-teal-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-lg text-gray-600">Here's an overview of your cases and performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-primary-100 p-3 mr-3">
                <GavelIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Cases</p>
                <p className="text-2xl font-bold">{Array.isArray(data.activeCases) ? data.activeCases.length : 0}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Managing {Array.isArray(data.activeCases) ? data.activeCases.length : 0} cases</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-success-100 p-3 mr-3">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{data.successRate}%</p>
              </div>
            </div>
            <p className="text-sm text-success-600">+5% from average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-accent-100 p-3 mr-3">
                <Star className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-2xl font-bold">{data.rating}/5.0</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Top 10% of lawyers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-secondary-100 p-3 mr-3">
                <DollarSign className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">${data.totalEarnings}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">+12.5% from last month</p>
          </motion.div>
        </div>

        {/* Automated Reminder Dashboard */}
        <div className="mb-6">
          <AutomatedReminderDashboard />
        </div>

        {/* ...removed HakiLensComprehensiveUI (deep research) from dashboard overview... */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Active Cases</h2>
                  <Link 
                    to="/lawyer/cases" 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {/* Cases Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
                      <div>CASE TITLE</div>
                      <div>TYPE</div>
                      <div>PRIORITY</div>
                      <div>PROGRESS</div>
                      <div>DUE DATE</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {Array.isArray(data.activeCases) && data.activeCases.map((caseItem: any) => (
                      <Link
                        key={caseItem.id}
                        to={`/lawyer/cases/${caseItem.id}`}
                        className="block hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="p-4">
                          <div className="grid grid-cols-5 gap-4 items-center">
                            {/* Case Title */}
                            <div className="min-w-0">
                              <h3 className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate">
                                {caseItem.bounties?.title}
                              </h3>
                            </div>

                            {/* Type */}
                            <div className="text-sm text-gray-900">
                              {caseItem.bounties?.category}
                            </div>

                            {/* Priority */}
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(caseItem.priority)}`}>
                                {caseItem.priority ? caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1) : 'Medium'}
                              </span>
                            </div>

                            {/* Progress */}
                            <div className="min-w-0">
                              <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${caseItem.progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600 min-w-0">
                                  {caseItem.progress || 0}%
                                </span>
                              </div>
                            </div>

                            {/* Due Date */}
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                <span className="text-xs">
                                  {formatDueDate(caseItem.bounties?.due_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {(!Array.isArray(data.activeCases) || data.activeCases.length === 0) && (
                  <div className="text-center py-8">
                    <GavelIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No active cases</h3>
                    <p className="text-gray-500 mb-4">Start by browsing available bounties</p>
                    <Link to="/bounties" className="btn btn-primary">
                      Browse Bounties
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <Link 
                    to="/lawyer/cases" 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start p-3 border-l-4 border-success-500 bg-success-50 rounded">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Milestone completed: Initial Documentation</p>
                      <p className="text-sm text-gray-600">Land Rights Case • 2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border-l-4 border-primary-500 bg-primary-50 rounded">
                    <FileText className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">New case assigned: Environmental Justice</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border-l-4 border-accent-500 bg-accent-50 rounded">
                    <Award className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Received 5-star rating</p>
                      <p className="text-sm text-gray-600">Domestic Violence Case • 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Recommended Cases</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.matchingBounties.map((match: any) => (
                    <Link 
                      key={match.id}
                      to={`/bounties/${match.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{match.title}</h3>
                        <span className="text-sm text-primary-600">{Math.round(match.matching_score)}% match</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Perfect match for your expertise in {match.specializations?.join(', ')}
                      </p>
                      <span className="text-primary-600 text-sm">View Details →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Application Status</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.applications.map((app: any) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{app.bountyTitle}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          app.status === 'accepted' 
                            ? 'bg-success-100 text-success-700'
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{app.ngo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
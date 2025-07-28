import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar,
  GavelIcon,
  Award,
  Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

export const LawyerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    activeCases: [],
    matchingBounties: [],
    totalEarnings: 15900,
    successRate: 92,
    rating: 4.8,
    applications: [
      { id: 1, status: 'accepted', bountyTitle: 'Land Rights Case', ngo: 'Justice Africa' },
      { id: 2, status: 'pending', bountyTitle: 'Environmental Justice', ngo: 'EcoRights Kenya' }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
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
            bounties: {
              id: 'bounty-fake-1',
              title: 'Domestic Violence Protection',
              category: 'Family Law',
              location: 'Mombasa, Kenya',
              due_date: '2025-05-15T00:00:00.000Z',
              total_amount: 1800,
            },
            status: 'active',
          },
          {
            id: 'fake-2',
            bounty_id: 'bounty-fake-2',
            bounties: {
              id: 'bounty-fake-2',
              title: 'Land Rights Dispute',
              category: 'Property Law',
              location: 'Kisumu, Kenya',
              due_date: '2025-05-20T00:00:00.000Z',
              total_amount: 2500,
            },
            status: 'active',
          },
        ];
        // --- End fake bounties ---

        setData(prev => ({
          ...prev,
          activeCases: [...(cases as any[] || []), ...fakeCases],
          matchingBounties: matches as any[] || []
        }));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  return (
    <LawyerDashboardLayout>
      <div className="max-w-[1600px] mx-auto mt-20">
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
                <p className="text-2xl font-bold">{data.activeCases.length}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Managing {data.activeCases.length} cases</p>
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
                <div className="space-y-4">
                  {data.activeCases.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      to={`/bounties/${caseItem.bounty_id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{caseItem.bounties?.title}</h3>
                          <p className="text-sm text-gray-600">{caseItem.bounties?.category}</p>
                        </div>
                        <span className="text-accent-600 font-medium">${caseItem.bounties?.total_amount}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{caseItem.bounties?.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Due: {new Date(caseItem.bounties?.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {data.activeCases.length === 0 && (
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
                  {data.matchingBounties.map((match) => (
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
                  {data.applications.map((app) => (
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
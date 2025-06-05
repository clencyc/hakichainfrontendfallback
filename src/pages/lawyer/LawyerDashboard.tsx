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
  Award
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

export const LawyerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    activeCases: [],
    upcomingEvents: [],
    totalEarnings: 0,
    completedCases: 0,
    rating: 4.8,
    successRate: 92
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load active cases
        const { data: bounties, error: bountiesError } = await supabase
          .from('bounties')
          .select(`
            *,
            milestones (*)
          `)
          .eq('assigned_lawyer_id', user?.id)
          .eq('status', 'in-progress');

        if (bountiesError) throw bountiesError;

        // Load upcoming events
        const { data: events, error: eventsError } = await supabase
          .from('case_events')
          .select(`
            *,
            lawyer_cases!inner(
              bounty_id,
              lawyer_id
            )
          `)
          .eq('lawyer_cases.lawyer_id', user?.id)
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(5);

        if (eventsError) throw eventsError;

        setData({
          activeCases: bounties || [],
          upcomingEvents: events || [],
          totalEarnings: 15900, // Mock data
          completedCases: 24,
          rating: 4.8,
          successRate: 92
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <LawyerDashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  return (
    <LawyerDashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-lg text-gray-600">Here's an overview of your cases and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card bg-white p-6"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-primary-100 p-3 mr-3">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">${data.totalEarnings}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">+12.5% from last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card bg-white p-6"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-secondary-100 p-3 mr-3">
                <GavelIcon className="h-6 w-6 text-secondary-600" />
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
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card bg-white p-6"
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
            transition={{ duration: 0.4, delay: 0.4 }}
            className="card bg-white p-6"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-accent-100 p-3 mr-3">
                <Award className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-2xl font-bold">{data.rating}/5.0</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Top 10% of lawyers</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Active Cases</h2>
                <Link 
                  to="/lawyer/cases" 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {data.activeCases.map((bounty) => (
                  <Link
                    key={bounty.id}
                    to={`/bounties/${bounty.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{bounty.title}</h3>
                        <p className="text-sm text-gray-600">{bounty.category}</p>
                      </div>
                      <span className="text-accent-600 font-medium">${bounty.total_amount}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{bounty.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Due: {new Date(bounty.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {bounty.milestones.filter(m => m.status === 'completed').length} of {bounty.milestones.length} milestones completed
                      </span>
                      <span className="text-primary-600">View Details →</span>
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

            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <Link 
                  to="/lawyer/activity" 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

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

          <div>
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                {data.upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.event_type === 'hearing' ? 'bg-primary-100 text-primary-700' :
                        event.event_type === 'meeting' ? 'bg-secondary-100 text-secondary-700' :
                        event.event_type === 'deadline' ? 'bg-error-100 text-error-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    {event.location && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                ))}

                {data.upcomingEvents.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-6">Performance Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Case Completion Rate</span>
                    <span className="text-sm font-medium">{data.successRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success-500"
                      style={{ width: `${data.successRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <span className="text-sm font-medium">{data.rating}/5.0</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500"
                      style={{ width: `${(data.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-500"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                </div>

                <Link
                  to="/lawyer/analytics"
                  className="btn btn-outline w-full justify-center"
                >
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
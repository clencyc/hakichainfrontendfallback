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
  Star,
  Bell,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGODashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    bounties: [],
    donations: [],
    applications: [],
    notifications: [],
    totalRaised: 0,
    activeBounties: 0,
    totalDonors: 0,
    successRate: 92
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load bounties
        const { data: bounties, error: bountiesError } = await supabase
          .from('bounties')
          .select(`
            *,
            milestones (
              id,
              title,
              status
            ),
            donations (
              id,
              amount,
              donor_id,
              created_at
            ),
            lawyer_applications (
              id,
              lawyer_id,
              status,
              created_at,
              users:lawyer_id (
                name,
                avatar_url,
                specializations
              )
            )
          `)
          .eq('ngo_id', user?.id);

        if (bountiesError) throw bountiesError;

        // Calculate statistics
        const totalRaised = bounties?.reduce((acc, b) => acc + b.raised_amount, 0) || 0;
        const activeBounties = bounties?.filter(b => b.status === 'open' || b.status === 'in-progress').length || 0;
        const uniqueDonors = new Set(bounties?.flatMap(b => b.donations?.map(d => d.donor_id)) || []);

        setData({
          bounties: bounties || [],
          donations: bounties?.flatMap(b => b.donations || []) || [],
          applications: bounties?.flatMap(b => b.lawyer_applications || []) || [],
          notifications: generateNotifications(bounties || []),
          totalRaised,
          activeBounties,
          totalDonors: uniqueDonors.size,
          successRate: 92
        });
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

  const generateNotifications = (bounties) => {
    const notifications = [];
    
    // Add notifications for recent donations
    bounties.forEach(bounty => {
      bounty.donations?.forEach(donation => {
        if (isRecent(donation.created_at)) {
          notifications.push({
            id: donation.id,
            type: 'donation',
            message: `New donation of $${donation.amount} received for "${bounty.title}"`,
            timestamp: donation.created_at
          });
        }
      });

      // Add notifications for lawyer applications
      bounty.lawyer_applications?.forEach(app => {
        if (isRecent(app.created_at)) {
          notifications.push({
            id: app.id,
            type: 'application',
            message: `New lawyer application from ${app.users.name} for "${bounty.title}"`,
            timestamp: app.created_at
          });
        }
      });

      // Add notifications for milestone updates
      bounty.milestones?.forEach(milestone => {
        if (milestone.status === 'in-review') {
          notifications.push({
            id: milestone.id,
            type: 'milestone',
            message: `Milestone "${milestone.title}" ready for review in "${bounty.title}"`,
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const isRecent = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000; // Within last 7 days
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-lg text-gray-600">Here's what's happening with your legal bounties</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-primary-100 p-3 mr-3">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold">${data.totalRaised}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">+15% from last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-secondary-100 p-3 mr-3">
                <GavelIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Bounties</p>
                <p className="text-2xl font-bold">{data.activeBounties}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Cases in progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-success-100 p-3 mr-3">
                <Users className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Donors</p>
                <p className="text-2xl font-bold">{data.totalDonors}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Supporting our mission</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-accent-100 p-3 mr-3">
                <CheckCircle className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{data.successRate}%</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Cases completed successfully</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <Link 
                    to="/ngo-analytics" 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`flex items-start p-3 border-l-4 rounded ${
                        notification.type === 'donation'
                          ? 'border-success-500 bg-success-50'
                          : notification.type === 'application'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-warning-500 bg-warning-50'
                      }`}
                    >
                      {notification.type === 'donation' ? (
                        <DollarSign className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : notification.type === 'application' ? (
                        <UserCheck className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning-500 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Active Bounties</h2>
                  <Link 
                    to="/ngo-project-board" 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.bounties
                    .filter(bounty => bounty.status === 'open' || bounty.status === 'in-progress')
                    .slice(0, 3)
                    .map((bounty) => (
                      <div key={bounty.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{bounty.title}</h3>
                            <p className="text-sm text-gray-600">{bounty.category}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            bounty.status === 'in-progress'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-warning-100 text-warning-700'
                          }`}>
                            {bounty.status === 'in-progress' ? 'In Progress' : 'Open'}
                          </span>
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

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Funding Progress</span>
                            <span>${bounty.raised_amount} of ${bounty.total_amount}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500"
                              style={{ width: `${(bounty.raised_amount / bounty.total_amount) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {bounty.milestones?.filter(m => m.status === 'completed').length} of {bounty.milestones?.length} milestones completed
                          </span>
                          <Link 
                            to={`/bounties/${bounty.id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Recent Applications</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.applications
                    .filter(app => app.status === 'pending')
                    .slice(0, 3)
                    .map((app) => (
                      <div key={app.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {app.users.avatar_url ? (
                              <img 
                                src={app.users.avatar_url} 
                                alt={app.users.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-gray-600">
                                {app.users.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{app.users.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {app.users.specializations?.slice(0, 2).map((spec) => (
                                <span 
                                  key={spec}
                                  className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800">
                            Decline
                          </button>
                          <button className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                            Review Application
                          </button>
                        </div>
                      </div>
                    ))}

                  {data.applications.filter(app => app.status === 'pending').length === 0 && (
                    <p className="text-center text-gray-500 py-4">No pending applications</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Recent Donations</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-success-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">${donation.amount}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-success-600 text-sm">Received</span>
                    </div>
                  ))}

                  {data.donations.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No recent donations</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
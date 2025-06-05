import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, Clock, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

const mockData = {
  monthly: [
    { name: 'Jan', earnings: 2100, cases: 3 },
    { name: 'Feb', earnings: 1800, cases: 2 },
    { name: 'Mar', earnings: 2400, cases: 4 },
    { name: 'Apr', earnings: 3200, cases: 5 },
    { name: 'May', earnings: 2800, cases: 3 },
    { name: 'Jun', earnings: 3600, cases: 6 },
  ],
  performance: {
    rating: 4.8,
    completionRate: 92,
    avgResponseTime: '24 hours',
    totalCases: 23,
    successfulCases: 21,
  },
  caseTypes: [
    { type: 'Land Rights', count: 8 },
    { type: 'Human Rights', count: 6 },
    { type: 'Family Law', count: 5 },
    { type: 'Corporate', count: 4 },
  ],
};

export const LawyerAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    completedCases: 0,
    activeApplications: 0,
    averageRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load completed bounties and earnings
        const { data: bountyData, error: bountyError } = await supabase
          .from('bounties')
          .select('*')
          .eq('assigned_lawyer_id', user?.id)
          .eq('status', 'completed');

        if (bountyError) throw bountyError;

        // Load active applications
        const { data: appData, error: appError } = await supabase
          .from('lawyer_applications')
          .select('*')
          .eq('lawyer_id', user?.id)
          .eq('status', 'pending');

        if (appError) throw appError;

        // Load ratings
        const { data: ratingData, error: ratingError } = await supabase
          .from('lawyer_reviews')
          .select('rating')
          .eq('lawyer_id', user?.id);

        if (ratingError) throw ratingError;

        const avgRating = ratingData?.length
          ? ratingData.reduce((acc, curr) => acc + curr.rating, 0) / ratingData.length
          : 0;

        setAnalytics({
          totalEarnings: bountyData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0,
          completedCases: bountyData?.length || 0,
          activeApplications: appData?.length || 0,
          averageRating: avgRating,
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadAnalytics();
    }
  }, [user]);

  return (
    <LawyerDashboardLayout>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-lg text-gray-600">Track your performance and earnings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-2xl font-bold">$15,900</p>
                </div>
              </div>
              <div className="text-sm text-success-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card bg-white p-6"
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-secondary-100 p-3 mr-3">
                  <Users className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Cases</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
              <div className="text-sm text-success-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2 new this month</span>
              </div>
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
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
              <div className="text-sm text-success-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+5% from last month</span>
              </div>
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
                  <p className="text-2xl font-bold">4.8/5.0</p>
                </div>
              </div>
              <div className="text-sm text-success-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+0.2 from last month</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 card"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Earnings Overview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeframe('weekly')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      timeframe === 'weekly'
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimeframe('monthly')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      timeframe === 'monthly'
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeframe('yearly')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      timeframe === 'yearly'
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0D9488" />
                    <YAxis yAxisId="right" orientation="right" stroke="#1E40AF" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="earnings" fill="#0D9488" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="cases" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-bold mb-6">Performance Metrics</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{mockData.performance.rating}/5.0</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(mockData.performance.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{mockData.performance.completionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-success-500 rounded-full"
                      style={{ width: `${mockData.performance.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">{mockData.performance.avgResponseTime}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-accent-500 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Case Type Distribution</h3>
                  {mockData.caseTypes.map((caseType, index) => (
                    <div key={caseType.type} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{caseType.type}</span>
                        <span className="text-sm font-medium">{caseType.count} cases</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${(caseType.count / mockData.performance.totalCases) * 100}%`,
                            backgroundColor: [
                              '#0D9488', '#1E40AF', '#D97706', '#22c55e'
                            ][index % 4]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
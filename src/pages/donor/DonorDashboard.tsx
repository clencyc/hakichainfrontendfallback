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
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            bounties (
              title,
              status,
              ngo_id,
              category
            )
          `)
          .eq('donor_id', user?.id);

        if (error) throw error;
        setDonations(data || []);
      } catch (err) {
        console.error('Error loading donations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDonations();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-lg text-gray-600">Track your contributions and impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Donated</p>
              <p className="text-2xl font-bold">
                ${donations.reduce((acc, d) => acc + d.amount, 0)}
              </p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-secondary-100 p-3 mr-4">
              <Heart className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Bounties Supported</p>
              <p className="text-2xl font-bold">{donations.length}</p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <GavelIcon className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cases Completed</p>
              <p className="text-2xl font-bold">
                {donations.filter(d => d.bounties?.status === 'completed').length}
              </p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-accent-100 p-3 mr-4">
              <Users className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">People Helped</p>
              <p className="text-2xl font-bold">200+</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Contributions</h2>
                <Link 
                  to="/donor/contributions" 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{donation.bounties?.title}</h3>
                            <p className="text-sm text-gray-600">{donation.bounties?.category}</p>
                          </div>
                          <span className="text-accent-600 font-medium">${donation.amount}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">No contributions yet</p>
              )}
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Impact Overview</h2>
                <Link 
                  to="/donor/impact" 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Cases by Category</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      donations.reduce((acc, d) => {
                        const category = d.bounties?.category || 'Other';
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count], index) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category}</span>
                          <span>{count} cases</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${(Number(count) / donations.length) * 100}%`,
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

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Impact Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Communities Helped</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Recommended Bounties</h2>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/bounties/1"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <h3 className="font-medium mb-1">Land Rights Case</h3>
                      <p className="text-sm text-gray-600 mb-2">Supporting indigenous community land rights</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">$2,500 needed</span>
                        <span className="text-primary-600">View Details</span>
                      </div>
                    </Link>

                    <Link 
                      to="/bounties/2"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <h3 className="font-medium mb-1">Environmental Justice</h3>
                      <p className="text-sm text-gray-600 mb-2">Fighting industrial pollution impact</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">$3,000 needed</span>
                        <span className="text-primary-600">View Details</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Monthly Impact</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold">${donations.reduce((acc, d) => {
                      const date = new Date(d.created_at);
                      const now = new Date();
                      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                        return acc + d.amount;
                      }
                      return acc;
                    }, 0)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary-500" />
                </div>

                <div className="h-px bg-gray-200"></div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Previous Month</span>
                    <span>$1,200</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Year to Date</span>
                    <span>${donations.reduce((acc, d) => acc + d.amount, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
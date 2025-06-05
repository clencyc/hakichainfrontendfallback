import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Users, Heart, GavelIcon, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const COLORS = ['#0D9488', '#1E40AF', '#D97706', '#22c55e'];

export const NGOAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    bounties: [],
    donations: [],
    totalRaised: 0,
    totalBounties: 0,
    completedBounties: 0,
    totalDonors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for demonstration
        const mockMonthlyData = [
          { month: 'Jan', amount: 12500, donors: 15 },
          { month: 'Feb', amount: 15000, donors: 18 },
          { month: 'Mar', amount: 18500, donors: 22 },
          { month: 'Apr', amount: 22000, donors: 25 },
          { month: 'May', amount: 25000, donors: 28 },
          { month: 'Jun', amount: 28000, donors: 32 },
        ];

        const mockCategoryData = [
          { name: 'Land Rights', value: 35000 },
          { name: 'Human Rights', value: 28000 },
          { name: 'Environmental', value: 22000 },
          { name: 'Family Law', value: 18000 },
        ];

        const mockDonorRetention = [
          { month: 'Jan', 'New Donors': 8, 'Returning Donors': 7 },
          { month: 'Feb', 'New Donors': 10, 'Returning Donors': 8 },
          { month: 'Mar', 'New Donors': 12, 'Returning Donors': 10 },
          { month: 'Apr', 'New Donors': 15, 'Returning Donors': 10 },
          { month: 'May', 'New Donors': 16, 'Returning Donors': 12 },
          { month: 'Jun', 'New Donors': 18, 'Returning Donors': 14 },
        ];

        const mockMilestoneData = [
          { month: 'Jan', completed: 5, total: 8 },
          { month: 'Feb', completed: 7, total: 10 },
          { month: 'Mar', completed: 9, total: 12 },
          { month: 'Apr', completed: 12, total: 15 },
          { month: 'May', completed: 14, total: 16 },
          { month: 'Jun', completed: 16, total: 18 },
        ];

        setData({
          monthlyData: mockMonthlyData,
          categoryData: mockCategoryData,
          donorRetention: mockDonorRetention,
          milestoneData: mockMilestoneData,
          totalRaised: 121000,
          totalBounties: 24,
          completedBounties: 18,
          totalDonors: 140,
        });
      } catch (err) {
        console.error('Error loading analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Impact Analytics</h1>
          <p className="text-lg text-gray-600">Track and measure your organization's impact</p>
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
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold">${data.totalRaised}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Making justice accessible</p>
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
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((data.completedBounties / data.totalBounties) * 100)}%
                </p>
              </div>
            </div>
            <p className="text-sm text-success-600">Cases completed successfully</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card bg-white p-6"
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
            className="card bg-white p-6"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-accent-100 p-3 mr-3">
                <Globe className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Bounties</p>
                <p className="text-2xl font-bold">{data.totalBounties}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Ongoing cases</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6 p-6">Monthly Donations</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#0D9488" radius={[4, 4, 0, 0]} />
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
            <h2 className="text-xl font-bold mb-6 p-6">Impact by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6 p-6">Donor Retention</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.donorRetention}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="New Donors" 
                    stroke="#0D9488" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Returning Donors" 
                    stroke="#1E40AF" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6 p-6">Milestone Completion Rate</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.milestoneData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Completed Milestones"
                    stroke="#0D9488" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="Total Milestones"
                    stroke="#D97706" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6 p-6">Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <GavelIcon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Land Rights Victory</h3>
                  <p className="text-sm text-gray-500">Land Rights</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Successfully secured land rights for 200 indigenous families in Eastern Province.</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary-100 text-secondary-600">
                  <GavelIcon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Environmental Justice</h3>
                  <p className="text-sm text-gray-500">Environmental</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Won compensation for community affected by industrial pollution in Mombasa.</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-100 text-accent-600">
                  <GavelIcon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Family Protection</h3>
                  <p className="text-sm text-gray-500">Family Law</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Provided legal protection for 15 families affected by domestic violence.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
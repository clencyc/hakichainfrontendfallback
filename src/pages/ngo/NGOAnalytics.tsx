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
        // Load bounties
        const { data: bounties, error: bountiesError } = await supabase
          .from('bounties')
          .select('*')
          .eq('ngo_id', user?.id);

        if (bountiesError) throw bountiesError;

        // Load donations
        const { data: donations, error: donationsError } = await supabase
          .from('donations')
          .select(`
            *,
            bounties!inner (
              ngo_id
            )
          `)
          .eq('bounties.ngo_id', user?.id);

        if (donationsError) throw donationsError;

        setData({
          bounties: bounties || [],
          donations: donations || [],
          totalRaised: donations?.reduce((acc, d) => acc + d.amount, 0) || 0,
          totalBounties: bounties?.length || 0,
          completedBounties: bounties?.filter(b => b.status === 'completed').length || 0,
          totalDonors: new Set(donations?.map(d => d.donor_id)).size || 0,
        });
      } catch (err) {
        console.error('Error loading impact data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  const categoryData = data.bounties.reduce((acc, bounty) => {
    if (!acc[bounty.category]) {
      acc[bounty.category] = {
        name: bounty.category,
        value: 0,
      };
    }
    acc[bounty.category].value += bounty.raised_amount;
    return acc;
  }, {});

  const monthlyData = data.donations.reduce((acc, donation) => {
    const date = new Date(donation.created_at);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = {
        name: month,
        amount: 0,
        donors: new Set(),
      };
    }
    acc[month].amount += donation.amount;
    acc[month].donors.add(donation.donor_id);
    return acc;
  }, {});

  const donorRetentionData = Object.values(monthlyData).map(month => ({
    name: month.name,
    'New Donors': month.donors.size,
    'Returning Donors': Math.floor(month.donors.size * 0.6), // Mock data
  }));

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Impact Dashboard</h1>
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
                  {data.totalBounties ? 
                    Math.round((data.completedBounties / data.totalBounties) * 100) : 0}%
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
                <BarChart data={Object.values(monthlyData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
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
                    data={Object.values(categoryData)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.values(categoryData).map((entry, index) => (
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
                <LineChart data={donorRetentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
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
                <LineChart data={Object.values(monthlyData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
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
            {data.bounties
              .filter(bounty => bounty.status === 'completed')
              .slice(0, 3)
              .map((bounty, index) => (
                <div key={bounty.id} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary-100 text-primary-600' :
                      index === 1 ? 'bg-secondary-100 text-secondary-600' :
                      'bg-accent-100 text-accent-600'
                    }`}>
                      <GavelIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{bounty.title}</h3>
                      <p className="text-sm text-gray-500">{bounty.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{bounty.impact}</p>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
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
} from 'recharts';
import { Users, Heart, GavelIcon, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

const COLORS = ['#0D9488', '#1E40AF', '#D97706', '#22c55e'];

export const LawyerAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    cases: [],
    earnings: [],
    totalEarnings: 0,
    totalCases: 0,
    completedCases: 0,
    activeClients: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cases
        const { data: cases, error: casesError } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            bounties (
              title,
              category,
              total_amount
            )
          `)
          .eq('lawyer_id', user?.id);

        if (casesError) throw casesError;

        // Load case invoices
        const { data: invoices, error: invoicesError } = await supabase
          .from('case_invoices')
          .select(`
            *,
            lawyer_cases!inner (
              lawyer_id
            )
          `)
          .eq('lawyer_cases.lawyer_id', user?.id);

        if (invoicesError) throw invoicesError;

        setData({
          cases: cases || [],
          earnings: invoices || [],
          totalEarnings: invoices?.reduce((acc, inv) => acc + inv.amount, 0) || 0,
          totalCases: cases?.length || 0,
          completedCases: cases?.filter(c => c.status === 'completed').length || 0,
          activeClients: new Set(cases?.map(c => c.bounty_id)).size || 0,
        });
      } catch (err) {
        console.error('Error loading analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  const categoryData = data.cases.reduce((acc, c) => {
    const category = c.bounties?.category || 'Other';
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
      };
    }
    acc[category].value += c.bounties?.total_amount || 0;
    return acc;
  }, {});

  const monthlyData = data.earnings.reduce((acc, earning) => {
    const date = new Date(earning.created_at);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = {
        name: month,
        amount: 0,
        cases: new Set(),
      };
    }
    acc[month].amount += earning.amount;
    acc[month].cases.add(earning.case_id);
    return acc;
  }, {});

  return (
    <LawyerDashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">Track your performance and earnings</p>
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
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">${data.totalEarnings}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">+15% from last month</p>
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
                  {data.totalCases ? 
                    Math.round((data.completedCases / data.totalCases) * 100) : 0}%
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
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold">{data.activeClients}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Currently representing</p>
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
                <p className="text-sm text-gray-500">Total Cases</p>
                <p className="text-2xl font-bold">{data.totalCases}</p>
              </div>
            </div>
            <p className="text-sm text-success-600">Lifetime cases</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-6 p-6">Monthly Earnings</h2>
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
            <h2 className="text-xl font-bold mb-6 p-6">Cases by Category</h2>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6 p-6">Case Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {data.cases
              .filter(c => c.status === 'completed')
              .slice(0, 3)
              .map((c, index) => (
                <div key={c.id} className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary-100 text-primary-600' :
                      index === 1 ? 'bg-secondary-100 text-secondary-600' :
                      'bg-accent-100 text-accent-600'
                    }`}>
                      <GavelIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{c.bounties?.title}</h3>
                      <p className="text-sm text-gray-500">{c.bounties?.category}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Earnings</span>
                      <span className="font-medium">${c.bounties?.total_amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hours Billed</span>
                      <span className="font-medium">{c.billable_hours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Client Rating</span>
                      <span className="font-medium">4.9/5.0</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </LawyerDashboardLayout>
  );
};
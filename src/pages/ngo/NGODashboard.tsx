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
import { Bounty } from '../../types';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGODashboard = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const { data, error } = await supabase
          .from('bounties')
          .select('*')
          .eq('ngo_id', user?.id);

        if (error) throw error;
        setBounties(data || []);
      } catch (err) {
        console.error('Error loading bounties:', err);
        setError('Failed to load bounties');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadBounties();
    }
  }, [user]);

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
          <h1 className="text-3xl font-serif font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your legal bounties and track case progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Bounties</p>
              <p className="text-2xl font-bold">{bounties.length}</p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-secondary-100 p-3 mr-4">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Donors</p>
              <p className="text-2xl font-bold">
                {bounties.reduce((acc, b) => acc + (b.donors?.length || 0), 0)}
              </p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Raised</p>
              <p className="text-2xl font-bold">
                ${bounties.reduce((acc, b) => acc + (b.raised_amount || 0), 0)}
              </p>
            </div>
          </div>
          
          <div className="card bg-white flex items-center p-6">
            <div className="rounded-full bg-accent-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
          </div>
        </div>

        {/* Rest of the dashboard content */}
        {/* ... (keeping the existing content) ... */}
      </div>
    </DashboardLayout>
  );
};
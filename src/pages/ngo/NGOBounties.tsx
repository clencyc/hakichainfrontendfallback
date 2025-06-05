import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Bounty } from '../../types';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGOBounties = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');

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
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadBounties();
    }
  }, [user]);

  const filteredBounties = bounties.filter(bounty => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bounty.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Your Bounties</h1>
            <p className="text-lg text-gray-600">Manage and track your legal bounties</p>
          </div>
          <Link to="/create-bounty" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Create New Bounty
          </Link>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bounties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBounties.map(bounty => (
              <Link
                key={bounty.id}
                to={`/bounties/${bounty.id}`}
                className="card hover:shadow-lg transition-all"
              >
                <div className="relative mb-4">
                  <div className="absolute top-0 right-0 bg-accent-500 text-white px-2 py-1 rounded-bl-lg text-sm font-medium">
                    ${bounty.total_amount}
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500"
                      style={{ width: `${(bounty.raised_amount / bounty.total_amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${bounty.raised_amount} raised</span>
                    <span>${bounty.total_amount - bounty.raised_amount} needed</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{bounty.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {bounty.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{bounty.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Due: {new Date(bounty.due_date).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No bounties found</h3>
            <p className="text-gray-500 mb-6">Create your first bounty to get started</p>
            <Link to="/create-bounty" className="btn btn-primary">
              Create New Bounty
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
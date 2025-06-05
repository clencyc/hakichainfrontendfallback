import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGOBounties = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const { data, error } = await supabase
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
              created_at
            )
          `)
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
    const matchesCategory = categoryFilter === 'all' || bounty.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(bounties.map(b => b.category))];

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold">
                  ${bounties.reduce((acc, b) => acc + b.raised_amount, 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-success-600">Across all bounties</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-secondary-100 p-3 mr-3">
                <CheckCircle className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Bounties</p>
                <p className="text-2xl font-bold">
                  {bounties.filter(b => b.status === 'open' || b.status === 'in-progress').length}
                </p>
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
                <p className="text-2xl font-bold">
                  {new Set(bounties.flatMap(b => b.donations?.map(d => d.donor_id))).size}
                </p>
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
                <AlertCircle className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold">
                  {bounties.reduce((acc, b) => 
                    acc + (b.milestones?.filter(m => m.status === 'in-review').length || 0), 
                  0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-success-600">Awaiting your review</p>
          </motion.div>
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
          
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredBounties.length > 0 ? (
            filteredBounties.map((bounty) => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link
                        to={`/bounties/${bounty.id}`}
                        className="text-xl font-bold hover:text-primary-600 transition-colors"
                      >
                        {bounty.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{bounty.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      bounty.status === 'completed' ? 'bg-success-100 text-success-700' :
                      bounty.status === 'in-progress' ? 'bg-primary-100 text-primary-700' :
                      'bg-warning-100 text-warning-700'
                    }`}>
                      {bounty.status.replace('-', ' ').charAt(0).toUpperCase() + bounty.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{bounty.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Due: {new Date(bounty.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
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
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{bounty.donations?.length || 0} donors</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {bounty.milestones?.filter(m => m.status === 'completed').length} of {bounty.milestones?.length} milestones
                        </span>
                      </div>
                    </div>

                    {bounty.lawyer_applications?.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {bounty.lawyer_applications.filter(a => a.status === 'pending').length} pending applications
                          </span>
                          <Link 
                            to={`/bounties/${bounty.id}/applications`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            Review →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-12">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No bounties found</h3>
              <p className="text-gray-500 mb-6">Create your first bounty to get started</p>
              <Link to="/create-bounty" className="btn btn-primary">
                Create New Bounty
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
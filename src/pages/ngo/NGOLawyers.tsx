import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, GavelIcon, Award, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGOLawyers = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const { data, error } = await supabase
          .from('bounties')
          .select(`
            *,
            users!assigned_lawyer_id (
              id,
              name,
              email,
              avatar_url,
              specializations,
              location,
              lsk_number
            ),
            milestones (
              id,
              title,
              status
            )
          `)
          .eq('ngo_id', user?.id)
          .not('assigned_lawyer_id', 'is', null);

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
    const matchesSearch = 
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.users?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || bounty.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(bounties.map(b => b.category))];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Assigned Lawyers</h1>
          <p className="text-lg text-gray-600">Manage and track lawyer performance on your cases</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bounties or lawyers..."
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </div>
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
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {bounty.users?.avatar_url ? (
                        <img 
                          src={bounty.users.avatar_url} 
                          alt={bounty.users.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-medium text-gray-600">
                          {bounty.users?.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{bounty.users?.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">4.8/5.0</span>
                      </div>
                    </div>
                    <Link
                      to={`/lawyers/${bounty.users?.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {bounty.users?.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GavelIcon className="w-4 h-4 mr-2" />
                      LSK: {bounty.users?.lsk_number}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bounty.users?.specializations?.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Assigned Case</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            to={`/bounties/${bounty.id}`}
                            className="font-medium text-primary-600 hover:text-primary-700"
                          >
                            {bounty.title}
                          </Link>
                          <p className="text-sm text-gray-600">{bounty.category}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          bounty.status === 'completed' ? 'bg-success-100 text-success-700' :
                          bounty.status === 'in-progress' ? 'bg-primary-100 text-primary-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {bounty.status.replace('-', ' ').charAt(0).toUpperCase() + bounty.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Due: {new Date(bounty.due_date).toLocaleDateString()}
                        </div>
                        <span className="text-gray-600">
                          {bounty.milestones?.filter(m => m.status === 'completed').length} of {bounty.milestones?.length} milestones
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="lg:col-span-2 text-center py-12">
              <GavelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No assigned lawyers found</h3>
              <p className="text-gray-500 mb-6">Start by assigning lawyers to your bounties</p>
              <Link to="/bounties" className="btn btn-primary">
                View Bounties
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
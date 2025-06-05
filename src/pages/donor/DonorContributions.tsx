import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const DonorContributions = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            bounties (
              title,
              description,
              status,
              category,
              location,
              due_date
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

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.bounties?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.bounties?.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || donation.bounties?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(donations.map(d => d.bounties?.category).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Your Contributions</h1>
          <p className="text-lg text-gray-600">Track all your donations and their impact</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search contributions..."
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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredDonations.length > 0 ? (
          <div className="space-y-6">
            {filteredDonations.map(donation => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <Link 
                      to={`/bounties/${donation.bounty_id}`}
                      className="text-xl font-bold hover:text-primary-600 transition-colors"
                    >
                      {donation.bounties?.title}
                    </Link>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{donation.bounties?.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Donated on: {new Date(donation.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>Amount: ${donation.amount}</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {donation.bounties?.description}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donation.bounties?.status === 'completed'
                        ? 'bg-success-100 text-success-800'
                        : donation.bounties?.status === 'in-progress'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {donation.bounties?.status.charAt(0).toUpperCase() + donation.bounties?.status.slice(1)}
                    </span>
                    
                    <Link
                      to={`/bounties/${donation.bounty_id}`}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No contributions found</h3>
            <p className="text-gray-500 mb-6">Start making a difference by supporting legal cases</p>
            <Link to="/bounties" className="btn btn-primary">
              Browse Bounties
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
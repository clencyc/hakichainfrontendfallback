import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, DollarSign, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NGODonors = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDonors = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            users (
              id,
              name,
              email,
              avatar_url
            ),
            bounties (
              title
            )
          `)
          .eq('bounties.ngo_id', user?.id);

        if (error) throw error;

        // Group donations by donor
        const donorMap = data.reduce((acc, donation) => {
          const donor = donation.users;
          if (!acc[donor.id]) {
            acc[donor.id] = {
              ...donor,
              total_donated: 0,
              donations: [],
            };
          }
          acc[donor.id].total_donated += donation.amount;
          acc[donor.id].donations.push(donation);
          return acc;
        }, {});

        setDonors(Object.values(donorMap));
      } catch (err) {
        console.error('Error loading donors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDonors();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Donor Management</h1>
          <p className="text-lg text-gray-600">Build and maintain relationships with your donors</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {donor.avatar_url ? (
                        <img
                          src={donor.avatar_url}
                          alt={donor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-600">
                          {donor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{donor.name}</h3>
                      <p className="text-gray-600">{donor.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Donated</span>
                      <span className="font-bold text-primary-600">
                        ${donor.total_donated}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Donations</span>
                      <span className="font-bold">
                        {donor.donations.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Donation</span>
                      <span className="text-gray-600">
                        {new Date(donor.donations[0].created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <button className="btn btn-outline flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </button>
                    <button className="btn btn-primary flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Thank
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No donors yet</h3>
            <p className="text-gray-500">Start creating bounties to attract donors</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
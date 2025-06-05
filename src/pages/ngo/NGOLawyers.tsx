import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, GavelIcon, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  location: string;
  specializations: string[];
  rating: number;
  casesCompleted: number;
  activeCases: number;
  successRate: number;
  bounties: {
    id: string;
    title: string;
    status: string;
  }[];
}

export const NGOLawyers = () => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');

  useEffect(() => {
    const loadLawyers = async () => {
      try {
        const { data: assignedLawyers, error: lawyersError } = await supabase
          .from('bounties')
          .select(`
            assigned_lawyer_id,
            users!assigned_lawyer_id (
              id,
              name,
              email,
              location,
              specializations
            )
          `)
          .eq('ngo_id', user?.id)
          .not('assigned_lawyer_id', 'is', null);

        if (lawyersError) throw lawyersError;

        // Transform and deduplicate lawyers
        const uniqueLawyers = Array.from(
          new Map(
            assignedLawyers
              .filter(al => al.users)
              .map(al => [al.users.id, al.users])
          ).values()
        );

        // Add mock performance data
        const lawyersWithStats = uniqueLawyers.map(lawyer => ({
          ...lawyer,
          rating: 4.8,
          casesCompleted: 24,
          activeCases: 3,
          successRate: 92,
          bounties: [
            { id: '1', title: 'Land Rights Case', status: 'in-progress' },
            { id: '2', title: 'Environmental Justice', status: 'completed' }
          ]
        }));

        setLawyers(lawyersWithStats);
      } catch (error) {
        console.error('Error loading lawyers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadLawyers();
    }
  }, [user]);

  const allSpecializations = Array.from(
    new Set(lawyers.flatMap(l => l.specializations || []))
  );

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = 
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = 
      specializationFilter === 'all' ||
      lawyer.specializations?.includes(specializationFilter);
    
    return matchesSearch && matchesSpecialization;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Our Lawyers</h1>
          <p className="text-lg text-gray-600">Manage and track lawyer performance</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search lawyers..."
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
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="all">All Specializations</option>
              {allSpecializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="card bg-white p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-600">
                        {lawyer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg">{lawyer.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{lawyer.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{lawyer.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {lawyer.specializations?.map(spec => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="font-bold">{lawyer.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cases Completed</p>
                      <p className="font-bold">{lawyer.casesCompleted}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Current Cases</h4>
                    <div className="space-y-2">
                      {lawyer.bounties.map(bounty => (
                        <div
                          key={bounty.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{bounty.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            bounty.status === 'completed'
                              ? 'bg-success-100 text-success-700'
                              : 'bg-primary-100 text-primary-700'
                          }`}>
                            {bounty.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="mt-4 btn btn-outline w-full justify-center">
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-12">
              <GavelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No lawyers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
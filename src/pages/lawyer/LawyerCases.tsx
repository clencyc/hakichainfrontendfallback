import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, Tag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

export const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data, error } = await supabase
          .from('bounties')
          .select(`
            *,
            milestones (*),
            lawyer_applications (*)
          `)
          .eq('assigned_lawyer_id', user?.id);

        if (error) throw error;
        setCases(data || []);
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadCases();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <LawyerDashboardLayout>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">My Cases</h1>
            <p className="text-lg text-gray-600">Manage and track your active legal cases</p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Cases</option>
                  <option value="active">Active Cases</option>
                  <option value="completed">Completed Cases</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {cases.map((case_) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{case_.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{case_.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Due: {new Date(case_.due_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${case_.total_amount}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{case_.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/bounties/${case_.id}`}
                    className="mt-4 md:mt-0 btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 line-clamp-2">{case_.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {case_.tags.map((tag) => (
                    <div key={tag} className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Progress:</span>{' '}
                      {case_.milestones.filter(m => m.status === 'completed').length} of {case_.milestones.length} milestones completed
                    </div>
                    <div className="text-sm font-medium text-primary-600">
                      ${case_.milestones.filter(m => m.status === 'completed').reduce((acc, m) => acc + m.amount, 0)} earned
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500"
                      style={{ 
                        width: `${(case_.milestones.filter(m => m.status === 'completed').length / case_.milestones.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}

            {cases.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No cases found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

interface LawyerApplication {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  auth_provider: string;
  bar_number: string;
  specialization: string[];
  years_experience: number;
  law_school: string;
  bio: string;
  hourly_rate: number;
  phone: string;
  address: string;
  languages: string[];
  status: string;
  verification_status: string;
  created_at: string;
}

export function LawyerVerificationPanel() {
  const [applications, setApplications] = useState<LawyerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase.from('lawyers').select('*').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter === 'pending' ? 'pending_verification' : filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch lawyer applications');
    } finally {
      setLoading(false);
    }
  };

  const updateLawyerStatus = async (lawyerId: string, status: 'verified' | 'rejected', notes?: string) => {
    try {
      const updates: any = {
        status,
        verification_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'verified') {
        updates.verified_at = new Date().toISOString();
        updates.is_active = true;
      }

      if (notes) {
        updates.verification_notes = notes;
      }

      const { error } = await supabase
        .from('lawyers')
        .update(updates)
        .eq('id', lawyerId);

      if (error) throw error;

      toast.success(`Lawyer ${status} successfully`);
      fetchApplications();
    } catch (error) {
      console.error('Error updating lawyer status:', error);
      toast.error('Failed to update lawyer status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending_verification: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getAuthProviderBadge = (provider: string) => {
    const badges = {
      'oauth_google': 'bg-blue-100 text-blue-800',
      'oauth_facebook': 'bg-indigo-100 text-indigo-800',
      'email': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[provider as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {provider === 'oauth_google' ? 'Google' : provider === 'oauth_facebook' ? 'Facebook' : 'Email'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Lawyer Verification Panel</h1>
        
        {/* Filter Tabs */}
        <div className="inline-flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'verified', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} 
              {tab !== 'all' && (
                <span className="ml-1 text-xs">
                  ({applications.filter(app => tab === 'pending' ? app.status === 'pending_verification' : app.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No lawyer applications found for {filter} status.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={lawyer.profile_image_url || '/default-avatar.png'}
                    alt={`${lawyer.first_name} ${lawyer.last_name}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {lawyer.first_name} {lawyer.last_name}
                    </h3>
                    <p className="text-gray-600">{lawyer.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(lawyer.status)}
                      {getAuthProviderBadge(lawyer.auth_provider)}
                    </div>
                  </div>
                </div>
                
                {lawyer.status === 'pending_verification' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateLawyerStatus(lawyer.id, 'verified')}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateLawyerStatus(lawyer.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Bar Number:</span>
                  <p className="text-gray-900">{lawyer.bar_number}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <p className="text-gray-900">{lawyer.years_experience} years</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Law School:</span>
                  <p className="text-gray-900">{lawyer.law_school}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Hourly Rate:</span>
                  <p className="text-gray-900">${lawyer.hourly_rate}/hour</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900">{lawyer.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Applied:</span>
                  <p className="text-gray-900">{new Date(lawyer.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-medium text-gray-700">Specializations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lawyer.specialization.map((spec) => (
                    <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <span className="font-medium text-gray-700">Bio:</span>
                <p className="text-gray-900 mt-1">{lawyer.bio}</p>
              </div>

              {lawyer.languages.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Languages:</span>
                  <p className="text-gray-900">{lawyer.languages.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

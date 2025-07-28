import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const GeneralSettings = () => {
  const { user } = useAuth();
  // Split name for first/last name fields
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(50); // Placeholder value
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Save logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-2">
      <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-stretch gap-0 border border-gray-100">
        {/* Profile Info */}
        <div className="flex flex-col items-center justify-center md:items-start md:justify-start p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user?.name?.charAt(0)}
          </div>
          <div className="font-semibold text-lg text-gray-900 mb-1 text-center md:text-left">{user?.name}</div>
          <div className="text-xs text-gray-500 mb-2 text-center md:text-left">{user?.email}</div>
          {user?.role === 'lawyer' && user?.lsk_number && (
            <div className="text-xs text-primary-700 font-mono mb-1">LSK: {user.lsk_number}</div>
          )}
          {user?.role === 'ngo' && (
            <div className="text-xs text-primary-700 font-mono mb-1">NGO Account</div>
          )}
          <div className="inline-block px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs font-medium mb-2 capitalize">
            {user?.role}
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="text-[10px] text-gray-400">Member since 2024</span>
            <span className="text-[10px] text-gray-400">ID: {user?.id?.slice(0, 8)}...</span>
          </div>
          <div className="w-full mt-6">
            <span className="text-xs text-gray-500">Profile Completion</span>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div className="h-2 bg-primary-500" style={{ width: `${profileCompletion}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{profileCompletion}%</span>
          </div>
        </div>
        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-100" />
        {/* Edit Account Information */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Edit your account information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="label">Job Title</label>
              <input className="input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="label">About your / Bio</label>
              <textarea className="input" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
            </div>
          </div>

          {/* Professional Info Section */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Professional Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Is this your first job?</label>
              <input className="input" placeholder="Yes/No" />
            </div>
            <div>
              <label className="label">Are you flexible?</label>
              <input className="input" placeholder="Yes/No" />
            </div>
            <div>
              <label className="label">Do you work remotely?</label>
              <input className="input" placeholder="Yes/No" />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
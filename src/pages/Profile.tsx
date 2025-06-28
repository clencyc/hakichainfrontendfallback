import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, MapPin, FileText, Award, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Profile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    specializations: user?.specializations?.join(', ') || '',
    organization: user?.organization || '',
    lsk_number: user?.lsk_number || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Update form data when user changes
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        location: user.location || '',
        bio: user.bio || '',
        specializations: user.specializations?.join(', ') || '',
        organization: user.organization || '',
        lsk_number: user.lsk_number || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would update the user profile
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-t-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary-700">{user.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <div className="flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="mt-3">
                  <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm">
                    {user.role === 'lawyer' ? 'Legal Professional' : 
                     user.role === 'ngo' ? 'NGO Representative' : 'Donor'}
                  </span>
                </div>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn border border-white bg-transparent hover:bg-white/10 text-white"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-b-xl shadow-md p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="p-4 mb-6 bg-primary-50 border-l-4 border-primary-500 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                  <p className="text-sm text-primary-700">
                    Update your profile information below. Your changes will be saved securely.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="label">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  
                  {user.role === 'lawyer' && (
                    <div>
                      <label htmlFor="lsk_number" className="label">LSK Number</label>
                      <input
                        type="text"
                        id="lsk_number"
                        name="lsk_number"
                        value={formData.lsk_number}
                        onChange={handleChange}
                        className="input"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">LSK Number cannot be changed</p>
                    </div>
                  )}
                  
                  {user.role === 'ngo' && (
                    <div>
                      <label htmlFor="organization" className="label">Organization Name</label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="label">Bio/About</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="input"
                    placeholder="Tell us about yourself or your organization"
                  ></textarea>
                </div>
                
                {user.role === 'lawyer' && (
                  <div className="mb-6">
                    <label htmlFor="specializations" className="label">Specializations (Comma-separated)</label>
                    <input
                      type="text"
                      id="specializations"
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Human Rights, Land Law, Constitutional Law"
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="label">Profile Picture</label>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-gray-600">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <button type="button" className="btn btn-outline flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Upload New Picture</span>
                      </button>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">About</h2>
                    <p className="text-gray-700">
                      {user.bio || 
                        (user.role === 'lawyer' 
                          ? 'Human rights attorney with experience in public interest litigation.'
                          : user.role === 'ngo'
                          ? 'Non-governmental organization focused on providing legal aid to underserved communities.'
                          : 'Passionate donor supporting access to justice.')}
                    </p>
                  </div>
                  
                  {user.role === 'lawyer' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Specializations</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.specializations?.map(spec => (
                          <span key={spec} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                            {spec}
                          </span>
                        )) || (
                          <p className="text-gray-600">No specializations added yet</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {user.role === 'lawyer' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Credentials</h2>
                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">LSK Certification</p>
                          <p className="text-sm text-gray-500 mb-1">LSK Number: {user.lsk_number || 'LSK12345'}</p>
                          <p className="text-sm text-success-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {user.role === 'ngo' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Organization Details</h2>
                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{user.organization || 'Justice Africa'}</p>
                          <p className="text-sm text-gray-500 mb-1">NGO Registration: NGO-KE-2023-12345</p>
                          <p className="text-sm text-success-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified Organization
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  {user.role === 'lawyer' && (
                    <div className="card mb-6">
                      <h2 className="text-xl font-bold mb-4">Performance</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Overall Rating</span>
                            <span className="text-sm font-medium">{user.rating || 4.8}/5.0</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent-500"
                              style={{ width: `${((user.rating || 4.8) / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Cases Completed</span>
                            <span className="text-sm font-medium">{user.casesCompleted || 24}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success-500"
                              style={{ width: '92%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(user.role === 'ngo' || user.role === 'donor') && (
                    <div className="card mb-6">
                      <h2 className="text-xl font-bold mb-4">Impact Summary</h2>
                      <div className="space-y-4">
                        {user.role === 'ngo' && (
                          <>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Bounties Created</span>
                                <span className="text-sm font-medium">12</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Total Funds Raised</span>
                                <span className="text-sm font-medium">$24,850</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">People Helped</span>
                                <span className="text-sm font-medium">450+</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {user.role === 'donor' && (
                          <>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Bounties Supported</span>
                                <span className="text-sm font-medium">8</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Total Donations</span>
                                <span className="text-sm font-medium">$3,450</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Successful Cases</span>
                                <span className="text-sm font-medium">6</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="card">
                    <h2 className="text-xl font-bold mb-4">Achievements</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <Award className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.role === 'lawyer' ? 'Top Performer' : 
                             user.role === 'ngo' ? 'Impact Leader' : 'Generous Supporter'}
                          </p>
                          <p className="text-xs text-gray-500">Awarded Mar 2025</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                          <Award className="w-5 h-5 text-secondary-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.role === 'lawyer' ? '10+ Cases Milestone' : 
                             user.role === 'ngo' ? 'Transparency Champion' : 'Early Adopter'}
                          </p>
                          <p className="text-xs text-gray-500">Awarded Feb 2025</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                          <Award className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.role === 'lawyer' ? 'Fast Responder' : 
                             user.role === 'ngo' ? 'Community Favorite' : 'Consistent Contributor'}
                          </p>
                          <p className="text-xs text-gray-500">Awarded Jan 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
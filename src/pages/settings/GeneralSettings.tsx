import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, BookOpen, Scale, Calendar, Award, Save, Plus, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Legal specializations available for lawyers
const legalSpecializations = [
  'Constitutional Law',
  'Criminal Law',
  'Civil Rights',
  'Family Law',
  'Corporate Law',
  'Contract Law',
  'Property Law',
  'Employment Law',
  'Environmental Law',
  'Immigration Law',
  'Intellectual Property',
  'Tax Law',
  'Banking & Finance',
  'Health Law',
  'International Law'
];

// Kenya's 47 counties as jurisdictions
const kenyanJurisdictions = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi',
  'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia',
  'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
  'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
];

const GeneralSettings = () => {
  const { user } = useAuth();
  
  // Profile states
  const [fullName, setFullName] = useState(user?.name || '');
  const [jurisdiction, setJurisdiction] = useState('');
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [barAdmissionDate, setBarAdmissionDate] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      fullName,
      jurisdiction,
      bio,
      specializations.length > 0,
      yearsOfExperience,
      barAdmissionDate,
      contactEmail,
      phoneNumber,
      officeAddress
    ];
    
    const completedFields = fields.filter(field => 
      typeof field === 'boolean' ? field : field?.toString().trim()
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleSpecializationAdd = (specialization: string) => {
    if (!specializations.includes(specialization)) {
      setSpecializations([...specializations, specialization]);
    }
    setShowSpecializationDropdown(false);
  };

  const handleSpecializationRemove = (specialization: string) => {
    setSpecializations(specializations.filter(s => s !== specialization));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      console.log('Saving profile data:', {
        fullName,
        jurisdiction,
        bio,
        specializations,
        yearsOfExperience,
        barAdmissionDate,
        contactEmail,
        phoneNumber,
        officeAddress
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you can add toast notification here)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl text-white">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
              <p className="text-gray-600">Manage your professional profile and preferences</p>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-teal-600">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Your office address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell clients about your background, experience, and approach to legal practice..."
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Scale size={20} />
                Professional Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Jurisdiction
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select jurisdiction</option>
                    {kenyanJurisdictions.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award size={16} className="inline mr-1" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Bar Admission Date
                  </label>
                  <input
                    type="date"
                    value={barAdmissionDate}
                    onChange={(e) => setBarAdmissionDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen size={16} className="inline mr-1" />
                  Areas of Specialization
                </label>
                
                {/* Selected Specializations */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {specializations.map((spec) => (
                    <motion.span
                      key={spec}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {spec}
                      <button
                        onClick={() => handleSpecializationRemove(spec)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>

                {/* Add Specialization */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <Plus size={16} />
                    Add Specialization
                  </button>

                  {showSpecializationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      {legalSpecializations
                        .filter(spec => !specializations.includes(spec))
                        .map((spec) => (
                          <button
                            key={spec}
                            onClick={() => handleSpecializationAdd(spec)}
                            className="w-full text-left px-4 py-2 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700"
                          >
                            {spec}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-lg hover:from-teal-700 hover:to-emerald-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { GeneralSettings };
export default GeneralSettings;
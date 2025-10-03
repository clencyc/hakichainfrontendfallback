import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, Building, GavelIcon, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type RegistrationType = 'lawyer' | 'ngo' | 'donor';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    lsk_number: '',
    organization: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: registrationType!,
        ...(registrationType === 'lawyer' && { lsk_number: formData.lsk_number }),
        ...(registrationType === 'ngo' && { organization: formData.organization }),
      });
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] pt-20 pb-12 flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-card"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join HakiChain and make a difference</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-50 border border-error-200 rounded-md text-error-700 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">I am registering as a:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationType('lawyer');
                    setStep(2);
                  }}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    registrationType === 'lawyer'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <GavelIcon className="w-10 h-10 text-primary-500 mb-2" />
                  <span className="font-medium">Lawyer</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationType('ngo');
                    setStep(2);
                  }}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    registrationType === 'ngo'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <Building className="w-10 h-10 text-primary-500 mb-2" />
                  <span className="font-medium">NGO</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationType('donor');
                    setStep(2);
                  }}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    registrationType === 'donor'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-10 h-10 text-primary-500 mb-2" />
                  <span className="font-medium">Donor</span>
                </button>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {registrationType === 'lawyer' && (
              <div className="mb-5">
                <label htmlFor="lsk_number" className="label">Practicing Certificate</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GavelIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lsk_number"
                    name="lsk_number"
                    type="text"
                    required
                    value={formData.lsk_number}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="LSK12345"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your LSK Number will be verified before you can accept bounties.
                </p>
              </div>
            )}

            {registrationType === 'ngo' && (
              <div className="mb-5">
                <label htmlFor="organization" className="label">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Your NGO name"
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-outline py-2.5"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 btn btn-primary py-2.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};
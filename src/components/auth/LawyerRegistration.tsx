import React, { useState, useEffect } from 'react';
import {
  SignIn,
  SignUp,
  useUser,
  useAuth,
  RedirectToSignIn,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import { getUserByEmail } from '../../lib/userUtils';
import { toast } from 'react-toastify';
import { AuthProviderDisplay } from './AuthProviderDisplay';

interface LawyerProfile {
  lsk_number: string; // Changed from bar_number to match your database
  specialization: string[];
  years_experience: number;
  law_school: string;
  bio: string;
  hourly_rate: number;
  phone: string;
  address: string;
  languages: string[];
}

export function LawyerRegistration() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState<'signin' | 'profile' | 'complete'>('signin');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<LawyerProfile>({
    lsk_number: '',
    specialization: [],
    years_experience: 0,
    law_school: '',
    bio: '',
    hourly_rate: 0,
    phone: '',
    address: '',
    languages: []
  });

  const specializationOptions = [
    'Civil Rights', 'Criminal Law', 'Family Law', 'Corporate Law',
    'Immigration Law', 'Personal Injury', 'Employment Law', 'Real Estate Law',
    'Tax Law', 'Intellectual Property', 'Environmental Law', 'Contract Law'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'Swahili', 'Arabic', 'Portuguese', 'Mandarin'
  ];

  // Save lawyer profile to Supabase
  const saveLawyerProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get the primary email
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      
      // Prepare data for your simplified users table
      const userData = {
        id: user.id, // Use Clerk user ID as primary key
        email: primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress,
        full_name: fullName,
        user_type: 'lawyer',
        lsk_number: profileData.lsk_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save directly to your users table
      const { data, error } = await supabase
        .from('users')
        .upsert(userData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving user profile:', error);
        toast.error('Failed to save profile. Please try again.');
        return;
      }

      // Log successful registration
      console.log('Lawyer profile saved to users table:', data);

      // Send welcome email
      try {
        const emailResponse = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            name: userData.full_name,
            role: 'lawyer',
            lsk_number: userData.lsk_number,
          }),
        });

        if (emailResponse.ok) {
          console.log('Welcome email sent successfully');
        } else {
          console.warn('Welcome email failed, but registration was successful');
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail registration if email fails
      }
      
      toast.success('Profile saved successfully! Your application is under review.');
      setStep('complete');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationChange = (spec: string) => {
    setProfileData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const handleLanguageChange = (lang: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  // Check if user is already signed in and redirect to profile step
  React.useEffect(() => {
    if (isSignedIn && step === 'signin') {
      setStep('profile');
    }
  }, [isSignedIn, step]);

  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your lawyer registration has been submitted successfully. Our team will review your application and contact you within 2-3 business days.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join HakiChain as a Lawyer</h1>
          <p className="text-gray-600 mt-2">Connect with clients and grow your practice</p>
        </div>

        {step === 'signin' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <SignedOut>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Sign Up with Social Media</h2>
                  <p className="text-gray-600 mb-6">
                    Choose your preferred method to create your lawyer account:
                  </p>
                </div>
                
                {/* Clerk SignUp component with social providers */}
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
                      socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors w-full mb-2',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md',
                      card: 'shadow-none border-0',
                      headerTitle: 'text-xl font-semibold text-gray-900',
                      headerSubtitle: 'text-gray-600',
                      dividerLine: 'bg-gray-200',
                      dividerText: 'text-gray-500 text-sm',
                      socialButtonsBlockButtonText: 'font-medium',
                      formFieldLabel: 'text-sm font-medium text-gray-700'
                    },
                    layout: {
                      socialButtonsPlacement: 'top',
                      socialButtonsVariant: 'blockButton'
                    }
                  }}
                  redirectUrl="/lawyer/register"
                  routing="path"
                  path="/lawyer/register"
                  signInUrl="/lawyer/signin"
                />
              </div>
            </SignedOut>

            <SignedIn>
              <div className="text-center">
                <p className="text-green-600 mb-2">✅ Authentication successful!</p>
                <AuthProviderDisplay className="justify-center mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Welcome, {user?.firstName}! Complete your lawyer profile to join the network.
                </p>
                <button
                  onClick={() => setStep('profile')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Continue to Profile Setup
                </button>
              </div>
            </SignedIn>
          </div>
        )}

        {step === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Complete Your Lawyer Profile</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); saveLawyerProfile(); }} className="space-y-6">
              {/* Bar Number */}
              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LSK Number (Kenya Law Society)*
                </label>
                <input
                  type="text"
                  required
                  value={profileData.lsk_number}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lsk_number: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your LSK registration number"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization (Select all that apply) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {specializationOptions.map((spec) => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.specialization.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        className="mr-2"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={profileData.years_experience}
                  onChange={(e) => setProfileData(prev => ({ ...prev, years_experience: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Law School */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Law School *
                </label>
                <input
                  type="text"
                  required
                  value={profileData.law_school}
                  onChange={(e) => setProfileData(prev => ({ ...prev, law_school: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your law school"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell potential clients about your experience and expertise..."
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={profileData.hourly_rate}
                  onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150.00"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your office address"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languageOptions.map((lang) => (
                    <label key={lang} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.languages.includes(lang)}
                        onChange={() => handleLanguageChange(lang)}
                        className="mr-2"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('signin')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

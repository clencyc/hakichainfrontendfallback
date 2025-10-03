import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useLawyerAuth } from '../hooks/useLawyerAuth';
import { AuthProviderDisplay } from '../components/auth/AuthProviderDisplay';
import { Link } from 'react-router-dom';

export function LawyerPortal() {
  const { 
    lawyerData, 
    isLawyerRegistered, 
    isLawyerVerified, 
    loading 
  } = useLawyerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              
              {!isLawyerRegistered ? (
                // Not registered as lawyer
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Lawyer Registration</h2>
                  <p className="text-gray-600 mb-6">
                    You're signed in, but you haven't completed your lawyer profile yet.
                  </p>
                  <AuthProviderDisplay className="justify-center mb-6" />
                  <Link
                    to="/lawyer-join"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Complete Lawyer Profile
                  </Link>
                </div>
              ) : !isLawyerVerified ? (
                // Registered but not verified
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
                    <p className="text-gray-600 mb-4">
                      Thank you for registering! Your lawyer application is currently being reviewed by our team.
                    </p>
                    <AuthProviderDisplay className="justify-center" />
                  </div>

                  {/* Show lawyer profile info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Application Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <p className="text-gray-900">{lawyerData?.full_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{lawyerData?.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Practicing Certificate:</span>
                        <p className="text-gray-900">{lawyerData?.lsk_number}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Account Type:</span>
                        <p className="text-gray-900">{lawyerData?.user_type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Our team will verify your credentials and bar admission</li>
                      <li>• You'll receive an email notification once approved (typically 2-3 business days)</li>
                      <li>• After approval, you can start accepting legal bounties and clients</li>
                    </ul>
                  </div>
                </div>
              ) : (
                // Verified lawyer - full dashboard
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {lawyerData?.full_name?.split(' ')[0]}!</h1>
                        <p className="text-gray-600">Verified Legal Professional</p>
                        <AuthProviderDisplay className="mt-2" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            ✓ Verified
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            Active
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Member since: {new Date(lawyerData?.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                      <div className="text-gray-600">Total Cases</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">LSK</div>
                      <div className="text-gray-600">Verified</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                      <div className="text-gray-600">Client Reviews</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link
                        to="/bounties"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Browse Legal Bounties</h4>
                          <p className="text-sm text-gray-600">Find new cases and clients</p>
                        </div>
                      </Link>
                      
                      <Link
                        to="/lawyer/dashboard"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Full Dashboard</h4>
                          <p className="text-sm text-gray-600">Manage cases and clients</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

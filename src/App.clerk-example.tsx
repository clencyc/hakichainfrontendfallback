// Example integration for your App.tsx - showing how to add Clerk authentication

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ClerkAuthHeader } from './components/auth/ClerkAuthHeader';
import { ClerkProtectedRoute } from './components/auth/ClerkProtectedRoute';
import { useClerkAuth } from './hooks/useClerkAuth';

// Your existing components
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { BountyExplorer } from './pages/BountyExplorer';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
// ... other imports

export default function App() {
  const { isLoaded, isSignedIn } = useClerkAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Add Clerk auth header to your layout */}
      <ClerkAuthHeader />
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/bounties" element={<BountyExplorer />} />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/lawyer/*" 
          element={
            <ClerkProtectedRoute>
              <LawyerDashboard />
            </ClerkProtectedRoute>
          } 
        />
        
        {/* Alternative protected route using Clerk's built-in components */}
        <Route 
          path="/profile" 
          element={
            <>
              <SignedIn>
                {/* Your profile component */}
                <div>User Profile Content</div>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

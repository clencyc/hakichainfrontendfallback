import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { BountyExplorer } from './pages/BountyExplorer';
import { BountyDetails } from './pages/BountyDetails';
import { CreateBounty } from './pages/CreateBounty';
import { LawyerDashboard } from './pages/lawyer/LawyerDashboard';
import { LawyerAnalytics } from './pages/lawyer/LawyerAnalytics';
import { LawyerCases } from './pages/lawyer/LawyerCases';
import { LawyerDocuments } from './pages/lawyer/LawyerDocuments';
import { NGODashboard } from './pages/ngo/NGODashboard';
import { NGOAnalytics } from './pages/ngo/NGOAnalytics';
import { NGOLawyers } from './pages/ngo/NGOLawyers';
import { NGOBounties } from './pages/ngo/NGOBounties';
import { NGOProjectBoard } from './pages/ngo/NGOProjectBoard';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Waitlist } from './pages/Waitlist';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { LegalChatbot } from './components/chat/LegalChatbot';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './context/AuthProvider';

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Home />} />
              <Route path="bounties" element={<BountyExplorer />} />
              <Route path="bounties/:id" element={<BountyDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="waitlist" element={<Waitlist />} />

              {/* Protected routes */}
              <Route 
                path="create-bounty" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <CreateBounty />
                  </ProtectedRoute>
                } 
              />
              
              {/* Lawyer routes */}
              <Route 
                path="lawyer-dashboard" 
                element={
                  <ProtectedRoute allowed={userRole === 'lawyer'}>
                    <LawyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="lawyer/analytics" 
                element={
                  <ProtectedRoute allowed={userRole === 'lawyer'}>
                    <LawyerAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="lawyer/cases" 
                element={
                  <ProtectedRoute allowed={userRole === 'lawyer'}>
                    <LawyerCases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="lawyer/documents" 
                element={
                  <ProtectedRoute allowed={userRole === 'lawyer'}>
                    <LawyerDocuments />
                  </ProtectedRoute>
                } 
              />
              
              {/* NGO routes */}
              <Route 
                path="ngo-dashboard" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <NGODashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="ngo-analytics" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <NGOAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="ngo-lawyers" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <NGOLawyers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="ngo-bounties" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <NGOBounties />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="ngo-project-board" 
                element={
                  <ProtectedRoute allowed={userRole === 'ngo'}>
                    <NGOProjectBoard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Donor routes */}
              <Route 
                path="donor-dashboard" 
                element={
                  <ProtectedRoute allowed={userRole === 'donor'}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute allowed={isAuthenticated}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
          <Footer />
          
          {/* Legal Chatbot - appears on all pages */}
          <LegalChatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { BountyExplorer } from './pages/BountyExplorer';
import { BountyDetails } from './pages/BountyDetails';
import { CreateBounty } from './pages/CreateBounty';
import { LawyerDashboard } from './pages/lawyer/LawyerDashboard';
import { NGODashboard } from './pages/ngo/NGODashboard';
import { NGOAnalytics } from './pages/ngo/NGOAnalytics';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="bounties" element={<BountyExplorer />} />
          <Route path="bounties/:id" element={<BountyDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected routes */}
          <Route 
            path="create-bounty" 
            element={
              <ProtectedRoute allowed={userRole === 'ngo'}>
                <CreateBounty />
              </ProtectedRoute>
            } 
          />
          
          {/* Role-specific dashboards */}
          <Route 
            path="lawyer-dashboard" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <LawyerDashboard />
              </ProtectedRoute>
            } 
          />
          
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
    </div>
  );
}

export default App;
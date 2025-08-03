import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { BountyExplorer } from './pages/BountyExplorer';
import { BountyDetails } from './pages/BountyDetails';
import { CreateBounty } from './pages/CreateBounty';
import { LawyerDashboard } from './pages/lawyer/LawyerDashboard';
import { LawyerAI } from './pages/lawyer/LawyerAI';
import { LawyerESign } from './pages/lawyer/LawyerESign';
import { LawyerRemindersKanban } from './pages/lawyer/LawyerRemindersKanban';
import { LawyerAnalytics } from './pages/lawyer/LawyerAnalytics';
import { LawyerCases } from './pages/lawyer/LawyerCases';
import { LawyerDocuments } from './pages/lawyer/LawyerDocuments';
// import { LawyerESign } from './pages/lawyer/LawyerESign';
import { Hakilens } from './pages/lawyer/Hakilens';
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
import { AuthProvider } from './contexts/AuthContext';
import { BountyDemoDetails } from './pages/BountyDemoDetails';
import SettingsIndex from './pages/settings';
import { GeneralSettings } from './pages/settings/GeneralSettings';
import { AIReviewer } from './pages/lawyer/AIReviewer';
import { Documentation } from './pages/Documentation';
import { FAQ } from './pages/FAQ';
import { CaseStudies } from './pages/CaseStudies';
import { Blog } from './pages/Blog';
import LegalIndex from './pages/legal';
import { Whitepaper } from './pages/legal/Whitepaper';
import { DonorGuide } from './pages/legal/DonorGuide';
import { DataProtectionPolicy } from './pages/legal/DataProtectionPolicy';
import { KYCAMLPolicy } from './pages/legal/KYCAMLPolicy';
import { ConsumerProtectionPolicy } from './pages/legal/ConsumerProtectionPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';

// Documentation page imports
import DocumentationIndex from './pages/docs';
import { Introduction } from './pages/docs/Introduction';
import { QuickStart } from './pages/docs/QuickStart';
import { PlatformOverview } from './pages/docs/PlatformOverview';
import { SmartContracts } from './pages/docs/SmartContracts';
import { API } from './pages/docs/API';
import BlockchainIntegration from './pages/docs/BlockchainIntegration';
import { NGOGuide } from './pages/docs/NGOGuide';
import { LawyerGuide } from './pages/docs/LawyerGuide';
import LegalBounties from './pages/docs/LegalBounties';
import MilestoneSystem from './pages/docs/MilestoneSystem';
import LawyerMatching from './pages/docs/LawyerMatching';

// Placeholder imports for new settings pages
const PreferencesSettings = () => <div className="p-6">Preferences Settings (Coming soon)</div>;
const DeleteAccountSettings = () => <div className="p-6">Delete Your Account (Coming soon)</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { isAuthenticated, userRole } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar on dashboard routes
  const hideNavbar =
    location.pathname.startsWith('/lawyer-dashboard') ||
    location.pathname.startsWith('/lawyer/') ||
    location.pathname.startsWith('/ngo-dashboard') ||
    location.pathname.startsWith('/ngo-') ||
    location.pathname.startsWith('/donor-dashboard');

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && <Navbar scrolled={scrolled} />}
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="bounties" element={<BountyExplorer />} />
          <Route path="bounties/bounty-fake-1" element={<BountyDemoDetails />} />
          <Route path="bounties/bounty-fake-2" element={<BountyDemoDetails />} />
          <Route path="bounties/:id" element={<BountyDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="waitlist" element={<Waitlist />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="blog" element={<Blog />} />
          
          {/* Documentation Pages */}
          <Route path="docs" element={<DocumentationIndex />} />
          <Route path="docs/intro" element={<Introduction />} />
          <Route path="docs/quickstart" element={<QuickStart />} />
          <Route path="docs/overview" element={<PlatformOverview />} />
          <Route path="docs/smart-contracts" element={<SmartContracts />} />
          <Route path="docs/api" element={<API />} />
          <Route path="docs/blockchain" element={<BlockchainIntegration />} />
          <Route path="docs/ngo-guide" element={<NGOGuide />} />
          <Route path="docs/lawyer-guide" element={<LawyerGuide />} />
          <Route path="docs/bounties" element={<LegalBounties />} />
          <Route path="docs/milestones" element={<MilestoneSystem />} />
          <Route path="docs/matching" element={<LawyerMatching />} />
          
          {/* Legal and Policy Pages */}
          <Route path="legal" element={<LegalIndex />} />
          <Route path="legal/whitepaper" element={<Whitepaper />} />
          <Route path="legal/donor-guide" element={<DonorGuide />} />
          <Route path="legal/data-protection" element={<DataProtectionPolicy />} />
          <Route path="legal/kyc-aml" element={<KYCAMLPolicy />} />
          <Route path="legal/consumer-protection" element={<ConsumerProtectionPolicy />} />
          <Route path="legal/terms-of-service" element={<TermsOfService />} />
          <Route path="legal/privacy-policy" element={<PrivacyPolicy />} />

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
            path="lawyer/ai" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <LawyerAI />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="lawyer/e-sign" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <LawyerESign />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="lawyer/reminders" 
            element={<Navigate to="/lawyer/reminders-kanban" replace />}
          />
          <Route 
            path="lawyer/reminders-kanban" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <LawyerRemindersKanban />
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
          {/* <Route 
            path="lawyer/e-sign" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <LawyerESign />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="lawyer/ai-document-reviewer" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <AIReviewer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="lawyer/hakilens" 
            element={
              <ProtectedRoute allowed={userRole === 'lawyer'}>
                <Hakilens />
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

          {/* Settings routes */}
          <Route path="settings" element={<SettingsIndex />}>
            <Route index element={<GeneralSettings />} />
            <Route path="preferences" element={<PreferencesSettings />} />
            <Route path="delete" element={<DeleteAccountSettings />} />
          </Route>
        </Route>
      </Routes>
      {/* Legal Chatbot - appears on all pages */}
      <LegalChatbot />
    </div>
  );
}

export default App;
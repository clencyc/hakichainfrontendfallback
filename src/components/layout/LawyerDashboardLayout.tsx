import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GavelIcon, Home, LogOut, Brain, Bell, Search, FileCheck, FolderOpen, Settings, HelpCircle } from 'lucide-react';
import Joyride from 'react-joyride';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardTour } from '../../hooks/useDashboardTour';
import { Footer } from './Footer';
import { Logo } from './Logo';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { runTour, tourSteps, startTour, handleJoyrideCallback } = useDashboardTour();

  const sidebarLinks = [
    { name: 'Overview', path: '/lawyer-dashboard', icon: Home, tourTarget: 'overview' },
    { name: 'Cases', path: '/lawyer/cases', icon: GavelIcon, tourTarget: 'cases' },
    { name: 'HakiLens', path: '/lawyer/hakilens', icon: Search, tourTarget: 'hakilens' },
    { name: 'HakiDraft', path: '/lawyer/ai', icon: Brain, tourTarget: 'hakidraft' },
    { name: 'HakiReview', path: '/lawyer/ai-document-reviewer', icon: FileCheck, tourTarget: 'hakireview' },
    { name: 'HakiReminders', path: '/lawyer/reminders-kanban', icon: Bell, tourTarget: 'hakireminders' },
    { name: 'Documents', path: '/lawyer/documents', icon: FolderOpen, tourTarget: 'documents' },
  ];

  const isSettings = location.pathname.startsWith('/settings');
  const sidebarClass = isSettings ? 'mt-16' : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Tour Component */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#008080',
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            textColor: '#333',
            width: 350,
            zIndex: 1000,
          },
          tooltip: {
            borderRadius: 12,
            fontSize: 14,
          },
          tooltipTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
          },
        }}
      />

      {/* Fixed Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-30",
        sidebarClass
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          {!isSettings && (
            <div className="h-16 flex items-center px-6 border-b border-gray-200" data-tour="logo">
              <Logo />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-8">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                // Highlight active link for all sidebar links, including AI Document Reviewer
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-tour={link.tourTarget}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500"
                    )} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="absolute bottom-16 left-0 w-full p-4">
              {/* Tour Button */}
              <button
                onClick={startTour}
                data-tour-trigger="true"
                className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 mb-2 transition-colors"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Take Tour
              </button>
              
              <Link
                to="/settings"
                data-tour="settings"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 flex flex-col">
        {/* Header row: signout right, empty left */}
        {!isSettings && (
          <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-white">
            <div className="flex-1" />
            <button
              onClick={logout}
              data-tour="signout"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        )}
        <div className="min-h-screen pb-32 px-6" style={{ marginTop: isSettings ? '0' : '-1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
        <Footer minimal={true} />
      </main>
    </div>
  );
};
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GavelIcon, BarChart3, FileText, Home, LogOut, Brain, Bell } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { Footer } from './Footer';
import { Logo } from './Logo';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { name: 'Overview', path: '/lawyer-dashboard', icon: Home },
    { name: 'Cases', path: '/lawyer/cases', icon: GavelIcon },
    { name: 'AI Assistant', path: '/lawyer/ai', icon: Brain },
    { name: 'Reminders', path: '/lawyer/reminders', icon: Bell },
    { name: 'Analytics', path: '/lawyer/analytics', icon: BarChart3 },
    { name: 'Documents', path: '/lawyer/documents', icon: FileText },
    { name: 'AI Document Reviewer', path: '/lawyer/ai-document-reviewer', icon: FileText },
  ];

  const isSettings = location.pathname.startsWith('/settings');
  const sidebarClass = isSettings ? 'mt-16' : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-30",
        sidebarClass
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          {!isSettings && (
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <Link to="/" className="flex items-center space-x-3">
                <Logo />
              </Link>
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

            <div className="absolute bottom-0 left-0 w-full p-4">
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.5-3.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z" /></svg>
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
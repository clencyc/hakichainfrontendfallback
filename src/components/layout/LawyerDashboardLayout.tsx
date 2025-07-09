import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GavelIcon, BarChart3, FileText, Home, Settings, LogOut, Brain, Bell } from 'lucide-react';
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3">
              <Logo />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-8">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
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

            <div className="mt-8">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings
              </h3>
              <div className="mt-2 space-y-1">
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all",
                    location.pathname === '/settings'
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  )}
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-400" />
                  Settings
                </Link>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                <span className="text-lg font-medium">{user?.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">LSK: {user?.lsk_number}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 flex flex-col">
        <div className="min-h-screen py-8 px-8 pb-32"> {/* Add pb-32 for footer space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  );
};
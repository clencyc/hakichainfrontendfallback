import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GavelIcon, BarChart3, FileText, FolderOpen, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Overview', path: '/lawyer-dashboard', icon: Home },
    { name: 'Cases', path: '/lawyer/cases', icon: GavelIcon },
    { name: 'Analytics', path: '/lawyer/analytics', icon: BarChart3 },
    { name: 'Documents', path: '/lawyer/documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <GavelIcon className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-serif font-bold text-primary-500">HakiChain</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
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
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">J</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Kamau</p>
                <p className="text-xs text-gray-500 truncate">LSK12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="py-6 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
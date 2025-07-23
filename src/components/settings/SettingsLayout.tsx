import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, AlertTriangle, Menu } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

interface SettingsLayoutProps {
  children: ReactNode;
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { name: 'Profile', path: '/settings', icon: User },
    { name: 'Preferences', path: '/settings/preferences', icon: Settings },
    { name: 'Delete your account', path: '/settings/delete', icon: AlertTriangle },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600">Manage your account preferences</p>
        </div>

        {/* Responsive layout: sidebar on left for md+, top drawer for mobile */}
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white shadow mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open settings menu"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          {/* Sidebar */}
          <aside
            className={cn(
              "z-20 md:z-auto bg-white md:bg-transparent w-full md:w-72 flex-shrink-0 md:sticky md:top-24 transition-all duration-300",
              sidebarOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100 shadow flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                {user?.name?.charAt(0)}
              </div>
              <div className="font-semibold text-lg text-gray-900 mb-1">{user?.name}</div>
              <div className="text-xs text-gray-500 mb-2">{user?.email}</div>
              {user?.role === 'lawyer' && user?.lsk_number && (
                <div className="text-xs text-primary-700 font-mono mb-1">LSK: {user.lsk_number}</div>
              )}
              {user?.role === 'ngo' && (
                <div className="text-xs text-primary-700 font-mono mb-1">NGO Account</div>
              )}
              <div className="inline-block px-2 py-1 rounded bg-primary-100 text-primary-700 text-xs font-medium mb-2 capitalize">
                {user?.role}
              </div>
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-[10px] text-gray-400">Member since 2024</span>
                <span className="text-[10px] text-gray-400">ID: {user?.id?.slice(0, 8)}...</span>
              </div>
            </div>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      location.pathname === link.path
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};
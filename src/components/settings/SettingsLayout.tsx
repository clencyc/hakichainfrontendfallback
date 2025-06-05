import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Wallet, User } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { cn } from '../../utils/cn';

interface SettingsLayoutProps {
  children: ReactNode;
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const location = useLocation();

  const links = [
    { name: 'General', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/settings/profile', icon: User },
    { name: 'Notifications', path: '/settings/notifications', icon: Bell },
    { name: 'Security', path: '/settings/security', icon: Shield },
    { name: 'Payment', path: '/settings/payment', icon: Wallet },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600">Manage your account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
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
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
import { Link, useLocation } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { GavelIcon, BarChart3, FileText, FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/lawyer-dashboard', icon: GavelIcon },
    { name: 'Cases', path: '/lawyer/cases', icon: FileText },
    { name: 'Analytics', path: '/lawyer/analytics', icon: BarChart3 },
    { name: 'Documents', path: '/lawyer/documents', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-20">
              {sidebarLinks.map((link) => {
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
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
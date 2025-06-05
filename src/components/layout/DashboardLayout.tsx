import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  GavelIcon, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarLink {
  name: string;
  path: string;
  icon: typeof Home;
}

const getLinksByRole = (role: string): SidebarLink[] => {
  const commonLinks = [
    { name: 'Overview', path: '/dashboard', icon: Home },
    { name: 'Profile', path: '/profile', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  switch (role) {
    case 'lawyer':
      return [
        ...commonLinks,
        { name: 'My Cases', path: '/lawyer/cases', icon: GavelIcon },
        { name: 'Available Bounties', path: '/bounties', icon: FileText },
        { name: 'Analytics', path: '/lawyer/analytics', icon: BarChart3 },
      ];
    case 'ngo':
      return [
        ...commonLinks,
        { name: 'Bounties', path: '/ngo/bounties', icon: FileText },
        { name: 'Lawyers', path: '/ngo/lawyers', icon: Users },
        { name: 'Analytics', path: '/ngo/analytics', icon: BarChart3 },
      ];
    case 'donor':
      return [
        ...commonLinks,
        { name: 'Explore Bounties', path: '/bounties', icon: FileText },
        { name: 'My Contributions', path: '/donor/contributions', icon: GavelIcon },
        { name: 'Impact', path: '/donor/impact', icon: BarChart3 },
      ];
    default:
      return commonLinks;
  }
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = getLinksByRole(user?.role || '');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200",
          "w-64 md:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <GavelIcon className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-serif font-bold text-primary-500">HakiChain</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
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
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        "md:ml-64"
      )}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 fixed right-0 left-0 md:left-64 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user?.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
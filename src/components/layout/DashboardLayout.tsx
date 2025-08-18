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
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { Footer } from './Footer';
import { Logo } from './Logo';

interface SidebarLink {
  name: string;
  path: string;
  icon: typeof Home;
}

const getLinksByRole = (role: string): SidebarLink[] => {
  switch (role) {
    case 'ngo':
      return [
        { name: 'Dashboard', path: '/ngo-dashboard', icon: Home },
        { name: 'Bounties', path: '/ngo-bounties', icon: FileText },
        { name: 'Lawyers', path: '/ngo-lawyers', icon: Users },
        { name: 'Analytics', path: '/ngo-analytics', icon: BarChart3 },
        { name: 'Project Board', path: '/ngo-project-board', icon: GavelIcon },
      ];
    default:
      return [];
  }
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = getLinksByRole(user?.role || '');
  const isSettings = location.pathname.startsWith('/settings');
  const sidebarClass = isSettings ? 'mt-12' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200",
          isSidebarOpen ? "w-64" : "w-16",
          "md:translate-x-0",
          !isMobileMenuOpen && "-translate-x-full md:translate-x-0",
          sidebarClass
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {!isSettings && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Link to="/" className="flex items-center space-x-2">
                      <Logo />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center w-8 h-8"
                  >
                    <Link to="/" className="flex items-center justify-center w-8 h-8">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        H
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden md:flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                  title="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

                     <nav className="flex-1 space-y-1 overflow-y-auto" style={{ padding: isSidebarOpen ? '1rem' : '0.5rem' }}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                    location.pathname === link.path
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  title={!isSidebarOpen ? link.name : undefined}
                >
                                     <Icon className={cn(
                     "w-5 h-5 transition-colors flex-shrink-0 min-w-[20px]",
                     isSidebarOpen ? "mr-3" : "mx-auto"
                   )} />
                  <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap"
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 w-full p-4">
            <Link
              to="/settings"
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-all",
                !isSidebarOpen && "justify-center"
              )}
              title={!isSidebarOpen ? "Settings" : undefined}
            >
                             <svg className={cn("w-5 h-5 flex-shrink-0 min-w-[20px]", isSidebarOpen ? "mr-2" : "mx-auto")} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.5-3.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z" /></svg>
              <AnimatePresence mode="wait">
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 flex-1 flex flex-col",
        isSidebarOpen ? "md:ml-64" : "md:ml-16"
      )}>
        {/* Top Navigation */}
        <header className={cn(
          "bg-white border-b border-gray-200 fixed right-0 z-30 transition-all duration-300",
          isSidebarOpen ? "md:left-64" : "md:left-16"
        )}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
              title="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            {/* Sign Out button removed to prevent overlap */}
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-12 min-h-screen pb-32 flex-1">
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
        <Footer minimal={true} />
      </div>
    </div>
  );
};
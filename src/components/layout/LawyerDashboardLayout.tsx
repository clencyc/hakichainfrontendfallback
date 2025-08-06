import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GavelIcon, Home, LogOut, Brain, Bell, Search, FileCheck, FolderOpen, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { Footer } from './Footer';
import { Logo } from './Logo';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { name: 'Overview', path: '/lawyer-dashboard', icon: Home },
    { name: 'Cases', path: '/lawyer/cases', icon: GavelIcon },
    { name: 'HakiLens', path: '/lawyer/hakilens', icon: Search },
    { name: 'HakiDraft', path: '/lawyer/ai', icon: Brain },
    { name: 'HakiReview', path: '/lawyer/ai-document-reviewer', icon: FileCheck },
    { name: 'HakiReminders', path: '/lawyer/reminders-kanban', icon: Bell },
    { name: 'Documents', path: '/lawyer/documents', icon: FolderOpen },
  ];

  const isSettings = location.pathname.startsWith('/settings');
  const sidebarClass = isSettings ? 'mt-16' : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200",
        isSidebarOpen ? "w-72" : "w-16",
        "md:translate-x-0",
        !isMobileMenuOpen && "-translate-x-full md:translate-x-0",
        sidebarClass
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle Button */}
          {!isSettings && (
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Logo />
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center w-8 h-8"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      H
                    </div>
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

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-8" style={{ paddingLeft: isSidebarOpen ? '1rem' : '0.5rem', paddingRight: isSidebarOpen ? '1rem' : '0.5rem' }}>
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    )}
                    title={!isSidebarOpen ? link.name : undefined}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors flex-shrink-0 min-w-[20px]",
                      isActive ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500",
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
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-all",
                  !isSidebarOpen && "justify-center"
                )}
                title={!isSidebarOpen ? "Settings" : undefined}
              >
                <Settings className={cn("w-5 h-5 flex-shrink-0 min-w-[20px]", isSidebarOpen ? "mr-2" : "mx-auto")} />
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
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 flex-1 flex flex-col",
        isSidebarOpen ? "md:ml-72" : "md:ml-16"
      )}>
        {/* Header row: signout right, empty left */}
        {!isSettings && (
          <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-white">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
              title="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
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
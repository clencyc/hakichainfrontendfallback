import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GavelIcon, UserIcon, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';

interface NavbarProps {
  scrolled: boolean;
}

export const Navbar = ({ scrolled }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Bounties', path: '/bounties' },
    ...(isAuthenticated && user?.role === 'ngo' 
      ? [{ name: 'Create Bounty', path: '/create-bounty' }] 
      : []),
    ...(isAuthenticated && user?.role === 'ngo' 
      ? [{ name: 'NGO Dashboard', path: '/ngo-dashboard' }] 
      : []),
    ...(isAuthenticated && user?.role === 'lawyer' 
      ? [{ name: 'Lawyer Dashboard', path: '/lawyer-dashboard' }] 
      : []),
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GavelIcon className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-serif font-bold text-primary-500">HakiChain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium hover:text-primary-500 transition-colors ${
                  location.pathname === link.path 
                    ? 'text-primary-500 font-semibold' 
                    : 'text-primary-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth/Wallet Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* {!isConnected ? (
              <button 
                onClick={connectWallet}
                className="btn btn-outline flex items-center space-x-1 text-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button 
                onClick={disconnectWallet}
                className="btn btn-outline flex items-center space-x-1 text-sm"
              >
                <Wallet className="w-4 h-4" />
                <span className="truncate w-20">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}</span>
              </button>
            )} */}

            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary text-sm">
                Sign In
              </Link>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-500 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-base font-medium hover:text-primary-500 transition-colors ${
                    location.pathname === link.path 
                      ? 'text-primary-500 font-semibold' 
                      : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {!isConnected ? (
                  <button 
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-outline w-full flex items-center justify-center space-x-1"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      disconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-outline w-full flex items-center justify-center space-x-1"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="truncate">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}</span>
                  </button>
                )}

                {!isAuthenticated ? (
                  <Link 
                    to="/login" 
                    className="btn btn-primary w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/profile" 
                      className="block py-2 text-base font-medium text-gray-700 hover:text-primary-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-primary-500"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { useLawyerAuth } from '../../hooks/useLawyerAuth';

interface NavigationProps {
  scrolled?: boolean;
}

export function Navigation({ scrolled = false }: NavigationProps) {
  const location = useLocation();
  const { lawyerData, isLawyerVerified } = useLawyerAuth();

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
      : 'bg-transparent'
  }`;

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HakiChain</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/bounties" 
              className={`font-medium transition-colors ${
                location.pathname === '/bounties' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Legal Bounties
            </Link>
            
            <Link 
              to="/documentation" 
              className={`font-medium transition-colors ${
                location.pathname === '/documentation' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Docs
            </Link>

            <Link 
              to="/case-studies" 
              className={`font-medium transition-colors ${
                location.pathname === '/case-studies' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Case Studies
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              {/* Join as Lawyer Button */}
              <Link 
                to="/lawyer-join" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Join as Lawyer
              </Link>
              
              {/* Sign In Button */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              {/* Show lawyer status if registered */}
              {lawyerData && (
                <div className="flex items-center space-x-2">
                  {isLawyerVerified ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Verified Lawyer
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Pending Verification
                    </span>
                  )}
                </div>
              )}
              
              {/* User Button */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

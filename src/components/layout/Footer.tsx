import { GavelIcon, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = ({ minimal = false }: { minimal?: boolean }) => {
  if (minimal) {
    return (
      <footer className="w-full bg-transparent text-gray-700 border-t border-transparent py-6 flex flex-col md:flex-row items-center justify-between px-4">
        <span className="text-sm">@2025 HakiChain. All rights reserved.</span>
                  <div className="flex space-x-6 mt-2 md:mt-0">
            <Link to="/legal/privacy-policy" className="text-sm hover:underline">Privacy Policy</Link>
            <Link to="/legal/terms-of-service" className="text-sm hover:underline">Terms of Service</Link>
            <Link to="/legal/data-protection" className="text-sm hover:underline">Data Protection</Link>
          </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GavelIcon className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-serif font-bold text-primary-400">HakiChain</span>
            </div>
            <p className="text-gray-400 mb-4">
              Blockchain-powered legal justice platform connecting NGOs, donors, and lawyers for positive social impact.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/bounties" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Explore Bounties
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Email: info@hakichain.com
              </li>
              <li className="text-gray-400">
                Support: support@hakichain.com
              </li>
              <li className="text-gray-400">
                Phone: +2540113015464
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HakiChain. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/legal/privacy-policy" className="text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/legal/terms-of-service" className="text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/legal/data-protection" className="text-gray-500 text-sm hover:text-primary-400 transition-colors">
              Data Protection
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
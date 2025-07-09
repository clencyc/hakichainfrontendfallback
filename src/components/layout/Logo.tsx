import { Link } from 'react-router-dom';

export const Logo = ({ to = '/', className = '', textClassName = '' }: { to?: string; className?: string; textClassName?: string }) => (
  <Link to={to} className={`flex items-center space-x-2 ${className}`}>
    <img src="/haki-icon.svg" alt="HakiChain Logo" className="w-8 h-8" />
    <span className={`text-xl font-serif font-bold text-primary-500 ${textClassName}`}>HakiChain</span>
  </Link>
); 
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ContentSection = ({ children, className = '', delay = 0 }: ContentSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`mb-16 ${className}`}
    >
      {children}
    </motion.section>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export const SectionHeader = ({ title, subtitle, icon: Icon, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center mb-4">
        {Icon && <div className="mr-3 text-primary-600"><Icon className="w-6 h-6" /></div>}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface InfoCardProps {
  title: string;
  children: ReactNode;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'highlight' | 'warning' | 'info' | 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

export const InfoCard = ({ title, children, description, icon: Icon, variant = 'default', className = '' }: InfoCardProps) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-card',
    highlight: 'bg-primary-50 border-primary-200 shadow-card',
    warning: 'bg-warning-50 border-warning-200 shadow-card',
    info: 'bg-secondary-50 border-secondary-200 shadow-card',
    primary: 'bg-primary-50 border-primary-200 shadow-card',
    secondary: 'bg-secondary-50 border-secondary-200 shadow-card',
    accent: 'bg-accent-50 border-accent-200 shadow-card',
    success: 'bg-success-50 border-success-200 shadow-card'
  };

  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start mb-4">
        {Icon && <div className="mr-3 text-primary-600"><Icon className="w-5 h-5" /></div>}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

interface AlertBoxProps {
  title: string;
  children: ReactNode;
  type: 'info' | 'warning' | 'success' | 'error';
  icon?: ReactNode;
}

export const AlertBox = ({ title, children, type, icon }: AlertBoxProps) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-error-50 border-error-200 text-error-800'
  };

  return (
    <div className={`border-l-4 border-current p-6 rounded-r-lg mb-8 ${typeClasses[type]}`}>
      <div className="flex items-start">
        {icon && <div className="mr-3 mt-1 flex-shrink-0">{icon}</div>}
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <div className="leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  gradient?: 'primary' | 'secondary' | 'accent';
}

export const PageHeader = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  gradient = 'primary' 
}: PageHeaderProps) => {
  const gradientClasses = {
    primary: 'from-primary-900 via-primary-800 to-secondary-900',
    secondary: 'from-secondary-900 via-secondary-800 to-primary-900',
    accent: 'from-accent-900 via-accent-800 to-primary-900'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r ${gradientClasses[gradient]} text-white py-16 md:py-20`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mr-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-primary-200 mt-2">
                {subtitle}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-200 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}; 
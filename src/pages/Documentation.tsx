import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, FileText, Code, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        { title: 'Introduction to HakiChain', link: '/docs/intro' },
        { title: 'Quick Start Guide', link: '/docs/quickstart' },
        { title: 'Platform Overview', link: '/docs/overview' }
      ]
    },
    {
      title: 'User Guides',
      icon: FileText,
      items: [
        { title: 'For NGOs', link: '/docs/ngo-guide' },
        { title: 'For Lawyers', link: '/docs/lawyer-guide' },
        { title: 'For Donors', link: '/docs/donor-guide' }
      ]
    },
    {
      title: 'Technical Documentation',
      icon: Code,
      items: [
        { title: 'Smart Contracts', link: '/docs/smart-contracts' },
        { title: 'API Reference', link: '/docs/api' },
        { title: 'Blockchain Integration', link: '/docs/blockchain' }
      ]
    },
    {
      title: 'Platform Features',
      icon: Settings,
      items: [
        { title: 'Legal Bounties', link: '/docs/bounties' },
        { title: 'Milestone System', link: '/docs/milestones' },
        { title: 'Lawyer Matching', link: '/docs/matching' }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-200 mb-8">
            Everything you need to know about using HakiChain
          </p>

          <div className="max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>

                <ul className="space-y-3">
                  {section.items.map(item => (
                    <li key={item.title}>
                      <Link
                        to={item.link}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{item.title}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
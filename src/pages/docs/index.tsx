import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection } from '../../components/common/ContentSection';
import { InfoCard } from '../../components/common/ContentSection';
import { 
  BookOpen, 
  Rocket, 
  Globe, 
  FileCode, 
  Database, 
  Users, 
  Scale, 
  Target,
  ArrowRight,
  Search,
  Book,
  Shield
} from 'lucide-react';

const DocumentationIndex: React.FC = () => {
  const docSections = [
    {
      title: 'Getting Started',
      description: 'Essential guides to get you started with HakiChain',
      icon: Rocket,
      items: [
        { title: 'Introduction', path: '/docs/intro', description: 'Welcome to HakiChain platform' },
        { title: 'Quick Start Guide', path: '/docs/quickstart', description: 'Get up and running quickly' },
        { title: 'Platform Overview', path: '/docs/overview', description: 'Understanding the platform architecture' }
      ]
    },
    {
      title: 'Technical Documentation',
      description: 'Deep dive into technical aspects and integrations',
      icon: FileCode,
      items: [
        { title: 'Smart Contracts', path: '/docs/smart-contracts', description: 'Smart contract architecture and functions' },
        { title: 'API Reference', path: '/docs/api', description: 'Complete API documentation' },
        { title: 'Blockchain Integration', path: '/docs/blockchain', description: 'How to integrate with the blockchain' }
      ]
    },
    {
      title: 'Core Features',
      description: 'Detailed guides for platform features',
      icon: Target,
      items: [
        { title: 'Legal Bounties', path: '/docs/bounties', description: 'Creating and managing legal bounties' },
        { title: 'Milestone System', path: '/docs/milestones', description: 'Understanding milestone-based payments' },
        { title: 'Lawyer Matching', path: '/docs/matching', description: 'AI-powered lawyer matching system' }
      ]
    },
    {
      title: 'User Guides',
      description: 'Role-specific guides for different user types',
      icon: Users,
      items: [
        { title: 'NGO Guide', path: '/docs/ngo-guide', description: 'Complete guide for NGOs' },
        { title: 'Lawyer Guide', path: '/docs/lawyer-guide', description: 'Guide for legal professionals' }
      ]
    }
  ];

  const quickLinks = [
    { title: 'FAQ', path: '/faq', icon: Search },
    { title: 'Case Studies', path: '/case-studies', icon: Book },
    { title: 'Legal Notice', path: '/legal/terms-of-service', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Documentation"
        subtitle="Complete guides and references for the HakiChain platform"
        icon={BookOpen}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to HakiChain Documentation</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                This comprehensive documentation will help you understand and effectively use the HakiChain platform. 
                Whether you're an NGO looking to create legal bounties, a lawyer seeking cases, or a developer 
                integrating with our blockchain, you'll find everything you need here.
              </p>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit our FAQ section
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Scale className="w-4 h-4 mr-2" />
                  Check case studies for examples
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Review legal documentation
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <div className="space-y-8">
          {docSections.map((section) => (
            <ContentSection key={section.title}>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <section.icon className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-gray-600">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group block"
                  >
                    <InfoCard
                      title={item.title}
                      description={item.description}
                      variant="default"
                      className="h-full group-hover:shadow-lg transition-all duration-200 group-hover:border-primary-300"
                    >
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-primary-600 text-sm font-medium">Read Guide</span>
                        <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </InfoCard>
                  </Link>
                ))}
              </div>
            </ContentSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationIndex; 
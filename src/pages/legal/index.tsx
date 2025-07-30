import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection } from '../../components/common/ContentSection';
import { InfoCard } from '../../components/common/ContentSection';
import { 
  Scale, 
  Shield, 
  FileText, 
  UserCheck, 
  Lock, 
  Eye, 
  Gift, 
  ArrowRight,
  BookOpen,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const LegalIndex: React.FC = () => {
  const legalSections = [
    {
      title: 'Terms & Policies',
      description: 'Essential legal documents for platform usage',
      icon: FileText,
      items: [
        { 
          title: 'Terms of Service', 
          path: '/legal/terms-of-service', 
          description: 'Platform terms and conditions',
          icon: Scale,
          variant: 'primary' as const
        },
        { 
          title: 'Privacy Policy', 
          path: '/legal/privacy-policy', 
          description: 'How we handle your data',
          icon: Shield,
          variant: 'primary' as const
        }
      ]
    },
    {
      title: 'Compliance & Security',
      description: 'Regulatory compliance and security policies',
      icon: Shield,
      items: [
        { 
          title: 'KYC & AML Policy', 
          path: '/legal/kyc-aml', 
          description: 'Know Your Customer and Anti-Money Laundering',
          icon: UserCheck,
          variant: 'info' as const
        },
        { 
          title: 'Data Protection Policy', 
          path: '/legal/data-protection', 
          description: 'GDPR and data protection compliance',
          icon: Lock,
          variant: 'info' as const
        },
        { 
          title: 'Consumer Protection', 
          path: '/legal/consumer-protection', 
          description: 'Consumer rights and protections',
          icon: Eye,
          variant: 'info' as const
        }
      ]
    },
    {
      title: 'Platform Information',
      description: 'Technical and operational documentation',
      icon: BookOpen,
      items: [
        { 
          title: 'Whitepaper', 
          path: '/legal/whitepaper', 
          description: 'Technical whitepaper and tokenomics',
          icon: FileText,
          variant: 'secondary' as const
        },
        { 
          title: 'Donor Guide', 
          path: '/legal/donor-guide', 
          description: 'Guide for donors and contributors',
          icon: Gift,
          variant: 'secondary' as const
        }
      ]
    }
  ];

  const importantNotices = [
    {
      title: 'Platform Compliance',
      description: 'HakiChain operates in full compliance with applicable laws and regulations.',
      icon: CheckCircle,
      variant: 'success' as const
    },
    {
      title: 'Data Security',
      description: 'Your data is protected with enterprise-grade security measures.',
      icon: Shield,
      variant: 'info' as const
    },
    {
      title: 'Transparent Operations',
      description: 'All platform operations are transparent and auditable on the blockchain.',
      icon: Eye,
      variant: 'primary' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Legal & Policies"
        subtitle="Important legal documents, terms, and policies for the HakiChain platform"
        icon={Scale}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Framework</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                HakiChain operates within a comprehensive legal framework designed to protect all participants 
                while ensuring compliance with international regulations. Our legal documents are regularly 
                updated to reflect current laws and best practices.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please read all legal documents carefully before using the platform. By using HakiChain, 
                      you agree to be bound by these terms and policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {importantNotices.map((notice) => (
                <InfoCard
                  key={notice.title}
                  title={notice.title}
                  description={notice.description}
                  icon={notice.icon}
                  variant={notice.variant}
                  className="mb-0"
                />
              ))}
            </div>
          </div>
        </ContentSection>

        <div className="space-y-8">
          {legalSections.map((section) => (
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
                      icon={item.icon}
                      variant={item.variant}
                      className="h-full group-hover:shadow-lg transition-all duration-200 group-hover:border-primary-300"
                    >
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-primary-600 text-sm font-medium">Read Document</span>
                        <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </InfoCard>
                  </Link>
                ))}
              </div>
            </ContentSection>
          ))}
        </div>

        <ContentSection>
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Our Legal Documents?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have any questions about our terms, policies, or legal framework, 
              please don't hesitate to contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/faq"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Visit FAQ
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default LegalIndex; 
import { motion } from 'framer-motion';
import { Globe, Users, Shield, Coins, ArrowRight, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const PlatformOverview = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Globe}
        title="Platform Overview"
        subtitle="Comprehensive guide to HakiChain's features and capabilities"
        description="Explore the complete ecosystem of HakiChain, from core features and user roles to technical architecture and governance systems."
        gradient="accent"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Platform Architecture */}
          <ContentSection>
            <SectionHeader
              title="Platform Architecture"
              subtitle="Understanding the technical foundation of HakiChain"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain is built on a robust, scalable architecture that combines blockchain technology 
                with modern web applications to create a secure, transparent, and efficient legal services platform.
              </p>
            </div>
          </ContentSection>

          {/* Core Components */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Core Platform Components"
              subtitle="The building blocks that power HakiChain"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Smart Contract Layer">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Legal Bounty Contracts</h4>
                    <p className="text-primary-800 text-sm">Automated bounty creation and management</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Milestone Escrow</h4>
                    <p className="text-secondary-800 text-sm">Secure payment release based on progress</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Token Management</h4>
                    <p className="text-accent-800 text-sm">HAKI token distribution and governance</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Application Layer" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Web Interface</h4>
                      <p className="text-sm text-gray-600">User-friendly platform for all participants</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Mobile Support</h4>
                      <p className="text-sm text-gray-600">Responsive design for mobile devices</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">API Integration</h4>
                      <p className="text-sm text-gray-600">RESTful APIs for third-party integration</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* User Roles */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="User Roles & Permissions"
              subtitle="Understanding different user types and their capabilities"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="NGOs">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Case Submitters</h4>
                  <p className="text-sm text-gray-600 mb-4">Submit legal cases for funding and assistance</p>
                  <ul className="text-xs text-gray-600 space-y-1 text-left">
                    <li>• Create legal bounties</li>
                    <li>• Manage case progress</li>
                    <li>• Track impact metrics</li>
                    <li>• Communicate with lawyers</li>
                  </ul>
                </div>
              </InfoCard>
              <InfoCard title="Lawyers" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Professionals</h4>
                  <p className="text-sm text-gray-600 mb-4">Provide legal services and representation</p>
                  <ul className="text-xs text-gray-600 space-y-1 text-left">
                    <li>• Apply for legal cases</li>
                    <li>• Submit milestone updates</li>
                    <li>• Receive secure payments</li>
                    <li>• Build reputation scores</li>
                  </ul>
                </div>
              </InfoCard>
              <InfoCard title="Donors" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Impact Investors</h4>
                  <p className="text-sm text-gray-600 mb-4">Fund legal cases and track social impact</p>
                  <ul className="text-xs text-gray-600 space-y-1 text-left">
                    <li>• Fund legal bounties</li>
                    <li>• Track case progress</li>
                    <li>• Monitor impact metrics</li>
                    <li>• Receive transparency reports</li>
                  </ul>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Key Features */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Key Platform Features"
              subtitle="Innovative tools and systems that power legal justice"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Legal Bounty System">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Transparent Funding</h4>
                    <p className="text-primary-800 text-sm">Clear allocation and tracking of legal funds</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Milestone Payments</h4>
                    <p className="text-secondary-800 text-sm">Payments released based on case progress</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Impact Measurement</h4>
                    <p className="text-accent-800 text-sm">Quantifiable outcomes and social impact</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Lawyer Matching" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">AI-Powered Matching</h4>
                      <p className="text-sm text-gray-600">Intelligent case-lawyer pairing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Reputation System</h4>
                      <p className="text-sm text-gray-600">Verified lawyer ratings and reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Specialization Matching</h4>
                      <p className="text-sm text-gray-600">Expertise-based case assignment</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Token Economy */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="HAKI Token Economy"
              subtitle="Understanding our digital currency and its utility"
              icon={<Coins className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Digital Currency for Justice"
              type="info"
              icon={<Coins className="w-6 h-6" />}
            >
              <p>
                HAKI tokens are the native digital currency of the HakiChain ecosystem, facilitating 
                transparent transactions, incentivizing participation, and enabling global access to legal services.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Token Utility">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Payment Method</h4>
                    <p className="text-primary-800 text-sm">Primary currency for legal services</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Governance</h4>
                    <p className="text-secondary-800 text-sm">Voting rights on platform decisions</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Staking</h4>
                    <p className="text-accent-800 text-sm">Earn rewards by staking tokens</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Token Distribution" variant="info">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <h4 className="text-2xl font-bold text-primary-600 mb-1">40%</h4>
                    <p className="text-sm text-gray-600">Legal Services</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <h4 className="text-2xl font-bold text-secondary-600 mb-1">30%</h4>
                    <p className="text-sm text-gray-600">Platform Operations</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <h4 className="text-2xl font-bold text-accent-600 mb-1">20%</h4>
                    <p className="text-sm text-gray-600">Community Rewards</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <h4 className="text-2xl font-bold text-success-600 mb-1">10%</h4>
                    <p className="text-sm text-gray-600">Reserve Fund</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Economic Model" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Deflationary</h4>
                      <p className="text-sm text-gray-600">Token burn mechanism reduces supply</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Utility-Driven</h4>
                      <p className="text-sm text-gray-600">Value based on platform usage</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparent</h4>
                      <p className="text-sm text-gray-600">All transactions publicly verifiable</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Security & Compliance */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Security & Compliance"
              subtitle="Enterprise-grade security and regulatory compliance"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Security Measures">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Blockchain Security</h4>
                    <p className="text-primary-800 text-sm">Immutable records and cryptographic protection</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Multi-Factor Authentication</h4>
                    <p className="text-secondary-800 text-sm">Enhanced account security measures</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Regular Audits</h4>
                    <p className="text-accent-800 text-sm">Third-party security assessments</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Compliance Framework" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">KYC/AML</h4>
                      <p className="text-sm text-gray-600">Know Your Customer and Anti-Money Laundering</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">GDPR</h4>
                      <p className="text-sm text-gray-600">Data protection and privacy compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Standards</h4>
                      <p className="text-sm text-gray-600">Compliance with legal service regulations</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Governance */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Platform Governance"
              subtitle="Decentralized decision-making and community participation"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Governance Structure">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Token Voting</h4>
                    <p className="text-primary-800 text-sm">HAKI token holders vote on proposals</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Community Proposals</h4>
                    <p className="text-secondary-800 text-sm">Users can submit governance proposals</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Transparent Execution</h4>
                    <p className="text-accent-800 text-sm">All decisions publicly recorded</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Governance Areas" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Platform Updates</h4>
                      <p className="text-sm text-gray-600">Feature additions and improvements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Fee Structures</h4>
                      <p className="text-sm text-gray-600">Transaction and service fees</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Policy Changes</h4>
                      <p className="text-sm text-gray-600">Platform policies and procedures</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Roadmap */}
          <ContentSection delay={0.7}>
            <SectionHeader
              title="Platform Roadmap"
              subtitle="Future development and expansion plans"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Phase 1: Foundation">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Core Platform</h4>
                  <p className="text-sm text-gray-600">Basic bounty system and lawyer matching</p>
                  <div className="mt-4 p-2 bg-primary-50 rounded">
                    <p className="text-primary-800 text-xs">Q1-Q2 2024</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Phase 2: Expansion" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Advanced Features</h4>
                  <p className="text-sm text-gray-600">AI matching, mobile apps, advanced analytics</p>
                  <div className="mt-4 p-2 bg-secondary-50 rounded">
                    <p className="text-secondary-800 text-xs">Q3-Q4 2024</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Phase 3: Scale" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-sm text-gray-600">International expansion and partnerships</p>
                  <div className="mt-4 p-2 bg-accent-50 rounded">
                    <p className="text-accent-800 text-xs">2025+</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.8}>
            <div className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Explore Further?</h2>
              <p className="text-xl mb-6 text-accent-100">
                Dive deeper into specific aspects of the HakiChain platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/docs/smart-contracts" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Smart Contracts</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/docs/api" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  API Documentation
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
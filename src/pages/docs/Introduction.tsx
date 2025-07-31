import { motion } from 'framer-motion';
import { Book, Shield, Users, Coins, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const Introduction = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Book}
        title="Introduction to HakiChain"
        subtitle="Revolutionizing Legal Access Through Blockchain Technology"
        description="Discover how HakiChain is democratizing legal services by connecting NGOs, donors, and lawyers through transparent blockchain technology and innovative bounty systems."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* What is HakiChain */}
          <ContentSection>
            <SectionHeader
              title="What is HakiChain?"
              subtitle="A revolutionary platform bridging the gap between legal need and access"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain is a blockchain-based platform that democratizes access to legal services by creating 
                a transparent, efficient, and secure ecosystem where NGOs can create legal bounties, donors can 
                fund them, and qualified lawyers can provide professional legal assistance to those in need.
              </p>
            </div>
          </ContentSection>

          {/* Core Mission */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Our Mission"
              subtitle="Making justice accessible to everyone, everywhere"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Democratizing Legal Access">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Universal Access</h4>
                      <p className="text-sm text-gray-600">Breaking down barriers to legal services</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparency</h4>
                      <p className="text-sm text-gray-600">Full visibility into legal processes and funding</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Efficiency</h4>
                      <p className="text-sm text-gray-600">Streamlined processes reduce costs and delays</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Building Trust" variant="highlight">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Blockchain Security</h4>
                    <p className="text-primary-800 text-sm">Immutable records ensure transparency and trust</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Verified Professionals</h4>
                    <p className="text-secondary-800 text-sm">All lawyers undergo thorough verification</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Impact Tracking</h4>
                    <p className="text-accent-800 text-sm">Real-time tracking of legal outcomes and impact</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* How It Works */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="How HakiChain Works"
              subtitle="The complete ecosystem for legal justice"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Step 1: Case Submission">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">NGOs Submit Cases</h4>
                  <p className="text-sm text-gray-600">Registered NGOs submit legal cases requiring assistance</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 2: Bounty Creation" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Bounties</h4>
                  <p className="text-sm text-gray-600">Platform creates funded legal bounties for approved cases</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 3: Lawyer Matching" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Assignment</h4>
                  <p className="text-sm text-gray-600">Qualified lawyers are matched and assigned to cases</p>
                </div>
              </InfoCard>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <InfoCard title="Step 4: Legal Services">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-success-600">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Representation</h4>
                  <p className="text-sm text-gray-600">Lawyers provide comprehensive legal services</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 5: Milestone Tracking" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-warning-600">5</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Progress Monitoring</h4>
                  <p className="text-sm text-gray-600">Case progress tracked through milestone system</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 6: Impact Delivery" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-error-600">6</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Justice Served</h4>
                  <p className="text-sm text-gray-600">Legal outcomes delivered and impact measured</p>
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
              <InfoCard title="Smart Contract Technology" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Automated Execution</h4>
                      <p className="text-sm text-gray-600">Self-executing contracts ensure compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Immutable Records</h4>
                      <p className="text-sm text-gray-600">All transactions permanently recorded</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparent Auditing</h4>
                      <p className="text-sm text-gray-600">Public verification of all activities</p>
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
              <InfoCard title="For Donors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Impact Investment</h4>
                  <p className="text-sm text-gray-600">Fund legal cases and track social impact</p>
                </div>
              </InfoCard>
              <InfoCard title="For Lawyers" variant="info">
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                  <p className="text-sm text-gray-600">Receive payments for legal services rendered</p>
                </div>
              </InfoCard>
              <InfoCard title="For NGOs" variant="highlight">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-accent-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Resource Management</h4>
                  <p className="text-sm text-gray-600">Efficiently manage legal funding and resources</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Benefits */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Benefits of HakiChain"
              subtitle="Why choose our platform for legal services"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="For Vulnerable Communities">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Access to Justice</h4>
                      <p className="text-sm text-gray-600">Professional legal representation regardless of financial means</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparency</h4>
                      <p className="text-sm text-gray-600">Full visibility into case progress and outcomes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                      <p className="text-sm text-gray-600">Verified lawyers with proven track records</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="For Legal Professionals" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">New Opportunities</h4>
                      <p className="text-sm text-gray-600">Access to cases and clients worldwide</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Payments</h4>
                      <p className="text-sm text-gray-600">Guaranteed payments through smart contracts</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Growth</h4>
                      <p className="text-sm text-gray-600">Build reputation and expand practice areas</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.6}>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Revolution?</h2>
              <p className="text-xl mb-6 text-primary-100">
                Start your journey with HakiChain and be part of the future of legal services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/docs/quickstart" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Quick Start Guide
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
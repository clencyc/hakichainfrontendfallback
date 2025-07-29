import { motion } from 'framer-motion';
import { Zap, Users, Shield, Wallet, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const QuickStart = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Zap}
        title="Quick Start Guide"
        subtitle="Get up and running with HakiChain in minutes"
        description="Follow this step-by-step guide to quickly set up your account, understand the platform, and start participating in the HakiChain ecosystem."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Prerequisites */}
          <ContentSection>
            <SectionHeader
              title="Prerequisites"
              subtitle="What you need before getting started"
            />
            
            <AlertBox
              title="Essential Requirements"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                Before you can use HakiChain, you'll need a digital wallet and basic understanding of blockchain technology. 
                Don't worry if you're new to this - we'll guide you through everything!
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Digital Wallet">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">MetaMask</h4>
                    <p className="text-primary-800 text-sm">Most popular browser extension wallet</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">TrustWallet</h4>
                    <p className="text-secondary-800 text-sm">Excellent mobile wallet option</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Other Options</h4>
                    <p className="text-accent-800 text-sm">Coinbase Wallet, Rainbow, or similar</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Basic Requirements" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Internet Connection</h4>
                      <p className="text-sm text-gray-600">Stable internet for platform access</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Valid ID</h4>
                      <p className="text-sm text-gray-600">For KYC verification process</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Address</h4>
                      <p className="text-sm text-gray-600">For account communication</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Step 1: Account Setup */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Step 1: Account Setup"
              subtitle="Create your HakiChain account"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="1.1 Registration">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
                  <p className="text-sm text-gray-600">Visit our registration page and fill in your details</p>
                </div>
              </InfoCard>
              <InfoCard title="1.2 Verification" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Verification</h4>
                  <p className="text-sm text-gray-600">Verify your email address to activate your account</p>
                </div>
              </InfoCard>
              <InfoCard title="1.3 Profile Setup" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Profile</h4>
                  <p className="text-sm text-gray-600">Add your personal and professional information</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Step 2: Wallet Connection */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Step 2: Wallet Connection"
              subtitle="Connect your digital wallet to HakiChain"
              icon={<Wallet className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Wallet Security"
              type="info"
              icon={<Shield className="w-6 h-6" />}
            >
              <p>
                <strong>Important:</strong> Never share your private keys or seed phrases with anyone. 
                HakiChain will never ask for these sensitive details.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Wallet Setup Process">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-primary-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Install Wallet</h4>
                      <p className="text-sm text-gray-600">Download and install your chosen digital wallet</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-secondary-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Create Wallet</h4>
                      <p className="text-sm text-gray-600">Set up your wallet and secure your private keys</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-accent-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Connect to Platform</h4>
                      <p className="text-sm text-gray-600">Connect your wallet to HakiChain</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Supported Networks" variant="highlight">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Ethereum Mainnet</h4>
                    <p className="text-primary-800 text-sm">Primary network for HakiChain operations</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Polygon</h4>
                    <p className="text-secondary-800 text-sm">Low-cost alternative for transactions</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Test Networks</h4>
                    <p className="text-accent-800 text-sm">For testing and development purposes</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Step 3: KYC Verification */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Step 3: KYC Verification"
              subtitle="Complete identity verification for platform access"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Verification Process">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Document Upload</h4>
                    <p className="text-primary-800 text-sm">Upload government-issued ID and proof of address</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Identity Verification</h4>
                    <p className="text-secondary-800 text-sm">Automated and manual verification processes</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Approval</h4>
                    <p className="text-accent-800 text-sm">Account activation upon successful verification</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Required Documents" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Government ID</h4>
                      <p className="text-sm text-gray-600">Passport, national ID, or driver's license</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Proof of Address</h4>
                      <p className="text-sm text-gray-600">Utility bill or bank statement (last 3 months)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Credentials</h4>
                      <p className="text-sm text-gray-600">For lawyers: bar license and certifications</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Step 4: Platform Navigation */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Step 4: Platform Navigation"
              subtitle="Learn to navigate and use HakiChain effectively"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Main Dashboard">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Overview</h4>
                    <p className="text-primary-800 text-sm">View your account summary and recent activity</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Quick Actions</h4>
                    <p className="text-secondary-800 text-sm">Access frequently used features and functions</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Notifications</h4>
                    <p className="text-accent-800 text-sm">Stay updated with platform alerts and updates</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Key Features" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bounty Explorer</h4>
                      <p className="text-sm text-gray-600">Browse available legal cases and bounties</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Wallet Management</h4>
                      <p className="text-sm text-gray-600">Manage your HAKI tokens and transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Case Tracking</h4>
                      <p className="text-sm text-gray-600">Monitor progress of your legal cases</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Step 5: First Actions */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Step 5: Your First Actions"
              subtitle="Start participating in the HakiChain ecosystem"
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="For Donors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">💰</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fund a Bounty</h4>
                  <p className="text-sm text-gray-600">Browse cases and contribute to legal bounties</p>
                  <div className="mt-4">
                    <Link to="/bounties" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Explore Bounties →
                    </Link>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="For Lawyers" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">⚖️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Apply for Cases</h4>
                  <p className="text-sm text-gray-600">Submit applications for legal cases</p>
                  <div className="mt-4">
                    <Link to="/bounties" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                      View Cases →
                    </Link>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="For NGOs" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">🏛️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create Bounty</h4>
                  <p className="text-sm text-gray-600">Submit legal cases for funding</p>
                  <div className="mt-4">
                    <Link to="/create-bounty" className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                      Create Bounty →
                    </Link>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Best Practices */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Best Practices"
              subtitle="Tips for optimal platform usage and security"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Security Tips">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Your Wallet</h4>
                      <p className="text-sm text-gray-600">Use hardware wallets for large amounts</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Enable 2FA</h4>
                      <p className="text-sm text-gray-600">Add two-factor authentication to your account</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Updates</h4>
                      <p className="text-sm text-gray-600">Keep your wallet software updated</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Platform Tips" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Complete Profile</h4>
                      <p className="text-sm text-gray-600">Fill out all profile information for better matching</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Stay Active</h4>
                      <p className="text-sm text-gray-600">Regular engagement improves your platform experience</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Read Documentation</h4>
                      <p className="text-sm text-gray-600">Familiarize yourself with platform features</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Next Steps */}
          <ContentSection delay={0.7}>
            <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
              <p className="text-xl mb-6 text-secondary-100">
                Now that you're familiar with the basics, explore these resources to dive deeper.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/docs/overview" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Platform Overview</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/bounties" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Explore Bounties
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
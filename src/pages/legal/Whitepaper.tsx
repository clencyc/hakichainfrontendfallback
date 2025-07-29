import { motion } from 'framer-motion';
import { Book, Wallet, Coins, Shield, Users, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const Whitepaper = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Book}
        title="HakiChain Whitepaper"
        subtitle="Blockchain Technology for Legal Professionals"
        description="A comprehensive guide to understanding how blockchain and tokens work within the HakiChain platform, designed specifically for legal professionals who may be new to blockchain technology."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Executive Summary */}
          <ContentSection>
            <SectionHeader
              title="Executive Summary"
              subtitle="Understanding the revolutionary impact of blockchain on legal services"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain is a revolutionary blockchain-based platform designed to democratize access to legal services 
                through a transparent, secure, and efficient bounty system. This whitepaper explains how blockchain 
                technology and digital tokens work within our platform, specifically tailored for legal professionals 
                who may be new to blockchain technology.
              </p>
            </div>
          </ContentSection>

          {/* What is Blockchain */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="What is Blockchain?"
              subtitle="Demystifying the technology that powers HakiChain"
              icon={<Shield className="w-8 h-8" />}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Digital Ledger Technology">
                <p className="mb-4">
                  A blockchain is like a digital ledger that records transactions across a network of computers. 
                  Each transaction is verified and recorded in a way that makes it nearly impossible to alter or hack.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Transparent:</strong> All transactions are visible to everyone on the network</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Secure:</strong> Uses advanced cryptography to protect data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Decentralized:</strong> No single entity controls the network</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Immutable:</strong> Once recorded, transactions cannot be changed</span>
                  </li>
                </ul>
              </InfoCard>
              <InfoCard title="Real-World Analogy" variant="highlight">
                <p className="text-gray-700">
                  Think of blockchain like a shared Google Doc where everyone can see the changes, 
                  but no one can delete or modify previous entries. Each new entry builds upon the previous ones, 
                  creating an unbreakable chain of information.
                </p>
                <div className="mt-4 p-4 bg-primary-100 rounded-lg">
                  <p className="text-primary-800 text-sm">
                    <strong>Key Insight:</strong> Just as you trust a bank to keep accurate records of your money, 
                    blockchain provides the same trust through technology rather than a central authority.
                  </p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Digital Wallets */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Digital Wallets: Your Gateway to HakiChain"
              subtitle="Understanding the essential tool for blockchain interaction"
              icon={<Wallet className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Important Prerequisite"
              type="info"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                To interact with HakiChain, you need a digital wallet like MetaMask, TrustWallet, or similar. 
                This is your digital identity and storage for tokens on the platform.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="What is a Digital Wallet?">
                <p className="mb-4">
                  A digital wallet is like a secure digital bank account that allows you to:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Store and manage your HAKI tokens securely</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Make donations to legal bounties</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Receive payments for completed legal work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Verify your identity on the platform</span>
                  </li>
                </ul>
              </InfoCard>
              <InfoCard title="Popular Wallet Options" variant="info">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">MetaMask</h4>
                    <p className="text-sm text-gray-600">Browser extension wallet, most popular for web3</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">TrustWallet</h4>
                    <p className="text-sm text-gray-600">Mobile wallet with excellent security features</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Coinbase Wallet</h4>
                    <p className="text-sm text-gray-600">User-friendly wallet for beginners</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* HakiChain Tokens */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="HAKI Tokens: The Currency of Justice"
              subtitle="Understanding our platform's digital currency"
              icon={<Coins className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <InfoCard title="What are HAKI Tokens?">
                <p className="mb-4">
                  HAKI tokens are the digital currency that powers the HakiChain ecosystem. They represent value 
                  and can be used for various purposes within the platform.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Donations:</strong> Fund legal bounties and cases</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Rewards:</strong> Payment for completed legal work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Governance:</strong> Voting on platform decisions</span>
                  </li>
                </ul>
              </InfoCard>
              <InfoCard title="Token Utility" variant="highlight">
                <div className="space-y-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <h4 className="font-semibold text-primary-900">For Donors</h4>
                    <p className="text-primary-800 text-sm">Fund legal cases and track impact transparently</p>
                  </div>
                  <div className="p-3 bg-secondary-100 rounded-lg">
                    <h4 className="font-semibold text-secondary-900">For Lawyers</h4>
                    <p className="text-secondary-800 text-sm">Receive payments and build reputation</p>
                  </div>
                  <div className="p-3 bg-accent-100 rounded-lg">
                    <h4 className="font-semibold text-accent-900">For NGOs</h4>
                    <p className="text-accent-800 text-sm">Create and manage legal bounties</p>
                  </div>
                </div>
              </InfoCard>
            </div>

            <AlertBox
              title="Token Conversion"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Off-Ramp Process:</strong> HAKI tokens can be converted to traditional currency through 
                our partnered exchange services. The platform handles the conversion process, ensuring lawyers 
                receive payments in their preferred currency.
              </p>
            </AlertBox>
          </ContentSection>

          {/* On-Ramp/Off-Ramp */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="On-Ramp and Off-Ramp: Converting Between Currencies"
              subtitle="Understanding how to convert between traditional and digital currencies"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="On-Ramp Process" variant="info">
                <p className="mb-4">
                  Converting traditional currency (USD, EUR, KES) to HAKI tokens:
                </p>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Connect your digital wallet to HakiChain</li>
                  <li>Select the amount you want to convert</li>
                  <li>Choose your payment method (bank transfer, card, mobile money)</li>
                  <li>Complete the transaction through our secure payment processor</li>
                  <li>HAKI tokens are automatically added to your wallet</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> On-ramp fees are typically 1-3% depending on payment method and amount.
                  </p>
                </div>
              </InfoCard>
              <InfoCard title="Off-Ramp Process" variant="highlight">
                <p className="mb-4">
                  Converting HAKI tokens back to traditional currency:
                </p>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Navigate to the withdrawal section in your wallet</li>
                  <li>Select the amount of HAKI tokens to convert</li>
                  <li>Choose your preferred currency and payment method</li>
                  <li>Provide necessary banking information</li>
                  <li>Funds are transferred within 1-3 business days</li>
                </ol>
                <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                  <p className="text-primary-800 text-sm">
                    <strong>Platform Support:</strong> HakiChain handles the conversion process, ensuring 
                    lawyers receive payments reliably and securely.
                  </p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Financial Security and Reserves */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Financial Security and Token Reserves"
              subtitle="Ensuring the stability and security of the HakiChain ecosystem"
            />
            
            <InfoCard title="Token Reserve System" variant="highlight">
              <p className="mb-6">
                HakiChain maintains a robust reserve system to ensure the stability and liquidity of HAKI tokens:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-success-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security Reserve</h4>
                  <p className="text-sm text-gray-600">20% of all tokens held for platform security</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coins className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Liquidity Reserve</h4>
                  <p className="text-sm text-gray-600">30% maintained for smooth conversions</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operational Reserve</h4>
                  <p className="text-sm text-gray-600">50% available for platform operations</p>
                </div>
              </div>
            </InfoCard>

            <AlertBox
              title="Transparency Commitment"
              type="success"
              icon={<CheckCircle className="w-6 h-6" />}
            >
              <p>
                All reserve allocations and financial transactions are publicly verifiable on the blockchain. 
                Regular audits and reports ensure complete transparency for all stakeholders.
              </p>
            </AlertBox>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.6}>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Future of Legal Services?</h2>
              <p className="text-xl mb-6 text-primary-100">
                Start your journey with HakiChain and be part of the revolution in legal accessibility.
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
                  to="/documentation" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
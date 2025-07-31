import { motion } from 'framer-motion';
import { Code, Shield, Coins, FileText, ArrowRight, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const SmartContracts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Code}
        title="Smart Contracts"
        subtitle="Technical documentation for HakiChain's blockchain infrastructure"
        description="Comprehensive guide to HakiChain's smart contracts, including contract architecture, functions, security measures, and integration patterns."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <ContentSection>
            <SectionHeader
              title="Smart Contract Overview"
              subtitle="Understanding HakiChain's blockchain infrastructure"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain's smart contracts form the backbone of our decentralized legal services platform, 
                ensuring transparency, security, and automated execution of legal agreements and payments.
              </p>
            </div>
          </ContentSection>

          {/* Contract Architecture */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Contract Architecture"
              subtitle="The structure and relationships between smart contracts"
              icon={<Database className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Core Contracts">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">LegalBounty.sol</h4>
                    <p className="text-primary-800 text-sm">Main contract for bounty creation and management</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">MilestoneEscrow.sol</h4>
                    <p className="text-secondary-800 text-sm">Escrow system for milestone-based payments</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">HakiToken.sol</h4>
                    <p className="text-accent-800 text-sm">ERC-20 token contract for HAKI tokens</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Supporting Contracts" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">ReputationSystem.sol</h4>
                      <p className="text-sm text-gray-600">Lawyer reputation and rating management</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">DocumentRegistry.sol</h4>
                      <p className="text-sm text-gray-600">IPFS-based document storage and verification</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Governance.sol</h4>
                      <p className="text-sm text-gray-600">DAO governance and voting mechanisms</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* LegalBounty Contract */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="LegalBounty Contract"
              subtitle="Core contract for legal bounty management"
              icon={<FileText className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Contract Address"
              type="info"
              icon={<Database className="w-6 h-6" />}
            >
              <p>
                <strong>Mainnet:</strong> 0x1234567890123456789012345678901234567890<br />
                <strong>Testnet:</strong> 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Key Functions">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">createBounty()</h4>
                    <p className="text-primary-800 text-sm">Create a new legal bounty with funding</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">applyForBounty()</h4>
                    <p className="text-secondary-800 text-sm">Lawyers apply for available bounties</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">assignLawyer()</h4>
                    <p className="text-accent-800 text-sm">Assign lawyer to bounty after review</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="State Management" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bounty States</h4>
                      <p className="text-sm text-gray-600">Open, Assigned, In Progress, Completed</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Funding Tracking</h4>
                      <p className="text-sm text-gray-600">Real-time funding status and allocation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Dispute Resolution</h4>
                      <p className="text-sm text-gray-600">Automated dispute handling mechanisms</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* MilestoneEscrow Contract */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="MilestoneEscrow Contract"
              subtitle="Secure payment system for milestone-based legal work"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Escrow Functions">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">createMilestone()</h4>
                    <p className="text-primary-800 text-sm">Define payment milestones for legal work</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">submitMilestone()</h4>
                    <p className="text-secondary-800 text-sm">Submit completed milestone for review</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">releasePayment()</h4>
                    <p className="text-accent-800 text-sm">Release payment upon milestone approval</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Security Features" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-Signature</h4>
                      <p className="text-sm text-gray-600">Requires multiple approvals for large payments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Time Locks</h4>
                      <p className="text-sm text-gray-600">Automatic release after time periods</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Dispute Resolution</h4>
                      <p className="text-sm text-gray-600">Arbitration mechanisms for conflicts</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* HakiToken Contract */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="HakiToken Contract"
              subtitle="ERC-20 token implementation for HAKI tokens"
              icon={<Coins className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Token Specifications"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Name:</strong> HakiChain Token<br />
                <strong>Symbol:</strong> HAKI<br />
                <strong>Decimals:</strong> 18<br />
                <strong>Total Supply:</strong> 1,000,000,000 HAKI
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Token Functions">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">transfer()</h4>
                    <p className="text-primary-800 text-sm">Standard ERC-20 transfer function</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">approve()</h4>
                    <p className="text-secondary-800 text-sm">Approve spending for smart contracts</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">burn()</h4>
                    <p className="text-accent-800 text-sm">Deflationary token burn mechanism</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Governance Features" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Voting Rights</h4>
                      <p className="text-sm text-gray-600">Token holders can vote on proposals</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Staking Rewards</h4>
                      <p className="text-sm text-gray-600">Earn rewards by staking tokens</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Liquidity Mining</h4>
                      <p className="text-sm text-gray-600">Provide liquidity and earn rewards</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Security Measures */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Security Measures"
              subtitle="Comprehensive security protocols and best practices"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Access Control">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Role-Based Access</h4>
                    <p className="text-primary-800 text-sm">Different roles with specific permissions</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Multi-Signature Wallets</h4>
                    <p className="text-secondary-800 text-sm">Requires multiple approvals for critical operations</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Timelock Contracts</h4>
                    <p className="text-accent-800 text-sm">Delayed execution for security-critical functions</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Audit & Testing" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Third-Party Audits</h4>
                      <p className="text-sm text-gray-600">Professional security audits by leading firms</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Automated Testing</h4>
                      <p className="text-sm text-gray-600">Comprehensive test suites and coverage</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bug Bounty Program</h4>
                      <p className="text-sm text-gray-600">Rewards for discovering security vulnerabilities</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Integration Guide */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Integration Guide"
              subtitle="How to integrate with HakiChain smart contracts"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Web3 Integration">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Contract ABI</h4>
                    <p className="text-primary-800 text-sm">JSON interface for contract interaction</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Event Listening</h4>
                    <p className="text-secondary-800 text-sm">Real-time updates on contract events</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Gas Optimization</h4>
                    <p className="text-accent-800 text-sm">Efficient transaction execution</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Development Tools" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Hardhat</h4>
                      <p className="text-sm text-gray-600">Development and testing framework</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">OpenZeppelin</h4>
                      <p className="text-sm text-gray-600">Secure contract libraries</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">TypeChain</h4>
                      <p className="text-sm text-gray-600">TypeScript bindings for contracts</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Code Examples */}
          <ContentSection delay={0.7}>
            <SectionHeader
              title="Code Examples"
              subtitle="Practical examples for contract interaction"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Creating a Bounty">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  <pre>{`// Create a new legal bounty
const createBounty = async () => {
  const bountyContract = new ethers.Contract(
    BOUNTY_ADDRESS,
    BOUNTY_ABI,
    signer
  );
  
  const tx = await bountyContract.createBounty(
    "Case Title",
    "Case Description",
    ethers.utils.parseEther("1000"),
    ["milestone1", "milestone2"]
  );
  
  await tx.wait();
};`}</pre>
                </div>
              </InfoCard>
              <InfoCard title="Applying for a Bounty" variant="info">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  <pre>{`// Apply for an available bounty
const applyForBounty = async (bountyId) => {
  const bountyContract = new ethers.Contract(
    BOUNTY_ADDRESS,
    BOUNTY_ABI,
    signer
  );
  
  const tx = await bountyContract.applyForBounty(
    bountyId,
    "Lawyer proposal and credentials"
  );
  
  await tx.wait();
};`}</pre>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Deployment Information */}
          <ContentSection delay={0.8}>
            <SectionHeader
              title="Deployment Information"
              subtitle="Contract addresses and network information"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Network Addresses">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Ethereum Mainnet</h4>
                    <p className="text-primary-800 text-sm font-mono">0x1234...5678</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Polygon</h4>
                    <p className="text-secondary-800 text-sm font-mono">0xabcd...efgh</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Testnet</h4>
                    <p className="text-accent-800 text-sm font-mono">0x9876...4321</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Verification" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Etherscan</h4>
                      <p className="text-sm text-gray-600">Contract source code verified</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Polygonscan</h4>
                      <p className="text-sm text-gray-600">Polygon network verification</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Audit Reports</h4>
                      <p className="text-sm text-gray-600">Public security audit documentation</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.9}>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
              <p className="text-xl mb-6 text-primary-100">
                Start integrating with HakiChain's smart contracts today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/docs/api" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>API Documentation</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a 
                  href="https://github.com/hakichain/contracts" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
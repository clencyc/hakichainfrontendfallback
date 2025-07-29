import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';
import { 
  Link, 
  Wallet, 
  Shield, 
  Zap, 
  Database, 
  Network, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Code,
  Settings,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const BlockchainIntegration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Network}
        title="Blockchain Integration"
        subtitle="Technical Guide"
        description="Learn how to integrate with HakiChain's blockchain infrastructure, interact with smart contracts, and optimize your dApp performance."
        gradient="accent"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <SectionHeader
            title="Blockchain Fundamentals"
            subtitle="Understanding the underlying technology"
            icon={Database}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <InfoCard
              title="What is Blockchain?"
              description="A decentralized, distributed ledger technology that records transactions across multiple computers securely and transparently."
              icon={Network}
              variant="primary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Immutable transaction records
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Decentralized consensus
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cryptographic security
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Ethereum & Polygon"
              description="HakiChain operates on both Ethereum mainnet and Polygon for scalability and cost efficiency."
              icon={Zap}
              variant="secondary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Ethereum: Security & decentralization
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Polygon: Low fees & fast transactions
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cross-chain compatibility
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.1}>
          <SectionHeader
            title="HakiChain Blockchain Architecture"
            subtitle="Our multi-layered blockchain infrastructure"
            icon={Settings}
          />

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <InfoCard
              title="Smart Contract Layer"
              description="Core business logic implemented as smart contracts on Ethereum/Polygon."
              icon={Code}
              variant="primary"
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li>• LegalBounty Contract</li>
                <li>• MilestoneEscrow Contract</li>
                <li>• HakiToken Contract</li>
                <li>• ReputationSystem Contract</li>
              </ul>
            </InfoCard>

            <InfoCard
              title="Oracle Layer"
              description="External data feeds and real-world event verification."
              icon={Shield}
              variant="secondary"
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Legal document verification</li>
                <li>• Court decision feeds</li>
                <li>• Identity verification</li>
                <li>• Payment processing</li>
              </ul>
            </InfoCard>

            <InfoCard
              title="Application Layer"
              description="User interfaces and API services built on top of smart contracts."
              icon={Users}
              variant="accent"
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Web application</li>
                <li>• Mobile app</li>
                <li>• API services</li>
                <li>• Admin dashboard</li>
              </ul>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.2}>
          <SectionHeader
            title="Wallet Integration"
            subtitle="Connecting and managing digital wallets"
            icon={Wallet}
          />

          <AlertBox
            type="info"
            title="Supported Wallets"
            description="HakiChain supports all major Web3 wallets including MetaMask, WalletConnect, Trust Wallet, and Coinbase Wallet."
          />

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">MetaMask Integration</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`// Connect to MetaMask
const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum
        .request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('User rejected request');
    }
  }
};`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">WalletConnect Integration</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`// Connect with WalletConnect
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal
});`}</pre>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.3}>
          <SectionHeader
            title="Smart Contract Interaction"
            subtitle="How to interact with HakiChain smart contracts"
            icon={Code}
          />

          <div className="space-y-6">
            <InfoCard
              title="Contract Addresses"
              description="Official contract addresses for different networks"
              icon={FileText}
              variant="primary"
            >
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="font-medium">Ethereum Mainnet:</span>
                  <code className="text-sm">0x1234...5678</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="font-medium">Polygon:</span>
                  <code className="text-sm">0x8765...4321</code>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="font-medium">Testnet:</span>
                  <code className="text-sm">0xabcd...efgh</code>
                </div>
              </div>
            </InfoCard>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Reading Contract Data</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <pre>{`// Read bounty details
const getBounty = async (bountyId) => {
  const bounty = await bountyContract
    .getBounty(bountyId);
  return bounty;
};`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Writing Contract Data</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <pre>{`// Create new bounty
const createBounty = async () => {
  const tx = await bountyContract
    .createBounty(title, description, amount);
  await tx.wait();
};`}</pre>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.4}>
          <SectionHeader
            title="Gas Optimization"
            subtitle="Minimizing transaction costs"
            icon={Zap}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Gas Estimation"
              description="Estimate gas costs before submitting transactions"
              icon={BarChart3}
              variant="warning"
            >
              <div className="mt-4">
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  <pre>{`// Estimate gas
const gasEstimate = await contract
  .estimateGas.createBounty(...args);
console.log('Gas needed:', gasEstimate.toString());`}</pre>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Gas Price Optimization"
              description="Choose optimal gas prices for faster confirmation"
              icon={TrendingUp}
              variant="success"
            >
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Use gas price APIs
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Batch transactions
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Choose off-peak times
                </div>
              </div>
            </InfoCard>
          </div>

          <AlertBox
            type="warning"
            title="Gas Costs"
            description="Transaction costs vary based on network congestion. Polygon typically offers much lower gas fees than Ethereum mainnet."
          />
        </ContentSection>

        <ContentSection delay={0.5}>
          <SectionHeader
            title="Security Best Practices"
            subtitle="Protecting your blockchain interactions"
            icon={Shield}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              title="Private Key Security"
              description="Never expose private keys or seed phrases"
              icon={Lock}
              variant="error"
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Use hardware wallets for large amounts</li>
                <li>• Store backups securely offline</li>
                <li>• Never share private keys</li>
                <li>• Use multi-signature wallets</li>
              </ul>
            </InfoCard>

            <InfoCard
              title="Transaction Verification"
              description="Always verify transaction details before signing"
              icon={CheckCircle}
              variant="success"
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Check recipient address</li>
                <li>• Verify transaction amount</li>
                <li>• Review gas costs</li>
                <li>• Confirm contract interactions</li>
              </ul>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.6}>
          <SectionHeader
            title="Troubleshooting"
            subtitle="Common issues and solutions"
            icon={AlertTriangle}
          />

          <div className="space-y-6">
            <InfoCard
              title="Transaction Failures"
              description="Common reasons why transactions fail"
              icon={AlertTriangle}
              variant="error"
            >
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <strong>Insufficient Gas:</strong> Increase gas limit or reduce gas price
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <strong>Insufficient Balance:</strong> Ensure wallet has enough tokens for transaction + gas
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <strong>Network Congestion:</strong> Wait or increase gas price for faster processing
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <strong>Contract Errors:</strong> Check if contract state allows the operation
                </div>
              </div>
            </InfoCard>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                title="Network Issues"
                description="Resolving network connectivity problems"
                icon={Network}
                variant="warning"
              >
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• Check internet connection</li>
                  <li>• Verify RPC endpoint</li>
                  <li>• Switch to different node</li>
                  <li>• Clear browser cache</li>
                </ul>
              </InfoCard>

              <InfoCard
                title="Wallet Connection Issues"
                description="Fixing wallet connection problems"
                icon={Wallet}
                variant="warning"
              >
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• Refresh the page</li>
                  <li>• Reconnect wallet</li>
                  <li>• Check wallet permissions</li>
                  <li>• Update wallet extension</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.7}>
          <SectionHeader
            title="Development Resources"
            subtitle="Tools and libraries for blockchain development"
            icon={Code}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="Ethers.js"
              description="Complete Ethereum wallet implementation and utilities"
              icon={Code}
              variant="primary"
            >
              <div className="mt-4">
                <code className="text-sm bg-gray-100 p-2 rounded block">
                  npm install ethers
                </code>
              </div>
            </InfoCard>

            <InfoCard
              title="Web3.js"
              description="Ethereum JavaScript API for interacting with smart contracts"
              icon={Code}
              variant="secondary"
            >
              <div className="mt-4">
                <code className="text-sm bg-gray-100 p-2 rounded block">
                  npm install web3
                </code>
              </div>
            </InfoCard>

            <InfoCard
              title="Hardhat"
              description="Development environment for Ethereum smart contracts"
              icon={Code}
              variant="accent"
            >
              <div className="mt-4">
                <code className="text-sm bg-gray-100 p-2 rounded block">
                  npm install hardhat
                </code>
              </div>
            </InfoCard>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Additional Resources</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-blue-900">Documentation:</strong>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• <Link to="/docs/smart-contracts" className="underline">Smart Contracts Guide</Link></li>
                  <li>• <Link to="/docs/api" className="underline">API Documentation</Link></li>
                  <li>• <a href="https://ethereum.org/developers" target="_blank" rel="noopener noreferrer" className="underline">Ethereum Developer Docs</a></li>
                </ul>
              </div>
              <div>
                <strong className="text-blue-900">Tools:</strong>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="underline">Etherscan</a> - Blockchain explorer</li>
                  <li>• <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer" className="underline">Polygonscan</a> - Polygon explorer</li>
                  <li>• <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="underline">Remix IDE</a> - Smart contract IDE</li>
                </ul>
              </div>
            </div>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default BlockchainIntegration; 
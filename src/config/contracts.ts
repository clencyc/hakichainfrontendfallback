import { ethers } from 'ethers';

// Contract ABIs
import HakiTokenABI from '../../artifacts/contracts/HakiToken.sol/HakiToken.json';
import LegalBountyABI from '../../artifacts/contracts/LegalBounty.sol/LegalBounty.json';
import DocumentRegistryABI from '../../artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json';
import MilestoneEscrowABI from '../../artifacts/contracts/MilestoneEscrow.sol/MilestoneEscrow.json';
import ReputationSystemABI from '../../artifacts/contracts/ReputationSystem.sol/ReputationSystem.json';

// Network configuration
export const NETWORK_CONFIG = {
  liskTestnet: {
    chainId: 4202,
    rpcUrl: 'https://rpc.sepolia-api.lisk.com',
    blockExplorer: 'https://testnet-explorer.lisk.com',
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18
    }
  },
  liskMainnet: {
    chainId: 1135,
    rpcUrl: 'https://lisk.drpc.org',
    blockExplorer: 'https://explorer.lisk.com',
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18
    }
  }
};

// Contract addresses (to be updated after deployment)
export const CONTRACT_ADDRESSES = {
  hakiToken: process.env.VITE_HAKI_TOKEN_ADDRESS || '',
  legalBounty: process.env.VITE_LEGAL_BOUNTY_ADDRESS || '',
  documentRegistry: process.env.VITE_DOCUMENT_REGISTRY_ADDRESS || '',
  milestoneEscrow: process.env.VITE_MILESTONE_ESCROW_ADDRESS || '',
  reputationSystem: process.env.VITE_REPUTATION_SYSTEM_ADDRESS || ''
};

// Contract interfaces
export const getContractInterface = (provider: ethers.Provider) => ({
  hakiToken: new ethers.Contract(
    CONTRACT_ADDRESSES.hakiToken,
    HakiTokenABI.abi,
    provider
  ),
  legalBounty: new ethers.Contract(
    CONTRACT_ADDRESSES.legalBounty,
    LegalBountyABI.abi,
    provider
  ),
  documentRegistry: new ethers.Contract(
    CONTRACT_ADDRESSES.documentRegistry,
    DocumentRegistryABI.abi,
    provider
  ),
  milestoneEscrow: new ethers.Contract(
    CONTRACT_ADDRESSES.milestoneEscrow,
    MilestoneEscrowABI.abi,
    provider
  ),
  reputationSystem: new ethers.Contract(
    CONTRACT_ADDRESSES.reputationSystem,
    ReputationSystemABI.abi,
    provider
  )
});

// M-PESA integration configuration
export const MPESA_CONFIG = {
  apiKey: process.env.VITE_MPESA_API_KEY || '',
  apiUrl: process.env.VITE_MPESA_API_URL || '',
  callbackUrl: process.env.VITE_MPESA_CALLBACK_URL || '',
  shortcode: process.env.VITE_MPESA_SHORTCODE || ''
}; 
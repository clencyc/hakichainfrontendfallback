import { ethers } from 'ethers';


// import HakiTokenABI from '../../contracts/HakiToken.sol/HakiToken.json';
// import LegalBountyABI from '../../contracts/LegalBounty.sol/LegalBounty.json';
// import DocumentRegistryABI from '../../contracts/DocumentRegistry.sol/DocumentRegistry.json';
// import MilestoneEscrowABI from '../../contracts/MilestoneEscrow.sol/MilestoneEscrow.json';
// import ReputationSystemABI from '../../contracts/ReputationSystem.sol/ReputationSystem.json';
// // import ESignatureRegistryABI from '../../artifacts/contracts/ESignatureRegistry.sol/ESignatureRegistry.json';

const HakiTokenABI: any[] = [];
const LegalBountyABI: any[] = [];
const DocumentRegistryABI: any[] = [];
const MilestoneEscrowABI: any[] = [];
const ReputationSystemABI: any[] = [];
const ESignatureRegistryABI: any[] = [];

// Contract addresses (replace with actual deployed addresses)
const HAKI_TOKEN_ADDRESS = '0x...';
const LEGAL_BOUNTY_ADDRESS = '0x...';
const DOCUMENT_REGISTRY_ADDRESS = '0x...';
const MILESTONE_ESCROW_ADDRESS = '0x...';
const REPUTATION_SYSTEM_ADDRESS = '0x...';
const ESIGNATURE_REGISTRY_ADDRESS = '0x...';

export const getContracts = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const hakiToken = new ethers.Contract(
    HAKI_TOKEN_ADDRESS,
    HakiTokenABI,
    signer
  );

  const legalBounty = new ethers.Contract(
    LEGAL_BOUNTY_ADDRESS,
    LegalBountyABI,
    signer
  );

  const documentRegistry = new ethers.Contract(
    DOCUMENT_REGISTRY_ADDRESS,
    DocumentRegistryABI,
    signer
  );

  const milestoneEscrow = new ethers.Contract(
    MILESTONE_ESCROW_ADDRESS,
    MilestoneEscrowABI,
    signer
  );

  const reputationSystem = new ethers.Contract(
    REPUTATION_SYSTEM_ADDRESS,
    ReputationSystemABI,
    signer
  );

  const eSignatureRegistry = new ethers.Contract(
    ESIGNATURE_REGISTRY_ADDRESS,
    ESignatureRegistryABI,
    signer
  );

  return {
    hakiToken,
    legalBounty,
    documentRegistry,
    milestoneEscrow,
    reputationSystem,
    eSignatureRegistry,
    signer
  };
};
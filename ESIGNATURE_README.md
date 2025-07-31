# HakiChain E-Signature Platform

A comprehensive digital signature solution integrated with blockchain technology for secure document signing and verification.

## Features

### 🎯 Core Functionality
- **Document Upload & Management**: Upload PDF documents for digital signing
- **Multiple Signature Methods**: Draw, type, or upload signatures
- **Multi-Signer Support**: Add multiple signers with different roles
- **Blockchain Verification**: All signatures are stored and verified on-chain
- **Real-time Status Tracking**: Monitor document signing progress
- **Document Hash Verification**: Cryptographic verification of document integrity

### 🔐 Security Features
- **Cryptographic Signatures**: Uses Ethereum-compatible digital signatures
- **Document Hashing**: SHA-256 hashing for document integrity
- **Blockchain Storage**: Immutable record of all signatures
- **Access Control**: Role-based permissions for document management
- **Audit Trail**: Complete history of all signing activities

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live status updates and notifications
- **Document Preview**: Built-in document viewer with zoom controls
- **Signature Tools**: Interactive signature creation tools

## Technical Architecture

### Smart Contract: ESignatureRegistry.sol
```solidity
contract ESignatureRegistry is Ownable {
    struct Document {
        string documentHash;
        string documentName;
        address creator;
        uint256 createdAt;
        bool isActive;
        mapping(address => Signature) signatures;
        address[] signers;
    }
    
    struct Signature {
        bytes signature;
        uint256 signedAt;
        bool isValid;
        string signerName;
        string signerEmail;
    }
}
```

### Key Functions
- `registerDocument()`: Register a new document for signing
- `requestSignature()`: Request signatures from specific addresses
- `signDocument()`: Sign a document with digital signature
- `verifySignature()`: Verify signature authenticity
- `getDocumentInfo()`: Retrieve document metadata
- `isDocumentFullySigned()`: Check completion status

### Frontend Components

#### LawyerESign.tsx
Main E-signature interface with:
- Document management panel
- Signature creation tools
- Signer management
- Blockchain integration

#### useESignature.ts
Custom hook providing:
- Contract interaction methods
- Signature creation utilities
- Document verification functions
- Error handling and loading states

## Setup Instructions

### 1. Prerequisites
```bash
# Install dependencies
npm install

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts
```

### 2. Environment Configuration
Add to your `.env` file:
```env
VITE_ESIGNATURE_REGISTRY_ADDRESS=0x... # Deployed contract address
```

### 3. Contract Deployment
```bash
# Compile contracts
npx hardhat compile

# Deploy E-signature contract
npx hardhat run scripts/deploy-esignature.ts --network <network>
```

### 4. Update Contract Addresses
After deployment, update the contract addresses in:
- `src/config/contracts.ts`
- `src/lib/contracts.ts`

## Usage Guide

### For Lawyers

#### 1. Upload Document
1. Navigate to the E-Signature section
2. Click "Upload PDF Document"
3. Select your document file
4. Wait for processing and hash generation

#### 2. Add Signers
1. Click "Add Signer" button
2. Enter signer details:
   - Name
   - Email address
   - Role (Client, Witness, Attorney, etc.)
3. Repeat for all required signers

#### 3. Create Signature
Choose from three signature methods:
- **Draw**: Use mouse/touch to draw signature
- **Type**: Type your name in signature font
- **Upload**: Upload an image of your signature

#### 4. Send for Signing
1. Review all signers and document
2. Click "Send for Signing"
3. Blockchain transaction will be initiated
4. Signers will receive notification

### For Signers

#### 1. Receive Notification
- Email notification with document link
- Blockchain event notification

#### 2. Review Document
- View document preview
- Check document hash for integrity
- Review signing requirements

#### 3. Sign Document
1. Choose signature method
2. Create or upload signature
3. Confirm signing
4. Blockchain transaction confirms signature

#### 4. Verification
- Signature is cryptographically verified
- Document status updates in real-time
- Receipt with transaction hash provided

## API Reference

### useESignature Hook

```typescript
const {
  // State
  isLoading,
  error,
  
  // Contract interactions
  registerDocument,
  requestSignature,
  signDocument,
  verifySignature,
  getDocumentInfo,
  getSignatureInfo,
  getDocumentSigners,
  getSignatureRequests,
  revokeDocument,
  isDocumentFullySigned,
  getDocumentStats,
  
  // Utility functions
  createSignature,
  verifySignatureOffline,
  generateDocumentHash
} = useESignature();
```

### Key Methods

#### registerDocument(documentHash, documentName)
Registers a new document on the blockchain.

#### requestSignature(documentHash, signerAddress, signerName, signerEmail)
Requests a signature from a specific address.

#### signDocument(documentHash, signature, signerName, signerEmail)
Signs a document with a digital signature.

#### verifySignature(documentHash, signerAddress, message)
Verifies the authenticity of a signature.

#### createSignature(message)
Creates a cryptographic signature for a message.

## Security Considerations

### Document Integrity
- All documents are hashed using SHA-256
- Document hashes are stored on-chain
- Any modification invalidates the hash

### Signature Security
- Uses Ethereum-compatible ECDSA signatures
- Private keys never leave the user's wallet
- Signatures are cryptographically verified

### Access Control
- Only document creators can add signers
- Signers can only sign documents they're authorized for
- Document creators can revoke documents

### Audit Trail
- All actions are recorded on the blockchain
- Complete history of signatures and modifications
- Immutable record for legal compliance

## Integration with HakiChain

### Legal Bounty Integration
- E-signed documents can be attached to legal bounties
- Automatic verification of document authenticity
- Integration with milestone escrow system

### Reputation System
- Successful document signings contribute to reputation
- Failed verifications may impact reputation scores
- Integration with lawyer rating system

### Payment Integration
- E-signature services can be monetized
- Integration with HakiToken for payments
- Automated billing for signature services

## Troubleshooting

### Common Issues

#### Contract Not Found
```bash
# Ensure contract is deployed
npx hardhat run scripts/deploy-esignature.ts

# Check contract address in configuration
# Verify network connection
```

#### Signature Verification Fails
- Check if signer address matches
- Verify document hash hasn't changed
- Ensure signature format is correct

#### Transaction Fails
- Check wallet connection
- Verify sufficient gas fees
- Ensure correct network

### Debug Mode
Enable debug logging:
```typescript
// In useESignature hook
console.log('Contract interaction:', { method, params });
```

## Future Enhancements

### Planned Features
- **Batch Signing**: Sign multiple documents at once
- **Template System**: Pre-defined document templates
- **Advanced Analytics**: Detailed signing analytics
- **Mobile App**: Native mobile application
- **API Integration**: REST API for third-party integration

### Technical Improvements
- **Layer 2 Scaling**: Optimistic rollups for cost reduction
- **Zero-Knowledge Proofs**: Enhanced privacy features
- **Multi-Chain Support**: Cross-chain signature verification
- **Advanced Encryption**: End-to-end document encryption

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Testing
```bash
# Run contract tests
npx hardhat test

# Run frontend tests
npm test

# Run integration tests
npm run test:integration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**HakiChain E-Signature Platform** - Secure, blockchain-powered digital signatures for the legal industry. 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ESignatureRegistry
 * @dev Smart contract for managing digital signatures and document verification
 */
contract ESignatureRegistry is Ownable {
    using ECDSA for bytes32;
    using Strings for uint256;

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

    struct SignatureRequest {
        string documentHash;
        address signer;
        uint256 requestedAt;
        bool isCompleted;
        string signerName;
        string signerEmail;
    }

    // Document hash => Document
    mapping(string => Document) public documents;
    
    // Document hash => SignatureRequest[]
    mapping(string => SignatureRequest[]) public signatureRequests;
    
    // Events
    event DocumentRegistered(string indexed documentHash, string documentName, address indexed creator);
    event SignatureRequested(string indexed documentHash, address indexed signer, string signerName, string signerEmail);
    event DocumentSigned(string indexed documentHash, address indexed signer, uint256 signedAt);
    event DocumentRevoked(string indexed documentHash, address indexed creator);
    event SignatureVerified(string indexed documentHash, address indexed signer, bool isValid);

    // Modifiers
    modifier documentExists(string memory documentHash) {
        require(documents[documentHash].creator != address(0), "Document does not exist");
        _;
    }

    modifier onlyDocumentCreator(string memory documentHash) {
        require(documents[documentHash].creator == msg.sender, "Only document creator can perform this action");
        _;
    }

    modifier documentActive(string memory documentHash) {
        require(documents[documentHash].isActive, "Document is not active");
        _;
    }

    /**
     * @dev Register a new document for signing
     * @param documentHash The hash of the document
     * @param documentName The name of the document
     */
    function registerDocument(string memory documentHash, string memory documentName) external {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(documents[documentHash].creator == address(0), "Document already registered");
        
        Document storage doc = documents[documentHash];
        doc.documentHash = documentHash;
        doc.documentName = documentName;
        doc.creator = msg.sender;
        doc.createdAt = block.timestamp;
        doc.isActive = true;
        
        emit DocumentRegistered(documentHash, documentName, msg.sender);
    }

    /**
     * @dev Request a signature from a specific address
     * @param documentHash The hash of the document
     * @param signer The address of the signer
     * @param signerName The name of the signer
     * @param signerEmail The email of the signer
     */
    function requestSignature(
        string memory documentHash,
        address signer,
        string memory signerName,
        string memory signerEmail
    ) external documentExists(documentHash) onlyDocumentCreator(documentHash) documentActive(documentHash) {
        require(signer != address(0), "Invalid signer address");
        require(bytes(signerName).length > 0, "Signer name cannot be empty");
        
        SignatureRequest memory request = SignatureRequest({
            documentHash: documentHash,
            signer: signer,
            requestedAt: block.timestamp,
            isCompleted: false,
            signerName: signerName,
            signerEmail: signerEmail
        });
        
        signatureRequests[documentHash].push(request);
        
        emit SignatureRequested(documentHash, signer, signerName, signerEmail);
    }

    /**
     * @dev Sign a document with a digital signature
     * @param documentHash The hash of the document
     * @param signature The digital signature
     * @param signerName The name of the signer
     * @param signerEmail The email of the signer
     */
    function signDocument(
        string memory documentHash,
        bytes memory signature,
        string memory signerName,
        string memory signerEmail
    ) external documentExists(documentHash) documentActive(documentHash) {
        require(signature.length > 0, "Signature cannot be empty");
        require(bytes(signerName).length > 0, "Signer name cannot be empty");
        
        Document storage doc = documents[documentHash];
        
        // Check if signer is already in the list
        bool isSigner = false;
        for (uint i = 0; i < doc.signers.length; i++) {
            if (doc.signers[i] == msg.sender) {
                isSigner = true;
                break;
            }
        }
        
        if (!isSigner) {
            doc.signers.push(msg.sender);
        }
        
        doc.signatures[msg.sender] = Signature({
            signature: signature,
            signedAt: block.timestamp,
            isValid: true,
            signerName: signerName,
            signerEmail: signerEmail
        });
        
        // Mark signature request as completed
        SignatureRequest[] storage requests = signatureRequests[documentHash];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].signer == msg.sender && !requests[i].isCompleted) {
                requests[i].isCompleted = true;
                break;
            }
        }
        
        emit DocumentSigned(documentHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a signature for a document
     * @param documentHash The hash of the document
     * @param signer The address of the signer
     * @param message The original message that was signed
     * @return isValid Whether the signature is valid
     */
    function verifySignature(
        string memory documentHash,
        address signer,
        string memory message
    ) external view documentExists(documentHash) returns (bool isValid) {
        Document storage doc = documents[documentHash];
        Signature storage sig = doc.signatures[signer];
        
        if (!sig.isValid) {
            return false;
        }
        
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(sig.signature);
        
        isValid = (recoveredSigner == signer);
        
        emit SignatureVerified(documentHash, signer, isValid);
        return isValid;
    }

    /**
     * @dev Get document information
     * @param documentHash The hash of the document
     * @return documentName The name of the document
     * @return creator The address of the creator
     * @return createdAt The timestamp when the document was created
     * @return isActive Whether the document is active
     * @return signerCount The number of signers
     */
    function getDocumentInfo(string memory documentHash) 
        external 
        view 
        documentExists(documentHash) 
        returns (
            string memory documentName,
            address creator,
            uint256 createdAt,
            bool isActive,
            uint256 signerCount
        ) 
    {
        Document storage doc = documents[documentHash];
        return (
            doc.documentName,
            doc.creator,
            doc.createdAt,
            doc.isActive,
            doc.signers.length
        );
    }

    /**
     * @dev Get signature information for a specific signer
     * @param documentHash The hash of the document
     * @param signer The address of the signer
     * @return signedAt The timestamp when the document was signed
     * @return isValid Whether the signature is valid
     * @return signerName The name of the signer
     * @return signerEmail The email of the signer
     */
    function getSignatureInfo(string memory documentHash, address signer)
        external
        view
        documentExists(documentHash)
        returns (
            uint256 signedAt,
            bool isValid,
            string memory signerName,
            string memory signerEmail
        )
    {
        Document storage doc = documents[documentHash];
        Signature storage sig = doc.signatures[signer];
        return (
            sig.signedAt,
            sig.isValid,
            sig.signerName,
            sig.signerEmail
        );
    }

    /**
     * @dev Get all signers for a document
     * @param documentHash The hash of the document
     * @return signers Array of signer addresses
     */
    function getDocumentSigners(string memory documentHash)
        external
        view
        documentExists(documentHash)
        returns (address[] memory signers)
    {
        Document storage doc = documents[documentHash];
        return doc.signers;
    }

    /**
     * @dev Get signature requests for a document
     * @param documentHash The hash of the document
     * @return requests Array of signature requests
     */
    function getSignatureRequests(string memory documentHash)
        external
        view
        documentExists(documentHash)
        returns (SignatureRequest[] memory requests)
    {
        return signatureRequests[documentHash];
    }

    /**
     * @dev Revoke a document (only creator can do this)
     * @param documentHash The hash of the document
     */
    function revokeDocument(string memory documentHash)
        external
        documentExists(documentHash)
        onlyDocumentCreator(documentHash)
    {
        documents[documentHash].isActive = false;
        emit DocumentRevoked(documentHash, msg.sender);
    }

    /**
     * @dev Check if a document is fully signed by all requested signers
     * @param documentHash The hash of the document
     * @return isFullySigned Whether all requested signers have signed
     */
    function isDocumentFullySigned(string memory documentHash)
        external
        view
        documentExists(documentHash)
        returns (bool isFullySigned)
    {
        SignatureRequest[] storage requests = signatureRequests[documentHash];
        Document storage doc = documents[documentHash];
        
        if (requests.length == 0) {
            return false;
        }
        
        for (uint i = 0; i < requests.length; i++) {
            if (!requests[i].isCompleted) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * @dev Get document statistics
     * @param documentHash The hash of the document
     * @return totalSigners Total number of signers
     * @return signedCount Number of completed signatures
     * @return pendingCount Number of pending signatures
     */
    function getDocumentStats(string memory documentHash)
        external
        view
        documentExists(documentHash)
        returns (
            uint256 totalSigners,
            uint256 signedCount,
            uint256 pendingCount
        )
    {
        SignatureRequest[] storage requests = signatureRequests[documentHash];
        Document storage doc = documents[documentHash];
        
        totalSigners = requests.length;
        signedCount = doc.signers.length;
        pendingCount = totalSigners - signedCount;
        
        return (totalSigners, signedCount, pendingCount);
    }
} 
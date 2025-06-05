```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DocumentRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant LAWYER_ROLE = keccak256("LAWYER_ROLE");
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    
    struct Document {
        bytes32 documentHash;
        uint256 timestamp;
        address uploader;
        uint256 bountyId;
        uint256 milestoneId;
        bool verified;
    }
    
    mapping(bytes32 => Document) public documents;
    mapping(uint256 => bytes32[]) public bountyDocuments;
    mapping(uint256 => bytes32[]) public milestoneDocuments;
    
    event DocumentRegistered(
        bytes32 indexed documentHash,
        uint256 indexed bountyId,
        uint256 milestoneId,
        address uploader
    );
    
    event DocumentVerified(
        bytes32 indexed documentHash,
        uint256 indexed bountyId,
        address verifier
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function registerDocument(
        bytes32 _documentHash,
        uint256 _bountyId,
        uint256 _milestoneId
    ) external nonReentrant {
        require(
            hasRole(LAWYER_ROLE, msg.sender) || hasRole(NGO_ROLE, msg.sender),
            "Must be lawyer or NGO"
        );
        require(documents[_documentHash].timestamp == 0, "Document already exists");
        
        documents[_documentHash] = Document({
            documentHash: _documentHash,
            timestamp: block.timestamp,
            uploader: msg.sender,
            bountyId: _bountyId,
            milestoneId: _milestoneId,
            verified: false
        });
        
        bountyDocuments[_bountyId].push(_documentHash);
        if (_milestoneId > 0) {
            milestoneDocuments[_milestoneId].push(_documentHash);
        }
        
        emit DocumentRegistered(_documentHash, _bountyId, _milestoneId, msg.sender);
    }
    
    function verifyDocument(bytes32 _documentHash) external {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        require(documents[_documentHash].timestamp > 0, "Document does not exist");
        require(!documents[_documentHash].verified, "Document already verified");
        
        documents[_documentHash].verified = true;
        emit DocumentVerified(
            _documentHash,
            documents[_documentHash].bountyId,
            msg.sender
        );
    }
    
    function getDocument(bytes32 _documentHash) external view returns (
        uint256 timestamp,
        address uploader,
        uint256 bountyId,
        uint256 milestoneId,
        bool verified
    ) {
        Document storage doc = documents[_documentHash];
        return (
            doc.timestamp,
            doc.uploader,
            doc.bountyId,
            doc.milestoneId,
            doc.verified
        );
    }
    
    function getBountyDocuments(uint256 _bountyId) external view returns (bytes32[] memory) {
        return bountyDocuments[_bountyId];
    }
    
    function getMilestoneDocuments(uint256 _milestoneId) external view returns (bytes32[] memory) {
        return milestoneDocuments[_milestoneId];
    }
}
```
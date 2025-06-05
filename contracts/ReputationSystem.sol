```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ReputationSystem is AccessControl {
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    
    struct Rating {
        uint8 score; // 1-5
        string comment;
        uint256 timestamp;
        address rater;
        uint256 bountyId;
    }
    
    struct LawyerReputation {
        uint256 totalScore;
        uint256 ratingsCount;
        uint256 completedCases;
        mapping(uint256 => Rating) ratings;
        mapping(address => bool) hasRated;
    }
    
    mapping(address => LawyerReputation) public reputations;
    
    event LawyerRated(
        address indexed lawyer,
        address indexed ngo,
        uint256 indexed bountyId,
        uint8 score
    );
    
    event CaseCompleted(address indexed lawyer, uint256 indexed bountyId);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function rateLawyer(
        address _lawyer,
        uint256 _bountyId,
        uint8 _score,
        string calldata _comment
    ) external {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        require(_score >= 1 && _score <= 5, "Invalid score");
        
        LawyerReputation storage rep = reputations[_lawyer];
        require(!rep.hasRated[msg.sender], "Already rated");
        
        uint256 ratingId = rep.ratingsCount++;
        rep.ratings[ratingId] = Rating({
            score: _score,
            comment: _comment,
            timestamp: block.timestamp,
            rater: msg.sender,
            bountyId: _bountyId
        });
        
        rep.totalScore += _score;
        rep.hasRated[msg.sender] = true;
        
        emit LawyerRated(_lawyer, msg.sender, _bountyId, _score);
    }
    
    function completeBounty(address _lawyer, uint256 _bountyId) external {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        
        LawyerReputation storage rep = reputations[_lawyer];
        rep.completedCases++;
        
        emit CaseCompleted(_lawyer, _bountyId);
    }
    
    function getLawyerRating(address _lawyer) external view returns (
        uint256 averageScore,
        uint256 totalRatings,
        uint256 completedCases
    ) {
        LawyerReputation storage rep = reputations[_lawyer];
        
        if (rep.ratingsCount > 0) {
            averageScore = (rep.totalScore * 100) / rep.ratingsCount; // Multiply by 100 for 2 decimal places
        }
        
        return (
            averageScore,
            rep.ratingsCount,
            rep.completedCases
        );
    }
    
    function getLawyerRating(address _lawyer, uint256 _ratingId) external view returns (
        uint8 score,
        string memory comment,
        uint256 timestamp,
        address rater,
        uint256 bountyId
    ) {
        Rating storage rating = reputations[_lawyer].ratings[_ratingId];
        return (
            rating.score,
            rating.comment,
            rating.timestamp,
            rating.rater,
            rating.bountyId
        );
    }
}
```
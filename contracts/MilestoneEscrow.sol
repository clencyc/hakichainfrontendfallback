// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MilestoneEscrow is ReentrancyGuard, AccessControl {
    IERC20 public hakiToken;
    
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    bytes32 public constant LAWYER_ROLE = keccak256("LAWYER_ROLE");
    
    struct Milestone {
        uint256 amount;
        uint256 releaseTime;
        bool released;
        address lawyer;
        bytes32 documentHash;
    }
    
    struct Escrow {
        uint256 bountyId;
        address ngo;
        uint256 totalAmount;
        uint256 releasedAmount;
        mapping(uint256 => Milestone) milestones;
        uint256 milestonesCount;
        bool active;
    }
    
    mapping(uint256 => Escrow) public escrows;
    
    event EscrowCreated(uint256 indexed bountyId, address ngo, uint256 totalAmount);
    event MilestoneAdded(uint256 indexed bountyId, uint256 milestoneId, uint256 amount);
    event MilestoneCompleted(uint256 indexed bountyId, uint256 milestoneId, bytes32 documentHash);
    event FundsReleased(uint256 indexed bountyId, uint256 milestoneId, address lawyer, uint256 amount);
    
    constructor(address _hakiToken) {
        hakiToken = IERC20(_hakiToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createEscrow(
        uint256 _bountyId,
        uint256 _totalAmount
    ) external {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        require(!escrows[_bountyId].active, "Escrow already exists");
        
        Escrow storage escrow = escrows[_bountyId];
        escrow.bountyId = _bountyId;
        escrow.ngo = msg.sender;
        escrow.totalAmount = _totalAmount;
        escrow.active = true;
        
        emit EscrowCreated(_bountyId, msg.sender, _totalAmount);
    }
    
    function addMilestone(
        uint256 _bountyId,
        uint256 _amount,
        uint256 _releaseTime,
        address _lawyer
    ) external {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        Escrow storage escrow = escrows[_bountyId];
        require(escrow.active, "Escrow not active");
        require(escrow.ngo == msg.sender, "Not escrow owner");
        
        uint256 milestoneId = escrow.milestonesCount++;
        escrow.milestones[milestoneId] = Milestone({
            amount: _amount,
            releaseTime: _releaseTime,
            released: false,
            lawyer: _lawyer,
            documentHash: bytes32(0)
        });
        
        emit MilestoneAdded(_bountyId, milestoneId, _amount);
    }
    
    function completeMilestone(
        uint256 _bountyId,
        uint256 _milestoneId,
        bytes32 _documentHash
    ) external nonReentrant {
        require(hasRole(LAWYER_ROLE, msg.sender), "Must be lawyer");
        Escrow storage escrow = escrows[_bountyId];
        require(escrow.active, "Escrow not active");
        
        Milestone storage milestone = escrow.milestones[_milestoneId];
        require(milestone.lawyer == msg.sender, "Not milestone lawyer");
        require(!milestone.released, "Already released");
        require(block.timestamp >= milestone.releaseTime, "Too early");
        
        milestone.documentHash = _documentHash;
        emit MilestoneCompleted(_bountyId, _milestoneId, _documentHash);
    }
    
    function releaseFunds(
        uint256 _bountyId,
        uint256 _milestoneId
    ) external nonReentrant {
        require(hasRole(NGO_ROLE, msg.sender), "Must be NGO");
        Escrow storage escrow = escrows[_bountyId];
        require(escrow.active, "Escrow not active");
        require(escrow.ngo == msg.sender, "Not escrow owner");
        
        Milestone storage milestone = escrow.milestones[_milestoneId];
        require(!milestone.released, "Already released");
        require(milestone.documentHash != bytes32(0), "No proof submitted");
        
        milestone.released = true;
        escrow.releasedAmount += milestone.amount;
        
        require(
            hakiToken.transfer(milestone.lawyer, milestone.amount),
            "Transfer failed"
        );
        
        emit FundsReleased(_bountyId, _milestoneId, milestone.lawyer, milestone.amount);
    }
    
    function getMilestone(uint256 _bountyId, uint256 _milestoneId) external view returns (
        uint256 amount,
        uint256 releaseTime,
        bool released,
        address lawyer,
        bytes32 documentHash
    ) {
        Milestone storage milestone = escrows[_bountyId].milestones[_milestoneId];
        return (
            milestone.amount,
            milestone.releaseTime,
            milestone.released,
            milestone.lawyer,
            milestone.documentHash
        );
    }
    
    function getEscrowDetails(uint256 _bountyId) external view returns (
        address ngo,
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 milestonesCount,
        bool active
    ) {
        Escrow storage escrow = escrows[_bountyId];
        return (
            escrow.ngo,
            escrow.totalAmount,
            escrow.releasedAmount,
            escrow.milestonesCount,
            escrow.active
        );
    }
}
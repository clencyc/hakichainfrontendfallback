// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LegalBounty is ReentrancyGuard, Ownable {
    IERC20 public hakiToken;
    
    struct Milestone {
        string title;
        uint256 amount;
        bool completed;
        bool paid;
        bytes32 proofHash;
    }

    struct Bounty {
        address ngo;
        address lawyer;
        uint256 totalAmount;
        uint256 raisedAmount;
        string title;
        string description;
        string category;
        string location;
        uint256 dueDate;
        BountyStatus status;
        Milestone[] milestones;
    }

    enum BountyStatus { Open, InProgress, Completed, Cancelled }

    mapping(uint256 => Bounty) public bounties;
    mapping(address => uint256[]) public ngoToBounties;
    mapping(address => uint256[]) public lawyerToBounties;
    uint256 public nextBountyId;

    event BountyCreated(uint256 indexed bountyId, address indexed ngo, string title);
    event BountyFunded(uint256 indexed bountyId, address indexed donor, uint256 amount);
    event LawyerAssigned(uint256 indexed bountyId, address indexed lawyer);
    event MilestoneCompleted(uint256 indexed bountyId, uint256 milestoneIndex);
    event MilestonePaid(uint256 indexed bountyId, uint256 milestoneIndex, uint256 amount);
    event BountyCompleted(uint256 indexed bountyId);
    event BountyCancelled(uint256 indexed bountyId);

    constructor(address _hakiToken) Ownable(msg.sender) {
        hakiToken = IERC20(_hakiToken);
    }

    function createBounty(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _location,
        uint256 _dueDate,
        uint256 _totalAmount,
        string[] memory milestoneTitles,
        uint256[] memory milestoneAmounts
    ) external returns (uint256) {
        require(milestoneTitles.length == milestoneAmounts.length, "Milestone arrays must match");
        require(milestoneTitles.length > 0, "Must have at least one milestone");
        
        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            totalMilestoneAmount += milestoneAmounts[i];
        }
        require(totalMilestoneAmount == _totalAmount, "Milestone amounts must sum to total");

        uint256 bountyId = nextBountyId++;
        Bounty storage bounty = bounties[bountyId];
        bounty.ngo = msg.sender;
        bounty.title = _title;
        bounty.description = _description;
        bounty.category = _category;
        bounty.location = _location;
        bounty.dueDate = _dueDate;
        bounty.totalAmount = _totalAmount;
        bounty.status = BountyStatus.Open;

        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            bounty.milestones.push(Milestone({
                title: milestoneTitles[i],
                amount: milestoneAmounts[i],
                completed: false,
                paid: false,
                proofHash: bytes32(0)
            }));
        }

        ngoToBounties[msg.sender].push(bountyId);
        emit BountyCreated(bountyId, msg.sender, _title);
        return bountyId;
    }

    function fundBounty(uint256 _bountyId, uint256 _amount) external nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.status == BountyStatus.Open || bounty.status == BountyStatus.InProgress, "Bounty not active");
        require(bounty.raisedAmount + _amount <= bounty.totalAmount, "Exceeds required amount");

        require(hakiToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        bounty.raisedAmount += _amount;
        emit BountyFunded(_bountyId, msg.sender, _amount);
    }

    function assignLawyer(uint256 _bountyId, address _lawyer) external {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.ngo, "Only NGO can assign lawyer");
        require(bounty.status == BountyStatus.Open, "Bounty not open");
        require(bounty.raisedAmount == bounty.totalAmount, "Bounty not fully funded");

        bounty.lawyer = _lawyer;
        bounty.status = BountyStatus.InProgress;
        lawyerToBounties[_lawyer].push(_bountyId);
        emit LawyerAssigned(_bountyId, _lawyer);
    }

    function submitMilestoneProof(uint256 _bountyId, uint256 _milestoneIndex, bytes32 _proofHash) external {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.lawyer, "Only assigned lawyer");
        require(bounty.status == BountyStatus.InProgress, "Bounty not in progress");
        require(_milestoneIndex < bounty.milestones.length, "Invalid milestone");
        require(!bounty.milestones[_milestoneIndex].completed, "Milestone already completed");

        bounty.milestones[_milestoneIndex].proofHash = _proofHash;
    }

    function verifyMilestone(uint256 _bountyId, uint256 _milestoneIndex) external {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.ngo, "Only NGO can verify");
        require(bounty.status == BountyStatus.InProgress, "Bounty not in progress");
        require(_milestoneIndex < bounty.milestones.length, "Invalid milestone");
        require(!bounty.milestones[_milestoneIndex].completed, "Milestone already completed");
        require(bounty.milestones[_milestoneIndex].proofHash != bytes32(0), "No proof submitted");

        Milestone storage milestone = bounty.milestones[_milestoneIndex];
        milestone.completed = true;
        
        // Pay the lawyer
        require(hakiToken.transfer(bounty.lawyer, milestone.amount), "Payment failed");
        milestone.paid = true;

        emit MilestoneCompleted(_bountyId, _milestoneIndex);
        emit MilestonePaid(_bountyId, _milestoneIndex, milestone.amount);

        // Check if all milestones are completed
        bool allCompleted = true;
        for (uint256 i = 0; i < bounty.milestones.length; i++) {
            if (!bounty.milestones[i].completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            bounty.status = BountyStatus.Completed;
            emit BountyCompleted(_bountyId);
        }
    }

    function cancelBounty(uint256 _bountyId) external {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.ngo, "Only NGO can cancel");
        require(bounty.status == BountyStatus.Open, "Can only cancel open bounties");

        bounty.status = BountyStatus.Cancelled;
        
        // Refund donors (in a real implementation, you'd need to track individual donations)
        if (bounty.raisedAmount > 0) {
            require(hakiToken.transfer(bounty.ngo, bounty.raisedAmount), "Refund failed");
        }

        emit BountyCancelled(_bountyId);
    }

    // View functions
    function getBounty(uint256 _bountyId) external view returns (
        address ngo,
        address lawyer,
        uint256 totalAmount,
        uint256 raisedAmount,
        string memory title,
        string memory description,
        string memory category,
        string memory location,
        uint256 dueDate,
        BountyStatus status
    ) {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.ngo,
            bounty.lawyer,
            bounty.totalAmount,
            bounty.raisedAmount,
            bounty.title,
            bounty.description,
            bounty.category,
            bounty.location,
            bounty.dueDate,
            bounty.status
        );
    }

    function getMilestone(uint256 _bountyId, uint256 _milestoneIndex) external view returns (
        string memory title,
        uint256 amount,
        bool completed,
        bool paid,
        bytes32 proofHash
    ) {
        Milestone storage milestone = bounties[_bountyId].milestones[_milestoneIndex];
        return (
            milestone.title,
            milestone.amount,
            milestone.completed,
            milestone.paid,
            milestone.proofHash
        );
    }

    function getMilestonesCount(uint256 _bountyId) external view returns (uint256) {
        return bounties[_bountyId].milestones.length;
    }

    function getNGOBounties(address _ngo) external view returns (uint256[] memory) {
        return ngoToBounties[_ngo];
    }

    function getLawyerBounties(address _lawyer) external view returns (uint256[] memory) {
        return lawyerToBounties[_lawyer];
    }
}
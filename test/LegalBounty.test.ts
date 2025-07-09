import { expect } from "chai";
import { ethers } from "hardhat";
import { HakiToken, LegalBounty, DocumentRegistry, MilestoneEscrow, ReputationSystem } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("LegalBounty", function () {
  let hakiToken: HakiToken;
  let legalBounty: LegalBounty;
  let documentRegistry: DocumentRegistry;
  let milestoneEscrow: MilestoneEscrow;
  let reputationSystem: ReputationSystem;
  let owner: SignerWithAddress;
  let ngo: SignerWithAddress;
  let lawyer: SignerWithAddress;
  let donor: SignerWithAddress;

  beforeEach(async function () {
    [owner, ngo, lawyer, donor] = await ethers.getSigners();

    // Deploy contracts
    const HakiToken = await ethers.getContractFactory("HakiToken");
    hakiToken = await HakiToken.deploy();
    await hakiToken.waitForDeployment();

    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    documentRegistry = await DocumentRegistry.deploy();
    await documentRegistry.waitForDeployment();

    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    reputationSystem = await ReputationSystem.deploy();
    await reputationSystem.waitForDeployment();

    const MilestoneEscrow = await ethers.getContractFactory("MilestoneEscrow");
    milestoneEscrow = await MilestoneEscrow.deploy(
      await hakiToken.getAddress(),
      await reputationSystem.getAddress()
    );
    await milestoneEscrow.waitForDeployment();

    const LegalBounty = await ethers.getContractFactory("LegalBounty");
    legalBounty = await LegalBounty.deploy(
      await hakiToken.getAddress(),
      await documentRegistry.getAddress(),
      await milestoneEscrow.getAddress(),
      await reputationSystem.getAddress()
    );
    await legalBounty.waitForDeployment();

    // Transfer tokens to test accounts
    await hakiToken.transfer(ngo.address, ethers.parseEther("10000"));
    await hakiToken.transfer(donor.address, ethers.parseEther("10000"));
    await hakiToken.transfer(lawyer.address, ethers.parseEther("1000"));
  });

  describe("Bounty Creation", function () {
    it("Should create a bounty successfully", async function () {
      const bountyData = {
        title: "Test Legal Case",
        description: "Test description",
        category: "land-rights",
        location: "Nairobi, Kenya",
        dueDate: Math.floor(Date.now() / 1000) + 86400, // 1 day from now
        totalAmount: ethers.parseEther("1000"),
        milestoneTitles: ["Research", "Filing"],
        milestoneAmounts: [ethers.parseEther("600"), ethers.parseEther("400")]
      };

      const tx = await legalBounty.connect(ngo).createBounty(
        bountyData.title,
        bountyData.description,
        bountyData.category,
        bountyData.location,
        bountyData.dueDate,
        bountyData.totalAmount,
        bountyData.milestoneTitles,
        bountyData.milestoneAmounts
      );

      await expect(tx).to.emit(legalBounty, "BountyCreated").withArgs(0, ngo.address, bountyData.title);

      const bounty = await legalBounty.getBounty(0);
      expect(bounty.title).to.equal(bountyData.title);
      expect(bounty.ngo).to.equal(ngo.address);
      expect(bounty.totalAmount).to.equal(bountyData.totalAmount);
    });

    it("Should fail if milestone amounts don't sum to total", async function () {
      await expect(
        legalBounty.connect(ngo).createBounty(
          "Test Case",
          "Description",
          "category",
          "location",
          Math.floor(Date.now() / 1000) + 86400,
          ethers.parseEther("1000"),
          ["Milestone 1"],
          [ethers.parseEther("500")] // Only 500, but total is 1000
        )
      ).to.be.revertedWith("Milestone amounts must sum to total");
    });
  });

  describe("Bounty Funding", function () {
    let bountyId: number;

    beforeEach(async function () {
      // Create a bounty first
      await legalBounty.connect(ngo).createBounty(
        "Test Case",
        "Description",
        "category",
        "location",
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("1000"),
        ["Milestone 1"],
        [ethers.parseEther("1000")]
      );
      bountyId = 0;
    });

    it("Should allow funding a bounty", async function () {
      const fundAmount = ethers.parseEther("500");
      
      // Approve tokens
      await hakiToken.connect(donor).approve(await legalBounty.getAddress(), fundAmount);
      
      const tx = await legalBounty.connect(donor).fundBounty(bountyId, fundAmount);
      
      await expect(tx).to.emit(legalBounty, "BountyFunded").withArgs(bountyId, donor.address, fundAmount);
      
      const bounty = await legalBounty.getBounty(bountyId);
      expect(bounty.raisedAmount).to.equal(fundAmount);
    });

    it("Should not allow funding beyond total amount", async function () {
      const fundAmount = ethers.parseEther("1500"); // More than total
      
      await hakiToken.connect(donor).approve(await legalBounty.getAddress(), fundAmount);
      
      await expect(
        legalBounty.connect(donor).fundBounty(bountyId, fundAmount)
      ).to.be.revertedWith("Exceeds funding goal");
    });
  });

  describe("Lawyer Assignment", function () {
    let bountyId: number;

    beforeEach(async function () {
      // Create and fully fund a bounty
      await legalBounty.connect(ngo).createBounty(
        "Test Case",
        "Description",
        "category",
        "location",
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("1000"),
        ["Milestone 1"],
        [ethers.parseEther("1000")]
      );
      bountyId = 0;

      // Fund the bounty
      await hakiToken.connect(donor).approve(await legalBounty.getAddress(), ethers.parseEther("1000"));
      await legalBounty.connect(donor).fundBounty(bountyId, ethers.parseEther("1000"));
    });

    it("Should allow NGO to assign lawyer", async function () {
      const tx = await legalBounty.connect(ngo).assignLawyer(bountyId, lawyer.address);
      
      await expect(tx).to.emit(legalBounty, "LawyerAssigned").withArgs(bountyId, lawyer.address);
      
      const bounty = await legalBounty.getBounty(bountyId);
      expect(bounty.lawyer).to.equal(lawyer.address);
      expect(bounty.status).to.equal(1); // InProgress
    });

    it("Should not allow non-NGO to assign lawyer", async function () {
      await expect(
        legalBounty.connect(lawyer).assignLawyer(bountyId, lawyer.address)
      ).to.be.revertedWith("Only NGO can assign lawyer");
    });
  });

  describe("Milestone Management", function () {
    let bountyId: number;

    beforeEach(async function () {
      // Create, fund, and assign lawyer to bounty
      await legalBounty.connect(ngo).createBounty(
        "Test Case",
        "Description",
        "category",
        "location",
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("1000"),
        ["Research", "Filing"],
        [ethers.parseEther("600"), ethers.parseEther("400")]
      );
      bountyId = 0;

      await hakiToken.connect(donor).approve(await legalBounty.getAddress(), ethers.parseEther("1000"));
      await legalBounty.connect(donor).fundBounty(bountyId, ethers.parseEther("1000"));
      await legalBounty.connect(ngo).assignLawyer(bountyId, lawyer.address);
    });

    it("Should allow lawyer to submit milestone proof", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof document"));
      
      await legalBounty.connect(lawyer).submitMilestoneProof(bountyId, 0, proofHash);
      
      const milestone = await legalBounty.getMilestone(bountyId, 0);
      expect(milestone.proofHash).to.equal(proofHash);
    });

    it("Should allow NGO to verify milestone and release payment", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof document"));
      
      // Submit proof
      await legalBounty.connect(lawyer).submitMilestoneProof(bountyId, 0, proofHash);
      
      // Get initial lawyer balance
      const initialBalance = await hakiToken.balanceOf(lawyer.address);
      
      // Verify milestone
      const tx = await legalBounty.connect(ngo).verifyMilestone(bountyId, 0);
      
      await expect(tx).to.emit(legalBounty, "MilestoneCompleted").withArgs(bountyId, 0);
      await expect(tx).to.emit(legalBounty, "MilestonePaid").withArgs(bountyId, 0, ethers.parseEther("600"));
      
      // Check milestone status
      const milestone = await legalBounty.getMilestone(bountyId, 0);
      expect(milestone.completed).to.be.true;
      expect(milestone.paid).to.be.true;
      
      // Check lawyer received payment
      const finalBalance = await hakiToken.balanceOf(lawyer.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("600"));
    });

    it("Should complete bounty when all milestones are done", async function () {
      const proofHash1 = ethers.keccak256(ethers.toUtf8Bytes("proof1"));
      const proofHash2 = ethers.keccak256(ethers.toUtf8Bytes("proof2"));
      
      // Complete first milestone
      await legalBounty.connect(lawyer).submitMilestoneProof(bountyId, 0, proofHash1);
      await legalBounty.connect(ngo).verifyMilestone(bountyId, 0);
      
      // Complete second milestone
      await legalBounty.connect(lawyer).submitMilestoneProof(bountyId, 1, proofHash2);
      const tx = await legalBounty.connect(ngo).verifyMilestone(bountyId, 1);
      
      await expect(tx).to.emit(legalBounty, "BountyCompleted").withArgs(bountyId);
      
      const bounty = await legalBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(2); // Completed
    });
  });

  describe("Bounty Cancellation", function () {
    let bountyId: number;

    beforeEach(async function () {
      await legalBounty.connect(ngo).createBounty(
        "Test Case",
        "Description",
        "category",
        "location",
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("1000"),
        ["Milestone 1"],
        [ethers.parseEther("1000")]
      );
      bountyId = 0;
    });

    it("Should allow NGO to cancel open bounty", async function () {
      const tx = await legalBounty.connect(ngo).cancelBounty(bountyId);
      
      await expect(tx).to.emit(legalBounty, "BountyCancelled").withArgs(bountyId);
      
      const bounty = await legalBounty.getBounty(bountyId);
      expect(bounty.status).to.equal(3); // Cancelled
    });

    it("Should not allow non-NGO to cancel bounty", async function () {
      await expect(
        legalBounty.connect(lawyer).cancelBounty(bountyId)
      ).to.be.revertedWith("Only NGO can cancel");
    });
  });
});

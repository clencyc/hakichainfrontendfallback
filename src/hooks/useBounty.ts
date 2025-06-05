import { useState } from 'react';
import { useContracts } from './useContracts';
import { ethers } from 'ethers';

export const useBounty = () => {
  const { contracts, isLoading, error } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBounty = async (bountyData) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { legalBounty, hakiToken } = contracts;

      // Approve token spending
      const approveTx = await hakiToken.approve(
        legalBounty.address,
        ethers.parseEther(bountyData.totalAmount.toString())
      );
      await approveTx.wait();

      // Create bounty
      const tx = await legalBounty.createBounty(
        bountyData.title,
        bountyData.description,
        bountyData.category,
        bountyData.location,
        Math.floor(new Date(bountyData.dueDate).getTime() / 1000),
        ethers.parseEther(bountyData.totalAmount.toString()),
        bountyData.milestones.map(m => m.title),
        bountyData.milestones.map(m => ethers.parseEther(m.amount.toString()))
      );
      await tx.wait();

      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const fundBounty = async (bountyId, amount) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { legalBounty, hakiToken } = contracts;

      // Approve token spending
      const approveTx = await hakiToken.approve(
        legalBounty.address,
        ethers.parseEther(amount.toString())
      );
      await approveTx.wait();

      // Fund bounty
      const tx = await legalBounty.fundBounty(
        bountyId,
        ethers.parseEther(amount.toString())
      );
      await tx.wait();

      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const assignLawyer = async (bountyId, lawyerAddress) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { legalBounty } = contracts;
      const tx = await legalBounty.assignLawyer(bountyId, lawyerAddress);
      await tx.wait();
      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitMilestoneProof = async (bountyId, milestoneIndex, documentHash) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { legalBounty, documentRegistry } = contracts;

      // Register document
      const docTx = await documentRegistry.registerDocument(
        documentHash,
        bountyId,
        milestoneIndex
      );
      await docTx.wait();

      // Submit proof
      const tx = await legalBounty.submitMilestoneProof(
        bountyId,
        milestoneIndex,
        documentHash
      );
      await tx.wait();

      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyMilestone = async (bountyId, milestoneIndex) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { legalBounty } = contracts;
      const tx = await legalBounty.verifyMilestone(bountyId, milestoneIndex);
      await tx.wait();
      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createBounty,
    fundBounty,
    assignLawyer,
    submitMilestoneProof,
    verifyMilestone,
    isLoading,
    isSubmitting,
    error
  };
};
import { useState } from 'react';
import { useContracts } from './useContracts';

export const useReputation = () => {
  const { contracts, isLoading, error } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rateLawyer = async (lawyerAddress, bountyId, score, comment) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { reputationSystem } = contracts;
      const tx = await reputationSystem.rateLawyer(
        lawyerAddress,
        bountyId,
        score,
        comment
      );
      await tx.wait();
      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLawyerRating = async (lawyerAddress) => {
    if (!contracts) throw new Error('Contracts not loaded');

    const { reputationSystem } = contracts;
    const rating = await reputationSystem.getLawyerRating(lawyerAddress);
    return {
      averageScore: rating.averageScore.toNumber() / 100, // Convert from 2 decimal places
      totalRatings: rating.totalRatings.toNumber(),
      completedCases: rating.completedCases.toNumber()
    };
  };

  return {
    rateLawyer,
    getLawyerRating,
    isLoading,
    isSubmitting,
    error
  };
};
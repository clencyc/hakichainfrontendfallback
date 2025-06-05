import { useState } from 'react';
import { useContracts } from './useContracts';
import { ethers } from 'ethers';

export const useDocuments = () => {
  const { contracts, isLoading, error } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerDocument = async (file, bountyId, milestoneId = 0) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      // Calculate document hash
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const documentHash = ethers.keccak256(bytes);

      // Register document on-chain
      const { documentRegistry } = contracts;
      const tx = await documentRegistry.registerDocument(
        documentHash,
        bountyId,
        milestoneId
      );
      await tx.wait();

      return {
        hash: documentHash,
        txHash: tx.hash
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyDocument = async (documentHash) => {
    if (!contracts) throw new Error('Contracts not loaded');
    setIsSubmitting(true);

    try {
      const { documentRegistry } = contracts;
      const tx = await documentRegistry.verifyDocument(documentHash);
      await tx.wait();
      return tx.hash;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocument = async (documentHash) => {
    if (!contracts) throw new Error('Contracts not loaded');

    const { documentRegistry } = contracts;
    const doc = await documentRegistry.getDocument(documentHash);
    return {
      timestamp: doc.timestamp.toString(),
      uploader: doc.uploader,
      bountyId: doc.bountyId.toString(),
      milestoneId: doc.milestoneId.toString(),
      verified: doc.verified
    };
  };

  return {
    registerDocument,
    verifyDocument,
    getDocument,
    isLoading,
    isSubmitting,
    error
  };
};
import { useState, useEffect, useCallback } from 'react';
import { ethers, id, getBytes, verifyMessage } from 'ethers';
import { useWallet } from './useWallet';
import { useContracts } from './useContracts';

export interface SignatureRequest {
  documentHash: string;
  signer: string;
  requestedAt: number;
  isCompleted: boolean;
  signerName: string;
  signerEmail: string;
}

export interface DocumentInfo {
  documentName: string;
  creator: string;
  createdAt: number;
  isActive: boolean;
  signerCount: number;
}

export interface SignatureInfo {
  signedAt: number;
  isValid: boolean;
  signerName: string;
  signerEmail: string;
}

export interface DocumentStats {
  totalSigners: number;
  signedCount: number;
  pendingCount: number;
}

export const useESignature = () => {
  const { signer, address } = useWallet();
  const { getContract } = useContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getESignatureContract = useCallback(async () => {
    if (!signer) throw new Error('Wallet not connected');
    return getContract('ESignatureRegistry', signer);
  }, [signer, getContract]);

  const registerDocument = useCallback(async (documentHash: string, documentName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const tx = await contract.registerDocument(documentHash, documentName);
      await tx.wait();
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const requestSignature = useCallback(async (
    documentHash: string,
    signerAddress: string,
    signerName: string,
    signerEmail: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const tx = await contract.requestSignature(documentHash, signerAddress, signerName, signerEmail);
      await tx.wait();
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request signature';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const signDocument = useCallback(async (
    documentHash: string,
    signature: string,
    signerName: string,
    signerEmail: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const tx = await contract.signDocument(documentHash, signature, signerName, signerEmail);
      await tx.wait();
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const verifySignature = useCallback(async (
    documentHash: string,
    signerAddress: string,
    message: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const isValid = await contract.verifySignature(documentHash, signerAddress, message);
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify signature';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const getDocumentInfo = useCallback(async (documentHash: string): Promise<DocumentInfo> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const info = await contract.getDocumentInfo(documentHash);
      return {
        documentName: info[0],
        creator: info[1],
        createdAt: info[2].toNumber(),
        isActive: info[3],
        signerCount: info[4].toNumber()
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get document info';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const getSignatureInfo = useCallback(async (
    documentHash: string,
    signerAddress: string
  ): Promise<SignatureInfo> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const info = await contract.getSignatureInfo(documentHash, signerAddress);
      return {
        signedAt: info[0].toNumber(),
        isValid: info[1],
        signerName: info[2],
        signerEmail: info[3]
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get signature info';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const getDocumentSigners = useCallback(async (documentHash: string): Promise<string[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const signers = await contract.getDocumentSigners(documentHash);
      return signers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get document signers';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const getSignatureRequests = useCallback(async (documentHash: string): Promise<SignatureRequest[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const requests = await contract.getSignatureRequests(documentHash);
      return requests.map((req: any) => ({
        documentHash: req.documentHash,
        signer: req.signer,
        requestedAt: req.requestedAt.toNumber(),
        isCompleted: req.isCompleted,
        signerName: req.signerName,
        signerEmail: req.signerEmail
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get signature requests';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const revokeDocument = useCallback(async (documentHash: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const tx = await contract.revokeDocument(documentHash);
      await tx.wait();
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const isDocumentFullySigned = useCallback(async (documentHash: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const isFullySigned = await contract.isDocumentFullySigned(documentHash);
      return isFullySigned;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check document status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const getDocumentStats = useCallback(async (documentHash: string): Promise<DocumentStats> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = await getESignatureContract();
      const stats = await contract.getDocumentStats(documentHash);
      return {
        totalSigners: stats[0].toNumber(),
        signedCount: stats[1].toNumber(),
        pendingCount: stats[2].toNumber()
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get document stats';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getESignatureContract]);

  const createSignature = useCallback(async (message: string): Promise<string> => {
    if (!signer) throw new Error('Wallet not connected');
    
    try {
      const messageHash = id(message);
      const messageHashBytes = getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBytes);
      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create signature';
      setError(errorMessage);
      throw err;
    }
  }, [signer]);

  const verifySignatureOffline = useCallback(async (
    message: string,
    signature: string,
    expectedSigner: string
  ): Promise<boolean> => {
    try {
      const messageHash = id(message);
      const messageHashBytes = getBytes(messageHash);
      const recoveredAddress = verifyMessage(messageHashBytes, signature);
      return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify signature offline';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const generateDocumentHash = useCallback((content: string, metadata: any): string => {
    const data = JSON.stringify({
      content,
      metadata,
      timestamp: Date.now()
    });
    return id(data);
  }, []);

  return {
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
  };
}; 
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContracts } from '../lib/contracts';

export const useContracts = () => {
  const [contracts, setContracts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const contractInstances = await getContracts();
        setContracts(contractInstances);
      } catch (err) {
        console.error('Error loading contracts:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadContracts();
  }, []);

  const getContract = useCallback((contractName: string, signer?: ethers.Signer) => {
    if (!contracts) {
      throw new Error('Contracts not loaded');
    }
    
    const contract = contracts[contractName];
    if (!contract) {
      throw new Error(`Contract ${contractName} not found`);
    }
    
    if (signer) {
      return contract.connect(signer);
    }
    
    return contract;
  }, [contracts]);

  return { contracts, isLoading, error, getContract };
};
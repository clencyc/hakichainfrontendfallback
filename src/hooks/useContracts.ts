import { useState, useEffect } from 'react';
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

  return { contracts, isLoading, error };
};
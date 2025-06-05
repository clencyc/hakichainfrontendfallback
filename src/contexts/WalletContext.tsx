import { createContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
}

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletAddress: null,
  balance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isMetaMaskInstalled: false,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      const isInstalled = typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        window.ethereum.isMetaMask === true &&
        window.ethereum._metamask !== undefined;
      setIsMetaMaskInstalled(isInstalled);
      return isInstalled;
    };

    // Check if wallet was previously connected
    const checkStoredWallet = async () => {
      const storedWalletAddress = localStorage.getItem('hakichain_wallet');
      
      if (storedWalletAddress && checkMetaMask()) {
        try {
          // Verify if we still have access to the account
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0 && accounts[0].toLowerCase() === storedWalletAddress.toLowerCase()) {
            setWalletAddress(storedWalletAddress);
            setIsConnected(true);
            setBalance('100.00'); // Mock balance for demo
          } else {
            // Clear stored wallet if we don't have access anymore
            localStorage.removeItem('hakichain_wallet');
          }
        } catch (error) {
          console.error('Error checking stored wallet:', error);
          localStorage.removeItem('hakichain_wallet');
        }
      }
    };

    // Initial checks
    checkMetaMask();
    checkStoredWallet();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload();
      });
    }

    return () => {
      // Cleanup listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      // First check if MetaMask is properly installed and accessible
      if (!window.ethereum || !window.ethereum.isMetaMask || !window.ethereum._metamask) {
        window.open('https://metamask.io/download/', '_blank');
        throw new Error(
          'MetaMask is not properly installed or enabled. Please:\n' +
          '1. Install MetaMask if not already installed\n' +
          '2. Make sure MetaMask is enabled in your browser extensions\n' +
          '3. Refresh the page after installation/enabling'
        );
      }

      // Ensure MetaMask is ready to connect
      const isUnlocked = await window.ethereum._metamask.isUnlocked();
      if (!isUnlocked) {
        throw new Error('Please unlock your MetaMask wallet to continue');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const account = accounts[0];
      
      // Store wallet address
      localStorage.setItem('hakichain_wallet', account);
      setWalletAddress(account);
      setIsConnected(true);
      setBalance('100.00'); // Mock balance for demo
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      
      if (error instanceof Error) {
        // Pass through our custom error messages
        if (error.message.includes('MetaMask is not properly installed') ||
            error.message.includes('Please unlock your MetaMask')) {
          throw error;
        }
      }
      
      // Handle other MetaMask errors
      if (error.code === 4001) {
        throw new Error('You rejected the connection request. Please try again and approve the connection.');
      }
      
      throw new Error(
        'Failed to connect to MetaMask. Please ensure:\n' +
        '1. MetaMask is installed and enabled\n' +
        '2. You are logged into MetaMask\n' +
        '3. Your browser is up to date'
      );
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('hakichain_wallet');
    setWalletAddress(null);
    setIsConnected(false);
    setBalance('0');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        connectWallet,
        disconnectWallet,
        isMetaMaskInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
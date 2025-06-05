import { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string;
  hakiBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
}

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletAddress: null,
  balance: '0',
  hakiBalance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isMetaMaskInstalled: false,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [hakiBalance, setHakiBalance] = useState('0');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled = typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        window.ethereum.isMetaMask === true;
      setIsMetaMaskInstalled(isInstalled);
      return isInstalled;
    };

    const checkStoredWallet = async () => {
      const storedWalletAddress = localStorage.getItem('hakichain_wallet');
      
      if (storedWalletAddress && checkMetaMask()) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0 && accounts[0].address.toLowerCase() === storedWalletAddress.toLowerCase()) {
            setWalletAddress(storedWalletAddress);
            setIsConnected(true);
            
            // Get ETH balance
            const balance = await provider.getBalance(storedWalletAddress);
            setBalance(ethers.formatEther(balance));

            // Get HAKI balance
            const hakiToken = new ethers.Contract(
              HAKI_TOKEN_ADDRESS,
              ['function balanceOf(address) view returns (uint256)'],
              provider
            );
            const hakiBalance = await hakiToken.balanceOf(storedWalletAddress);
            setHakiBalance(ethers.formatEther(hakiBalance));
          } else {
            localStorage.removeItem('hakichain_wallet');
          }
        } catch (error) {
          console.error('Error checking stored wallet:', error);
          localStorage.removeItem('hakichain_wallet');
        }
      }
    };

    checkMetaMask();
    checkStoredWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          updateBalances(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const updateBalances = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get ETH balance
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));

      // Get HAKI balance
      const hakiToken = new ethers.Contract(
        HAKI_TOKEN_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const hakiBalance = await hakiToken.balanceOf(address);
      setHakiBalance(ethers.formatEther(hakiBalance));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        window.open('https://metamask.io/download/', '_blank');
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      
      localStorage.setItem('hakichain_wallet', account);
      setWalletAddress(account);
      setIsConnected(true);
      
      await updateBalances(account);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('hakichain_wallet');
    setWalletAddress(null);
    setIsConnected(false);
    setBalance('0');
    setHakiBalance('0');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        hakiBalance,
        connectWallet,
        disconnectWallet,
        isMetaMaskInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
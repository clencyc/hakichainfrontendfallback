import { useWallet } from '../../hooks/useWallet';
import { Wallet, ExternalLink } from 'lucide-react';

export const WalletInfo = () => {
  const { isConnected, walletAddress, balance, hakiBalance, connectWallet } = useWallet();

  if (!isConnected) {
    return (
      <button 
        onClick={connectWallet}
        className="btn btn-outline flex items-center space-x-2"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-primary-600 mr-2" />
          <span className="font-medium">Wallet</span>
        </div>
        <a
          href={`https://etherscan.io/address/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-sm text-gray-500">Address</div>
          <div className="font-medium">
            {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">ETH Balance</div>
          <div className="font-medium">{Number(balance).toFixed(4)} ETH</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">HAKI Balance</div>
          <div className="font-medium">{Number(hakiBalance).toFixed(2)} HAKI</div>
        </div>
      </div>
    </div>
  );
};
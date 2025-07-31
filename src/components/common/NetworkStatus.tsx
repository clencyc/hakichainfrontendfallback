import { AlertTriangle, CheckCircle, Wifi } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { getCurrentNetwork } from '../../config/contracts';

export const NetworkStatus = () => {
  const { isConnected, chainId, isCorrectNetwork, switchNetwork } = useWallet();
  const targetNetwork = getCurrentNetwork();

  if (!isConnected) {
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <Wifi className="w-4 h-4 mr-1" />
        <span>Not connected</span>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center bg-warning-50 border border-warning-200 rounded-lg px-3 py-2">
        <AlertTriangle className="w-4 h-4 text-warning-600 mr-2" />
        <div className="flex-1">
          <p className="text-sm text-warning-800">Wrong network</p>
          <p className="text-xs text-warning-600">
            Please switch to {targetNetwork.chainId === 4202 ? 'Lisk Sepolia Testnet' : 'Lisk Mainnet'}
          </p>
        </div>
        <button
          onClick={switchNetwork}
          className="btn btn-sm bg-warning-600 hover:bg-warning-700 text-white ml-2"
        >
          Switch
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center text-success-600 text-sm">
      <CheckCircle className="w-4 h-4 mr-1" />
      <span>
        Connected to {targetNetwork.chainId === 4202 ? 'Lisk Testnet' : 'Lisk Mainnet'}
      </span>
    </div>
  );
};

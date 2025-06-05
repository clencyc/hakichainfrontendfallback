import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { SettingsLayout } from '../../components/settings/SettingsLayout';
import { CreditCard, Wallet } from 'lucide-react';

export const PaymentSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePaymentMethod = async () => {
    // This would integrate with your payment provider
    alert('Payment method update functionality will be implemented');
  };

  return (
    <SettingsLayout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Payment Settings</h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Edit
                </button>
              </div>
            </div>

            <button
              onClick={handleUpdatePaymentMethod}
              className="btn btn-outline w-full justify-center"
            >
              Add Payment Method
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Connected Wallets</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="w-6 h-6 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">MetaMask</p>
                    <p className="text-sm text-gray-500">0x1234...5678</p>
                  </div>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Disconnect
                </button>
              </div>
            </div>

            <button className="btn btn-outline w-full justify-center">
              Connect New Wallet
            </button>
          </div>
        </div>

        {user?.role === 'lawyer' && (
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Payout Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="payoutMethod" className="label">Payout Method</label>
                <select id="payoutMethod" className="input">
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Crypto Wallet</option>
                </select>
              </div>

              <div>
                <label htmlFor="payoutThreshold" className="label">Automatic Payout Threshold</label>
                <select id="payoutThreshold" className="input">
                  <option>$50</option>
                  <option>$100</option>
                  <option>$500</option>
                  <option>$1000</option>
                </select>
              </div>

              <button className="btn btn-primary">
                Save Payout Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};
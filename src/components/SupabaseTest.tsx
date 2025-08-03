import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('🔄 Testing Supabase connection from browser...');
      
      // Test 1: Basic table access
      const { data, error } = await supabase
        .from('lawyer_reminders')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('❌ Connection failed:', error);
        setTestResult(`❌ Connection Failed: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}\nHint: ${error.hint}`);
        return;
      }
      
      console.log('✅ Connection successful');
      setTestResult(`✅ Connection Successful!\nTable access working. Row count: ${data?.length || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ Test error:', error);
      setTestResult(`❌ Test Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testInsert = async () => {
    setIsLoading(true);
    setTestResult('Testing insert...');
    
    try {
      const testData = {
        title: 'Browser Test Reminder',
        description: 'Test from browser',
        client_name: 'Test Client',
        client_email: 'test@example.com',
        client_phone: '+254700000000',
        reminder_date: '2025-08-04',
        reminder_time: '10:00',
        priority: 'medium' as const,
        status: 'pending' as const,
        lawyer_id: 'test-browser-user'
      };
      
      const { data, error } = await supabase
        .from('lawyer_reminders')
        .insert([testData])
        .select();
      
      if (error) {
        console.error('❌ Insert failed:', error);
        setTestResult(`❌ Insert Failed: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}\nHint: ${error.hint}`);
        return;
      }
      
      console.log('✅ Insert successful:', data);
      setTestResult(`✅ Insert Successful!\nCreated record: ${JSON.stringify(data[0], null, 2)}`);
      
      // Clean up - delete the test record
      if (data && data[0]) {
        await supabase
          .from('lawyer_reminders')
          .delete()
          .eq('id', data[0].id);
        console.log('✅ Test record cleaned up');
      }
      
    } catch (error) {
      console.error('❌ Insert test error:', error);
      setTestResult(`❌ Insert Test Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-red-500 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-red-600 mb-3">🔧 Supabase Debug Panel</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testInsert}
          disabled={isLoading}
          className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Insert'}
        </button>
      </div>
      
      {testResult && (
        <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
          <pre>{testResult}</pre>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

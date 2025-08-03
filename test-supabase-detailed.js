const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBasicQueries() {
  console.log('Testing basic Supabase operations...\n');
  
  // Test 1: Simple select
  try {
    console.log('🔄 Test 1: Basic select query...');
    const { data, error } = await supabase
      .from('lawyer_reminders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Select failed:', error);
    } else {
      console.log('✅ Select successful. Records found:', data?.length || 0);
    }
  } catch (error) {
    console.error('❌ Select error:', error.message);
  }
  
  // Test 2: Check table structure
  try {
    console.log('\n🔄 Test 2: Check if table exists...');
    const { data, error } = await supabase.rpc('get_table_info', { table_name: 'lawyer_reminders' });
    
    if (error) {
      console.log('ℹ️  Table info RPC not available, trying direct access...');
    } else {
      console.log('✅ Table info:', data);
    }
  } catch (error) {
    console.log('ℹ️  RPC not available, continuing...');
  }
  
  // Test 3: Test auth
  try {
    console.log('\n🔄 Test 3: Check auth status...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('ℹ️  No authenticated user (expected for anon key):', error.message);
    } else {
      console.log('User:', user);
    }
  } catch (error) {
    console.log('ℹ️  Auth check failed:', error.message);
  }
  
  // Test 4: Test insert with minimal data
  try {
    console.log('\n🔄 Test 4: Testing insert operation...');
    const testData = {
      title: 'Test Reminder',
      description: 'Test Description',
      client_name: 'Test Client',
      client_email: 'test@example.com',
      client_phone: '+254700000000',
      reminder_date: '2025-08-03',
      reminder_time: '10:00',
      priority: 'medium',
      status: 'pending',
      lawyer_id: 'test-lawyer-id'
    };
    
    const { data, error } = await supabase
      .from('lawyer_reminders')
      .insert([testData])
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
    } else {
      console.log('✅ Insert successful:', data);
      
      // Clean up - delete the test record
      if (data && data[0]) {
        await supabase
          .from('lawyer_reminders')
          .delete()
          .eq('id', data[0].id);
        console.log('✅ Test record cleaned up');
      }
    }
  } catch (error) {
    console.error('❌ Insert test error:', error.message);
  }
}

testBasicQueries();

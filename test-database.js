// Quick test script to verify database setup
import { supabaseAdmin } from './src/lib/supabaseAdmin.js';

async function testDatabaseSetup() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if users table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('❌ Users table error:', tableError.message);
      console.log('📝 Please run the setup-users-table.sql script in your Supabase dashboard');
      return;
    }
    
    console.log('✅ Users table exists and is accessible');
    
    // Test 2: Try inserting a test user
    const testUser = {
      id: crypto.randomUUID(),
      email: 'test@hakichain.com',
      full_name: 'Test User',
      user_type: 'lawyer',
      lsk_number: 'LSK12345'
    };
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select()
      .single();
      
    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      return;
    }
    
    console.log('✅ Test user inserted successfully:', insertData);
    
    // Test 3: Clean up test user
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', 'test@hakichain.com');
      
    console.log('✅ Test user cleaned up');
    console.log('🎉 Database setup is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDatabaseSetup();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test Supabase connection
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables:');
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY length:', supabaseKey?.length);
console.log('VITE_SUPABASE_ANON_KEY preview:', supabaseKey?.substring(0, 50) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Test JWT token
try {
  const parts = supabaseKey.split('.');
  if (parts.length !== 3) {
    console.error('❌ Invalid JWT format');
    process.exit(1);
  }
  
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  console.log('JWT payload:', payload);
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    console.error('❌ JWT token is EXPIRED');
    console.log('Token expired at:', new Date(payload.exp * 1000));
    console.log('Current time:', new Date());
  } else {
    console.log('✅ JWT token is valid');
    console.log('Token expires at:', new Date(payload.exp * 1000));
  }
} catch (error) {
  console.error('❌ Error parsing JWT:', error.message);
}

// Test Supabase connection
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('lawyer_reminders')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
    } else {
      console.log('✅ Supabase connection successful');
      console.log('Table access working, row count:', data);
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();

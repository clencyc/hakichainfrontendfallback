// Test script for welcome email API
const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testWelcomeEmail() {
  try {
    console.log('🧪 Testing Welcome Email API...');
    
    const postData = JSON.stringify({
      email: 'christineoyiera51@gmail.com',
      name: 'Christine Oyiera',
      role: 'lawyer',
      lsk_number: 'P/12345/2023'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/send-welcome-email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await makeRequest(options, postData);
    const result = response.data;
    
    console.log('✅ Response Status:', response.status);
    console.log('📧 Response Body:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('🎉 Welcome email test successful!');
      console.log('📬 Email would be sent to:', result.recipient);
      console.log('📝 Email type:', result.email_type);
    } else {
      console.log('❌ Welcome email test failed:', result.error);
    }
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
  }
}

// Also test the registration flow
async function testRegistrationFlow() {
  try {
    console.log('\n🔄 Testing Registration Flow...');
    
    // Simulate what happens in AuthContext
    const userData = {
      email: 'christineoyiera51@gmail.com',
      name: 'Christine Oyiera',
      role: 'lawyer',
      lsk_number: 'P/12345/2023'
    };
    
    console.log('👤 Simulating user registration:', userData);
    
    const postData = JSON.stringify(userData);

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/send-welcome-email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    // Call email API
    const emailResponse = await makeRequest(options, postData);
    const emailResult = emailResponse.data;
    
    if (emailResult.success) {
      console.log('✅ Registration flow completed successfully!');
      console.log('📧 Welcome email sent to:', emailResult.recipient);
    } else {
      console.log('⚠️ Registration completed but email failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('🚨 Registration flow failed:', error.message);
  }
}

// Run tests
console.log('🚀 Starting HakiChain Email Integration Tests\n');
testWelcomeEmail().then(() => testRegistrationFlow());

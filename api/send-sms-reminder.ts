// Express route handler for local development

// Get API key from environment variables, fallback to hardcoded for now
const TIARA_API_KEY = process.env.TIARA_API_KEY || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1OTUiLCJvaWQiOjU5NSwidWlkIjoiMTA2MGJiY2QtYzk0Ny00ZDgyLWI5NzYtOTJlYmRhMzQyYTkxIiwiYXBpZCI6NTg0LCJpYXQiOjE3NTIwNjE5NTIsImV4cCI6MjA5MjA2MTk1Mn0.CwqJ3I08eO89gqz3DKKv9--2fGwOksbuswLi9lAe5VxIy8Gr9YUxX9XUkzfQss9yaP1SUP_w89tVnVVk2ut4lQ';
const TIARA_SMS_URL = 'https://api2.tiaraconnect.io/api/messaging/sendsms';

// Use node-fetch for Node.js if fetch is not available
let fetchFn;
try {
  fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
} catch (e) {
  throw new Error('fetch or node-fetch is required for SMS sending');
}

async function sendSmsReminderHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    lawyer_phone,
    client_phone,
    message
  } = req.body;

  if (!lawyer_phone || !client_phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Helper to send SMS via Tiara Connect
  async function sendSMS(phone, message) {
    if (!fetchFn) throw new Error('fetch is not available');
    
    console.log('Sending SMS to:', phone);
    console.log('Using API key:', TIARA_API_KEY.substring(0, 20) + '...');
    
    const requestBody = {
      to: phone,
      message,
      from: 'CONNECT', // Use 'from' instead of 'sender'
    };
    
    console.log('Request body:', requestBody);
    
    const response = await fetchFn(TIARA_SMS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TIARA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log(`SMS Response status: ${response.status} for ${phone}`);
    
    let result;
    try {
      const responseText = await response.text();
      console.log(`Raw SMS response for ${phone}:`, responseText);
      
      if (responseText.trim()) {
        result = JSON.parse(responseText);
      } else {
        result = { status: 'FAILED', message: 'Empty response from SMS API' };
      }
    } catch (parseError) {
      console.error(`Failed to parse SMS response for ${phone}:`, parseError);
      result = { status: 'FAILED', message: 'Invalid JSON response from SMS API' };
    }
    
    console.log(`SMS API Response for ${phone}:`, {
      status: response.status,
      statusText: response.statusText,
      result: result
    });
    
    if (!response.ok) {
      throw new Error(`Tiara Connect HTTP ${response.status}: ${JSON.stringify(result)}`);
    }
    
    if (result.status === 'FAILED') {
      throw new Error(`Tiara Connect SMS failed: ${JSON.stringify(result)}`);
    }
    
    return result;
  }

  try {
    console.log('=== SMS Reminder Request ===');
    console.log('Lawyer phone:', lawyer_phone);
    console.log('Client phone:', client_phone);
    console.log('Message length:', message.length);
    
    // Send to client
    console.log('Sending SMS to client...');
    const clientResult = await sendSMS(client_phone, message);
    
    // Send to lawyer
    console.log('Sending SMS to lawyer...');
    const lawyerResult = await sendSMS(lawyer_phone, message);
    
    console.log('=== SMS Success ===');
    return res.status(200).json({ 
      success: true, 
      message: 'SMS sent successfully to both parties',
      clientResult, 
      lawyerResult 
    });
  } catch (error) {
    console.error('=== SMS Error ===');
    console.error('Failed to send SMS:', error);
    
    // Always return proper JSON
    return res.status(500).json({ 
      success: false,
      error: 'Failed to send SMS', 
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

export default sendSmsReminderHandler; 
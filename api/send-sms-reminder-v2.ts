// Enhanced SMS API for reminder system
const TIARA_API_KEY = process.env.TIARA_API_KEY || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1OTUiLCJvaWQiOjU5NSwidWlkIjoiMTA2MGJiY2QtYzk0Ny00ZDgyLWI5NzYtOTJlYmRhMzQyYTkxIiwiYXBpZCI6NTg0LCJpYXQiOjE3NTIwNjE5NTIsImV4cCI6MjA5MjA2MTk1Mn0.CwqJ3I08eO89gqz3DKKv9--2fGwOksbuswLi9lAe5VxIy8Gr9YUxX9XUkzfQss9yaP1SUP_w89tVnVVk2ut4lQ';
const TIARA_SMS_URL = 'https://api2.tiaraconnect.io/api/messaging/sendsms';
const SMS_SENDER_ID = process.env.TIARA_SMS_SENDER_ID || 'HAKICHAIN';
const SMS_FALLBACK_SENDER = process.env.TIARA_SMS_FALLBACK_SENDER || 'CONNECT';

// Check for fetch availability
const fetchFn = typeof fetch !== 'undefined' ? fetch : null;

async function sendSingleSMS(phoneNumber: string, message: string) {
  if (!fetchFn) {
    console.warn('SMS service not available in this environment (no fetch)');
    return { success: false, error: 'SMS service not available' };
  }
  
  if (!phoneNumber || !message) {
    return { success: false, error: 'Phone number and message are required' };
  }

  try {
    console.log('Sending SMS to:', phoneNumber);
    console.log('Message length:', message.length);
    
    const requestBody = {
      to: phoneNumber,
      message: message.substring(0, 160), // SMS limit
      from: SMS_SENDER_ID, // Use configurable sender ID
    };
    
    const response = await fetchFn(TIARA_SMS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TIARA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log(`SMS Response status: ${response.status}`);
    
    let result: any;
    try {
      const responseText = await response.text();
      console.log('SMS API raw response:', responseText);
      
      if (responseText.trim()) {
        result = JSON.parse(responseText);
      } else {
        result = { status: 'FAILED', message: 'Empty response from SMS API' };
      }
    } catch (parseError) {
      console.error('Failed to parse SMS response:', parseError);
      result = { status: 'FAILED', message: 'Invalid JSON response from SMS API' };
    }
    
    if (!response.ok) {
      throw new Error(`SMS API HTTP ${response.status}: ${JSON.stringify(result)}`);
    }
    
    if (result.status === 'FAILED') {
      throw new Error(`SMS failed: ${result.message || JSON.stringify(result)}`);
    }
    
    return { success: true, result };
  } catch (error: any) {
    console.error('SMS sending error:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown SMS error',
      details: error
    };
  }
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      phoneNumber,     // Single phone number (new format for automated reminders)
      lawyer_phone,    // Legacy format
      client_phone,    // Legacy format  
      message
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Handle both new single-phone format and legacy dual-phone format
    const phonesToSend: string[] = [];
    
    if (phoneNumber) {
      // New format: single phone number
      phonesToSend.push(phoneNumber);
    } else if (lawyer_phone || client_phone) {
      // Legacy format: dual phone numbers
      if (lawyer_phone) phonesToSend.push(lawyer_phone);
      if (client_phone) phonesToSend.push(client_phone);
    } else {
      return res.status(400).json({ error: 'At least one phone number is required' });
    }

    console.log('=== SMS Reminder Request ===');
    console.log('Phones to send:', phonesToSend);
    console.log('Message length:', message.length);
    
    const results: any[] = [];
    let successCount = 0;
    
    // Send SMS to all phone numbers
    for (const phone of phonesToSend) {
      console.log(`Sending SMS to: ${phone}`);
      const result = await sendSingleSMS(phone, message);
      results.push({ phone, ...result });
      
      if (result.success) {
        successCount++;
      }
    }
    
    const allSuccess = successCount === phonesToSend.length;
    const anySuccess = successCount > 0;
    
    console.log(`=== SMS Results: ${successCount}/${phonesToSend.length} successful ===`);
    
    if (allSuccess) {
      return res.status(200).json({ 
        success: true, 
        message: `SMS sent successfully to ${successCount} recipient(s)`,
        results,
        count: successCount
      });
    } else if (anySuccess) {
      return res.status(207).json({ // 207 Multi-Status
        success: false,
        message: `SMS sent to ${successCount}/${phonesToSend.length} recipients`,
        results,
        count: successCount
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send SMS to any recipients', 
        results,
        count: 0
      });
    }
  } catch (error: unknown) {
    console.error('=== SMS API Error ===');
    console.error('Unexpected error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}

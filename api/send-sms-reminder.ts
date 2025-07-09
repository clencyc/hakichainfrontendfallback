// Express route handler for local development

const TIARA_API_KEY = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1OTUiLCJvaWQiOjU5NSwidWlkIjoiMTA2MGJiY2QtYzk0Ny00ZDgyLWI5NzYtOTJlYmRhMzQyYTkxIiwiYXBpZCI6NTg0LCJpYXQiOjE3NTIwNjE5NTIsImV4cCI6MjA5MjA2MTk1Mn0.CwqJ3I08eO89gqz3DKKv9--2fGwOksbuswLi9lAe5VxIy8Gr9YUxX9XUkzfQss9yaP1SUP_w89tVnVVk2ut4lQ';
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
    const response = await fetchFn(TIARA_SMS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TIARA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phone,
        message,
        from: 'CONNECT', // Use 'from' instead of 'sender'
      }),
    });
    const result = await response.json();
    console.log(`SMS to ${phone}:`, result);
    if (!response.ok || result.status === 'FAILED') {
      throw new Error(`Tiara Connect error: ${JSON.stringify(result)}`);
    }
    return result;
  }

  try {
    // Send to client
    const clientResult = await sendSMS(client_phone, message);
    // Send to lawyer
    const lawyerResult = await sendSMS(lawyer_phone, message);
    return res.status(200).json({ success: true, clientResult, lawyerResult });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
}

module.exports = sendSmsReminderHandler; 
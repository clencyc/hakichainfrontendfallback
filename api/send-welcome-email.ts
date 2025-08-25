// API endpoint for sending welcome emails to new lawyer signups



// Stub handler: always returns success, does not send any email
function sendWelcomeEmailHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Accepts the request, but does nothing
  return res.status(200).json({
    success: true,
    message: 'Welcome email functionality is disabled.'
  });
}

export default sendWelcomeEmailHandler;

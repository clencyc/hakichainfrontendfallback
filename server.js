const express = require('express');
const path = require('path');
const sendSmsReminderHandler = require('./api/send-sms-reminder');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route
app.post('/api/send-sms-reminder', sendSmsReminderHandler);

// Serve static files from Vite/dist if built, or proxy to Vite dev server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, proxy all other requests to Vite dev server
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true,
    })
  );
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
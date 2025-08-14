require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fetch = require('node-fetch');
const sendSmsReminderV2Handler = require('./api/send-sms-reminder-v2.js');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting HakiChain Express server...');
app.use(express.json());

// CORS middleware for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning, x-requested-with');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Load OpenAPI specification (optional)
let openApiSpec = null;
try {
  const openApiPath = path.join(__dirname, 'openapi.yaml');
  if (fs.existsSync(openApiPath)) {
    openApiSpec = yaml.load(fs.readFileSync(openApiPath, 'utf8'));
  } else {
    console.warn('OpenAPI spec not found, skipping Swagger setup');
  }
} catch (err) {
  console.warn('Failed to load OpenAPI spec, skipping Swagger:', err.message);
}

if (openApiSpec) {
  // Swagger UI for interactive API documentation
  app.use('https://f9e4cc818023.ngrok-free.app/api/docs/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customSiteTitle: "HakiChain API Documentation",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true
    }
  }));

  // API Documentation endpoints
  app.get('https://f9e4cc818023.ngrok-free.app/api/docs/openapi.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(path.join(__dirname, 'openapi.yaml'));
  });

  app.get('https://f9e4cc818023.ngrok-free.app/api/docs/openapi.json', (req, res) => {
    try {
      const yamlContent = fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8');
      const jsonContent = yaml.load(yamlContent);
      res.json(jsonContent);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read OpenAPI JSON' });
    }
  });

  app.get('https://f9e4cc818023.ngrok-free.app/api/docs', (req, res) => {
    res.json({ title: "HakiChain API Documentation", version: "1.0.0" });
  });

  app.get('https://f9e4cc818023.ngrok-free.app/api/docs/postman', (req, res) => {
    res.sendFile(path.join(__dirname, 'HakiChain-API.postman_collection.json'));
  });
}

// Health check
app.get('https://f9e4cc818023.ngrok-free.app/api/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT, time: new Date().toISOString() });
});

// API routes - MUST come before proxy
console.log('Registering API routes...');
app.post('/api/send-sms-reminder-v2', (req, res) => {
  console.log('SMS V2 endpoint hit:', req.method, req.url);
  console.log('Request body:', req.body);
  return sendSmsReminderV2Handler(req, res);
});

// HakiLens API Proxy - to solve CORS issues
app.use('/api/hakilens', async (req, res) => {
  console.log('HakiLens proxy request:', req.method, req.originalUrl);
  
  try {
    const hakilensBaseUrl = 'https://f9e4cc818023.ngrok-free.app';
    const targetPath = req.originalUrl.replace('/api/hakilens', '');
    const targetUrl = `${hakilensBaseUrl}${targetPath}`;
    
    console.log('Proxying to:', targetUrl);
    
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    };
    
    // Don't include host and other request headers that might cause issues
    if (req.headers.authorization) {
      options.headers.authorization = req.headers.authorization;
    }
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, options);
    const data = await response.text();
    
    res.status(response.status);
    
    // Try to parse as JSON, fall back to text
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
});

console.log('API routes registered successfully');
console.log('SMS endpoint registered: /api/send-sms-reminder-v2');
console.log('HakiLens proxy registered: /api/hakilens/*');

// Serve static files from Vite/dist if built, or proxy to Vite dev server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, proxy all non-API requests to Vite dev server
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true,
      filter: (pathname) => {
        // Don't proxy API routes
        return !pathname.startsWith('/api');
      }
    })
  );
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const sendSmsReminderV2Handler = require('./api/send-sms-reminder-v2.js');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting HakiChain Express server...');
app.use(express.json());

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
  app.use('/api/docs/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
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
  app.get('/api/docs/openapi.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(path.join(__dirname, 'openapi.yaml'));
  });

  app.get('/api/docs/openapi.json', (req, res) => {
    try {
      const yamlContent = fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8');
      const jsonContent = yaml.load(yamlContent);
      res.json(jsonContent);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read OpenAPI JSON' });
    }
  });

  app.get('/api/docs', (req, res) => {
    res.json({ title: "HakiChain API Documentation", version: "1.0.0" });
  });

  app.get('/api/docs/postman', (req, res) => {
    res.sendFile(path.join(__dirname, 'HakiChain-API.postman_collection.json'));
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT, time: new Date().toISOString() });
});

// API routes - MUST come before proxy
console.log('Registering API routes...');
app.post('/api/send-sms-reminder-v2', (req, res) => {
  console.log('SMS V2 endpoint hit:', req.method, req.url);
  console.log('Request body:', req.body);
  return sendSmsReminderV2Handler(req, res);
});
console.log('API routes registered successfully');
console.log('SMS endpoint registered: /api/send-sms-reminder-v2');

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
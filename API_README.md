# HakiChain API Documentation

This directory contains comprehensive API documentation for the HakiChain legal services platform.

## Documentation Files

### 📚 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
Complete API documentation including:
- Current endpoints (SMS reminder service)
- Planned endpoints (bounties, lawyers, payments, etc.)
- Authentication methods
- Rate limiting
- Error handling
- SDK examples
- Webhook documentation

### 📋 [openapi.yaml](./openapi.yaml)
OpenAPI 3.0 specification for the HakiChain API. Use this file to:
- Generate client SDKs
- Import into API tools like Swagger UI
- Validate API requests/responses
- Generate mock servers

### 📮 [HakiChain-API.postman_collection.json](./HakiChain-API.postman_collection.json)
Postman collection for testing the HakiChain API. Includes:
- Pre-configured requests for all endpoints
- Test scripts for validation
- Environment variables
- Example responses

## Current API Status

**🚧 Development Phase**: The API is currently in early development.

### ✅ Implemented Endpoints
- `POST /api/send-sms-reminder` - Send SMS reminders to lawyers and clients

### 🔄 Planned Endpoints
- Authentication (`/auth/*`)
- Bounties management (`/bounties/*`)
- Lawyer profiles (`/lawyers/*`)
- Payment processing (`/payments/*`)
- Document management (`/documents/*`)
- Blockchain integration (`/blockchain/*`)

## Quick Start

### 1. Start the Development Server
```bash
npm run api
# Server runs on http://localhost:3001
```

### 2. Test the SMS Endpoint
```bash
curl -X POST http://localhost:3001/api/send-sms-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "lawyer_phone": "+1234567890",
    "client_phone": "+0987654321",
    "message": "Test reminder message"
  }'
```

### 3. Expected Response
```json
{
  "success": true,
  "message": "SMS sent successfully to both parties",
  "clientResult": {"status": "SUCCESS"},
  "lawyerResult": {"status": "SUCCESS"}
}
```

## Using the Documentation

### Postman Collection
1. Import `HakiChain-API.postman_collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:3001/api`
   - `lawyer_phone`: Your test phone number
   - `client_phone`: Another test phone number
3. Run the "Send SMS Reminder" request

### OpenAPI Specification
```bash
# Install Swagger UI (if not already installed)
npm install -g swagger-ui-serve

# Serve the OpenAPI spec
swagger-ui-serve openapi.yaml

# Open http://localhost:3000 to view the API docs
```

### SDK Generation
```bash
# Generate JavaScript SDK from OpenAPI spec
npx openapi-generator-cli generate \
  -i openapi.yaml \
  -g javascript \
  -o ./generated/javascript-sdk

# Generate Python SDK
npx openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o ./generated/python-sdk
```

## Environment Configuration

Required environment variables for the SMS service:

```bash
# SMS Service (Tiara Connect)
TIARA_API_KEY=your_tiara_api_key

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "details": "Detailed error information",
  "timestamp": "2025-08-10T12:00:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid API key)
- `429` - Rate Limited
- `500` - Internal Server Error

## Contributing

When adding new API endpoints:

1. **Update the Express server** (`server.js`)
2. **Create endpoint handler** (`api/` directory)
3. **Update OpenAPI spec** (`openapi.yaml`)
4. **Add Postman requests** (collection file)
5. **Document in markdown** (`API_DOCUMENTATION.md`)
6. **Add tests** for the new endpoint

## Support

- 📖 **Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/HakiChain-Main/Hakichain-Site/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/HakiChain-Main/Hakichain-Site/discussions)

## Roadmap

### Phase 1 (Current)
- [x] Basic Express server setup
- [x] SMS reminder endpoint
- [x] API documentation

### Phase 2 (Next)
- [ ] Authentication system
- [ ] User management endpoints
- [ ] Rate limiting implementation

### Phase 3 (Future)
- [ ] Bounty management API
- [ ] Payment processing
- [ ] Blockchain integration
- [ ] Document management
- [ ] Webhook system

---

**Note**: This API is in active development. Breaking changes may occur until version 1.0.0 is released.

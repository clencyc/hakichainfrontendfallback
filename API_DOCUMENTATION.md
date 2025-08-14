# HakiChain API Documentation

## Overview

HakiChain provides a RESTful API for integrating legal services, bounty management, and blockchain functionality into third-party applications. This documentation covers all available endpoints, authentication methods, and integration examples.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.hakichain.com/api` (when deployed)

## Authentication

All API requests require authentication using Bearer tokens.

```http
Authorization: Bearer {your_api_key}
Content-Type: application/json
```

## Rate Limiting

- **Free Tier**: 1,000 requests per hour
- **Pro Tier**: 10,000 requests per hour
- **Enterprise**: Custom limits available

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests per hour
- `X-RateLimit-Remaining`: Remaining requests this hour
- `X-RateLimit-Reset`: Time when rate limit resets

## Current API Endpoints

### SMS Reminder Service

#### Send SMS Reminder
Send SMS reminders to lawyers and clients about upcoming appointments or deadlines.

**Endpoint**: `POST /api/send-sms-reminder`

**Request Body**:
```json
{
  "lawyer_phone": "+1234567890",
  "client_phone": "+0987654321",
  "message": "Reminder: You have a court hearing tomorrow at 10:00 AM"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "SMS sent successfully to both parties",
  "clientResult": {
    "status": "SUCCESS",
    "messageId": "msg_123456"
  },
  "lawyerResult": {
    "status": "SUCCESS",
    "messageId": "msg_123457"
  }
}
```

**Response Error (400)**:
```json
{
  "error": "Missing required fields"
}
```

**Response Error (500)**:
```json
{
  "success": false,
  "error": "Failed to send SMS",
  "details": "Invalid phone number format",
  "timestamp": "2025-08-10T12:00:00.000Z"
}
```

## Planned API Endpoints

Based on the application structure, here are the recommended API endpoints for future implementation:

### Authentication API

#### Register User
```http
POST /api/auth/register
```

#### Login User
```http
POST /api/auth/login
```

#### Logout User
```http
POST /api/auth/logout
```

#### Refresh Token
```http
POST /api/auth/refresh
```

### Bounties API

#### List Bounties
```http
GET /api/bounties
```

Query Parameters:
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `category` (string): Filter by category
- `status` (string): Filter by status
- `min_budget` (number): Minimum budget filter
- `max_budget` (number): Maximum budget filter

#### Get Bounty Details
```http
GET /api/bounties/{id}
```

#### Create Bounty
```http
POST /api/bounties
```

#### Update Bounty
```http
PUT /api/bounties/{id}
```

#### Delete Bounty
```http
DELETE /api/bounties/{id}
```

### Lawyers API

#### List Lawyers
```http
GET /api/lawyers
```

Query Parameters:
- `specialization` (string): Filter by legal specialization
- `rating` (number): Minimum rating filter
- `location` (string): Filter by location
- `available` (boolean): Filter by availability

#### Get Lawyer Profile
```http
GET /api/lawyers/{id}
```

#### Update Lawyer Profile
```http
PUT /api/lawyers/{id}
```

#### Apply for Bounty
```http
POST /api/lawyers/applications
```

### Payments API

#### Create Escrow Payment
```http
POST /api/payments/escrow
```

#### Release Payment
```http
POST /api/payments/release
```

#### Get Payment History
```http
GET /api/payments/history
```

#### Get Transaction Details
```http
GET /api/transactions/{id}
```

### Blockchain API

#### Get Wallet Balance
```http
GET /api/blockchain/balance/{address}
```

#### Get Transactions
```http
GET /api/blockchain/transactions
```

#### Execute Contract Function
```http
POST /api/blockchain/contracts
```

### Documents API

#### Upload Document
```http
POST /api/documents
```

#### Get Document
```http
GET /api/documents/{id}
```

#### Sign Document
```http
POST /api/documents/{id}/sign
```

#### Verify Signature
```http
GET /api/documents/{id}/verify
```

### NGO API

#### List NGOs
```http
GET /api/ngos
```

#### Get NGO Profile
```http
GET /api/ngos/{id}
```

#### NGO Analytics
```http
GET /api/ngos/{id}/analytics
```

### Donor API

#### List Donors
```http
GET /api/donors
```

#### Donation History
```http
GET /api/donors/{id}/donations
```

#### Make Donation
```http
POST /api/donations
```

## Webhooks

HakiChain supports webhooks for real-time event notifications.

### Webhook Events

- `bounty.created` - New bounty created
- `bounty.updated` - Bounty information updated
- `bounty.assigned` - Lawyer assigned to bounty
- `bounty.completed` - Bounty marked as completed
- `payment.created` - New payment initiated
- `payment.released` - Payment released to lawyer
- `document.signed` - Document digitally signed
- `application.submitted` - Lawyer application submitted

### Webhook Payload Example

```json
{
  "event": "bounty.created",
  "timestamp": "2025-08-10T12:00:00.000Z",
  "data": {
    "id": "bounty_123",
    "title": "Legal Consultation Required",
    "budget": 1000,
    "category": "civil_rights",
    "ngo_id": "ngo_456"
  }
}
```

### Webhook Security

All webhook payloads are signed using HMAC-SHA256. Verify the signature using the `X-Signature` header:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## Error Handling

All API endpoints return consistent error responses:

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "specific_field",
      "value": "invalid_value"
    }
  }
}
```

### Common Error Codes

- `INVALID_PARAMETER` - Invalid request parameter
- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Rate limit exceeded
- `INTERNAL_ERROR` - Server error

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## SDK Examples

### JavaScript/TypeScript

```javascript
const HakiChain = require('hakichain-sdk');

const client = new HakiChain({
  apiKey: 'your_api_key',
  baseURL: 'https://api.hakichain.com'
});

// List bounties
const bounties = await client.bounties.list({
  category: 'civil_rights',
  limit: 10
});

// Create bounty
const newBounty = await client.bounties.create({
  title: 'Legal Consultation Needed',
  description: 'Need help with contract review',
  budget: 1500,
  category: 'contract_law'
});

// Send SMS reminder
const smsResult = await client.notifications.sendSMS({
  lawyer_phone: '+1234567890',
  client_phone: '+0987654321',
  message: 'Court hearing reminder'
});
```

### Python

```python
import hakichain

client = hakichain.Client(
    api_key='your_api_key',
    base_url='https://api.hakichain.com'
)

# List bounties
bounties = client.bounties.list(
    category='civil_rights',
    limit=10
)

# Create bounty
new_bounty = client.bounties.create(
    title='Legal Consultation Needed',
    description='Need help with contract review',
    budget=1500,
    category='contract_law'
)

# Send SMS reminder
sms_result = client.notifications.send_sms(
    lawyer_phone='+1234567890',
    client_phone='+0987654321',
    message='Court hearing reminder'
)
```

### cURL Examples

#### Send SMS Reminder
```bash
curl -X POST https://api.hakichain.com/api/send-sms-reminder \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "lawyer_phone": "+1234567890",
    "client_phone": "+0987654321",
    "message": "Reminder: Court hearing tomorrow at 10:00 AM"
  }'
```

#### List Bounties
```bash
curl -X GET "https://api.hakichain.com/api/bounties?category=civil_rights&limit=10" \
  -H "Authorization: Bearer your_api_key"
```

#### Create Bounty
```bash
curl -X POST https://api.hakichain.com/api/bounties \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Legal Consultation Required",
    "description": "Need assistance with contract review",
    "budget": 1000,
    "category": "contract_law",
    "deadline": "2025-12-31"
  }'
```

## Environment Configuration

### Required Environment Variables

```bash
# Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMS Service
TIARA_API_KEY=your_tiara_api_key

# Blockchain
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://rpc.sepolia-api.lisk.com

# API Configuration
API_BASE_URL=https://api.hakichain.com
JWT_SECRET=your_jwt_secret
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=1000
```

## Testing

### Running API Tests

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run API server
npm run api

# Test SMS endpoint
curl -X POST http://localhost:3000/api/send-sms-reminder \
  -H "Content-Type: application/json" \
  -d '{
    "lawyer_phone": "+1234567890",
    "client_phone": "+0987654321",
    "message": "Test message"
  }'
```

### Test Environment

Use the development environment for testing:
- Base URL: `http://localhost:3000/api`
- No authentication required for development
- Rate limiting disabled

## Support

For API support and questions:
- Documentation: [https://docs.hakichain.com](https://docs.hakichain.com)
- GitHub Issues: [https://github.com/HakiChain-Main/Hakichain-Site/issues](https://github.com/HakiChain-Main/Hakichain-Site/issues)
- Email: api-support@hakichain.com

## Changelog

### Version 1.0.0 (Current)
- SMS reminder endpoint (`POST /api/send-sms-reminder`)
- Basic Express.js server setup
- Tiara Connect SMS integration

### Planned Features
- Authentication system
- Full CRUD operations for bounties, lawyers, and NGOs
- Blockchain integration endpoints
- Document management API
- Payment processing
- Webhook system

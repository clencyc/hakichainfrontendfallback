import { motion } from 'framer-motion';
import { Code, Shield, Database, ArrowRight, CheckCircle, AlertTriangle, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const API = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Code}
        title="API Documentation"
        subtitle="RESTful API reference for HakiChain platform integration"
        description="Comprehensive API documentation for developers to integrate with HakiChain's legal services platform, including authentication, endpoints, and code examples."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <ContentSection>
            <SectionHeader
              title="API Overview"
              subtitle="Understanding HakiChain's RESTful API"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain provides a comprehensive RESTful API that enables developers to integrate 
                legal services, bounty management, and blockchain functionality into their applications.
              </p>
            </div>
          </ContentSection>

          {/* Base URL & Authentication */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Base URL & Authentication"
              subtitle="API endpoints and authentication methods"
              icon={<Globe className="w-8 h-8" />}
            />
            
            <AlertBox
              title="API Base URLs"
              type="info"
              icon={<Database className="w-6 h-6" />}
            >
              <p>
                <strong>Production:</strong> https://api.hakichain.com/v1<br />
                <strong>Staging:</strong> https://api-staging.hakichain.com/v1<br />
                <strong>Development:</strong> https://api-dev.hakichain.com/v1
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Authentication">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">API Keys</h4>
                    <p className="text-primary-800 text-sm">Bearer token authentication required</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Rate Limiting</h4>
                    <p className="text-secondary-800 text-sm">1000 requests per hour per API key</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">CORS</h4>
                    <p className="text-accent-800 text-sm">Cross-origin requests supported</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Request Headers" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Authorization</h4>
                      <p className="text-sm text-gray-600">Bearer {`{api_key}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Content-Type</h4>
                      <p className="text-sm text-gray-600">application/json</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Accept</h4>
                      <p className="text-sm text-gray-600">application/json</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Bounties API */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Bounties API"
              subtitle="Manage legal bounties and cases"
              icon={<Zap className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="GET /bounties">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">List Bounties</h4>
                    <p className="text-primary-800 text-sm">Retrieve all available legal bounties</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`GET /api/v1/bounties
Authorization: Bearer {api_key}`}</pre>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="POST /bounties" variant="info">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Create Bounty</h4>
                    <p className="text-secondary-800 text-sm">Create a new legal bounty</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`POST /api/v1/bounties
{
  "title": "Case Title",
  "description": "Case description",
  "budget": 1000,
  "category": "civil_rights",
  "deadline": "2024-12-31"
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <InfoCard title="GET /bounties/{id}">
                <div className="space-y-4">
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Get Bounty Details</h4>
                    <p className="text-accent-800 text-sm">Retrieve specific bounty information</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`GET /api/v1/bounties/123
Authorization: Bearer {api_key}`}</pre>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="PUT /bounties/{id}" variant="highlight">
                <div className="space-y-4">
                  <div className="p-4 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-success-900 mb-2">Update Bounty</h4>
                    <p className="text-success-800 text-sm">Update bounty information</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`PUT /api/v1/bounties/123
{
  "title": "Updated Title",
  "budget": 1500
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Lawyers API */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Lawyers API"
              subtitle="Manage lawyer profiles and applications"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="GET /lawyers">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">List Lawyers</h4>
                    <p className="text-primary-800 text-sm">Retrieve verified lawyer profiles</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`GET /api/v1/lawyers?specialization=civil_rights&rating=4.5
Authorization: Bearer {api_key}`}</pre>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="POST /lawyers/applications" variant="info">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Apply for Bounty</h4>
                    <p className="text-secondary-800 text-sm">Submit lawyer application for bounty</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`POST /api/v1/lawyers/applications
{
  "bounty_id": 123,
  "proposal": "Detailed proposal",
  "estimated_duration": 30,
  "fee_structure": "fixed"
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Payments API */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Payments API"
              subtitle="Handle payments and transactions"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Payment Security"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                All payment endpoints require additional authentication and are subject to 
                strict security measures including rate limiting and fraud detection.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="POST /payments/escrow">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Create Escrow</h4>
                    <p className="text-primary-800 text-sm">Create escrow payment for bounty</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`POST /api/v1/payments/escrow
{
  "bounty_id": 123,
  "amount": 1000,
  "currency": "HAKI",
  "milestones": [
    {"name": "Initial Review", "amount": 200},
    {"name": "Court Filing", "amount": 300},
    {"name": "Final Resolution", "amount": 500}
  ]
}`}</pre>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="POST /payments/release" variant="highlight">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Release Payment</h4>
                    <p className="text-secondary-800 text-sm">Release milestone payment to lawyer</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`POST /api/v1/payments/release
{
  "escrow_id": "esc_123",
  "milestone_id": "mil_456",
  "amount": 200,
  "reason": "Milestone completed"
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Blockchain API */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Blockchain API"
              subtitle="Interact with smart contracts and blockchain data"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="GET /blockchain/transactions">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Get Transactions</h4>
                    <p className="text-primary-800 text-sm">Retrieve blockchain transactions</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`GET /api/v1/blockchain/transactions?address=0x123...&limit=10
Authorization: Bearer {api_key}`}</pre>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="POST /blockchain/contracts" variant="info">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Contract Interaction</h4>
                    <p className="text-secondary-800 text-sm">Execute smart contract functions</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    <pre>{`POST /api/v1/blockchain/contracts
{
  "contract": "LegalBounty",
  "function": "createBounty",
  "params": ["title", "description", "1000000000000000000"]
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Webhooks */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Webhooks"
              subtitle="Real-time event notifications"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Webhook Events">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">bounty.created</h4>
                    <p className="text-primary-800 text-sm">New bounty created</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">bounty.assigned</h4>
                    <p className="text-secondary-800 text-sm">Lawyer assigned to bounty</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">payment.released</h4>
                    <p className="text-accent-800 text-sm">Payment released to lawyer</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Webhook Setup" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Register Endpoint</h4>
                      <p className="text-sm text-gray-600">Provide HTTPS endpoint URL</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Verify Signature</h4>
                      <p className="text-sm text-gray-600">Verify webhook authenticity</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Handle Events</h4>
                      <p className="text-sm text-gray-600">Process incoming webhook data</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Error Handling */}
          <ContentSection delay={0.7}>
            <SectionHeader
              title="Error Handling"
              subtitle="Understanding API error responses"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="HTTP Status Codes">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">200 - Success</h4>
                    <p className="text-primary-800 text-sm">Request completed successfully</p>
                  </div>
                  <div className="p-4 bg-warning-50 rounded-lg">
                    <h4 className="font-semibold text-warning-900 mb-2">400 - Bad Request</h4>
                    <p className="text-warning-800 text-sm">Invalid request parameters</p>
                  </div>
                  <div className="p-4 bg-error-50 rounded-lg">
                    <h4 className="font-semibold text-error-900 mb-2">401 - Unauthorized</h4>
                    <p className="text-error-800 text-sm">Invalid or missing API key</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Error Response Format" variant="info">
                <div className="space-y-4">
                  <div className="bg-gray-900 text-red-400 p-3 rounded text-sm font-mono">
                    <pre>{`{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid bounty ID",
    "details": {
      "field": "bounty_id",
      "value": "abc123"
    }
  }
}`}</pre>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* SDKs & Libraries */}
          <ContentSection delay={0.8}>
            <SectionHeader
              title="SDKs & Libraries"
              subtitle="Official client libraries for popular languages"
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="JavaScript/TypeScript">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">hakichain-js</h4>
                  <p className="text-sm text-gray-600 mb-4">Official JavaScript SDK</p>
                  <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View on npm →
                  </a>
                </div>
              </InfoCard>
              <InfoCard title="Python" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🐍</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">hakichain-python</h4>
                  <p className="text-sm text-gray-600 mb-4">Official Python SDK</p>
                  <a href="#" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                    View on PyPI →
                  </a>
                </div>
              </InfoCard>
              <InfoCard title="React Hook" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚛️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">use-hakichain</h4>
                  <p className="text-sm text-gray-600 mb-4">React hook for HakiChain</p>
                  <a href="#" className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                    View on npm →
                  </a>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Rate Limits */}
          <ContentSection delay={0.9}>
            <SectionHeader
              title="Rate Limits & Quotas"
              subtitle="API usage limits and quotas"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Rate Limits">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Free Tier</h4>
                    <p className="text-primary-800 text-sm">1,000 requests per hour</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Pro Tier</h4>
                    <p className="text-secondary-800 text-sm">10,000 requests per hour</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Enterprise</h4>
                    <p className="text-accent-800 text-sm">Custom limits available</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Headers" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">X-RateLimit-Limit</h4>
                      <p className="text-sm text-gray-600">Maximum requests per hour</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">X-RateLimit-Remaining</h4>
                      <p className="text-sm text-gray-600">Remaining requests this hour</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">X-RateLimit-Reset</h4>
                      <p className="text-sm text-gray-600">Time until rate limit resets</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={1.0}>
            <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
              <p className="text-xl mb-6 text-secondary-100">
                Start building with HakiChain's API today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://github.com/hakichain/api-examples" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>View Examples</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <Link 
                  to="/register" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Get API Key
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
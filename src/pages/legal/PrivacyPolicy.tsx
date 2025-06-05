import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              Last updated: March 15, 2025
            </p>

            <h2>1. Introduction</h2>
            <p>
              HakiChain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Professional credentials (for lawyers)</li>
              <li>Organization details (for NGOs)</li>
              <li>Payment information</li>
              <li>Blockchain wallet addresses</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you use our platform, we automatically collect certain information, including:
            </p>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Blockchain transaction data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process transactions and payments</li>
              <li>Verify user identities and credentials</li>
              <li>Match lawyers with legal bounties</li>
              <li>Communicate with users</li>
              <li>Improve our platform</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Other platform users (as necessary for service delivery)</li>
              <li>Service providers and partners</li>
              <li>Legal authorities (when required by law)</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
            </ul>

            <h2>7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@hakichain.com
              <br />
              Address: [Your Address]
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
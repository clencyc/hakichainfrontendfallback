import { motion } from 'framer-motion';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              Last updated: March 15, 2025
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using HakiChain, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              HakiChain is a blockchain-based platform that connects NGOs, lawyers, and donors to facilitate legal aid through bounties and smart contracts.
            </p>

            <h2>3. User Accounts</h2>
            <h3>3.1 Registration</h3>
            <p>
              To use certain features of the platform, you must register for an account. You agree to provide accurate and complete information during registration.
            </p>

            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the security of your account and wallet credentials. HakiChain cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>

            <h2>4. User Responsibilities</h2>
            <h3>4.1 Lawyers</h3>
            <ul>
              <li>Maintain valid legal credentials</li>
              <li>Provide accurate professional information</li>
              <li>Complete accepted bounties professionally</li>
              <li>Submit required documentation and proof of work</li>
            </ul>

            <h3>4.2 NGOs</h3>
            <ul>
              <li>Create accurate bounty descriptions</li>
              <li>Provide clear milestone requirements</li>
              <li>Verify and approve completed work</li>
              <li>Maintain organizational verification</li>
            </ul>

            <h3>4.3 Donors</h3>
            <ul>
              <li>Ensure sufficient funds for donations</li>
              <li>Comply with applicable financial regulations</li>
              <li>Verify donation recipients</li>
            </ul>

            <h2>5. Payments and Fees</h2>
            <p>
              All payments are processed through smart contracts. Platform fees are clearly disclosed before transactions. Refunds are subject to the smart contract conditions.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              Users retain their intellectual property rights. By using the platform, you grant HakiChain a license to use, store, and display your content.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              HakiChain is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>

            <h2>8. Dispute Resolution</h2>
            <p>
              Any disputes will be resolved through binding arbitration, except where prohibited by law.
            </p>

            <h2>9. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
              <br />
              Email: legal@hakichain.com
              <br />
              Address: [Your Address]
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
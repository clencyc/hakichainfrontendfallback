import { motion } from 'framer-motion';

export const LegalNotice = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-serif font-bold mb-8">Legal Notice</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              Last updated: March 15, 2025
            </p>

            <h2>1. Company Information</h2>
            <p>
              HakiChain is operated by [Company Name]
              <br />
              Registration Number: [Number]
              <br />
              Registered Address: [Address]
            </p>

            <h2>2. Disclaimer</h2>
            <p>
              The information provided on HakiChain is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the platform.
            </p>

            <h2>3. Professional Notice</h2>
            <p>
              HakiChain is a platform that facilitates connections between legal professionals, NGOs, and donors. We do not provide legal services directly. Any legal services are provided by independent legal professionals.
            </p>

            <h2>4. No Attorney-Client Relationship</h2>
            <p>
              Use of HakiChain does not create an attorney-client relationship. Any such relationship is formed directly between users and legal professionals through separate agreements.
            </p>

            <h2>5. Not Legal Advice</h2>
            <p>
              Content on HakiChain, including blog posts, documentation, and other materials, does not constitute legal advice. Users should consult qualified legal professionals for specific legal matters.
            </p>

            <h2>6. Blockchain Notice</h2>
            <p>
              HakiChain utilizes blockchain technology. Users acknowledge and accept the inherent risks associated with blockchain transactions, including but not limited to:
            </p>
            <ul>
              <li>Transaction finality</li>
              <li>Smart contract execution</li>
              <li>Cryptocurrency volatility</li>
              <li>Wallet security</li>
            </ul>

            <h2>7. Copyright Notice</h2>
            <p>
              © 2025 HakiChain. All rights reserved. Any redistribution or reproduction of part or all of the contents in any form is prohibited without express written permission.
            </p>

            <h2>8. Trademark Notice</h2>
            <p>
              HakiChain™ and related marks are trademarks of [Company Name]. Other trademarks referenced are the property of their respective owners.
            </p>

            <h2>9. Jurisdiction</h2>
            <p>
              This legal notice is governed by and construed in accordance with the laws of [Jurisdiction], and any disputes shall be subject to the exclusive jurisdiction of the courts of [Jurisdiction].
            </p>

            <h2>10. Contact Information</h2>
            <p>
              For legal inquiries, please contact:
              <br />
              Email: legal@hakichain.com
              <br />
              Phone: [Phone Number]
              <br />
              Address: [Address]
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
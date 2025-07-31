import { motion } from 'framer-motion';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const DataProtectionPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Shield}
        title="Data Protection Policy"
        subtitle="Safeguarding Your Information in the Digital Age"
        description="Our comprehensive approach to protecting your personal data, ensuring privacy, and maintaining the highest standards of cybersecurity across the HakiChain platform."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Executive Summary */}
          <ContentSection>
            <SectionHeader
              title="Executive Summary"
              subtitle="Our commitment to data protection and privacy"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                At HakiChain, we recognize that trust is the foundation of our platform. This Data Protection Policy 
                outlines our comprehensive approach to safeguarding your personal information, ensuring transparency 
                in data handling, and maintaining the highest standards of cybersecurity.
              </p>
            </div>
          </ContentSection>

          {/* Data Collection and Use */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Data Collection and Use"
              subtitle="What information we collect and how we use it"
              icon={<Eye className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Information We Collect">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Personal Information</h4>
                    <ul className="text-sm text-primary-800 space-y-1">
                      <li>• Name, email, and contact details</li>
                      <li>• Professional credentials and qualifications</li>
                      <li>• Identity verification documents</li>
                      <li>• Wallet addresses and transaction data</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Usage Data</h4>
                    <ul className="text-sm text-secondary-800 space-y-1">
                      <li>• Platform interactions and preferences</li>
                      <li>• Case-related communications</li>
                      <li>• Transaction history and patterns</li>
                      <li>• Technical logs and analytics</li>
                    </ul>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="How We Use Your Data" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Platform Operations</h4>
                      <p className="text-sm text-gray-600">Facilitate legal services and transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Verification</h4>
                      <p className="text-sm text-gray-600">Verify identities and qualifications</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Communication</h4>
                      <p className="text-sm text-gray-600">Send updates and notifications</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Compliance</h4>
                      <p className="text-sm text-gray-600">Meet legal and regulatory requirements</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Data Security Measures */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Data Security Measures"
              subtitle="Multi-layered protection for your information"
              icon={<Lock className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Enterprise-Grade Security"
              type="success"
              icon={<CheckCircle className="w-6 h-6" />}
            >
              <p>
                We implement industry-leading security measures to protect your data at every level, 
                from technical infrastructure to operational procedures.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Technical Security">
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900">Encryption</h4>
                    <p className="text-primary-800 text-sm">End-to-end encryption for all data transmission</p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900">Secure Infrastructure</h4>
                    <p className="text-secondary-800 text-sm">Cloud security with multiple layers of protection</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900">Access Controls</h4>
                    <p className="text-accent-800 text-sm">Role-based access with multi-factor authentication</p>
                  </div>
                  <div className="p-3 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-success-900">Regular Audits</h4>
                    <p className="text-success-800 text-sm">Continuous security monitoring and testing</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Blockchain Security" variant="info">
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900">Immutable Records</h4>
                    <p className="text-primary-800 text-sm">All transactions recorded on secure blockchain</p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900">Smart Contracts</h4>
                    <p className="text-secondary-800 text-sm">Automated, secure execution of agreements</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900">Decentralized Storage</h4>
                    <p className="text-accent-800 text-sm">Distributed data storage for enhanced security</p>
                  </div>
                  <div className="p-3 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-success-900">Transparency</h4>
                    <p className="text-success-800 text-sm">Public verification of all transactions</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Data Retention and Deletion */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Data Retention and Deletion"
              subtitle="How long we keep your data and your rights"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Retention Periods">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Active Users</h4>
                    <p className="text-sm text-gray-600">Data retained while account is active</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Legal Requirements</h4>
                    <p className="text-sm text-gray-600">7 years for regulatory compliance</p>
                  </div>
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Transaction Records</h4>
                    <p className="text-sm text-gray-600">Permanently stored on blockchain</p>
                  </div>
                  <div className="border-l-4 border-success-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Inactive Accounts</h4>
                    <p className="text-sm text-gray-600">Data deleted after 2 years of inactivity</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Your Rights" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Access</h4>
                      <p className="text-sm text-gray-600">Request copies of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Correction</h4>
                      <p className="text-sm text-gray-600">Update or correct inaccurate information</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Deletion</h4>
                      <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Portability</h4>
                      <p className="text-sm text-gray-600">Export your data in machine-readable format</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Cybersecurity Incident Response */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Cybersecurity Incident Response"
              subtitle="Our approach to handling security threats"
              icon={<AlertTriangle className="w-8 h-8" />}
            />
            
            <InfoCard title="Incident Response Plan">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-warning-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Detection</h4>
                  <p className="text-sm text-gray-600">24/7 monitoring and threat detection</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-error-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
                  <p className="text-sm text-gray-600">Rapid evaluation of threat severity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                  <p className="text-sm text-gray-600">Immediate containment and mitigation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-success-600">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recovery</h4>
                  <p className="text-sm text-gray-600">System restoration and lessons learned</p>
                </div>
              </div>
            </InfoCard>

            <AlertBox
              title="User Notification"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Transparent Communication:</strong> In the event of a security incident that affects your data, 
                we will notify you within 72 hours of discovery, providing clear information about the incident, 
                potential impact, and steps we're taking to address it.
              </p>
            </AlertBox>
          </ContentSection>

          {/* Compliance and Regulations */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Compliance and Regulations"
              subtitle="Meeting global standards for data protection"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Regulatory Compliance">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">GDPR Compliance</h4>
                    <p className="text-primary-800 text-sm">Full compliance with European data protection regulations</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">KYC/AML Requirements</h4>
                    <p className="text-secondary-800 text-sm">Identity verification and anti-money laundering compliance</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Local Regulations</h4>
                    <p className="text-accent-800 text-sm">Compliance with Kenyan and regional data protection laws</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Industry Standards" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">ISO 27001</h4>
                      <p className="text-sm text-gray-600">Information security management certification</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">SOC 2 Type II</h4>
                      <p className="text-sm text-gray-600">Security, availability, and confidentiality controls</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">PCI DSS</h4>
                      <p className="text-sm text-gray-600">Payment card industry security standards</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Contact Information */}
          <ContentSection delay={0.6}>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Questions About Data Protection?</h2>
              <p className="text-xl mb-6 text-primary-100">
                Our dedicated privacy team is here to help with any questions about your data.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="mailto:privacy@hakichain.com" 
                  className="btn btn-accent text-base px-6 py-3"
                >
                  Contact Privacy Team
                </a>
                <Link 
                  to="/legal/kyc-aml" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  KYC/AML Policy
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
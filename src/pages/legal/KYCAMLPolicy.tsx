import { motion } from 'framer-motion';
import { Shield, UserCheck, AlertTriangle, CheckCircle, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const KYCAMLPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Shield}
        title="KYC/AML Policy"
        subtitle="Know Your Customer & Anti-Money Laundering"
        description="Our comprehensive approach to identity verification, risk assessment, and compliance with financial regulations to ensure a secure and transparent platform."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Executive Summary */}
          <ContentSection>
            <SectionHeader
              title="Executive Summary"
              subtitle="Our commitment to regulatory compliance and financial security"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                HakiChain is committed to maintaining the highest standards of regulatory compliance through 
                comprehensive Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures. These measures 
                protect our platform from financial crime while ensuring transparency and trust for all users.
              </p>
            </div>
          </ContentSection>

          {/* KYC Process */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Know Your Customer (KYC) Process"
              subtitle="Identity verification and risk assessment procedures"
              icon={<UserCheck className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Identity Verification">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Required Documents</h4>
                    <ul className="text-sm text-primary-800 space-y-1">
                      <li>• Government-issued photo ID</li>
                      <li>• Proof of address (utility bill, bank statement)</li>
                      <li>• Professional credentials (for lawyers)</li>
                      <li>• Organization registration (for NGOs)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Verification Methods</h4>
                    <ul className="text-sm text-secondary-800 space-y-1">
                      <li>• Document authenticity checks</li>
                      <li>• Facial recognition technology</li>
                      <li>• Database cross-referencing</li>
                      <li>• Manual review by compliance team</li>
                    </ul>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Risk Assessment" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Low Risk</h4>
                      <p className="text-sm text-gray-600">Standard verification procedures</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-warning-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Medium Risk</h4>
                      <p className="text-sm text-gray-600">Enhanced due diligence required</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-error-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">High Risk</h4>
                      <p className="text-sm text-gray-600">Comprehensive investigation and monitoring</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* AML Framework */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Anti-Money Laundering (AML) Framework"
              subtitle="Comprehensive measures to prevent financial crime"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Zero Tolerance Policy"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                HakiChain maintains a zero-tolerance policy towards money laundering, terrorist financing, 
                and other financial crimes. All suspicious activities are reported to relevant authorities.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Transaction Monitoring">
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900">Real-Time Monitoring</h4>
                    <p className="text-primary-800 text-sm">Automated systems track all transactions</p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900">Pattern Analysis</h4>
                    <p className="text-secondary-800 text-sm">AI-powered detection of suspicious patterns</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900">Threshold Alerts</h4>
                    <p className="text-accent-800 text-sm">Automatic alerts for unusual activity</p>
                  </div>
                  <div className="p-3 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-success-900">Manual Review</h4>
                    <p className="text-success-800 text-sm">Expert analysis of flagged transactions</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Risk-Based Approach" variant="info">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Customer Risk</h4>
                    <p className="text-sm text-gray-600">Assessment based on customer profile and behavior</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Geographic Risk</h4>
                    <p className="text-sm text-gray-600">Enhanced monitoring for high-risk jurisdictions</p>
                  </div>
                  <div className="border-l-4 border-accent-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Product Risk</h4>
                    <p className="text-sm text-gray-600">Risk assessment of different service types</p>
                  </div>
                  <div className="border-l-4 border-success-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Channel Risk</h4>
                    <p className="text-sm text-gray-600">Monitoring of different transaction channels</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Regulatory Reporting */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Regulatory Reporting"
              subtitle="Compliance with financial reporting requirements"
              icon={<FileText className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Suspicious Activity Reports (SARs)">
                <div className="space-y-4">
                  <div className="p-4 bg-warning-50 rounded-lg">
                    <h4 className="font-semibold text-warning-900 mb-2">Reporting Triggers</h4>
                    <ul className="text-sm text-warning-800 space-y-1">
                      <li>• Unusual transaction patterns</li>
                      <li>• Large or frequent transactions</li>
                      <li>• Transactions from high-risk jurisdictions</li>
                      <li>• Suspicious customer behavior</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-error-50 rounded-lg">
                    <h4 className="font-semibold text-error-900 mb-2">Reporting Process</h4>
                    <ul className="text-sm text-error-800 space-y-1">
                      <li>• Immediate internal review</li>
                      <li>• Documentation and evidence collection</li>
                      <li>• Submission to Financial Reporting Centre</li>
                      <li>• Ongoing monitoring and follow-up</li>
                    </ul>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Financial Reporting Centre (FRC)" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Reporting</h4>
                      <p className="text-sm text-gray-600">Monthly and quarterly compliance reports</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Suspicious Activity</h4>
                      <p className="text-sm text-gray-600">Immediate reporting of suspicious transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Record Keeping</h4>
                      <p className="text-sm text-gray-600">Maintenance of all required records for 7 years</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Audit Cooperation</h4>
                      <p className="text-sm text-gray-600">Full cooperation with regulatory audits</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Customer Due Diligence */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Customer Due Diligence (CDD)"
              subtitle="Ongoing monitoring and assessment of customer relationships"
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Simplified CDD">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-success-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Low-Risk Customers</h4>
                  <p className="text-sm text-gray-600">Basic identity verification and periodic reviews</p>
                </div>
              </InfoCard>
              <InfoCard title="Standard CDD" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-warning-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Medium-Risk Customers</h4>
                  <p className="text-sm text-gray-600">Enhanced verification and regular monitoring</p>
                </div>
              </InfoCard>
              <InfoCard title="Enhanced CDD" variant="warning">
                <div className="text-center">
                  <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-error-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">High-Risk Customers</h4>
                  <p className="text-sm text-gray-600">Comprehensive investigation and continuous monitoring</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Sanctions and PEP Screening */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Sanctions and PEP Screening"
              subtitle="Comprehensive screening against global databases"
            />
            
            <InfoCard title="Screening Process">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Sanctions Screening</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">UN Sanctions</h5>
                        <p className="text-sm text-gray-600">Screening against UN sanctions lists</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">US OFAC</h5>
                        <p className="text-sm text-gray-600">Office of Foreign Assets Control screening</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">EU Sanctions</h5>
                        <p className="text-sm text-gray-600">European Union sanctions compliance</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">PEP Screening</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">Political Figures</h5>
                        <p className="text-sm text-gray-600">Screening of politically exposed persons</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">Family Members</h5>
                        <p className="text-sm text-gray-600">Screening of PEP family members</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-900">Close Associates</h5>
                        <p className="text-sm text-gray-600">Screening of PEP close associates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
          </ContentSection>

          {/* Training and Compliance */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Training and Compliance"
              subtitle="Ensuring ongoing education and adherence to regulations"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Staff Training">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Initial Training</h4>
                    <p className="text-primary-800 text-sm">Comprehensive KYC/AML training for all new staff</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Annual Refresher</h4>
                    <p className="text-secondary-800 text-sm">Regular updates on regulatory changes and procedures</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Specialized Training</h4>
                    <p className="text-accent-800 text-sm">Advanced training for compliance and risk teams</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Compliance Monitoring" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Internal Audits</h4>
                      <p className="text-sm text-gray-600">Regular internal compliance reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">External Reviews</h4>
                      <p className="text-sm text-gray-600">Third-party compliance assessments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regulatory Updates</h4>
                      <p className="text-sm text-gray-600">Continuous monitoring of regulatory changes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Policy Updates</h4>
                      <p className="text-sm text-gray-600">Regular updates to policies and procedures</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Contact Information */}
          <ContentSection delay={0.7}>
            <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Questions About KYC/AML?</h2>
              <p className="text-xl mb-6 text-secondary-100">
                Our compliance team is available to answer any questions about our verification and monitoring processes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="mailto:compliance@hakichain.com" 
                  className="btn btn-accent text-base px-6 py-3"
                >
                  Contact Compliance Team
                </a>
                <Link 
                  to="/legal/data-protection" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Data Protection Policy
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
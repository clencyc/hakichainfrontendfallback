import { motion } from 'framer-motion';
import { Shield, Users, AlertTriangle, CheckCircle, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const ConsumerProtectionPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Shield}
        title="Consumer Protection Policy"
        subtitle="Safeguarding Your Rights and Ensuring Fair Treatment"
        description="Our comprehensive approach to protecting consumer rights, handling grievances, and providing fair dispute resolution mechanisms for all platform users."
        gradient="accent"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Executive Summary */}
          <ContentSection>
            <SectionHeader
              title="Executive Summary"
              subtitle="Our commitment to consumer protection and fair treatment"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                At HakiChain, we believe that consumer protection is fundamental to building trust and maintaining 
                a fair, transparent platform. This policy outlines our commitment to protecting your rights, 
                handling grievances effectively, and providing accessible dispute resolution mechanisms.
              </p>
            </div>
          </ContentSection>

          {/* Consumer Rights */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Consumer Rights"
              subtitle="Your fundamental rights as a HakiChain user"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Right to Information">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Transparent Pricing</h4>
                    <p className="text-primary-800 text-sm">Clear disclosure of all fees and charges</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Service Terms</h4>
                    <p className="text-secondary-800 text-sm">Clear explanation of service terms and conditions</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Progress Updates</h4>
                    <p className="text-accent-800 text-sm">Regular updates on case progress and status</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Right to Quality Service" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Standards</h4>
                      <p className="text-sm text-gray-600">All lawyers meet verified professional standards</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Timely Service</h4>
                      <p className="text-sm text-gray-600">Services delivered within agreed timeframes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Communication</h4>
                      <p className="text-sm text-gray-600">Clear and responsive communication throughout</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Privacy Protection</h4>
                      <p className="text-sm text-gray-600">Your personal information is protected</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Grievance Handling */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Grievance Handling Procedures"
              subtitle="How we address and resolve your concerns"
              icon={<AlertTriangle className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Our Commitment"
              type="success"
              icon={<CheckCircle className="w-6 h-6" />}
            >
              <p>
                We are committed to addressing all grievances promptly, fairly, and transparently. 
                Every complaint is taken seriously and handled with the utmost care and professionalism.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Step 1: Initial Contact">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Submit Complaint</h4>
                  <p className="text-sm text-gray-600">Contact our support team with your concern</p>
                  <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                    <p className="text-primary-800 text-xs">
                      Response within 24 hours
                    </p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Step 2: Investigation" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Thorough Review</h4>
                  <p className="text-sm text-gray-600">Comprehensive investigation of the issue</p>
                  <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                    <p className="text-secondary-800 text-xs">
                      Investigation within 3-5 days
                    </p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Step 3: Resolution" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-success-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fair Resolution</h4>
                  <p className="text-sm text-gray-600">Appropriate action and compensation if needed</p>
                  <div className="mt-4 p-3 bg-success-50 rounded-lg">
                    <p className="text-success-800 text-xs">
                      Resolution within 7 days
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Dispute Resolution */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Dispute Resolution"
              subtitle="Multiple pathways to resolve conflicts fairly"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Internal Resolution">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Support Team</h4>
                    <p className="text-primary-800 text-sm">Dedicated team to handle initial complaints</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Escalation Process</h4>
                    <p className="text-secondary-800 text-sm">Senior management review for complex issues</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Mediation</h4>
                    <p className="text-accent-800 text-sm">Neutral third-party mediation when needed</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="External Resolution" variant="warning">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Action</h4>
                      <p className="text-sm text-gray-600">Right to pursue legal remedies if needed</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regulatory Bodies</h4>
                      <p className="text-sm text-gray-600">Complaint to relevant regulatory authorities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Consumer Protection</h4>
                      <p className="text-sm text-gray-600">Appeal to consumer protection agencies</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Legal Safeguards */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Legal Safeguards"
              subtitle="Protecting your interests through legal mechanisms"
              icon={<FileText className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Clickwrap Agreements">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Explicit Consent</h4>
                    <p className="text-primary-800 text-sm">Users must actively agree to terms and conditions</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Clear Presentation</h4>
                    <p className="text-secondary-800 text-sm">Terms presented in clear, understandable language</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Record Keeping</h4>
                    <p className="text-accent-800 text-sm">All agreements are securely stored and accessible</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Privacy Notices" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Data Collection</h4>
                      <p className="text-sm text-gray-600">Clear explanation of what data we collect</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Data Usage</h4>
                      <p className="text-sm text-gray-600">How your data is used and protected</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Rights</h4>
                      <p className="text-sm text-gray-600">Your rights regarding your personal data</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>

            <AlertBox
              title="Dispute Resolution Clauses"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Fair Resolution:</strong> All agreements include clear dispute resolution clauses that 
                outline the process for handling conflicts, ensuring both parties understand their rights and obligations.
              </p>
            </AlertBox>
          </ContentSection>

          {/* Compensation and Remedies */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Compensation and Remedies"
              subtitle="Fair compensation for legitimate grievances"
              icon={<Heart className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Types of Compensation">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Financial Compensation</h4>
                    <p className="text-primary-800 text-sm">Refunds, credits, or monetary compensation</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Service Credits</h4>
                    <p className="text-secondary-800 text-sm">Credits for future services on the platform</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Service Replacement</h4>
                    <p className="text-accent-800 text-sm">Alternative service provision at no cost</p>
                  </div>
                  <div className="p-4 bg-success-50 rounded-lg">
                    <h4 className="font-semibold text-success-900 mb-2">Corrective Action</h4>
                    <p className="text-success-800 text-sm">Addressing the root cause of the issue</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Remedy Process" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Assessment</h4>
                      <p className="text-sm text-gray-600">Evaluation of the issue and appropriate remedy</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Proposal</h4>
                      <p className="text-sm text-gray-600">Clear proposal of compensation or remedy</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Implementation</h4>
                      <p className="text-sm text-gray-600">Swift implementation of agreed remedy</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Follow-up</h4>
                      <p className="text-sm text-gray-600">Verification of remedy effectiveness</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Contact Information */}
          <ContentSection delay={0.6}>
            <div className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Need Help or Have a Complaint?</h2>
              <p className="text-xl mb-6 text-accent-100">
                Our consumer protection team is here to help resolve any issues and ensure your rights are protected.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="mailto:support@hakichain.com" 
                  className="btn btn-accent text-base px-6 py-3"
                >
                  Contact Support Team
                </a>
                <Link 
                  to="/legal/terms-of-service" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
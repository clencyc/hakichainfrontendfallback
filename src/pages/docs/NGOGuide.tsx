import { motion } from 'framer-motion';
import { Users, FileText, Coins, ArrowRight, CheckCircle, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const NGOGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Users}
        title="NGO Guide"
        subtitle="Complete guide for NGOs using HakiChain"
        description="Learn how to effectively use HakiChain to submit legal cases, manage bounties, track progress, and maximize your impact in providing legal assistance to vulnerable communities."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <ContentSection>
            <SectionHeader
              title="NGO Overview"
              subtitle="How NGOs can leverage HakiChain for legal justice"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                As an NGO, HakiChain provides you with a powerful platform to connect vulnerable communities 
                with qualified legal professionals, secure funding for legal cases, and track the impact of 
                your legal assistance programs.
              </p>
            </div>
          </ContentSection>

          {/* Getting Started */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Getting Started"
              subtitle="Setting up your NGO account on HakiChain"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <AlertBox
              title="NGO Verification"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Important:</strong> All NGOs must complete verification before submitting cases. 
                This includes providing registration documents, proof of legal status, and verification of 
                organizational structure.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Step 1: Registration">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
                  <p className="text-sm text-gray-600">Register your NGO on the platform</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 2: Verification" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Submit Documents</h4>
                  <p className="text-sm text-gray-600">Provide required verification documents</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 3: Approval" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Start Using</h4>
                  <p className="text-sm text-gray-600">Begin submitting legal cases</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Submitting Cases */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Submitting Legal Cases"
              subtitle="How to create and submit legal bounties"
              icon={<FileText className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Case Requirements">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Case Details</h4>
                    <p className="text-primary-800 text-sm">Comprehensive case description and background</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Client Information</h4>
                    <p className="text-secondary-800 text-sm">Basic client details (anonymized if needed)</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Legal Category</h4>
                    <p className="text-accent-800 text-sm">Classification of legal issue type</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Submission Process" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Fill Case Form</h4>
                      <p className="text-sm text-gray-600">Complete detailed case submission form</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Upload Documents</h4>
                      <p className="text-sm text-gray-600">Attach relevant legal documents</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Review & Submit</h4>
                      <p className="text-sm text-gray-600">Review case details and submit for approval</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Funding & Budgeting */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Funding & Budgeting"
              subtitle="Managing case funding and financial planning"
              icon={<Coins className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Budget Planning">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Case Budget</h4>
                    <p className="text-primary-800 text-sm">Estimate total legal costs for the case</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Milestone Payments</h4>
                    <p className="text-secondary-800 text-sm">Break down payments by case milestones</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Funding Sources</h4>
                    <p className="text-accent-800 text-sm">Identify potential donors and funding streams</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Financial Management" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparent Tracking</h4>
                      <p className="text-sm text-gray-600">Real-time tracking of funds and expenses</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Donor Reports</h4>
                      <p className="text-sm text-gray-600">Generate reports for donors and stakeholders</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Budget Monitoring</h4>
                      <p className="text-sm text-gray-600">Monitor spending against allocated budgets</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Lawyer Matching */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Lawyer Matching & Selection"
              subtitle="Finding the right legal professional for your cases"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Matching Criteria">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Specialization</h4>
                    <p className="text-primary-800 text-sm">Match lawyers by legal expertise area</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Experience Level</h4>
                    <p className="text-secondary-800 text-sm">Consider lawyer experience and track record</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Geographic Location</h4>
                    <p className="text-accent-800 text-sm">Local knowledge and jurisdiction expertise</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Selection Process" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Review Applications</h4>
                      <p className="text-sm text-gray-600">Evaluate lawyer proposals and credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Interview Candidates</h4>
                      <p className="text-sm text-gray-600">Conduct interviews with shortlisted lawyers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Make Selection</h4>
                      <p className="text-sm text-gray-600">Choose the best lawyer for the case</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Case Management */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Case Management"
              subtitle="Tracking progress and managing ongoing cases"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Progress Tracking">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Milestone Updates</h4>
                    <p className="text-primary-800 text-sm">Track completion of case milestones</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Communication</h4>
                    <p className="text-secondary-800 text-sm">Stay in touch with assigned lawyers</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Document Management</h4>
                    <p className="text-accent-800 text-sm">Organize and access case documents</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Quality Assurance" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Reviews</h4>
                      <p className="text-sm text-gray-600">Periodic review of case progress</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Client Feedback</h4>
                      <p className="text-sm text-gray-600">Gather feedback from clients</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                      <p className="text-sm text-gray-600">Track lawyer and case performance</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Impact Measurement */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Impact Measurement"
              subtitle="Tracking and reporting your legal assistance impact"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Quantitative Metrics">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Case Statistics</h4>
                  <p className="text-sm text-gray-600">Number of cases, success rates, outcomes</p>
                </div>
              </InfoCard>
              <InfoCard title="Qualitative Impact" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Client Stories</h4>
                  <p className="text-sm text-gray-600">Personal impact stories and testimonials</p>
                </div>
              </InfoCard>
              <InfoCard title="Social Impact" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Benefits</h4>
                  <p className="text-sm text-gray-600">Broader community and systemic impact</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Best Practices */}
          <ContentSection delay={0.7}>
            <SectionHeader
              title="Best Practices"
              subtitle="Tips for maximizing your impact on HakiChain"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Case Submission">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Detailed Descriptions</h4>
                      <p className="text-sm text-gray-600">Provide comprehensive case information</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Realistic Budgets</h4>
                      <p className="text-sm text-gray-600">Set appropriate and realistic budgets</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Clear Milestones</h4>
                      <p className="text-sm text-gray-600">Define clear case milestones</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Communication" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Updates</h4>
                      <p className="text-sm text-gray-600">Maintain regular communication with lawyers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Client Involvement</h4>
                      <p className="text-sm text-gray-600">Keep clients informed of progress</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Feedback Loop</h4>
                      <p className="text-sm text-gray-600">Provide and request feedback regularly</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Resources */}
          <ContentSection delay={0.8}>
            <SectionHeader
              title="Resources & Support"
              subtitle="Additional resources for NGOs"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Documentation">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">User Manual</h4>
                    <p className="text-primary-800 text-sm">Comprehensive platform user guide</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Video Tutorials</h4>
                    <p className="text-secondary-800 text-sm">Step-by-step video guides</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">FAQ</h4>
                    <p className="text-accent-800 text-sm">Frequently asked questions</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Support Channels" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Support</h4>
                      <p className="text-sm text-gray-600">ngo-support@hakichain.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      <p className="text-sm text-gray-600">24/7 platform support</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Community Forum</h4>
                      <p className="text-sm text-gray-600">Connect with other NGOs</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.9}>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
              <p className="text-xl mb-6 text-primary-100">
                Start using HakiChain to provide legal assistance to those who need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Register Your NGO</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/create-bounty" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Submit Your First Case
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
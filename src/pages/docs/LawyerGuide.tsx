import { motion } from 'framer-motion';
import { Users, FileText, Coins, ArrowRight, CheckCircle, AlertTriangle, Shield, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const LawyerGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Users}
        title="Lawyer Guide"
        subtitle="Complete guide for legal professionals using HakiChain"
        description="Learn how to effectively use HakiChain to find legal cases, build your reputation, manage client relationships, and grow your practice while making a positive social impact."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <ContentSection>
            <SectionHeader
              title="Lawyer Overview"
              subtitle="How legal professionals can leverage HakiChain"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                As a legal professional, HakiChain provides you with access to meaningful cases, 
                secure payment processing, reputation building tools, and the opportunity to make 
                a significant impact in providing legal justice to vulnerable communities.
              </p>
            </div>
          </ContentSection>

          {/* Getting Started */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="Getting Started"
              subtitle="Setting up your lawyer profile on HakiChain"
              icon={<Shield className="w-8 h-8" />}
            />
            
            <AlertBox
              title="Professional Verification"
              type="warning"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Important:</strong> All lawyers must complete professional verification before 
                applying for cases. This includes bar license verification, background checks, and 
                professional credential validation.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Step 1: Registration">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create Profile</h4>
                  <p className="text-sm text-gray-600">Register as a legal professional</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 2: Verification" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Submit Credentials</h4>
                  <p className="text-sm text-gray-600">Provide bar license and certifications</p>
                </div>
              </InfoCard>
              <InfoCard title="Step 3: Profile Setup" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Profile</h4>
                  <p className="text-sm text-gray-600">Add specializations and experience</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Profile Optimization */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="Profile Optimization"
              subtitle="Creating a compelling lawyer profile"
              icon={<Award className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Profile Elements">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Professional Summary</h4>
                    <p className="text-primary-800 text-sm">Compelling overview of your practice</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Specializations</h4>
                    <p className="text-secondary-800 text-sm">Areas of legal expertise</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Experience & Cases</h4>
                    <p className="text-accent-800 text-sm">Relevant case history and outcomes</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Profile Tips" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Be Specific</h4>
                      <p className="text-sm text-gray-600">Detail your specific legal expertise</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Show Impact</h4>
                      <p className="text-sm text-gray-600">Highlight successful case outcomes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Keep Updated</h4>
                      <p className="text-sm text-gray-600">Regularly update your profile</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Finding Cases */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="Finding & Applying for Cases"
              subtitle="How to discover and apply for legal bounties"
              icon={<FileText className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Case Discovery">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Browse Bounties</h4>
                    <p className="text-primary-800 text-sm">Search available legal cases</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Filter Options</h4>
                    <p className="text-secondary-800 text-sm">Filter by specialization, location, budget</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Case Alerts</h4>
                    <p className="text-accent-800 text-sm">Get notified of new relevant cases</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Application Process" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Review Case Details</h4>
                      <p className="text-sm text-gray-600">Thoroughly understand the case requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Prepare Proposal</h4>
                      <p className="text-sm text-gray-600">Create compelling case proposal</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Submit Application</h4>
                      <p className="text-sm text-gray-600">Submit complete application package</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Case Management */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Case Management"
              subtitle="Managing assigned cases and client relationships"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Case Workflow">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Initial Assessment</h4>
                    <p className="text-primary-800 text-sm">Review case details and develop strategy</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Milestone Tracking</h4>
                    <p className="text-secondary-800 text-sm">Update progress on case milestones</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Client Communication</h4>
                    <p className="text-accent-800 text-sm">Maintain regular client updates</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Best Practices" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Updates</h4>
                      <p className="text-sm text-gray-600">Provide frequent progress updates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Document Management</h4>
                      <p className="text-sm text-gray-600">Organize and upload case documents</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Timeline Adherence</h4>
                      <p className="text-sm text-gray-600">Meet milestone deadlines</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Payment & Billing */}
          <ContentSection delay={0.5}>
            <SectionHeader
              title="Payment & Billing"
              subtitle="Understanding payment processes and fee structures"
              icon={<Coins className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Payment Structure">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Milestone Payments</h4>
                    <p className="text-primary-800 text-sm">Payments released upon milestone completion</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Escrow System</h4>
                    <p className="text-secondary-800 text-sm">Secure payment held in escrow</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">HAKI Tokens</h4>
                    <p className="text-accent-800 text-sm">Payments made in HAKI tokens</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Payment Process" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Milestone Submission</h4>
                      <p className="text-sm text-gray-600">Submit completed milestone for review</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Approval Process</h4>
                      <p className="text-sm text-gray-600">NGO reviews and approves milestone</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Payment Release</h4>
                      <p className="text-sm text-gray-600">Payment automatically released to wallet</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Reputation System */}
          <ContentSection delay={0.6}>
            <SectionHeader
              title="Reputation & Reviews"
              subtitle="Building and maintaining your professional reputation"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Rating System">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Client Ratings</h4>
                  <p className="text-sm text-gray-600">Star ratings from case outcomes</p>
                </div>
              </InfoCard>
              <InfoCard title="Review System" variant="info">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Detailed Reviews</h4>
                  <p className="text-sm text-gray-600">Written feedback from clients</p>
                </div>
              </InfoCard>
              <InfoCard title="Success Metrics" variant="highlight">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Stats</h4>
                  <p className="text-sm text-gray-600">Case success rates and outcomes</p>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Professional Development */}
          <ContentSection delay={0.7}>
            <SectionHeader
              title="Professional Development"
              subtitle="Growing your practice and expanding your impact"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Growth Opportunities">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Case Diversity</h4>
                    <p className="text-primary-800 text-sm">Access to various legal case types</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Network Building</h4>
                    <p className="text-secondary-800 text-sm">Connect with other legal professionals</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Skill Development</h4>
                    <p className="text-accent-800 text-sm">Develop expertise in new areas</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Impact Opportunities" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Social Justice</h4>
                      <p className="text-sm text-gray-600">Make a difference in communities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Pro Bono Work</h4>
                      <p className="text-sm text-gray-600">Contribute to legal aid initiatives</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Mentorship</h4>
                      <p className="text-sm text-gray-600">Guide new legal professionals</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Best Practices */}
          <ContentSection delay={0.8}>
            <SectionHeader
              title="Best Practices"
              subtitle="Tips for success on HakiChain"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Case Applications">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Tailored Proposals</h4>
                      <p className="text-sm text-gray-600">Customize proposals for each case</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Realistic Timelines</h4>
                      <p className="text-sm text-gray-600">Set achievable milestone deadlines</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Clear Communication</h4>
                      <p className="text-sm text-gray-600">Maintain open communication channels</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Client Relations" variant="info">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Empathy & Understanding</h4>
                      <p className="text-sm text-gray-600">Show compassion for client situations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Updates</h4>
                      <p className="text-sm text-gray-600">Keep clients informed of progress</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Excellence</h4>
                      <p className="text-sm text-gray-600">Maintain high professional standards</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Resources */}
          <ContentSection delay={0.9}>
            <SectionHeader
              title="Resources & Support"
              subtitle="Additional resources for legal professionals"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Educational Resources">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Legal Training</h4>
                    <p className="text-primary-800 text-sm">Platform-specific legal training</p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Best Practices</h4>
                    <p className="text-secondary-800 text-sm">Guidelines for effective case management</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Tool Tutorials</h4>
                    <p className="text-accent-800 text-sm">Platform feature tutorials</p>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Support Channels" variant="highlight">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Support</h4>
                      <p className="text-sm text-gray-600">lawyer-support@hakichain.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Technical Support</h4>
                      <p className="text-sm text-gray-600">24/7 platform assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Peer Network</h4>
                      <p className="text-sm text-gray-600">Connect with other lawyers</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={1.0}>
            <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl mb-6 text-secondary-100">
                Join HakiChain and start providing legal assistance to those who need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Register as Lawyer</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/bounties" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Browse Available Cases
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';
import { 
  Link, 
  Clock, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Users,
  FileText,
  Lock,
  BarChart3,
  TrendingUp,
  Calendar,
  MessageSquare,
  Award,
  Settings,
  Eye,
  Zap,
  Star,
  ArrowRight,
  Percent
} from 'lucide-react';

const MilestoneSystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Clock}
        title="Milestone System"
        subtitle="Payment & Progress Management"
        description="Learn how HakiChain's milestone system ensures transparent payments, accountability, and progress tracking for legal cases."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <SectionHeader
            title="What is the Milestone System?"
            subtitle="Understanding milestone-based payments"
            icon={Clock}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <InfoCard
              title="Definition"
              description="The milestone system breaks down legal cases into predefined stages, with payments released upon completion and verification of each milestone."
              icon={FileText}
              variant="primary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Transparent payment structure
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Progress accountability
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Risk mitigation
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Benefits"
              description="Milestones ensure both clients and lawyers are protected, with clear expectations and automatic payment releases upon completion."
              icon={TrendingUp}
              variant="secondary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Reduced payment disputes
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Clear progress tracking
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automated escrow management
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.1}>
          <SectionHeader
            title="Standard Milestone Structure"
            subtitle="Typical payment breakdown for legal cases"
            icon={BarChart3}
          />

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              title="Initial Retainer"
              description="Payment released upon lawyer selection and case acceptance."
              icon={Award}
              variant="primary"
            >
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-primary-600">20%</div>
                <div className="text-sm text-gray-600 mt-1">of total bounty</div>
                <div className="text-xs text-gray-500 mt-2">
                  Automatic release upon lawyer selection
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Case Preparation"
              description="Payment for initial filing, research, and case preparation."
              icon={FileText}
              variant="secondary"
            >
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-secondary-600">30%</div>
                <div className="text-sm text-gray-600 mt-1">of total bounty</div>
                <div className="text-xs text-gray-500 mt-2">
                  Released after initial filing
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Trial/Resolution"
              description="Payment for active litigation, negotiations, or case resolution."
              icon={Users}
              variant="accent"
            >
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-accent-600">40%</div>
                <div className="text-sm text-gray-600 mt-1">of total bounty</div>
                <div className="text-xs text-gray-500 mt-2">
                  Released upon case completion
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Success Bonus"
              description="Additional payment for favorable outcomes and successful resolution."
              icon={Star}
              variant="success"
            >
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-green-600">10%</div>
                <div className="text-sm text-gray-600 mt-1">of total bounty</div>
                <div className="text-xs text-gray-500 mt-2">
                  Released for favorable outcomes
                </div>
              </div>
            </InfoCard>
          </div>

          <AlertBox
            type="info"
            title="Customizable Milestones"
          >
            While this is the standard structure, milestones can be customized based on case complexity, timeline, and specific requirements.
          </AlertBox>
        </ContentSection>

        <ContentSection delay={0.2}>
          <SectionHeader
            title="Milestone Lifecycle"
            subtitle="How milestones progress from creation to completion"
            icon={ArrowRight}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Milestone Creation</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Define Milestones</h4>
                      <p className="text-sm text-gray-600">Create specific, measurable milestones with clear deliverables and timelines.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Set Payment Amounts</h4>
                      <p className="text-sm text-gray-600">Assign payment percentages to each milestone based on work complexity.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Establish Criteria</h4>
                      <p className="text-sm text-gray-600">Define clear completion criteria and verification requirements.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Milestone Execution</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary-100 text-secondary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Work Completion</h4>
                      <p className="text-sm text-gray-600">Lawyer completes the work defined in the milestone.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary-100 text-secondary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Submission</h4>
                      <p className="text-sm text-gray-600">Submit deliverables and request milestone completion.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary-100 text-secondary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Verification</h4>
                      <p className="text-sm text-gray-600">Client and platform verify completion criteria.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.3}>
          <SectionHeader
            title="Escrow Protection"
            subtitle="How funds are secured and released"
            icon={Lock}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Smart Contract Escrow"
              description="All bounty funds are automatically locked in smart contract escrow until milestones are verified and approved."
              icon={Shield}
              variant="primary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automatic fund locking
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Immutable payment terms
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Transparent fund tracking
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No third-party custody
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Payment Release Process"
              description="Multi-party verification ensures fair and secure payment releases."
              icon={DollarSign}
              variant="secondary"
            >
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">1. Lawyer Submission</div>
                  <div className="text-sm text-gray-600">Submit deliverables and completion evidence</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">2. Client Review</div>
                  <div className="text-sm text-gray-600">Client reviews and approves completion</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">3. Platform Verification</div>
                  <div className="text-sm text-gray-600">Platform validates against criteria</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">4. Automatic Release</div>
                  <div className="text-sm text-gray-600">Funds automatically released to lawyer</div>
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.4}>
          <SectionHeader
            title="Milestone Verification"
            subtitle="How completion is verified and approved"
            icon={CheckCircle}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard
                title="Client Verification"
                description="Primary verification by the client who requested the legal services."
                icon={Users}
                variant="primary"
              >
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Review deliverables
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Confirm completion
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Provide feedback
                  </div>
                </div>
              </InfoCard>

              <InfoCard
                title="Platform Verification"
                description="Automated and manual verification by HakiChain platform."
                icon={Shield}
                variant="secondary"
              >
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Criteria validation
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Quality assessment
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Compliance check
                  </div>
                </div>
              </InfoCard>

              <InfoCard
                title="Community Oversight"
                description="Optional community review for high-value or complex cases."
                icon={Eye}
                variant="accent"
              >
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Expert review
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Peer validation
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Quality assurance
                  </div>
                </div>
              </InfoCard>
            </div>

            <AlertBox
              type="warning"
              title="Verification Timeline"
            >
              Verification typically takes 24-48 hours. Complex cases may require additional review time.
            </AlertBox>
          </div>
        </ContentSection>

        <ContentSection delay={0.5}>
          <SectionHeader
            title="Dispute Resolution"
            subtitle="Handling milestone disputes and conflicts"
            icon={AlertTriangle}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Common Dispute Types</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Completion Disputes</h4>
                    <p className="text-sm text-gray-600 mb-2">Disagreements about whether milestone criteria have been met.</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Quality of deliverables</li>
                      <li>• Scope of work completed</li>
                      <li>• Timeline adherence</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Disputes</h4>
                    <p className="text-sm text-gray-600 mb-2">Conflicts over payment amounts or release timing.</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Payment calculation errors</li>
                      <li>• Release delays</li>
                      <li>• Fee structure disagreements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Resolution Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-warning-100 text-warning-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Initial Mediation</h4>
                      <p className="text-sm text-gray-600">Platform facilitates direct communication between parties.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-warning-100 text-warning-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Expert Review</h4>
                      <p className="text-sm text-gray-600">Independent legal experts review the dispute.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-warning-100 text-warning-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Arbitration</h4>
                      <p className="text-sm text-gray-600">Binding arbitration if mediation fails.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-warning-100 text-warning-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Smart Contract Execution</h4>
                      <p className="text-sm text-gray-600">Automatic execution of arbitration decision.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.6}>
          <SectionHeader
            title="Milestone Tracking"
            subtitle="Monitor progress and manage timelines"
            icon={Eye}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="Progress Dashboard"
              description="Real-time tracking of milestone completion and payment status."
              icon={BarChart3}
              variant="primary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Visual progress indicators
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Timeline tracking
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Payment status updates
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Notification System"
              description="Automated alerts for milestone updates and payment releases."
              icon={MessageSquare}
              variant="secondary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Milestone completion alerts
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Payment release notifications
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Deadline reminders
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Reporting & Analytics"
              description="Comprehensive reporting on milestone performance and trends."
              icon={TrendingUp}
              variant="accent"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance metrics
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Timeline analysis
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Success rate tracking
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.7}>
          <SectionHeader
            title="Best Practices"
            subtitle="Tips for effective milestone management"
            icon={Settings}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For Lawyers</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Milestone Planning</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Set realistic timelines</li>
                    <li>• Define clear deliverables</li>
                    <li>• Include buffer time</li>
                    <li>• Communicate progress regularly</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Maintain detailed records</li>
                    <li>• Submit quality deliverables</li>
                    <li>• Provide completion evidence</li>
                    <li>• Keep communication logs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">For Clients</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Milestone Review</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Review deliverables promptly</li>
                    <li>• Provide clear feedback</li>
                    <li>• Approve completion fairly</li>
                    <li>• Communicate concerns early</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Expectation Management</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Understand milestone criteria</li>
                    <li>• Set realistic expectations</li>
                    <li>• Be available for verification</li>
                    <li>• Maintain open communication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <AlertBox
            type="success"
            title="Pro Tips"
          >
            Regular communication and clear documentation are key to successful milestone management. Always keep detailed records of all interactions and deliverables.
          </AlertBox>
        </ContentSection>

        <ContentSection delay={0.8}>
          <SectionHeader
            title="Advanced Features"
            subtitle="Advanced milestone management capabilities"
            icon={Zap}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Conditional Milestones"
              description="Milestones that depend on external factors or conditional outcomes."
              icon={Settings}
              variant="primary"
            >
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Court Date Dependencies</div>
                  <div className="text-sm text-gray-600">Milestones tied to court schedules</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Outcome-Based Payments</div>
                  <div className="text-sm text-gray-600">Payments linked to case results</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Multi-Party Approvals</div>
                  <div className="text-sm text-gray-600">Complex approval workflows</div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Automated Milestones"
              description="Smart contract automation for routine milestone processes."
              icon={Zap}
              variant="secondary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automatic payment releases
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Time-based triggers
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Event-driven milestones
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Smart notifications
                </div>
              </div>
            </InfoCard>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Additional Resources</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-blue-900">Related Documentation:</strong>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• <Link to="/docs/bounties" className="underline">Legal Bounties Guide</Link></li>
                  <li>• <Link to="/docs/matching" className="underline">Lawyer Matching Process</Link></li>
                  <li>• <Link to="/docs/smart-contracts" className="underline">Smart Contract Details</Link></li>
                </ul>
              </div>
              <div>
                <strong className="text-blue-900">Support:</strong>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• <Link to="/faq" className="underline">Frequently Asked Questions</Link></li>
                  <li>• <Link to="/contact" className="underline">Contact Support</Link></li>
                  <li>• <Link to="/docs/api" className="underline">API Documentation</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default MilestoneSystem; 
import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';
import { 
  Link, 
  Target, 
  DollarSign, 
  Users, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  Lock,
  Eye
} from 'lucide-react';

const LegalBounties: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Target}
        title="Legal Bounties"
        subtitle="Complete Guide"
        description="Learn how to create, fund, and manage legal bounties on HakiChain. From case submission to resolution, understand the entire bounty lifecycle."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <SectionHeader
            title="What are Legal Bounties?"
            subtitle="Understanding the bounty system"
            icon={Target}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <InfoCard
              title="Definition"
              description="Legal bounties are crowdfunded legal cases where donors contribute funds to support specific legal actions, and lawyers compete to take on these cases."
              icon={FileText}
              variant="primary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Transparent funding mechanism
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Competitive lawyer selection
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Milestone-based payments
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Benefits"
              description="Legal bounties democratize access to justice by making legal representation accessible to those who might not afford traditional legal services."
              icon={TrendingUp}
              variant="secondary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Access to quality legal representation
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Transparent cost structure
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Community-driven justice
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.1}>
          <SectionHeader
            title="Bounty Lifecycle"
            subtitle="From creation to resolution"
            icon={Clock}
          />

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              title="1. Creation"
              description="NGO or individual creates a bounty with case details and funding goal."
              icon={FileText}
              variant="primary"
            >
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline: 1-2 days
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Role: NGO/Individual
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="2. Funding"
              description="Donors contribute funds to reach the bounty goal."
              icon={DollarSign}
              variant="secondary"
            >
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline: 7-30 days
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Role: Donors
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="3. Selection"
              description="Lawyers apply and the best candidate is selected."
              icon={Users}
              variant="accent"
            >
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline: 3-7 days
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Role: Lawyers
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="4. Resolution"
              description="Case proceeds with milestone-based payments and updates."
              icon={CheckCircle}
              variant="success"
            >
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline: Variable
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Role: Lawyer + Client
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.2}>
          <SectionHeader
            title="Creating a Bounty"
            subtitle="Step-by-step guide for NGOs and individuals"
            icon={FileText}
          />

          <AlertBox
            type="info"
            title="Prerequisites"
          >
            Before creating a bounty, ensure you have completed KYC verification and have a verified wallet connected to your account.
          </AlertBox>

          <div className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Required Information</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Case Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Case title and description</li>
                      <li>• Legal jurisdiction</li>
                      <li>• Case type and complexity</li>
                      <li>• Timeline requirements</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Financial Information</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Funding goal amount</li>
                      <li>• Milestone breakdown</li>
                      <li>• Payment schedule</li>
                      <li>• Escrow terms</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Bounty Creation Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Fill Case Information</h4>
                      <p className="text-sm text-gray-600">Provide detailed case description, legal requirements, and timeline.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Set Funding Goal</h4>
                      <p className="text-sm text-gray-600">Determine total amount needed and break down into milestones.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Review & Submit</h4>
                      <p className="text-sm text-gray-600">Review all information and submit for platform approval.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Go Live</h4>
                      <p className="text-sm text-gray-600">Once approved, your bounty goes live for funding and lawyer applications.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.3}>
          <SectionHeader
            title="Funding Mechanisms"
            subtitle="How bounties get funded"
            icon={DollarSign}
          />

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <InfoCard
              title="Individual Donations"
              description="Direct contributions from individuals who support the cause."
              icon={Users}
              variant="primary"
            >
              <div className="mt-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No minimum contribution
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Anonymous options available
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Tax-deductible receipts
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="NGO Funding"
              description="Organizational contributions from NGOs and foundations."
              icon={Shield}
              variant="secondary"
            >
              <div className="mt-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Larger contribution amounts
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Strategic partnerships
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Impact reporting
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Corporate Sponsorship"
              description="Business contributions for CSR and legal advocacy."
              icon={TrendingUp}
              variant="accent"
            >
              <div className="mt-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Brand visibility
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    CSR benefits
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Legal expertise access
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          <AlertBox
            type="success"
            title="Funding Success"
          >
            Once a bounty reaches its funding goal, it automatically moves to the lawyer selection phase. If funding fails, all contributions are returned to donors.
          </AlertBox>
        </ContentSection>

        <ContentSection delay={0.4}>
          <SectionHeader
            title="Lawyer Selection Process"
            subtitle="How lawyers are chosen for bounties"
            icon={Users}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Application Requirements</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Credentials</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Valid law license</li>
                      <li>• Practice area expertise</li>
                      <li>• Years of experience</li>
                      <li>• Professional references</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Completed KYC verification</li>
                      <li>• Reputation score</li>
                      <li>• Previous case success rate</li>
                      <li>• Client feedback ratings</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Selection Criteria</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold">Reputation Score</h4>
                      <p className="text-sm text-gray-600">Based on past performance and client feedback</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Jurisdiction Experience</h4>
                      <p className="text-sm text-gray-600">Familiarity with relevant legal systems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Award className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Case Success Rate</h4>
                      <p className="text-sm text-gray-600">Track record of successful outcomes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-semibold">Communication Skills</h4>
                      <p className="text-sm text-gray-600">Ability to keep clients informed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.5}>
          <SectionHeader
            title="Milestone System"
            subtitle="How payments are structured and released"
            icon={Clock}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Milestone Structure"
              description="Payments are released based on predefined milestones to ensure accountability and progress tracking."
              icon={BarChart3}
              variant="primary"
            >
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Initial Retainer (20%)</div>
                  <div className="text-sm text-gray-600">Released upon lawyer selection</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Case Preparation (30%)</div>
                  <div className="text-sm text-gray-600">Released after initial filing</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Trial/Resolution (40%)</div>
                  <div className="text-sm text-gray-600">Released upon case completion</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">Success Bonus (10%)</div>
                  <div className="text-sm text-gray-600">Released for favorable outcomes</div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Escrow Protection"
              description="All funds are held in smart contract escrow until milestones are verified and approved."
              icon={Lock}
              variant="secondary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automatic fund locking
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-party approval
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Dispute resolution
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Refund protection
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.6}>
          <SectionHeader
            title="Best Practices"
            subtitle="Tips for successful bounty management"
            icon={Settings}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For NGOs & Individuals</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Bounty Creation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Provide detailed case information</li>
                    <li>• Set realistic funding goals</li>
                    <li>• Include clear milestones</li>
                    <li>• Respond promptly to inquiries</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep donors updated regularly</li>
                    <li>• Share progress reports</li>
                    <li>• Maintain transparency</li>
                    <li>• Express gratitude to supporters</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">For Lawyers</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Application Strategy</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Highlight relevant experience</li>
                    <li>• Provide detailed proposals</li>
                    <li>• Demonstrate understanding</li>
                    <li>• Show commitment to cause</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Case Management</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Regular progress updates</li>
                    <li>• Clear communication</li>
                    <li>• Document all activities</li>
                    <li>• Meet milestone deadlines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.7}>
          <SectionHeader
            title="Monitoring & Analytics"
            subtitle="Track your bounty performance"
            icon={Eye}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="Funding Analytics"
              description="Track donation patterns, donor demographics, and funding progress."
              icon={BarChart3}
              variant="primary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time funding status
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Donor insights
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Campaign performance
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Case Progress"
              description="Monitor case milestones, lawyer performance, and timeline adherence."
              icon={Clock}
              variant="secondary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Milestone tracking
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Timeline monitoring
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance metrics
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Impact Measurement"
              description="Measure the social and legal impact of your bounty cases."
              icon={TrendingUp}
              variant="accent"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Outcome tracking
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Social impact metrics
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Success stories
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
                  <li>• <Link to="/docs/milestones" className="underline">Milestone System Guide</Link></li>
                  <li>• <Link to="/docs/matching" className="underline">Lawyer Matching Process</Link></li>
                  <li>• <Link to="/docs/ngo-guide" className="underline">NGO User Guide</Link></li>
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

export default LegalBounties; 
import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';
import { 
  Link, 
  Users, 
  Target, 
  Star, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Award,
  MapPin,
  MessageSquare,
  BarChart3,
  Settings,
  Eye,
  Zap,
  Search,
  UserCheck,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Bell
} from 'lucide-react';

const LawyerMatching: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Users}
        title="Lawyer Matching"
        subtitle="AI-Powered Legal Professional Matching"
        description="Learn how HakiChain's intelligent matching system connects the right lawyers with the right cases, ensuring optimal outcomes for all parties."
        gradient="primary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContentSection>
          <SectionHeader
            title="How Lawyer Matching Works"
            subtitle="Understanding our intelligent matching system"
            icon={Target}
          />
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <InfoCard
              title="AI-Powered Algorithm"
              description="Our advanced matching algorithm analyzes multiple factors to find the perfect lawyer-case fit."
              icon={Zap}
              variant="primary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Practice area expertise
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Geographic compatibility
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Experience level matching
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Availability and workload
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Multi-Factor Analysis"
              description="Comprehensive evaluation of lawyer qualifications, case requirements, and client preferences."
              icon={BarChart3}
              variant="secondary"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Reputation and reviews
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Success rate analysis
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Communication style
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Fee structure compatibility
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.1}>
          <SectionHeader
            title="Lawyer Profile Components"
            subtitle="What makes up a comprehensive lawyer profile"
            icon={UserCheck}
          />

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <InfoCard
              title="Professional Credentials"
              description="Core qualifications and legal expertise information."
              icon={GraduationCap}
              variant="primary"
            >
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Law degree and bar admission
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Practice areas and specializations
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Years of experience
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Professional certifications
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Performance Metrics"
              description="Track record and success indicators."
              icon={TrendingUp}
              variant="secondary"
            >
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Case success rate
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Client satisfaction scores
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Average case duration
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Settlement vs. trial ratio
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Personal Information"
              description="Background, communication style, and availability."
              icon={Users}
              variant="accent"
            >
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Languages spoken
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Communication preferences
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Availability and response time
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Personal statement and approach
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.2}>
          <SectionHeader
            title="Matching Algorithm Factors"
            subtitle="Key criteria used in the matching process"
            icon={Search}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Primary Factors (Weight: 60%)</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    <div>
                      <h4 className="font-semibold">Practice Area Match</h4>
                      <p className="text-sm text-gray-600">Exact or closely related practice areas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <MapPin className="w-5 h-5 text-secondary-500" />
                    <div>
                      <h4 className="font-semibold">Geographic Compatibility</h4>
                      <p className="text-sm text-gray-600">Jurisdiction and location requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Star className="w-5 h-5 text-accent-500" />
                    <div>
                      <h4 className="font-semibold">Experience Level</h4>
                      <p className="text-sm text-gray-600">Years of practice and case complexity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Secondary Factors (Weight: 40%)</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Award className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Reputation Score</h4>
                      <p className="text-sm text-gray-600">Client reviews and platform ratings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Availability</h4>
                      <p className="text-sm text-gray-600">Current workload and response time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold">Fee Compatibility</h4>
                      <p className="text-sm text-gray-600">Rate structure and budget alignment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AlertBox
              type="info"
              title="Algorithm Transparency"
            >
              Our matching algorithm is transparent and explainable. Lawyers and clients can see why specific matches were made and request adjustments if needed.
            </AlertBox>
          </div>
        </ContentSection>

        <ContentSection delay={0.3}>
          <SectionHeader
            title="Application Process"
            subtitle="How lawyers apply for cases"
            icon={FileText}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Lawyers</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Case Discovery</h4>
                      <p className="text-sm text-gray-600">Browse available cases that match your expertise and interests.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Application Submission</h4>
                      <p className="text-sm text-gray-600">Submit a detailed application including your approach and qualifications.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Client Review</h4>
                      <p className="text-sm text-gray-600">Client reviews applications and may request additional information.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Selection & Onboarding</h4>
                      <p className="text-sm text-gray-600">If selected, complete onboarding and begin case work.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Application Requirements</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Information</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Updated resume and credentials</li>
                      <li>• Practice area certifications</li>
                      <li>• Recent case examples</li>
                      <li>• Professional references</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Case-Specific Proposal</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Approach to the case</li>
                      <li>• Timeline and milestones</li>
                      <li>• Fee structure breakdown</li>
                      <li>• Communication plan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.4}>
          <SectionHeader
            title="Selection Process"
            subtitle="How clients choose the right lawyer"
            icon={Target}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Client Review Process"
              description="Comprehensive evaluation of lawyer applications by clients."
              icon={Eye}
              variant="primary"
            >
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">1. Initial Screening</div>
                  <div className="text-sm text-gray-600">Review basic qualifications and experience</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">2. Proposal Evaluation</div>
                  <div className="text-sm text-gray-600">Assess approach, timeline, and fees</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">3. Reference Check</div>
                  <div className="text-sm text-gray-600">Contact professional references</div>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <div className="font-semibold">4. Final Decision</div>
                  <div className="text-sm text-gray-600">Select best candidate for the case</div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Platform Recommendations"
              description="AI-powered suggestions to help clients make informed decisions."
              icon={Shield}
              variant="secondary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Match quality scores
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Success probability estimates
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Comparative analysis
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Risk assessment
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.5}>
          <SectionHeader
            title="Communication & Coordination"
            subtitle="Facilitating effective lawyer-client relationships"
            icon={MessageSquare}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="Initial Consultation"
              description="Structured first meeting to establish expectations and rapport."
              icon={Users}
              variant="primary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Case overview discussion
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Communication preferences
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Timeline and milestones
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Ongoing Communication"
              description="Regular updates and progress reports throughout the case."
              icon={MessageSquare}
              variant="secondary"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Weekly progress updates
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Milestone notifications
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Document sharing
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Dispute Resolution"
              description="Platform support for resolving communication issues."
              icon={AlertTriangle}
              variant="accent"
            >
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Mediation services
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Escalation procedures
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Alternative arrangements
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection delay={0.6}>
          <SectionHeader
            title="Quality Assurance"
            subtitle="Ensuring high-quality legal services"
            icon={Shield}
          />

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Verification Processes</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Credential Verification</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bar admission verification</li>
                      <li>• License status checks</li>
                      <li>• Disciplinary history review</li>
                      <li>• Continuing education verification</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Monitoring</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Case outcome tracking</li>
                      <li>• Client satisfaction surveys</li>
                      <li>• Communication quality assessment</li>
                      <li>• Professional conduct evaluation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Continuous Improvement</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Feedback Integration</h4>
                      <p className="text-sm text-gray-600">Regular collection and analysis of client and lawyer feedback</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Algorithm Refinement</h4>
                      <p className="text-sm text-gray-600">Continuous improvement of matching algorithms based on outcomes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold">Recognition Programs</h4>
                      <p className="text-sm text-gray-600">Incentives for high-performing lawyers and successful cases</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection delay={0.7}>
          <SectionHeader
            title="Best Practices"
            subtitle="Tips for successful lawyer matching"
            icon={Settings}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For Lawyers</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Profile Optimization</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep profile information current</li>
                    <li>• Highlight unique qualifications</li>
                    <li>• Include relevant case examples</li>
                    <li>• Maintain high response rates</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Application Strategy</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tailor proposals to specific cases</li>
                    <li>• Demonstrate understanding of issues</li>
                    <li>• Provide clear timelines and fees</li>
                    <li>• Show commitment to client success</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">For Clients</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Case Preparation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Provide detailed case information</li>
                    <li>• Set clear expectations and goals</li>
                    <li>• Define timeline requirements</li>
                    <li>• Establish budget constraints</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Selection Process</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Review all applications thoroughly</li>
                    <li>• Ask clarifying questions</li>
                    <li>• Check references when possible</li>
                    <li>• Trust platform recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <AlertBox
            type="success"
            title="Success Tips"
          >
            The best matches happen when both lawyers and clients are transparent about their needs, capabilities, and expectations. Clear communication from the start leads to successful outcomes.
          </AlertBox>
        </ContentSection>

        <ContentSection delay={0.8}>
          <SectionHeader
            title="Advanced Features"
            subtitle="Advanced matching capabilities and tools"
            icon={Zap}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              title="Smart Notifications"
              description="Intelligent alerts for relevant cases and opportunities."
              icon={Bell}
              variant="primary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Case matching alerts
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Application deadline reminders
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Client response notifications
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Market opportunity alerts
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Analytics Dashboard"
              description="Comprehensive insights into matching performance and trends."
              icon={BarChart3}
              variant="secondary"
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Application success rates
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Case completion metrics
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Client satisfaction trends
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Market demand analysis
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
                  <li>• <Link to="/docs/milestones" className="underline">Milestone System Guide</Link></li>
                  <li>• <Link to="/docs/lawyer-guide" className="underline">Lawyer User Guide</Link></li>
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

export default LawyerMatching; 
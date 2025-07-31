import { motion } from 'framer-motion';
import { Heart, Users, Scale, ArrowRight, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ContentSection, SectionHeader, InfoCard, AlertBox } from '../../components/common/ContentSection';

export const DonorGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={Heart}
        title="Donor Guide"
        subtitle="Making a Difference Through Legal Bounties"
        description="Learn how you can contribute to legal justice by funding bounties that connect vulnerable individuals with qualified legal professionals."
        gradient="secondary"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Who Can Be a Donor */}
          <ContentSection>
            <SectionHeader
              title="Who Can Be a Donor?"
              subtitle="Understanding eligibility and requirements for contributing to legal justice"
              icon={<Users className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Eligibility Requirements">
                <p className="mb-4">
                  Anyone can become a donor on HakiChain, regardless of their background or location. 
                  We welcome contributions from individuals, organizations, and institutions committed to legal justice.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Individuals:</strong> Anyone with a digital wallet and desire to help</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Organizations:</strong> NGOs, foundations, and corporate entities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Institutions:</strong> Legal firms, universities, and government bodies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>International:</strong> Global donors welcome from any country</span>
                  </li>
                </ul>
              </InfoCard>
              <InfoCard title="What You Need to Get Started" variant="highlight">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-100 rounded-lg">
                    <h4 className="font-semibold text-primary-900 mb-2">Digital Wallet</h4>
                    <p className="text-primary-800 text-sm">MetaMask, TrustWallet, or similar wallet</p>
                  </div>
                  <div className="p-4 bg-secondary-100 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">Verification</h4>
                    <p className="text-secondary-800 text-sm">Basic KYC process for transparency</p>
                  </div>
                  <div className="p-4 bg-accent-100 rounded-lg">
                    <h4 className="font-semibold text-accent-900 mb-2">Funding</h4>
                    <p className="text-accent-800 text-sm">Traditional currency or cryptocurrency</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* How the Bounty System Works */}
          <ContentSection delay={0.1}>
            <SectionHeader
              title="How the Bounty System Works"
              subtitle="Understanding the complete lifecycle of legal bounties"
              icon={<Scale className="w-8 h-8" />}
            />
            
            <div className="space-y-8">
              <InfoCard title="Bounty Creation Process">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary-600">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Case Submission</h4>
                    <p className="text-sm text-gray-600">NGOs submit legal cases requiring assistance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-secondary-600">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Review & Approval</h4>
                    <p className="text-sm text-gray-600">Platform reviews and approves legitimate cases</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent-600">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bounty Creation</h4>
                    <p className="text-sm text-gray-600">Legal bounty is created with funding target</p>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Bounty Assignment Process" variant="info">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary-600">4</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lawyer Matching</h4>
                    <p className="text-sm text-gray-600">Qualified lawyers are matched to cases</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-secondary-600">5</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Case Assignment</h4>
                    <p className="text-sm text-gray-600">Selected lawyer takes on the case</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent-600">6</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Milestone Tracking</h4>
                    <p className="text-sm text-gray-600">Progress tracked through milestones</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* How Clients Receive Legal Assistance */}
          <ContentSection delay={0.2}>
            <SectionHeader
              title="How Clients Receive Legal Assistance"
              subtitle="The journey from legal need to resolution"
            />
            
            <AlertBox
              title="Client-Centric Approach"
              type="success"
              icon={<CheckCircle className="w-6 h-6" />}
            >
              <p>
                Every step of the process is designed to prioritize the client's needs and ensure they receive 
                the highest quality legal representation possible.
              </p>
            </AlertBox>

            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Client Journey">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-primary-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Initial Contact</h4>
                      <p className="text-sm text-gray-600">Client reaches out to NGO with legal need</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-secondary-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Case Assessment</h4>
                      <p className="text-sm text-gray-600">NGO evaluates and documents the case</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-accent-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Bounty Creation</h4>
                      <p className="text-sm text-gray-600">Legal bounty is created and funded</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-success-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Representation</h4>
                      <p className="text-sm text-gray-600">Assigned lawyer provides legal services</p>
                    </div>
                  </div>
                </div>
              </InfoCard>
              <InfoCard title="Quality Assurance" variant="highlight">
                <div className="space-y-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h4 className="font-semibold text-primary-900">Vetted Lawyers</h4>
                    <p className="text-primary-800 text-sm">All lawyers undergo thorough verification</p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900">Case Monitoring</h4>
                    <p className="text-secondary-800 text-sm">Regular updates and progress tracking</p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <h4 className="font-semibold text-accent-900">Client Feedback</h4>
                    <p className="text-accent-800 text-sm">Continuous feedback and improvement</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* How to Make Donations */}
          <ContentSection delay={0.3}>
            <SectionHeader
              title="How to Make Donations"
              subtitle="Simple steps to start making a difference"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Donation Process">
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-primary-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Create Account</h4>
                      <p className="text-sm text-gray-600">Register and complete KYC verification</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-secondary-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Connect Wallet</h4>
                      <p className="text-sm text-gray-600">Link your digital wallet to the platform</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-accent-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Browse Bounties</h4>
                      <p className="text-sm text-gray-600">Explore available legal cases</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-sm font-semibold text-success-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Make Donation</h4>
                      <p className="text-sm text-gray-600">Contribute to cases that resonate with you</p>
                    </div>
                  </li>
                </ol>
              </InfoCard>
              <InfoCard title="Donation Options" variant="info">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Traditional Currency</h4>
                    <p className="text-sm text-gray-600 mb-2">USD, EUR, KES, and other major currencies</p>
                    <p className="text-xs text-gray-500">Converted to HAKI tokens automatically</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Cryptocurrency</h4>
                    <p className="text-sm text-gray-600 mb-2">Bitcoin, Ethereum, and other major cryptos</p>
                    <p className="text-xs text-gray-500">Direct conversion to HAKI tokens</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">HAKI Tokens</h4>
                    <p className="text-sm text-gray-600 mb-2">Direct donation using platform tokens</p>
                    <p className="text-xs text-gray-500">No conversion fees</p>
                  </div>
                </div>
              </InfoCard>
            </div>

            <AlertBox
              title="Donation Flexibility"
              type="info"
              icon={<AlertTriangle className="w-6 h-6" />}
            >
              <p>
                <strong>Flexible Contributions:</strong> You can donate any amount, from small contributions to large sums. 
                Every donation makes a difference, and you can choose to remain anonymous or be recognized for your contribution.
              </p>
            </AlertBox>
          </ContentSection>

          {/* Transparency and Impact Tracking */}
          <ContentSection delay={0.4}>
            <SectionHeader
              title="Transparency and Impact Tracking"
              subtitle="See exactly how your donations make a difference"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <InfoCard title="Real-Time Tracking">
                <p className="mb-4">
                  Every donation and its impact is tracked transparently on the blockchain, ensuring complete visibility 
                  of how funds are used and their outcomes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Donation Tracking:</strong> See exactly where your money goes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Case Progress:</strong> Monitor legal case developments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Outcome Reports:</strong> Detailed results and impact metrics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Audit Trail:</strong> Complete transaction history</span>
                  </li>
                </ul>
              </InfoCard>
              <InfoCard title="Impact Metrics" variant="highlight">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-primary-600 mb-1">100%</h4>
                    <p className="text-primary-800 text-sm">Transparency</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-secondary-600 mb-1">Real-time</h4>
                    <p className="text-secondary-800 text-sm">Updates</p>
                  </div>
                  <div className="text-center p-4 bg-accent-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-accent-600 mb-1">Verified</h4>
                    <p className="text-accent-800 text-sm">Outcomes</p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </ContentSection>

          {/* Call to Action */}
          <ContentSection delay={0.5}>
            <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl mb-6 text-secondary-100">
                Join thousands of donors who are already making legal justice accessible to those who need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="btn btn-accent text-base px-6 py-3 flex items-center"
                >
                  <span>Start Donating</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/bounties" 
                  className="btn btn-outline text-base px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Browse Cases
                </Link>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  );
}; 
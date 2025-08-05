import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, FileText, User, Award, Building, Phone, Mail, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

interface Case {
  id: string;
  status: 'applied' | 'in_review' | 'accepted' | 'rejected';
  application_date: string;
  bounty: {
    id: string;
    title: string;
    category: string;
    location: string;
    due_date: string;
    total_amount: number;
    description: string;
    required_skills: string[];
    ngo_name: string;
    status: string;
    detailed_description?: string;
    requirements?: string[];
    deliverables?: string[];
    timeline?: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    ngo_website?: string;
    urgency_level?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export const LawyerCaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCaseDetails = async () => {
      try {
        // Mock detailed data for demonstration
        const mockCaseDetails: Record<string, Case> = {
          '1': {
            id: '1',
            status: 'applied',
            application_date: '2025-01-15T00:00:00.000Z',
            bounty: {
              id: 'b1',
              title: 'Domestic Violence Protection Case',
              category: 'Family Law',
              location: 'Nairobi, Kenya',
              due_date: '2025-03-15T00:00:00.000Z',
              total_amount: 2500,
              description: 'Seeking legal representation for a domestic violence case involving protective orders and child custody arrangements.',
              detailed_description: 'This case involves representing a client who has experienced domestic violence and needs immediate legal protection. The case requires filing for protective orders, navigating child custody arrangements, and providing comprehensive legal support throughout the judicial process. The client is a single mother with two children who needs urgent legal assistance to ensure their safety and secure their rights.',
              required_skills: ['Family Law', 'Domestic Violence', 'Child Custody', 'Court Representation'],
              requirements: [
                'Licensed attorney with family law experience',
                'Minimum 3 years of domestic violence case experience',
                'Available for immediate consultation and court appearances',
                'Fluent in English and Swahili',
                'Experience with protective order procedures'
              ],
              deliverables: [
                'Initial legal consultation and case assessment',
                'Filing of protective order application',
                'Court representation for all hearings',
                'Child custody arrangement documentation',
                'Ongoing legal support and counsel',
                'Final case report and documentation'
              ],
              timeline: '3-4 months with immediate start required',
              ngo_name: 'Women\'s Rights Foundation',
              contact_person: 'Sarah Kimani',
              contact_email: 'sarah@womensrights.ke',
              contact_phone: '+254 700 123 456',
              ngo_website: 'www.womensrights.ke',
              urgency_level: 'critical',
              status: 'open'
            }
          },
          '2': {
            id: '2',
            status: 'in_review',
            application_date: '2025-01-10T00:00:00.000Z',
            bounty: {
              id: 'b2',
              title: 'Land Rights Dispute Resolution',
              category: 'Property Law',
              location: 'Kisumu, Kenya',
              due_date: '2025-04-20T00:00:00.000Z',
              total_amount: 3200,
              description: 'Community land rights dispute involving multiple families and a development company.',
              detailed_description: 'A complex land rights dispute has emerged between a local community of 50+ families and a development company claiming ownership of ancestral land. The case requires expertise in property law, community land rights, and environmental impact assessment. The community has been living on this land for generations, but lacks formal documentation. The developer claims to have acquired the land through proper channels, but the community disputes this claim.',
              required_skills: ['Property Law', 'Land Rights', 'Mediation', 'Community Law'],
              requirements: [
                'Expertise in Kenyan land law and community rights',
                'Experience with multi-party disputes',
                'Strong mediation and negotiation skills',
                'Understanding of environmental law',
                'Ability to work with rural communities'
              ],
              deliverables: [
                'Comprehensive legal analysis of land ownership claims',
                'Mediation sessions between parties',
                'Legal documentation and filing',
                'Community consultation and representation',
                'Environmental impact assessment review',
                'Settlement agreement or court representation'
              ],
              timeline: '6-8 months with flexible scheduling',
              ngo_name: 'Community Land Rights Initiative',
              contact_person: 'James Ochieng',
              contact_email: 'james@landrightskenya.org',
              contact_phone: '+254 721 456 789',
              ngo_website: 'www.landrightskenya.org',
              urgency_level: 'high',
              status: 'open'
            }
          },
          '3': {
            id: '3',
            status: 'accepted',
            application_date: '2025-01-08T00:00:00.000Z',
            bounty: {
              id: 'b3',
              title: 'Small Business Legal Support',
              category: 'Commercial Law',
              location: 'Mombasa, Kenya',
              due_date: '2025-02-28T00:00:00.000Z',
              total_amount: 1800,
              description: 'Legal support for small business owners dealing with contract disputes and regulatory compliance.',
              detailed_description: 'This project involves providing comprehensive legal support to 10-15 small business owners in Mombasa who are facing various legal challenges including contract disputes, regulatory compliance issues, and business formation guidance. The businesses range from retail shops to service providers, all needing affordable legal assistance to resolve ongoing issues and establish proper legal frameworks for their operations.',
              required_skills: ['Commercial Law', 'Contract Law', 'Business Compliance'],
              requirements: [
                'Commercial law expertise',
                'Experience with small business legal issues',
                'Knowledge of Kenyan business regulations',
                'Ability to provide practical, cost-effective solutions',
                'Good communication skills for client education'
              ],
              deliverables: [
                'Individual consultations for each business',
                'Contract review and revision',
                'Regulatory compliance guidance',
                'Business formation documentation',
                'Dispute resolution assistance',
                'Legal education workshops'
              ],
              timeline: '2 months with ongoing support',
              ngo_name: 'Entrepreneur Support Network',
              contact_person: 'Amina Hassan',
              contact_email: 'amina@entrepreneursupport.ke',
              contact_phone: '+254 712 345 678',
              ngo_website: 'www.entrepreneursupport.ke',
              urgency_level: 'medium',
              status: 'active'
            }
          },
          '4': {
            id: '4',
            status: 'rejected',
            application_date: '2025-01-05T00:00:00.000Z',
            bounty: {
              id: 'b4',
              title: 'Immigration Rights Defense',
              category: 'Immigration Law',
              location: 'Eldoret, Kenya',
              due_date: '2025-03-30T00:00:00.000Z',
              total_amount: 2800,
              description: 'Defense for immigrants facing deportation proceedings and assistance with asylum applications.',
              detailed_description: 'This case involves providing comprehensive legal defense for immigrants and refugees facing deportation proceedings, asylum applications, and other immigration-related legal challenges. The work requires deep understanding of immigration law, human rights principles, and cultural sensitivity when working with vulnerable populations.',
              required_skills: ['Immigration Law', 'Asylum Procedures', 'Human Rights'],
              requirements: [
                'Expertise in immigration and refugee law',
                'Experience with deportation defense',
                'Knowledge of international human rights law',
                'Cultural competency and language skills',
                'Experience with government agencies'
              ],
              deliverables: [
                'Legal representation in deportation proceedings',
                'Asylum application preparation and filing',
                'Documentation review and preparation',
                'Court appearances and advocacy',
                'Client counseling and support',
                'Appeals process if necessary'
              ],
              timeline: '4-6 months depending on case complexity',
              ngo_name: 'Immigration Justice Coalition',
              contact_person: 'David Mutua',
              contact_email: 'david@immigrationjustice.ke',
              contact_phone: '+254 733 987 654',
              ngo_website: 'www.immigrationjustice.ke',
              urgency_level: 'high',
              status: 'closed'
            }
          },
          '5': {
            id: '5',
            status: 'applied',
            application_date: '2025-01-12T00:00:00.000Z',
            bounty: {
              id: 'b5',
              title: 'Environmental Protection Case',
              category: 'Environmental Law',
              location: 'Nakuru, Kenya',
              due_date: '2025-05-15T00:00:00.000Z',
              total_amount: 3500,
              description: 'Legal action against industrial pollution affecting local communities and water sources.',
              detailed_description: 'This environmental protection case involves legal action against industrial facilities causing pollution that affects local communities and water sources. The case requires expertise in environmental law, public interest litigation, and community advocacy to protect environmental rights and public health.',
              required_skills: ['Environmental Law', 'Public Interest Law', 'Community Advocacy'],
              requirements: [
                'Environmental law expertise',
                'Experience with public interest litigation',
                'Knowledge of environmental regulations',
                'Community engagement skills',
                'Scientific evidence interpretation'
              ],
              deliverables: [
                'Environmental impact assessment review',
                'Legal action filing and documentation',
                'Community consultation and representation',
                'Court advocacy and litigation',
                'Settlement negotiations',
                'Compliance monitoring'
              ],
              timeline: '8-12 months for full resolution',
              ngo_name: 'Green Earth Initiative',
              contact_person: 'Grace Wanjiku',
              contact_email: 'grace@greenearth.ke',
              contact_phone: '+254 722 456 123',
              ngo_website: 'www.greenearth.ke',
              urgency_level: 'high',
              status: 'open'
            }
          },
          '6': {
            id: '6',
            status: 'in_review',
            application_date: '2025-01-18T00:00:00.000Z',
            bounty: {
              id: 'b6',
              title: 'Youth Legal Aid Program',
              category: 'Criminal Law',
              location: 'Thika, Kenya',
              due_date: '2025-04-10T00:00:00.000Z',
              total_amount: 2200,
              description: 'Providing legal representation for youth offenders and advocacy for juvenile justice reform.',
              detailed_description: 'This program focuses on providing legal representation for youth offenders while advocating for juvenile justice reform. The work involves defending young people in criminal proceedings, ensuring their rights are protected, and working towards systemic changes in the juvenile justice system.',
              required_skills: ['Criminal Law', 'Juvenile Justice', 'Social Work', 'Court Advocacy'],
              requirements: [
                'Criminal law expertise with youth focus',
                'Understanding of juvenile justice system',
                'Experience working with young people',
                'Social work background preferred',
                'Advocacy and reform experience'
              ],
              deliverables: [
                'Legal representation for youth clients',
                'Juvenile justice advocacy',
                'Court appearances and defense',
                'System reform recommendations',
                'Community education programs',
                'Policy advocacy and reform'
              ],
              timeline: '6 months with potential for extension',
              ngo_name: 'Youth Justice Initiative',
              contact_person: 'Michael Kiptoo',
              contact_email: 'michael@youthjustice.ke',
              contact_phone: '+254 711 234 567',
              ngo_website: 'www.youthjustice.ke',
              urgency_level: 'medium',
              status: 'open'
            }
          }
        };
        
        if (caseId && mockCaseDetails[caseId]) {
          setCaseData(mockCaseDetails[caseId]);
        }
      } catch (error) {
        console.error('Error loading case details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCaseDetails();
  }, [caseId, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-5 h-5" />;
      case 'in_review': return <AlertCircle className="w-5 h-5" />;
      case 'accepted': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <AlertCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <LawyerDashboardLayout>
        <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <LawyerDashboardLayout>
        <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Case not found</h3>
            <p className="text-gray-500 mb-4">The case you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/lawyer/cases"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Link>
          </div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/lawyer/cases"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {caseData.bounty.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  <span>{caseData.bounty.ngo_name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{caseData.bounty.location}</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {caseData.bounty.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {caseData.bounty.urgency_level && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUrgencyColor(caseData.bounty.urgency_level)}`}>
                  {caseData.bounty.urgency_level.charAt(0).toUpperCase() + caseData.bounty.urgency_level.slice(1)} Priority
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
                {getStatusIcon(caseData.status)}
                <span className="ml-2">
                  {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1).replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {caseData.bounty.description}
              </p>
              {caseData.bounty.detailed_description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Detailed Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {caseData.bounty.detailed_description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Requirements */}
            {caseData.bounty.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {caseData.bounty.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Deliverables */}
            {caseData.bounty.deliverables && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Expected Deliverables</h2>
                <ul className="space-y-2">
                  {caseData.bounty.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Skills Required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {caseData.bounty.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Compensation</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${caseData.bounty.total_amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due Date</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(caseData.bounty.due_date).toLocaleDateString()}
                  </span>
                </div>

                {caseData.bounty.timeline && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 mt-0.5" />
                      <span>Timeline</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {caseData.bounty.timeline}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Applied On</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(caseData.application_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {caseData.bounty.contact_person && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{caseData.bounty.contact_person}</span>
                  </div>
                )}
                
                {caseData.bounty.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <a 
                      href={`mailto:${caseData.bounty.contact_email}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {caseData.bounty.contact_email}
                    </a>
                  </div>
                )}

                {caseData.bounty.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <a 
                      href={`tel:${caseData.bounty.contact_phone}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {caseData.bounty.contact_phone}
                    </a>
                  </div>
                )}

                {caseData.bounty.ngo_website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a 
                      href={`https://${caseData.bounty.ngo_website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {caseData.bounty.ngo_website}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

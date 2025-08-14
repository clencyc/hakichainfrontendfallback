export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface DocumentType {
  id: string;
  category_id: string;
  name: string;
  description: string;
  template_prompt: string;
}

export const documentCategories: DocumentCategory[] = [
  {
    id: 'general',
    name: 'General Documents',
    description: 'Common legal documents and correspondence'
  },
  {
    id: 'litigation',
    name: 'Litigation',
    description: 'Court-related documents and litigation materials'
  },
  {
    id: 'corporate',
    name: 'Corporate / Business',
    description: 'Business formation, contracts, and corporate governance'
  },
  {
    id: 'real_estate',
    name: 'Real Estate / Property',
    description: 'Property transactions, leases, and real estate matters'
  },
  {
    id: 'family',
    name: 'Family Law',
    description: 'Marriage, divorce, custody, and family-related legal matters'
  },
  {
    id: 'succession',
    name: 'Succession / Estate',
    description: 'Wills, estates, trusts, and succession planning'
  },
  {
    id: 'employment',
    name: 'Employment / Labor',
    description: 'Employment contracts, labor relations, and workplace issues'
  },
  {
    id: 'ip',
    name: 'Intellectual Property',
    description: 'Patents, trademarks, copyrights, and IP matters'
  },
  {
    id: 'immigration',
    name: 'Immigration',
    description: 'Immigration applications, visas, and citizenship matters'
  },
  {
    id: 'regulatory',
    name: 'Regulatory / Compliance',
    description: 'Regulatory compliance, licensing, and administrative law'
  },
  {
    id: 'academic',
    name: 'Academic / Legal Research',
    description: 'Legal research, academic papers, and policy documents'
  }
];

export const documentTypes: DocumentType[] = [
  // General Documents
  {
    id: 'client_engagement',
    category_id: 'general',
    name: 'Client engagement letters',
    description: 'Letters establishing attorney-client relationship',
    template_prompt: 'Create a professional client engagement letter outlining the scope of legal services, fees, and terms of representation.'
  },
  {
    id: 'legal_opinion',
    category_id: 'general',
    name: 'Legal opinions',
    description: 'Formal legal opinions and advice',
    template_prompt: 'Draft a comprehensive legal opinion analyzing the relevant law and providing clear conclusions and recommendations.'
  },
  {
    id: 'demand_letter',
    category_id: 'general',
    name: 'Demand letters',
    description: 'Demand letters for legal matters',
    template_prompt: 'Create a formal demand letter that clearly states the claim, demands action, and outlines consequences of non-compliance.'
  },
  {
    id: 'cease_desist_letter',
    category_id: 'general',
    name: 'Cease and desist letters',
    description: 'Cease and desist legal letters',
    template_prompt: 'Draft a cease and desist letter demanding cessation of specific activities and warning of legal action if activities continue.'
  },
  {
    id: 'affidavit',
    category_id: 'general',
    name: 'Affidavits',
    description: 'Affidavit documents',
    template_prompt: 'Create a sworn affidavit stating facts within personal knowledge of the affiant, properly formatted for court filing.'
  },
  {
    id: 'notice',
    category_id: 'general',
    name: 'Notices',
    description: 'Various legal notices (e.g., notice of hearing, default, termination)',
    template_prompt: 'Draft a formal legal notice that provides proper notification as required by law or contract.'
  },
  {
    id: 'memo_brief',
    category_id: 'general',
    name: 'Memoranda / Legal briefs',
    description: 'Legal memoranda and briefs',
    template_prompt: 'Create a comprehensive legal memorandum analyzing the issues, applicable law, and providing clear conclusions.'
  },
  {
    id: 'letter_attorney',
    category_id: 'general',
    name: 'Letters to attorneys / parties',
    description: 'Professional correspondence with attorneys and parties',
    template_prompt: 'Draft professional legal correspondence that is clear, concise, and maintains appropriate legal tone.'
  },
  {
    id: 'power_attorney',
    category_id: 'general',
    name: 'Powers of attorney',
    description: 'Power of attorney documents',
    template_prompt: 'Create a power of attorney document with appropriate scope, limitations, and legal formalities.'
  },
  {
    id: 'authorization_consent',
    category_id: 'general',
    name: 'Authorizations / Consents',
    description: 'Authorization and consent documents',
    template_prompt: 'Draft authorization or consent documents that clearly define the scope and limitations of the granted authority.'
  },

  // Litigation
  {
    id: 'complaint_petition',
    category_id: 'litigation',
    name: 'Complaints / Petitions',
    description: 'Initial court filings',
    template_prompt: 'Draft a comprehensive complaint or petition with proper legal claims, factual allegations, and requested relief.'
  },
  {
    id: 'answer_response',
    category_id: 'litigation',
    name: 'Answers / Responses',
    description: 'Responses to court filings',
    template_prompt: 'Create a responsive pleading that addresses each allegation and raises appropriate defenses and counterclaims.'
  },
  {
    id: 'motion',
    category_id: 'litigation',
    name: 'Motions',
    description: 'Court motions (summary judgment, discovery, etc.)',
    template_prompt: 'Draft a persuasive motion with proper legal basis, supporting facts, and clear requested relief.'
  },
  {
    id: 'discovery_request',
    category_id: 'litigation',
    name: 'Discovery requests',
    description: 'Interrogatories, requests for production, admissions',
    template_prompt: 'Create comprehensive discovery requests that are relevant, specific, and likely to produce useful information.'
  },
  {
    id: 'subpoena',
    category_id: 'litigation',
    name: 'Subpoenas',
    description: 'Subpoenas for witnesses and documents',
    template_prompt: 'Draft a subpoena with proper legal authority, clear scope, and compliance with procedural requirements.'
  },
  {
    id: 'settlement_agreement',
    category_id: 'litigation',
    name: 'Settlement agreements',
    description: 'Settlement and release agreements',
    template_prompt: 'Create a comprehensive settlement agreement with clear terms, releases, and enforcement mechanisms.'
  },
  {
    id: 'court_order',
    category_id: 'litigation',
    name: 'Proposed court orders',
    description: 'Draft court orders for submission',
    template_prompt: 'Draft a proposed court order with clear, enforceable terms and proper legal language.'
  },
  {
    id: 'witness_statement',
    category_id: 'litigation',
    name: 'Witness statements / Declarations',
    description: 'Witness statements and declarations',
    template_prompt: 'Create a witness statement or declaration with clear, factual testimony and proper verification.'
  },

  // Corporate / Business
  {
    id: 'articles_incorporation',
    category_id: 'corporate',
    name: 'Articles of incorporation / Formation documents',
    description: 'Corporate formation documents',
    template_prompt: 'Draft articles of incorporation or formation documents with proper corporate structure and compliance requirements.'
  },
  {
    id: 'bylaws_operating',
    category_id: 'corporate',
    name: 'Bylaws / Operating agreements',
    description: 'Corporate governance documents',
    template_prompt: 'Create comprehensive bylaws or operating agreements governing corporate operations and management.'
  },
  {
    id: 'purchase_sale',
    category_id: 'corporate',
    name: 'Purchase / Sale agreements',
    description: 'Business purchase and sale agreements',
    template_prompt: 'Draft a detailed purchase or sale agreement with appropriate representations, warranties, and closing conditions.'
  },
  {
    id: 'service_agreement',
    category_id: 'corporate',
    name: 'Service agreements',
    description: 'Professional service agreements',
    template_prompt: 'Create a service agreement with clear scope of work, payment terms, and performance standards.'
  },
  {
    id: 'nda_confidentiality',
    category_id: 'corporate',
    name: 'NDAs / Confidentiality agreements',
    description: 'Non-disclosure and confidentiality agreements',
    template_prompt: 'Draft a non-disclosure agreement with appropriate scope, duration, and enforcement provisions.'
  },
  {
    id: 'partnership_agreement',
    category_id: 'corporate',
    name: 'Partnership agreements',
    description: 'Business partnership agreements',
    template_prompt: 'Create a comprehensive partnership agreement defining roles, responsibilities, profit sharing, and dispute resolution.'
  },
  {
    id: 'shareholder_agreement',
    category_id: 'corporate',
    name: 'Shareholder agreements',
    description: 'Agreements between shareholders',
    template_prompt: 'Draft a shareholder agreement addressing ownership rights, transfer restrictions, and governance matters.'
  },
  {
    id: 'board_resolution',
    category_id: 'corporate',
    name: 'Board resolutions',
    description: 'Corporate board resolutions',
    template_prompt: 'Create a board resolution with proper authorization and compliance with corporate governance requirements.'
  },
  {
    id: 'licensing_agreement',
    category_id: 'corporate',
    name: 'Licensing agreements',
    description: 'Intellectual property licensing agreements',
    template_prompt: 'Draft a licensing agreement with clear scope, royalty terms, and intellectual property protections.'
  },
  {
    id: 'franchise_agreement',
    category_id: 'corporate',
    name: 'Franchise agreements',
    description: 'Franchise and distribution agreements',
    template_prompt: 'Create a franchise agreement with territorial rights, operational requirements, and fee structures.'
  },

  // Real Estate / Property
  {
    id: 'purchase_agreement_real',
    category_id: 'real_estate',
    name: 'Purchase agreements',
    description: 'Real estate purchase agreements',
    template_prompt: 'Draft a real estate purchase agreement with appropriate contingencies, warranties, and closing procedures.'
  },
  {
    id: 'lease_agreement',
    category_id: 'real_estate',
    name: 'Lease agreements',
    description: 'Residential and commercial lease agreements',
    template_prompt: 'Create a comprehensive lease agreement with clear terms, responsibilities, and enforcement provisions.'
  },
  {
    id: 'deed',
    category_id: 'real_estate',
    name: 'Deeds',
    description: 'Property deeds and transfers',
    template_prompt: 'Draft a deed with proper legal description, warranties, and transfer requirements.'
  },
  {
    id: 'easement_agreement',
    category_id: 'real_estate',
    name: 'Easement agreements',
    description: 'Property easement agreements',
    template_prompt: 'Create an easement agreement with clear scope, duration, and property rights definitions.'
  },
  {
    id: 'property_management',
    category_id: 'real_estate',
    name: 'Property management agreements',
    description: 'Property management contracts',
    template_prompt: 'Draft a property management agreement with clear duties, compensation, and performance standards.'
  },
  {
    id: 'construction_contract',
    category_id: 'real_estate',
    name: 'Construction contracts',
    description: 'Construction and renovation contracts',
    template_prompt: 'Create a construction contract with detailed scope, timeline, payment schedule, and quality standards.'
  },
  {
    id: 'mortgage_deed',
    category_id: 'real_estate',
    name: 'Mortgage / Deed of trust',
    description: 'Mortgage and security documents',
    template_prompt: 'Draft mortgage or deed of trust documents with proper security interests and default provisions.'
  },
  {
    id: 'eviction_notice',
    category_id: 'real_estate',
    name: 'Eviction notices',
    description: 'Tenant eviction notices',
    template_prompt: 'Create an eviction notice with proper legal grounds, notice period, and compliance requirements.'
  },

  // Family Law
  {
    id: 'prenuptial_agreement',
    category_id: 'family',
    name: 'Prenuptial / Postnuptial agreements',
    description: 'Marriage agreements',
    template_prompt: 'Draft a prenuptial or postnuptial agreement with fair property division and spousal support provisions.'
  },
  {
    id: 'divorce_petition',
    category_id: 'family',
    name: 'Divorce petitions / Decrees',
    description: 'Divorce proceedings documents',
    template_prompt: 'Create divorce petition or decree with appropriate grounds, property division, and support provisions.'
  },
  {
    id: 'custody_agreement',
    category_id: 'family',
    name: 'Custody agreements',
    description: 'Child custody and visitation agreements',
    template_prompt: 'Draft a custody agreement prioritizing the child\'s best interests with clear visitation and decision-making authority.'
  },
  {
    id: 'adoption_papers',
    category_id: 'family',
    name: 'Adoption papers',
    description: 'Adoption proceedings documents',
    template_prompt: 'Create adoption documents with proper legal requirements, consents, and parental rights termination.'
  },
  {
    id: 'guardianship_papers',
    category_id: 'family',
    name: 'Guardianship papers',
    description: 'Guardianship appointment documents',
    template_prompt: 'Draft guardianship documents with appropriate authority, responsibilities, and court oversight provisions.'
  },
  {
    id: 'child_support',
    category_id: 'family',
    name: 'Child support agreements',
    description: 'Child support and modification agreements',
    template_prompt: 'Create child support agreement with clear payment obligations, modification procedures, and enforcement mechanisms.'
  },
  {
    id: 'separation_agreement',
    category_id: 'family',
    name: 'Separation agreements',
    description: 'Legal separation agreements',
    template_prompt: 'Draft a separation agreement addressing property division, support, and custody arrangements.'
  },

  // Succession / Estate
  {
    id: 'will_testament',
    category_id: 'succession',
    name: 'Wills / Last testaments',
    description: 'Will and testament documents',
    template_prompt: 'Create a comprehensive will with proper execution requirements, asset distribution, and executor appointments.'
  },
  {
    id: 'trust_agreement',
    category_id: 'succession',
    name: 'Trust agreements',
    description: 'Trust creation and administration documents',
    template_prompt: 'Draft a trust agreement with clear beneficiary rights, trustee duties, and distribution provisions.'
  },
  {
    id: 'probate_petition',
    category_id: 'succession',
    name: 'Probate petitions',
    description: 'Probate court filings',
    template_prompt: 'Create probate petition with proper inventory, beneficiary notifications, and court requirements.'
  },
  {
    id: 'estate_plan',
    category_id: 'succession',
    name: 'Estate planning documents',
    description: 'Comprehensive estate planning materials',
    template_prompt: 'Draft estate planning documents addressing tax minimization, asset protection, and succession planning.'
  },
  {
    id: 'living_will',
    category_id: 'succession',
    name: 'Living wills / Advance directives',
    description: 'Healthcare directive documents',
    template_prompt: 'Create living will or advance directive with clear healthcare preferences and decision-making authority.'
  },
  {
    id: 'beneficiary_designation',
    category_id: 'succession',
    name: 'Beneficiary designations',
    description: 'Beneficiary designation forms',
    template_prompt: 'Draft beneficiary designations with clear identification, contingent beneficiaries, and updating procedures.'
  },

  // Employment / Labor
  {
    id: 'employment_contract',
    category_id: 'employment',
    name: 'Employment contracts',
    description: 'Employment agreement documents',
    template_prompt: 'Create employment contract with clear job duties, compensation, benefits, and termination provisions.'
  },
  {
    id: 'non_compete',
    category_id: 'employment',
    name: 'Non-compete agreements',
    description: 'Non-compete and non-solicitation agreements',
    template_prompt: 'Draft non-compete agreement with reasonable geographic and temporal scope that protects legitimate business interests.'
  },
  {
    id: 'severance_agreement',
    category_id: 'employment',
    name: 'Severance agreements',
    description: 'Employee severance packages',
    template_prompt: 'Create severance agreement with appropriate compensation, benefits continuation, and release provisions.'
  },
  {
    id: 'employee_handbook',
    category_id: 'employment',
    name: 'Employee handbooks / Policies',
    description: 'Workplace policies and procedures',
    template_prompt: 'Draft employee handbook with clear policies, procedures, and compliance with employment laws.'
  },
  {
    id: 'performance_improvement',
    category_id: 'employment',
    name: 'Performance improvement plans',
    description: 'Employee performance management documents',
    template_prompt: 'Create performance improvement plan with specific goals, timelines, and consequences for non-compliance.'
  },
  {
    id: 'workplace_investigation',
    category_id: 'employment',
    name: 'Workplace investigation reports',
    description: 'Investigation and disciplinary documents',
    template_prompt: 'Draft workplace investigation report with objective findings, conclusions, and recommended actions.'
  },

  // Intellectual Property
  {
    id: 'trademark_application',
    category_id: 'ip',
    name: 'Trademark applications',
    description: 'Trademark registration documents',
    template_prompt: 'Create trademark application with proper classification, description, and supporting documentation.'
  },
  {
    id: 'copyright_registration',
    category_id: 'ip',
    name: 'Copyright registrations',
    description: 'Copyright protection documents',
    template_prompt: 'Draft copyright registration with accurate work description, authorship information, and filing requirements.'
  },
  {
    id: 'patent_application',
    category_id: 'ip',
    name: 'Patent applications',
    description: 'Patent filing documents',
    template_prompt: 'Create patent application with detailed invention description, claims, and prior art analysis.'
  },
  {
    id: 'ip_licensing',
    category_id: 'ip',
    name: 'IP licensing agreements',
    description: 'Intellectual property licensing contracts',
    template_prompt: 'Draft IP licensing agreement with clear scope, royalty terms, and intellectual property protections.'
  },
  {
    id: 'ip_assignment',
    category_id: 'ip',
    name: 'IP assignment agreements',
    description: 'Intellectual property transfer documents',
    template_prompt: 'Create IP assignment agreement with complete rights transfer and appropriate warranties.'
  },
  {
    id: 'dmca_notice',
    category_id: 'ip',
    name: 'DMCA takedown notices',
    description: 'Copyright infringement notices',
    template_prompt: 'Draft DMCA takedown notice with proper identification of copyrighted work and infringing material.'
  },

  // Immigration
  {
    id: 'visa_application',
    category_id: 'immigration',
    name: 'Visa applications',
    description: 'Immigration visa applications',
    template_prompt: 'Create visa application with complete documentation, supporting evidence, and compliance requirements.'
  },
  {
    id: 'green_card_petition',
    category_id: 'immigration',
    name: 'Green card petitions',
    description: 'Permanent residence applications',
    template_prompt: 'Draft green card petition with proper category classification, supporting documentation, and filing procedures.'
  },
  {
    id: 'citizenship_application',
    category_id: 'immigration',
    name: 'Citizenship applications',
    description: 'Naturalization and citizenship documents',
    template_prompt: 'Create citizenship application with complete eligibility documentation and naturalization requirements.'
  },
  {
    id: 'asylum_petition',
    category_id: 'immigration',
    name: 'Asylum petitions',
    description: 'Asylum and refugee applications',
    template_prompt: 'Draft asylum petition with detailed persecution claims, country conditions evidence, and legal arguments.'
  },
  {
    id: 'deportation_defense',
    category_id: 'immigration',
    name: 'Deportation defense documents',
    description: 'Immigration court defense materials',
    template_prompt: 'Create deportation defense documents with relief applications, supporting evidence, and legal arguments.'
  },
  {
    id: 'family_petition',
    category_id: 'immigration',
    name: 'Family-based petitions',
    description: 'Family immigration petitions',
    template_prompt: 'Draft family-based petition with relationship documentation, financial support evidence, and filing requirements.'
  },

  // Regulatory / Compliance
  {
    id: 'license_application',
    category_id: 'regulatory',
    name: 'License applications',
    description: 'Business and professional licensing',
    template_prompt: 'Create license application with complete requirements, supporting documentation, and regulatory compliance.'
  },
  {
    id: 'compliance_policy',
    category_id: 'regulatory',
    name: 'Compliance policies',
    description: 'Regulatory compliance procedures',
    template_prompt: 'Draft compliance policy with clear procedures, monitoring mechanisms, and regulatory requirements.'
  },
  {
    id: 'regulatory_filing',
    category_id: 'regulatory',
    name: 'Regulatory filings',
    description: 'Government agency submissions',
    template_prompt: 'Create regulatory filing with accurate information, supporting documentation, and deadline compliance.'
  },
  {
    id: 'permit_application',
    category_id: 'regulatory',
    name: 'Permit applications',
    description: 'Various permit applications',
    template_prompt: 'Draft permit application with complete project description, environmental considerations, and regulatory requirements.'
  },
  {
    id: 'administrative_appeal',
    category_id: 'regulatory',
    name: 'Administrative appeals',
    description: 'Appeals of agency decisions',
    template_prompt: 'Create administrative appeal with legal grounds, factual basis, and procedural compliance.'
  },
  {
    id: 'public_comment',
    category_id: 'regulatory',
    name: 'Public comments / Regulatory responses',
    description: 'Responses to regulatory proceedings',
    template_prompt: 'Draft public comment with clear position, supporting evidence, and regulatory impact analysis.'
  },

  // Academic / Legal Research
  {
    id: 'legal_research_memo',
    category_id: 'academic',
    name: 'Legal research memos',
    description: 'Memoranda on legal research',
    template_prompt: 'Create comprehensive legal research memos with analysis, authorities, and conclusions.'
  },
  {
    id: 'position_paper',
    category_id: 'academic',
    name: 'Position papers',
    description: 'Academic position papers on legal issues',
    template_prompt: 'Draft position papers analyzing legal issues with academic rigor and policy recommendations.'
  },
  {
    id: 'policy_brief',
    category_id: 'academic',
    name: 'Policy briefs',
    description: 'Briefs on policy matters',
    template_prompt: 'Create policy briefs summarizing complex legal issues with clear recommendations for decision-makers.'
  },
  {
    id: 'law_reform_proposal',
    category_id: 'academic',
    name: 'Law reform proposals',
    description: 'Proposals for legal reform',
    template_prompt: 'Draft law reform proposals with analysis of current law, identified problems, and proposed solutions.'
  },
  {
    id: 'draft_legislation',
    category_id: 'academic',
    name: 'Draft legislation / amendments',
    description: 'Draft legislative texts and amendments',
    template_prompt: 'Create draft legislation or amendments with proper legal language, structure, and implementation considerations.'
  }
];

// Function to ensure document types are loaded in the database
export const ensureDocumentTypesInDatabase = async () => {
  // This function could be used to check and populate the database
  // with the comprehensive document types if they don't exist
  console.log('Document types configuration loaded');
  return { documentCategories, documentTypes };
};

// Helper function to get document types by category
export const getDocumentTypesByCategory = (categoryId: string): DocumentType[] => {
  return documentTypes.filter(type => type.category_id === categoryId);
};

// Helper function to get category by id
export const getCategoryById = (categoryId: string): DocumentCategory | undefined => {
  return documentCategories.find(cat => cat.id === categoryId);
};

// Helper function to get document type by id
export const getDocumentTypeById = (typeId: string): DocumentType | undefined => {
  return documentTypes.find(type => type.id === typeId);
};
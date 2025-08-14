// Document types configuration for HakiDraft
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
  template_prompt?: string;
}

export const documentCategories: DocumentCategory[] = [
  {
    id: 'general',
    name: 'General Documents',
    description: 'Documents used across most practice areas',
    icon: '📄'
  },
  {
    id: 'litigation',
    name: 'Litigation / Court Practice',
    description: 'Documents used in litigation and court practice',
    icon: '⚖️'
  },
  {
    id: 'corporate',
    name: 'Corporate / Commercial Law',
    description: 'Documents used in corporate and commercial law',
    icon: '🏢'
  },
  {
    id: 'real_estate',
    name: 'Real Estate & Conveyancing',
    description: 'Documents used in real estate and conveyancing',
    icon: '🏘️'
  },
  {
    id: 'family',
    name: 'Family Law',
    description: 'Documents used in family law matters',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'succession',
    name: 'Succession / Probate',
    description: 'Documents used in succession and probate matters',
    icon: '📜'
  },
  {
    id: 'employment',
    name: 'Employment / Labor Law',
    description: 'Documents used in employment and labor law',
    icon: '💼'
  },
  {
    id: 'ip',
    name: 'Intellectual Property (IP) Law',
    description: 'Documents used in intellectual property law',
    icon: '💡'
  },
  {
    id: 'immigration',
    name: 'Immigration Law',
    description: 'Documents used in immigration law',
    icon: '✈️'
  },
  {
    id: 'regulatory',
    name: 'Regulatory / Administrative Law',
    description: 'Documents used in regulatory and administrative law',
    icon: '📋'
  },
  {
    id: 'academic',
    name: 'Academic / Legal Research',
    description: 'Documents used in academic and legal research',
    icon: '🎓'
  }
];

export const documentTypes: DocumentType[] = [
  // General Documents (Across Most Practice Areas)
  {
    id: 'client_engagement_letter',
    category_id: 'general',
    name: 'Client engagement letters / retainer agreements',
    description: 'Letters for client engagement and retainer agreements',
    template_prompt: 'Create a comprehensive client engagement letter and retainer agreement that establishes the attorney-client relationship, defines scope of services, fee structure, and terms of engagement.'
  },
  {
    id: 'legal_opinion',
    category_id: 'general',
    name: 'Legal opinions',
    description: 'Legal opinion documents',
    template_prompt: 'Draft a detailed legal opinion analyzing the relevant law, facts, and providing professional legal advice on the matter.'
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
    name: 'Memos and legal briefs',
    description: 'Legal memos and briefs',
    template_prompt: 'Create a comprehensive legal memorandum or brief analyzing legal issues, precedents, and providing recommendations.'
  },
  {
    id: 'pleading',
    category_id: 'general',
    name: 'Pleadings',
    description: 'General term for filed documents in court cases',
    template_prompt: 'Draft court pleadings with proper formatting, legal citations, and procedural compliance.'
  },

  // Litigation / Court Practice
  {
    id: 'plaint',
    category_id: 'litigation',
    name: 'Plaint (civil suits)',
    description: 'Plaint documents for civil suits',
    template_prompt: 'Create a comprehensive plaint for civil litigation, including statement of claim, facts, legal grounds, and prayer for relief.'
  },
  {
    id: 'petition',
    category_id: 'litigation',
    name: 'Petitions',
    description: 'Legal petitions',
    template_prompt: 'Draft a formal petition to the court requesting specific relief or action, with supporting grounds and legal authority.'
  },
  {
    id: 'statement_claim_defence',
    category_id: 'litigation',
    name: 'Statements of claim / defence',
    description: 'Statements of claim and defence',
    template_prompt: 'Create detailed statements of claim or defence outlining facts, legal issues, and arguments in litigation.'
  },
  {
    id: 'witness_statement',
    category_id: 'litigation',
    name: 'Witness statements',
    description: 'Witness statement documents',
    template_prompt: 'Draft a comprehensive witness statement capturing testimony and evidence in proper legal format.'
  },
  {
    id: 'pretrial_brief',
    category_id: 'litigation',
    name: 'Pre-trial briefs',
    description: 'Pre-trial legal briefs',
    template_prompt: 'Create a pre-trial brief summarizing facts, legal issues, evidence, and arguments for trial preparation.'
  },
  {
    id: 'motion_application',
    category_id: 'litigation',
    name: 'Motions / applications',
    description: 'Legal motions and applications',
    template_prompt: 'Draft a formal motion or application to the court requesting specific relief with supporting legal grounds.'
  },
  {
    id: 'affidavit_support_opposition',
    category_id: 'litigation',
    name: 'Affidavits in support or opposition',
    description: 'Affidavits in support or opposition of motions',
    template_prompt: 'Create affidavits supporting or opposing motions with factual statements and evidence.'
  },
  {
    id: 'written_submission',
    category_id: 'litigation',
    name: 'Submissions / written arguments',
    description: 'Written legal submissions and arguments',
    template_prompt: 'Draft detailed written submissions presenting legal arguments, case law, and statutory authorities.'
  },
  {
    id: 'court_order',
    category_id: 'litigation',
    name: 'Court orders / draft decrees',
    description: 'Court orders and draft decrees',
    template_prompt: 'Create draft court orders or decrees reflecting the court\'s decision and directives.'
  },
  {
    id: 'consent_judgment',
    category_id: 'litigation',
    name: 'Consent judgments / settlement agreements',
    description: 'Consent judgments and settlement agreements',
    template_prompt: 'Draft consent judgments or settlement agreements resolving disputes by mutual agreement.'
  },
  {
    id: 'discovery_document',
    category_id: 'litigation',
    name: 'Discovery documents',
    description: 'Discovery documents (e.g., interrogatories, requests to produce documents)',
    template_prompt: 'Create discovery documents including interrogatories, document requests, and admissions for litigation.'
  },
  {
    id: 'notice_appeal',
    category_id: 'litigation',
    name: 'Notices of appeal',
    description: 'Notices of appeal',
    template_prompt: 'Draft notice of appeal complying with appellate court rules and procedural requirements.'
  },
  {
    id: 'judicial_review',
    category_id: 'litigation',
    name: 'Judicial reviews',
    description: 'Judicial review documents',
    template_prompt: 'Create judicial review applications challenging administrative decisions with legal grounds.'
  },
  {
    id: 'exhibits_bundles',
    category_id: 'litigation',
    name: 'Exhibits and bundles of documents',
    description: 'Exhibits and bundles of documents',
    template_prompt: 'Organize and prepare exhibit bundles for court proceedings with proper indexing and referencing.'
  },

  // Corporate / Commercial Law
  {
    id: 'contract_agreement',
    category_id: 'corporate',
    name: 'Contracts / agreements',
    description: 'Various contracts and agreements',
    template_prompt: 'Create comprehensive contracts and agreements with clear terms, conditions, and legal protections.'
  },
  {
    id: 'sla',
    category_id: 'corporate',
    name: 'Service level agreements (SLAs)',
    description: 'Service level agreements',
    template_prompt: 'Draft service level agreements defining performance standards, metrics, and remedies.'
  },
  {
    id: 'mou',
    category_id: 'corporate',
    name: 'Memorandums of Understanding (MOUs)',
    description: 'Memorandums of Understanding',
    template_prompt: 'Create memorandums of understanding outlining mutual cooperation and shared objectives.'
  },
  {
    id: 'nda',
    category_id: 'corporate',
    name: 'Non-disclosure agreements (NDAs)',
    description: 'Non-disclosure agreements',
    template_prompt: 'Draft comprehensive non-disclosure agreements protecting confidential information and trade secrets.'
  },
  {
    id: 'partnership_agreement',
    category_id: 'corporate',
    name: 'Partnership agreements',
    description: 'Partnership agreements',
    template_prompt: 'Create partnership agreements defining rights, responsibilities, profit sharing, and governance.'
  },
  {
    id: 'joint_venture',
    category_id: 'corporate',
    name: 'Joint venture agreements',
    description: 'Joint venture agreements',
    template_prompt: 'Draft joint venture agreements establishing business cooperation, investment, and risk sharing.'
  },
  {
    id: 'shareholder_agreement',
    category_id: 'corporate',
    name: 'Shareholder agreements',
    description: 'Shareholder agreements',
    template_prompt: 'Create shareholder agreements governing ownership rights, transfer restrictions, and corporate governance.'
  },
  {
    id: 'employment_contract',
    category_id: 'corporate',
    name: 'Employment contracts',
    description: 'Employment contracts',
    template_prompt: 'Draft employment contracts with terms of service, compensation, benefits, and termination provisions.'
  },
  {
    id: 'consultancy_agreement',
    category_id: 'corporate',
    name: 'Consultancy agreements',
    description: 'Consultancy agreements',
    template_prompt: 'Create consultancy agreements defining scope of work, deliverables, and professional services.'
  },
  {
    id: 'franchise_agreement',
    category_id: 'corporate',
    name: 'Franchise agreements',
    description: 'Franchise agreements',
    template_prompt: 'Draft franchise agreements establishing business format licensing and operational standards.'
  },
  {
    id: 'loan_agreement',
    category_id: 'corporate',
    name: 'Loan agreements',
    description: 'Loan agreements',
    template_prompt: 'Create loan agreements with terms, interest, repayment schedules, and security provisions.'
  },
  {
    id: 'distribution_agreement',
    category_id: 'corporate',
    name: 'Distribution agreements',
    description: 'Distribution agreements',
    template_prompt: 'Draft distribution agreements governing product sales, territories, and commercial relationships.'
  },
  {
    id: 'sales_contract',
    category_id: 'corporate',
    name: 'Sales contracts',
    description: 'Sales contracts',
    template_prompt: 'Create sales contracts with delivery terms, payment conditions, and risk allocation.'
  },
  {
    id: 'licensing_agreement',
    category_id: 'corporate',
    name: 'Licensing agreements',
    description: 'Licensing agreements',
    template_prompt: 'Draft licensing agreements for intellectual property, technology, or content usage rights.'
  },
  {
    id: 'articles_incorporation',
    category_id: 'corporate',
    name: 'Articles of incorporation',
    description: 'Articles of incorporation',
    template_prompt: 'Create articles of incorporation establishing corporate entity with proper legal structure.'
  },
  {
    id: 'bylaws',
    category_id: 'corporate',
    name: 'Bylaws',
    description: 'Corporate bylaws',
    template_prompt: 'Draft corporate bylaws governing internal operations, decision-making, and corporate governance.'
  },
  {
    id: 'board_resolution',
    category_id: 'corporate',
    name: 'Board resolutions / minutes',
    description: 'Board resolutions and minutes',
    template_prompt: 'Create board resolutions and minutes documenting corporate decisions and proceedings.'
  },
  {
    id: 'company_registration',
    category_id: 'corporate',
    name: 'Company registration documents',
    description: 'Company registration documents',
    template_prompt: 'Prepare company registration documents for business formation and regulatory compliance.'
  },
  {
    id: 'due_diligence',
    category_id: 'corporate',
    name: 'Due diligence reports',
    description: 'Due diligence reports',
    template_prompt: 'Create comprehensive due diligence reports analyzing business, legal, and financial aspects.'
  },
  {
    id: 'ma_documentation',
    category_id: 'corporate',
    name: 'Mergers & acquisition documentation',
    description: 'Mergers and acquisition documentation',
    template_prompt: 'Draft M&A documentation including purchase agreements, disclosure schedules, and transaction documents.'
  },
  {
    id: 'governance_policy',
    category_id: 'corporate',
    name: 'Corporate governance policies',
    description: 'Corporate governance policies',
    template_prompt: 'Create corporate governance policies ensuring compliance and best practices.'
  },
  {
    id: 'secretarial_filing',
    category_id: 'corporate',
    name: 'Company secretarial filings',
    description: 'Company secretarial filings',
    template_prompt: 'Prepare secretarial filings for regulatory compliance and corporate maintenance.'
  },

  // Real Estate & Conveyancing
  {
    id: 'sale_agreement',
    category_id: 'real_estate',
    name: 'Sale agreements',
    description: 'Sale agreements for land, house, commercial property',
    template_prompt: 'Create comprehensive sale agreements for real estate with terms, conditions, and legal protections.'
  },
  {
    id: 'transfer_instrument',
    category_id: 'real_estate',
    name: 'Transfer instruments',
    description: 'Property transfer instruments',
    template_prompt: 'Draft transfer instruments for property conveyancing with proper legal formalities.'
  },
  {
    id: 'lease_tenancy',
    category_id: 'real_estate',
    name: 'Leases / tenancy agreements',
    description: 'Lease and tenancy agreements',
    template_prompt: 'Create lease and tenancy agreements with rental terms, obligations, and legal protections.'
  },
  {
    id: 'title_search',
    category_id: 'real_estate',
    name: 'Title search reports',
    description: 'Title search reports',
    template_prompt: 'Prepare title search reports documenting property ownership, encumbrances, and legal status.'
  },
  {
    id: 'land_control_consent',
    category_id: 'real_estate',
    name: 'Land control board consents',
    description: 'Land control board consents',
    template_prompt: 'Draft applications for land control board consents for property transactions.'
  },
  {
    id: 'charge_instrument',
    category_id: 'real_estate',
    name: 'Charge instruments (mortgages)',
    description: 'Charge instruments and mortgages',
    template_prompt: 'Create charge instruments and mortgage documents securing property financing.'
  },
  {
    id: 'deed',
    category_id: 'real_estate',
    name: 'Deeds',
    description: 'Various deeds (e.g., deed of assignment, deed of gift, deed of variation)',
    template_prompt: 'Draft property deeds including assignments, gifts, and variations with proper legal formalities.'
  },
  {
    id: 'caveat',
    category_id: 'real_estate',
    name: 'Caveats and withdrawal of caveats',
    description: 'Caveats and withdrawal of caveats',
    template_prompt: 'Create caveats protecting property interests and withdrawal documents when appropriate.'
  },
  {
    id: 'landlord_tenant_notice',
    category_id: 'real_estate',
    name: 'Landlord-tenant notices',
    description: 'Landlord-tenant notices (e.g., notice to vacate)',
    template_prompt: 'Draft landlord-tenant notices for various purposes including notices to vacate and rent increases.'
  },

  // Family Law
  {
    id: 'divorce_petition',
    category_id: 'family',
    name: 'Divorce petitions',
    description: 'Divorce petition documents',
    template_prompt: 'Create divorce petitions with grounds, relief sought, and proper legal formalities.'
  },
  {
    id: 'custody_maintenance',
    category_id: 'family',
    name: 'Child custody/maintenance applications',
    description: 'Child custody and maintenance applications',
    template_prompt: 'Draft child custody and maintenance applications with best interests considerations.'
  },
  {
    id: 'prenuptial',
    category_id: 'family',
    name: 'Prenuptial agreements',
    description: 'Prenuptial agreements',
    template_prompt: 'Create prenuptial agreements protecting assets and defining marital obligations.'
  },
  {
    id: 'adoption_petition',
    category_id: 'family',
    name: 'Adoption petitions',
    description: 'Adoption petition documents',
    template_prompt: 'Draft adoption petitions with required declarations and legal compliance.'
  },
  {
    id: 'guardianship_application',
    category_id: 'family',
    name: 'Guardianship applications',
    description: 'Guardianship applications',
    template_prompt: 'Create guardianship applications for minor or incapacitated persons with legal safeguards.'
  },
  {
    id: 'consent_order',
    category_id: 'family',
    name: 'Consent orders',
    description: 'Consent orders (custody, divorce settlements)',
    template_prompt: 'Draft consent orders for family law settlements and custody arrangements.'
  },
  {
    id: 'family_affidavit',
    category_id: 'family',
    name: 'Affidavits on family status / financial status',
    description: 'Affidavits on family status and financial status',
    template_prompt: 'Create affidavits documenting family and financial circumstances for court proceedings.'
  },

  // Succession / Probate
  {
    id: 'will',
    category_id: 'succession',
    name: 'Wills',
    description: 'Will documents',
    template_prompt: 'Create comprehensive wills with asset distribution, executor appointments, and legal formalities.'
  },
  {
    id: 'codicil',
    category_id: 'succession',
    name: 'Codicils',
    description: 'Codicil documents',
    template_prompt: 'Draft codicils amending existing wills with proper legal formalities.'
  },
  {
    id: 'probate_petition',
    category_id: 'succession',
    name: 'Petition for grant of probate',
    description: 'Petition for grant of probate',
    template_prompt: 'Create petition for grant of probate for estate administration with required documentation.'
  },
  {
    id: 'administration_petition',
    category_id: 'succession',
    name: 'Petition for letters of administration',
    description: 'Petition for letters of administration',
    template_prompt: 'Draft petition for letters of administration for intestate estates with legal requirements.'
  },
  {
    id: 'estate_affidavit',
    category_id: 'succession',
    name: 'Affidavits of means and relationships',
    description: 'Affidavits of means and relationships',
    template_prompt: 'Create affidavits documenting estate assets and family relationships for succession proceedings.'
  },
  {
    id: 'estate_inventory',
    category_id: 'succession',
    name: 'Inventory and accounts for estate distribution',
    description: 'Inventory and accounts for estate distribution',
    template_prompt: 'Prepare estate inventory and distribution accounts for court approval.'
  },
  {
    id: 'family_arrangement',
    category_id: 'succession',
    name: 'Deed of family arrangement',
    description: 'Deed of family arrangement',
    template_prompt: 'Draft deed of family arrangement for estate settlement among beneficiaries.'
  },
  {
    id: 'trust_deed',
    category_id: 'succession',
    name: 'Trust deeds',
    description: 'Trust deeds',
    template_prompt: 'Create trust deeds establishing trust relationships with proper legal structure.'
  },

  // Employment / Labor Law
  {
    id: 'employment_contract_emp',
    category_id: 'employment',
    name: 'Employment contracts',
    description: 'Employment contracts',
    template_prompt: 'Draft employment contracts with comprehensive terms, benefits, and compliance requirements.'
  },
  {
    id: 'termination_letter',
    category_id: 'employment',
    name: 'Termination / dismissal letters',
    description: 'Termination and dismissal letters',
    template_prompt: 'Create termination letters with proper legal grounds and procedural compliance.'
  },
  {
    id: 'non_compete',
    category_id: 'employment',
    name: 'Non-compete agreements',
    description: 'Non-compete agreements',
    template_prompt: 'Draft non-compete agreements protecting business interests within legal limits.'
  },
  {
    id: 'workplace_policy',
    category_id: 'employment',
    name: 'Workplace policies',
    description: 'Workplace policies (e.g., disciplinary, harassment)',
    template_prompt: 'Create workplace policies ensuring legal compliance and employee protection.'
  },
  {
    id: 'warning_letter',
    category_id: 'employment',
    name: 'Warning letters',
    description: 'Warning letters',
    template_prompt: 'Draft warning letters documenting performance issues and corrective measures.'
  },
  {
    id: 'grievance_response',
    category_id: 'employment',
    name: 'Grievance responses',
    description: 'Grievance response documents',
    template_prompt: 'Create grievance responses addressing employee concerns with fair resolution.'
  },
  {
    id: 'redundancy_notice',
    category_id: 'employment',
    name: 'Redundancy / retrenchment notices',
    description: 'Redundancy and retrenchment notices',
    template_prompt: 'Draft redundancy notices complying with labor law requirements and procedures.'
  },
  {
    id: 'collective_bargaining',
    category_id: 'employment',
    name: 'Collective bargaining agreements',
    description: 'Collective bargaining agreements',
    template_prompt: 'Create collective bargaining agreements establishing employment terms for union members.'
  },

  // Intellectual Property (IP) Law
  {
    id: 'copyright_assignment',
    category_id: 'ip',
    name: 'Copyright assignment agreements',
    description: 'Copyright assignment agreements',
    template_prompt: 'Draft copyright assignment agreements transferring intellectual property rights.'
  },
  {
    id: 'trademark_application',
    category_id: 'ip',
    name: 'Trademark registration applications',
    description: 'Trademark registration applications',
    template_prompt: 'Create trademark registration applications with proper classifications and legal requirements.'
  },
  {
    id: 'patent_application',
    category_id: 'ip',
    name: 'Patent applications',
    description: 'Patent applications',
    template_prompt: 'Draft patent applications with detailed descriptions, claims, and technical specifications.'
  },
  {
    id: 'ip_licensing',
    category_id: 'ip',
    name: 'IP licensing agreements',
    description: 'IP licensing agreements',
    template_prompt: 'Create IP licensing agreements granting usage rights with terms and royalties.'
  },
  {
    id: 'confidentiality_agreement',
    category_id: 'ip',
    name: 'Confidentiality agreements',
    description: 'Confidentiality agreements',
    template_prompt: 'Draft confidentiality agreements protecting proprietary information and trade secrets.'
  },
  {
    id: 'ip_cease_desist',
    category_id: 'ip',
    name: 'Cease and desist letters (IP infringement)',
    description: 'Cease and desist letters for IP infringement',
    template_prompt: 'Create cease and desist letters for intellectual property infringement with legal grounds.'
  },

  // Immigration Law
  {
    id: 'work_permit',
    category_id: 'immigration',
    name: 'Work permit applications',
    description: 'Work permit applications',
    template_prompt: 'Draft work permit applications with required documentation and legal compliance.'
  },
  {
    id: 'visa_support',
    category_id: 'immigration',
    name: 'Visa support letters',
    description: 'Visa support letters',
    template_prompt: 'Create visa support letters for immigration applications with proper attestations.'
  },
  {
    id: 'deportation_appeal',
    category_id: 'immigration',
    name: 'Deportation appeal documents',
    description: 'Deportation appeal documents',
    template_prompt: 'Draft deportation appeal documents with legal grounds and humanitarian considerations.'
  },
  {
    id: 'residency_application',
    category_id: 'immigration',
    name: 'Residency or citizenship applications',
    description: 'Residency or citizenship applications',
    template_prompt: 'Create residency or citizenship applications with eligibility documentation.'
  },
  {
    id: 'support_affidavit',
    category_id: 'immigration',
    name: 'Affidavits of support or relationship',
    description: 'Affidavits of support or relationship',
    template_prompt: 'Draft affidavits supporting immigration applications with relationship or financial evidence.'
  },

  // Regulatory / Administrative Law
  {
    id: 'license_application',
    category_id: 'regulatory',
    name: 'License applications',
    description: 'License applications',
    template_prompt: 'Create license applications for various regulatory approvals with compliance requirements.'
  },
  {
    id: 'compliance_filing',
    category_id: 'regulatory',
    name: 'Compliance filings',
    description: 'Compliance filings',
    template_prompt: 'Prepare compliance filings meeting regulatory standards and reporting requirements.'
  },
  {
    id: 'review_petition',
    category_id: 'regulatory',
    name: 'Petitions for review / appeal',
    description: 'Petitions for review and appeal',
    template_prompt: 'Draft petitions for administrative review or appeal with procedural compliance.'
  },
  {
    id: 'regulatory_submission',
    category_id: 'regulatory',
    name: 'Regulatory submissions and responses',
    description: 'Regulatory submissions and responses',
    template_prompt: 'Create regulatory submissions and responses addressing agency requirements.'
  },
  {
    id: 'policy_paper',
    category_id: 'regulatory',
    name: 'Policy position papers',
    description: 'Policy position papers',
    template_prompt: 'Draft policy position papers analyzing regulatory issues and recommendations.'
  },
  {
    id: 'government_memo',
    category_id: 'regulatory',
    name: 'Memoranda to government bodies',
    description: 'Memoranda to government bodies',
    template_prompt: 'Create memoranda for government entities with policy analysis and recommendations.'
  },

  // Academic / Legal Research
  {
    id: 'research_memo',
    category_id: 'academic',
    name: 'Legal research memos',
    description: 'Legal research memos',
    template_prompt: 'Create comprehensive legal research memos analyzing legal issues with citations and recommendations.'
  },
  {
    id: 'position_paper',
    category_id: 'academic',
    name: 'Position papers',
    description: 'Position papers',
    template_prompt: 'Draft position papers presenting legal arguments and policy recommendations with research support.'
  },
  {
    id: 'policy_brief',
    category_id: 'academic',
    name: 'Policy briefs',
    description: 'Policy briefs',
    template_prompt: 'Create policy briefs summarizing legal issues and proposing solutions for stakeholders.'
  },
  {
    id: 'law_reform',
    category_id: 'academic',
    name: 'Law reform proposals',
    description: 'Law reform proposals',
    template_prompt: 'Draft law reform proposals with comparative analysis and implementation recommendations.'
  },
  {
    id: 'draft_legislation',
    category_id: 'academic',
    name: 'Draft legislation / amendments',
    description: 'Draft legislation and amendments',
    template_prompt: 'Create draft legislation and amendments with proper legal structure and constitutional compliance.'
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

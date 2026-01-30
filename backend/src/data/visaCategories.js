/**
 * Comprehensive South African Immigration Visa Categories
 * Based on the Immigration Act 13 of 2002 (as amended) and Immigration Regulations
 *
 * Each category includes:
 * - Legal reference (Act section / regulation)
 * - Eligibility criteria
 * - Required documents
 * - Common rejection reasons
 * - Processing guidance
 */

const VISA_CATEGORIES = {
  // ============================================================
  // TEMPORARY RESIDENCE VISAS
  // ============================================================

  VISITOR_TOURISM: {
    id: 'visitor_tourism',
    name: "Visitor's Visa - Tourism",
    category: 'temporary_residence',
    legalReference: 'Section 11(1)(a) of the Immigration Act',
    description: 'For foreign nationals visiting South Africa for tourism and leisure purposes.',
    maxDuration: '90 days',
    eligibility: {
      requirements: [
        'Valid passport with at least 30 days validity beyond intended stay',
        'Return or onward ticket',
        'Proof of sufficient funds for the duration of stay',
        'Proof of accommodation arrangements',
        'No intention to work, study, or conduct business',
      ],
      disqualifiers: [
        'Previous immigration violations in South Africa',
        'Passport validity less than 30 days beyond stay',
        'Listed as undesirable person under Section 30',
        'Criminal record for serious offenses',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport with at least 30 days validity beyond intended departure', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'return_ticket', name: 'Return/Onward Ticket', description: 'Confirmed return or onward travel booking', required: true },
      { type: 'financial_proof', name: 'Proof of Funds', description: 'Bank statements (3 months) showing sufficient funds', required: true },
      { type: 'accommodation', name: 'Accommodation Proof', description: 'Hotel bookings or letter of invitation with host ID', required: true },
      { type: 'travel_insurance', name: 'Travel Insurance', description: 'Medical and travel insurance covering stay duration', required: false },
      { type: 'yellow_fever', name: 'Yellow Fever Certificate', description: 'Required if traveling from yellow fever endemic country', required: false },
    ],
    commonRejectionReasons: [
      'Insufficient proof of financial means',
      'Passport validity too short',
      'Incomplete accommodation details',
      'Suspicion of intent to overstay or work illegally',
    ],
    fees: { application: 'No fee for most nationalities', notes: 'Some nationalities require payment - check DHA schedule' },
  },

  VISITOR_BUSINESS: {
    id: 'visitor_business',
    name: "Visitor's Visa - Business",
    category: 'temporary_residence',
    legalReference: 'Section 11(1)(b) of the Immigration Act',
    description: 'For foreign nationals attending business meetings, conferences, or trade-related activities (not employment).',
    maxDuration: '90 days',
    eligibility: {
      requirements: [
        'Valid passport with at least 30 days validity beyond intended stay',
        'Letter of invitation from South African business entity',
        'Proof that applicant will not engage in employment',
        'Proof of sufficient funds',
        'Return or onward ticket',
      ],
      disqualifiers: [
        'Intent to engage in paid employment',
        'Previous immigration violations',
        'Listed as undesirable person',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport with at least 30 days validity beyond intended departure', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'business_invitation', name: 'Business Invitation Letter', description: 'Letter from SA company detailing business purpose, duration, and financial responsibility', required: true },
      { type: 'company_registration', name: 'Inviting Company Registration', description: 'CIPC registration of the inviting South African company', required: true },
      { type: 'financial_proof', name: 'Proof of Funds', description: 'Bank statements or company sponsorship letter', required: true },
      { type: 'return_ticket', name: 'Return/Onward Ticket', description: 'Confirmed travel booking', required: true },
      { type: 'yellow_fever', name: 'Yellow Fever Certificate', description: 'If applicable based on country of origin', required: false },
    ],
    commonRejectionReasons: [
      'Vague business purpose description',
      'No clear link between applicant and business activities',
      'Insufficient documentation from inviting company',
    ],
    fees: { application: 'No fee for most nationalities' },
  },

  VISITOR_FAMILY: {
    id: 'visitor_family',
    name: "Visitor's Visa - Family/Personal Visit",
    category: 'temporary_residence',
    legalReference: 'Section 11(1)(a) of the Immigration Act',
    description: 'For foreign nationals visiting family members or friends in South Africa.',
    maxDuration: '90 days',
    eligibility: {
      requirements: [
        'Valid passport with at least 30 days validity',
        'Letter of invitation from host in South Africa',
        'Host must provide copy of ID/passport and proof of residence',
        'Proof of relationship to host',
        'Proof of sufficient funds',
      ],
      disqualifiers: [
        'Cannot prove genuine relationship with host',
        'Previous overstay in South Africa',
        'Listed as undesirable person',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport with adequate validity', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'invitation_letter', name: 'Invitation Letter from Host', description: 'Letter confirming accommodation and financial support', required: true },
      { type: 'host_id', name: 'Host ID/Passport Copy', description: 'Copy of host SA ID or passport', required: true },
      { type: 'host_proof_of_residence', name: 'Host Proof of Residence', description: 'Utility bill or lease agreement of host', required: true },
      { type: 'relationship_proof', name: 'Proof of Relationship', description: 'Birth certificates, marriage certificates, or communication history', required: true },
      { type: 'financial_proof', name: 'Proof of Funds', description: 'Own funds or host undertaking', required: true },
      { type: 'return_ticket', name: 'Return Ticket', description: 'Confirmed return travel booking', required: true },
    ],
    commonRejectionReasons: [
      'Insufficient proof of genuine relationship',
      'Host documentation incomplete',
      'Previous overstay history',
    ],
    fees: { application: 'No fee for most nationalities' },
  },

  STUDY_VISA: {
    id: 'study_visa',
    name: 'Study Visa',
    category: 'temporary_residence',
    legalReference: 'Section 13 of the Immigration Act',
    description: 'For foreign nationals accepted to study at a recognized South African educational institution.',
    maxDuration: 'Duration of studies',
    eligibility: {
      requirements: [
        'Acceptance letter from a South African learning institution registered with DHA',
        'Proof of sufficient financial means or scholarship',
        'Medical and radiological report',
        'Police clearance certificate from country of origin',
        'If minor: consent from both parents and guardianship arrangement in SA',
        'Medical insurance covering study period',
      ],
      disqualifiers: [
        'Institution not registered with DHA',
        'Insufficient financial means',
        'Failed medical examination',
        'Criminal record for serious offenses',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport valid for duration of intended studies', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'acceptance_letter', name: 'Acceptance Letter', description: 'Official acceptance from DHA-registered institution', required: true },
      { type: 'financial_proof', name: 'Proof of Financial Means', description: 'Bank statements, scholarship letter, or sponsor undertaking covering tuition and living expenses', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report not older than 6 months', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report not older than 6 months', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin and any country resided in for 12+ months', required: true },
      { type: 'medical_insurance', name: 'Medical Insurance', description: 'Covering full duration of studies in South Africa', required: true },
      { type: 'parental_consent', name: 'Parental Consent (minors)', description: 'Consent letters from both parents if applicant is under 18', required: false },
    ],
    commonRejectionReasons: [
      'Institution not on DHA approved list',
      'Insufficient financial proof for full duration',
      'Missing or expired medical/radiological reports',
      'Missing police clearance certificate',
    ],
    fees: { application: 'R1520' },
  },

  MEDICAL_TREATMENT_VISA: {
    id: 'medical_treatment',
    name: 'Medical Treatment Visa',
    category: 'temporary_residence',
    legalReference: 'Section 18 of the Immigration Act',
    description: 'For foreign nationals seeking medical treatment at a South African healthcare facility.',
    maxDuration: 'Duration of treatment (renewable)',
    eligibility: {
      requirements: [
        'Letter from South African medical facility confirming treatment',
        'Letter from referring medical practitioner',
        'Proof of ability to pay for medical treatment',
        'Proof of financial means for accommodation and living expenses',
      ],
      disqualifiers: [
        'Cannot demonstrate ability to pay for treatment',
        'Treatment facility not recognized',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'medical_facility_letter', name: 'Hospital/Facility Letter', description: 'Letter from SA medical facility confirming treatment plan and duration', required: true },
      { type: 'referring_doctor_letter', name: 'Referring Doctor Letter', description: 'Letter from home country doctor referring for treatment', required: true },
      { type: 'financial_proof', name: 'Proof of Payment Ability', description: 'Bank statements, insurance, or payment guarantee', required: true },
      { type: 'return_ticket', name: 'Return Ticket', description: 'Confirmed return travel arrangements', required: true },
    ],
    commonRejectionReasons: [
      'Insufficient proof of payment ability',
      'Vague treatment plan from facility',
      'Missing referral documentation',
    ],
    fees: { application: 'R1520' },
  },

  REMOTE_WORK_VISA: {
    id: 'remote_work',
    name: 'Remote Work Visa (Section 11(2))',
    category: 'temporary_residence',
    legalReference: 'Section 11(2) of the Immigration Act',
    description: 'For foreign nationals employed by foreign companies who wish to work remotely from South Africa.',
    maxDuration: 'Up to 3 years',
    eligibility: {
      requirements: [
        'Employment contract with a foreign employer (outside South Africa)',
        'Minimum annual income equivalent to ZAR 1,000,000',
        'Valid passport with sufficient validity',
        'Medical insurance covering stay in South Africa',
        'Proof of accommodation in South Africa',
        'Police clearance certificate',
      ],
      disqualifiers: [
        'Income below minimum threshold',
        'Employment with South African entity',
        'Criminal record for serious offenses',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport valid for duration of intended stay', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'employment_contract', name: 'Employment Contract', description: 'Contract with foreign employer showing role and compensation', required: true },
      { type: 'income_proof', name: 'Proof of Income', description: 'Payslips, tax returns, or bank statements showing minimum ZAR 1M annual income', required: true },
      { type: 'medical_insurance', name: 'Medical Insurance', description: 'Comprehensive medical insurance for South Africa', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'accommodation', name: 'Proof of Accommodation', description: 'Lease agreement or property ownership in SA', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Income below ZAR 1,000,000 threshold',
      'Employment appears to be with SA entity',
      'Insufficient medical insurance coverage',
    ],
    fees: { application: 'R1520' },
  },

  RETIRED_PERSON_VISA: {
    id: 'retired_person',
    name: 'Retired Person Visa',
    category: 'temporary_residence',
    legalReference: 'Section 20 of the Immigration Act',
    description: 'For retired foreign nationals who wish to retire in South Africa.',
    maxDuration: 'Up to 4 years (renewable)',
    eligibility: {
      requirements: [
        'Minimum monthly income of ZAR 37,000 (or equivalent)',
        'Proof of pension, retirement annuity, or irrevocable retirement income',
        'Right of abode or citizenship in country of origin',
        'Police clearance certificate',
        'Medical and radiological reports',
      ],
      disqualifiers: [
        'Income below minimum threshold',
        'No verifiable retirement income source',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Passport valid for intended stay duration', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'pension_proof', name: 'Pension/Retirement Income Proof', description: 'Pension statements, annuity contracts, or retirement fund documents', required: true },
      { type: 'financial_proof', name: 'Bank Statements', description: 'Three months of bank statements', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin and residence', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report not older than 6 months', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report not older than 6 months', required: true },
    ],
    commonRejectionReasons: [
      'Retirement income below minimum threshold',
      'Unverifiable pension source',
      'Missing medical documentation',
    ],
    fees: { application: 'R1520' },
  },

  EXCHANGE_VISA: {
    id: 'exchange_visa',
    name: 'Exchange Visa',
    category: 'temporary_residence',
    legalReference: 'Section 15 of the Immigration Act',
    description: 'For participants in approved cultural, economic, or social exchange programs.',
    maxDuration: 'Up to 12 months',
    eligibility: {
      requirements: [
        'Participation in a recognized exchange program',
        'Confirmation from program organizer',
        'Proof of financial support during exchange',
        'Medical insurance',
      ],
      disqualifiers: [
        'Program not recognized by DHA',
        'Insufficient financial support',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'exchange_letter', name: 'Exchange Program Confirmation', description: 'Letter from approved exchange program organizer', required: true },
      { type: 'financial_proof', name: 'Financial Support Proof', description: 'Stipend, scholarship, or sponsor confirmation', required: true },
      { type: 'medical_insurance', name: 'Medical Insurance', description: 'Covering duration of exchange', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
    ],
    commonRejectionReasons: [
      'Unrecognized exchange program',
      'Insufficient documentation from organizer',
    ],
    fees: { application: 'R1520' },
  },

  // ============================================================
  // WORK AND BUSINESS PERMITS
  // ============================================================

  GENERAL_WORK_VISA: {
    id: 'general_work',
    name: 'General Work Visa',
    category: 'work_permit',
    legalReference: 'Section 19(2) of the Immigration Act',
    description: 'For foreign nationals with a confirmed job offer from a South African employer, where no suitable South African citizen or permanent resident is available.',
    maxDuration: 'Up to 5 years',
    eligibility: {
      requirements: [
        'Confirmed job offer from a South African employer',
        'Employer must demonstrate that no suitable SA citizen/PR was found (labor market test)',
        'Department of Labour recommendation letter',
        'Qualifications evaluated by SAQA',
        'Relevant professional registration (if applicable)',
        'Police clearance certificate',
        'Medical and radiological reports',
      ],
      disqualifiers: [
        'No Department of Labour recommendation',
        'Qualifications not recognized by SAQA',
        'Position can be filled by SA citizen/PR',
        'Criminal record for serious offenses',
        'Employer non-compliant with labor laws',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid for duration of employment contract', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'employment_contract', name: 'Employment Contract', description: 'Signed contract with SA employer detailing role, duration, and remuneration', required: true },
      { type: 'dol_recommendation', name: 'Department of Labour Recommendation', description: 'Letter from DOL confirming no suitable local candidate found', required: true },
      { type: 'saqa_evaluation', name: 'SAQA Evaluation Certificate', description: 'South African Qualifications Authority evaluation of foreign qualifications', required: true },
      { type: 'qualifications', name: 'Educational Qualifications', description: 'Certified copies of degrees, diplomas, and certificates', required: true },
      { type: 'professional_registration', name: 'Professional Registration', description: 'Registration with relevant SA professional body (if applicable)', required: false },
      { type: 'employer_registration', name: 'Employer Company Registration', description: 'CIPC registration documents of employing company', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From all countries resided in for 12+ months since age 18', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report not older than 6 months', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report not older than 6 months', required: true },
      { type: 'cv', name: 'Curriculum Vitae', description: 'Detailed CV with employment history', required: true },
    ],
    commonRejectionReasons: [
      'Missing Department of Labour recommendation',
      'SAQA evaluation not completed or qualification not recognized',
      'Employer failed to demonstrate adequate local recruitment efforts',
      'Incomplete employer documentation',
      'Professional registration not obtained where required',
    ],
    fees: { application: 'R1520' },
  },

  CRITICAL_SKILLS_VISA: {
    id: 'critical_skills',
    name: 'Critical Skills Work Visa',
    category: 'work_permit',
    legalReference: 'Section 19(4) of the Immigration Act',
    description: 'For foreign nationals possessing skills listed on the Critical Skills List published by the Minister of Home Affairs.',
    maxDuration: 'Up to 5 years',
    eligibility: {
      requirements: [
        'Skill must be on the current Critical Skills List',
        'Relevant qualification evaluated by SAQA',
        'Professional registration with relevant SA body (where applicable)',
        'Proof of post-qualification experience (minimum varies by skill)',
        'No job offer required at time of application (but must find employment within 12 months)',
      ],
      disqualifiers: [
        'Skill not on Critical Skills List',
        'Qualifications not recognized by SAQA',
        'Cannot obtain professional registration where required',
        'Criminal record for serious offenses',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'saqa_evaluation', name: 'SAQA Evaluation Certificate', description: 'SAQA evaluation confirming qualification equivalence', required: true },
      { type: 'qualifications', name: 'Educational Qualifications', description: 'Certified copies of all relevant qualifications', required: true },
      { type: 'professional_registration', name: 'Professional Body Registration', description: 'Registration or confirmation letter from relevant SA professional body', required: true },
      { type: 'experience_proof', name: 'Proof of Experience', description: 'Reference letters, employment records confirming post-qualification experience', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From all countries resided in for 12+ months', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
      { type: 'cv', name: 'Curriculum Vitae', description: 'Detailed CV highlighting critical skills', required: true },
      { type: 'employment_contract', name: 'Employment Contract/Offer', description: 'Job offer or contract in SA (or commitment to find employment within 12 months)', required: false },
    ],
    commonRejectionReasons: [
      'Skill not on current Critical Skills List',
      'SAQA evaluation pending or qualification not recognized',
      'Professional registration not obtained',
      'Insufficient proof of post-qualification experience',
    ],
    fees: { application: 'R1520' },
  },

  INTRA_COMPANY_TRANSFER: {
    id: 'intra_company_transfer',
    name: 'Intra-Company Transfer Visa',
    category: 'work_permit',
    legalReference: 'Section 19(3) of the Immigration Act',
    description: 'For employees of multinational companies being transferred to a South African branch, subsidiary, or affiliate.',
    maxDuration: 'Up to 4 years',
    eligibility: {
      requirements: [
        'Currently employed by a multinational company with SA presence',
        'Transfer to SA branch, subsidiary, or affiliate',
        'Employed by the company for at least 6 months prior to transfer',
        'Managerial, executive, or specialist role',
        'Skills transfer plan to SA employees',
      ],
      disqualifiers: [
        'No corporate relationship between foreign and SA entity',
        'Less than 6 months employment with company',
        'Non-specialist or non-managerial role',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'transfer_letter', name: 'Transfer Letter', description: 'Company letter confirming transfer, role, duration, and terms', required: true },
      { type: 'employment_contract', name: 'SA Employment Terms', description: 'Terms of employment in South Africa', required: true },
      { type: 'company_relationship', name: 'Company Relationship Proof', description: 'Documents showing relationship between foreign and SA entities', required: true },
      { type: 'employer_registration', name: 'SA Company Registration', description: 'CIPC registration of SA entity', required: true },
      { type: 'skills_transfer_plan', name: 'Skills Transfer Plan', description: 'Plan for transferring knowledge to local employees', required: true },
      { type: 'qualifications', name: 'Qualifications', description: 'Relevant educational qualifications', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Cannot prove corporate relationship between entities',
      'Missing skills transfer plan',
      'Role not clearly managerial or specialist',
    ],
    fees: { application: 'R1520' },
  },

  CORPORATE_VISA: {
    id: 'corporate_visa',
    name: 'Corporate Visa',
    category: 'work_permit',
    legalReference: 'Section 21 of the Immigration Act',
    description: 'For South African companies employing multiple foreign nationals under a single corporate visa allocation.',
    maxDuration: 'Up to 3 years (linked to employer)',
    eligibility: {
      requirements: [
        'Employer must be a South African registered company',
        'Company must apply for corporate visa allocation from DHA',
        'Individual employees must meet general immigration requirements',
        'Company must demonstrate need for foreign employees',
      ],
      disqualifiers: [
        'Company not registered in South Africa',
        'Non-compliance with previous visa conditions',
        'Individual employees not meeting basic requirements',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport for each employee', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two passport photos per employee', required: true },
      { type: 'corporate_visa_certificate', name: 'Corporate Visa Certificate', description: 'DHA-issued corporate visa certificate for the company', required: true },
      { type: 'employment_contract', name: 'Employment Contract', description: 'Individual employment contract', required: true },
      { type: 'employer_registration', name: 'Company Registration', description: 'CIPC registration and compliance documents', required: true },
    ],
    commonRejectionReasons: [
      'Company corporate visa allocation exhausted',
      'Individual does not meet requirements',
    ],
    fees: { application: 'R1520 per individual' },
  },

  BUSINESS_VISA: {
    id: 'business_visa',
    name: 'Business and Investment Visa',
    category: 'work_permit',
    legalReference: 'Section 15 of the Immigration Act',
    description: 'For foreign nationals establishing or investing in a business in South Africa.',
    maxDuration: 'Up to 3 years (renewable)',
    eligibility: {
      requirements: [
        'Minimum investment capital of ZAR 5,000,000',
        'Business must be registered with CIPC',
        'Feasibility study or business plan',
        'At least 60% of employees must be SA citizens/PRs',
        'Compliance with all applicable business legislation',
        'Recommendation from DTI (Department of Trade and Industry)',
      ],
      disqualifiers: [
        'Investment below minimum threshold',
        'Cannot demonstrate viable business plan',
        'Business not registered or non-compliant',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two recent passport-size photographs', required: true },
      { type: 'business_plan', name: 'Business Plan', description: 'Comprehensive business plan with feasibility study', required: true },
      { type: 'investment_proof', name: 'Proof of Investment Capital', description: 'Bank statements, fund transfer documents showing ZAR 5M minimum', required: true },
      { type: 'company_registration', name: 'CIPC Registration', description: 'SA company registration documents', required: true },
      { type: 'dti_recommendation', name: 'DTI Recommendation', description: 'Letter from Department of Trade, Industry and Competition', required: true },
      { type: 'financial_statements', name: 'Financial Statements', description: 'Audited financial statements (if existing business)', required: false },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Investment capital below ZAR 5,000,000',
      'Business plan not viable or insufficiently detailed',
      'Missing DTI recommendation',
      'Employee ratio requirement not met',
    ],
    fees: { application: 'R1520' },
  },

  // ============================================================
  // FAMILY AND RELATIONSHIP VISAS
  // ============================================================

  RELATIVES_VISA: {
    id: 'relatives_visa',
    name: "Relative's Visa",
    category: 'family',
    legalReference: 'Section 18 of the Immigration Act',
    description: 'For foreign nationals who are members of the immediate family of a South African citizen or permanent resident.',
    maxDuration: 'Up to 2 years (renewable)',
    eligibility: {
      requirements: [
        'Must be an immediate family member (parent, child, sibling) of SA citizen/PR',
        'Proof of family relationship',
        'SA relative must provide financial undertaking',
        'Police clearance certificate',
        'Medical and radiological reports',
      ],
      disqualifiers: [
        'Cannot prove family relationship',
        'SA relative unable to provide financial support',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two passport photos', required: true },
      { type: 'relationship_proof', name: 'Proof of Relationship', description: 'Birth certificates, marriage certificates, or adoption papers', required: true },
      { type: 'relative_id', name: 'SA Relative ID/PR Permit', description: 'Copy of SA citizen ID or permanent residence permit', required: true },
      { type: 'financial_undertaking', name: 'Financial Undertaking', description: 'Written undertaking from SA relative for financial support', required: true },
      { type: 'relative_financial_proof', name: 'Relative Financial Proof', description: 'Bank statements of SA relative showing ability to support', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Insufficient proof of family relationship',
      'SA relative cannot demonstrate financial ability',
      'Missing or expired documents',
    ],
    fees: { application: 'R1520' },
  },

  SPOUSAL_VISA: {
    id: 'spousal_visa',
    name: 'Spousal Visa',
    category: 'family',
    legalReference: 'Section 11(6) of the Immigration Act',
    description: 'For foreign nationals who are the spouse of a South African citizen or permanent resident.',
    maxDuration: 'Duration of marriage (renewable)',
    eligibility: {
      requirements: [
        'Legally married to a South African citizen or permanent resident',
        'Marriage must be recognized under South African law',
        'Proof of genuine relationship (not a marriage of convenience)',
        'SA spouse financial undertaking',
        'Police clearance certificate',
      ],
      disqualifiers: [
        'Marriage not recognized in South Africa',
        'Evidence of sham/convenience marriage',
        'Criminal record for serious offenses',
        'Previous immigration violations',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two passport photos', required: true },
      { type: 'marriage_certificate', name: 'Marriage Certificate', description: 'Unabridged marriage certificate (if married in SA) or foreign marriage certificate with apostille', required: true },
      { type: 'spouse_id', name: 'SA Spouse ID/PR Permit', description: 'Copy of SA spouse citizen ID or PR permit', required: true },
      { type: 'relationship_proof', name: 'Proof of Genuine Relationship', description: 'Photos together, communication records, joint financial accounts, cohabitation proof', required: true },
      { type: 'financial_undertaking', name: 'Spouse Financial Undertaking', description: 'Written financial support undertaking from SA spouse', required: true },
      { type: 'spouse_financial_proof', name: 'Spouse Financial Proof', description: 'Bank statements and employment records of SA spouse', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Insufficient proof of genuine relationship',
      'Marriage certificate issues (apostille, recognition)',
      'Suspected marriage of convenience',
      'Financial undertaking inadequate',
    ],
    fees: { application: 'R1520' },
  },

  LIFE_PARTNER_VISA: {
    id: 'life_partner_visa',
    name: 'Life Partner Visa',
    category: 'family',
    legalReference: 'Section 11(6) of the Immigration Act',
    description: 'For foreign nationals in a permanent life partnership with a South African citizen or permanent resident.',
    maxDuration: 'Duration of relationship (renewable)',
    eligibility: {
      requirements: [
        'In a genuine, permanent life partnership with SA citizen/PR',
        'Relationship must be proven as permanent and exclusive',
        'Notarized partnership agreement or proof of cohabitation',
        'SA partner financial undertaking',
        'Police clearance certificate',
      ],
      disqualifiers: [
        'Cannot prove genuine life partnership',
        'Partner married to another person',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Two passport photos', required: true },
      { type: 'partnership_agreement', name: 'Notarized Partnership Agreement', description: 'Notarized declaration of life partnership', required: true },
      { type: 'partner_id', name: 'SA Partner ID/PR Permit', description: 'Copy of SA partner ID or PR permit', required: true },
      { type: 'relationship_proof', name: 'Proof of Genuine Relationship', description: 'Cohabitation proof, joint accounts, photos, communication history (2+ years)', required: true },
      { type: 'financial_undertaking', name: 'Partner Financial Undertaking', description: 'Financial support declaration from SA partner', required: true },
      { type: 'partner_financial_proof', name: 'Partner Financial Proof', description: 'Bank statements of SA partner', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Insufficient evidence of genuine permanent partnership',
      'Missing notarized partnership agreement',
      'Partner financial documentation incomplete',
    ],
    fees: { application: 'R1520' },
  },

  // ============================================================
  // PERMANENT RESIDENCE PERMITS
  // ============================================================

  PR_DIRECT_RESIDENCE: {
    id: 'pr_direct_residence',
    name: 'Permanent Residence - Section 26 (Direct)',
    category: 'permanent_residence',
    legalReference: 'Section 26 of the Immigration Act',
    description: 'For foreign nationals who have held a valid work visa for 5 consecutive years and wish to apply for permanent residence.',
    maxDuration: 'Permanent',
    eligibility: {
      requirements: [
        'Held valid work visa for 5 consecutive years',
        'Currently employed in South Africa',
        'No criminal record',
        'Good character and not an undesirable person',
        'Certified qualifications',
      ],
      disqualifiers: [
        'Gap in work visa validity',
        'Criminal record',
        'Listed as undesirable person',
        'Currently unemployed',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Four passport photos', required: true },
      { type: 'work_visa_history', name: 'Work Visa History', description: 'Copies of all work visas held for 5+ years', required: true },
      { type: 'employment_confirmation', name: 'Current Employment Confirmation', description: 'Letter from current employer confirming ongoing employment', required: true },
      { type: 'qualifications', name: 'Qualifications', description: 'Certified copies of qualifications', required: true },
      { type: 'saqa_evaluation', name: 'SAQA Evaluation', description: 'SAQA evaluation of qualifications', required: true },
      { type: 'police_clearance', name: 'Police Clearance Certificate', description: 'From SA and country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
      { type: 'good_character', name: 'Good Character Declaration', description: 'Sworn affidavit of good character', required: true },
    ],
    commonRejectionReasons: [
      'Gap in work visa continuity',
      'Incomplete 5-year work visa history',
      'Criminal record discovered',
    ],
    fees: { application: 'R1520' },
  },

  PR_WORK_BASED: {
    id: 'pr_work_based',
    name: 'Permanent Residence - Section 27(b) (Work)',
    category: 'permanent_residence',
    legalReference: 'Section 27(b) of the Immigration Act',
    description: 'For foreign nationals with an offer of permanent employment in South Africa.',
    maxDuration: 'Permanent',
    eligibility: {
      requirements: [
        'Offer of permanent employment from SA employer',
        'SAQA-evaluated qualifications',
        'Department of Labour certification',
        'Police clearance',
        'Good character',
      ],
      disqualifiers: [
        'No permanent employment offer',
        'Qualifications not recognized',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Four passport photos', required: true },
      { type: 'employment_offer', name: 'Permanent Employment Offer', description: 'Written offer of permanent employment', required: true },
      { type: 'employment_contract', name: 'Employment Contract', description: 'Signed permanent employment contract', required: true },
      { type: 'dol_certificate', name: 'DOL Certificate', description: 'Department of Labour certification', required: true },
      { type: 'saqa_evaluation', name: 'SAQA Evaluation', description: 'Qualification evaluation', required: true },
      { type: 'qualifications', name: 'Qualifications', description: 'Certified qualification copies', required: true },
      { type: 'employer_registration', name: 'Employer Registration', description: 'CIPC and tax compliance of employer', required: true },
      { type: 'police_clearance', name: 'Police Clearance', description: 'SA and country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Employment offer not genuinely permanent',
      'DOL certification not obtained',
      'Qualification issues',
    ],
    fees: { application: 'R1520' },
  },

  PR_BUSINESS_BASED: {
    id: 'pr_business_based',
    name: 'Permanent Residence - Section 27(c) (Business)',
    category: 'permanent_residence',
    legalReference: 'Section 27(c) of the Immigration Act',
    description: 'For foreign nationals who have established a business in South Africa meeting prescribed requirements.',
    maxDuration: 'Permanent',
    eligibility: {
      requirements: [
        'Established business in South Africa for at least 5 years',
        'Minimum investment of ZAR 5,000,000',
        'At least 60% SA citizen/PR employees',
        'Business compliant with all laws',
        'Good character',
      ],
      disqualifiers: [
        'Business less than 5 years old',
        'Investment below threshold',
        'Non-compliance with employment requirements',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Four passport photos', required: true },
      { type: 'business_registration', name: 'Business Registration', description: 'CIPC registration (5+ years)', required: true },
      { type: 'financial_statements', name: 'Audited Financial Statements', description: '5 years of audited financials', required: true },
      { type: 'investment_proof', name: 'Investment Proof', description: 'Proof of ZAR 5M+ investment', required: true },
      { type: 'employee_records', name: 'Employee Records', description: 'Proof of 60%+ SA citizen/PR employees', required: true },
      { type: 'tax_compliance', name: 'SARS Tax Clearance', description: 'Tax compliance certificate from SARS', required: true },
      { type: 'police_clearance', name: 'Police Clearance', description: 'SA and country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Business history insufficient',
      'Investment threshold not met',
      'Employee ratio non-compliant',
    ],
    fees: { application: 'R1520' },
  },

  PR_FINANCIALLY_INDEPENDENT: {
    id: 'pr_financially_independent',
    name: 'Permanent Residence - Section 27(d) (Financially Independent)',
    category: 'permanent_residence',
    legalReference: 'Section 27(d) of the Immigration Act',
    description: 'For financially independent foreign nationals who can demonstrate a prescribed net worth.',
    maxDuration: 'Permanent',
    eligibility: {
      requirements: [
        'Proven net worth of ZAR 12,000,000 or more',
        'Funds must be available in South Africa',
        'Good character with no criminal record',
        'Medical and radiological clearance',
      ],
      disqualifiers: [
        'Net worth below ZAR 12,000,000',
        'Cannot demonstrate fund availability in SA',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Four passport photos', required: true },
      { type: 'net_worth_proof', name: 'Proof of Net Worth', description: 'Certified asset statements, property valuations, investment portfolios totaling ZAR 12M+', required: true },
      { type: 'sa_bank_proof', name: 'SA Bank Proof', description: 'Proof of funds accessible in South Africa', required: true },
      { type: 'financial_statements', name: 'Financial Statements', description: 'Personal or business financial statements', required: true },
      { type: 'police_clearance', name: 'Police Clearance', description: 'SA and country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Net worth below ZAR 12,000,000',
      'Funds not demonstrably available in SA',
      'Documentation insufficient or unverifiable',
    ],
    fees: { application: 'R1520' },
  },

  PR_EXTRAORDINARY_SKILLS: {
    id: 'pr_extraordinary_skills',
    name: 'Permanent Residence - Extraordinary Skills',
    category: 'permanent_residence',
    legalReference: 'Section 27(e) of the Immigration Act',
    description: 'For foreign nationals with extraordinary skills or qualifications in a field of expertise.',
    maxDuration: 'Permanent',
    eligibility: {
      requirements: [
        'Extraordinary skills, qualifications, or expertise',
        'Endorsed by a recognized body in the field',
        'Contribution to South Africa through skills',
        'Good character',
      ],
      disqualifiers: [
        'Skills not recognized as extraordinary',
        'No endorsement from relevant body',
        'Criminal record',
      ],
    },
    requiredDocuments: [
      { type: 'passport', name: 'Valid Passport', description: 'Valid passport', required: true },
      { type: 'photo', name: 'Passport Photos', description: 'Four passport photos', required: true },
      { type: 'endorsement_letter', name: 'Endorsement Letter', description: 'Letter from recognized organization endorsing extraordinary skills', required: true },
      { type: 'qualifications', name: 'Qualifications', description: 'All relevant qualifications and certifications', required: true },
      { type: 'achievements_proof', name: 'Proof of Achievements', description: 'Awards, publications, patents, or other proof of extraordinary ability', required: true },
      { type: 'police_clearance', name: 'Police Clearance', description: 'SA and country of origin', required: true },
      { type: 'medical_report', name: 'Medical Report', description: 'Medical examination report', required: true },
      { type: 'radiological_report', name: 'Radiological Report', description: 'Chest X-ray report', required: true },
    ],
    commonRejectionReasons: [
      'Skills not deemed extraordinary by DHA standards',
      'Insufficient endorsement',
      'Weak evidence of contribution to SA',
    ],
    fees: { application: 'R1520' },
  },

  REFUGEE_ASYLUM: {
    id: 'refugee_asylum',
    name: 'Refugee and Asylum Seeker (Intake Guidance)',
    category: 'refugee',
    legalReference: 'Refugees Act 130 of 1998',
    description: 'Guidance for foreign nationals seeking refugee status or asylum in South Africa. Senzwa provides intake guidance only—applications are processed through Refugee Reception Offices.',
    maxDuration: 'As determined by RSDO',
    eligibility: {
      requirements: [
        'Must be in South Africa',
        'Must apply at a Refugee Reception Office',
        'Must demonstrate well-founded fear of persecution',
        'Must not be excludable under Section 4 of the Refugees Act',
      ],
      disqualifiers: [
        'Committed a crime against peace, war crime, or crime against humanity',
        'Committed a serious non-political crime outside SA',
        'Guilty of acts contrary to the purposes of the UN/OAU',
      ],
    },
    requiredDocuments: [
      { type: 'identity_document', name: 'Any Identity Document', description: 'Passport, ID, or any identifying document available', required: false },
      { type: 'persecution_statement', name: 'Statement of Persecution', description: 'Written or verbal account of persecution or fear', required: true },
      { type: 'country_evidence', name: 'Country of Origin Evidence', description: 'Any evidence supporting claims about country conditions', required: false },
    ],
    commonRejectionReasons: [
      'Failure to demonstrate well-founded fear of persecution',
      'Application deemed manifestly unfounded',
      'Exclusion under Section 4',
    ],
    fees: { application: 'No fee' },
    notes: 'Senzwa provides intake guidance and preparation assistance only. Formal asylum applications must be made in person at a Refugee Reception Office.',
  },
};

// Category groupings for UI display
const VISA_GROUPS = [
  {
    id: 'temporary_residence',
    name: 'Temporary Residence Visas',
    description: 'Visas for temporary stays in South Africa',
    categories: ['visitor_tourism', 'visitor_business', 'visitor_family', 'study_visa', 'medical_treatment', 'remote_work', 'retired_person', 'exchange_visa'],
  },
  {
    id: 'work_permit',
    name: 'Work and Business Permits',
    description: 'Visas for employment and business activities in South Africa',
    categories: ['general_work', 'critical_skills', 'intra_company_transfer', 'corporate_visa', 'business_visa'],
  },
  {
    id: 'family',
    name: 'Family and Relationship Visas',
    description: 'Visas based on family ties to South African citizens or permanent residents',
    categories: ['relatives_visa', 'spousal_visa', 'life_partner_visa'],
  },
  {
    id: 'permanent_residence',
    name: 'Permanent Residence Permits',
    description: 'Permits for permanent residence in South Africa',
    categories: ['pr_direct_residence', 'pr_work_based', 'pr_business_based', 'pr_financially_independent', 'pr_extraordinary_skills'],
  },
  {
    id: 'refugee',
    name: 'Refugee and Asylum',
    description: 'Guidance for refugee and asylum seekers',
    categories: ['refugee_asylum'],
  },
];

module.exports = { VISA_CATEGORIES, VISA_GROUPS };

/**
 * Country-Specific Immigration Requirements for South Africa
 *
 * Includes:
 * - Visa exemption status by nationality
 * - Yellow fever certificate requirements
 * - Document apostille/legalization requirements
 * - Language of documents requirements
 * - Additional country-specific considerations
 *
 * Based on DHA directives and bilateral agreements
 */

const VISA_EXEMPT_COUNTRIES = {
  // Countries whose nationals do NOT need a visa for visits up to 90 days
  exempt_90_days: [
    'Argentina', 'Australia', 'Austria', 'Belgium', 'Botswana', 'Brazil',
    'Canada', 'Chile', 'Czech Republic', 'Denmark', 'Ecuador', 'Finland',
    'France', 'Germany', 'Greece', 'Iceland', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Liechtenstein', 'Luxembourg', 'Malawi', 'Malaysia',
    'Mauritius', 'Monaco', 'Mozambique', 'Namibia', 'Netherlands',
    'New Zealand', 'Norway', 'Panama', 'Paraguay', 'Peru', 'Portugal',
    'Singapore', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
    'Tanzania', 'Thailand', 'Trinidad and Tobago', 'Turkey', 'Uganda',
    'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Zambia', 'Zimbabwe',
  ],

  // Countries whose nationals do NOT need a visa for visits up to 30 days
  exempt_30_days: [
    'Angola', 'Benin', 'Cuba', 'Eswatini', 'Gabon', 'Haiti',
    'Hong Kong', 'Kenya', 'Lesotho', 'Seychelles', 'Taiwan',
  ],

  // BRICS partner special arrangements
  brics_special: [
    'Brazil', 'Russia', 'India', 'China', 'South Africa',
  ],

  // SADC member states with special movement protocols
  sadc_members: [
    'Angola', 'Botswana', 'Comoros', 'Democratic Republic of Congo', 'Eswatini',
    'Lesotho', 'Madagascar', 'Malawi', 'Mauritius', 'Mozambique', 'Namibia',
    'Seychelles', 'South Africa', 'Tanzania', 'Zambia', 'Zimbabwe',
  ],
};

const YELLOW_FEVER_COUNTRIES = {
  // Countries from which travelers MUST present yellow fever vaccination certificate
  required: [
    'Angola', 'Argentina', 'Benin', 'Bolivia', 'Brazil', 'Burkina Faso',
    'Burundi', 'Cameroon', 'Central African Republic', 'Chad', 'Colombia',
    'Congo (Brazzaville)', 'Democratic Republic of Congo', 'Ecuador',
    'Equatorial Guinea', 'Ethiopia', 'French Guiana', 'Gabon', 'Gambia',
    'Ghana', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Ivory Coast', 'Kenya',
    'Liberia', 'Mali', 'Mauritania', 'Niger', 'Nigeria', 'Panama',
    'Paraguay', 'Peru', 'Rwanda', 'Senegal', 'Sierra Leone', 'Somalia',
    'South Sudan', 'Sudan', 'Suriname', 'Togo', 'Trinidad and Tobago',
    'Uganda', 'Venezuela',
  ],
  // Also required if transiting through these countries
  transitRequirement: true,
  certificateValidity: 'Lifetime (since 2016 WHO update)',
  notes: 'Must be vaccinated at least 10 days before arrival. Original certificate required.',
};

const DOCUMENT_LEGALIZATION = {
  // Countries party to the Hague Apostille Convention - apostille is sufficient
  apostilleCountries: [
    'Albania', 'Andorra', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Barbados', 'Belarus', 'Belgium',
    'Belize', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
    'Brunei', 'Bulgaria', 'Burundi', 'Canada', 'Chile', 'China', 'Colombia',
    'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic',
    'Ecuador', 'El Salvador', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Guatemala', 'Honduras', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lesotho', 'Liberia',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malawi', 'Malta', 'Mauritius',
    'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Namibia', 'Netherlands', 'New Zealand', 'Nicaragua',
    'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
    'Russia', 'Rwanda', 'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
    'Spain', 'Suriname', 'Sweden', 'Switzerland', 'Tajikistan', 'Tunisia',
    'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam',
  ],

  // Non-apostille countries require full embassy legalization chain
  legalizationProcess: {
    apostille: 'Document must be apostilled by competent authority in country of origin',
    nonApostille: 'Document must be authenticated by the Ministry of Foreign Affairs, then legalized by the South African Embassy/Consulate in the country of origin',
  },
};

const COUNTRY_SPECIFIC_NOTES = {
  Zimbabwe: {
    specialDispensation: 'Zimbabwe Exemption Permit (ZEP) holders may apply for alternative visas',
    notes: 'Large diaspora community in SA. Specific DHA directives may apply.',
    commonVisaTypes: ['general_work', 'relatives_visa', 'spousal_visa', 'pr_direct_residence'],
  },
  Mozambique: {
    specialDispensation: 'Mozambican nationals may enter SA without visa for up to 30 days',
    notes: 'Cross-border movement agreement. Special border post arrangements at Lebombo/Komatipoort.',
    commonVisaTypes: ['visitor_tourism', 'general_work', 'relatives_visa'],
  },
  Lesotho: {
    specialDispensation: 'Lesotho Special Permit (LSP) programme',
    notes: 'Enclave country with special bilateral arrangements. ID accepted at border for short visits.',
    commonVisaTypes: ['visitor_tourism', 'general_work', 'study_visa'],
  },
  Nigeria: {
    notes: 'Visa required for all visit types. Additional scrutiny on financial documentation.',
    additionalRequirements: ['Detailed bank statements (6 months)', 'Employment letter', 'Travel history evidence'],
    commonVisaTypes: ['visitor_business', 'study_visa', 'critical_skills'],
  },
  India: {
    notes: 'Visa required. Large skilled worker community in SA. BRICS partner nation.',
    additionalRequirements: ['PCC from Indian Passport Office (not police station)'],
    commonVisaTypes: ['critical_skills', 'intra_company_transfer', 'business_visa', 'study_visa'],
  },
  China: {
    notes: 'Visa required. BRICS partner. Significant business community. Documents require sworn translation.',
    additionalRequirements: ['Documents must be translated by sworn translator', 'PCC from Chinese public security bureau'],
    commonVisaTypes: ['business_visa', 'intra_company_transfer', 'general_work'],
  },
  Pakistan: {
    notes: 'Visa required for all categories. Additional security screening may apply.',
    additionalRequirements: ['Detailed travel history', 'Additional background documentation'],
    commonVisaTypes: ['study_visa', 'general_work', 'visitor_family'],
  },
  Bangladesh: {
    notes: 'Visa required. Processing may take longer. Complete documentation essential.',
    additionalRequirements: ['All documents require notarization and embassy attestation'],
    commonVisaTypes: ['study_visa', 'general_work'],
  },
  'United Kingdom': {
    notes: 'Visa exempt for 90 days. Strong bilateral ties. Documents accepted in English without translation.',
    documentLanguage: 'English accepted',
    commonVisaTypes: ['remote_work', 'retired_person', 'business_visa', 'critical_skills'],
  },
  'United States': {
    notes: 'Visa exempt for 90 days. Documents accepted in English. FBI background check accepted as police clearance.',
    documentLanguage: 'English accepted',
    commonVisaTypes: ['remote_work', 'retired_person', 'business_visa', 'critical_skills'],
  },
  Germany: {
    notes: 'Visa exempt for 90 days. Documents must be translated to English by sworn translator.',
    documentLanguage: 'Sworn English translation required',
    commonVisaTypes: ['remote_work', 'business_visa', 'intra_company_transfer', 'study_visa'],
  },
  Ethiopia: {
    notes: 'Visa required. Growing community in SA. Refugee/asylum applications common.',
    commonVisaTypes: ['study_visa', 'visitor_family', 'refugee_asylum'],
  },
  DRC: {
    notes: 'Visa required. Significant asylum seeker population. French documents require translation.',
    additionalRequirements: ['French documents require sworn English translation'],
    documentLanguage: 'Sworn English translation required',
    commonVisaTypes: ['refugee_asylum', 'study_visa', 'visitor_family'],
  },
  Somalia: {
    notes: 'Visa required. Many applicants through refugee/asylum pathway. Documentation challenges recognized.',
    commonVisaTypes: ['refugee_asylum'],
  },
};

const PROCESSING_TIMES = {
  visitor_tourism: { standard: '5-10 working days', expedited: '3-5 working days', notes: 'Apply at least 4 weeks before travel' },
  visitor_business: { standard: '5-10 working days', expedited: '3-5 working days', notes: 'Apply at least 4 weeks before travel' },
  visitor_family: { standard: '5-10 working days', expedited: '3-5 working days', notes: 'Apply at least 4 weeks before travel' },
  study_visa: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Apply at least 3 months before semester start' },
  medical_treatment: { standard: '2-4 weeks', expedited: '1-2 weeks (emergency cases)', notes: 'Emergency cases may be expedited with medical evidence' },
  remote_work: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Relatively new category - processing may vary' },
  retired_person: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Financial verification may add time' },
  exchange_visa: { standard: '4-6 weeks', expedited: 'Not available', notes: 'Depends on program verification' },
  general_work: { standard: '8-12 weeks', expedited: 'Not available', notes: 'DOL recommendation adds 4-6 weeks' },
  critical_skills: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Professional body registration may add time' },
  intra_company_transfer: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Company documentation verification required' },
  corporate_visa: { standard: '8-12 weeks', expedited: 'Not available', notes: 'Initial company application takes longer' },
  business_visa: { standard: '8-12 weeks', expedited: 'Not available', notes: 'DTI recommendation adds processing time' },
  relatives_visa: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Relationship verification may add time' },
  spousal_visa: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Interview may be required to verify relationship' },
  life_partner_visa: { standard: '4-8 weeks', expedited: 'Not available', notes: 'Extensive relationship evidence required' },
  pr_direct_residence: { standard: '8-24 months', expedited: 'Not available', notes: 'PR applications have significant backlogs' },
  pr_work_based: { standard: '8-24 months', expedited: 'Not available', notes: 'PR applications have significant backlogs' },
  pr_business_based: { standard: '8-24 months', expedited: 'Not available', notes: 'Requires business verification and DTI assessment' },
  pr_financially_independent: { standard: '8-24 months', expedited: 'Not available', notes: 'Financial verification intensive' },
  pr_extraordinary_skills: { standard: '8-24 months', expedited: 'Not available', notes: 'Endorsement verification required' },
  refugee_asylum: { standard: 'Variable (months to years)', expedited: 'Not applicable', notes: 'Processed by Refugee Status Determination Officer (RSDO)' },
};

const FEE_SCHEDULE = {
  visitor_visa: { amount: 0, currency: 'ZAR', notes: 'Free for most nationalities. Some require payment - consult DHA fee schedule.' },
  temporary_residence: { amount: 1520, currency: 'ZAR', notes: 'Standard application fee for all temporary residence permits (Study, Work, Business, etc.)' },
  permanent_residence: { amount: 1520, currency: 'ZAR', notes: 'Application fee for all permanent residence categories' },
  appeal: { amount: 1520, currency: 'ZAR', notes: 'Appeal fee for rejected applications' },
  vfs_service_fee: { amount: 1350, currency: 'ZAR', notes: 'VFS Global service fee (may vary by location). Separate from DHA application fee.' },
  premium_lounge: { amount: 800, currency: 'ZAR', notes: 'Optional VFS premium lounge service' },
  courier: { amount: 250, currency: 'ZAR', notes: 'Optional courier delivery of passport/documents' },
  sms_tracking: { amount: 60, currency: 'ZAR', notes: 'Optional SMS tracking notifications from VFS' },
  saqa_evaluation: { amount: 1080, currency: 'ZAR', notes: 'SAQA foreign qualification evaluation fee' },
  police_clearance_sa: { amount: 91, currency: 'ZAR', notes: 'SAPS police clearance certificate fee' },
};

const DHA_OFFICES = [
  // VFS Global Application Centres (Primary submission points for foreign nationals outside SA)
  {
    type: 'vfs_centre',
    name: 'VFS Global - Pretoria',
    address: 'Corner of Sisulu and Lilian Ngoyi Streets, Pretoria Central',
    province: 'Gauteng',
    operatingHours: 'Mon-Fri: 08:00 - 15:00',
    services: ['Visa applications', 'Biometrics', 'Document submission', 'Passport collection'],
    notes: 'Main processing centre for applications from within South Africa',
  },
  {
    type: 'vfs_centre',
    name: 'VFS Global - Johannesburg (Sandton)',
    address: 'Rivonia Road, Sandton, Johannesburg',
    province: 'Gauteng',
    operatingHours: 'Mon-Fri: 08:00 - 15:00',
    services: ['Visa applications', 'Biometrics', 'Document submission'],
    notes: 'Serves Johannesburg North metropolitan area',
  },
  {
    type: 'vfs_centre',
    name: 'VFS Global - Cape Town',
    address: 'Foreshore, Cape Town CBD',
    province: 'Western Cape',
    operatingHours: 'Mon-Fri: 08:00 - 15:00',
    services: ['Visa applications', 'Biometrics', 'Document submission'],
    notes: 'Serves Western Cape region',
  },
  {
    type: 'vfs_centre',
    name: 'VFS Global - Durban',
    address: 'Umhlanga Ridge, Durban',
    province: 'KwaZulu-Natal',
    operatingHours: 'Mon-Fri: 08:00 - 15:00',
    services: ['Visa applications', 'Biometrics', 'Document submission'],
    notes: 'Serves KwaZulu-Natal region',
  },

  // Department of Home Affairs Main Offices
  {
    type: 'dha_office',
    name: 'DHA Head Office - Pretoria',
    address: '230 Johannes Ramokhoase Street, Pretoria',
    province: 'Gauteng',
    operatingHours: 'Mon-Fri: 08:00 - 15:30',
    services: ['Policy inquiries', 'Appeals', 'Permanent residence collection'],
    notes: 'National head office - administrative functions',
  },
  {
    type: 'dha_office',
    name: 'DHA Regional Office - Johannesburg',
    address: 'Harrison Street, Johannesburg CBD',
    province: 'Gauteng',
    operatingHours: 'Mon-Fri: 08:00 - 15:30',
    services: ['Permit renewals', 'Status inquiries', 'Collection'],
    notes: 'Largest regional office by volume',
  },
  {
    type: 'dha_office',
    name: 'DHA Regional Office - Cape Town',
    address: '56 Barrack Street, Cape Town',
    province: 'Western Cape',
    operatingHours: 'Mon-Fri: 08:00 - 15:30',
    services: ['Permit renewals', 'Status inquiries', 'Collection'],
    notes: 'Serves Western Cape region',
  },
  {
    type: 'dha_office',
    name: 'DHA Regional Office - Durban',
    address: 'Dr Pixley KaSeme Street, Durban',
    province: 'KwaZulu-Natal',
    operatingHours: 'Mon-Fri: 08:00 - 15:30',
    services: ['Permit renewals', 'Status inquiries', 'Collection'],
    notes: 'Serves KwaZulu-Natal region',
  },

  // Refugee Reception Offices
  {
    type: 'refugee_office',
    name: 'Refugee Reception Office - Pretoria (Marabastad)',
    address: 'Marabastad, Pretoria',
    province: 'Gauteng',
    operatingHours: 'Mon-Fri: 07:00 - 15:30',
    services: ['Asylum applications', 'Refugee permit renewals', 'RSDO interviews'],
    notes: 'Primary refugee reception office for Gauteng',
  },
  {
    type: 'refugee_office',
    name: 'Refugee Reception Office - Musina',
    address: 'Musina, Limpopo',
    province: 'Limpopo',
    operatingHours: 'Mon-Fri: 07:00 - 15:30',
    services: ['Asylum applications', 'Border-area refugee processing'],
    notes: 'Near Zimbabwe border - processes many cross-border asylum claims',
  },
  {
    type: 'refugee_office',
    name: 'Refugee Reception Office - Durban',
    address: 'Durban CBD',
    province: 'KwaZulu-Natal',
    operatingHours: 'Mon-Fri: 07:00 - 15:30',
    services: ['Asylum applications', 'Refugee permit renewals'],
    notes: 'Serves KwaZulu-Natal asylum seekers',
  },
];

const PROFESSIONAL_BODIES = {
  ECSA: { name: 'Engineering Council of South Africa', website: 'https://www.ecsa.co.za', registrationTime: '4-8 weeks', fields: ['All engineering disciplines'] },
  HPCSA: { name: 'Health Professions Council of South Africa', website: 'https://www.hpcsa.co.za', registrationTime: '8-16 weeks', fields: ['Medical practitioners', 'Dentists', 'Psychologists', 'Physiotherapists', 'Optometrists'] },
  SANC: { name: 'South African Nursing Council', website: 'https://www.sanc.co.za', registrationTime: '4-8 weeks', fields: ['Registered nurses', 'Enrolled nurses', 'Nursing auxiliaries'] },
  SAICA: { name: 'South African Institute of Chartered Accountants', website: 'https://www.saica.co.za', registrationTime: '4-6 weeks', fields: ['Chartered accountants', 'Auditors'] },
  SACNASP: { name: 'South African Council for Natural Scientific Professions', website: 'https://www.sacnasp.org.za', registrationTime: '4-8 weeks', fields: ['Natural scientists', 'Geologists', 'Biologists', 'Environmental scientists'] },
  SACAP: { name: 'South African Council for the Architectural Profession', website: 'https://www.sacapsa.com', registrationTime: '6-12 weeks', fields: ['Architects', 'Senior architectural technologists'] },
  SACE: { name: 'South African Council for Educators', website: 'https://www.sace.org.za', registrationTime: '4-8 weeks', fields: ['Teachers', 'Lecturers', 'Educational specialists'] },
  LPC: { name: 'Legal Practice Council', website: 'https://www.lpc.org.za', registrationTime: '8-16 weeks', fields: ['Attorneys', 'Advocates'] },
  SAPC: { name: 'South African Pharmacy Council', website: 'https://www.sapc.za.org', registrationTime: '8-12 weeks', fields: ['Pharmacists', 'Pharmacy technicians'] },
  IITPSA: { name: 'Institute of Information Technology Professionals South Africa', website: 'https://www.iitpsa.org.za', registrationTime: '2-4 weeks', fields: ['IT professionals', 'Software developers', 'Data scientists'] },
  ASSA: { name: 'Actuarial Society of South Africa', website: 'https://www.actuarialsociety.org.za', registrationTime: '4-6 weeks', fields: ['Actuaries'] },
  SAVC: { name: 'South African Veterinary Council', website: 'https://www.savc.org.za', registrationTime: '8-12 weeks', fields: ['Veterinarians', 'Veterinary nurses'] },
  SACQSP: { name: 'South African Council for the Quantity Surveying Profession', website: 'https://www.sacqsp.co.za', registrationTime: '4-8 weeks', fields: ['Quantity surveyors'] },
};

module.exports = {
  VISA_EXEMPT_COUNTRIES,
  YELLOW_FEVER_COUNTRIES,
  DOCUMENT_LEGALIZATION,
  COUNTRY_SPECIFIC_NOTES,
  PROCESSING_TIMES,
  FEE_SCHEDULE,
  DHA_OFFICES,
  PROFESSIONAL_BODIES,
};

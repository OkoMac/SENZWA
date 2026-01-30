/**
 * South Africa Critical Skills List
 * Based on Government Gazette No. 37716 and subsequent amendments
 *
 * This list defines occupations in critical demand in South Africa.
 * Foreign nationals with these skills may apply for a Critical Skills Work Visa
 * under Section 19(4) of the Immigration Act.
 *
 * Last updated: January 2026
 */

const CRITICAL_SKILLS_LIST = [
  // ============================================================
  // ENGINEERING
  // ============================================================
  {
    category: 'Engineering',
    skills: [
      { ofoCode: '2142.01', title: 'Civil Engineer', qualificationRequired: "Bachelor's Degree in Civil Engineering (NQF 7+)", professionalBody: 'ECSA (Engineering Council of South Africa)', minExperience: '3 years post-qualification' },
      { ofoCode: '2142.02', title: 'Structural Engineer', qualificationRequired: "Bachelor's Degree in Civil/Structural Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2143.01', title: 'Environmental Engineer', qualificationRequired: "Bachelor's Degree in Environmental Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2144.01', title: 'Mechanical Engineer', qualificationRequired: "Bachelor's Degree in Mechanical Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2145.01', title: 'Chemical Engineer', qualificationRequired: "Bachelor's Degree in Chemical Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2146.01', title: 'Mining Engineer', qualificationRequired: "Bachelor's Degree in Mining Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2146.02', title: 'Metallurgical Engineer', qualificationRequired: "Bachelor's Degree in Metallurgical Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2151.01', title: 'Electrical Engineer', qualificationRequired: "Bachelor's Degree in Electrical Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2152.01', title: 'Electronics Engineer', qualificationRequired: "Bachelor's Degree in Electronic Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2153.01', title: 'Telecommunications Engineer', qualificationRequired: "Bachelor's Degree in Telecommunications Engineering (NQF 7+)", professionalBody: 'ECSA / ICASA', minExperience: '3 years' },
      { ofoCode: '2141.01', title: 'Industrial Engineer', qualificationRequired: "Bachelor's Degree in Industrial Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2149.01', title: 'Aeronautical Engineer', qualificationRequired: "Bachelor's Degree in Aeronautical Engineering (NQF 7+)", professionalBody: 'ECSA / SACAA', minExperience: '3 years' },
      { ofoCode: '2149.02', title: 'Agricultural Engineer', qualificationRequired: "Bachelor's Degree in Agricultural Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '3 years' },
      { ofoCode: '2149.03', title: 'Biomedical Engineer', qualificationRequired: "Bachelor's Degree in Biomedical Engineering (NQF 7+)", professionalBody: 'ECSA / HPCSA', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // INFORMATION AND COMMUNICATIONS TECHNOLOGY
  // ============================================================
  {
    category: 'Information and Communications Technology',
    skills: [
      { ofoCode: '2511.01', title: 'ICT Systems Analyst', qualificationRequired: "Bachelor's Degree in Information Technology/Computer Science (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2512.01', title: 'Software Developer', qualificationRequired: "Bachelor's Degree in Computer Science/Software Engineering (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2513.01', title: 'Web Developer', qualificationRequired: "Bachelor's Degree in Information Technology (NQF 7+) or equivalent portfolio", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2514.01', title: 'Application Programmer', qualificationRequired: "Bachelor's Degree in Computer Science (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2521.01', title: 'Database Designer and Administrator', qualificationRequired: "Bachelor's Degree in Information Technology (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2522.01', title: 'Systems Administrator', qualificationRequired: "Bachelor's Degree in IT/Computer Science (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2523.01', title: 'Network Analyst', qualificationRequired: "Bachelor's Degree in IT/Networking (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2529.01', title: 'ICT Security Specialist', qualificationRequired: "Bachelor's Degree in Cybersecurity/IT (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
      { ofoCode: '2529.02', title: 'Data Scientist', qualificationRequired: "Master's Degree in Data Science/Statistics/Computer Science (NQF 9+)", professionalBody: 'IITPSA / SASA', minExperience: '2 years' },
      { ofoCode: '2529.03', title: 'Artificial Intelligence Specialist', qualificationRequired: "Master's Degree in AI/Machine Learning/Computer Science (NQF 9+)", professionalBody: 'IITPSA', minExperience: '2 years' },
      { ofoCode: '2529.04', title: 'Cloud Computing Architect', qualificationRequired: "Bachelor's Degree in IT (NQF 7+) + cloud certifications", professionalBody: 'IITPSA', minExperience: '5 years' },
      { ofoCode: '2529.05', title: 'DevOps Engineer', qualificationRequired: "Bachelor's Degree in IT/Computer Science (NQF 7+)", professionalBody: 'IITPSA', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // HEALTH AND MEDICAL
  // ============================================================
  {
    category: 'Health and Medical Sciences',
    skills: [
      { ofoCode: '2211.01', title: 'General Medical Practitioner', qualificationRequired: 'MBChB or equivalent medical degree (NQF 8+)', professionalBody: 'HPCSA (Health Professions Council of SA)', minExperience: '2 years post-internship' },
      { ofoCode: '2212.01', title: 'Specialist Medical Practitioner', qualificationRequired: 'Medical degree + specialist qualification (NQF 9+)', professionalBody: 'HPCSA', minExperience: 'Completed specialist registrar program' },
      { ofoCode: '2212.02', title: 'Surgeon', qualificationRequired: 'Medical degree + Fellowship in Surgery', professionalBody: 'HPCSA / CMSA', minExperience: '5 years post-fellowship' },
      { ofoCode: '2212.03', title: 'Anaesthetist', qualificationRequired: 'Medical degree + Fellowship in Anaesthesia', professionalBody: 'HPCSA / SASA', minExperience: '3 years' },
      { ofoCode: '2212.04', title: 'Cardiologist', qualificationRequired: 'Medical degree + cardiology sub-specialty', professionalBody: 'HPCSA', minExperience: '3 years' },
      { ofoCode: '2212.05', title: 'Psychiatrist', qualificationRequired: 'Medical degree + psychiatry qualification', professionalBody: 'HPCSA', minExperience: '3 years' },
      { ofoCode: '2212.06', title: 'Radiologist', qualificationRequired: 'Medical degree + radiology qualification', professionalBody: 'HPCSA', minExperience: '3 years' },
      { ofoCode: '2212.07', title: 'Oncologist', qualificationRequired: 'Medical degree + oncology qualification', professionalBody: 'HPCSA', minExperience: '3 years' },
      { ofoCode: '2261.01', title: 'Dentist', qualificationRequired: 'BChD or equivalent dental degree (NQF 8+)', professionalBody: 'HPCSA', minExperience: '1 year community service completed' },
      { ofoCode: '2262.01', title: 'Pharmacist', qualificationRequired: 'BPharm degree (NQF 8+)', professionalBody: 'SAPC (SA Pharmacy Council)', minExperience: '1 year internship completed' },
      { ofoCode: '2264.01', title: 'Physiotherapist', qualificationRequired: "Bachelor's Degree in Physiotherapy (NQF 8+)", professionalBody: 'HPCSA', minExperience: '1 year community service' },
      { ofoCode: '2265.01', title: 'Occupational Therapist', qualificationRequired: "Bachelor's Degree in Occupational Therapy (NQF 8+)", professionalBody: 'HPCSA', minExperience: '1 year community service' },
      { ofoCode: '2266.01', title: 'Audiologist', qualificationRequired: "Bachelor's Degree in Audiology (NQF 8+)", professionalBody: 'HPCSA', minExperience: '1 year community service' },
      { ofoCode: '2267.01', title: 'Optometrist', qualificationRequired: "Bachelor's Degree in Optometry (NQF 8+)", professionalBody: 'HPCSA', minExperience: '1 year community service' },
      { ofoCode: '2221.01', title: 'Registered Nurse (Specialist)', qualificationRequired: "Bachelor's Degree in Nursing (NQF 8+) + specialization", professionalBody: 'SANC (SA Nursing Council)', minExperience: '3 years post-qualification' },
    ],
  },

  // ============================================================
  // NATURAL AND PHYSICAL SCIENCES
  // ============================================================
  {
    category: 'Natural and Physical Sciences',
    skills: [
      { ofoCode: '2111.01', title: 'Physicist', qualificationRequired: "Master's Degree in Physics (NQF 9+)", professionalBody: 'SAIP', minExperience: '3 years research' },
      { ofoCode: '2112.01', title: 'Meteorologist', qualificationRequired: "Master's Degree in Meteorology/Atmospheric Science (NQF 9+)", professionalBody: 'SAWS', minExperience: '3 years' },
      { ofoCode: '2113.01', title: 'Chemist', qualificationRequired: "Master's Degree in Chemistry (NQF 9+)", professionalBody: 'SACI', minExperience: '3 years' },
      { ofoCode: '2114.01', title: 'Geologist', qualificationRequired: "Bachelor's Degree in Geology (NQF 7+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2114.02', title: 'Geophysicist', qualificationRequired: "Master's Degree in Geophysics (NQF 9+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2131.01', title: 'Biologist', qualificationRequired: "Master's Degree in Biological Sciences (NQF 9+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2131.02', title: 'Biotechnologist', qualificationRequired: "Master's Degree in Biotechnology (NQF 9+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2131.03', title: 'Microbiologist', qualificationRequired: "Master's Degree in Microbiology (NQF 9+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2133.01', title: 'Environmental Scientist', qualificationRequired: "Bachelor's Degree in Environmental Science (NQF 7+)", professionalBody: 'SACNASP', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // FINANCE AND ACCOUNTING
  // ============================================================
  {
    category: 'Finance and Accounting',
    skills: [
      { ofoCode: '2411.01', title: 'Chartered Accountant', qualificationRequired: "Bachelor's Degree in Accounting + CTA (NQF 8+)", professionalBody: 'SAICA', minExperience: '3 years articles completed' },
      { ofoCode: '2411.02', title: 'Forensic Accountant', qualificationRequired: "Bachelor's Degree in Accounting + forensic certification", professionalBody: 'SAICA / ACFE', minExperience: '5 years' },
      { ofoCode: '2413.01', title: 'Financial Analyst', qualificationRequired: "Bachelor's Degree in Finance/Economics (NQF 7+) + CFA preferred", professionalBody: 'CFA Institute / SAIFM', minExperience: '5 years' },
      { ofoCode: '2412.01', title: 'Management Consultant', qualificationRequired: "Master's Degree in Business/Management (NQF 9+)", professionalBody: 'IMCSA', minExperience: '5 years' },
      { ofoCode: '2421.01', title: 'Actuary', qualificationRequired: "Bachelor's Degree in Actuarial Science (NQF 7+) + ASSA Fellowship", professionalBody: 'ASSA (Actuarial Society of SA)', minExperience: '3 years post-qualification' },
      { ofoCode: '2422.01', title: 'Quantity Surveyor', qualificationRequired: "Bachelor's Degree in Quantity Surveying (NQF 7+)", professionalBody: 'SACQSP', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // EDUCATION AND ACADEMIA
  // ============================================================
  {
    category: 'Education and Academia',
    skills: [
      { ofoCode: '2310.01', title: 'University Professor', qualificationRequired: 'Doctoral Degree (PhD) in relevant field (NQF 10)', professionalBody: 'CHE / DHET', minExperience: '5 years academic experience' },
      { ofoCode: '2310.02', title: 'Senior Lecturer', qualificationRequired: "Master's Degree (NQF 9+) or PhD in relevant field", professionalBody: 'CHE / DHET', minExperience: '3 years academic experience' },
      { ofoCode: '2320.01', title: 'Vocational Education Teacher (STEM)', qualificationRequired: "Bachelor's Degree in Education + subject specialization (NQF 7+)", professionalBody: 'SACE', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // AGRICULTURE AND ENVIRONMENTAL
  // ============================================================
  {
    category: 'Agriculture and Environmental Sciences',
    skills: [
      { ofoCode: '2132.01', title: 'Agricultural Scientist', qualificationRequired: "Master's Degree in Agricultural Science (NQF 9+)", professionalBody: 'SACNASP', minExperience: '3 years' },
      { ofoCode: '2132.02', title: 'Food Scientist', qualificationRequired: "Master's Degree in Food Science (NQF 9+)", professionalBody: 'SACNASP / SAAFoST', minExperience: '3 years' },
      { ofoCode: '2132.03', title: 'Veterinarian', qualificationRequired: 'BVSc degree (NQF 8+)', professionalBody: 'SAVC', minExperience: '2 years' },
    ],
  },

  // ============================================================
  // ARTISAN AND TRADES (Skilled)
  // ============================================================
  {
    category: 'Skilled Trades and Artisans',
    skills: [
      { ofoCode: '6711.01', title: 'Electrician (Licensed)', qualificationRequired: 'National N Diploma Electrical (NQF 6) + trade test', professionalBody: 'ECA / ECSA (wireman license)', minExperience: '5 years + trade test passed' },
      { ofoCode: '6711.02', title: 'Millwright', qualificationRequired: 'National N Diploma + trade test', professionalBody: 'MERSETA', minExperience: '5 years + trade test' },
      { ofoCode: '6831.01', title: 'Boilermaker', qualificationRequired: 'National N Diploma + trade test', professionalBody: 'MERSETA', minExperience: '5 years + trade test' },
      { ofoCode: '6832.01', title: 'Welder (Coded)', qualificationRequired: 'Trade certificate + coded welding certification', professionalBody: 'SAIW', minExperience: '5 years + coded welder cert' },
      { ofoCode: '6721.01', title: 'Fitter and Turner', qualificationRequired: 'National N Diploma + trade test', professionalBody: 'MERSETA', minExperience: '5 years + trade test' },
      { ofoCode: '6841.01', title: 'Instrument Mechanician', qualificationRequired: 'National N Diploma + trade test', professionalBody: 'MERSETA / ECSA', minExperience: '5 years + trade test' },
    ],
  },

  // ============================================================
  // MARITIME AND TRANSPORT
  // ============================================================
  {
    category: 'Maritime and Transport',
    skills: [
      { ofoCode: '3152.01', title: 'Ship Master / Captain', qualificationRequired: 'Certificate of Competency (Master Mariner)', professionalBody: 'SAMSA', minExperience: '5 years sea service' },
      { ofoCode: '3152.02', title: 'Marine Engineer', qualificationRequired: 'Certificate of Competency (Marine Engineering)', professionalBody: 'SAMSA / ECSA', minExperience: '3 years' },
      { ofoCode: '3153.01', title: 'Aircraft Pilot', qualificationRequired: 'Airline Transport Pilot License (ATPL)', professionalBody: 'SACAA', minExperience: '1,500 flight hours minimum' },
      { ofoCode: '3155.01', title: 'Air Traffic Controller', qualificationRequired: 'ATC license + rating', professionalBody: 'SACAA / ATNS', minExperience: '3 years' },
    ],
  },

  // ============================================================
  // ENERGY AND NUCLEAR
  // ============================================================
  {
    category: 'Energy and Nuclear Sciences',
    skills: [
      { ofoCode: '2149.04', title: 'Nuclear Engineer', qualificationRequired: "Master's Degree in Nuclear Engineering (NQF 9+)", professionalBody: 'ECSA / NNR', minExperience: '5 years' },
      { ofoCode: '2149.05', title: 'Renewable Energy Engineer', qualificationRequired: "Bachelor's Degree in Engineering (NQF 7+) with energy specialization", professionalBody: 'ECSA / SANEDI', minExperience: '3 years' },
      { ofoCode: '2149.06', title: 'Power Systems Engineer', qualificationRequired: "Bachelor's Degree in Electrical Engineering (NQF 7+)", professionalBody: 'ECSA', minExperience: '5 years in power systems' },
    ],
  },
];

module.exports = CRITICAL_SKILLS_LIST;

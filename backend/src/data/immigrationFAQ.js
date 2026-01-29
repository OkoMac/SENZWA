/**
 * Comprehensive Immigration FAQ Knowledge Base
 *
 * Common questions about South African immigration with detailed answers
 * grounded in the Immigration Act 13 of 2002 and DHA directives.
 */

const IMMIGRATION_FAQ = [
  // ============================================================
  // GENERAL IMMIGRATION QUESTIONS
  // ============================================================
  {
    category: 'General',
    questions: [
      {
        q: 'What is the difference between a visa and a permit?',
        a: 'In South African immigration law, "visa" and "permit" are often used interchangeably. Technically, a visa is issued before entry to South Africa (usually at a South African mission abroad), while a permit or endorsement may refer to the status granted upon or after entry. The Immigration Act uses "visa" as the primary term for authorization to enter and remain in South Africa for a specific purpose.',
        legalRef: 'Section 1 of the Immigration Act 13 of 2002',
      },
      {
        q: 'How long can I stay in South Africa without a visa?',
        a: 'This depends on your nationality. Citizens of visa-exempt countries can stay for 90 days (some for 30 days) without a visa for tourism or short business visits. You can check your country\'s exemption status in the Senzwa app. Non-exempt nationals must obtain a visa before traveling to South Africa.',
        legalRef: 'Immigration Regulations, Schedule 1 and 2',
      },
      {
        q: 'Can I change my visa type while in South Africa?',
        a: 'Yes, in certain circumstances. You may apply for a change of visa status from within South Africa if you hold a valid visa. This is done at a VFS Global centre. However, not all visa changes are permitted. For example, you generally cannot change from a visitor\'s visa to a work visa without first obtaining the work visa from outside South Africa, unless specific conditions are met.',
        legalRef: 'Section 10(6) of the Immigration Act',
      },
      {
        q: 'What happens if I overstay my visa?',
        a: 'Overstaying is a serious immigration violation. If you overstay by less than 30 days, you may be declared an undesirable person for 1 year. If you overstay for more than 30 days, you may be declared undesirable for up to 5 years. This means you cannot enter South Africa or apply for any visa during that period. Overstayers may also face detention, deportation, and fines.',
        legalRef: 'Section 30 of the Immigration Act',
      },
      {
        q: 'What does "undesirable person" mean?',
        a: 'Under Section 30 of the Immigration Act, a person may be declared undesirable for various reasons including: immigration violations (overstay, working without authorization), criminal convictions, being a threat to national security, previously being deported, or providing false information. An undesirable person is barred from entering South Africa for a specified period.',
        legalRef: 'Section 30 of the Immigration Act',
      },
      {
        q: 'Can I work on a visitor\'s visa?',
        a: 'No. Working on a visitor\'s visa is illegal and constitutes an immigration violation. This includes both paid employment and unpaid work. If caught, you may face deportation and be declared an undesirable person. Remote work for a foreign employer is also technically not permitted on a visitor\'s visa - you would need a Remote Work Visa (Section 11(2)) for that purpose.',
        legalRef: 'Section 11 and Section 49 of the Immigration Act',
      },
      {
        q: 'How do I check the status of my application?',
        a: 'You can check your application status through: (1) The VFS Global website using your reference number, (2) Calling the DHA Contact Centre, (3) Visiting the VFS centre where you submitted, (4) Through the Senzwa platform which tracks your application status. Processing times vary by visa type.',
        legalRef: 'N/A - Administrative procedure',
      },
    ],
  },

  // ============================================================
  // DOCUMENT-RELATED QUESTIONS
  // ============================================================
  {
    category: 'Documents',
    questions: [
      {
        q: 'What is SAQA and why do I need a SAQA evaluation?',
        a: 'SAQA (South African Qualifications Authority) evaluates foreign qualifications against the South African National Qualifications Framework (NQF). If you\'re applying for a work visa, critical skills visa, or permanent residence, your foreign qualifications must be evaluated by SAQA to confirm their equivalence to South African qualifications. This process takes 4-8 weeks and costs approximately ZAR 1,080.',
        legalRef: 'Immigration Regulations, Regulation 9(1)(b)',
      },
      {
        q: 'How old can my police clearance certificate be?',
        a: 'Police clearance certificates must not be older than 6 months (180 days) at the time of application submission. You need a police clearance from your country of origin AND from any country where you have resided for 12 months or more since the age of 18. For South African police clearance (SAPS), the cost is approximately ZAR 91.',
        legalRef: 'Immigration Regulations, Regulation 9(1)(a)',
      },
      {
        q: 'What medical reports do I need?',
        a: 'You need two medical documents: (1) A medical report from a registered medical practitioner confirming you are not a health risk, and (2) A radiological (chest X-ray) report. Both must not be older than 6 months at the time of application. These are required for most temporary residence visas (except short-term visitor visas) and all permanent residence applications.',
        legalRef: 'Immigration Regulations, Regulation 9(1)(c)',
      },
      {
        q: 'Do my documents need to be translated?',
        a: 'Yes, all documents not in English must be translated into English by a sworn translator. The sworn translation must be attached to the original document. South Africa also requires documents from non-Apostille countries to be authenticated by the SA embassy in the country of origin. Apostille countries simply need an apostille stamp.',
        legalRef: 'Immigration Regulations, general requirements',
      },
      {
        q: 'What is an apostille and do I need one?',
        a: 'An apostille is a certificate issued under the Hague Convention that authenticates the origin of a public document. South Africa joined the Apostille Convention, so documents from other member countries can be apostilled instead of undergoing the longer embassy legalization process. If your country is NOT part of the Apostille Convention, your documents must be authenticated by your foreign ministry and then legalized by the South African embassy in your country.',
        legalRef: 'Hague Convention of 5 October 1961',
      },
      {
        q: 'What proof of financial means do I need?',
        a: 'The financial proof required varies by visa type: (1) Visitor visa: 3 months of bank statements showing sufficient funds for your stay, (2) Study visa: proof of funds covering full tuition and living expenses, or scholarship letter, (3) Work visa: employment contract showing salary, (4) Business visa: proof of ZAR 5,000,000 minimum investment, (5) Remote work: proof of ZAR 1,000,000 minimum annual income, (6) Retired person: proof of ZAR 37,000 minimum monthly pension/income.',
        legalRef: 'Various sections of the Immigration Act',
      },
    ],
  },

  // ============================================================
  // WORK VISA QUESTIONS
  // ============================================================
  {
    category: 'Work Visas',
    questions: [
      {
        q: 'What is the difference between a General Work Visa and a Critical Skills Visa?',
        a: 'The key differences are: (1) A General Work Visa requires a confirmed job offer AND a Department of Labour recommendation proving no suitable local candidate was found (labour market test). (2) A Critical Skills Visa does not require a job offer at the time of application - you just need to prove your skill is on the Critical Skills List and you have the qualifications. However, you must find employment within 12 months of receiving the visa. Critical Skills visas generally process faster.',
        legalRef: 'Sections 19(2) and 19(4) of the Immigration Act',
      },
      {
        q: 'What is the Department of Labour recommendation?',
        a: 'For a General Work Visa, the employer must prove they could not find a suitable South African citizen or permanent resident for the position. This involves advertising the position in specific ways (newspaper, job portals) and documenting the recruitment process. The Department of Labour reviews this evidence and issues a recommendation letter. This process can take 4-6 weeks.',
        legalRef: 'Section 19(2) and Regulation 14',
      },
      {
        q: 'Can I work while my work visa is being processed?',
        a: 'No. You cannot work until your work visa has been approved and issued. If you are in South Africa on a visitor\'s visa while waiting for a work visa, you may not engage in any form of employment. Working without a valid work authorization is an immigration offense.',
        legalRef: 'Section 49 of the Immigration Act',
      },
      {
        q: 'Can my spouse and children accompany me on a work visa?',
        a: 'Your spouse can apply for a Spousal Visa (if married) or Life Partner Visa (if in a life partnership). Your minor children can be included as dependents on your application. Your spouse\'s visa duration will generally match your work visa duration. Note that your spouse cannot work unless they obtain their own work visa or the spousal visa permits it.',
        legalRef: 'Section 11(6) of the Immigration Act',
      },
      {
        q: 'What is the Critical Skills List?',
        a: 'The Critical Skills List is published by the Minister of Home Affairs and identifies occupations in critical demand in South Africa. It covers fields including: Engineering (all disciplines), ICT (software development, data science, cybersecurity), Health (doctors, specialists, nurses), Sciences (physics, chemistry, biology), Finance (actuaries, chartered accountants), and Skilled Trades (electricians, boilermakers). The list is updated periodically.',
        legalRef: 'Section 19(4) and Government Gazette',
      },
      {
        q: 'What professional body do I need to register with?',
        a: 'This depends on your profession. Engineers register with ECSA, doctors with HPCSA, nurses with SANC, accountants with SAICA, scientists with SACNASP, IT professionals with IITPSA, teachers with SACE, pharmacists with SAPC, architects with SACAP, and lawyers with the LPC. Registration must be completed before or during your visa application.',
        legalRef: 'Immigration Regulations, profession-specific requirements',
      },
    ],
  },

  // ============================================================
  // PERMANENT RESIDENCE QUESTIONS
  // ============================================================
  {
    category: 'Permanent Residence',
    questions: [
      {
        q: 'How do I qualify for permanent residence in South Africa?',
        a: 'There are several pathways: (1) Section 26: After holding a work visa for 5 consecutive years, (2) Section 27(b): With a permanent job offer, (3) Section 27(c): If you\'ve established a qualifying business (ZAR 5M+ investment, 60%+ local employees), (4) Section 27(d): If you\'re financially independent (ZAR 12M+ net worth), (5) Section 27(e): If you have extraordinary skills. Each pathway has specific requirements.',
        legalRef: 'Sections 26 and 27 of the Immigration Act',
      },
      {
        q: 'How long does permanent residence take to process?',
        a: 'Permanent residence applications typically take 8-24 months to process. There is a significant backlog at DHA. The variation depends on the complexity of your application, the pathway chosen, completeness of documentation, and current processing volumes at DHA.',
        legalRef: 'N/A - Administrative',
      },
      {
        q: 'Can permanent residence be revoked?',
        a: 'Yes, under certain circumstances including: (1) If it was obtained fraudulently, (2) If you are absent from South Africa for more than 3 consecutive years without a departure permit, (3) If you are convicted of certain serious criminal offenses, (4) If you obtained it through a marriage of convenience. DHA can investigate and revoke PR status.',
        legalRef: 'Section 28 of the Immigration Act',
      },
      {
        q: 'Can I apply for South African citizenship after permanent residence?',
        a: 'Yes. After holding permanent residence for 5 years, you may apply for South African citizenship by naturalization, provided you meet the requirements: been ordinarily resident for 5 years as a PR, good character, knowledge of the responsibilities and privileges of SA citizenship, and intention to continue residing in SA. Note that some countries do not allow dual citizenship - check your country\'s laws.',
        legalRef: 'South African Citizenship Act 88 of 1995',
      },
    ],
  },

  // ============================================================
  // FAMILY AND RELATIONSHIP QUESTIONS
  // ============================================================
  {
    category: 'Family and Relationships',
    questions: [
      {
        q: 'How do I prove a genuine relationship for a spousal visa?',
        a: 'DHA looks for multiple forms of evidence including: (1) Joint bank accounts or financial records, (2) Shared property ownership or lease, (3) Photos together over time (showing progression of relationship), (4) Communication records (messages, call logs), (5) Travel together, (6) Letters from family and friends confirming the relationship, (7) Joint insurance policies. The more evidence from different categories, the stronger your case. DHA may also conduct interviews.',
        legalRef: 'Section 11(6) and Immigration Regulations',
      },
      {
        q: 'Is a life partner visa the same as a spousal visa?',
        a: 'They are similar but not identical. A spousal visa requires a legal marriage recognized under South African law. A life partner visa is for couples in a permanent partnership who may not be legally married - including same-sex couples. Life partner visas require a notarized life partnership agreement and typically require stronger evidence of the relationship\'s permanence (2+ years of cohabitation evidence).',
        legalRef: 'Section 11(6) of the Immigration Act',
      },
      {
        q: 'Can I bring my parents to South Africa?',
        a: 'Yes. Your parents can apply for a Relative\'s Visa if you are a South African citizen or permanent resident. You would need to provide a financial undertaking, proof of your SA status, proof of the family relationship (birth certificate), and proof of your ability to financially support them during their stay.',
        legalRef: 'Section 18 of the Immigration Act',
      },
    ],
  },

  // ============================================================
  // STUDY VISA QUESTIONS
  // ============================================================
  {
    category: 'Study Visas',
    questions: [
      {
        q: 'Can I work while studying in South Africa?',
        a: 'Yes, but with limitations. Study visa holders at registered higher education institutions may work for up to 20 hours per week during term time and full-time during vacation periods. This must not interfere with your studies. Your educational institution must provide a letter confirming you are a registered student in good standing. You cannot work during language school studies.',
        legalRef: 'Section 13 and Immigration Regulations',
      },
      {
        q: 'How do I know if my institution is registered with DHA?',
        a: 'Your educational institution must be registered with the Department of Higher Education and Training (DHET) and listed with DHA as an approved institution for study visa purposes. You can verify this through: (1) The DHET website, (2) Asking the institution directly for their DHA registration number, (3) Checking with the Senzwa knowledge base. Unregistered institutions will result in visa rejection.',
        legalRef: 'Section 13 of the Immigration Act',
      },
      {
        q: 'Can I stay in South Africa after graduating?',
        a: 'Your study visa does not automatically allow you to remain after graduation. You have several options: (1) Apply for a work visa if you find employment, (2) Apply for a Critical Skills Visa if your qualification is on the Critical Skills List, (3) Apply for a visitor\'s visa for a short stay while arranging your next visa, (4) Return to your home country and apply for the appropriate visa from there. Plan ahead - do not let your study visa expire without taking action.',
        legalRef: 'Immigration Act, various sections',
      },
    ],
  },

  // ============================================================
  // PROCESS AND PROCEDURE QUESTIONS
  // ============================================================
  {
    category: 'Process and Procedure',
    questions: [
      {
        q: 'Where do I submit my visa application?',
        a: 'If you are outside South Africa, you submit at the South African Embassy/Consulate or VFS Global centre in your country of residence. If you are inside South Africa with valid status, you can submit at a VFS Global centre. VFS Global processes applications on behalf of DHA in most countries. You typically need to book an appointment and submit in person for biometrics.',
        legalRef: 'Immigration Regulations',
      },
      {
        q: 'What is VFS Global?',
        a: 'VFS Global is a private company contracted by the Department of Home Affairs to handle visa application logistics. They receive applications, collect biometrics, forward documents to DHA for adjudication, and manage the return of documents to applicants. VFS does NOT make visa decisions - they are a processing intermediary. They charge a service fee (approximately ZAR 1,350) in addition to the DHA application fee.',
        legalRef: 'DHA outsourcing agreement',
      },
      {
        q: 'Can I appeal a rejected visa application?',
        a: 'Yes. If your visa is rejected, you can: (1) Lodge an internal appeal with DHA within 10 working days of receiving the rejection (costs ZAR 1,520), (2) Submit a new application addressing the reasons for rejection, (3) In some cases, approach the courts for judicial review. The rejection letter should state the reasons for rejection. Understanding these reasons is critical for a successful appeal or reapplication.',
        legalRef: 'Section 8(4) of the Immigration Act',
      },
      {
        q: 'How much does a visa application cost?',
        a: 'Costs include: (1) DHA application fee: ZAR 1,520 for most visa types (visitor visas are free for most nationalities), (2) VFS service fee: approximately ZAR 1,350, (3) Additional costs: SAQA evaluation (ZAR 1,080), police clearance (varies by country), medical reports (varies), sworn translations, apostille/legalization. Total costs can range from a few hundred rand for a visitor visa to several thousand for work or PR applications.',
        legalRef: 'DHA Fee Schedule',
      },
    ],
  },
];

module.exports = IMMIGRATION_FAQ;

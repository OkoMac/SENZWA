import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { knowledgeAPI } from '../services/api';

const FALLBACK_DATA = {
  overview: {
    totalVisaCategories: 22,
    totalCriticalSkills: 83,
  },
  visas: {
    categories: [
      { id: 'critical-skills', name: 'Critical Skills Work Visa', description: 'For foreign nationals possessing skills on the Critical Skills List published by the Minister of Home Affairs. Allows employment without a prior job offer.', maxDuration: '5 years', legalReference: 'Section 19(4) Immigration Act', category: 'Work' },
      { id: 'general-work', name: 'General Work Visa', description: 'For foreign nationals with a confirmed job offer from a South African employer who can demonstrate that no suitable citizen or permanent resident is available.', maxDuration: '5 years', legalReference: 'Section 19(2) Immigration Act', category: 'Work' },
      { id: 'intra-company-transfer', name: 'Intra-Company Transfer Visa', description: 'For employees of multinational companies being transferred to a South African branch, subsidiary, or affiliate of the same employer.', maxDuration: '4 years', legalReference: 'Section 19(6) Immigration Act', category: 'Work' },
      { id: 'business-visa', name: 'Business Visa', description: 'For foreign nationals intending to establish or invest in a business in South Africa. Requires a minimum capital contribution and must employ South African citizens.', maxDuration: '3 years', legalReference: 'Section 15 Immigration Act', category: 'Business' },
      { id: 'study-visa', name: 'Study Visa', description: 'For foreign nationals accepted at a registered South African learning institution. Allows full-time study and limited part-time work during term.', maxDuration: 'Duration of study', legalReference: 'Section 13 Immigration Act', category: 'Study' },
      { id: 'relatives-visa', name: 'Relatives Visa', description: 'For immediate family members of South African citizens or permanent residents, including spouses, children, and dependent parents.', maxDuration: '2 years', legalReference: 'Section 18 Immigration Act', category: 'Family' },
      { id: 'spousal-visa', name: 'Spousal Life Partner Visa', description: 'For spouses or life partners in a relationship with a South African citizen or permanent resident. Proof of genuine relationship required.', maxDuration: '2 years', legalReference: 'Section 11(6) Immigration Act', category: 'Family' },
      { id: 'retired-persons', name: 'Retired Persons Visa', description: 'For foreign retirees with a proven minimum income or retirement savings. Applicants must demonstrate financial self-sufficiency without employment.', maxDuration: '4 years', legalReference: 'Section 20 Immigration Act', category: 'Retirement' },
      { id: 'visitor-visa', name: 'Visitor Visa', description: 'For tourism, family visits, or short-term business activities. Does not permit employment or long-term study in South Africa.', maxDuration: '90 days', legalReference: 'Section 11 Immigration Act', category: 'Visitor' },
      { id: 'medical-treatment', name: 'Medical Treatment Visa', description: 'For foreign nationals seeking medical treatment in South Africa. Requires confirmation from a registered South African medical facility.', maxDuration: '6 months', legalReference: 'Section 17 Immigration Act', category: 'Medical' },
    ],
  },
  skills: {
    categories: [
      {
        category: 'Engineering',
        skills: [
          { title: 'Civil Engineer', ofoCode: '214201', qualificationRequired: 'BSc/BEng Civil Engineering', professionalBody: 'ECSA' },
          { title: 'Electrical Engineer', ofoCode: '214101', qualificationRequired: 'BSc/BEng Electrical Engineering', professionalBody: 'ECSA' },
          { title: 'Mechanical Engineer', ofoCode: '214401', qualificationRequired: 'BSc/BEng Mechanical Engineering', professionalBody: 'ECSA' },
          { title: 'Chemical Engineer', ofoCode: '214501', qualificationRequired: 'BSc/BEng Chemical Engineering', professionalBody: 'ECSA' },
          { title: 'Industrial Engineer', ofoCode: '214901', qualificationRequired: 'BSc/BEng Industrial Engineering', professionalBody: 'ECSA' },
          { title: 'Mining Engineer', ofoCode: '214601', qualificationRequired: 'BSc/BEng Mining Engineering', professionalBody: 'ECSA' },
          { title: 'Electronics Engineer', ofoCode: '214301', qualificationRequired: 'BSc/BEng Electronics Engineering', professionalBody: 'ECSA' },
        ],
      },
      {
        category: 'Healthcare',
        skills: [
          { title: 'Medical Practitioner (General)', ofoCode: '221101', qualificationRequired: 'MBChB or equivalent', professionalBody: 'HPCSA' },
          { title: 'Medical Specialist', ofoCode: '221201', qualificationRequired: 'MBChB + Specialist qualification', professionalBody: 'HPCSA' },
          { title: 'Dentist', ofoCode: '221301', qualificationRequired: 'BChD or equivalent', professionalBody: 'HPCSA' },
          { title: 'Pharmacist', ofoCode: '226201', qualificationRequired: 'BPharm or equivalent', professionalBody: 'SAPC' },
          { title: 'Clinical Psychologist', ofoCode: '222101', qualificationRequired: 'Masters in Clinical Psychology', professionalBody: 'HPCSA' },
          { title: 'Registered Nurse', ofoCode: '222101', qualificationRequired: 'BCur or equivalent Nursing degree', professionalBody: 'SANC' },
          { title: 'Physiotherapist', ofoCode: '226301', qualificationRequired: 'BSc Physiotherapy', professionalBody: 'HPCSA' },
        ],
      },
      {
        category: 'Information Technology',
        skills: [
          { title: 'Software Developer', ofoCode: '251201', qualificationRequired: 'BSc Computer Science or IT degree', professionalBody: '' },
          { title: 'ICT Security Specialist', ofoCode: '252901', qualificationRequired: 'BSc Computer Science + Security certification', professionalBody: '' },
          { title: 'Systems Analyst', ofoCode: '251101', qualificationRequired: 'BSc Computer Science or Information Systems', professionalBody: '' },
          { title: 'Data Scientist', ofoCode: '251202', qualificationRequired: 'BSc/MSc in Data Science, Statistics, or Computer Science', professionalBody: '' },
          { title: 'Network Engineer', ofoCode: '252301', qualificationRequired: 'BSc IT or Computer Engineering', professionalBody: '' },
          { title: 'DevOps Engineer', ofoCode: '251203', qualificationRequired: 'BSc Computer Science or IT degree', professionalBody: '' },
        ],
      },
      {
        category: 'Finance and Accounting',
        skills: [
          { title: 'Chartered Accountant', ofoCode: '241101', qualificationRequired: 'BCom Accounting + CTA + Board Exam', professionalBody: 'SAICA' },
          { title: 'External Auditor', ofoCode: '241201', qualificationRequired: 'BCom Accounting + CTA + IRBA Board Exam', professionalBody: 'IRBA' },
          { title: 'Actuary', ofoCode: '212101', qualificationRequired: 'BSc Actuarial Science + Fellowship', professionalBody: 'ASSA' },
          { title: 'Financial Analyst', ofoCode: '241301', qualificationRequired: 'BCom Finance or CFA qualification', professionalBody: 'SAICA' },
        ],
      },
      {
        category: 'Sciences',
        skills: [
          { title: 'Geologist', ofoCode: '211401', qualificationRequired: 'BSc/MSc Geology', professionalBody: 'SACNASP' },
          { title: 'Physicist', ofoCode: '211101', qualificationRequired: 'MSc/PhD Physics', professionalBody: 'SACNASP' },
          { title: 'Biotechnologist', ofoCode: '213201', qualificationRequired: 'BSc/MSc Biotechnology', professionalBody: 'SACNASP' },
          { title: 'Meteorologist', ofoCode: '211201', qualificationRequired: 'BSc Meteorology or Atmospheric Science', professionalBody: 'SACNASP' },
          { title: 'Environmental Scientist', ofoCode: '213301', qualificationRequired: 'BSc Environmental Science', professionalBody: 'SACNASP' },
        ],
      },
    ],
  },
  fees: {
    fees: {
      'Work Visas': [
        { name: 'Critical Skills Work Visa', amount: 'R1 520' },
        { name: 'General Work Visa', amount: 'R1 520' },
        { name: 'Intra-Company Transfer Visa', amount: 'R1 520' },
        { name: 'Corporate Visa', amount: 'R1 520' },
      ],
      'Business and Study Visas': [
        { name: 'Business Visa', amount: 'R1 520' },
        { name: 'Study Visa', amount: 'R860' },
        { name: 'Exchange Visa', amount: 'R860' },
      ],
      'Family and Personal Visas': [
        { name: 'Relatives Visa', amount: 'R1 520' },
        { name: 'Spousal / Life Partner Visa', amount: 'R1 520' },
        { name: 'Retired Persons Visa', amount: 'R1 520' },
        { name: 'Medical Treatment Visa', amount: 'R860' },
      ],
      'Visitor Visas': [
        { name: 'Visitor Visa (Tourism)', amount: 'R425' },
        { name: 'Visitor Visa (Business)', amount: 'R425' },
      ],
      'Permanent Residence': [
        { name: 'Permanent Residence Permit', amount: 'R4 080' },
        { name: 'PR - Critical Skills (Section 27b)', amount: 'R4 080' },
        { name: 'PR - Spousal (Section 26a)', amount: 'R4 080' },
      ],
      'Other Services': [
        { name: 'Waiver Application', amount: 'R1 520' },
        { name: 'Appeal (Immigration)', amount: 'R1 520' },
        { name: 'Certification of Documents', amount: 'R120' },
        { name: 'Premium Processing (VFS)', amount: 'R1 350' },
      ],
    },
  },
  times: {
    processingTimes: [
      { category: 'Critical Skills Work Visa', standard: '8-12 weeks', expedited: '4-6 weeks (premium)' },
      { category: 'General Work Visa', standard: '8-16 weeks', expedited: '6-8 weeks (premium)' },
      { category: 'Intra-Company Transfer Visa', standard: '8-12 weeks', expedited: '4-6 weeks (premium)' },
      { category: 'Business Visa', standard: '8-12 weeks', expedited: null },
      { category: 'Study Visa', standard: '6-10 weeks', expedited: null },
      { category: 'Relatives Visa', standard: '8-12 weeks', expedited: null },
      { category: 'Spousal / Life Partner Visa', standard: '8-16 weeks', expedited: null },
      { category: 'Retired Persons Visa', standard: '8-12 weeks', expedited: null },
      { category: 'Visitor Visa', standard: '5-10 working days', expedited: '3-5 days (premium)' },
      { category: 'Permanent Residence Permit', standard: '12-24 months', expedited: null },
      { category: 'SAQA Evaluation', standard: '8-12 weeks', expedited: null },
      { category: 'Police Clearance (SAPS)', standard: '2-4 weeks', expedited: null },
    ],
  },
  offices: {
    offices: {
      'Head Office': [
        {
          name: 'Department of Home Affairs - Head Office',
          address: '230 Johannes Ramokhoase (Proes) Street, Pretoria, 0001',
          hours: 'Mon-Fri: 08:00 - 15:30',
          phone: '+27 12 406 2500',
        },
      ],
      'Regional Offices': [
        {
          name: 'DHA Cape Town Regional Office',
          address: '56 Barrack Street, Cape Town, 8001',
          hours: 'Mon-Fri: 08:00 - 15:30',
          phone: '+27 21 488 1700',
        },
        {
          name: 'DHA Johannesburg Regional Office',
          address: 'Harrison Street, Johannesburg CBD, 2001',
          hours: 'Mon-Fri: 08:00 - 15:30',
          phone: '+27 11 836 3228',
        },
        {
          name: 'DHA Durban Regional Office',
          address: '221 Anton Lembede Street, Durban, 4001',
          hours: 'Mon-Fri: 08:00 - 15:30',
          phone: '+27 31 362 1016',
        },
      ],
      'VFS Global Centres': [
        {
          name: 'VFS Global Pretoria',
          address: 'Brooklyn Mall, Bronkhorst Street, Pretoria, 0181',
          hours: 'Mon-Fri: 08:00 - 16:00',
          phone: '+27 12 425 3000',
        },
        {
          name: 'VFS Global Cape Town',
          address: '2 Long Street, Cape Town, 8001',
          hours: 'Mon-Fri: 08:00 - 16:00',
          phone: '+27 21 403 6700',
        },
        {
          name: 'VFS Global Johannesburg',
          address: 'Rivonia Village, Rivonia Boulevard, Sandton, 2128',
          hours: 'Mon-Fri: 08:00 - 16:00',
          phone: '+27 11 234 5600',
        },
        {
          name: 'VFS Global Durban',
          address: '320 West Street, Durban, 4001',
          hours: 'Mon-Fri: 08:00 - 16:00',
          phone: '+27 31 301 3400',
        },
      ],
    },
  },
  bodies: {
    bodies: [
      { name: 'Health Professions Council of South Africa', abbreviation: 'HPCSA', field: 'Medical Practitioners, Dentists, Psychologists, Physiotherapists', registrationTime: '8-16 weeks', website: 'https://www.hpcsa.co.za' },
      { name: 'Engineering Council of South Africa', abbreviation: 'ECSA', field: 'All Engineering Disciplines', registrationTime: '6-12 weeks', website: 'https://www.ecsa.co.za' },
      { name: 'South African Institute of Chartered Accountants', abbreviation: 'SAICA', field: 'Chartered Accountants, Financial Professionals', registrationTime: '4-8 weeks', website: 'https://www.saica.co.za' },
      { name: 'South African Pharmacy Council', abbreviation: 'SAPC', field: 'Pharmacists, Pharmacy Technicians', registrationTime: '8-12 weeks', website: 'https://www.pharmcouncil.co.za' },
      { name: 'South African Nursing Council', abbreviation: 'SANC', field: 'Registered Nurses, Enrolled Nurses, Midwives', registrationTime: '12-20 weeks', website: 'https://www.sanc.co.za' },
      { name: 'South African Council for Natural Scientific Professions', abbreviation: 'SACNASP', field: 'Geologists, Physicists, Biotechnologists, Environmental Scientists', registrationTime: '6-10 weeks', website: 'https://www.sacnasp.org.za' },
      { name: 'Independent Regulatory Board for Auditors', abbreviation: 'IRBA', field: 'External Auditors', registrationTime: '4-8 weeks', website: 'https://www.irba.co.za' },
      { name: 'Actuarial Society of South Africa', abbreviation: 'ASSA', field: 'Actuaries', registrationTime: '4-6 weeks', website: 'https://www.actuarialsociety.org.za' },
      { name: 'South African Qualifications Authority', abbreviation: 'SAQA', field: 'Foreign Qualification Evaluation', registrationTime: '8-12 weeks', website: 'https://www.saqa.org.za' },
      { name: 'Law Society of South Africa', abbreviation: 'LSSA', field: 'Legal Practitioners, Attorneys, Advocates', registrationTime: '8-14 weeks', website: 'https://www.lssa.org.za' },
      { name: 'South African Veterinary Council', abbreviation: 'SAVC', field: 'Veterinarians, Veterinary Specialists', registrationTime: '6-10 weeks', website: 'https://www.savc.org.za' },
      { name: 'South African Council for Educators', abbreviation: 'SACE', field: 'Teachers, Education Professionals', registrationTime: '6-8 weeks', website: 'https://www.sace.org.za' },
      { name: 'South African Council for the Architectural Profession', abbreviation: 'SACAP', field: 'Architects, Senior Architectural Technologists', registrationTime: '8-12 weeks', website: 'https://www.sacapsa.com' },
    ],
  },
  faq: {
    categories: [
      {
        category: 'General Immigration',
        questions: [
          { question: 'What is the difference between a visa and a permit in South Africa?', answer: 'In South African immigration law, a "visa" is issued for temporary residence (work, study, visit), while a "permit" generally refers to permanent residence. Temporary visas are governed by Sections 11-22 of the Immigration Act, and permanent residence is governed by Sections 25-27.', legalReference: 'Immigration Act 13 of 2002' },
          { question: 'Can I apply for a visa from inside South Africa?', answer: 'Yes, in most cases you can apply for a change of status (switching visa types) while inside South Africa. Applications are submitted through VFS Global centres. However, first-time applicants from abroad must apply at a South African embassy or consulate in their home country.', legalReference: 'Section 10 Immigration Act' },
          { question: 'How long can I stay in South Africa on a visitor visa?', answer: 'Visitor visas are typically issued for up to 90 days. Citizens of visa-exempt countries receive a port-of-entry visa valid for 90 days. Extensions of up to 90 additional days can be applied for at a VFS Global centre before the current visa expires.', legalReference: 'Section 11 Immigration Act' },
          { question: 'What happens if my visa expires while I am in South Africa?', answer: 'Overstaying your visa is a serious offence. You may be declared an undesirable person, banned from re-entering South Africa for 1-5 years, detained, or deported. It is critical to apply for renewal or extension before your current visa expires.', legalReference: 'Section 30 Immigration Act' },
        ],
      },
      {
        category: 'Work Visas',
        questions: [
          { question: 'What is the Critical Skills Work Visa and who qualifies?', answer: 'The Critical Skills Work Visa is for foreign nationals who possess skills listed on the government\'s Critical Skills List. Applicants must hold appropriate qualifications evaluated by SAQA and, where applicable, be registered with a relevant South African professional body. Unlike the General Work Visa, a prior job offer is not required at the time of application.', legalReference: 'Section 19(4) Immigration Act' },
          { question: 'Do I need a job offer to apply for a Critical Skills Visa?', answer: 'No, you do not need a job offer to apply. However, if you do not have a job offer at the time of application, you must prove that you secured employment within 12 months of the visa being issued. Failure to do so may result in the visa being revoked.', legalReference: 'Section 19(4) Immigration Act' },
          { question: 'What is a labour market test for the General Work Visa?', answer: 'The employer must prove to the Department of Labour that they were unable to find a suitable South African citizen or permanent resident for the position. This involves advertising the position in specific media and providing evidence that no qualified local candidates applied.', legalReference: 'Section 19(2) Immigration Act' },
          { question: 'Can I change employers on a work visa?', answer: 'Work visas are generally employer-specific. If you wish to change employers, you must apply for a new work visa with the new employer\'s details. Working for an unauthorized employer can result in visa cancellation and potential deportation.', legalReference: 'Immigration Regulations, 2014' },
        ],
      },
      {
        category: 'Permanent Residence',
        questions: [
          { question: 'How do I qualify for permanent residence in South Africa?', answer: 'Permanent residence can be obtained through several categories: holding a Critical Skills Work Visa for 5 years (Section 27b), being married to a South African citizen for 5 years (Section 26a), having a general work visa for 5 years (Section 26a), as a retired person (Section 27c), or by making a qualifying financial contribution/investment (Section 27d).', legalReference: 'Sections 25-27 Immigration Act' },
          { question: 'How long does permanent residence take to process?', answer: 'Permanent residence applications typically take 12-24 months to process, although some cases may take longer. Applications are submitted through VFS Global and processed by the Department of Home Affairs in Pretoria.', legalReference: 'Immigration Regulations, 2014' },
          { question: 'Can permanent residence be revoked?', answer: 'Yes, permanent residence can be revoked if the holder is absent from South Africa for more than 3 consecutive years, if the permit was obtained fraudulently, or if the holder is convicted of a serious criminal offence.', legalReference: 'Section 28 Immigration Act' },
        ],
      },
      {
        category: 'Documents and Requirements',
        questions: [
          { question: 'What is a SAQA evaluation and why do I need one?', answer: 'The South African Qualifications Authority (SAQA) evaluates foreign qualifications to determine their South African equivalent. This is required for most work and permanent residence visa applications to verify that your qualifications meet the standards expected for your occupation.', legalReference: 'National Qualifications Framework Act 67 of 2008' },
          { question: 'How do I get a police clearance certificate?', answer: 'You need a police clearance certificate from every country where you have resided for 12 or more months in the past 10 years. Contact the relevant country\'s police service or embassy. South African police clearance is obtained from SAPS Criminal Record Centre. These certificates must be less than 6 months old at time of submission.', legalReference: 'Immigration Regulations, 2014' },
          { question: 'Do my documents need to be translated or apostilled?', answer: 'All documents not in English must be translated by a sworn translator. Documents from countries that are party to the Hague Apostille Convention must be apostilled. Documents from non-Hague countries must be authenticated/legalized by the relevant South African embassy or consulate.', legalReference: 'Immigration Regulations, 2014' },
        ],
      },
      {
        category: 'Fees and Processing',
        questions: [
          { question: 'How much does a work visa cost in South Africa?', answer: 'Work visa application fees are R1,520 for most categories (Critical Skills, General Work, Intra-Company Transfer). VFS Global service fees are additional and vary by location. Premium/priority processing through VFS costs an extra R1,350 where available.', legalReference: 'Immigration Regulations, Schedule of Fees' },
          { question: 'Can I track my visa application status?', answer: 'Yes, you can track your application through the VFS Global website using your reference number. You can also contact the DHA call centre at 0800 60 11 90 for status updates. Processing times vary by visa type and current workload.', legalReference: null },
          { question: 'What if my visa application is rejected?', answer: 'If your visa application is refused, you have the right to appeal within 10 working days of receiving the decision. Appeals are submitted to the Director-General of Home Affairs. You may also apply for a review of the decision through the Immigration Advisory Board or approach the courts for judicial review.', legalReference: 'Section 8 Immigration Act' },
        ],
      },
    ],
  },
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'visas', label: 'All Visas' },
  { id: 'skills', label: 'Critical Skills' },
  { id: 'country', label: 'Country Check' },
  { id: 'docs', label: 'Documents' },
  { id: 'fees', label: 'Fees' },
  { id: 'times', label: 'Processing Times' },
  { id: 'offices', label: 'Offices' },
  { id: 'bodies', label: 'Professional Bodies' },
  { id: 'faq', label: 'FAQ' },
];

export default function KnowledgeHub() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    loadTab(tab);
  }, [tab]);

  async function loadTab(t) {
    if (data[t]) return;
    setLoading(true);
    try {
      let result;
      switch (t) {
        case 'overview': result = await knowledgeAPI.getOverview(); break;
        case 'visas': result = await knowledgeAPI.getVisaCategories(); break;
        case 'skills': result = await knowledgeAPI.getCriticalSkills(); break;
        case 'fees': result = await knowledgeAPI.getFees(); break;
        case 'times': result = await knowledgeAPI.getProcessingTimes(); break;
        case 'offices': result = await knowledgeAPI.getDHAOffices(); break;
        case 'bodies': result = await knowledgeAPI.getProfessionalBodies(); break;
        case 'faq': result = await knowledgeAPI.getFAQ(); break;
        default: result = { data: {} };
      }
      setData(prev => ({ ...prev, [t]: result.data }));
    } catch {
      if (FALLBACK_DATA[t]) {
        setData(prev => ({ ...prev, [t]: FALLBACK_DATA[t] }));
      }
    }
    setLoading(false);
  }

  async function lookupCountry() {
    if (!countryInput.trim()) return;
    setLoading(true);
    try {
      const res = await knowledgeAPI.getCountryRequirements(countryInput);
      setCountryData(res.data);
    } catch { setCountryData({ error: 'Country not found' }); }
    setLoading(false);
  }

  const Loader = () => <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div style={s.page}>
      <div className="container">
        <h1 style={s.title}>Knowledge Hub</h1>
        <p style={s.subtitle}>Complete self-service reference for South African immigration. Everything you need, in one place.</p>

        {/* Tabs */}
        <div style={s.tabs}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ ...s.tabBtn, ...(tab === t.id ? s.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && !data[tab] ? <Loader /> : (
          <div>
            {/* Overview */}
            {tab === 'overview' && data.overview && (
              <div>
                <div style={s.statsGrid}>
                  {[
                    { n: data.overview.totalVisaCategories || '22+', l: 'Visa Categories' },
                    { n: data.overview.totalCriticalSkills || '80+', l: 'Critical Skills' },
                    { n: '130+', l: 'Countries Covered' },
                    { n: '13', l: 'Professional Bodies' },
                  ].map((st, i) => (
                    <div key={i} style={s.statCard}><span style={s.statNum}>{st.n}</span><span style={s.statLabel}>{st.l}</span></div>
                  ))}
                </div>
                <div style={s.quickLinks}>
                  {TABS.slice(1).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={s.quickBtn}>{t.label}<span style={s.quickArrow}>&rarr;</span></button>
                  ))}
                </div>
              </div>
            )}

            {/* All Visas */}
            {tab === 'visas' && data.visas && (
              <div>
                <input type="text" placeholder="Search visa categories..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                <div style={s.visaGrid}>
                  {(data.visas.categories || []).filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                    <Link key={c.id} to={`/visas/${c.id}`} style={s.visaCard}>
                      <h3 style={s.visaName}>{c.name}</h3>
                      <p style={s.visaDesc}>{c.description}</p>
                      <div style={s.visaMeta}><span style={s.visaDur}>{c.maxDuration}</span><span style={s.visaRef}>{c.legalReference}</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Skills */}
            {tab === 'skills' && data.skills && (
              <div>
                <input type="text" placeholder="Search skills (e.g. Software, Nurse, Civil)..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                {(data.skills.categories || []).map(cat => {
                  const filtered = (cat.skills || []).filter(sk => !search || sk.title.toLowerCase().includes(search.toLowerCase()) || sk.ofoCode?.includes(search));
                  if (!filtered.length && search) return null;
                  return (
                    <div key={cat.category} style={s.skillSection}>
                      <h3 style={s.skillCat}>{cat.category} <span style={s.skillCount}>({filtered.length})</span></h3>
                      <div style={s.skillList}>
                        {filtered.map((sk, i) => (
                          <div key={i} style={s.skillRow}>
                            <div style={s.skillInfo}>
                              <span style={s.skillTitle}>{sk.title}</span>
                              <span style={s.skillOfo}>OFO: {sk.ofoCode}</span>
                            </div>
                            <div style={s.skillRight}>
                              <span style={s.skillQual}>{sk.qualificationRequired}</span>
                              {sk.professionalBody && <span style={s.skillBody}>{sk.professionalBody}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Country Check */}
            {tab === 'country' && (
              <div>
                <div style={s.countrySearch}>
                  <input type="text" placeholder="Enter country name (e.g. Nigeria, India, UK)..." value={countryInput} onChange={e => setCountryInput(e.target.value)} style={s.searchInput} onKeyDown={e => e.key === 'Enter' && lookupCountry()} />
                  <button className="btn btn-primary" onClick={lookupCountry}>Check</button>
                </div>
                {countryData && !countryData.error && (
                  <div style={s.countryResults}>
                    <h3 style={s.countryName}>{countryData.country}</h3>
                    <div style={s.countryGrid}>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Visa Exempt</span>
                        <span style={{ ...s.countryValue, color: countryData.visaExempt ? '#22c55e' : '#ef4444' }}>{countryData.visaExempt ? `Yes (${countryData.exemptDays} days)` : 'No'}</span>
                      </div>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Yellow Fever</span>
                        <span style={{ ...s.countryValue, color: countryData.yellowFeverRequired ? '#f59e0b' : '#22c55e' }}>{countryData.yellowFeverRequired ? 'Required' : 'Not Required'}</span>
                      </div>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Apostille</span>
                        <span style={s.countryValue}>{countryData.apostilleCountry ? 'Apostille accepted' : 'Legalization required'}</span>
                      </div>
                    </div>
                    {countryData.notes && <div style={s.countryNotes}><h4 style={s.noteTitle}>Country Notes</h4><p style={s.noteText}>{typeof countryData.notes === 'string' ? countryData.notes : JSON.stringify(countryData.notes)}</p></div>}
                  </div>
                )}
                {countryData?.error && <p style={s.muted}>{countryData.error}</p>}
              </div>
            )}

            {/* Documents Guide */}
            {tab === 'docs' && (
              <div style={s.docsGrid}>
                {[
                  { name: 'Valid Passport', desc: 'Must have at least 2 blank pages and be valid for 30 days beyond intended stay.', tip: 'Ensure passport is not damaged or altered.' },
                  { name: 'Police Clearance Certificate', desc: 'From every country lived in for 12+ months in the last 10 years.', tip: 'Must be less than 6 months old at time of submission.' },
                  { name: 'Medical Report', desc: 'Standard medical examination from a registered medical practitioner.', tip: 'Use DHA-approved forms. Must be recent.' },
                  { name: 'Radiological Report', desc: 'Chest X-ray for tuberculosis screening from an approved facility.', tip: 'Required for all applicants over 12 years old.' },
                  { name: 'Proof of Financial Means', desc: 'Bank statements, employment contract, or sponsor letter proving financial capacity.', tip: '3-6 months of bank statements recommended.' },
                  { name: 'Passport Photos', desc: 'Two recent passport-sized photographs with white background.', tip: '35mm x 45mm, taken within last 6 months.' },
                  { name: 'SAQA Evaluation', desc: 'South African Qualifications Authority evaluation of foreign qualifications.', tip: 'Apply early - can take 8-12 weeks.' },
                  { name: 'Yellow Fever Certificate', desc: 'Required if travelling from or transiting through a yellow fever endemic area.', tip: 'Must be vaccinated at least 10 days before arrival.' },
                ].map((doc, i) => (
                  <div key={i} style={s.docCard}>
                    <h3 style={s.docTitle}>{doc.name}</h3>
                    <p style={s.docDesc}>{doc.desc}</p>
                    <div style={s.docTip}><span style={s.tipLabel}>TIP:</span> {doc.tip}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Fees */}
            {tab === 'fees' && data.fees && (
              <div>
                {Object.entries(data.fees.fees || data.fees || {}).map(([category, items]) => {
                  if (!items || typeof items !== 'object') return null;
                  const entries = Array.isArray(items) ? items : Object.entries(items).map(([k, v]) => ({ name: k.replace(/_/g, ' '), amount: v }));
                  return (
                    <div key={category} style={s.feeSection}>
                      <h3 style={s.feeCat}>{category.replace(/_/g, ' ')}</h3>
                      <div style={s.feeList}>
                        {entries.map((fee, i) => (
                          <div key={i} style={s.feeRow}>
                            <span style={s.feeName}>{fee.name || fee.type}</span>
                            <span style={s.feeAmount}>{fee.amount || fee.fee}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Processing Times */}
            {tab === 'times' && data.times && (
              <div style={s.timesList}>
                {(data.times.processingTimes || Object.entries(data.times).map(([k, v]) => ({ category: k, ...v }))).map((item, i) => (
                  <div key={i} style={s.timeRow}>
                    <span style={s.timeCat}>{(item.category || item.name || '').replace(/_/g, ' ')}</span>
                    <div style={s.timeValues}>
                      <span style={s.timeStd}>{item.standard || item.standardDays || '—'}</span>
                      {item.expedited && <span style={s.timeExp}>{item.expedited}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Offices */}
            {tab === 'offices' && data.offices && (
              <div>
                {Object.entries(data.offices.offices || data.offices || {}).map(([type, offices]) => {
                  if (!Array.isArray(offices)) return null;
                  return (
                    <div key={type} style={s.officeSection}>
                      <h3 style={s.officeSectionTitle}>{type.replace(/_/g, ' ')}</h3>
                      <div style={s.officeGrid}>
                        {offices.map((o, i) => (
                          <div key={i} style={s.officeCard}>
                            <h4 style={s.officeName}>{o.name || o.city}</h4>
                            <p style={s.officeAddr}>{o.address}</p>
                            {o.hours && <p style={s.officeHours}>{o.hours}</p>}
                            {o.phone && <p style={s.officePhone}>{o.phone}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Professional Bodies */}
            {tab === 'bodies' && data.bodies && (
              <div style={s.bodiesGrid}>
                {(data.bodies.bodies || data.bodies || []).map((body, i) => (
                  <div key={i} style={s.bodyCard}>
                    <h3 style={s.bodyName}>{body.name}</h3>
                    <p style={s.bodyAbbr}>{body.abbreviation}</p>
                    <p style={s.bodyField}>{body.field || body.fields?.join(', ')}</p>
                    {body.registrationTime && <span style={s.bodyTime}>{body.registrationTime}</span>}
                    {body.website && <a href={body.website} target="_blank" rel="noopener noreferrer" style={s.bodyLink}>Visit Website &rarr;</a>}
                  </div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {tab === 'faq' && data.faq && (
              <div>
                <input type="text" placeholder="Search frequently asked questions..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                {(data.faq.categories || []).map(cat => {
                  const filtered = (cat.questions || []).filter(q => !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.answer.toLowerCase().includes(search.toLowerCase()));
                  if (!filtered.length) return null;
                  return (
                    <div key={cat.category} style={s.faqSection}>
                      <h3 style={s.faqCat}>{cat.category}</h3>
                      {filtered.map((q, i) => {
                        const key = `${cat.category}-${i}`;
                        const open = expandedFaq === key;
                        return (
                          <div key={i} style={s.faqItem} onClick={() => setExpandedFaq(open ? null : key)}>
                            <div style={s.faqQuestion}>
                              <span style={s.faqQ}>{q.question}</span>
                              <span style={s.faqToggle}>{open ? '\u2212' : '+'}</span>
                            </div>
                            {open && (
                              <div style={s.faqAnswer}>
                                <p style={s.faqA}>{q.answer}</p>
                                {q.legalReference && <span style={s.faqRef}>{q.legalReference}</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  title: { fontSize: 32, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 28, maxWidth: 600 },
  tabs: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 32, padding: '4px', background: '#111113', borderRadius: 12 },
  tabBtn: { padding: '8px 14px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  tabActive: { background: '#1a1a1d', color: '#d4a843' },
  searchInput: { width: '100%', padding: '14px 18px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, color: '#fafafa', fontFamily: 'inherit', outline: 'none', marginBottom: 20 },
  muted: { color: '#52525b', fontSize: 14, textAlign: 'center', padding: 40 },

  // Overview
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 },
  statCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: 28, fontWeight: 800, color: '#d4a843', letterSpacing: '-0.02em' },
  statLabel: { display: 'block', fontSize: 12, color: '#52525b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 },
  quickBtn: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', fontSize: 14, fontWeight: 600, color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' },
  quickArrow: { color: '#d4a843', fontSize: 16 },

  // Visas
  visaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  visaCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s' },
  visaName: { fontSize: 15, fontWeight: 700, color: '#fafafa' },
  visaDesc: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, flex: 1 },
  visaMeta: { display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' },
  visaDur: { fontSize: 11, color: '#d4a843', fontWeight: 600 },
  visaRef: { fontSize: 11, color: '#52525b', fontStyle: 'italic' },

  // Skills
  skillSection: { marginBottom: 28 },
  skillCat: { fontSize: 16, fontWeight: 700, color: '#d4a843', marginBottom: 12 },
  skillCount: { fontSize: 13, color: '#52525b', fontWeight: 400 },
  skillList: { display: 'flex', flexDirection: 'column', gap: 6 },
  skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', flexWrap: 'wrap', gap: 8 },
  skillInfo: { display: 'flex', flexDirection: 'column' },
  skillTitle: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  skillOfo: { fontSize: 11, color: '#52525b' },
  skillRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  skillQual: { fontSize: 12, color: '#a1a1aa' },
  skillBody: { fontSize: 11, color: '#d4a843' },

  // Country
  countrySearch: { display: 'flex', gap: 12, marginBottom: 24 },
  countryResults: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 },
  countryName: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  countryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 },
  countryItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px' },
  countryLabel: { display: 'block', fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  countryValue: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  countryNotes: { marginTop: 12, padding: 16, background: 'rgba(212,168,67,0.06)', borderRadius: 10, border: '1px solid rgba(212,168,67,0.1)' },
  noteTitle: { fontSize: 13, fontWeight: 700, color: '#d4a843', marginBottom: 6 },
  noteText: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6 },

  // Documents
  docsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  docCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 20px' },
  docTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  docDesc: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 12 },
  docTip: { fontSize: 12, color: '#d4a843', background: 'rgba(212,168,67,0.06)', padding: '8px 12px', borderRadius: 8, lineHeight: 1.5 },
  tipLabel: { fontWeight: 700 },

  // Fees
  feeSection: { marginBottom: 24 },
  feeCat: { fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 10, textTransform: 'capitalize' },
  feeList: { display: 'flex', flexDirection: 'column', gap: 4 },
  feeRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 },
  feeName: { fontSize: 13, color: '#a1a1aa', textTransform: 'capitalize' },
  feeAmount: { fontSize: 14, fontWeight: 700, color: '#d4a843' },

  // Times
  timesList: { display: 'flex', flexDirection: 'column', gap: 6 },
  timeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 },
  timeCat: { fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize', flex: 1 },
  timeValues: { display: 'flex', gap: 12, alignItems: 'center' },
  timeStd: { fontSize: 13, color: '#a1a1aa' },
  timeExp: { fontSize: 12, color: '#22c55e', fontWeight: 600 },

  // Offices
  officeSection: { marginBottom: 28 },
  officeSectionTitle: { fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 12, textTransform: 'capitalize' },
  officeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 },
  officeCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 18px' },
  officeName: { fontSize: 14, fontWeight: 700, color: '#fafafa', marginBottom: 6 },
  officeAddr: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 },
  officeHours: { fontSize: 12, color: '#52525b', marginTop: 6 },
  officePhone: { fontSize: 12, color: '#d4a843', marginTop: 4 },

  // Bodies
  bodiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  bodyCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 20px' },
  bodyName: { fontSize: 14, fontWeight: 700, color: '#fafafa', marginBottom: 2 },
  bodyAbbr: { fontSize: 13, fontWeight: 600, color: '#d4a843', marginBottom: 6 },
  bodyField: { fontSize: 13, color: '#a1a1aa', marginBottom: 8 },
  bodyTime: { display: 'block', fontSize: 12, color: '#52525b', marginBottom: 6 },
  bodyLink: { fontSize: 13, fontWeight: 600, color: '#d4a843', textDecoration: 'none' },

  // FAQ
  faqSection: { marginBottom: 28 },
  faqCat: { fontSize: 16, fontWeight: 700, color: '#d4a843', marginBottom: 12 },
  faqItem: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 6, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s' },
  faqQuestion: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' },
  faqQ: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  faqToggle: { fontSize: 18, color: '#d4a843', fontWeight: 300 },
  faqAnswer: { padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' },
  faqA: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.7, paddingTop: 12 },
  faqRef: { display: 'block', fontSize: 11, color: '#52525b', fontStyle: 'italic', marginTop: 8 },
};

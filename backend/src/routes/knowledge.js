const express = require('express');
const { VISA_CATEGORIES, VISA_GROUPS } = require('../data/visaCategories');
const CRITICAL_SKILLS_LIST = require('../data/criticalSkillsList');
const {
  VISA_EXEMPT_COUNTRIES,
  YELLOW_FEVER_COUNTRIES,
  DOCUMENT_LEGALIZATION,
  COUNTRY_SPECIFIC_NOTES,
  PROCESSING_TIMES,
  FEE_SCHEDULE,
  DHA_OFFICES,
  PROFESSIONAL_BODIES,
} = require('../data/countryRequirements');
const IMMIGRATION_FAQ = require('../data/immigrationFAQ');

const router = express.Router();

// All knowledge routes are public - no auth required
// This is intentional: people must never need to leave the app for information

// GET /api/knowledge/overview - Complete knowledge base overview
router.get('/overview', (req, res) => {
  res.json({
    visaCategories: Object.keys(VISA_CATEGORIES).length,
    visaGroups: VISA_GROUPS.length,
    criticalSkillsCategories: CRITICAL_SKILLS_LIST.length,
    totalCriticalSkills: CRITICAL_SKILLS_LIST.reduce((sum, cat) => sum + cat.skills.length, 0),
    exemptCountries: VISA_EXEMPT_COUNTRIES.exempt_90_days.length + VISA_EXEMPT_COUNTRIES.exempt_30_days.length,
    dhaOffices: DHA_OFFICES.length,
    professionalBodies: Object.keys(PROFESSIONAL_BODIES).length,
    faqCategories: IMMIGRATION_FAQ.length,
    totalFAQs: IMMIGRATION_FAQ.reduce((sum, cat) => sum + cat.questions.length, 0),
  });
});

// GET /api/knowledge/visa-categories - All visa categories with full details
router.get('/visa-categories', (req, res) => {
  const { group, search } = req.query;

  let categories = Object.values(VISA_CATEGORIES);

  if (group && group !== 'all') {
    categories = categories.filter((c) => c.category === group);
  }

  if (search) {
    const q = search.toLowerCase();
    categories = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.legalReference.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  res.json({
    total: categories.length,
    groups: VISA_GROUPS,
    categories,
  });
});

// GET /api/knowledge/visa-categories/:id - Single visa category with ALL details
router.get('/visa-categories/:id', (req, res) => {
  const category = Object.values(VISA_CATEGORIES).find((c) => c.id === req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Visa category not found' });
  }

  // Enrich with processing times and fees
  const processingTime = PROCESSING_TIMES[category.id] || null;

  res.json({
    ...category,
    processingTime,
    relatedFAQ: findRelatedFAQ(category.id),
  });
});

// GET /api/knowledge/critical-skills - Full critical skills list
router.get('/critical-skills', (req, res) => {
  const { category, search } = req.query;

  let results = CRITICAL_SKILLS_LIST;

  if (category) {
    results = results.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.map((cat) => ({
      ...cat,
      skills: cat.skills.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.ofoCode.includes(q) ||
          s.qualificationRequired.toLowerCase().includes(q) ||
          s.professionalBody.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.skills.length > 0);
  }

  const totalSkills = results.reduce((sum, cat) => sum + cat.skills.length, 0);

  res.json({
    totalCategories: results.length,
    totalSkills,
    categories: results,
  });
});

// GET /api/knowledge/country/:country - Country-specific requirements
router.get('/country/:country', (req, res) => {
  const country = req.params.country;
  const countryLower = country.toLowerCase();

  // Check visa exemption
  const isExempt90 = VISA_EXEMPT_COUNTRIES.exempt_90_days.some(
    (c) => c.toLowerCase() === countryLower
  );
  const isExempt30 = VISA_EXEMPT_COUNTRIES.exempt_30_days.some(
    (c) => c.toLowerCase() === countryLower
  );
  const isSADC = VISA_EXEMPT_COUNTRIES.sadc_members.some(
    (c) => c.toLowerCase() === countryLower
  );

  // Check yellow fever
  const needsYellowFever = YELLOW_FEVER_COUNTRIES.required.some(
    (c) => c.toLowerCase() === countryLower
  );

  // Check apostille
  const isApostilleCountry = DOCUMENT_LEGALIZATION.apostilleCountries.some(
    (c) => c.toLowerCase() === countryLower
  );

  // Country-specific notes
  const specificNotes = Object.entries(COUNTRY_SPECIFIC_NOTES).find(
    ([key]) => key.toLowerCase() === countryLower
  );

  res.json({
    country,
    visaExemption: {
      exempt: isExempt90 || isExempt30,
      duration: isExempt90 ? '90 days' : isExempt30 ? '30 days' : 'Visa required',
      type: isExempt90 ? 'exempt_90' : isExempt30 ? 'exempt_30' : 'visa_required',
    },
    sadc: { isMember: isSADC },
    yellowFever: {
      required: needsYellowFever,
      details: needsYellowFever
        ? `Yellow fever vaccination certificate is REQUIRED. ${YELLOW_FEVER_COUNTRIES.notes}`
        : 'Yellow fever certificate not required from this country.',
    },
    documentLegalization: {
      apostilleCountry: isApostilleCountry,
      process: isApostilleCountry
        ? DOCUMENT_LEGALIZATION.legalizationProcess.apostille
        : DOCUMENT_LEGALIZATION.legalizationProcess.nonApostille,
    },
    countryNotes: specificNotes ? specificNotes[1] : null,
  });
});

// GET /api/knowledge/processing-times - All processing times
router.get('/processing-times', (req, res) => {
  const enriched = Object.entries(PROCESSING_TIMES).map(([id, times]) => {
    const category = Object.values(VISA_CATEGORIES).find((c) => c.id === id);
    return {
      visaCategoryId: id,
      visaCategoryName: category ? category.name : id,
      visaCategoryGroup: category ? category.category : 'unknown',
      ...times,
    };
  });

  res.json({ processingTimes: enriched });
});

// GET /api/knowledge/fees - Complete fee schedule
router.get('/fees', (req, res) => {
  res.json({
    dhaFees: FEE_SCHEDULE,
    notes: [
      'All fees are in South African Rand (ZAR)',
      'Fees are subject to change - always confirm with DHA or VFS',
      'VFS service fees are separate from DHA application fees',
      'Some fees may vary by VFS location',
      'Payment methods accepted: cash, card, EFT (varies by location)',
    ],
  });
});

// GET /api/knowledge/dha-offices - All DHA and VFS offices
router.get('/dha-offices', (req, res) => {
  const { type, province } = req.query;

  let offices = DHA_OFFICES;

  if (type) {
    offices = offices.filter((o) => o.type === type);
  }

  if (province) {
    offices = offices.filter(
      (o) => o.province.toLowerCase().includes(province.toLowerCase())
    );
  }

  res.json({
    total: offices.length,
    offices,
    types: {
      vfs_centre: 'VFS Global Application Centre',
      dha_office: 'Department of Home Affairs Office',
      refugee_office: 'Refugee Reception Office',
    },
  });
});

// GET /api/knowledge/professional-bodies - Professional registration bodies
router.get('/professional-bodies', (req, res) => {
  const { field } = req.query;

  let bodies = Object.entries(PROFESSIONAL_BODIES).map(([code, body]) => ({
    code,
    ...body,
  }));

  if (field) {
    const q = field.toLowerCase();
    bodies = bodies.filter(
      (b) =>
        b.fields.some((f) => f.toLowerCase().includes(q)) ||
        b.name.toLowerCase().includes(q)
    );
  }

  res.json({ total: bodies.length, bodies });
});

// GET /api/knowledge/faq - Immigration FAQ
router.get('/faq', (req, res) => {
  const { category, search } = req.query;

  let results = IMMIGRATION_FAQ;

  if (category) {
    results = results.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (faq) => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.questions.length > 0);
  }

  const totalQuestions = results.reduce((sum, cat) => sum + cat.questions.length, 0);

  res.json({
    totalCategories: results.length,
    totalQuestions,
    categories: results,
  });
});

// GET /api/knowledge/visa-exempt-countries - All visa exemption lists
router.get('/visa-exempt-countries', (req, res) => {
  res.json({
    exempt90Days: VISA_EXEMPT_COUNTRIES.exempt_90_days,
    exempt30Days: VISA_EXEMPT_COUNTRIES.exempt_30_days,
    sadcMembers: VISA_EXEMPT_COUNTRIES.sadc_members,
    brics: VISA_EXEMPT_COUNTRIES.brics_special,
    totalExempt: VISA_EXEMPT_COUNTRIES.exempt_90_days.length + VISA_EXEMPT_COUNTRIES.exempt_30_days.length,
  });
});

// GET /api/knowledge/checklist/:visaCategoryId - Complete document checklist for a visa
router.get('/checklist/:visaCategoryId', (req, res) => {
  const category = Object.values(VISA_CATEGORIES).find(
    (c) => c.id === req.params.visaCategoryId
  );
  if (!category) {
    return res.status(404).json({ error: 'Visa category not found' });
  }

  const processingTime = PROCESSING_TIMES[category.id] || null;

  res.json({
    visaCategory: category.name,
    legalReference: category.legalReference,
    maxDuration: category.maxDuration,
    processingTime,
    fees: category.fees,
    eligibility: category.eligibility,
    requiredDocuments: category.requiredDocuments.filter((d) => d.required),
    optionalDocuments: category.requiredDocuments.filter((d) => !d.required),
    commonRejectionReasons: category.commonRejectionReasons,
    tips: generateTips(category.id),
  });
});

// Helper: find FAQ related to a visa category
function findRelatedFAQ(categoryId) {
  const related = [];
  const keywords = categoryId.replace(/_/g, ' ').split(' ');

  for (const cat of IMMIGRATION_FAQ) {
    for (const faq of cat.questions) {
      const text = (faq.q + ' ' + faq.a).toLowerCase();
      if (keywords.some((kw) => kw.length > 3 && text.includes(kw))) {
        related.push({ category: cat.category, ...faq });
      }
    }
  }

  return related.slice(0, 5);
}

// Helper: generate tips for a visa category
function generateTips(categoryId) {
  const tips = [
    'Apply well in advance of your intended travel/start date',
    'Ensure all documents are certified copies (not originals unless specified)',
    'Keep copies of everything you submit',
    'Medical and police clearance certificates must be less than 6 months old',
  ];

  const categoryTips = {
    general_work: [
      'Start the DOL recommendation process as early as possible (4-6 weeks)',
      'Ensure your employer has proper CIPC registration and tax clearance',
      'Get your SAQA evaluation done before starting the visa application',
    ],
    critical_skills: [
      'Verify your skill is on the CURRENT Critical Skills List before applying',
      'Register with the relevant professional body BEFORE applying',
      'You have 12 months to find employment after visa is issued',
    ],
    study_visa: [
      'Confirm your institution is registered with DHA before accepting admission',
      'Financial proof must cover FULL duration of studies (tuition + living costs)',
      'If under 18, both parents must provide notarized consent',
    ],
    spousal_visa: [
      'Collect relationship evidence over time (photos, messages, joint accounts)',
      'Foreign marriage certificates need apostille or embassy legalization',
      'Be prepared for a possible DHA interview to verify the relationship',
    ],
    business_visa: [
      'The ZAR 5,000,000 minimum investment must be demonstrable',
      'Get the DTI recommendation before applying to DHA',
      'Business plan must be detailed and professionally prepared',
    ],
    remote_work: [
      'Minimum annual income must be ZAR 1,000,000 equivalent',
      'Employment must be with a company OUTSIDE South Africa',
      'Comprehensive medical insurance is mandatory',
    ],
    pr_direct_residence: [
      'Your 5-year work visa history must be CONTINUOUS - no gaps',
      'Start gathering documents well before the 5-year mark',
      'PR applications have significant backlogs - be patient',
    ],
  };

  return [...tips, ...(categoryTips[categoryId] || [])];
}

module.exports = router;

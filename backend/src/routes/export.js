const express = require('express');
const { authenticate } = require('../middleware/auth');
const Application = require('../models/Application');
const Applicant = require('../models/Applicant');
const Document = require('../models/Document');
const pdfService = require('../services/pdfExportService');
const EligibilityEngine = require('../services/eligibilityEngine');
const { VISA_CATEGORIES } = require('../data/visaCategories');

const router = express.Router();

router.use(authenticate);

// POST /api/export/application/:id - Export application as PDF HTML
router.post('/application/:id', (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (application.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const applicant = Applicant.findByUserId(req.user.id);
    if (!applicant) return res.status(404).json({ error: 'Applicant profile not found' });

    const documents = Document.findByApplicationId(application.id);

    // Get eligibility data if available
    let eligibility = null;
    if (application.eligibilityScore != null) {
      eligibility = {
        score: application.eligibilityScore,
        eligible: application.eligibilityScore >= 60,
        riskFlags: application.riskFlags || [],
      };
    }

    const result = pdfService.generateApplicationCoverSheet(
      application,
      { ...applicant, firstName: req.user.firstName, lastName: req.user.lastName },
      documents,
      eligibility
    );

    Application.addAuditEntry(
      application.id,
      'pdf_exported',
      'Application package exported as PDF',
      req.user.id
    );

    res.json({
      html: result.html,
      filename: result.filename,
      metadata: result.metadata,
    });
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// POST /api/export/checklist/:visaCategoryId - Export document checklist as PDF HTML
router.post('/checklist/:visaCategoryId', (req, res) => {
  try {
    const result = pdfService.generateChecklist(
      req.params.visaCategoryId,
      req.body.applicantName || null
    );

    if (!result) return res.status(404).json({ error: 'Visa category not found' });

    res.json({
      html: result.html,
      filename: result.filename,
    });
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// POST /api/export/eligibility - Export eligibility report as PDF HTML
router.post('/eligibility', (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ error: 'Profile data required' });

    const evaluation = EligibilityEngine.evaluate(profile);

    const result = pdfService.generateEligibilityReport(profile, evaluation);

    res.json({
      html: result.html,
      filename: result.filename,
      evaluation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;

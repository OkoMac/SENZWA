const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Document = require('../models/Document');
const DocumentValidator = require('../services/documentValidator');
const EligibilityEngine = require('../services/eligibilityEngine');
const Applicant = require('../models/Applicant');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications - Create a new application
router.post(
  '/',
  authenticate,
  [
    body('visaCategoryId').trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const applicant = Applicant.findByUserId(req.user.id);
      if (!applicant) {
        return res.status(400).json({ error: 'Please complete onboarding before creating an application' });
      }

      const application = Application.create({
        applicantId: applicant.id,
        visaCategoryId: req.body.visaCategoryId,
        userId: req.user.id,
      });

      res.status(201).json({
        message: 'Application created',
        application,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create application' });
    }
  }
);

// GET /api/applications - List user's applications
router.get('/', authenticate, (req, res) => {
  try {
    const result = Application.list({
      userId: req.user.id,
      status: req.query.status,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list applications' });
  }
});

// GET /api/applications/:id - Get application details
router.get('/:id', authenticate, (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const documents = Document.findByApplicationId(application.id);

    res.json({ application, documents });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// PUT /api/applications/:id/status - Update application status
router.put('/:id/status', authenticate, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'documents_pending', 'under_review', 'compiled', 'submitted', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    Application.update(req.params.id, { status });
    Application.addAuditEntry(
      req.params.id,
      'status_changed',
      `Status changed to ${status}`,
      req.user.id
    );

    res.json({
      message: 'Status updated',
      application: Application.findById(req.params.id),
    });
  } catch (err) {
    res.status(500).json({ error: 'Status update failed' });
  }
});

// POST /api/applications/:id/compile - Compile application package
router.post('/:id/compile', authenticate, (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const applicant = Applicant.findById(application.applicantId);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const documents = Document.findByApplicationId(application.id);
    const eligibility = EligibilityEngine.evaluateCategory(
      applicant,
      require('../data/visaCategories').VISA_CATEGORIES[
        Object.keys(require('../data/visaCategories').VISA_CATEGORIES).find(
          (k) => require('../data/visaCategories').VISA_CATEGORIES[k].id === application.visaCategoryId
        )
      ]
    );

    const compiledPackage = DocumentValidator.compileApplicationPackage(
      application,
      documents,
      eligibility
    );

    Application.update(application.id, {
      compiledPackage,
      eligibilityScore: eligibility.eligibilityScore,
      status: compiledPackage.packageReady ? 'compiled' : 'documents_pending',
    });

    Application.addAuditEntry(
      application.id,
      'application_compiled',
      `Package compiled. Ready: ${compiledPackage.packageReady}. Completeness: ${compiledPackage.completeness.completionPercentage}%`,
      req.user.id
    );

    res.json({
      message: compiledPackage.packageReady
        ? 'Application package compiled and ready for submission'
        : 'Application package incomplete - see missing documents',
      package: compiledPackage,
    });
  } catch (err) {
    res.status(500).json({ error: 'Compilation failed: ' + err.message });
  }
});

// GET /api/applications/:id/audit - Get application audit trail
router.get('/:id/audit', authenticate, (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      applicationId: application.id,
      auditTrail: application.auditTrail,
      totalEntries: application.auditTrail.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

module.exports = router;

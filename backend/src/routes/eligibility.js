const express = require('express');
const { body, validationResult } = require('express-validator');
const EligibilityEngine = require('../services/eligibilityEngine');
const Applicant = require('../models/Applicant');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/eligibility/evaluate - Evaluate eligibility for all visa categories
router.post(
  '/evaluate',
  authenticate,
  [
    body('nationality').trim().notEmpty(),
    body('purposeOfStay').trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = req.body;
      const evaluation = EligibilityEngine.evaluate(profile);

      res.json({
        message: 'Eligibility evaluation complete',
        evaluation,
      });
    } catch (err) {
      res.status(500).json({ error: 'Eligibility evaluation failed' });
    }
  }
);

// POST /api/eligibility/recommend - Get recommended visa pathway
router.post(
  '/recommend',
  authenticate,
  [
    body('nationality').trim().notEmpty(),
    body('purposeOfStay').trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = req.body;
      const recommendation = EligibilityEngine.getRecommendedPathway(profile);

      res.json({
        message: 'Pathway recommendation generated',
        recommendation,
      });
    } catch (err) {
      res.status(500).json({ error: 'Recommendation generation failed' });
    }
  }
);

// GET /api/eligibility/my-evaluation - Evaluate based on saved applicant profile
router.get('/my-evaluation', authenticate, (req, res) => {
  try {
    const applicant = Applicant.findByUserId(req.user.id);
    if (!applicant) {
      return res.status(404).json({ error: 'Please complete onboarding first' });
    }

    const evaluation = EligibilityEngine.evaluate(applicant);

    res.json({
      message: 'Eligibility evaluation complete',
      evaluation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

// POST /api/eligibility/check-category - Check eligibility for a specific category
router.post(
  '/check-category',
  authenticate,
  [
    body('categoryId').trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { categoryId, ...profile } = req.body;

      const { VISA_CATEGORIES } = require('../data/visaCategories');
      const categoryKey = Object.keys(VISA_CATEGORIES).find(
        (k) => VISA_CATEGORIES[k].id === categoryId
      );

      if (!categoryKey) {
        return res.status(404).json({ error: 'Visa category not found' });
      }

      const category = VISA_CATEGORIES[categoryKey];
      const evaluation = EligibilityEngine.evaluateCategory(profile, category);

      res.json({
        categoryId,
        categoryName: category.name,
        ...evaluation,
      });
    } catch (err) {
      res.status(500).json({ error: 'Category evaluation failed' });
    }
  }
);

module.exports = router;

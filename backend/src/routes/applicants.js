const express = require('express');
const { body, validationResult } = require('express-validator');
const Applicant = require('../models/Applicant');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/applicants - Create applicant profile (onboarding)
router.post(
  '/',
  authenticate,
  [
    body('passportNumber').trim().notEmpty(),
    body('nationality').trim().notEmpty(),
    body('countryOfOrigin').trim().notEmpty(),
    body('dateOfBirth').isISO8601(),
    body('gender').isIn(['male', 'female', 'other']),
    body('purposeOfStay').trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existing = Applicant.findByUserId(req.user.id);
      if (existing) {
        return res.status(409).json({ error: 'Applicant profile already exists' });
      }

      const applicant = Applicant.create({
        userId: req.user.id,
        ...req.body,
      });

      res.status(201).json({
        message: 'Applicant profile created',
        applicant,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create applicant profile' });
    }
  }
);

// GET /api/applicants/me - Get current user's applicant profile
router.get('/me', authenticate, (req, res) => {
  try {
    const applicant = Applicant.findByUserId(req.user.id);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant profile not found. Please complete onboarding.' });
    }
    res.json({ applicant });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicant profile' });
  }
});

// PUT /api/applicants/me - Update applicant profile
router.put('/me', authenticate, (req, res) => {
  try {
    const applicant = Applicant.findByUserId(req.user.id);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant profile not found' });
    }

    const updated = Applicant.update(applicant.id, req.body);
    res.json({ message: 'Profile updated', applicant: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/applicants/:id - Get applicant by ID (agents/admin)
router.get('/:id', authenticate, (req, res) => {
  try {
    const applicant = Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    res.json({ applicant });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicant' });
  }
});

module.exports = router;

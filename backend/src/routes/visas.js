const express = require('express');
const { VISA_CATEGORIES, VISA_GROUPS } = require('../data/visaCategories');
const EligibilityEngine = require('../services/eligibilityEngine');

const router = express.Router();

// GET /api/visas/categories - List all visa categories
router.get('/categories', (req, res) => {
  const categories = Object.values(VISA_CATEGORIES).map((cat) => ({
    id: cat.id,
    name: cat.name,
    category: cat.category,
    description: cat.description,
    legalReference: cat.legalReference,
    maxDuration: cat.maxDuration,
    fees: cat.fees,
  }));

  res.json({
    total: categories.length,
    groups: VISA_GROUPS,
    categories,
  });
});

// GET /api/visas/categories/:id - Get visa category details
router.get('/categories/:id', (req, res) => {
  const categoryKey = Object.keys(VISA_CATEGORIES).find(
    (k) => VISA_CATEGORIES[k].id === req.params.id
  );

  if (!categoryKey) {
    return res.status(404).json({ error: 'Visa category not found' });
  }

  const category = VISA_CATEGORIES[categoryKey];
  res.json({ category });
});

// GET /api/visas/categories/:id/documents - Get required documents for a category
router.get('/categories/:id/documents', (req, res) => {
  try {
    const checklist = EligibilityEngine.getDocumentChecklist(req.params.id);
    res.json(checklist);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// GET /api/visas/groups - List visa groups
router.get('/groups', (req, res) => {
  res.json({ groups: VISA_GROUPS });
});

module.exports = router;

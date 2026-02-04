const express = require('express');
const { body, validationResult } = require('express-validator');
const conversationRouter = require('../services/conversationRouter');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/conversation/message - Send a message and get AI response
router.post(
  '/message',
  [body('message').trim().notEmpty().withMessage('Message is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message } = req.body;
      // Use authenticated user ID if available, otherwise use session-based ID
      const userId = req.user?.id || req.ip;

      const response = conversationRouter.processMessage(userId, message, 'text');

      res.json({
        response: {
          text: response.text,
          type: response.type || 'text',
          buttons: response.buttons || null,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
);

// POST /api/conversation/message/auth - Authenticated message (with user context)
router.post(
  '/message/auth',
  authenticate,
  [body('message').trim().notEmpty().withMessage('Message is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message } = req.body;
      const response = conversationRouter.processMessage(req.user.id, message, 'text');

      res.json({
        response: {
          text: response.text,
          type: response.type || 'text',
          buttons: response.buttons || null,
        },
        userId: req.user.id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
);

// GET /api/conversation/suggestions - Get contextual suggestions
router.get('/suggestions', (req, res) => {
  res.json({
    suggestions: [
      'What visas can I apply for?',
      'Check my eligibility',
      'What documents do I need?',
      'How much does it cost?',
      'How long does processing take?',
      'Find VFS offices near me',
    ],
  });
});

module.exports = router;

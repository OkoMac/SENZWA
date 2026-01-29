const express = require('express');
const whatsappService = require('../services/whatsappService');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/whatsapp/webhook - WhatsApp webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const result = whatsappService.verifyWebhook(mode, token, challenge);

  if (result.verified) {
    logger.info('WhatsApp webhook verified');
    return res.status(200).send(result.challenge);
  }

  res.status(403).json({ error: 'Webhook verification failed' });
});

// POST /api/whatsapp/webhook - Receive WhatsApp messages
router.post('/webhook', (req, res) => {
  try {
    const messages = whatsappService.processWebhook(req.body);

    for (const msg of messages) {
      logger.info('WhatsApp message received', {
        from: msg.from,
        type: msg.type,
        text: msg.text?.substring(0, 100),
      });

      // Process message asynchronously
      handleIncomingMessage(msg).catch((err) => {
        logger.error('Failed to process WhatsApp message', { error: err.message });
      });
    }

    // Always respond 200 to WhatsApp
    res.status(200).json({ status: 'received' });
  } catch (err) {
    logger.error('Webhook processing error', { error: err.message });
    res.status(200).json({ status: 'error_logged' });
  }
});

// POST /api/whatsapp/send - Send message (authenticated, for admin/system use)
router.post('/send', authenticate, async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'to and message are required' });
    }

    let result;
    switch (type) {
      case 'welcome':
        result = await whatsappService.sendWelcome(to, message);
        break;
      case 'reminder':
        result = await whatsappService.sendDocumentReminder(to, message, req.body.documents || []);
        break;
      case 'status':
        result = await whatsappService.sendStatusUpdate(to, message, req.body.applicationId, req.body.status, req.body.details);
        break;
      default:
        result = await whatsappService.sendMessage(to, message);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * Handle incoming WhatsApp messages with AI-powered responses
 */
async function handleIncomingMessage(msg) {
  const text = (msg.text || '').trim().toUpperCase();

  // Basic conversational responses
  if (text === 'HELP' || text === 'HI' || text === 'HELLO') {
    await whatsappService.sendMessage(
      msg.from,
      `Welcome to Senzwa MigrateSA! 🇿🇦

I can help you with:
1️⃣ CHECK - Check your visa eligibility
2️⃣ STATUS - Check your application status
3️⃣ DOCS - View required documents
4️⃣ GUIDE - Get step-by-step guidance

Reply with a keyword to get started!`
    );
  } else if (text === 'CHECK') {
    await whatsappService.sendMessage(
      msg.from,
      `To check your visa eligibility, I need some information:

Please tell me:
1. Your nationality
2. Purpose of visit (work, study, business, tourism, family, retirement)
3. How long you plan to stay

Example: "Nigerian, work, 2 years"

Or visit senzwa.co.za to complete the full eligibility assessment.`
    );
  } else if (text === 'STATUS') {
    await whatsappService.sendMessage(
      msg.from,
      `To check your application status, please provide your Application ID.

You can find it in your Senzwa dashboard or in previous messages from us.

Format: STATUS [your-app-id]`
    );
  } else if (text === 'DOCS') {
    await whatsappService.sendInteractiveList(
      msg.from,
      'Document Requirements',
      'Select a visa type to see required documents:',
      'View Visa Types',
      [
        {
          title: 'Common Visa Types',
          rows: [
            { id: 'visitor_tourism', title: 'Tourist Visa', description: 'Tourism and leisure' },
            { id: 'study_visa', title: 'Study Visa', description: 'Educational studies' },
            { id: 'general_work', title: 'General Work Visa', description: 'Employment' },
            { id: 'critical_skills', title: 'Critical Skills', description: 'Critical skills work' },
            { id: 'spousal_visa', title: 'Spousal Visa', description: 'Marriage to SA citizen' },
          ],
        },
      ]
    );
  } else {
    await whatsappService.sendMessage(
      msg.from,
      `Thank you for your message. For the best experience, please visit senzwa.co.za or use these commands:

HELP - Get assistance
CHECK - Check visa eligibility
STATUS - Application status
DOCS - Required documents
GUIDE - Step-by-step guidance`
    );
  }
}

module.exports = router;

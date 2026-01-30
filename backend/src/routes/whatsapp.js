const express = require('express');
const whatsappService = require('../services/whatsappService');
const conversationRouter = require('../services/conversationRouter');
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
 * Handle incoming WhatsApp messages with AI-powered conversational routing
 */
async function handleIncomingMessage(msg) {
  try {
    // Route through the conversational AI engine
    const response = conversationRouter.processMessage(
      msg.from,
      msg.text || '',
      msg.type
    );

    // Send the response based on type
    if (response.buttons && response.buttons.length > 0) {
      await whatsappService.sendInteractiveButtons(
        msg.from,
        response.text,
        response.buttons
      );
    } else {
      await whatsappService.sendMessage(msg.from, response.text);
    }

    logger.info('WhatsApp response sent', {
      to: msg.from,
      responseType: response.type,
      textLength: response.text.length,
    });
  } catch (err) {
    logger.error('Failed to handle WhatsApp message', { error: err.message, from: msg.from });
    // Fallback response
    await whatsappService.sendMessage(
      msg.from,
      'Sorry, I encountered an issue processing your message. Please try again or visit senzwa.co.za for assistance.'
    );
  }
}

module.exports = router;

/**
 * Senzwa WhatsApp Business API Integration Service
 *
 * Handles:
 * - Sending messages to applicants via WhatsApp
 * - Processing incoming messages and webhook events
 * - Templated messages for common workflows
 * - Document upload reminders
 * - Application status updates
 */

const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.apiUrl = config.whatsapp.apiUrl;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.accessToken = config.whatsapp.accessToken;
  }

  /**
   * Send a text message via WhatsApp
   */
  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('WhatsApp message sent', { to, messageId: response.data?.messages?.[0]?.id });
      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error) {
      logger.error('WhatsApp send failed', { to, error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a template message
   */
  async sendTemplate(to, templateName, languageCode, components = []) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('WhatsApp template sent', { to, template: templateName });
      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error) {
      logger.error('WhatsApp template send failed', { to, error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Send interactive button message
   */
  async sendInteractiveButtons(to, bodyText, buttons) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
              buttons: buttons.map((btn, idx) => ({
                type: 'reply',
                reply: { id: btn.id || `btn_${idx}`, title: btn.title },
              })),
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error) {
      logger.error('WhatsApp interactive send failed', { to, error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Send interactive list message
   */
  async sendInteractiveList(to, headerText, bodyText, buttonText, sections) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'list',
            header: { type: 'text', text: headerText },
            body: { text: bodyText },
            action: {
              button: buttonText,
              sections,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data?.messages?.[0]?.id };
    } catch (error) {
      logger.error('WhatsApp list send failed', { to, error: error.message });
      return { success: false, error: error.message };
    }
  }

  // =============================================================
  // Pre-built Message Templates for Senzwa Workflows
  // =============================================================

  /**
   * Welcome message for new applicants
   */
  async sendWelcome(to, firstName) {
    const message = `Welcome to Senzwa MigrateSA, ${firstName}! 🇿🇦

I'm your AI migration assistant. I'll guide you through the South African visa application process step by step.

Here's what I can help you with:
✅ Find the right visa category for you
✅ Check your eligibility
✅ Guide document preparation
✅ Track your application progress
✅ Answer questions about SA immigration

To get started, please tell me:
1️⃣ Your nationality
2️⃣ Why you want to come to South Africa
3️⃣ How long you plan to stay

Type "HELP" anytime for assistance.`;

    return this.sendMessage(to, message);
  }

  /**
   * Visa recommendation message
   */
  async sendVisaRecommendation(to, firstName, recommendation) {
    const message = `Hi ${firstName}, based on your profile, here's our recommendation:

📋 *Recommended Visa: ${recommendation.categoryName}*
📊 Eligibility Score: ${recommendation.eligibilityScore}%
⚖️ Legal Basis: ${recommendation.legalReference}

${recommendation.eligible ? '✅ You appear to meet the key requirements.' : '⚠️ Some requirements need attention.'}

${recommendation.riskFlags.length > 0 ? `\n⚠️ Areas to address:\n${recommendation.riskFlags.map((f) => `• ${f.details}`).join('\n')}` : ''}

Would you like to:
1️⃣ View required documents
2️⃣ Start your application
3️⃣ See alternative visa options

Reply with a number to continue.`;

    return this.sendMessage(to, message);
  }

  /**
   * Document reminder message
   */
  async sendDocumentReminder(to, firstName, missingDocuments) {
    const docList = missingDocuments.map((d) => `• ${d.name}: ${d.description}`).join('\n');

    const message = `Hi ${firstName}, your application is almost complete! 📄

The following documents are still needed:
${docList}

Please upload these documents through the Senzwa app or reply here with photos/PDFs.

⏰ Tip: Medical reports and police clearances must be less than 6 months old.

Need help? Reply "HELP" or call our support line.`;

    return this.sendMessage(to, message);
  }

  /**
   * Application status update message
   */
  async sendStatusUpdate(to, firstName, applicationId, status, details) {
    const statusEmoji = {
      draft: '📝',
      documents_pending: '📄',
      under_review: '🔍',
      compiled: '📦',
      submitted: '✈️',
      approved: '✅',
      rejected: '❌',
    };

    const message = `Hi ${firstName}, here's an update on your application:

${statusEmoji[status] || '📋'} *Status: ${status.replace(/_/g, ' ').toUpperCase()}*
📎 Application ID: ${applicationId.slice(0, 8)}

${details}

Track your full application at: senzwa.co.za/track/${applicationId.slice(0, 8)}

Questions? Reply here or call support.`;

    return this.sendMessage(to, message);
  }

  /**
   * Process incoming webhook from WhatsApp
   */
  processWebhook(body) {
    const entries = [];

    if (body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          if (change.value?.messages) {
            for (const message of change.value.messages) {
              entries.push({
                from: message.from,
                timestamp: message.timestamp,
                type: message.type,
                text: message.text?.body || null,
                interactive: message.interactive || null,
                document: message.document || null,
                image: message.image || null,
              });
            }
          }
        }
      }
    }

    return entries;
  }

  /**
   * Verify webhook token
   */
  verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      return { verified: true, challenge };
    }
    return { verified: false };
  }
}

module.exports = new WhatsAppService();

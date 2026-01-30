/**
 * Senzwa Conversational AI Router
 *
 * Routes incoming messages (WhatsApp, chat, etc.) to appropriate handlers
 * using intent detection and context management.
 *
 * Connects to:
 * - Eligibility Engine for visa assessment
 * - Knowledge Base for FAQ and information
 * - Application state for status updates
 * - Document tracker for missing documents
 */

const { VISA_CATEGORIES, VISA_GROUPS } = require('../data/visaCategories');
const CRITICAL_SKILLS_LIST = require('../data/criticalSkillsList');
const {
  VISA_EXEMPT_COUNTRIES,
  PROCESSING_TIMES,
  FEE_SCHEDULE,
  DHA_OFFICES,
} = require('../data/countryRequirements');
const IMMIGRATION_FAQ = require('../data/immigrationFAQ');
const EligibilityEngine = require('./eligibilityEngine');
const logger = require('../utils/logger');

// Conversation state per user (in-memory)
const sessions = new Map();

class ConversationRouter {
  /**
   * Process an incoming message and generate a response
   */
  processMessage(userId, messageText, messageType = 'text') {
    const session = this.getSession(userId);
    const text = (messageText || '').trim().toLowerCase();

    // Log interaction
    session.history.push({ role: 'user', text: messageText, timestamp: new Date().toISOString() });

    let response;

    // Check for direct commands first
    if (text === 'help' || text === 'menu') {
      response = this.handleHelp();
    } else if (text === 'start' || text === 'hi' || text === 'hello') {
      response = this.handleStart(session);
    } else if (text === 'status' || text.includes('my application') || text.includes('track')) {
      response = this.handleStatusRequest(session);
    } else if (text === 'docs' || text === 'documents' || text.includes('what documents')) {
      response = this.handleDocumentQuery(session, text);
    } else if (text.includes('eligible') || text.includes('qualify') || text.includes('can i')) {
      response = this.handleEligibilityQuery(session, text);
    } else if (text.includes('fee') || text.includes('cost') || text.includes('how much') || text.includes('price')) {
      response = this.handleFeeQuery(text);
    } else if (text.includes('how long') || text.includes('processing time') || text.includes('when will')) {
      response = this.handleProcessingTimeQuery(text);
    } else if (text.includes('office') || text.includes('vfs') || text.includes('where') || text.includes('submit')) {
      response = this.handleOfficeQuery(text);
    } else if (text.includes('critical skill') || text.includes('skills list')) {
      response = this.handleCriticalSkillsQuery(text);
    } else if (text.includes('visa') || text.includes('permit') || text.includes('work') || text.includes('study') || text.includes('business')) {
      response = this.handleVisaQuery(session, text);
    } else if (text.includes('country') || text.includes('exempt') || text.includes('yellow fever')) {
      response = this.handleCountryQuery(text);
    } else {
      // Try FAQ matching
      response = this.handleFAQSearch(text);
    }

    // Log response
    session.history.push({ role: 'assistant', text: response.text, timestamp: new Date().toISOString() });
    session.lastInteraction = new Date().toISOString();

    return response;
  }

  getSession(userId) {
    if (!sessions.has(userId)) {
      sessions.set(userId, {
        userId,
        history: [],
        context: {},
        lastInteraction: null,
        onboardingStep: null,
      });
    }
    return sessions.get(userId);
  }

  handleStart(session) {
    return {
      text: `Welcome to Senzwa MigrateSA! I'm your AI migration assistant.

I can help you with:
1. ELIGIBILITY - Check which visas you qualify for
2. VISAS - Learn about all 22+ visa categories
3. DOCUMENTS - Find out what documents you need
4. FEES - Check application costs
5. PROCESSING - Expected processing times
6. OFFICES - Find VFS/DHA office locations
7. SKILLS - Check the Critical Skills List
8. STATUS - Track your application

Type a number or ask me anything about South African immigration!`,
      type: 'menu',
      buttons: [
        { id: 'eligibility', title: 'Check Eligibility' },
        { id: 'visas', title: 'Browse Visas' },
        { id: 'help', title: 'Help' },
      ],
    };
  }

  handleHelp() {
    return {
      text: `Here's how I can help you:

Type any of these keywords:
- "eligible" or "qualify" - Check visa eligibility
- "visa" + type (e.g. "work visa", "study visa") - Learn about specific visas
- "documents" + visa type - See required documents
- "fees" or "cost" - Application fee information
- "how long" or "processing" - Processing times
- "office" or "VFS" - Find submission locations
- "critical skills" - Check the Critical Skills List
- "status" or "track" - Track your application
- "country" + name - Country-specific requirements

Or ask a question like:
- "Can I work on a visitor visa?"
- "How do I get permanent residence?"
- "What documents do I need for a study visa?"

Type "menu" to see the main menu.`,
      type: 'text',
    };
  }

  handleVisaQuery(session, text) {
    // Try to match a specific visa category
    const categories = Object.values(VISA_CATEGORIES);

    const matches = categories.filter((cat) => {
      const terms = [cat.name.toLowerCase(), cat.id.replace(/_/g, ' '), cat.description.toLowerCase()];
      return terms.some((t) => text.includes(t.substring(0, 15)) || t.includes(text.replace(/visa|permit|about|tell me/g, '').trim()));
    });

    if (matches.length === 1) {
      const cat = matches[0];
      session.context.currentCategory = cat.id;

      const reqDocs = cat.requiredDocuments.filter((d) => d.required);
      const processingTime = PROCESSING_TIMES[cat.id];

      return {
        text: `*${cat.name}*
${cat.legalReference}

${cat.description}

Duration: ${cat.maxDuration}
Fee: ${cat.fees?.application || 'See fee schedule'}
${processingTime ? `Processing: ${processingTime.standard}` : ''}

Key Requirements:
${cat.eligibility.requirements.slice(0, 5).map((r) => `- ${r}`).join('\n')}

Required Documents (${reqDocs.length}):
${reqDocs.slice(0, 6).map((d) => `- ${d.name}`).join('\n')}
${reqDocs.length > 6 ? `... and ${reqDocs.length - 6} more` : ''}

Common Rejection Reasons:
${cat.commonRejectionReasons.slice(0, 3).map((r) => `- ${r}`).join('\n')}

Reply "documents" for the full document list, or "eligible" to check your eligibility for this visa.`,
        type: 'text',
      };
    }

    if (matches.length > 1) {
      return {
        text: `I found ${matches.length} visa categories that match your query:

${matches.map((m, i) => `${i + 1}. *${m.name}* - ${m.description.substring(0, 80)}...`).join('\n\n')}

Which one would you like to know more about? Reply with the number or name.`,
        type: 'list',
      };
    }

    // No specific match - show all groups
    return {
      text: `South Africa has 22+ visa categories across these groups:

*Temporary Residence:*
Tourist, Business Visit, Family Visit, Study, Medical, Remote Work, Retired Person, Exchange

*Work & Business:*
General Work, Critical Skills, Intra-Company Transfer, Corporate, Business/Investment

*Family:*
Relative's, Spousal, Life Partner

*Permanent Residence:*
Section 26 (5-year work), Work-based, Business-based, Financially Independent, Extraordinary Skills

*Refugee/Asylum*

Which category interests you? Be specific, e.g. "critical skills visa" or "study visa".`,
      type: 'text',
    };
  }

  handleEligibilityQuery(session, text) {
    return {
      text: `To check your visa eligibility, I need a few details. Please visit the Senzwa app and use our AI Eligibility Assessment tool for a comprehensive evaluation.

Quick check - tell me:
1. Your nationality
2. Why you want to come to SA (work, study, business, family, etc.)
3. Your qualifications (degree, trade, etc.)

Or visit: senzwa.co.za/eligibility for a full assessment against all 22+ visa categories.

The assessment evaluates:
- All visa categories you may qualify for
- Risk flags and areas to address
- Recommended pathway based on your profile
- Required documents for your best option`,
      type: 'text',
    };
  }

  handleDocumentQuery(session, text) {
    const categoryId = session.context?.currentCategory;
    if (categoryId) {
      const cat = Object.values(VISA_CATEGORIES).find((c) => c.id === categoryId);
      if (cat) {
        return {
          text: `*Documents for ${cat.name}:*

Required:
${cat.requiredDocuments.filter((d) => d.required).map((d) => `- ${d.name}: ${d.description}`).join('\n')}

${cat.requiredDocuments.some((d) => !d.required) ? `Optional:\n${cat.requiredDocuments.filter((d) => !d.required).map((d) => `- ${d.name}: ${d.description}`).join('\n')}` : ''}

Important reminders:
- Medical/radiological reports: must be < 6 months old
- Police clearance: must be < 6 months old
- Foreign documents: need apostille or legalization
- Non-English documents: need sworn translation`,
          type: 'text',
        };
      }
    }

    return {
      text: `Which visa are you applying for? I'll give you the specific document checklist.

Common requests:
- "documents for general work visa"
- "documents for study visa"
- "documents for critical skills visa"
- "documents for spousal visa"

Or tell me the visa type and I'll look it up.`,
      type: 'text',
    };
  }

  handleFeeQuery(text) {
    return {
      text: `*South Africa Visa Application Fees:*

DHA Application Fees:
- Visitor Visa: FREE (most nationalities)
- Temporary Residence (Work/Study/Business): R1,520
- Permanent Residence: R1,520
- Appeal: R1,520

VFS Global Service Fees:
- Processing fee: ~R1,350
- Premium lounge: ~R800 (optional)
- Courier delivery: ~R250 (optional)
- SMS tracking: ~R60 (optional)

Other Costs:
- SAQA evaluation: ~R1,080
- SA Police Clearance: ~R91
- Medical/X-ray: varies
- Sworn translation: varies

Note: Fees may change. Always confirm with DHA or VFS before submitting.`,
      type: 'text',
    };
  }

  handleProcessingTimeQuery(text) {
    const times = Object.entries(PROCESSING_TIMES).map(([id, t]) => {
      const cat = Object.values(VISA_CATEGORIES).find((c) => c.id === id);
      return { name: cat ? cat.name : id, ...t };
    });

    // Check if asking about a specific type
    const specificMatch = times.find((t) =>
      text.includes(t.name.toLowerCase().substring(0, 10))
    );

    if (specificMatch) {
      return {
        text: `*Processing Time: ${specificMatch.name}*

Standard: ${specificMatch.standard}
Expedited: ${specificMatch.expedited}

Note: ${specificMatch.notes}`,
        type: 'text',
      };
    }

    return {
      text: `*Expected Processing Times:*

Visitor Visas: 5-10 working days
Study Visa: 4-8 weeks
Work Visas (General/Critical Skills): 4-12 weeks
Business Visa: 8-12 weeks
Family Visas: 4-8 weeks
Permanent Residence: 8-24 months
Refugee/Asylum: Variable (months to years)

Tips for faster processing:
- Submit a COMPLETE application (incomplete = delays)
- Ensure all documents are certified and current
- Use Senzwa to validate documents before submission
- Apply well in advance of your travel date

Ask about a specific visa type for more detail.`,
      type: 'text',
    };
  }

  handleOfficeQuery(text) {
    const offices = DHA_OFFICES;

    if (text.includes('cape town') || text.includes('western cape')) {
      const filtered = offices.filter((o) => o.province === 'Western Cape');
      return this.formatOffices(filtered, 'Western Cape');
    }
    if (text.includes('johannesburg') || text.includes('joburg') || text.includes('sandton')) {
      const filtered = offices.filter((o) => o.province === 'Gauteng');
      return this.formatOffices(filtered, 'Gauteng');
    }
    if (text.includes('durban') || text.includes('kwazulu')) {
      const filtered = offices.filter((o) => o.province === 'KwaZulu-Natal');
      return this.formatOffices(filtered, 'KwaZulu-Natal');
    }

    return this.formatOffices(offices, 'All Locations');
  }

  formatOffices(offices, region) {
    return {
      text: `*Offices & Centres - ${region}:*

${offices.map((o) => `*${o.name}*\nAddress: ${o.address}\nHours: ${o.operatingHours}\nServices: ${o.services.join(', ')}\n${o.notes ? `Note: ${o.notes}` : ''}`).join('\n\n')}

Tip: Book your appointment at VFS Global in advance. Walk-ins may not be accepted.`,
      type: 'text',
    };
  }

  handleCriticalSkillsQuery(text) {
    const allSkills = CRITICAL_SKILLS_LIST.flatMap((cat) =>
      cat.skills.map((s) => ({ ...s, category: cat.category }))
    );

    // Check if asking about a specific skill
    const searchTerms = text.replace(/critical skill|skills list|is|on the|a|my/gi, '').trim();
    if (searchTerms.length > 3) {
      const matches = allSkills.filter((s) =>
        s.title.toLowerCase().includes(searchTerms) ||
        s.category.toLowerCase().includes(searchTerms)
      );

      if (matches.length > 0) {
        return {
          text: `*Critical Skills List - Search Results:*

${matches.slice(0, 8).map((m) => `*${m.title}* (${m.category})\nOFO: ${m.ofoCode}\nQualification: ${m.qualificationRequired}\nBody: ${m.professionalBody}\nExperience: ${m.minExperience}`).join('\n\n')}
${matches.length > 8 ? `\n... and ${matches.length - 8} more matches.` : ''}

If your skill is listed, you may apply for a Critical Skills Work Visa (Section 19(4)).
No job offer required at time of application!`,
          type: 'text',
        };
      }
    }

    return {
      text: `*SA Critical Skills List Categories:*

${CRITICAL_SKILLS_LIST.map((cat) => `*${cat.category}* (${cat.skills.length} skills)\nExamples: ${cat.skills.slice(0, 3).map((s) => s.title).join(', ')}`).join('\n\n')}

Total: ${allSkills.length} critical skills across ${CRITICAL_SKILLS_LIST.length} categories.

To check if YOUR skill is listed, tell me your job title, e.g. "is software developer on the critical skills list?"`,
      type: 'text',
    };
  }

  handleCountryQuery(text) {
    const countries = [...VISA_EXEMPT_COUNTRIES.exempt_90_days, ...VISA_EXEMPT_COUNTRIES.exempt_30_days];
    const searchTerm = text.replace(/country|exempt|visa|yellow fever|is|from|do i need/gi, '').trim();

    if (searchTerm.length > 2) {
      const match90 = VISA_EXEMPT_COUNTRIES.exempt_90_days.find(
        (c) => c.toLowerCase().includes(searchTerm)
      );
      const match30 = VISA_EXEMPT_COUNTRIES.exempt_30_days.find(
        (c) => c.toLowerCase().includes(searchTerm)
      );

      if (match90 || match30) {
        return {
          text: `*${match90 || match30} - Visa Status:*
Visa Exempt: YES (${match90 ? '90 days' : '30 days'})

Citizens of ${match90 || match30} can visit South Africa for up to ${match90 ? '90' : '30'} days without a visa for tourism or short business visits.

For longer stays or work/study purposes, a visa is still required. Use Senzwa to check your full eligibility.`,
          type: 'text',
        };
      }

      return {
        text: `${searchTerm} does not appear on the visa-exempt list. Citizens likely need a visa for all visit types.

Check the Senzwa Knowledge Hub for country-specific requirements including:
- Yellow fever certificate requirements
- Document legalization process
- Country-specific notes and tips

Visit: senzwa.co.za/knowledge and select "Country Check"`,
        type: 'text',
      };
    }

    return {
      text: `*Visa Exemptions:*

${VISA_EXEMPT_COUNTRIES.exempt_90_days.length} countries have 90-day exemption
${VISA_EXEMPT_COUNTRIES.exempt_30_days.length} countries have 30-day exemption

Tell me your country and I'll check, e.g. "is Nigeria exempt?" or "country United Kingdom"`,
      type: 'text',
    };
  }

  handleStatusRequest(session) {
    return {
      text: `To check your application status:

1. Log in to the Senzwa app at senzwa.co.za
2. Go to Dashboard > Track Application
3. Your application status, documents, and audit trail are all visible

You can also check via:
- VFS Global website (with your reference number)
- DHA Contact Centre
- Visit your VFS centre in person

Need help with something specific about your application? Let me know.`,
      type: 'text',
    };
  }

  handleFAQSearch(text) {
    // Search through all FAQ for a match
    const allFAQs = IMMIGRATION_FAQ.flatMap((cat) =>
      cat.questions.map((q) => ({ ...q, category: cat.category }))
    );

    const matches = allFAQs.filter((faq) => {
      const combined = (faq.q + ' ' + faq.a).toLowerCase();
      const words = text.split(/\s+/).filter((w) => w.length > 3);
      return words.filter((w) => combined.includes(w)).length >= Math.max(1, Math.floor(words.length * 0.4));
    });

    if (matches.length > 0) {
      const best = matches[0];
      return {
        text: `*${best.q}*

${best.a}

${best.legalRef ? `Legal Reference: ${best.legalRef}` : ''}

${matches.length > 1 ? `\nRelated questions:\n${matches.slice(1, 4).map((m) => `- ${m.q}`).join('\n')}` : ''}`,
        type: 'text',
      };
    }

    return {
      text: `I'm not sure I understood that. Here are some things I can help with:

- Type "menu" for the main menu
- Type "help" for a list of commands
- Ask about a specific visa (e.g. "critical skills visa")
- Ask a question (e.g. "can I work on a student visa?")

Or visit the Senzwa Knowledge Hub at senzwa.co.za/knowledge for comprehensive information.`,
      type: 'text',
    };
  }
}

module.exports = new ConversationRouter();

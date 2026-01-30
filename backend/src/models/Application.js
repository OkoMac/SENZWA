const { v4: uuidv4 } = require('uuid');

const applications = [];

class Application {
  static create({ applicantId, visaCategoryId, userId }) {
    const application = {
      id: uuidv4(),
      applicantId,
      visaCategoryId,
      userId,
      status: 'draft', // draft, documents_pending, under_review, compiled, submitted, approved, rejected
      eligibilityScore: null,
      riskFlags: [],
      documents: [],
      compiledPackage: null,
      auditTrail: [
        {
          action: 'application_created',
          timestamp: new Date().toISOString(),
          details: 'Application initiated',
        },
      ],
      submittedAt: null,
      reviewedAt: null,
      decidedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applications.push(application);
    return application;
  }

  static findById(id) {
    return applications.find((a) => a.id === id) || null;
  }

  static findByApplicantId(applicantId) {
    return applications.filter((a) => a.applicantId === applicantId);
  }

  static findByUserId(userId) {
    return applications.filter((a) => a.userId === userId);
  }

  static update(id, updates) {
    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Application not found');

    const allowed = [
      'status', 'eligibilityScore', 'riskFlags', 'documents',
      'compiledPackage', 'submittedAt', 'reviewedAt', 'decidedAt',
    ];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        applications[idx][key] = updates[key];
      }
    }
    applications[idx].updatedAt = new Date().toISOString();
    return applications[idx];
  }

  static addAuditEntry(id, action, details, userId = null) {
    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Application not found');

    applications[idx].auditTrail.push({
      action,
      timestamp: new Date().toISOString(),
      details,
      userId,
    });

    return applications[idx];
  }

  static addDocument(applicationId, document) {
    const idx = applications.findIndex((a) => a.id === applicationId);
    if (idx === -1) throw new Error('Application not found');

    applications[idx].documents.push({
      ...document,
      uploadedAt: new Date().toISOString(),
    });

    return applications[idx];
  }

  static list({ status, userId, page = 1, limit = 20 }) {
    let filtered = [...applications];
    if (status) filtered = filtered.filter((a) => a.status === status);
    if (userId) filtered = filtered.filter((a) => a.userId === userId);

    const start = (page - 1) * limit;
    return {
      applications: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    };
  }
}

module.exports = Application;

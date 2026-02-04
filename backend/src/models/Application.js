const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class Application {
  static async create({ applicantId, visaCategoryId, userId }) {
    const now = new Date().toISOString();
    const application = {
      id: uuidv4(),
      applicant_id: applicantId || null,
      visa_category_id: visaCategoryId,
      user_id: userId,
      status: 'draft',
      eligibility_score: null,
      risk_flags: JSON.stringify([]),
      compiled_package: null,
      audit_trail: JSON.stringify([
        { action: 'application_created', timestamp: now, details: 'Application initiated' },
      ]),
      submitted_at: null,
      reviewed_at: null,
      decided_at: null,
      created_at: now,
      updated_at: now,
    };

    await db('applications').insert(application);
    return Application.toCamel(application);
  }

  static async findById(id) {
    const row = await db('applications').where('id', id).first();
    return row ? Application.toCamel(row) : null;
  }

  static async findByApplicantId(applicantId) {
    const rows = await db('applications').where('applicant_id', applicantId);
    return rows.map(Application.toCamel);
  }

  static async findByUserId(userId) {
    const rows = await db('applications').where('user_id', userId);
    return rows.map(Application.toCamel);
  }

  static async update(id, updates) {
    const mapping = {
      status: 'status', eligibilityScore: 'eligibility_score',
      submittedAt: 'submitted_at', reviewedAt: 'reviewed_at', decidedAt: 'decided_at',
    };
    const jsonFields = {
      riskFlags: 'risk_flags', compiledPackage: 'compiled_package',
    };

    const dbUpdates = {};
    for (const [jsKey, dbKey] of Object.entries(mapping)) {
      if (updates[jsKey] !== undefined) dbUpdates[dbKey] = updates[jsKey];
    }
    for (const [jsKey, dbKey] of Object.entries(jsonFields)) {
      if (updates[jsKey] !== undefined) dbUpdates[dbKey] = JSON.stringify(updates[jsKey]);
    }
    dbUpdates.updated_at = new Date().toISOString();

    const count = await db('applications').where('id', id).update(dbUpdates);
    if (count === 0) throw new Error('Application not found');
    const row = await db('applications').where('id', id).first();
    return Application.toCamel(row);
  }

  static async addAuditEntry(id, action, details, userId = null) {
    const row = await db('applications').where('id', id).first();
    if (!row) throw new Error('Application not found');

    const trail = Application.parseJSON(row.audit_trail) || [];
    trail.push({ action, timestamp: new Date().toISOString(), details, userId });

    await db('applications').where('id', id).update({
      audit_trail: JSON.stringify(trail),
      updated_at: new Date().toISOString(),
    });

    const updated = await db('applications').where('id', id).first();
    return Application.toCamel(updated);
  }

  static async addDocument(applicationId, document) {
    // Documents are now in the documents table, this is a no-op for backward compat
    return Application.findById(applicationId);
  }

  static async list({ status, userId, page = 1, limit = 20 }) {
    let query = db('applications');
    if (status) query = query.where('status', status);
    if (userId) query = query.where('user_id', userId);

    const countResult = await query.clone().count('* as count').first();
    const rows = await query
      .orderBy('created_at', 'desc')
      .offset((page - 1) * limit)
      .limit(limit);

    return {
      applications: rows.map(Application.toCamel),
      total: countResult.count,
      page,
      limit,
    };
  }

  static parseJSON(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') { try { return JSON.parse(val); } catch { return val; } }
    return val;
  }

  static toCamel(row) {
    return {
      id: row.id,
      applicantId: row.applicant_id,
      visaCategoryId: row.visa_category_id,
      userId: row.user_id,
      status: row.status,
      eligibilityScore: row.eligibility_score,
      riskFlags: Application.parseJSON(row.risk_flags) || [],
      documents: [], // Backward compat; docs now in documents table
      compiledPackage: Application.parseJSON(row.compiled_package),
      auditTrail: Application.parseJSON(row.audit_trail) || [],
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      decidedAt: row.decided_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = Application;

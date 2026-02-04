const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class Document {
  static parseJSON(val) {
    if (!val) return null;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return val; }
  }

  static toCamel(row) {
    if (!row) return null;
    return {
      id: row.id,
      applicationId: row.application_id,
      userId: row.user_id,
      type: row.type,
      fileName: row.file_name,
      filePath: row.file_path,
      mimeType: row.mime_type,
      fileSize: row.file_size,
      validationStatus: row.validation_status,
      validationErrors: Document.parseJSON(row.validation_errors) || [],
      extractedData: Document.parseJSON(row.extracted_data),
      expiryDate: row.expiry_date,
      version: row.version,
      uploadedAt: row.uploaded_at,
      validatedAt: row.validated_at,
    };
  }

  static async create({ applicationId, userId, type, fileName, filePath, mimeType, fileSize }) {
    const doc = {
      id: uuidv4(),
      application_id: applicationId,
      user_id: userId,
      type,
      file_name: fileName,
      file_path: filePath,
      mime_type: mimeType,
      file_size: fileSize,
      validation_status: 'pending',
      validation_errors: JSON.stringify([]),
      extracted_data: null,
      expiry_date: null,
      version: 1,
      uploaded_at: new Date().toISOString(),
      validated_at: null,
    };

    await db('documents').insert(doc);
    return Document.toCamel(doc);
  }

  static async findById(id) {
    const row = await db('documents').where('id', id).first();
    return row ? Document.toCamel(row) : null;
  }

  static async findByApplicationId(applicationId) {
    const rows = await db('documents').where('application_id', applicationId);
    return rows.map(Document.toCamel);
  }

  static async findByUserId(userId) {
    const rows = await db('documents').where('user_id', userId);
    return rows.map(Document.toCamel);
  }

  static async update(id, updates) {
    const row = await db('documents').where('id', id).first();
    if (!row) throw new Error('Document not found');

    const mapping = {
      validationStatus: 'validation_status',
      expiryDate: 'expiry_date',
      version: 'version',
    };

    const jsonFields = {
      validationErrors: 'validation_errors',
      extractedData: 'extracted_data',
    };

    const patch = { validated_at: new Date().toISOString() };

    for (const [jsKey, dbCol] of Object.entries(mapping)) {
      if (updates[jsKey] !== undefined) {
        patch[dbCol] = updates[jsKey];
      }
    }
    for (const [jsKey, dbCol] of Object.entries(jsonFields)) {
      if (updates[jsKey] !== undefined) {
        patch[dbCol] = JSON.stringify(updates[jsKey]);
      }
    }

    await db('documents').where('id', id).update(patch);
    const updated = await db('documents').where('id', id).first();
    return Document.toCamel(updated);
  }

  static async delete(id) {
    const row = await db('documents').where('id', id).first();
    if (!row) throw new Error('Document not found');
    await db('documents').where('id', id).del();
    return Document.toCamel(row);
  }
}

module.exports = Document;

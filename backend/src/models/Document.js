const { v4: uuidv4 } = require('uuid');

const documents = [];

class Document {
  static create({
    applicationId,
    userId,
    type,
    fileName,
    filePath,
    mimeType,
    fileSize,
  }) {
    const doc = {
      id: uuidv4(),
      applicationId,
      userId,
      type, // passport, qualification, police_clearance, medical, financial, employment, etc.
      fileName,
      filePath,
      mimeType,
      fileSize,
      validationStatus: 'pending', // pending, valid, invalid, expired
      validationErrors: [],
      extractedData: null,
      expiryDate: null,
      version: 1,
      uploadedAt: new Date().toISOString(),
      validatedAt: null,
    };

    documents.push(doc);
    return doc;
  }

  static findById(id) {
    return documents.find((d) => d.id === id) || null;
  }

  static findByApplicationId(applicationId) {
    return documents.filter((d) => d.applicationId === applicationId);
  }

  static findByUserId(userId) {
    return documents.filter((d) => d.userId === userId);
  }

  static update(id, updates) {
    const idx = documents.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');

    const allowed = [
      'validationStatus', 'validationErrors', 'extractedData',
      'expiryDate', 'version',
    ];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        documents[idx][key] = updates[key];
      }
    }
    documents[idx].validatedAt = new Date().toISOString();
    return documents[idx];
  }

  static delete(id) {
    const idx = documents.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');
    return documents.splice(idx, 1)[0];
  }
}

module.exports = Document;

const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Document = require('../models/Document');
const Application = require('../models/Application');
const DocumentValidator = require('../services/documentValidator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

// POST /api/documents/upload - Upload a document
router.post('/upload', authenticate, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { applicationId, documentType } = req.body;

    if (!applicationId || !documentType) {
      return res.status(400).json({ error: 'applicationId and documentType are required' });
    }

    // Validate upload
    const uploadValidation = DocumentValidator.validateUpload(
      {
        mimeType: req.file.mimetype,
        size: req.file.size,
        originalName: req.file.originalname,
      },
      documentType
    );

    if (!uploadValidation.valid) {
      return res.status(400).json({
        error: 'Document validation failed',
        details: uploadValidation.errors,
      });
    }

    // Create document record
    const doc = Document.create({
      applicationId,
      userId: req.user.id,
      type: documentType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    // Add to application audit trail
    Application.addAuditEntry(
      applicationId,
      'document_uploaded',
      `Document uploaded: ${documentType} (${req.file.originalname})`,
      req.user.id
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: doc,
      validation: uploadValidation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Document upload failed: ' + err.message });
  }
});

// GET /api/documents/application/:applicationId - Get documents for an application
router.get('/application/:applicationId', authenticate, (req, res) => {
  try {
    const documents = Document.findByApplicationId(req.params.applicationId);
    res.json({ documents, total: documents.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/documents/:id/validate - Validate a document's content
router.post('/:id/validate', authenticate, (req, res) => {
  try {
    const doc = Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { extractedData } = req.body;
    const validation = DocumentValidator.validateDocumentContent(doc.type, extractedData || {});

    // Update document record
    Document.update(doc.id, {
      validationStatus: validation.valid ? 'valid' : 'invalid',
      validationErrors: validation.errors,
      extractedData,
    });

    res.json({
      message: 'Document validated',
      validation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Document validation failed' });
  }
});

// POST /api/documents/check-completeness - Check document completeness for a visa category
router.post('/check-completeness', authenticate, (req, res) => {
  try {
    const { applicationId, visaCategoryId } = req.body;

    if (!applicationId || !visaCategoryId) {
      return res.status(400).json({ error: 'applicationId and visaCategoryId required' });
    }

    const documents = Document.findByApplicationId(applicationId);
    const completeness = DocumentValidator.checkCompleteness(visaCategoryId, documents);

    res.json(completeness);
  } catch (err) {
    res.status(500).json({ error: 'Completeness check failed: ' + err.message });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', authenticate, (req, res) => {
  try {
    const doc = Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (doc.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this document' });
    }

    Document.delete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;

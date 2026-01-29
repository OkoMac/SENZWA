/**
 * Senzwa Document Validation Service
 *
 * Validates uploaded documents against requirements for each visa category.
 * Performs:
 * - File type and size validation
 * - Document type matching
 * - Expiry date checking
 * - Completeness verification
 * - Consistency checks across documents
 */

const { VISA_CATEGORIES } = require('../data/visaCategories');
const logger = require('../utils/logger');

class DocumentValidator {
  static ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Validate a single document upload
   */
  static validateUpload(file, documentType) {
    const errors = [];

    // File type check
    if (!DocumentValidator.ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      errors.push({
        code: 'INVALID_FILE_TYPE',
        message: `File type ${file.mimeType} is not accepted. Allowed types: PDF, JPEG, PNG, TIFF, DOC, DOCX`,
      });
    }

    // File size check
    if (file.size > DocumentValidator.MAX_FILE_SIZE) {
      errors.push({
        code: 'FILE_TOO_LARGE',
        message: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum of 10MB`,
      });
    }

    // File name check
    if (!file.originalName || file.originalName.length < 3) {
      errors.push({
        code: 'INVALID_FILE_NAME',
        message: 'File must have a valid name',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      documentType,
      fileName: file.originalName,
      fileSize: file.size,
      mimeType: file.mimeType,
      validatedAt: new Date().toISOString(),
    };
  }

  /**
   * Validate document content based on extracted data
   */
  static validateDocumentContent(documentType, extractedData) {
    const errors = [];
    const warnings = [];

    switch (documentType) {
      case 'passport':
        if (extractedData.expiryDate) {
          const expiry = new Date(extractedData.expiryDate);
          const now = new Date();
          const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);

          if (daysUntilExpiry < 0) {
            errors.push({ code: 'PASSPORT_EXPIRED', message: 'Passport has expired' });
          } else if (daysUntilExpiry < 30) {
            errors.push({ code: 'PASSPORT_EXPIRY_CRITICAL', message: 'Passport expires within 30 days' });
          } else if (daysUntilExpiry < 180) {
            warnings.push({ code: 'PASSPORT_EXPIRY_WARNING', message: `Passport expires in ${Math.round(daysUntilExpiry)} days. Consider renewal before applying.` });
          }
        }

        if (extractedData.passportNumber && !/^[A-Z0-9]{6,12}$/.test(extractedData.passportNumber)) {
          warnings.push({ code: 'PASSPORT_NUMBER_FORMAT', message: 'Passport number format may be unusual. Please verify.' });
        }
        break;

      case 'police_clearance':
        if (extractedData.issueDate) {
          const issued = new Date(extractedData.issueDate);
          const now = new Date();
          const daysSinceIssue = (now - issued) / (1000 * 60 * 60 * 24);

          if (daysSinceIssue > 180) {
            errors.push({ code: 'POLICE_CLEARANCE_EXPIRED', message: 'Police clearance certificate is older than 6 months' });
          }
        }
        break;

      case 'medical_report':
      case 'radiological_report':
        if (extractedData.issueDate) {
          const issued = new Date(extractedData.issueDate);
          const now = new Date();
          const daysSinceIssue = (now - issued) / (1000 * 60 * 60 * 24);

          if (daysSinceIssue > 180) {
            errors.push({ code: 'MEDICAL_REPORT_EXPIRED', message: 'Medical/radiological report is older than 6 months' });
          }
        }
        break;

      case 'financial_proof':
        if (extractedData.statementDate) {
          const stmtDate = new Date(extractedData.statementDate);
          const now = new Date();
          const daysSince = (now - stmtDate) / (1000 * 60 * 60 * 24);

          if (daysSince > 90) {
            errors.push({ code: 'BANK_STATEMENT_OLD', message: 'Bank statements should be no older than 3 months' });
          }
        }
        break;

      case 'saqa_evaluation':
        if (extractedData.evaluationResult === 'not_recognized') {
          errors.push({ code: 'SAQA_NOT_RECOGNIZED', message: 'SAQA evaluation indicates qualification not recognized' });
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      documentType,
      validatedAt: new Date().toISOString(),
    };
  }

  /**
   * Check completeness of documents for a visa application
   */
  static checkCompleteness(visaCategoryId, uploadedDocuments) {
    const categoryKey = Object.keys(VISA_CATEGORIES).find(
      (k) => VISA_CATEGORIES[k].id === visaCategoryId
    );

    if (!categoryKey) {
      throw new Error(`Unknown visa category: ${visaCategoryId}`);
    }

    const category = VISA_CATEGORIES[categoryKey];
    const requiredDocs = category.requiredDocuments.filter((d) => d.required);
    const optionalDocs = category.requiredDocuments.filter((d) => !d.required);

    const uploadedTypes = new Set(uploadedDocuments.map((d) => d.type));

    const missing = [];
    const provided = [];
    const optional = [];

    for (const doc of requiredDocs) {
      if (uploadedTypes.has(doc.type)) {
        provided.push({ ...doc, status: 'uploaded' });
      } else {
        missing.push({ ...doc, status: 'missing' });
      }
    }

    for (const doc of optionalDocs) {
      optional.push({
        ...doc,
        status: uploadedTypes.has(doc.type) ? 'uploaded' : 'not_uploaded',
      });
    }

    const completionPercentage = requiredDocs.length > 0
      ? Math.round((provided.length / requiredDocs.length) * 100)
      : 100;

    return {
      visaCategoryId,
      visaCategoryName: category.name,
      complete: missing.length === 0,
      completionPercentage,
      totalRequired: requiredDocs.length,
      totalProvided: provided.length,
      totalMissing: missing.length,
      provided,
      missing,
      optional,
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Cross-validate documents for consistency
   */
  static crossValidate(documents) {
    const inconsistencies = [];

    // Extract names from different documents and check consistency
    const names = documents
      .filter((d) => d.extractedData?.fullName)
      .map((d) => ({ docType: d.type, name: d.extractedData.fullName }));

    if (names.length > 1) {
      const firstName = names[0].name;
      for (let i = 1; i < names.length; i++) {
        if (names[i].name !== firstName) {
          inconsistencies.push({
            type: 'name_mismatch',
            message: `Name on ${names[0].docType} ("${firstName}") differs from ${names[i].docType} ("${names[i].name}")`,
            severity: 'high',
          });
        }
      }
    }

    // Check passport numbers across documents
    const passportNumbers = documents
      .filter((d) => d.extractedData?.passportNumber)
      .map((d) => ({ docType: d.type, number: d.extractedData.passportNumber }));

    if (passportNumbers.length > 1) {
      const firstNum = passportNumbers[0].number;
      for (let i = 1; i < passportNumbers.length; i++) {
        if (passportNumbers[i].number !== firstNum) {
          inconsistencies.push({
            type: 'passport_number_mismatch',
            message: `Passport number mismatch between ${passportNumbers[0].docType} and ${passportNumbers[i].docType}`,
            severity: 'critical',
          });
        }
      }
    }

    return {
      consistent: inconsistencies.length === 0,
      inconsistencies,
      documentsChecked: documents.length,
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate a compiled application package summary
   */
  static compileApplicationPackage(application, documents, eligibilityResult) {
    const completeness = DocumentValidator.checkCompleteness(
      application.visaCategoryId,
      documents
    );
    const consistency = DocumentValidator.crossValidate(documents);

    const packageReady = completeness.complete && consistency.consistent;

    return {
      applicationId: application.id,
      visaCategory: application.visaCategoryId,
      packageReady,
      completeness,
      consistency,
      eligibilitySummary: {
        score: eligibilityResult.eligibilityScore,
        eligible: eligibilityResult.eligible,
        riskFlags: eligibilityResult.riskFlags.length,
      },
      documents: documents.map((d) => ({
        id: d.id,
        type: d.type,
        fileName: d.fileName,
        validationStatus: d.validationStatus,
        uploadedAt: d.uploadedAt,
      })),
      compiledAt: new Date().toISOString(),
      auditTrail: {
        action: 'application_compiled',
        packageReady,
        completionPercentage: completeness.completionPercentage,
        consistencyCheck: consistency.consistent,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

module.exports = DocumentValidator;

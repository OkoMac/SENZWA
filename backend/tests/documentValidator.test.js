const DocumentValidator = require('../src/services/documentValidator');

describe('DocumentValidator', () => {
  test('should validate file upload with valid file', () => {
    const file = {
      mimeType: 'application/pdf',
      size: 5 * 1024 * 1024,
      originalName: 'passport.pdf',
    };

    const result = DocumentValidator.validateUpload(file, 'passport');

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid file type', () => {
    const file = {
      mimeType: 'application/zip',
      size: 1024,
      originalName: 'document.zip',
    };

    const result = DocumentValidator.validateUpload(file, 'passport');

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].code).toBe('INVALID_FILE_TYPE');
  });

  test('should reject file exceeding size limit', () => {
    const file = {
      mimeType: 'application/pdf',
      size: 15 * 1024 * 1024,
      originalName: 'large_doc.pdf',
    };

    const result = DocumentValidator.validateUpload(file, 'passport');

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'FILE_TOO_LARGE')).toBe(true);
  });

  test('should detect expired passport', () => {
    const result = DocumentValidator.validateDocumentContent('passport', {
      expiryDate: '2020-01-01',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'PASSPORT_EXPIRED')).toBe(true);
  });

  test('should detect old police clearance', () => {
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 8);

    const result = DocumentValidator.validateDocumentContent('police_clearance', {
      issueDate: oldDate.toISOString(),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'POLICE_CLEARANCE_EXPIRED')).toBe(true);
  });

  test('should check document completeness', () => {
    const uploaded = [
      { type: 'passport' },
      { type: 'photo' },
    ];

    const result = DocumentValidator.checkCompleteness('general_work', uploaded);

    expect(result).toBeDefined();
    expect(result.complete).toBe(false);
    expect(result.completionPercentage).toBeLessThan(100);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  test('should cross-validate documents with matching names', () => {
    const docs = [
      { type: 'passport', extractedData: { fullName: 'John Doe', passportNumber: 'A123' } },
      { type: 'police_clearance', extractedData: { fullName: 'John Doe', passportNumber: 'A123' } },
    ];

    const result = DocumentValidator.crossValidate(docs);

    expect(result.consistent).toBe(true);
    expect(result.inconsistencies).toHaveLength(0);
  });

  test('should detect name mismatches across documents', () => {
    const docs = [
      { type: 'passport', extractedData: { fullName: 'John Doe' } },
      { type: 'police_clearance', extractedData: { fullName: 'Jane Doe' } },
    ];

    const result = DocumentValidator.crossValidate(docs);

    expect(result.consistent).toBe(false);
    expect(result.inconsistencies.length).toBeGreaterThan(0);
  });
});

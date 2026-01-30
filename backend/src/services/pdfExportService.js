/**
 * PDF Export Service for Senzwa MigrateSA
 *
 * Generates structured PDF documents for:
 * - Compiled application packages
 * - Document checklists
 * - Eligibility assessment reports
 * - Audit trail reports
 *
 * Uses HTML-to-PDF generation pattern (compatible with puppeteer, html-pdf, or pdfkit)
 * For production: integrate with puppeteer or a PDF generation API
 */

const { VISA_CATEGORIES } = require('../data/visaCategories');
const { PROCESSING_TIMES } = require('../data/countryRequirements');

class PDFExportService {
  /**
   * Generate a compiled application package cover sheet
   */
  generateApplicationCoverSheet(application, applicant, documents, eligibility) {
    const category = Object.values(VISA_CATEGORIES).find(
      (c) => c.id === application.visaCategoryId
    );

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1a5632; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 800; color: #1a5632; letter-spacing: 2px; }
    .logo-sub { font-size: 14px; color: #666; }
    .title { font-size: 20px; font-weight: 700; margin: 20px 0; color: #1a5632; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: 700; color: #1a5632; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th { text-align: left; padding: 8px 12px; background: #f4f4f4; border: 1px solid #ddd; font-size: 12px; text-transform: uppercase; color: #666; }
    td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; }
    .badge-valid { background: #d4edda; color: #155724; }
    .badge-pending { background: #fff3cd; color: #856404; }
    .badge-invalid { background: #f8d7da; color: #721c24; }
    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 15px; }
    .disclaimer { background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 11px; color: #666; margin-top: 20px; }
    .score { font-size: 24px; font-weight: 800; color: ${eligibility?.score >= 70 ? '#28a745' : '#ffc107'}; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SENZWA</div>
    <div class="logo-sub">MigrateSA - Compiled Application Package</div>
  </div>

  <div class="title">Visa Application: ${category ? category.name : application.visaCategoryId}</div>

  <div class="section">
    <div class="section-title">Application Information</div>
    <table>
      <tr><th>Application ID</th><td>${application.id}</td></tr>
      <tr><th>Visa Category</th><td>${category ? category.name : application.visaCategoryId}</td></tr>
      <tr><th>Legal Reference</th><td>${category ? category.legalReference : 'N/A'}</td></tr>
      <tr><th>Status</th><td>${application.status.replace(/_/g, ' ').toUpperCase()}</td></tr>
      <tr><th>Created</th><td>${new Date(application.createdAt).toLocaleDateString()}</td></tr>
      <tr><th>Compiled</th><td>${new Date().toLocaleDateString()}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Applicant Details</div>
    <table>
      <tr><th>Full Name</th><td>${applicant.firstName || ''} ${applicant.lastName || ''}</td></tr>
      <tr><th>Passport Number</th><td>${applicant.passportNumber}</td></tr>
      <tr><th>Nationality</th><td>${applicant.nationality}</td></tr>
      <tr><th>Country of Origin</th><td>${applicant.countryOfOrigin}</td></tr>
      <tr><th>Date of Birth</th><td>${applicant.dateOfBirth}</td></tr>
      <tr><th>Gender</th><td>${applicant.gender}</td></tr>
      <tr><th>Purpose of Stay</th><td>${applicant.purposeOfStay}</td></tr>
      <tr><th>Intended Duration</th><td>${applicant.intendedDuration || 'Not specified'}</td></tr>
    </table>
  </div>

  ${eligibility ? `
  <div class="section">
    <div class="section-title">Eligibility Assessment</div>
    <p>Eligibility Score: <span class="score">${eligibility.score}%</span></p>
    <p>${eligibility.eligible ? 'Applicant meets the key eligibility requirements for this visa category.' : 'Some eligibility requirements need attention - see risk flags below.'}</p>
    ${eligibility.riskFlags && eligibility.riskFlags.length > 0 ? `
    <table>
      <tr><th>Severity</th><th>Risk Flag</th></tr>
      ${eligibility.riskFlags.map((f) => `<tr><td>${f.severity || 'medium'}</td><td>${f.details}</td></tr>`).join('')}
    </table>
    ` : ''}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Documents Submitted (${documents.length})</div>
    <table>
      <tr><th>Document Type</th><th>File Name</th><th>Upload Date</th><th>Validation Status</th></tr>
      ${documents.map((d) => `
        <tr>
          <td>${d.type.replace(/_/g, ' ')}</td>
          <td>${d.fileName}</td>
          <td>${new Date(d.uploadedAt).toLocaleDateString()}</td>
          <td><span class="badge badge-${d.validationStatus}">${d.validationStatus}</span></td>
        </tr>
      `).join('')}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Audit Trail</div>
    <table>
      <tr><th>Timestamp</th><th>Action</th><th>Details</th></tr>
      ${(application.auditTrail || []).map((a) => `
        <tr>
          <td>${new Date(a.timestamp).toLocaleString()}</td>
          <td>${a.action.replace(/_/g, ' ')}</td>
          <td>${a.details}</td>
        </tr>
      `).join('')}
    </table>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This document has been compiled by Senzwa MigrateSA and does not constitute a
    visa approval or guarantee. All final decisions are made by the Department of Home Affairs (DHA).
    Senzwa provides guidance and document compilation services only. The applicant is responsible for
    the accuracy and authenticity of all information and documents provided.
    <br><br>
    <strong>Compiled by:</strong> Senzwa MigrateSA AI Platform
    <br>
    <strong>Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    <br>
    <strong>Reference:</strong> ${application.id}
  </div>

  <div class="footer">
    SENZWA MigrateSA &mdash; Migration made clear. Lawfully guided. Accountable by design.
    <br>
    This document is confidential and contains personal information protected under POPIA.
  </div>
</body>
</html>`;

    return {
      html,
      filename: `senzwa-application-${application.id.slice(0, 8)}-${Date.now()}.pdf`,
      metadata: {
        applicationId: application.id,
        visaCategory: application.visaCategoryId,
        generatedAt: new Date().toISOString(),
        documentCount: documents.length,
      },
    };
  }

  /**
   * Generate a document checklist PDF
   */
  generateChecklist(visaCategoryId, applicantName) {
    const category = Object.values(VISA_CATEGORIES).find((c) => c.id === visaCategoryId);
    if (!category) return null;

    const processingTime = PROCESSING_TIMES[visaCategoryId];

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1a5632; padding-bottom: 15px; margin-bottom: 25px; }
    .logo { font-size: 24px; font-weight: 800; color: #1a5632; }
    h1 { font-size: 18px; color: #1a5632; }
    .info { background: #f8f9fa; padding: 12px; border-radius: 5px; margin-bottom: 20px; font-size: 13px; }
    .checklist { margin: 20px 0; }
    .check-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
    .checkbox { width: 16px; height: 16px; border: 2px solid #1a5632; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
    .required { color: #dc3545; font-weight: 600; font-size: 11px; }
    .optional { color: #6c757d; font-size: 11px; }
    .warning { background: #fff3cd; padding: 12px; border-radius: 5px; margin-top: 20px; font-size: 12px; }
    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SENZWA MigrateSA</div>
    <h1>Document Checklist: ${category.name}</h1>
    ${applicantName ? `<p>Prepared for: ${applicantName}</p>` : ''}
  </div>

  <div class="info">
    <strong>Legal Reference:</strong> ${category.legalReference}<br>
    <strong>Maximum Duration:</strong> ${category.maxDuration}<br>
    <strong>Application Fee:</strong> ${category.fees?.application || 'See fee schedule'}<br>
    ${processingTime ? `<strong>Expected Processing:</strong> ${processingTime.standard}` : ''}
  </div>

  <h2>Required Documents</h2>
  <div class="checklist">
    ${category.requiredDocuments.filter((d) => d.required).map((d) => `
      <div class="check-item">
        <div class="checkbox"></div>
        <div>
          <strong>${d.name}</strong> <span class="required">REQUIRED</span><br>
          ${d.description}
        </div>
      </div>
    `).join('')}
  </div>

  ${category.requiredDocuments.some((d) => !d.required) ? `
  <h2>Optional Documents</h2>
  <div class="checklist">
    ${category.requiredDocuments.filter((d) => !d.required).map((d) => `
      <div class="check-item">
        <div class="checkbox"></div>
        <div>
          <strong>${d.name}</strong> <span class="optional">OPTIONAL</span><br>
          ${d.description}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="warning">
    <strong>Important Reminders:</strong><br>
    - Medical and radiological reports must not be older than 6 months<br>
    - Police clearance certificates must not be older than 6 months<br>
    - All documents not in English must be translated by a sworn translator<br>
    - Foreign documents need apostille or embassy legalization<br>
    - Keep certified copies of all documents submitted
  </div>

  <div class="footer">
    Generated by SENZWA MigrateSA on ${new Date().toLocaleDateString()}<br>
    This checklist is for guidance only. Verify requirements with DHA or VFS Global.
  </div>
</body>
</html>`;

    return {
      html,
      filename: `senzwa-checklist-${visaCategoryId}-${Date.now()}.pdf`,
    };
  }

  /**
   * Generate an eligibility assessment report
   */
  generateEligibilityReport(profile, evaluation) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1a5632; padding-bottom: 15px; margin-bottom: 25px; }
    .logo { font-size: 24px; font-weight: 800; color: #1a5632; }
    h1 { font-size: 18px; color: #1a5632; }
    .recommended { background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #1a5632; margin-bottom: 20px; }
    .score-big { font-size: 36px; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th { text-align: left; padding: 8px; background: #f4f4f4; border: 1px solid #ddd; font-size: 12px; }
    td { padding: 8px; border: 1px solid #ddd; font-size: 13px; }
    .eligible { color: #28a745; }
    .not-eligible { color: #dc3545; }
    .disclaimer { background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 11px; color: #666; margin-top: 20px; }
    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SENZWA MigrateSA</div>
    <h1>Eligibility Assessment Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>

  <h2>Applicant Profile Summary</h2>
  <table>
    <tr><th>Nationality</th><td>${profile.nationality || 'Not specified'}</td></tr>
    <tr><th>Purpose</th><td>${profile.purposeOfStay || 'Not specified'}</td></tr>
    <tr><th>Qualifications</th><td>${profile.hasQualifications ? 'Yes' : 'Not specified'}</td></tr>
    <tr><th>Job Offer in SA</th><td>${profile.hasJobOffer ? 'Yes' : 'No'}</td></tr>
  </table>

  ${evaluation.recommended ? `
  <div class="recommended">
    <h2>Recommended Pathway</h2>
    <p><strong>${evaluation.recommended.categoryName}</strong></p>
    <p class="score-big" style="color: ${evaluation.recommended.eligibilityScore >= 70 ? '#28a745' : '#ffc107'}">
      ${evaluation.recommended.eligibilityScore}%
    </p>
    <p>${evaluation.recommended.legalReference}</p>
    <p>${evaluation.recommended.guidance}</p>
  </div>
  ` : ''}

  <h2>All Categories Evaluated (${evaluation.results?.length || 0})</h2>
  <table>
    <tr><th>Visa Category</th><th>Score</th><th>Eligible</th><th>Risk Flags</th></tr>
    ${(evaluation.results || []).map((r) => `
      <tr>
        <td>${r.categoryName}</td>
        <td>${r.eligibilityScore}%</td>
        <td class="${r.eligible ? 'eligible' : 'not-eligible'}">${r.eligible ? 'Yes' : 'No'}</td>
        <td>${r.riskFlags?.length || 0}</td>
      </tr>
    `).join('')}
  </table>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This eligibility assessment is provided by Senzwa MigrateSA AI and is based on the
    information provided by the applicant. It does not constitute legal advice or guarantee of visa approval.
    All final decisions are made by the Department of Home Affairs. Applicants are encouraged to verify
    requirements and consult with registered immigration practitioners for complex cases.
  </div>

  <div class="footer">
    SENZWA MigrateSA - Migration made clear. Lawfully guided. Accountable by design.
  </div>
</body>
</html>`;

    return {
      html,
      filename: `senzwa-eligibility-report-${Date.now()}.pdf`,
    };
  }
}

module.exports = new PDFExportService();

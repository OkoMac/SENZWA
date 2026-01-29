const EligibilityEngine = require('../src/services/eligibilityEngine');

describe('EligibilityEngine', () => {
  test('should evaluate all visa categories for a profile', () => {
    const profile = {
      nationality: 'Nigerian',
      purposeOfStay: 'work',
      passportNumber: 'A12345678',
      passportExpiry: '2028-06-15',
      hasJobOffer: true,
      hasSAQAEvaluation: true,
      hasDOLRecommendation: true,
      hasPoliceClearance: true,
      hasMedicalReport: true,
      financialStanding: { monthlyIncome: 50000, annualIncome: 600000 },
      qualifications: [{ level: 'bachelors' }],
    };

    const result = EligibilityEngine.evaluate(profile);

    expect(result).toBeDefined();
    expect(result.eligible).toBeDefined();
    expect(result.ineligible).toBeDefined();
    expect(result.totalCategoriesEvaluated).toBeGreaterThan(0);
    expect(result.auditLog).toBeDefined();
    expect(result.auditLog.engine).toBe('SenzwaEligibilityEngine v1.0');
  });

  test('should find eligible categories for a work-seeking applicant', () => {
    const profile = {
      nationality: 'Kenyan',
      purposeOfStay: 'work',
      passportNumber: 'B98765432',
      passportExpiry: '2029-01-01',
      hasJobOffer: true,
      hasSAQAEvaluation: true,
      hasDOLRecommendation: true,
      hasPoliceClearance: true,
      hasMedicalReport: true,
      financialStanding: { monthlyIncome: 80000, annualIncome: 960000 },
    };

    const result = EligibilityEngine.evaluate(profile);
    const generalWork = result.eligible.find((e) => e.categoryId === 'general_work');

    expect(generalWork).toBeDefined();
    expect(generalWork.eligible).toBe(true);
    expect(generalWork.eligibilityScore).toBeGreaterThan(50);
  });

  test('should flag criminal record as disqualifier', () => {
    const profile = {
      nationality: 'Indian',
      purposeOfStay: 'tourism',
      passportNumber: 'C11111111',
      passportExpiry: '2027-06-15',
      hasCriminalRecord: true,
      financialStanding: { monthlyIncome: 30000 },
    };

    const result = EligibilityEngine.evaluate(profile);
    const hasDisqualification = result.ineligible.some(
      (cat) => cat.disqualifications.length > 0
    );

    expect(hasDisqualification).toBe(true);
  });

  test('should recommend pathway', () => {
    const profile = {
      nationality: 'German',
      purposeOfStay: 'study',
      passportNumber: 'D22222222',
      passportExpiry: '2028-12-31',
      hasAcceptanceLetter: true,
      hasPoliceClearance: true,
      hasMedicalReport: true,
      financialStanding: { monthlyIncome: 20000, annualIncome: 240000 },
    };

    const recommendation = EligibilityEngine.getRecommendedPathway(profile);

    expect(recommendation).toBeDefined();
    expect(recommendation.found).toBeDefined();
    expect(recommendation.evaluation).toBeDefined();
  });

  test('should generate document checklist for a visa category', () => {
    const checklist = EligibilityEngine.getDocumentChecklist('general_work');

    expect(checklist).toBeDefined();
    expect(checklist.categoryName).toBe('General Work Visa');
    expect(checklist.documents.length).toBeGreaterThan(0);
    expect(checklist.totalRequired).toBeGreaterThan(0);
  });

  test('should handle spousal visa eligibility', () => {
    const profile = {
      nationality: 'Brazilian',
      purposeOfStay: 'family_reunion',
      passportNumber: 'E33333333',
      passportExpiry: '2028-06-15',
      maritalStatus: 'married',
      spouseIsSACitizen: true,
      hasPoliceClearance: true,
      hasMedicalReport: true,
      financialStanding: { monthlyIncome: 25000 },
    };

    const result = EligibilityEngine.evaluate(profile);
    const spousal = result.eligible.find((e) => e.categoryId === 'spousal_visa');

    expect(spousal).toBeDefined();
    expect(spousal.eligible).toBe(true);
  });
});

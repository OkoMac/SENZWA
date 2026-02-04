/**
 * Senzwa Eligibility Rules Engine
 *
 * Evaluates applicant profiles against South African immigration law
 * to determine visa eligibility, recommend pathways, and flag risks.
 *
 * Based on:
 * - Immigration Act 13 of 2002 (as amended)
 * - Immigration Regulations, 2014
 * - DHA directives and published Critical Skills List
 */

const { VISA_CATEGORIES, VISA_GROUPS } = require('../data/visaCategories');

class EligibilityEngine {
  /**
   * Evaluate all visa categories for an applicant profile
   * Returns ranked list of eligible categories with scores and risk flags
   */
  static evaluate(profile) {
    const results = [];

    for (const [key, category] of Object.entries(VISA_CATEGORIES)) {
      const evaluation = EligibilityEngine.evaluateCategory(profile, category);
      results.push({
        categoryId: category.id,
        categoryName: category.name,
        group: category.category,
        legalReference: category.legalReference,
        ...evaluation,
      });
    }

    // Sort by eligibility score (highest first), then by risk level (lowest first)
    results.sort((a, b) => {
      if (b.eligibilityScore !== a.eligibilityScore) {
        return b.eligibilityScore - a.eligibilityScore;
      }
      return a.riskFlags.length - b.riskFlags.length;
    });

    return {
      applicantProfile: EligibilityEngine.summarizeProfile(profile),
      evaluatedAt: new Date().toISOString(),
      totalCategoriesEvaluated: results.length,
      eligible: results.filter((r) => r.eligible),
      ineligible: results.filter((r) => !r.eligible),
      recommendedPathway: results.find((r) => r.eligible) || null,
      auditLog: {
        engine: 'SenzwaEligibilityEngine v1.0',
        lawBase: 'Immigration Act 13 of 2002 (as amended)',
        regulationBase: 'Immigration Regulations 2014',
        evaluationTimestamp: new Date().toISOString(),
        disclaimer: 'This evaluation provides guidance only. Final decisions rest with the Department of Home Affairs.',
      },
    };
  }

  /**
   * Evaluate a single visa category for an applicant
   */
  static evaluateCategory(profile, category) {
    const riskFlags = [];
    const metRequirements = [];
    const unmetRequirements = [];
    let score = 0;
    const maxScore = category.eligibility.requirements.length;

    // Check each requirement
    for (const requirement of category.eligibility.requirements) {
      const result = EligibilityEngine.checkRequirement(profile, requirement, category.id);
      if (result.met) {
        metRequirements.push({ requirement, details: result.details });
        score++;
      } else {
        unmetRequirements.push({ requirement, details: result.details, severity: result.severity });
        if (result.severity === 'high') {
          riskFlags.push({ type: 'requirement_not_met', requirement, details: result.details });
        }
      }
    }

    // Check disqualifiers
    const disqualifications = [];
    for (const disqualifier of category.eligibility.disqualifiers) {
      const result = EligibilityEngine.checkDisqualifier(profile, disqualifier, category.id);
      if (result.triggered) {
        disqualifications.push({ disqualifier, details: result.details });
        riskFlags.push({ type: 'disqualification', disqualifier, details: result.details });
      }
    }

    const eligibilityScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const eligible = eligibilityScore >= 60 && disqualifications.length === 0;

    return {
      eligible,
      eligibilityScore,
      metRequirements,
      unmetRequirements,
      disqualifications,
      riskFlags,
      requiredDocuments: category.requiredDocuments,
      commonRejectionReasons: category.commonRejectionReasons,
      fees: category.fees,
      maxDuration: category.maxDuration,
      guidance: EligibilityEngine.generateGuidance(profile, category, eligible, eligibilityScore, riskFlags),
    };
  }

  /**
   * Check a single requirement against the applicant profile
   */
  static checkRequirement(profile, requirement, categoryId) {
    const req = requirement.toLowerCase();

    // Passport validity checks
    if (req.includes('valid passport') || req.includes('passport')) {
      if (profile.passportNumber && profile.passportExpiry) {
        const expiry = new Date(profile.passportExpiry);
        const now = new Date();
        const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);

        if (daysUntilExpiry > 180) {
          return { met: true, details: `Passport valid for ${Math.round(daysUntilExpiry)} days` };
        } else if (daysUntilExpiry > 30) {
          return { met: true, details: `Passport validity limited (${Math.round(daysUntilExpiry)} days). Consider renewal.`, severity: 'medium' };
        }
        return { met: false, details: 'Passport expiry too soon. Renewal required.', severity: 'high' };
      }
      return { met: false, details: 'Passport details not provided', severity: 'medium' };
    }

    // Financial means checks
    if (req.includes('proof of sufficient funds') || req.includes('financial means') || req.includes('proof of funds')) {
      if (profile.financialStanding && profile.financialStanding.monthlyIncome) {
        return { met: true, details: `Monthly income: ZAR ${profile.financialStanding.monthlyIncome}` };
      }
      return { met: false, details: 'Financial information not provided', severity: 'medium' };
    }

    // Minimum income checks (remote work visa - ZAR 1M)
    if (req.includes('minimum annual income') && req.includes('1,000,000')) {
      if (profile.financialStanding && profile.financialStanding.annualIncome >= 1000000) {
        return { met: true, details: `Annual income ZAR ${profile.financialStanding.annualIncome} meets minimum` };
      }
      return { met: false, details: 'Annual income below ZAR 1,000,000 minimum', severity: 'high' };
    }

    // Net worth checks (PR financially independent - ZAR 12M)
    if (req.includes('net worth') && req.includes('12,000,000')) {
      if (profile.financialStanding && profile.financialStanding.netWorth >= 12000000) {
        return { met: true, details: `Net worth ZAR ${profile.financialStanding.netWorth} meets minimum` };
      }
      return { met: false, details: 'Net worth below ZAR 12,000,000 minimum', severity: 'high' };
    }

    // Investment capital checks (Business visa - ZAR 5M)
    if (req.includes('investment capital') && req.includes('5,000,000')) {
      if (profile.financialStanding && profile.financialStanding.investmentCapital >= 5000000) {
        return { met: true, details: `Investment capital ZAR ${profile.financialStanding.investmentCapital} meets minimum` };
      }
      return { met: false, details: 'Investment capital below ZAR 5,000,000 minimum', severity: 'high' };
    }

    // Employment / job offer checks
    if (req.includes('confirmed job offer') || req.includes('employment contract') || req.includes('offer of permanent employment')) {
      if (profile.hasJobOffer) {
        return { met: true, details: 'Job offer confirmed' };
      }
      return { met: false, details: 'No job offer provided', severity: 'high' };
    }

    // SAQA evaluation
    if (req.includes('saqa') || req.includes('qualifications evaluated')) {
      if (profile.hasSAQAEvaluation) {
        return { met: true, details: 'SAQA evaluation completed' };
      }
      return { met: false, details: 'SAQA evaluation required for qualifications', severity: 'high' };
    }

    // Critical Skills List
    if (req.includes('critical skills list')) {
      if (profile.isOnCriticalSkillsList) {
        return { met: true, details: 'Skill confirmed on Critical Skills List' };
      }
      return { met: false, details: 'Skill not on Critical Skills List', severity: 'high' };
    }

    // Professional registration
    if (req.includes('professional registration')) {
      if (profile.hasProfessionalRegistration) {
        return { met: true, details: 'Professional registration confirmed' };
      }
      return { met: false, details: 'Professional registration may be required', severity: 'medium' };
    }

    // Department of Labour recommendation
    if (req.includes('department of labour') || req.includes('labor market test')) {
      if (profile.hasDOLRecommendation) {
        return { met: true, details: 'DOL recommendation obtained' };
      }
      return { met: false, details: 'Department of Labour recommendation required', severity: 'high' };
    }

    // Police clearance
    if (req.includes('police clearance')) {
      if (profile.hasPoliceClearance) {
        return { met: true, details: 'Police clearance certificate available' };
      }
      return { met: false, details: 'Police clearance certificate required', severity: 'medium' };
    }

    // Medical report
    if (req.includes('medical') && !req.includes('insurance') && !req.includes('treatment')) {
      if (profile.hasMedicalReport) {
        return { met: true, details: 'Medical report available' };
      }
      return { met: false, details: 'Medical report required', severity: 'medium' };
    }

    // Acceptance letter (study)
    if (req.includes('acceptance letter') || req.includes('learning institution')) {
      if (profile.hasAcceptanceLetter) {
        return { met: true, details: 'Acceptance letter from institution confirmed' };
      }
      return { met: false, details: 'Acceptance letter from SA institution required', severity: 'high' };
    }

    // Marriage (spousal visa)
    if (req.includes('legally married')) {
      if (profile.maritalStatus === 'married' && profile.spouseIsSACitizen) {
        return { met: true, details: 'Marriage to SA citizen/PR confirmed' };
      }
      return { met: false, details: 'Must be legally married to SA citizen or PR', severity: 'high' };
    }

    // Marriage recognition under SA law
    if (req.includes('marriage must be recognized') || req.includes('recognized under south african law')) {
      if (profile.maritalStatus === 'married') {
        return { met: true, details: 'Marriage submitted for recognition verification' };
      }
      return { met: false, details: 'Marriage must be recognized under South African law', severity: 'high' };
    }

    // Proof of genuine relationship
    if (req.includes('genuine relationship') || req.includes('proof of genuine')) {
      if (profile.maritalStatus === 'married' || profile.hasLifePartnerInSA) {
        return { met: true, details: 'Relationship documentation to be verified at submission' };
      }
      return { met: false, details: 'Proof of genuine relationship required', severity: 'medium' };
    }

    // Spouse financial undertaking
    if (req.includes('spouse financial undertaking') || req.includes('sa spouse financial')) {
      if (profile.spouseIsSACitizen || profile.spouseHasFinancialUndertaking) {
        return { met: true, details: 'SA spouse financial undertaking to be provided' };
      }
      return { met: false, details: 'SA spouse financial undertaking required', severity: 'medium' };
    }

    // Family relationship
    if (req.includes('immediate family member')) {
      if (profile.familyTiesInSA && profile.familyTiesInSA.relationship) {
        return { met: true, details: `Family tie: ${profile.familyTiesInSA.relationship}` };
      }
      return { met: false, details: 'No immediate family ties in SA identified', severity: 'high' };
    }

    // Life partnership
    if (req.includes('life partnership') || req.includes('permanent life partnership')) {
      if (profile.hasLifePartnerInSA) {
        return { met: true, details: 'Life partnership with SA citizen/PR confirmed' };
      }
      return { met: false, details: 'Must be in life partnership with SA citizen/PR', severity: 'high' };
    }

    // Work visa for 5 years (PR direct residence)
    if (req.includes('work visa for 5') || req.includes('5 consecutive years')) {
      if (profile.yearsOnWorkVisa >= 5) {
        return { met: true, details: `${profile.yearsOnWorkVisa} years on work visa` };
      }
      return { met: false, details: `Requires 5 consecutive years on work visa. Current: ${profile.yearsOnWorkVisa || 0}`, severity: 'high' };
    }

    // Employment with multinational (ICT)
    if (req.includes('multinational company') || req.includes('transfer to sa branch')) {
      if (profile.isMultinationalEmployee) {
        return { met: true, details: 'Multinational company employment confirmed' };
      }
      return { met: false, details: 'Must be employed by multinational with SA presence', severity: 'high' };
    }

    // Purpose of stay
    if (req.includes('no intention to work')) {
      if (profile.purposeOfStay === 'tourism' || profile.purposeOfStay === 'visit') {
        return { met: true, details: 'Tourism/visit purpose confirmed' };
      }
      return { met: false, details: 'Purpose of stay suggests non-tourism intent', severity: 'medium' };
    }

    // Refugee / persecution
    if (req.includes('well-founded fear of persecution')) {
      if (profile.claimsRefugeeStatus) {
        return { met: true, details: 'Refugee status claim noted for assessment' };
      }
      return { met: false, details: 'Must demonstrate well-founded fear of persecution', severity: 'high' };
    }

    // Default: requirement needs manual verification
    return { met: false, details: `Requires verification: ${requirement}`, severity: 'low' };
  }

  /**
   * Check if a disqualifier applies to the applicant
   */
  static checkDisqualifier(profile, disqualifier, categoryId) {
    const dq = disqualifier.toLowerCase();

    if (dq.includes('criminal record')) {
      if (profile.hasCriminalRecord) {
        return { triggered: true, details: 'Criminal record may disqualify application' };
      }
      return { triggered: false };
    }

    if (dq.includes('previous immigration violations') || dq.includes('previous overstay')) {
      if (profile.hasImmigrationViolations) {
        return { triggered: true, details: 'Previous immigration violations on record' };
      }
      return { triggered: false };
    }

    if (dq.includes('undesirable person')) {
      if (profile.isUndesirablePerson) {
        return { triggered: true, details: 'Listed as undesirable person under Section 30' };
      }
      return { triggered: false };
    }

    if (dq.includes('passport validity')) {
      if (profile.passportExpiry) {
        const expiry = new Date(profile.passportExpiry);
        const daysLeft = (expiry - new Date()) / (1000 * 60 * 60 * 24);
        if (daysLeft < 30) {
          return { triggered: true, details: 'Passport expires within 30 days' };
        }
      }
      return { triggered: false };
    }

    if (dq.includes('income below minimum') || dq.includes('below minimum threshold')) {
      // Context-dependent - checked in requirements
      return { triggered: false };
    }

    return { triggered: false };
  }

  /**
   * Generate human-readable guidance for the applicant
   */
  static generateGuidance(profile, category, eligible, score, riskFlags) {
    const lines = [];

    if (eligible) {
      lines.push(`You appear eligible for the ${category.name}.`);
      lines.push(`Your eligibility score is ${score}% based on the information provided.`);

      if (riskFlags.length > 0) {
        lines.push(`However, there are ${riskFlags.length} area(s) that need attention:`);
        for (const flag of riskFlags) {
          lines.push(`  - ${flag.details}`);
        }
      }

      lines.push(`\nNext steps:`);
      lines.push(`1. Prepare all required documents (see document checklist).`);
      lines.push(`2. Ensure all documents are current and properly certified.`);
      lines.push(`3. Upload documents to Senzwa for validation.`);
      lines.push(`4. Review the compiled application package before submission.`);
    } else {
      lines.push(`Based on the information provided, you may not currently qualify for the ${category.name}.`);

      if (score > 0) {
        lines.push(`Your eligibility score is ${score}%. Key areas to address:`);
      }

      const highSeverity = riskFlags.filter((f) => f.type === 'disqualification');
      const requirements = riskFlags.filter((f) => f.type === 'requirement_not_met');

      if (highSeverity.length > 0) {
        lines.push(`\nDisqualifying factors:`);
        for (const flag of highSeverity) {
          lines.push(`  - ${flag.details}`);
        }
      }

      if (requirements.length > 0) {
        lines.push(`\nUnmet requirements:`);
        for (const flag of requirements) {
          lines.push(`  - ${flag.details}`);
        }
      }

      lines.push(`\nPlease consult a registered immigration practitioner for personalized advice.`);
    }

    lines.push(`\nLegal basis: ${category.legalReference}`);
    lines.push(`Disclaimer: This is automated guidance only. Final decisions are made by the Department of Home Affairs.`);

    return lines.join('\n');
  }

  /**
   * Summarize applicant profile for audit purposes
   */
  static summarizeProfile(profile) {
    return {
      nationality: profile.nationality,
      purposeOfStay: profile.purposeOfStay,
      intendedDuration: profile.intendedDuration,
      hasJobOffer: !!profile.hasJobOffer,
      hasFamilyInSA: !!(profile.familyTiesInSA && profile.familyTiesInSA.relationship),
      qualificationLevel: profile.qualifications?.[0]?.level || 'not_provided',
    };
  }

  /**
   * Get the recommended pathway with full details
   */
  static getRecommendedPathway(profile) {
    const evaluation = EligibilityEngine.evaluate(profile);

    if (!evaluation.recommendedPathway) {
      return {
        found: false,
        message: 'No eligible visa category found based on the information provided. Please review your profile or consult an immigration practitioner.',
        evaluation,
      };
    }

    return {
      found: true,
      recommended: evaluation.recommendedPathway,
      alternativeOptions: evaluation.eligible.slice(1, 4),
      evaluation,
    };
  }

  /**
   * Get document checklist for a specific visa category
   */
  static getDocumentChecklist(categoryId) {
    const category = VISA_CATEGORIES[Object.keys(VISA_CATEGORIES).find(
      (k) => VISA_CATEGORIES[k].id === categoryId
    )];

    if (!category) {
      throw new Error(`Unknown visa category: ${categoryId}`);
    }

    return {
      categoryId: category.id,
      categoryName: category.name,
      legalReference: category.legalReference,
      documents: category.requiredDocuments,
      totalRequired: category.requiredDocuments.filter((d) => d.required).length,
      totalOptional: category.requiredDocuments.filter((d) => !d.required).length,
    };
  }
}

module.exports = EligibilityEngine;

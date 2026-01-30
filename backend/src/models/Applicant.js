const { v4: uuidv4 } = require('uuid');

const applicants = [];

class Applicant {
  static create({
    userId,
    passportNumber,
    nationality,
    countryOfOrigin,
    dateOfBirth,
    gender,
    maritalStatus,
    purposeOfStay,
    intendedDuration,
    qualifications,
    employmentHistory,
    familyTiesInSA,
    financialStanding,
    currentVisaStatus,
  }) {
    const applicant = {
      id: uuidv4(),
      userId,
      passportNumber,
      nationality,
      countryOfOrigin,
      dateOfBirth,
      gender,
      maritalStatus,
      purposeOfStay,
      intendedDuration,
      qualifications: qualifications || [],
      employmentHistory: employmentHistory || [],
      familyTiesInSA: familyTiesInSA || null,
      financialStanding: financialStanding || null,
      currentVisaStatus: currentVisaStatus || 'none',
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applicants.push(applicant);
    return applicant;
  }

  static findByUserId(userId) {
    return applicants.find((a) => a.userId === userId) || null;
  }

  static findById(id) {
    return applicants.find((a) => a.id === id) || null;
  }

  static update(id, updates) {
    const idx = applicants.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Applicant not found');

    const allowed = [
      'passportNumber', 'nationality', 'countryOfOrigin', 'dateOfBirth',
      'gender', 'maritalStatus', 'purposeOfStay', 'intendedDuration',
      'qualifications', 'employmentHistory', 'familyTiesInSA',
      'financialStanding', 'currentVisaStatus', 'onboardingComplete',
    ];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        applicants[idx][key] = updates[key];
      }
    }
    applicants[idx].updatedAt = new Date().toISOString();
    return applicants[idx];
  }

  static list({ page = 1, limit = 20 }) {
    const start = (page - 1) * limit;
    return {
      applicants: applicants.slice(start, start + limit),
      total: applicants.length,
      page,
      limit,
    };
  }
}

module.exports = Applicant;

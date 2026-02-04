const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class Applicant {
  static async create(data) {
    const applicant = {
      id: uuidv4(),
      user_id: data.userId,
      passport_number: data.passportNumber || null,
      nationality: data.nationality || null,
      country_of_origin: data.countryOfOrigin || null,
      date_of_birth: data.dateOfBirth || null,
      gender: data.gender || null,
      marital_status: data.maritalStatus || null,
      purpose_of_stay: data.purposeOfStay || null,
      intended_duration: data.intendedDuration || null,
      qualifications: JSON.stringify(data.qualifications || []),
      employment_history: JSON.stringify(data.employmentHistory || []),
      family_ties_in_sa: JSON.stringify(data.familyTiesInSA || null),
      financial_standing: JSON.stringify(data.financialStanding || null),
      current_visa_status: data.currentVisaStatus || 'none',
      onboarding_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db('applicants').insert(applicant);
    return Applicant.toCamel(applicant);
  }

  static async findByUserId(userId) {
    const row = await db('applicants').where('user_id', userId).first();
    return row ? Applicant.toCamel(row) : null;
  }

  static async findById(id) {
    const row = await db('applicants').where('id', id).first();
    return row ? Applicant.toCamel(row) : null;
  }

  static async update(id, updates) {
    const mapping = {
      passportNumber: 'passport_number', nationality: 'nationality',
      countryOfOrigin: 'country_of_origin', dateOfBirth: 'date_of_birth',
      gender: 'gender', maritalStatus: 'marital_status',
      purposeOfStay: 'purpose_of_stay', intendedDuration: 'intended_duration',
      currentVisaStatus: 'current_visa_status', onboardingComplete: 'onboarding_complete',
    };
    const jsonFields = {
      qualifications: 'qualifications', employmentHistory: 'employment_history',
      familyTiesInSA: 'family_ties_in_sa', financialStanding: 'financial_standing',
    };

    const dbUpdates = {};
    for (const [jsKey, dbKey] of Object.entries(mapping)) {
      if (updates[jsKey] !== undefined) dbUpdates[dbKey] = updates[jsKey];
    }
    for (const [jsKey, dbKey] of Object.entries(jsonFields)) {
      if (updates[jsKey] !== undefined) dbUpdates[dbKey] = JSON.stringify(updates[jsKey]);
    }
    dbUpdates.updated_at = new Date().toISOString();

    const count = await db('applicants').where('id', id).update(dbUpdates);
    if (count === 0) throw new Error('Applicant not found');
    const row = await db('applicants').where('id', id).first();
    return Applicant.toCamel(row);
  }

  static async list({ page = 1, limit = 20 }) {
    const countResult = await db('applicants').count('* as count').first();
    const rows = await db('applicants').offset((page - 1) * limit).limit(limit);
    return {
      applicants: rows.map(Applicant.toCamel),
      total: countResult.count,
      page,
      limit,
    };
  }

  static toCamel(row) {
    const parseJSON = (val) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'string') { try { return JSON.parse(val); } catch { return val; } }
      return val;
    };
    return {
      id: row.id,
      userId: row.user_id,
      passportNumber: row.passport_number,
      nationality: row.nationality,
      countryOfOrigin: row.country_of_origin,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      maritalStatus: row.marital_status,
      purposeOfStay: row.purpose_of_stay,
      intendedDuration: row.intended_duration,
      qualifications: parseJSON(row.qualifications) || [],
      employmentHistory: parseJSON(row.employment_history) || [],
      familyTiesInSA: parseJSON(row.family_ties_in_sa),
      financialStanding: parseJSON(row.financial_standing),
      currentVisaStatus: row.current_visa_status,
      onboardingComplete: !!row.onboarding_complete,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = Applicant;

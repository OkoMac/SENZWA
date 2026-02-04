const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

class User {
  static async create({ email, password, firstName, lastName, phone, role = 'applicant' }) {
    const existing = await db('users').where('email', email).first();
    if (existing) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      id: uuidv4(),
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      role,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db('users').insert(user);
    return User.sanitize(User.toCamel(user));
  }

  static async findByEmail(email) {
    const row = await db('users').where('email', email).first();
    return row ? User.toCamel(row) : null;
  }

  static async findById(id) {
    const row = await db('users').where('id', id).first();
    return row ? User.toCamel(row) : null;
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
  }

  static async updateProfile(id, updates) {
    const mapping = { firstName: 'first_name', lastName: 'last_name', phone: 'phone' };
    const dbUpdates = {};
    for (const [jsKey, dbKey] of Object.entries(mapping)) {
      if (updates[jsKey] !== undefined) {
        dbUpdates[dbKey] = updates[jsKey];
      }
    }
    dbUpdates.updated_at = new Date().toISOString();

    const count = await db('users').where('id', id).update(dbUpdates);
    if (count === 0) throw new Error('User not found');
    const row = await db('users').where('id', id).first();
    return User.sanitize(User.toCamel(row));
  }

  static sanitize(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  static async list({ role, page = 1, limit = 20 }) {
    let query = db('users');
    if (role) query = query.where('role', role);

    const countResult = await query.clone().count('* as count').first();
    const rows = await query.offset((page - 1) * limit).limit(limit);

    return {
      users: rows.map((r) => User.sanitize(User.toCamel(r))),
      total: countResult.count,
      page,
      limit,
    };
  }

  static toCamel(row) {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role,
      isVerified: !!row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

module.exports = User;

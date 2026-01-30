const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with PostgreSQL in production)
const users = [];

class User {
  static async create({ email, password, firstName, lastName, phone, role = 'applicant' }) {
    const existing = users.find((u) => u.email === email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      id: uuidv4(),
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role, // applicant, agent, admin
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(user);
    return User.sanitize(user);
  }

  static async findByEmail(email) {
    return users.find((u) => u.email === email) || null;
  }

  static async findById(id) {
    return users.find((u) => u.id === id) || null;
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
  }

  static async updateProfile(id, updates) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');

    const allowed = ['firstName', 'lastName', 'phone'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        users[idx][key] = updates[key];
      }
    }
    users[idx].updatedAt = new Date().toISOString();
    return User.sanitize(users[idx]);
  }

  static sanitize(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  static async list({ role, page = 1, limit = 20 }) {
    let filtered = [...users];
    if (role) filtered = filtered.filter((u) => u.role === role);
    const start = (page - 1) * limit;
    return {
      users: filtered.slice(start, start + limit).map(User.sanitize),
      total: filtered.length,
      page,
      limit,
    };
  }
}

module.exports = User;

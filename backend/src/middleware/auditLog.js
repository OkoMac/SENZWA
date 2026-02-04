const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const logger = require('../utils/logger');

function auditLog(req, res, next) {
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    user_agent: req.get('user-agent') || null,
    user_id: req.user?.id || null,
    _startTime: Date.now(),
  };

  // Capture response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const record = {
      id: entry.id,
      method: entry.method,
      path: entry.path,
      ip: entry.ip,
      user_agent: entry.user_agent,
      user_id: entry.user_id,
      status_code: res.statusCode,
      response_time: Date.now() - entry._startTime,
      timestamp: entry.timestamp,
    };

    // Write to DB asynchronously (don't block response)
    db('audit_logs').insert(record).catch((err) => {
      logger.error('Failed to write audit log', { error: err.message });
    });

    logger.debug('Audit log entry', { auditId: entry.id, path: entry.path });
    return originalJson(body);
  };

  next();
}

async function getAuditLogs(filters = {}) {
  let query = db('audit_logs').orderBy('timestamp', 'desc');

  if (filters.userId) {
    query = query.where('user_id', filters.userId);
  }
  if (filters.path) {
    query = query.where('path', 'like', `%${filters.path}%`);
  }
  if (filters.startDate) {
    query = query.where('timestamp', '>=', filters.startDate);
  }
  if (filters.endDate) {
    query = query.where('timestamp', '<=', filters.endDate);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  } else {
    query = query.limit(500);
  }

  return query;
}

module.exports = { auditLog, getAuditLogs };

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// In-memory audit store (replace with DB in production)
const auditStore = [];

function auditLog(req, res, next) {
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || null,
  };

  // Capture response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    entry.statusCode = res.statusCode;
    entry.responseTime = Date.now() - entry._startTime;
    auditStore.push(entry);

    if (auditStore.length > 10000) {
      auditStore.shift();
    }

    logger.debug('Audit log entry', { auditId: entry.id, path: entry.path });
    return originalJson(body);
  };

  entry._startTime = Date.now();
  next();
}

function getAuditLogs(filters = {}) {
  let logs = [...auditStore];

  if (filters.userId) {
    logs = logs.filter((l) => l.userId === filters.userId);
  }
  if (filters.path) {
    logs = logs.filter((l) => l.path.includes(filters.path));
  }
  if (filters.startDate) {
    logs = logs.filter((l) => new Date(l.timestamp) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    logs = logs.filter((l) => new Date(l.timestamp) <= new Date(filters.endDate));
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = { auditLog, getAuditLogs };

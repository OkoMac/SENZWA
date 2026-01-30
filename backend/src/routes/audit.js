const express = require('express');
const { getAuditLogs } = require('../middleware/auditLog');
const Application = require('../models/Application');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit/system - Get system audit logs (admin only)
router.get('/system', authenticate, authorize('admin'), (req, res) => {
  try {
    const logs = getAuditLogs({
      userId: req.query.userId,
      path: req.query.path,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const start = (page - 1) * limit;

    res.json({
      logs: logs.slice(start, start + limit),
      total: logs.length,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit/application/:id - Get application-specific audit trail
router.get('/application/:id', authenticate, (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only allow access to own applications or admin/agent roles
    if (application.userId !== req.user.id && !['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      applicationId: application.id,
      status: application.status,
      auditTrail: application.auditTrail,
      totalEntries: application.auditTrail.length,
      accountability: {
        created: application.createdAt,
        lastUpdated: application.updatedAt,
        submitted: application.submittedAt,
        reviewed: application.reviewedAt,
        decided: application.decidedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

// GET /api/audit/stats - Get audit statistics (admin only)
router.get('/stats', authenticate, authorize('admin'), (req, res) => {
  try {
    const logs = getAuditLogs({});

    const stats = {
      totalRequests: logs.length,
      byMethod: {},
      byStatus: {},
      recentActivity: logs.slice(0, 10),
    };

    for (const log of logs) {
      stats.byMethod[log.method] = (stats.byMethod[log.method] || 0) + 1;
      const statusGroup = `${Math.floor((log.statusCode || 200) / 100)}xx`;
      stats.byStatus[statusGroup] = (stats.byStatus[statusGroup] || 0) + 1;
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

module.exports = router;

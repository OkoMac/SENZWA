const express = require('express');
const User = require('../models/User');
const Applicant = require('../models/Applicant');
const Application = require('../models/Application');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin', 'agent'));

// GET /api/admin/dashboard - Admin dashboard statistics
router.get('/dashboard', (req, res) => {
  try {
    const users = User.list({ page: 1, limit: 10000 });
    const applicants = Applicant.list({ page: 1, limit: 10000 });
    const allApplications = Application.list({ page: 1, limit: 10000 });

    const applicationsByStatus = {};
    for (const app of allApplications.applications) {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    }

    res.json({
      overview: {
        totalUsers: users.total,
        totalApplicants: applicants.total,
        totalApplications: allApplications.total,
        applicationsByStatus,
      },
      recentApplications: allApplications.applications.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const result = await User.list({
      role: req.query.role,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// GET /api/admin/applications - List all applications with filters
router.get('/applications', (req, res) => {
  try {
    const result = Application.list({
      status: req.query.status,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list applications' });
  }
});

// PUT /api/admin/applications/:id/review - Review an application
router.put('/applications/:id/review', (req, res) => {
  try {
    const application = Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { decision, notes } = req.body;

    Application.update(application.id, {
      status: decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'under_review',
      reviewedAt: new Date().toISOString(),
      decidedAt: ['approve', 'reject'].includes(decision) ? new Date().toISOString() : null,
    });

    Application.addAuditEntry(
      application.id,
      'application_reviewed',
      `Reviewed by ${req.user.email}. Decision: ${decision}. Notes: ${notes || 'None'}`,
      req.user.id
    );

    res.json({
      message: `Application ${decision}ed`,
      application: Application.findById(application.id),
    });
  } catch (err) {
    res.status(500).json({ error: 'Review failed' });
  }
});

module.exports = router;

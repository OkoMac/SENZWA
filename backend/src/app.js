const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const applicantRoutes = require('./routes/applicants');
const visaRoutes = require('./routes/visas');
const documentRoutes = require('./routes/documents');
const applicationRoutes = require('./routes/applications');
const eligibilityRoutes = require('./routes/eligibility');
const whatsappRoutes = require('./routes/whatsapp');
const auditRoutes = require('./routes/audit');
const adminRoutes = require('./routes/admin');
const knowledgeRoutes = require('./routes/knowledge');
const exportRoutes = require('./routes/export');
const conversationRoutes = require('./routes/conversation');

const { errorHandler, notFound } = require('./middleware/errorHandler');
const { auditLog } = require('./middleware/auditLog');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Audit logging middleware
app.use(auditLog);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Senzwa MigrateSA API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/conversation', conversationRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

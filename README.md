# SENZWA MigrateSA

**The Intelligent Infrastructure for Migration into South Africa**

Senzwa is an AI-powered migration onboarding, application compilation, and screening platform designed to transform South Africa's immigration process into a streamlined, intelligent infrastructure layer.

## Architecture

```
SENZWA/
├── backend/                    # Node.js/Express API Server
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── data/              # SA immigration law visa categories (22+)
│   │   ├── middleware/        # Auth, audit logging, error handling
│   │   ├── models/            # User, Applicant, Application, Document
│   │   ├── routes/            # REST API endpoints
│   │   ├── services/          # Core business logic
│   │   │   ├── eligibilityEngine.js    # AI rules engine (Immigration Act)
│   │   │   ├── documentValidator.js    # Document validation service
│   │   │   ├── whatsappService.js      # WhatsApp Business API
│   │   │   ├── conversationRouter.js   # AI conversational routing engine
│   │   │   └── pdfExportService.js     # PDF document generation
│   │   └── utils/             # Logger, helpers
│   └── tests/                 # Jest test suites
├── frontend/                   # React Web Application
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── context/           # Auth context provider
│       ├── pages/             # Application pages
│       │   ├── Landing.js     # Public landing page
│       │   ├── Dashboard.js   # User dashboard
│       │   ├── Onboarding.js  # Applicant profiling (4-step wizard)
│       │   ├── VisaExplorer.js    # Browse all visa categories
│       │   ├── VisaDetail.js      # Visa category details
│       │   ├── EligibilityCheck.js # AI eligibility assessment
│       │   ├── ApplicationView.js  # Application management
│       │   └── DocumentUpload.js   # Document upload & validation
│       └── services/          # API client
```

## Core Features

### AI-Guided Visa Pathway Selection
Evaluates applicant profiles against all 22+ South African visa categories using rules encoded from the Immigration Act 13 of 2002 (as amended), Immigration Regulations, and DHA directives.

### Complete Home Affairs Coverage
- **Temporary Residence**: Tourist, Business, Family Visit, Study, Medical, Remote Work, Retired Person, Exchange
- **Work & Business**: General Work, Critical Skills, Intra-Company Transfer, Corporate, Business/Investment
- **Family**: Relative's, Spousal, Life Partner
- **Permanent Residence**: Section 26 Direct, Work-based, Business-based, Financially Independent, Extraordinary Skills
- **Refugee/Asylum**: Intake guidance

### Document Validation & Compilation
- File type, size, and format validation
- Expiry date checking (passports, police clearances, medical reports)
- Cross-document consistency verification
- Completeness tracking against visa-specific requirements
- Compiled application packages formatted to DHA/VFS standards

### WhatsApp Business API Integration
- Conversational onboarding and guidance
- Document reminders and status updates
- Interactive menus for visa category exploration
- Webhook processing for incoming messages

### Radical Accountability
- Complete audit trails on every interaction
- Timestamped, attributable action logs
- Clear separation of responsibility (AI guides, applicant submits, government decides)
- POPIA and GDPR compliant data handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/applicants` | Create applicant profile |
| GET | `/api/applicants/me` | Get applicant profile |
| GET | `/api/visas/categories` | List all visa categories |
| GET | `/api/visas/categories/:id` | Get visa category details |
| POST | `/api/eligibility/evaluate` | Full eligibility assessment |
| POST | `/api/eligibility/recommend` | Get recommended pathway |
| POST | `/api/applications` | Create application |
| POST | `/api/applications/:id/compile` | Compile application package |
| POST | `/api/documents/upload` | Upload document |
| POST | `/api/documents/check-completeness` | Check document completeness |
| GET/POST | `/api/whatsapp/webhook` | WhatsApp webhook |
| GET | `/api/audit/system` | System audit logs |
| GET | `/api/admin/dashboard` | Admin dashboard |

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env    # Configure environment variables
npm install
npm run dev             # Start development server on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm start               # Start React dev server on port 3000
```

### Run Tests
```bash
cd backend
npm test
```

## Legal Basis

All rules and workflows are grounded in:
- **Immigration Act 13 of 2002** (as amended)
- **Immigration Regulations, 2014**
- **DHA Policy Directives and Notices**
- **Refugees Act 130 of 1998** (for asylum guidance)

**Disclaimer**: Senzwa provides guidance only. All final visa decisions are made by the Department of Home Affairs.

## Security & Compliance

- POPIA (Protection of Personal Information Act) compliant
- GDPR compliant
- End-to-end encryption for data in transit and at rest
- JWT-based authentication with bcrypt password hashing
- Rate limiting and Helmet security headers
- Role-based access control
- Immutable audit logs

---

**Senzwa: MigrateSA** - Migration made clear. Lawfully guided. Accountable by design.

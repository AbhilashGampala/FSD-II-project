# VIT Campus Placement Tracker
**Vishnu Institute of Technology (VIT), Bhimavaram, Andhra Pradesh**

A modern, enterprise-grade, role-based campus placement tracker built for students, training & placement officers (TPO), and system administrators at Vishnu Institute of Technology.

---

## 🌟 Key Highlights & Features

### 🎓 1. Student Portal (`/student`)
- **Passwordless OTP Login**: Instant, secure login using institutional `@vishnu.edu.in` email addresses (Roll number and batch auto-extracted from email).
- **Academic Profile Completeness Tracker**: Visual 0–100% completeness progress indicator with input guards for CGPA, 10th & 12th/Diploma percentages, and backlogs.
- **Live Eligibility Evaluation Engine**: Real-time evaluation of campus drives against the student's exact branch, CGPA cutoff, and active backlogs.
- **Detailed Drive Breakdown**: Side-by-side criteria comparison (student credentials vs drive requirements with tick/cross indicators). Ineligible students receive specific cutoff explanations, and server-side guards block direct API submission.
- **Application Pipeline Tracker**: Real-time tracking through 8 stages (`applied`, `shortlisted`, `oa_scheduled`, `oa_cleared`, `interview_scheduled`, `selected`, `rejected`, `withdrawn`) with placement officer transition notes and withdrawal capability.
- **Interview Schedule Hub**: Upcoming and past technical/HR rounds with Google Meet links, campus venues, panel details, and guidelines.
- **Placement Decision Center**: CTC packages in LPA, official offer letters, deadline countdown timer, and **Accept / Decline** modals with celebratory banners.

### 👔 2. Training & Placement Officer Portal (`/officer`)
- **Company Management**: Directory of recruiting partners across IT, core engineering, manufacturing, and finance.
- **Placement Drive Workflow**: Complete drive lifecycle management—save as draft, publish to students, duplicate, and close. Detailed eligibility criteria builder.
- **Candidate Applicant Tracking**: Searchable, filterable candidate rosters with bulk shortlisting, status note recording, and candidate profile modals.
- **Interview Scheduling**: Schedule online or in-person campus rounds directly from student applications.
- **Job Offer Generation**: Record official placement offers with CTC, joining dates, and acceptance deadlines.
- **Placement Statistics Registry**: Manage official placement statistics with mandatory verification source URLs (strictly adhering to the **Data Honesty** policy).
- **Officer Dashboard**: KPI counters, urgent application deadlines, and recent applicant activity.

### 🛡️ 3. Super Administrator Portal (`/admin`)
- **Institutional User Directory**: Complete user directory with search and multi-criteria filtering across students, officers, and admins.
- **Role & Privilege Management**: Promote or demote accounts with hard-coded self-demotion protection for the active administrator.
- **Account State Controls**: Activate and deactivate accounts with self-deactivation protection guards.
- **Officer Account Provisioning**: Dedicated form to onboard new Training & Placement Officers with `@vishnu.edu.in` domain verification.
- **Security & Compliance Audit Trail**: Immutable system audit log tracking administrative writes, status transitions, and role modifications with raw metadata inspection.
- **Admin Control Center**: System-wide health metrics, role breakdowns, and live activity streams.

---

## 📊 Data Honesty Policy

In accordance with institutional standards:
- Any placement statistic without an official verification source URL remains labeled as **Unverified** with an amber indicator.
- Dummy or placeholder statistics are never represented as official Vishnu Institute of Technology institutional metrics.
- All seeded mock records are explicitly flagged with `isSample: true` and rendered with a visible **Sample Data** badge in the UI.

---

## 🏗️ Architecture & Technology Stack

- **Monorepo Structure**:
  - `client/`: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6.
  - `server/`: Node.js, Express, Mongoose (MongoDB Atlas), JWT (HTTP-only secure cookies), Helmet, express-rate-limit, express-mongo-sanitize.
- **Vishnu Brand Design System**: Tailored color palette matching Vishnu Institute of Technology:
  - `brand.orange`: `#F58220`
  - `brand.green`: `#6DBE45`
  - `brand.purple`: `#7B2D8E`
  - High-contrast responsive card UI with seamless dark mode support.

---

## 📁 Repository Directory Structure

```text
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # AppLayout, Navbar, Sidebar, Badges, Modals
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── admin/          # UserDirectoryPage, AuditLogsPage
│   │   │   ├── officer/        # Companies, Drives, Applications, Interviews, Offers, Stats
│   │   │   ├── student/        # ExploreDrives, DriveDetail, Applications, Interviews, Offers, Profile
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupProfilePage.jsx
│   │   │   └── ErrorPages.jsx
│   │   ├── services/           # api.js client
│   │   └── utils/              # eligibility.js (shared logic)
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API Service
│   ├── src/
│   │   ├── config/             # DB & environment configuration
│   │   ├── controllers/        # auth, admin, drive, company, application, interview, offer, profile
│   │   ├── middleware/         # requireAuth, requireRole, errorHandler
│   │   ├── models/             # User, Company, Drive, Application, Interview, Offer, Stat, AuditLog, Otp
│   │   ├── routes/             # admin, auth, drives, companies, applications, interviews, offers, stats
│   │   ├── seed/               # seedAll.js (idempotent seeder)
│   │   ├── tests/              # testEligibility.js, testPhase3.js, testPhase4.js, testPhase5.js
│   │   └── utils/              # eligibility.js, auditLogger.js, otpHelper.js
│   ├── .env.example
│   └── package.json
│
├── render.yaml                 # Render Blueprint for automated cloud deployment
└── package.json                # Monorepo root scripts
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
Copy `server/.env.example` to `server/.env`:

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `PORT` | API Server listening port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster0.vtrhw1l.mongodb.net/vit_placements?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing authentication tokens | Long random string (32+ chars) |
| `OTP_SECRET` | Secret key for HMAC OTP hashing | Long random string (32+ chars) |
| `CLIENT_ORIGIN`| Allowed frontend origin for CORS | `http://localhost:5173` (Local) or Render frontend URL |
| `NODE_ENV` | Application runtime environment | `development` (or `production`) |
| `DEMO_MODE` | Enable demo OTP bypass (`123456`) | `true` |

### Client (`client/.env`)
Copy `client/.env.example` to `client/.env`:

| Variable | Description | Recommended Value |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` (Local) or `https://<backend-app>.onrender.com/api` |

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster or local MongoDB instance

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```

### Step 2: Configure Environment Files
Set up `server/.env` and `client/.env` based on the `.env.example` files.

### Step 3: Seed Institutional Database
Populate sample companies, diverse drives, applications across all pipeline stages, interviews, offers, and initial accounts:
```bash
npm run seed
```
*(The seed script is strictly idempotent: it removes previous `isSample: true` records before inserting fresh data, preventing duplicates).*

### Step 4: Run the Development Server
Launch both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 👥 Demo Accounts & Verification Credentials

With `DEMO_MODE=true` enabled, all accounts authenticate using the demo OTP: **`123456`**.

| Role | Email Address | Access & Permissions |
|---|---|---|
| **Super Admin** | `24pa1a0567@vishnu.edu.in` | Full system control, user directory, role assignments, audit logs |
| **Placement Officer** | `manikanta@vishnu.edu.in` | Drive management, applicant shortlisting, interview scheduling, offers, stats |
| **Demo Student 1** | `demo.student01@vishnu.edu.in` | CSE student (CGPA 7.00, 0 backlogs) |
| **Demo Student 2** | `demo.student02@vishnu.edu.in` | IT student (CGPA 8.20, 0 backlogs) |
| **Demo Student 3** | `demo.student03@vishnu.edu.in` | ECE student (CGPA 6.20, 1 backlog) |
| **New Student Signup** | Any `*@vishnu.edu.in` email | First-time students land on the profile completion onboarding screen |

---

## 🧪 Automated Test Suites

Run the built-in automated test suites to verify system integrity:

```bash
# 1. Eligibility Unit Tests (pass/fail per rule, missing fields)
node server/src/tests/testEligibility.js

# 2. Phase 3 Officer Workflow Tests (drives, applications, interviews, offers)
node server/src/tests/testPhase3.js

# 3. Phase 4 Student Workflow Tests (eligibility guards, duplicate apply, withdraw, offer accept)
node server/src/tests/testPhase4.js

# 4. Phase 5 Admin & RBAC Tests (self-protection guards, officer creation, audit trail)
node server/src/tests/testPhase5.js
```

---

## ☁️ Cloud Deployment on Render

This repository includes a native `render.yaml` configuration for automated deployment.

### 1. Backend Web Service (`vit-placement-tracker-server`)
- **Environment**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Health Check Path**: `/api/health`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
  - `CLIENT_ORIGIN`: `https://<your-frontend-subdomain>.onrender.com`
  - `DEMO_MODE`: `true`
  - `JWT_SECRET`: `<Secure random secret>`
  - `OTP_SECRET`: `<Secure random secret>`

### 2. Frontend Static Site (`vit-placement-tracker-client`)
- **Environment**: `Static Site`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrite Rule**: `/* -> /index.html` (Single Page Application routing)
- **Environment Variables**:
  - `VITE_API_URL`: `https://<your-backend-subdomain>.onrender.com/api`

> **Note on Cross-Site Cookies**: The backend server is pre-configured with `sameSite: 'none'` and `secure: true` when `NODE_ENV === 'production'`. Ensure `CLIENT_ORIGIN` matches the exact deployed frontend URL so authentication cookies persist across domain origins.

---

## 🔮 Future Roadmap

- [ ] Real-time email dispatch integration (SendGrid / AWS SES) for live OTP generation.
- [ ] Resume PDF upload to AWS S3 or Cloudinary with automated text extraction.
- [ ] Export shortlisted applicant rosters to Microsoft Excel / CSV.
- [ ] Graphical placement analytics charts (Package distribution, branch hiring ratios).
- [ ] WebSocket real-time push notifications for interview announcements.
- [ ] Calendar sync for upcoming campus interview rounds.

# VIT Campus Placement Tracker: Master Prompt for Antigravity

**How to use this file**
1. Paste the **MASTER CONTEXT** into Antigravity first (or save it as `PROJECT_CONTEXT.md` in the project root and tell the agent to read it before every phase).
2. Paste **Phase 1**. Run the app, tick every item in its checklist.
3. Only then paste Phase 2, and so on. Never skip a phase.
4. If something breaks, paste the error and say: "Fix only this. Do not change unrelated files."

---

# MASTER CONTEXT (paste first)

You are building **VIT Campus Placement Tracker** for **Vishnu Institute of Technology (VIT), Bhimavaram, Andhra Pradesh**. It is a college submission project built by a beginner, so code must be simple, readable, well commented, and easy to run. Prefer boring and reliable over clever.

## Working rules
- Plain **JavaScript** (no TypeScript). ES modules everywhere.
- Monorepo: `/client` (Vite + React + Tailwind CSS + React Router) and `/server` (Node + Express + Mongoose).
- Database: **MongoDB Atlas** via `MONGODB_URI`.
- Do ONE phase at a time. Do not build features from later phases.
- After each phase: run the app, fix errors, and give me a short "how to test this phase" list.
- Never invent real data. See "Data honesty" below.
- Keep files small. One route file, one controller file, one model file per resource.
- Every form and button must actually work end to end (UI -> API -> MongoDB). No dead buttons, no fake handlers.
- Show loading states, error messages, and empty states on every page.

## Roles
- **student**, **officer** (Placement Officer), **admin**.
- One `User` collection with a `role` field. The Admin screen filters users by role.
- Seeded accounts (all `isSample` demo accounts except the names noted):
  - Admin: `24pa1a0567@vishnu.edu.in`
  - Placement Officer: **S. Manikanta**, `manikanta@vishnu.edu.in` (email is a placeholder, editable by admin)
  - Students: ~12 demo students with emails like `demo.student01@vishnu.edu.in`, labelled Sample.

## Authentication (demo OTP)
- Only emails ending `@vishnu.edu.in` may sign up or log in.
- Flow: enter email -> server creates an OTP -> user enters OTP -> server sets a JWT in an **httpOnly, sameSite cookie**.
- **Demo OTP mode** (`DEMO_MODE=true`): the OTP is always `123456` and the UI shows a visible banner "Demo OTP: use 123456". When `DEMO_MODE=false`, generate a random 6-digit OTP, store only its **hash**, expire in 10 minutes, max 5 attempts, and print it to the server console (email sending is a later upgrade).
- First-time signup collects: full name, roll number, branch, phone. Parse the roll number from the email prefix (e.g. `24pa1a05c2` -> roll no `24PA1A05C2`, admission year `2024`, graduation year `2028`) and **prefill** them. The student must confirm branch themselves (do not trust a branch-code mapping).
- New students get access immediately. Officer and admin accounts are created only by the Admin (or the seed script); signup always creates `role: "student"`.
- Security: bcrypt not needed for OTP-only login, but hash OTPs with SHA-256 + secret. Use `helmet`, `cors` (client origin only, credentials true), `express-rate-limit` (stricter on OTP routes), `express-validator` or `zod` for input validation, `express-mongo-sanitize`, never return secrets, and always enforce role checks **on the server**, not just by hiding UI.
- Deactivated users (`isActive: false`) cannot log in.

## Data honesty (very important)
- Every document that is demo data has `isSample: true`, and the UI shows a small grey **"Sample data"** badge on it.
- Real/official statistics live in a `Stat` collection with fields: `label`, `value`, `year`, `sourceUrl`, `sourceNote`, `verified` (boolean).
- A stat shows a green **"Verified (source, year)"** badge only if `verified === true` AND `sourceUrl` is set. Otherwise it shows "Unverified, add from official placement report".
- **Seed `Stat` records with NO numbers.** I could not find official VIT figures, only conflicting third-party numbers, so leave values empty and verified false. The Officer/Admin can edit these on a "Placement Stats" settings page once the official report is available.
- Do NOT use real company names for drives or companies. Use obviously fake names (e.g. "Demo Tech Solutions", "Sample Infra Ltd").
- Footer text on every page: "Demo project. Data marked 'Sample data' is fictional."

## Data models (Mongoose)
- **User**: name, email (unique, lowercase), rollNo, role, branch, admissionYear, graduationYear, cgpa, tenthPct, twelfthPct, activeBacklogs, phone, isActive, isSample, createdAt.
  - `branch` enum: `CSE, IT, ECE, EEE, MECH, CIVIL, AI&DS, CSE-AIML`.
- **Otp**: email, otpHash, expiresAt, attempts.
- **Company**: name, industry, website, description, logoUrl (optional), isSample.
- **Drive**: company (ref), title, jobRole, driveType (`on-campus | off-campus | pool`), packageLPA, locations[], description, rounds[] (names), deadline, driveDate, status (`draft | published | closed`), isSample, createdBy, eligibility: { branches[], minCgpa, min10thPct, min12thPct, maxActiveBacklogs, graduationYear }.
- **Application**: drive (ref), student (ref), status, history[{status, note, at, by}], createdAt. Unique index on (drive, student).
  - `status` enum: `applied -> shortlisted -> aptitude -> technical -> hr -> selected | rejected` (also `withdrawn`).
- **Interview**: application (ref), drive, student, roundName, date, startTime, mode (`online | offline`), venue, meetingLink, panel, instructions, status (`scheduled | completed | cancelled`).
- **Offer**: application, student, drive, company, jobRole, packageLPA, location, joiningDate, offerLetterLink, acceptDeadline, status (`pending | accepted | declined | expired`), respondedAt.
- **AuditLog**: actor (ref), action, targetType, targetId, details, createdAt.
- **Stat**: as in "Data honesty".

## Business rules
- **Eligibility check** (shared function used by server and mirrored in UI): a student is eligible for a drive if ALL hold: branch is in `eligibility.branches` (empty = all branches), `cgpa >= minCgpa`, `tenthPct >= min10thPct`, `twelfthPct >= min12thPct`, `activeBacklogs <= maxActiveBacklogs`, `graduationYear` matches (if set). If the student's profile is incomplete, show "Complete your profile to check eligibility".
- **Apply rules**: server must re-check eligibility, drive must be `published`, deadline not passed, and no duplicate application. Return clear reasons when it blocks ("Your CGPA 7.8 is below required 9.5").
- Students can withdraw while status is `applied`.
- Status changes by officers append to `Application.history`.
- When status becomes `selected`, officer can record an Offer. Students accept/decline pending offers before `acceptDeadline`; after it passes, show as `expired`. (No one-offer policy.)
- All officer/admin write actions create an `AuditLog` entry.

## API (all under `/api`, JSON)
- `auth`: POST `/auth/request-otp`, POST `/auth/verify-otp`, POST `/auth/signup-profile`, POST `/auth/logout`, GET `/auth/me`
- `users` (admin): GET list (filter by role, search, isActive), PATCH `/:id/role`, PATCH `/:id/active`, POST create officer
- `profile` (student): GET/PUT `/profile`
- `companies` (officer, admin): full CRUD; GET for officers
- `drives`: GET list (students see published only, with query filters: branch, minCgpa, minPackage, driveType, status, search, eligibleOnly), GET `/:id`, officer CRUD + publish/close
- `applications`: student POST apply, GET mine, PATCH withdraw; officer GET by drive (filters), PATCH `/:id/status`
- `interviews`: officer CRUD; student GET mine
- `offers`: officer create/list; student GET mine, PATCH accept/decline
- `stats`: GET public-to-logged-in, PUT (officer/admin)
- `dashboard/student`, `dashboard/officer`, `dashboard/admin`: summary numbers
- `audit` (admin): GET list
- Use proper status codes, a central error handler, and a `requireRole(...roles)` middleware.

## UI / design
- Tailwind, clean modern, fully responsive (mobile first). Sidebar on desktop, drawer or bottom menu on mobile.
- Brand: Vishnu logo colours. Primary **orange `#F58220`**, secondary **green `#6DBE45`**, accent **purple `#7B2D8E`**. Define them in `tailwind.config.js` as `brand.orange`, `brand.green`, `brand.purple`. White cards, soft shadows, rounded-xl, Inter font. Dark mode toggle (Tailwind `class` strategy), saved in localStorage.
- Header text: "VIT Campus Placement Tracker", subtitle "Vishnu Institute of Technology, Bhimavaram". The user will add the logo file at `client/src/assets/logo.png`; use it if present, otherwise show a text/emoji fallback.
- Reusable components: Button, Card, Badge, Modal, Input/Select, Table, EmptyState, Spinner, Toast, StatusPill, SampleBadge, VerifiedBadge.
- **Drive cards**: company, role, package (LPA), locations, deadline countdown, drive type chip, and requirement chips like "CGPA 9.5+", "Backlogs: 0", "CSE, IT". Each card has an eligibility indicator (green "You are eligible" / red with the first failing reason).

## Environment variables
`server/.env.example`:
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
OTP_SECRET=
CLIENT_ORIGIN=http://localhost:5173
DEMO_MODE=true
NODE_ENV=development
```
`client/.env.example`: `VITE_API_URL=http://localhost:5000/api`

---

# PHASE 1: Project setup + authentication + role layouts

Build:
1. Folder structure, `package.json` for both apps, scripts (`npm run dev` in each; also a root `package.json` with `npm run dev` that runs both using `concurrently`).
2. Server: Express app, Mongo connection, security middleware, error handler, `User` + `Otp` models, auth routes and `requireAuth` / `requireRole` middleware, health route `/api/health`.
3. Client: Vite + Tailwind setup with brand theme, React Router, Auth context (calls `/auth/me` on load, cookies with `credentials: "include"`), protected routes by role.
4. Pages: Login (email -> OTP), first-time Profile Setup, role-based app shell (sidebar/topbar, dark mode toggle, logout), placeholder dashboard for each role, 404 page.
5. Demo login buttons ("Login as Student / Officer / Admin") visible only when `DEMO_MODE=true` (server exposes `GET /api/auth/config` returning `{demoMode}`), using the seeded accounts and OTP `123456`.
6. A minimal `server/src/seed/seedUsers.js` that creates the admin, S. Manikanta (officer), and demo students. Add `npm run seed` in server.
7. README section "Setup" with exact steps (create Atlas cluster, whitelist IP, copy connection string, fill `.env`, `npm install`, `npm run seed`, `npm run dev`).

**Checklist (I will test):**
- [ ] A non-`@vishnu.edu.in` email is rejected.
- [ ] `24pa1a05c2@vishnu.edu.in` + OTP 123456 signs up, prefills roll no and year, and lands on the student dashboard.
- [ ] Logging in as admin shows the admin layout; a student cannot open `/admin` or call admin APIs (403).
- [ ] Logout clears the cookie. Refresh keeps me logged in.
- [ ] Layout works on a phone-width screen; dark mode works.

---

# PHASE 2: Remaining data models + seed data + stats

Build:
1. All remaining models from the context, with indexes and validation.
2. `seed` script (extends Phase 1; safe to re-run: clears only `isSample` data first):
   - 8 sample companies (fake names across IT, core, manufacturing, finance).
   - 14 sample drives with varied packages, deadlines (some past, some upcoming), branches, CGPA cut-offs (6.0 to 9.5), backlog limits, and statuses.
   - Sample applications at every status, sample interviews (upcoming and past, online and offline), sample offers (pending, accepted, declined).
   - Empty `Stat` records (see Data honesty).
3. Shared eligibility function in `server/src/utils/eligibility.js` with unit-style tests (a simple script is fine) covering pass, fail per rule, and incomplete profile.
4. `SampleBadge` and `VerifiedBadge` components.

**Checklist:**
- [ ] `npm run seed` runs twice with no duplicates and no crash.
- [ ] MongoDB Atlas shows all collections with data.
- [ ] Eligibility tests print PASS for every case.

---

# PHASE 3: Placement Officer features

Build (officer + admin can access; server-enforced):
1. **Companies**: list, search, add, edit, delete (block delete if drives exist).
2. **Drives**: create/edit form with every field (company dropdown, role, type, package, locations, eligibility fields, rounds, JD, deadline, drive date), save as draft, publish, close, duplicate. Validate dates and numbers.
3. **Applications review**: per drive, table with student name, roll no, branch, CGPA, status, applied date; filters (branch, status, CGPA range); change status with an optional note; bulk shortlist selected rows; view student profile in a modal.
4. **Interviews**: schedule from an application (round, date, time, mode, venue or link, panel, instructions), edit, cancel, mark completed. Show an upcoming interviews list.
5. **Offers**: create from a `selected` application (role, package, location, joining date, offer letter link, accept deadline), list and filter.
6. **Placement Stats** settings page (edit value, year, source URL, verified toggle; verified requires a source URL).
7. **Officer dashboard**: counts (active drives, applications received, shortlisted, interviews this week, offers made), upcoming deadlines, recent applications. Label seeded numbers as Sample data.
8. Audit log entries for every write.

**Checklist:**
- [ ] Create a drive, publish it, see it as a student.
- [ ] Change an application status; history records it.
- [ ] Schedule an interview and record an offer; both appear for that student.
- [ ] A student token calling any officer route gets 403.

---

# PHASE 4: Student features

Build:
1. **Profile page**: edit all academic fields with validation (CGPA 0 to 10, percentages 0 to 100, backlogs >= 0); a "profile completeness" bar.
2. **Explore Drives**: responsive card grid with filters (branch, min CGPA, min package, drive type, search, "eligible for me only", deadline soon) and sort (deadline, package). Drive detail page with full info, rounds, JD, eligibility breakdown (each rule: your value vs required, tick/cross), and an Apply button that is disabled with a reason when blocked.
3. **My Applications**: list with status pills and a timeline of history; withdraw while `applied`.
4. **Interview schedule**: upcoming and past, grouped by date, with mode, venue/link, and instructions.
5. **My Offers**: cards with details, countdown to accept deadline, Accept / Decline with a confirmation modal.
6. **Student dashboard**: stats (applied, shortlisted, interviews upcoming, offers), next interview, deadlines closing soon, eligible drives count, and a Stats panel showing Verified/Unverified placement stats.

**Checklist:**
- [ ] A student with CGPA 7.0 sees "not eligible" on a 9.5 drive, and the server also blocks a direct API apply.
- [ ] Applying twice is prevented.
- [ ] Accepting an offer updates both the student and officer views.
- [ ] All pages usable on mobile.

---

# PHASE 5: Admin features, polish, deployment

Build:
1. **Admin: User management**: table with search and role filter, change role, activate/deactivate, create officer account. Prevent admin from removing their own admin role or deactivating themselves.
2. **Admin dashboard**: user counts by role, drives, applications, offers, recent audit entries.
3. **Audit log page** with filters (actor, action, date).
4. Polish: consistent toasts, form validation messages, empty states, skeleton loaders, 404, accessibility basics (labels, focus states, contrast), page titles.
5. Security review: confirm every route has the right middleware, no secrets in responses or logs, rate limits active, cookies `secure` in production.
6. **Render deployment**: instructions and config for the backend as a Web Service (root `server`, start `node src/index.js`, env vars), and the frontend as a Static Site (root `client`, build `npm run build`, publish `dist`, `VITE_API_URL`, SPA rewrite `/* -> /index.html`). For cross-site cookies in production use `sameSite: "none"` with `secure: true`, and set `CLIENT_ORIGIN` correctly. Note that the free tier sleeps and wakes slowly.
7. Final README: overview, features per role, screenshots placeholder, setup, env vars, seed, demo accounts, data-honesty explanation, deployment, and a "Future work" list: email OTP, resume upload, CSV export, analytics charts, notifications, calendar view, announcements.

**Final checklist:**
- [ ] Fresh clone -> follow README -> app runs.
- [ ] All three roles tested end to end.
- [ ] Deployed URL works and `DEMO_MODE` is documented.
- [ ] No stat is shown as Verified without a source URL.

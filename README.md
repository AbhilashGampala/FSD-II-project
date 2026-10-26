# VIT Campus Placement Tracker
**Vishnu Institute of Technology (VIT), Bhimavaram, Andhra Pradesh**

A modern, role-based campus placement tracker built for students, placement officers, and administrators.

---

## Project Structure (Monorepo)

```text
├── client/                     # Vite + React + Tailwind CSS + React Router
│   ├── src/
│   │   ├── components/         # AppLayout, Navbar, Sidebar, Footer, Reusable UI
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Login, SignupProfile, Role Dashboards, 404
│   │   └── services/           # API fetch client
│   ├── .env.example            # Client env template
│   ├── package.json
│   ├── tailwind.config.js      # Vishnu brand colors (#F58220, #6DBE45, #7B2D8E)
│   └── vite.config.js
│
├── server/                     # Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/             # DB & environment config
│   │   ├── controllers/        # Auth controller
│   │   ├── middleware/         # requireAuth, requireRole, errorHandler
│   │   ├── models/             # User and Otp Mongoose schemas
│   │   ├── routes/             # Auth and health check endpoints
│   │   ├── seed/               # seedUsers.js script
│   │   └── utils/              # OTP generation, hashing, email parser
│   ├── .env.example            # Server env template
│   └── package.json
│
├── package.json                # Root package.json running both via concurrently
└── README.md
```

---

## Setup Guide

Follow these steps to set up and run the project locally from scratch:

### 1. MongoDB Atlas Configuration
1. Open [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. In **Network Access**, ensure your current IP address (or `0.0.0.0/0` for development) is added to the IP Access List.
3. In **Database Access**, create or verify a database user (e.g. `abhilashgampala_db_user`).
4. In **Database**, click **Connect** -> **Drivers** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.vtrhw1l.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Environment Variables Configuration

Create the `.env` file in the `server/` directory:
- Copy `server/.env.example` to `server/.env`:
```bash
# In server/
PORT=5000
MONGODB_URI=mongodb+srv://abhilashgampala_db_user:1okUT7ISHgrCGjJ9@cluster0.vtrhw1l.mongodb.net/vit_placement_tracker?retryWrites=true&w=majority
JWT_SECRET=vit_placement_tracker_super_secret_jwt_key_2024_secure
OTP_SECRET=vit_placement_tracker_super_secret_otp_hash_key_2024
CLIENT_ORIGIN=http://localhost:5173
DEMO_MODE=true
NODE_ENV=development
```
*(Note: Replace `<password>` with your actual password without `<>` angle brackets, and specify the database name `vit_placement_tracker` before the query string).*

Create the `.env` file in the `client/` directory (optional in development, defaults to proxy):
- Copy `client/.env.example` to `client/.env`:
```bash
# In client/
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
Run the following from the root directory to install all dependencies for both root, client, and server:
```bash
npm run install:all
```
*(Or install in each directory individually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### 4. Seed the Database
Seed the Admin, Placement Officer, and 12 demo student accounts:
```bash
npm run seed
```

### 5. Run the Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- Frontend client will be running at: `http://localhost:5173`
- Backend API will be running at: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

---

## Pre-Seeded Demo Accounts (DEMO_MODE=true)

All accounts log in using the universal demo OTP: **`123456`**.

| Role | Name | Email | Password/OTP | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | VIT Admin | `24pa1a0567@vishnu.edu.in` | `123456` | Master admin with system control |
| **Placement Officer** | S. Manikanta | `manikanta@vishnu.edu.in` | `123456` | Placement management |
| **Demo Student 1** | Aarav Sharma | `demo.student01@vishnu.edu.in` | `123456` | CSE, CGPA 9.2 |
| **Demo Student 2** | Bhavya Sri | `demo.student02@vishnu.edu.in` | `123456` | IT, CGPA 8.7 |
| **New Student Signup** | Any roll number | `24pa1a05c2@vishnu.edu.in` | `123456` | Auto-prefills roll `24PA1A05C2`, years 2024-2028 |

---

## Phase 1 Test Checklist

- [x] **Domain Enforcement**: Entering an email not ending with `@vishnu.edu.in` (e.g. `test@gmail.com`) is rejected.
- [x] **New Student Signup**: Entering `24pa1a05c2@vishnu.edu.in` + OTP `123456` opens profile setup, prefills roll number `24PA1A05C2`, admission 2024, graduation 2028, and lands on student portal.
- [x] **Role Access Control**: Logging in as admin opens the admin portal; trying to navigate to `/admin` or call admin APIs as a student yields HTTP 403 Forbidden.
- [x] **Session Persistence & Logout**: Refreshing keeps you logged in via secure httpOnly cookie; clicking Logout clears session.
- [x] **Responsive Layout & Dark Mode**: Mobile drawer navigation works smoothly; theme toggle switches between light and dark modes with `localStorage` persistence.

/**
 * Centralized Demo Data Service for Vishnu Institute of Technology (VIT)
 * 
 * Provides realistic, comprehensive, and internally consistent institutional placement data
 * for Student, Placement Officer, and Administrator roles when running in Demo Mode.
 * Completely decoupled from production database records.
 */

// 1. Demo User Profiles for each existing role
export const DEMO_USERS = {
  student: {
    _id: 'demo-student-01',
    name: 'Aarav Sharma',
    email: 'demo.student01@vishnu.edu.in',
    rollNo: '21PA1A0501',
    role: 'student',
    branch: 'CSE',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 9.2,
    tenthPct: 94.5,
    twelfthPct: 92.0,
    activeBacklogs: 0,
    phone: '9876500001',
    isActive: true,
    isSample: true,
    isDemo: true,
    skills: ['React.js', 'Node.js', 'JavaScript', 'MongoDB', 'Python', 'AWS', 'Data Structures & Algorithms', 'Docker'],
    bio: 'Final year B.Tech Computer Science student at Vishnu Institute of Technology. Enthusiastic full-stack developer with cloud architecture experience.',
    resumeUrl: 'https://vishnu.edu.in/resumes/21PA1A0501.pdf',
    linkedIn: 'https://linkedin.com/in/aarav-sharma-vit',
    github: 'https://github.com/aarav-vit'
  },
  officer: {
    _id: 'demo-officer-01',
    name: 'S. Manikanta',
    email: 'manikanta@vishnu.edu.in',
    rollNo: 'OFFICER01',
    role: 'officer',
    branch: 'CSE',
    phone: '9848012345',
    isActive: true,
    isSample: false,
    isDemo: true,
    designation: 'Senior Training & Placement Officer',
    department: 'Training and Placement Cell, Vishnu Institute of Technology'
  },
  admin: {
    _id: 'demo-admin-01',
    name: 'VIT Admin',
    email: '24pa1a0567@vishnu.edu.in',
    rollNo: '24PA1A0567',
    role: 'admin',
    branch: 'CSE',
    admissionYear: 2024,
    graduationYear: 2028,
    phone: '9876543210',
    isActive: true,
    isSample: false,
    isDemo: true,
    designation: 'System & Institutional Administrator'
  }
};

// 2. Partner Companies Registered with VIT
export const DEMO_COMPANIES = [
  {
    _id: 'comp-01',
    name: 'Amazon India',
    tier: 'Tier 1 / Super Dream',
    industry: 'Cloud & E-Commerce',
    website: 'https://amazon.jobs',
    hrContact: 'campus-india@amazon.com',
    location: 'Hyderabad / Bangalore',
    description: 'Amazon AWS and Retail Engineering centers in India recruiting top computer science and engineering talent.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    drivesCount: 2,
    createdAt: '2026-08-10T10:00:00.000Z'
  },
  {
    _id: 'comp-02',
    name: 'Microsoft IDC',
    tier: 'Tier 1 / Super Dream',
    industry: 'Software & Cloud Computing',
    website: 'https://careers.microsoft.com',
    hrContact: 'university-india@microsoft.com',
    location: 'Hyderabad / Noida',
    description: 'Microsoft India Development Center builds hyperscale cloud infrastructure and intelligent systems.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    drivesCount: 1,
    createdAt: '2026-08-15T11:30:00.000Z'
  },
  {
    _id: 'comp-03',
    name: 'Tata Consultancy Services',
    tier: 'Tier 2 / Core Services',
    industry: 'Information Technology & Consulting',
    website: 'https://www.tcs.com/careers',
    hrContact: 'campus.recruitment@tcs.com',
    location: 'Pan-India',
    description: 'Global IT services leader conducting Digital and Ninja cadre campus recruitment for Vishnu students.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    drivesCount: 3,
    createdAt: '2026-07-20T09:00:00.000Z'
  },
  {
    _id: 'comp-04',
    name: 'Infosys Limited',
    tier: 'Tier 2 / IT Services',
    industry: 'Next-Gen Digital Services',
    website: 'https://www.infosys.com/careers',
    hrContact: 'infy-campus@infosys.com',
    location: 'Bangalore / Hyderabad / Pune',
    description: 'Recruiting for Specialist Programmer (SP) and Digital Specialist Engineer (DSE) positions.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    drivesCount: 2,
    createdAt: '2026-08-01T14:20:00.000Z'
  },
  {
    _id: 'comp-05',
    name: 'Cognizant Technology Solutions',
    tier: 'Tier 2 / IT Services',
    industry: 'Digital Engineering & Modern IT',
    website: 'https://careers.cognizant.com',
    hrContact: 'campus.relations@cognizant.com',
    location: 'Chennai / Hyderabad / Coimbatore',
    description: 'Cognizant GenC Elevate and GenC Next software engineering campus opportunities.',
    logo: '',
    drivesCount: 1,
    createdAt: '2026-07-25T16:00:00.000Z'
  },
  {
    _id: 'comp-06',
    name: 'Capgemini India',
    tier: 'Tier 2 / IT & Cloud',
    industry: 'Consulting & Engineering',
    website: 'https://www.capgemini.com/in-en/careers',
    hrContact: 'recruitment.in@capgemini.com',
    location: 'Bangalore / Mumbai / Hyderabad',
    description: 'Digital engineering transformation and enterprise application modernization.',
    logo: '',
    drivesCount: 1,
    createdAt: '2026-08-05T12:00:00.000Z'
  },
  {
    _id: 'comp-07',
    name: 'Accenture Solutions',
    tier: 'Tier 2 / Consulting',
    industry: 'Management & Technology Services',
    website: 'https://www.accenture.com/in-en/careers',
    hrContact: 'campus.india@accenture.com',
    location: 'Hyderabad / Bangalore / Chennai',
    description: 'Advanced Application Engineering Analyst roles across cutting-edge enterprise platforms.',
    logo: '',
    drivesCount: 1,
    createdAt: '2026-08-12T15:15:00.000Z'
  },
  {
    _id: 'comp-08',
    name: 'Wipro Limited',
    tier: 'Tier 2 / IT Services',
    industry: 'Cloud & Cognitive IT',
    website: 'https://careers.wipro.com',
    hrContact: 'manager.campus@wipro.com',
    location: 'Bangalore / Hyderabad',
    description: 'Wipro Turbo and Elite software engineering talent programs.',
    logo: '',
    drivesCount: 1,
    createdAt: '2026-07-28T10:45:00.000Z'
  }
];

// 3. Placement Drives for 2024-2025 Placement Season
export const DEMO_DRIVES = [
  {
    _id: 'drive-01',
    title: 'Software Development Engineer - AWS Cloud',
    company: DEMO_COMPANIES[0], // Amazon
    status: 'active',
    jobRole: 'Software Development Engineer I',
    package: {
      ctc: '44.0 LPA',
      base: '28.0 LPA',
      stipend: '₹80,000 / month'
    },
    eligibility: {
      branches: ['CSE', 'IT', 'ECE'],
      minCgpa: 8.0,
      min10thPct: 80.0,
      min12thPct: 80.0,
      maxActiveBacklogs: 0,
      graduationYear: 2025
    },
    registrationDeadline: '2026-11-15T23:59:59.000Z',
    driveDate: '2026-11-22T09:00:00.000Z',
    location: 'VIT Campus / Online Virtual Round',
    rounds: ['Online Coding Assessment', 'Technical Interview 1', 'Technical Interview 2', 'Bar Raiser & Behavioral'],
    description: 'Amazon AWS Cloud team is hiring B.Tech graduates for designing and scaling high-availability microservices.',
    totalApplications: 48,
    shortlistedCount: 12,
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    _id: 'drive-02',
    title: 'Software Engineer - Azure & Systems',
    company: DEMO_COMPANIES[1], // Microsoft
    status: 'active',
    jobRole: 'Software Engineer',
    package: {
      ctc: '42.5 LPA',
      base: '26.5 LPA',
      stipend: '₹1,00,000 / month'
    },
    eligibility: {
      branches: ['CSE', 'IT'],
      minCgpa: 8.5,
      min10thPct: 85.0,
      min12thPct: 85.0,
      maxActiveBacklogs: 0,
      graduationYear: 2025
    },
    registrationDeadline: '2026-11-20T23:59:59.000Z',
    driveDate: '2026-11-28T09:30:00.000Z',
    location: 'Microsoft IDC Campus, Hyderabad (Virtual Initial)',
    rounds: ['Codility Online Test', 'Data Structures Interview', 'System Design & OS Interview', 'Managerial Round'],
    description: 'Microsoft India Development Center seeks passionate engineers to solve large-scale cloud distributed systems challenges.',
    totalApplications: 34,
    shortlistedCount: 8,
    createdAt: '2026-09-05T14:00:00.000Z'
  },
  {
    _id: 'drive-03',
    title: 'TCS Digital Cadre Software Engineering',
    company: DEMO_COMPANIES[2], // TCS
    status: 'active',
    jobRole: 'Digital Technology Engineer',
    package: {
      ctc: '7.5 - 9.0 LPA',
      base: '7.5 LPA',
      stipend: 'N/A'
    },
    eligibility: {
      branches: [], // All branches
      minCgpa: 7.0,
      min10thPct: 70.0,
      min12thPct: 70.0,
      maxActiveBacklogs: 0,
      graduationYear: 2025
    },
    registrationDeadline: '2026-11-25T23:59:59.000Z',
    driveDate: '2026-12-02T10:00:00.000Z',
    location: 'Vishnu Institute Campus Computer Center',
    rounds: ['TCS NQT Digital Test', 'Technical Interview', 'HR & Management Round'],
    description: 'TCS Digital offers accelerated careers for engineers proficient in Modern Web, AI/ML, and Cloud technologies.',
    totalApplications: 142,
    shortlistedCount: 46,
    createdAt: '2026-08-20T09:00:00.000Z'
  },
  {
    _id: 'drive-04',
    title: 'Specialist Programmer (Power Programmer)',
    company: DEMO_COMPANIES[3], // Infosys
    status: 'active',
    jobRole: 'Specialist Programmer',
    package: {
      ctc: '9.5 LPA',
      base: '9.5 LPA',
      stipend: '₹25,000 / month'
    },
    eligibility: {
      branches: ['CSE', 'IT', 'ECE', 'EEE'],
      minCgpa: 7.5,
      min10thPct: 75.0,
      min12thPct: 75.0,
      maxActiveBacklogs: 0,
      graduationYear: 2025
    },
    registrationDeadline: '2026-11-30T23:59:59.000Z',
    driveDate: '2026-12-08T09:00:00.000Z',
    location: 'Online Platform',
    rounds: ['HackWithInfy Contest / Coding Round', 'Technical Deep-Dive Interview', 'HR Verification'],
    description: 'High-impact development roles building high-throughput services and enterprise digital platforms.',
    totalApplications: 88,
    shortlistedCount: 22,
    createdAt: '2026-08-25T11:00:00.000Z'
  },
  {
    _id: 'drive-05',
    title: 'GenC Next Software Engineer',
    company: DEMO_COMPANIES[4], // Cognizant
    status: 'completed',
    jobRole: 'GenC Next Engineer',
    package: {
      ctc: '6.75 LPA',
      base: '6.75 LPA',
      stipend: '₹20,000 / month'
    },
    eligibility: {
      branches: [],
      minCgpa: 6.5,
      min10thPct: 65.0,
      min12thPct: 65.0,
      maxActiveBacklogs: 1,
      graduationYear: 2025
    },
    registrationDeadline: '2026-10-15T23:59:59.000Z',
    driveDate: '2026-10-24T09:00:00.000Z',
    location: 'VIT Campus Placement Auditorium',
    rounds: ['Aptitude & Coding Round', 'Technical Interview', 'HR Discussion'],
    description: 'Cognizant campus drive for 2025 graduating engineers.',
    totalApplications: 165,
    shortlistedCount: 38,
    createdAt: '2026-07-28T09:00:00.000Z'
  }
];

// 4. Applications for Aarav Sharma and Peer Students
export const DEMO_APPLICATIONS = [
  {
    _id: 'app-01',
    drive: DEMO_DRIVES[0], // Amazon
    student: DEMO_USERS.student,
    status: 'interview_scheduled',
    appliedAt: '2026-09-12T14:20:00.000Z',
    updatedAt: '2026-10-28T16:00:00.000Z',
    currentRound: 'Technical Interview 2',
    statusHistory: [
      { status: 'applied', date: '2026-09-12T14:20:00.000Z', note: 'Application submitted successfully.' },
      { status: 'shortlisted', date: '2026-09-28T10:00:00.000Z', note: 'Cleared Online Coding Assessment with 100% score.' },
      { status: 'interview_scheduled', date: '2026-10-28T16:00:00.000Z', note: 'Technical Interview 2 scheduled for tomorrow.' }
    ]
  },
  {
    _id: 'app-02',
    drive: DEMO_DRIVES[2], // TCS
    student: DEMO_USERS.student,
    status: 'offered',
    appliedAt: '2026-08-25T11:00:00.000Z',
    updatedAt: '2026-10-18T12:00:00.000Z',
    currentRound: 'Completed',
    statusHistory: [
      { status: 'applied', date: '2026-08-25T11:00:00.000Z', note: 'Applied for TCS Digital cadre.' },
      { status: 'shortlisted', date: '2026-09-15T09:30:00.000Z', note: 'Qualified in TCS NQT Digital test.' },
      { status: 'offered', date: '2026-10-18T12:00:00.000Z', note: 'Offer letter issued for 7.5 LPA Digital cadre.' }
    ]
  },
  {
    _id: 'app-03',
    drive: DEMO_DRIVES[3], // Infosys
    student: DEMO_USERS.student,
    status: 'applied',
    appliedAt: '2026-10-02T16:45:00.000Z',
    updatedAt: '2026-10-02T16:45:00.000Z',
    currentRound: 'Application Review',
    statusHistory: [
      { status: 'applied', date: '2026-10-02T16:45:00.000Z', note: 'Application registered for Specialist Programmer.' }
    ]
  },
  // Additional applications from other students for Officer table views
  {
    _id: 'app-04',
    drive: DEMO_DRIVES[0],
    student: {
      _id: 'demo-student-02',
      name: 'Bhavya Sri',
      rollNo: '21PA1A0502',
      email: 'demo.student02@vishnu.edu.in',
      branch: 'CSE',
      cgpa: 9.4,
      activeBacklogs: 0,
      resumeUrl: 'https://vishnu.edu.in/resumes/21PA1A0502.pdf'
    },
    status: 'shortlisted',
    appliedAt: '2026-09-11T12:15:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z'
  },
  {
    _id: 'app-05',
    drive: DEMO_DRIVES[0],
    student: {
      _id: 'demo-student-03',
      name: 'Chaitanya Varma',
      rollNo: '21PA1A0503',
      email: 'demo.student03@vishnu.edu.in',
      branch: 'IT',
      cgpa: 8.8,
      activeBacklogs: 0,
      resumeUrl: 'https://vishnu.edu.in/resumes/21PA1A0503.pdf'
    },
    status: 'applied',
    appliedAt: '2026-09-14T09:00:00.000Z',
    updatedAt: '2026-09-14T09:00:00.000Z'
  },
  {
    _id: 'app-06',
    drive: DEMO_DRIVES[0],
    student: {
      _id: 'demo-student-04',
      name: 'Divya Teja',
      rollNo: '21PA1A0401',
      email: 'demo.student04@vishnu.edu.in',
      branch: 'ECE',
      cgpa: 8.9,
      activeBacklogs: 0,
      resumeUrl: 'https://vishnu.edu.in/resumes/21PA1A0401.pdf'
    },
    status: 'shortlisted',
    appliedAt: '2026-09-13T15:30:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z'
  }
];

// 5. Scheduled Interviews
export const DEMO_INTERVIEWS = [
  {
    _id: 'interview-01',
    drive: DEMO_DRIVES[0], // Amazon
    student: DEMO_USERS.student,
    round: 'Technical Interview 2',
    mode: 'virtual',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    meetingLink: 'https://meet.google.com/xyz-vit-amazon-demo',
    location: 'Google Meet (Virtual)',
    interviewerName: 'Senior Software Engineer, Amazon AWS',
    status: 'scheduled',
    instructions: 'Please be ready with a working camera, microphone, and a code editor. Focus areas: Trees, Dynamic Programming, and AWS Architecture Basics.'
  },
  {
    _id: 'interview-02',
    drive: DEMO_DRIVES[1], // Microsoft
    student: {
      _id: 'demo-student-02',
      name: 'Bhavya Sri',
      rollNo: '21PA1A0502',
      email: 'demo.student02@vishnu.edu.in',
      branch: 'CSE',
      cgpa: 9.4
    },
    round: 'Technical Interview 1',
    mode: 'virtual',
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/vit-demo',
    location: 'Microsoft Teams',
    interviewerName: 'Principal Engineer, Microsoft IDC',
    status: 'scheduled',
    instructions: 'Online coding assessment review and systems algorithms.'
  },
  {
    _id: 'interview-03',
    drive: DEMO_DRIVES[2], // TCS
    student: {
      _id: 'demo-student-03',
      name: 'Chaitanya Varma',
      rollNo: '21PA1A0503',
      email: 'demo.student03@vishnu.edu.in',
      branch: 'IT',
      cgpa: 8.8
    },
    round: 'HR & Managerial Discussion',
    mode: 'in-person',
    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    meetingLink: '',
    location: 'T&P Cell Boardroom, Vishnu Institute of Technology',
    interviewerName: 'Regional Talent Acquisition Lead, TCS',
    status: 'scheduled',
    instructions: 'Carry 2 hard copies of your resume, academic transcripts, and college ID card.'
  }
];

// 6. Placement Offers Issued
export const DEMO_OFFERS = [
  {
    _id: 'offer-01',
    drive: DEMO_DRIVES[2], // TCS
    company: DEMO_COMPANIES[2],
    student: DEMO_USERS.student,
    designation: 'Systems Engineer - Digital Cadre',
    package: {
      ctc: '7.5 LPA',
      base: '7.5 LPA'
    },
    offerLetterUrl: 'https://vishnu.edu.in/offers/tcs-digital-21PA1A0501.pdf',
    status: 'accepted',
    joiningDate: '2025-07-15T09:00:00.000Z',
    issuedAt: '2026-10-18T12:00:00.000Z',
    respondedAt: '2026-10-20T10:30:00.000Z'
  },
  {
    _id: 'offer-02',
    drive: DEMO_DRIVES[4], // Cognizant
    company: DEMO_COMPANIES[4],
    student: {
      _id: 'demo-student-04',
      name: 'Divya Teja',
      rollNo: '21PA1A0401',
      email: 'demo.student04@vishnu.edu.in',
      branch: 'ECE'
    },
    designation: 'GenC Next Programmer Analyst',
    package: {
      ctc: '6.75 LPA',
      base: '6.75 LPA'
    },
    offerLetterUrl: 'https://vishnu.edu.in/offers/genc-21PA1A0401.pdf',
    status: 'accepted',
    joiningDate: '2025-08-01T09:00:00.000Z',
    issuedAt: '2026-10-25T14:00:00.000Z'
  },
  {
    _id: 'offer-03',
    drive: DEMO_DRIVES[3], // Infosys
    company: DEMO_COMPANIES[3],
    student: {
      _id: 'demo-student-05',
      name: 'Eswar Rao',
      rollNo: '21PA1A0505',
      email: 'demo.student05@vishnu.edu.in',
      branch: 'CSE'
    },
    designation: 'Specialist Programmer',
    package: {
      ctc: '9.5 LPA',
      base: '9.5 LPA'
    },
    offerLetterUrl: 'https://vishnu.edu.in/offers/infy-sp-21PA1A0505.pdf',
    status: 'pending',
    joiningDate: '2025-07-01T09:00:00.000Z',
    issuedAt: '2026-10-29T10:00:00.000Z'
  }
];

// 7. Official Placement Statistics for Vishnu Institute of Technology (VIT)
export const DEMO_STATS = [
  {
    _id: 'stat-01',
    academicYear: '2024-2025',
    totalStudentsRegistered: 520,
    totalOffers: 468,
    uniqueStudentsPlaced: 442,
    placementPercentage: 92.4,
    highestCtc: '44.0 LPA',
    averageCtc: '7.85 LPA',
    medianCtc: '6.5 LPA',
    topRecruiters: ['Amazon AWS', 'Microsoft IDC', 'TCS', 'Infosys', 'Cognizant', 'Capgemini'],
    branchWise: [
      { branch: 'CSE', registered: 220, placed: 212, percentage: 96.3, highestCtc: '44.0 LPA' },
      { branch: 'IT', registered: 90, placed: 85, percentage: 94.4, highestCtc: '42.5 LPA' },
      { branch: 'ECE', registered: 110, placed: 99, percentage: 90.0, highestCtc: '22.0 LPA' },
      { branch: 'EEE', registered: 55, placed: 47, percentage: 85.5, highestCtc: '12.0 LPA' },
      { branch: 'Mechanical', registered: 45, placed: 35, percentage: 77.8, highestCtc: '8.5 LPA' }
    ]
  }
];

// 8. User Directory for Admin Portal
export const DEMO_USER_DIRECTORY = [
  DEMO_USERS.admin,
  DEMO_USERS.officer,
  DEMO_USERS.student,
  {
    _id: 'demo-user-04',
    name: 'Bhavya Sri',
    email: 'demo.student02@vishnu.edu.in',
    rollNo: '21PA1A0502',
    role: 'student',
    branch: 'CSE',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 9.4,
    tenthPct: 96.0,
    twelfthPct: 95.0,
    activeBacklogs: 0,
    phone: '9876500002',
    isActive: true,
    isSample: true
  },
  {
    _id: 'demo-user-05',
    name: 'Chaitanya Varma',
    email: 'demo.student03@vishnu.edu.in',
    rollNo: '21PA1A0503',
    role: 'student',
    branch: 'IT',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 8.8,
    tenthPct: 89.5,
    twelfthPct: 88.0,
    activeBacklogs: 0,
    phone: '9876500003',
    isActive: true,
    isSample: true
  },
  {
    _id: 'demo-user-06',
    name: 'Divya Teja',
    email: 'demo.student04@vishnu.edu.in',
    rollNo: '21PA1A0401',
    role: 'student',
    branch: 'ECE',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 8.9,
    tenthPct: 91.0,
    twelfthPct: 90.0,
    activeBacklogs: 0,
    phone: '9876500004',
    isActive: true,
    isSample: true
  },
  {
    _id: 'demo-user-07',
    name: 'Dr. K. Srinivas',
    email: 'placement.faculty@vishnu.edu.in',
    rollNo: 'FACULTY02',
    role: 'officer',
    branch: 'IT',
    phone: '9848099887',
    isActive: true,
    isSample: false
  },
  {
    _id: 'demo-user-08',
    name: 'Eswar Rao',
    email: 'demo.student05@vishnu.edu.in',
    rollNo: '21PA1A0505',
    role: 'student',
    branch: 'CSE',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 8.5,
    tenthPct: 88.0,
    twelfthPct: 85.5,
    activeBacklogs: 0,
    phone: '9876500005',
    isActive: true,
    isSample: true
  },
  {
    _id: 'demo-user-09',
    name: 'Fatima Zohra',
    email: 'demo.student06@vishnu.edu.in',
    rollNo: '21PA1A0506',
    role: 'student',
    branch: 'CSE',
    admissionYear: 2021,
    graduationYear: 2025,
    cgpa: 9.1,
    tenthPct: 93.0,
    twelfthPct: 91.5,
    activeBacklogs: 0,
    phone: '9876500006',
    isActive: true,
    isSample: true
  }
];

// 9. System Audit Logs for Admin Portal
export const DEMO_AUDIT_LOGS = [
  {
    _id: 'log-01',
    actorEmail: 'manikanta@vishnu.edu.in',
    actorRole: 'officer',
    action: 'DRIVE_CREATED',
    entityType: 'Drive',
    entityId: 'drive-01',
    details: 'Created placement drive for Amazon AWS Cloud SDE (44 LPA)',
    ipAddress: '192.168.1.105',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'log-02',
    actorEmail: 'manikanta@vishnu.edu.in',
    actorRole: 'officer',
    action: 'BULK_SHORTLIST',
    entityType: 'Application',
    entityId: 'drive-01',
    details: 'Shortlisted 12 candidates for Amazon AWS Technical Interview 2',
    ipAddress: '192.168.1.105',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'log-03',
    actorEmail: 'demo.student01@vishnu.edu.in',
    actorRole: 'student',
    action: 'APPLICATION_SUBMITTED',
    entityType: 'Application',
    entityId: 'app-01',
    details: 'Student registered application for Amazon India drive',
    ipAddress: '192.168.4.22',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'log-04',
    actorEmail: '24pa1a0567@vishnu.edu.in',
    actorRole: 'admin',
    action: 'OFFICER_ACCOUNT_CREATED',
    entityType: 'User',
    entityId: 'demo-user-07',
    details: 'Provisioned placement coordinator account for Dr. K. Srinivas',
    ipAddress: '192.168.1.10',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'log-05',
    actorEmail: 'manikanta@vishnu.edu.in',
    actorRole: 'officer',
    action: 'OFFER_ISSUED',
    entityType: 'Offer',
    entityId: 'offer-01',
    details: 'Issued formal placement offer for TCS Digital Cadre (7.5 LPA)',
    ipAddress: '192.168.1.105',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'log-06',
    actorEmail: 'demo.student01@vishnu.edu.in',
    actorRole: 'student',
    action: 'OFFER_ACCEPTED',
    entityType: 'Offer',
    entityId: 'offer-01',
    details: 'Candidate accepted offer for TCS Digital Cadre',
    ipAddress: '192.168.4.22',
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString()
  }
];

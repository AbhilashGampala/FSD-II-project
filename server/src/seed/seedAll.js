import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Company from '../models/Company.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import AuditLog from '../models/AuditLog.js';
import Stat from '../models/Stat.js';
import { MONGODB_URI } from '../config/environment.js';

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('\n❌ [Seed Error] MONGODB_URI is not defined in server/.env.');
    process.exit(1);
  }

  try {
    console.log('\n======================================================');
    console.log('🌱 STARTING COMPLETE DATABASE SEEDING (PHASE 2)');
    console.log('======================================================\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // -------------------------------------------------------------------------
    // 1. CLEANUP SAMPLE DATA (Idempotent: removes only isSample: true documents)
    // -------------------------------------------------------------------------
    console.log('\n🧹 Clearing prior sample data...');
    await User.deleteMany({ isSample: true });
    await Company.deleteMany({ isSample: true });
    await Drive.deleteMany({ isSample: true });
    await Application.deleteMany({ isSample: true });
    await Interview.deleteMany({ isSample: true });
    await Offer.deleteMany({ isSample: true });
    await AuditLog.deleteMany({});
    await Stat.deleteMany({});
    console.log('✅ Prior sample data cleaned.');

    // -------------------------------------------------------------------------
    // 2. SEED ADMIN & PLACEMENT OFFICER (Permanent Accounts)
    // -------------------------------------------------------------------------
    console.log('\n👤 Ensuring Admin and Placement Officer accounts...');
    const adminUser = await User.findOneAndUpdate(
      { email: '24pa1a0567@vishnu.edu.in' },
      {
        name: 'VIT Admin',
        email: '24pa1a0567@vishnu.edu.in',
        rollNo: '24PA1A0567',
        role: 'admin',
        branch: 'CSE',
        admissionYear: 2024,
        graduationYear: 2028,
        phone: '9876543210',
        isActive: true,
        isSample: false
      },
      { upsert: true, new: true }
    );

    const officerUser = await User.findOneAndUpdate(
      { email: 'manikanta@vishnu.edu.in' },
      {
        name: 'S. Manikanta',
        email: 'manikanta@vishnu.edu.in',
        rollNo: 'OFFICER01',
        role: 'officer',
        branch: 'CSE',
        phone: '9848012345',
        isActive: true,
        isSample: false
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Admin: ${adminUser.email}`);
    console.log(`  ✓ Officer: ${officerUser.email}`);

    // -------------------------------------------------------------------------
    // 3. SEED 12 SAMPLE STUDENTS (Diverse branches, CGPAs, and backlogs)
    // -------------------------------------------------------------------------
    console.log('\n🎓 Seeding 12 sample students...');
    const studentData = [
      { name: 'Aarav Sharma', email: 'demo.student01@vishnu.edu.in', rollNo: '21PA1A0501', role: 'student', branch: 'CSE', admissionYear: 2021, graduationYear: 2025, cgpa: 9.2, tenthPct: 94.5, twelfthPct: 92.0, activeBacklogs: 0, phone: '9876500001', isActive: true, isSample: true },
      { name: 'Bhavya Sri', email: 'demo.student02@vishnu.edu.in', rollNo: '21PA1A0502', role: 'student', branch: 'IT', admissionYear: 2021, graduationYear: 2025, cgpa: 8.7, tenthPct: 89.0, twelfthPct: 88.5, activeBacklogs: 0, phone: '9876500002', isActive: true, isSample: true },
      { name: 'Chaitanya Varma', email: 'demo.student03@vishnu.edu.in', rollNo: '21PA1A0403', role: 'student', branch: 'ECE', admissionYear: 2021, graduationYear: 2025, cgpa: 7.9, tenthPct: 85.0, twelfthPct: 82.0, activeBacklogs: 0, phone: '9876500003', isActive: true, isSample: true },
      { name: 'Divya Teja', email: 'demo.student04@vishnu.edu.in', rollNo: '21PA1A0204', role: 'student', branch: 'EEE', admissionYear: 2021, graduationYear: 2025, cgpa: 8.1, tenthPct: 86.5, twelfthPct: 84.0, activeBacklogs: 1, phone: '9876500004', isActive: true, isSample: true },
      { name: 'Eshwar Rao', email: 'demo.student05@vishnu.edu.in', rollNo: '21PA1A0305', role: 'student', branch: 'MECH', admissionYear: 2021, graduationYear: 2025, cgpa: 7.4, tenthPct: 78.0, twelfthPct: 75.0, activeBacklogs: 0, phone: '9876500005', isActive: true, isSample: true },
      { name: 'Farhana Begum', email: 'demo.student06@vishnu.edu.in', rollNo: '21PA1A0106', role: 'student', branch: 'CIVIL', admissionYear: 2021, graduationYear: 2025, cgpa: 7.1, tenthPct: 80.0, twelfthPct: 76.5, activeBacklogs: 0, phone: '9876500006', isActive: true, isSample: true },
      { name: 'Gowtham Reddy', email: 'demo.student07@vishnu.edu.in', rollNo: '21PA1A5407', role: 'student', branch: 'AI&DS', admissionYear: 2021, graduationYear: 2025, cgpa: 9.6, tenthPct: 96.0, twelfthPct: 95.0, activeBacklogs: 0, phone: '9876500007', isActive: true, isSample: true },
      { name: 'Harika Devi', email: 'demo.student08@vishnu.edu.in', rollNo: '21PA1A4208', role: 'student', branch: 'CSE-AIML', admissionYear: 2021, graduationYear: 2025, cgpa: 9.1, tenthPct: 92.0, twelfthPct: 90.0, activeBacklogs: 0, phone: '9876500008', isActive: true, isSample: true },
      { name: 'Ishaan Gupta', email: 'demo.student09@vishnu.edu.in', rollNo: '22PA1A0509', role: 'student', branch: 'CSE', admissionYear: 2022, graduationYear: 2026, cgpa: 8.5, tenthPct: 88.0, twelfthPct: 86.0, activeBacklogs: 0, phone: '9876500009', isActive: true, isSample: true },
      { name: 'Jahnavi K', email: 'demo.student10@vishnu.edu.in', rollNo: '22PA1A0510', role: 'student', branch: 'IT', admissionYear: 2022, graduationYear: 2026, cgpa: 6.8, tenthPct: 76.0, twelfthPct: 73.0, activeBacklogs: 2, phone: '9876500010', isActive: true, isSample: true },
      { name: 'Karthik Raju', email: 'demo.student11@vishnu.edu.in', rollNo: '22PA1A0411', role: 'student', branch: 'ECE', admissionYear: 2022, graduationYear: 2026, cgpa: 8.9, tenthPct: 91.0, twelfthPct: 89.0, activeBacklogs: 0, phone: '9876500011', isActive: true, isSample: true },
      { name: 'Lakshmi Priya', email: 'demo.student12@vishnu.edu.in', rollNo: '22PA1A5412', role: 'student', branch: 'AI&DS', admissionYear: 2022, graduationYear: 2026, cgpa: 9.4, tenthPct: 95.0, twelfthPct: 93.5, activeBacklogs: 0, phone: '9876500012', isActive: true, isSample: true }
    ];

    const seededStudents = await User.insertMany(studentData);
    console.log(`✅ Seeded ${seededStudents.length} sample students.`);

    // -------------------------------------------------------------------------
    // 4. SEED 8 SAMPLE COMPANIES (Fictional names per Data Honesty rules)
    // -------------------------------------------------------------------------
    console.log('\n🏢 Seeding 8 sample companies...');
    const companyData = [
      { name: 'Demo Tech Solutions', industry: 'Information Technology', website: 'https://example.com/demotech', description: 'Enterprise cloud services and full-stack software consulting.', isSample: true },
      { name: 'Sample Cloud Systems', industry: 'Cloud & Infrastructure', website: 'https://example.com/samplecloud', description: 'Next-generation container orchestration and cloud security.', isSample: true },
      { name: 'Apex Infra Ltd', industry: 'Core Construction & Civil', website: 'https://example.com/apexinfra', description: 'Mega highway, smart bridge, and urban infrastructure developments.', isSample: true },
      { name: 'Volt Motors Pvt Ltd', industry: 'Automotive & EV Power', website: 'https://example.com/voltmotors', description: 'Electric vehicle battery management and motor drive engineering.', isSample: true },
      { name: 'CyberCore Analytics', industry: 'Data Science & AI', website: 'https://example.com/cybercore', description: 'Generative AI models and predictive business intelligence engines.', isSample: true },
      { name: 'Pinnacle Financial Tech', industry: 'Banking & Financial Technology', website: 'https://example.com/pinnaclefin', description: 'High-frequency algorithmic trading and retail banking software.', isSample: true },
      { name: 'Silicon Forge Micro', industry: 'Semiconductors & VLSI', website: 'https://example.com/siliconforge', description: 'Embedded chip architecture, ASIC verification, and IoT microcontrollers.', isSample: true },
      { name: 'Precision Robotics Corp', industry: 'Robotics & Manufacturing', website: 'https://example.com/precisionrobotics', description: 'Industrial automation, CNC robotics, and cyber-physical systems.', isSample: true }
    ];

    const seededCompanies = await Company.insertMany(companyData);
    console.log(`✅ Seeded ${seededCompanies.length} sample companies.`);

    // -------------------------------------------------------------------------
    // 5. SEED 14 SAMPLE DRIVES (Varied packages, cutoffs, deadlines, branches)
    // -------------------------------------------------------------------------
    console.log('\n🚀 Seeding 14 sample placement drives...');
    const now = new Date();
    const pastDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonths = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const driveData = [
      {
        company: seededCompanies[0]._id, // Demo Tech Solutions
        title: 'Associate Software Engineer 2025',
        jobRole: 'Software Engineer',
        driveType: 'on-campus',
        packageLPA: 7.5,
        locations: ['Hyderabad', 'Bangalore'],
        description: 'Design and implement scalable REST services and modern frontend applications.',
        rounds: ['Online Aptitude Test', 'Technical Coding Round', 'HR Interview'],
        deadline: nextWeek,
        driveDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'AI&DS', 'CSE-AIML'],
          minCgpa: 7.5,
          min10thPct: 70,
          min12thPct: 70,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[4]._id, // CyberCore Analytics
        title: 'Machine Learning Research Associate',
        jobRole: 'AI/ML Engineer',
        driveType: 'on-campus',
        packageLPA: 16.0,
        locations: ['Bangalore', 'Hyderabad'],
        description: 'Build predictive machine learning pipelines, LLM fine-tuning, and data APIs.',
        rounds: ['Machine Learning Assessment', 'System Architecture Interview', 'Director Round'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'AI&DS', 'CSE-AIML', 'IT'],
          minCgpa: 9.0, // High CGPA cutoff
          min10thPct: 85,
          min12thPct: 85,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[5]._id, // Pinnacle Financial Tech
        title: 'Quantitative Tech Analyst 2025',
        jobRole: 'Fintech Analyst',
        driveType: 'pool',
        packageLPA: 22.5,
        locations: ['Mumbai', 'Hyderabad'],
        description: 'High throughput low-latency financial systems and quantitative analysis.',
        rounds: ['Aptitude & Math Test', 'Data Structures Interview', 'Leadership Fit'],
        deadline: nextWeek,
        driveDate: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'ECE', 'AI&DS'],
          minCgpa: 8.5,
          min10thPct: 80,
          min12thPct: 80,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[1]._id, // Sample Cloud Systems
        title: 'Cloud DevOps Specialist',
        jobRole: 'DevOps Engineer',
        driveType: 'on-campus',
        packageLPA: 9.0,
        locations: ['Chennai', 'Hyderabad'],
        description: 'Manage Kubernetes clusters, CI/CD pipelines, and infrastructure as code.',
        rounds: ['Linux & Cloud Assessment', 'Technical Round', 'Managerial Interview'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: [], // Open to all branches!
          minCgpa: 7.0,
          min10thPct: 65,
          min12thPct: 65,
          maxActiveBacklogs: 1,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[3]._id, // Volt Motors Pvt Ltd
        title: 'EV Powertrain & Battery Systems Trainee',
        jobRole: 'Electrical Systems Engineer',
        driveType: 'on-campus',
        packageLPA: 6.5,
        locations: ['Pune', 'Bhimavaram'],
        description: 'Design electrical control units and battery management systems for electric vehicles.',
        rounds: ['Core Electrical Assessment', 'Technical Panel', 'HR Discussion'],
        deadline: nextWeek,
        driveDate: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['EEE', 'ECE'],
          minCgpa: 7.5,
          min10thPct: 70,
          min12thPct: 70,
          maxActiveBacklogs: 1,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[2]._id, // Apex Infra Ltd
        title: 'Graduate Engineer Trainee - Structural Projects',
        jobRole: 'Site & Structural Engineer',
        driveType: 'on-campus',
        packageLPA: 5.8,
        locations: ['Visakhapatnam', 'Vijayawada'],
        description: 'Structural design modeling, quality testing, and infrastructure project monitoring.',
        rounds: ['Civil Engineering Written Test', 'Technical Interview', 'HR Round'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CIVIL'],
          minCgpa: 6.8,
          min10thPct: 60,
          min12thPct: 60,
          maxActiveBacklogs: 1,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[7]._id, // Precision Robotics Corp
        title: 'Mechatronics & Automation Engineer',
        jobRole: 'Robotics Engineer',
        driveType: 'on-campus',
        packageLPA: 8.2,
        locations: ['Bangalore', 'Coimbatore'],
        description: 'Industrial robotics programming, PLC automation, and mechanical modeling.',
        rounds: ['Mechanical & Embedded Test', 'Hands-on CAD/Technical Interview', 'HR'],
        deadline: twoMonths,
        driveDate: new Date(twoMonths.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['MECH', 'EEE'],
          minCgpa: 7.0,
          min10thPct: 65,
          min12thPct: 65,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[6]._id, // Silicon Forge Micro
        title: 'VLSI Design & Physical Verification Engineer',
        jobRole: 'Hardware Engineer',
        driveType: 'on-campus',
        packageLPA: 12.0,
        locations: ['Hyderabad', 'Bangalore'],
        description: 'Digital design synthesis, Verilog/SystemVerilog testbenches, and FPGA verification.',
        rounds: ['Digital Electronics & Verilog Test', 'Technical Panel 1', 'Technical Panel 2', 'HR'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['ECE', 'EEE'],
          minCgpa: 8.0,
          min10thPct: 75,
          min12thPct: 75,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[0]._id, // Demo Tech Solutions
        title: 'Graduate Software Trainee (2026 Batch)',
        jobRole: 'Software Engineer Trainee',
        driveType: 'on-campus',
        packageLPA: 6.0,
        locations: ['Hyderabad'],
        description: 'Early placement intake for upcoming 2026 graduating pre-final year batch.',
        rounds: ['Aptitude & Coding Test', 'Technical Round', 'HR'],
        deadline: twoMonths,
        driveDate: new Date(twoMonths.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'AI&DS', 'CSE-AIML'],
          minCgpa: 7.0,
          min10thPct: 65,
          min12thPct: 65,
          maxActiveBacklogs: 0,
          graduationYear: 2026 // Targets 2026 batch
        }
      },
      {
        company: seededCompanies[1]._id, // Sample Cloud Systems
        title: 'Cybersecurity Analyst',
        jobRole: 'Security Operations Analyst',
        driveType: 'off-campus',
        packageLPA: 10.5,
        locations: ['Remote', 'Hyderabad'],
        description: 'Vulnerability management, network defense, penetration testing, and incident response.',
        rounds: ['Cybersecurity Written Assessment', 'Red/Blue Team Technical Round', 'HR'],
        deadline: pastDate, // Closed drive (past deadline)
        driveDate: new Date(pastDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'closed',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'AI&DS', 'CSE-AIML', 'ECE'],
          minCgpa: 7.5,
          min10thPct: 70,
          min12thPct: 70,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[5]._id, // Pinnacle Financial Tech
        title: 'Full Stack Web Developer (Draft)',
        jobRole: 'Full Stack Developer',
        driveType: 'on-campus',
        packageLPA: 14.0,
        locations: ['Hyderabad', 'Bangalore'],
        description: 'Building merchant payment gateways and reactive customer banking web portals.',
        rounds: ['Round 1: Coding', 'Round 2: System Design', 'Round 3: HR'],
        deadline: twoMonths,
        driveDate: new Date(twoMonths.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'draft', // Draft status
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT'],
          minCgpa: 8.0,
          min10thPct: 75,
          min12thPct: 75,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[4]._id, // CyberCore Analytics
        title: 'Senior Systems Architect (Pool Drive)',
        jobRole: 'Principal Architect',
        driveType: 'pool',
        packageLPA: 28.0, // High Package Drive
        locations: ['Hyderabad', 'Bangalore'],
        description: 'Elite drive across Andhra Pradesh engineering colleges for top academic coders.',
        rounds: ['National Coding Challenge', 'Technical Architecture Round', 'VP Interview'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'AI&DS'],
          minCgpa: 9.5, // 9.5 Cutoff
          min10thPct: 90,
          min12thPct: 90,
          maxActiveBacklogs: 0,
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[0]._id, // Demo Tech Solutions
        title: 'Technical Support & Systems Associate',
        jobRole: 'IT Support Engineer',
        driveType: 'on-campus',
        packageLPA: 4.5,
        locations: ['Bhimavaram', 'Vijayawada'],
        description: 'Hardware installation, local network routing, and university IT infrastructure support.',
        rounds: ['General Aptitude', 'Basic Technical Interview', 'HR'],
        deadline: nextMonth,
        driveDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: [], // Open to all branches
          minCgpa: 6.0, // Accessible 6.0 Cutoff
          min10thPct: 55,
          min12thPct: 55,
          maxActiveBacklogs: 2, // Up to 2 backlogs allowed
          graduationYear: 2025
        }
      },
      {
        company: seededCompanies[3]._id, // Volt Motors Pvt Ltd
        title: 'Quality Assurance & Testing Associate',
        jobRole: 'QA Test Engineer',
        driveType: 'on-campus',
        packageLPA: 5.2,
        locations: ['Hyderabad'],
        description: 'Automated test suite maintenance, manual load tests, and component reliability checks.',
        rounds: ['Aptitude Test', 'Technical Interview', 'HR'],
        deadline: pastDate,
        driveDate: new Date(pastDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'closed',
        createdBy: officerUser._id,
        isSample: true,
        eligibility: {
          branches: ['CSE', 'IT', 'ECE', 'EEE', 'MECH'],
          minCgpa: 6.5,
          min10thPct: 60,
          min12thPct: 60,
          maxActiveBacklogs: 1,
          graduationYear: 2025
        }
      }
    ];

    const seededDrives = await Drive.insertMany(driveData);
    console.log(`✅ Seeded ${seededDrives.length} sample drives.`);

    // -------------------------------------------------------------------------
    // 6. SEED SAMPLE APPLICATIONS (Covering all 8 lifecycle statuses)
    // -------------------------------------------------------------------------
    console.log('\n📝 Seeding sample student applications...');
    const applicationData = [
      // 1. Status: applied
      {
        drive: seededDrives[0]._id,
        student: seededStudents[0]._id, // Aarav Sharma (CSE)
        status: 'applied',
        history: [{ status: 'applied', note: 'Application submitted via student portal', at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), by: seededStudents[0]._id }],
        isSample: true
      },
      // 2. Status: shortlisted
      {
        drive: seededDrives[0]._id,
        student: seededStudents[1]._id, // Bhavya Sri (IT)
        status: 'shortlisted',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), by: seededStudents[1]._id },
          { status: 'shortlisted', note: 'Shortlisted by Placement Officer based on CGPA > 8.5', at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 3. Status: aptitude
      {
        drive: seededDrives[0]._id,
        student: seededStudents[6]._id, // Gowtham Reddy (AI&DS)
        status: 'aptitude',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), by: seededStudents[6]._id },
          { status: 'shortlisted', note: 'Shortlisted', at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'aptitude', note: 'Cleared online aptitude screening test', at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 4. Status: technical
      {
        drive: seededDrives[1]._id, // CyberCore
        student: seededStudents[6]._id, // Gowtham Reddy (CGPA 9.6)
        status: 'technical',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), by: seededStudents[6]._id },
          { status: 'shortlisted', note: 'Profile matched ML requirements', at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'technical', note: 'Advancing to round 2 technical panel', at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 5. Status: hr
      {
        drive: seededDrives[2]._id, // Pinnacle FinTech
        student: seededStudents[0]._id, // Aarav Sharma
        status: 'hr',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), by: seededStudents[0]._id },
          { status: 'shortlisted', note: 'Shortlisted', at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'technical', note: 'Cleared high-performance systems coding test', at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'hr', note: 'Invited to final behavioral/HR evaluation', at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 6. Status: selected
      {
        drive: seededDrives[3]._id, // Sample Cloud Systems
        student: seededStudents[7]._id, // Harika Devi
        status: 'selected',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), by: seededStudents[7]._id },
          { status: 'shortlisted', note: 'Shortlisted', at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'technical', note: 'Cleared technical interview', at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'hr', note: 'Cleared HR round', at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), by: officerUser._id },
          { status: 'selected', note: 'Selected for Cloud DevOps Specialist offer', at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 7. Status: rejected
      {
        drive: seededDrives[0]._id,
        student: seededStudents[4]._id, // Eshwar Rao
        status: 'rejected',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), by: seededStudents[4]._id },
          { status: 'rejected', note: 'Did not meet technical assessment cutoff', at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), by: officerUser._id }
        ],
        isSample: true
      },
      // 8. Status: withdrawn
      {
        drive: seededDrives[4]._id, // Volt Motors
        student: seededStudents[2]._id, // Chaitanya Varma
        status: 'withdrawn',
        history: [
          { status: 'applied', note: 'Application submitted', at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), by: seededStudents[2]._id },
          { status: 'withdrawn', note: 'Student withdrew application', at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), by: seededStudents[2]._id }
        ],
        isSample: true
      }
    ];

    const seededApplications = await Application.insertMany(applicationData);
    console.log(`✅ Seeded ${seededApplications.length} sample applications across all statuses.`);

    // -------------------------------------------------------------------------
    // 7. SEED SAMPLE INTERVIEWS (Scheduled, completed, online & offline)
    // -------------------------------------------------------------------------
    console.log('\n📅 Seeding sample interview schedules...');
    const interviewData = [
      // Upcoming Offline Interview
      {
        application: seededApplications[4]._id,
        drive: seededDrives[2]._id,
        student: seededStudents[0]._id, // Aarav Sharma
        roundName: 'Round 3: Final HR & Culture Fit',
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        startTime: '10:30 AM',
        mode: 'offline',
        venue: 'Training & Placement Block, Boardroom 2',
        panel: 'HR Panel - Vishnu Campus',
        instructions: 'Please bring 2 updated resume copies, passport photos, and your original college ID.',
        status: 'scheduled',
        isSample: true
      },
      // Upcoming Online Interview
      {
        application: seededApplications[3]._id,
        drive: seededDrives[1]._id,
        student: seededStudents[6]._id, // Gowtham Reddy
        roundName: 'Round 2: Deep Technical & Machine Learning Defense',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        startTime: '02:00 PM',
        mode: 'online',
        meetingLink: 'https://meet.google.com/sample-vit-interview',
        panel: 'Senior Data Science Engineering Panel',
        instructions: 'Join 5 minutes prior to scheduled time. Have code editor open for live coding.',
        status: 'scheduled',
        isSample: true
      },
      // Past Completed Interview
      {
        application: seededApplications[5]._id,
        drive: seededDrives[3]._id,
        student: seededStudents[7]._id, // Harika Devi
        roundName: 'Round 1: Technical Systems Interview',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        startTime: '11:00 AM',
        mode: 'online',
        meetingLink: 'https://meet.google.com/sample-past-interview',
        panel: 'DevOps Lead',
        instructions: 'Completed satisfactorily.',
        status: 'completed',
        isSample: true
      }
    ];

    const seededInterviews = await Interview.insertMany(interviewData);
    console.log(`✅ Seeded ${seededInterviews.length} sample interviews.`);

    // -------------------------------------------------------------------------
    // 8. SEED SAMPLE OFFERS (Pending, Accepted, Declined, Expired)
    // -------------------------------------------------------------------------
    console.log('\n🏆 Seeding sample job offers...');
    const offerData = [
      // 1. Pending Offer
      {
        application: seededApplications[5]._id,
        student: seededStudents[7]._id, // Harika Devi
        drive: seededDrives[3]._id,
        company: seededCompanies[1]._id,
        jobRole: 'Cloud DevOps Specialist',
        packageLPA: 9.0,
        location: 'Hyderabad',
        joiningDate: new Date('2025-07-01'),
        offerLetterLink: 'https://example.com/offers/sample-offer-harika.pdf',
        acceptDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'pending',
        isSample: true
      },
      // 2. Accepted Offer
      {
        application: seededApplications[1]._id,
        student: seededStudents[1]._id, // Bhavya Sri
        drive: seededDrives[0]._id,
        company: seededCompanies[0]._id,
        jobRole: 'Associate Software Engineer',
        packageLPA: 7.5,
        location: 'Bangalore',
        joiningDate: new Date('2025-06-15'),
        offerLetterLink: 'https://example.com/offers/sample-offer-bhavya.pdf',
        acceptDeadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'accepted',
        respondedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        isSample: true
      },
      // 3. Declined Offer
      {
        application: seededApplications[2]._id,
        student: seededStudents[6]._id, // Gowtham Reddy
        drive: seededDrives[0]._id,
        company: seededCompanies[0]._id,
        jobRole: 'Software Engineer',
        packageLPA: 7.5,
        location: 'Hyderabad',
        joiningDate: new Date('2025-07-01'),
        offerLetterLink: 'https://example.com/offers/sample-offer-gowtham.pdf',
        acceptDeadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'declined',
        respondedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        isSample: true
      }
    ];

    const seededOffers = await Offer.insertMany(offerData);
    console.log(`✅ Seeded ${seededOffers.length} sample offers.`);

    // -------------------------------------------------------------------------
    // 9. SEED EMPTY STAT RECORDS (Data Honesty Rule)
    // -------------------------------------------------------------------------
    console.log('\n📊 Seeding empty Stat records (Data Honesty enforcement)...');
    const statData = [
      {
        label: 'Highest Package Offered',
        value: '',
        year: 2024,
        sourceUrl: '',
        sourceNote: 'Pending official published placement report from VIT placement cell',
        verified: false
      },
      {
        label: 'Average Campus Package',
        value: '',
        year: 2024,
        sourceUrl: '',
        sourceNote: 'Pending official published placement report from VIT placement cell',
        verified: false
      },
      {
        label: 'Total Job Offers Made',
        value: '',
        year: 2024,
        sourceUrl: '',
        sourceNote: 'Pending official published placement report from VIT placement cell',
        verified: false
      },
      {
        label: 'Placement Percentage',
        value: '',
        year: 2024,
        sourceUrl: '',
        sourceNote: 'Pending official published placement report from VIT placement cell',
        verified: false
      }
    ];

    const seededStats = await Stat.insertMany(statData);
    console.log(`✅ Seeded ${seededStats.length} unverified Stat placeholders with NO fabricated numbers.`);

    // -------------------------------------------------------------------------
    // 10. SEED SAMPLE AUDIT LOGS
    // -------------------------------------------------------------------------
    console.log('\n🛡️ Seeding initial audit logs...');
    const auditData = [
      {
        actor: officerUser._id,
        action: 'CREATE_DRIVE',
        targetType: 'Drive',
        targetId: seededDrives[0]._id.toString(),
        details: { title: seededDrives[0].title, company: 'Demo Tech Solutions' }
      },
      {
        actor: officerUser._id,
        action: 'UPDATE_STATUS',
        targetType: 'Application',
        targetId: seededApplications[1]._id.toString(),
        details: { previousStatus: 'applied', newStatus: 'shortlisted', student: 'Bhavya Sri' }
      },
      {
        actor: adminUser._id,
        action: 'SYSTEM_INITIALIZATION',
        targetType: 'System',
        targetId: 'INIT_PHASE_2',
        details: { version: '2.0.0', collectionsSeeded: 8 }
      }
    ];

    const seededAuditLogs = await AuditLog.insertMany(auditData);
    console.log(`✅ Seeded ${seededAuditLogs.length} initial audit logs.`);

    console.log('\n======================================================');
    console.log('🎉 PHASE 2 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

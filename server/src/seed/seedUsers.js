import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import { MONGODB_URI } from '../config/environment.js';
import { hashPassword } from '../utils/passwordHelper.js';

const seedUsers = async () => {
  if (!MONGODB_URI) {
    console.error('\n❌ [Seed Error] MONGODB_URI is not defined in server/.env.');
    console.error('👉 Please configure your MongoDB Atlas URI in server/.env before seeding.\n');
    process.exit(1);
  }

  try {
    console.log('\nConnecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Admin Account
    const adminUser = {
      name: 'VIT Admin',
      email: '24pa1a0567@vishnu.edu.in',
      password: hashPassword('Vishnu@123'),
      rollNo: '24PA1A0567',
      role: 'admin',
      branch: 'CSE',
      admissionYear: 2024,
      graduationYear: 2028,
      phone: '9876543210',
      isActive: true,
      isSample: false
    };

    // 2. Placement Officer Account
    const officerUser = {
      name: 'S. Manikanta',
      email: 'manikanta@vishnu.edu.in',
      password: hashPassword('Vishnu@123'),
      rollNo: 'OFFICER01',
      role: 'officer',
      branch: 'CSE',
      phone: '9848012345',
      isActive: true,
      isSample: false
    };

    // 3. Demo Students (12 diverse sample students across branches)
    const demoStudents = [
      {
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
        isSample: true
      },
      {
        name: 'Bhavya Sri',
        email: 'demo.student02@vishnu.edu.in',
        rollNo: '21PA1A0502',
        role: 'student',
        branch: 'IT',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 8.7,
        tenthPct: 89.0,
        twelfthPct: 88.5,
        activeBacklogs: 0,
        phone: '9876500002',
        isActive: true,
        isSample: true
      },
      {
        name: 'Chaitanya Varma',
        email: 'demo.student03@vishnu.edu.in',
        rollNo: '21PA1A0403',
        role: 'student',
        branch: 'ECE',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 7.9,
        tenthPct: 85.0,
        twelfthPct: 82.0,
        activeBacklogs: 0,
        phone: '9876500003',
        isActive: true,
        isSample: true
      },
      {
        name: 'Divya Teja',
        email: 'demo.student04@vishnu.edu.in',
        rollNo: '21PA1A0204',
        role: 'student',
        branch: 'EEE',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 8.1,
        tenthPct: 86.5,
        twelfthPct: 84.0,
        activeBacklogs: 1,
        phone: '9876500004',
        isActive: true,
        isSample: true
      },
      {
        name: 'Eshwar Rao',
        email: 'demo.student05@vishnu.edu.in',
        rollNo: '21PA1A0305',
        role: 'student',
        branch: 'MECH',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 7.4,
        tenthPct: 78.0,
        twelfthPct: 75.0,
        activeBacklogs: 0,
        phone: '9876500005',
        isActive: true,
        isSample: true
      },
      {
        name: 'Farhana Begum',
        email: 'demo.student06@vishnu.edu.in',
        rollNo: '21PA1A0106',
        role: 'student',
        branch: 'CIVIL',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 7.1,
        tenthPct: 80.0,
        twelfthPct: 76.5,
        activeBacklogs: 0,
        phone: '9876500006',
        isActive: true,
        isSample: true
      },
      {
        name: 'Gowtham Reddy',
        email: 'demo.student07@vishnu.edu.in',
        rollNo: '21PA1A5407',
        role: 'student',
        branch: 'AI&DS',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 9.6,
        tenthPct: 96.0,
        twelfthPct: 95.0,
        activeBacklogs: 0,
        phone: '9876500007',
        isActive: true,
        isSample: true
      },
      {
        name: 'Harika Devi',
        email: 'demo.student08@vishnu.edu.in',
        rollNo: '21PA1A4208',
        role: 'student',
        branch: 'CSE-AIML',
        admissionYear: 2021,
        graduationYear: 2025,
        cgpa: 9.1,
        tenthPct: 92.0,
        twelfthPct: 90.0,
        activeBacklogs: 0,
        phone: '9876500008',
        isActive: true,
        isSample: true
      },
      {
        name: 'Ishaan Gupta',
        email: 'demo.student09@vishnu.edu.in',
        rollNo: '22PA1A0509',
        role: 'student',
        branch: 'CSE',
        admissionYear: 2022,
        graduationYear: 2026,
        cgpa: 8.5,
        tenthPct: 88.0,
        twelfthPct: 86.0,
        activeBacklogs: 0,
        phone: '9876500009',
        isActive: true,
        isSample: true
      },
      {
        name: 'Jahnavi K',
        email: 'demo.student10@vishnu.edu.in',
        rollNo: '22PA1A0510',
        role: 'student',
        branch: 'IT',
        admissionYear: 2022,
        graduationYear: 2026,
        cgpa: 6.8,
        tenthPct: 76.0,
        twelfthPct: 73.0,
        activeBacklogs: 2,
        phone: '9876500010',
        isActive: true,
        isSample: true
      },
      {
        name: 'Karthik Raju',
        email: 'demo.student11@vishnu.edu.in',
        rollNo: '22PA1A0411',
        role: 'student',
        branch: 'ECE',
        admissionYear: 2022,
        graduationYear: 2026,
        cgpa: 8.9,
        tenthPct: 91.0,
        twelfthPct: 89.0,
        activeBacklogs: 0,
        phone: '9876500011',
        isActive: true,
        isSample: true
      },
      {
        name: 'Lakshmi Priya',
        email: 'demo.student12@vishnu.edu.in',
        rollNo: '22PA1A5412',
        role: 'student',
        branch: 'AI&DS',
        admissionYear: 2022,
        graduationYear: 2026,
        cgpa: 9.4,
        tenthPct: 95.0,
        twelfthPct: 93.5,
        activeBacklogs: 0,
        phone: '9876500012',
        isActive: true,
        isSample: true
      }
    ];

    const allUsersToSeed = [adminUser, officerUser, ...demoStudents];

    console.log(`Seeding ${allUsersToSeed.length} users into database...`);

    for (const userData of allUsersToSeed) {
      if (!userData.password) {
        userData.password = hashPassword('Vishnu@123');
      }
      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: userData },
        { upsert: true, new: true }
      );
      console.log(`  ✓ [${userData.role.toUpperCase()}] ${userData.name} (${userData.email})`);
    }

    console.log('\n🎉 User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedUsers();

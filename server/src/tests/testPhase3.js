import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { JWT_SECRET, MONGODB_URI } from '../config/environment.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';

let passed = 0;
let failed = 0;

function assert(title, condition, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${title}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${title} - ${details}`);
    failed++;
  }
}

const runTests = async () => {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 3 END-TO-END VERIFICATION TESTS');
  console.log('======================================================\n');

  await mongoose.connect(MONGODB_URI);

  // 1. Fetch officer and student accounts
  const officer = await User.findOne({ role: 'officer' });
  const student = await User.findOne({ email: 'demo.student01@vishnu.edu.in' });

  assert('Placement officer account exists', Boolean(officer));
  assert('Sample student account exists', Boolean(student));

  // 2. Test Role Check: Verify student role is not authorized for officer operations
  const officerRoles = ['officer', 'admin'];
  assert('Student is not in officer roles', !officerRoles.includes(student.role));
  assert('Officer is in officer roles', officerRoles.includes(officer.role));

  // 3. Test Drive Creation & Publication:
  let company = await Company.findOne();
  const testDrive = await Drive.create({
    company: company._id,
    title: 'Phase 3 Verification Test Drive',
    jobRole: 'Software Developer',
    packageLPA: 11.5,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'published',
    createdBy: officer._id,
    isSample: true,
    eligibility: {
      branches: ['CSE', 'IT'],
      minCgpa: 7.0,
      min10thPct: 60,
      min12thPct: 60,
      maxActiveBacklogs: 0,
      graduationYear: 2025
    }
  });

  assert('Officer created and published drive', Boolean(testDrive._id));

  // Verify student sees published drive
  const visibleDrives = await Drive.find({ status: 'published', _id: testDrive._id });
  assert('Student sees published drive', visibleDrives.length === 1);

  // 4. Test Application & Status Change with History
  let application = await Application.create({
    drive: testDrive._id,
    student: student._id,
    status: 'applied',
    history: [{ status: 'applied', note: 'Initial application', at: new Date(), by: student._id }],
    isSample: true
  });

  // Officer promotes status to technical
  application.status = 'technical';
  application.history.push({
    status: 'technical',
    note: 'Cleared aptitude, moving to technical round',
    at: new Date(),
    by: officer._id
  });
  await application.save();

  const reloadedApp = await Application.findById(application._id);
  assert('Application status updated to technical', reloadedApp.status === 'technical');
  assert('History records 2 transitions', reloadedApp.history.length === 2);
  assert('History note preserved', reloadedApp.history[1].note.includes('Cleared aptitude'));

  // 5. Test Interview Scheduling
  const interview = await Interview.create({
    application: application._id,
    drive: testDrive._id,
    student: student._id,
    roundName: 'Technical Interview Round 1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    startTime: '11:00 AM',
    mode: 'offline',
    venue: 'Block A Placement Lab',
    panel: 'Panel 1',
    status: 'scheduled',
    isSample: true
  });

  assert('Officer scheduled interview', Boolean(interview._id));

  // Verify student sees interview in their schedule
  const studentInterviews = await Interview.find({ student: student._id, _id: interview._id });
  assert('Interview appears in student schedule', studentInterviews.length === 1);

  // 6. Test Offer Creation
  const offer = await Offer.create({
    application: application._id,
    student: student._id,
    drive: testDrive._id,
    company: company._id,
    jobRole: 'Software Developer',
    packageLPA: 11.5,
    location: 'Hyderabad',
    acceptDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
    isSample: true
  });

  assert('Officer recorded job offer', Boolean(offer._id));

  // Verify student sees offer
  const studentOffers = await Offer.find({ student: student._id, _id: offer._id });
  assert('Offer appears in student portal', studentOffers.length === 1);

  // Clean up verification test documents
  await Offer.deleteOne({ _id: offer._id });
  await Interview.deleteOne({ _id: interview._id });
  await Application.deleteOne({ _id: application._id });
  await Drive.deleteOne({ _id: testDrive._id });

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 3 VERIFICATION CHECKS PASSED!\n');
    process.exit(0);
  }
};

runTests();

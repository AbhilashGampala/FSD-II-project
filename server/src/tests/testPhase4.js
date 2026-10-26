import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI } from '../config/environment.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import { checkEligibility } from '../utils/eligibility.js';
import { calculateCompleteness } from '../controllers/profileController.js';

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
  console.log('🧪 RUNNING PHASE 4 END-TO-END VERIFICATION TESTS');
  console.log('======================================================\n');

  try {
    await mongoose.connect(MONGODB_URI);

    // 1. Completeness Score Calculator
    const incompleteUser = {
      name: 'Incomplete Student',
      email: 'inc@vishnu.edu.in',
      rollNo: '',
      branch: 'CSE',
      phone: ''
    };
    const incompleteResult = calculateCompleteness(incompleteUser);
    assert('Incomplete profile score is below 100%', incompleteResult.percentage < 100, `Score: ${incompleteResult.percentage}`);
    assert('Incomplete profile has missing items', incompleteResult.missing.length > 0);

    const completeUser = {
      name: 'Full Student',
      email: 'full@vishnu.edu.in',
      rollNo: '24PA1A0599',
      branch: 'CSE',
      phone: '9876543210',
      cgpa: 8.5,
      tenthPct: 88,
      twelfthPct: 90,
      activeBacklogs: 0
    };
    const completeResult = calculateCompleteness(completeUser);
    assert('Complete profile score reaches 100%', completeResult.percentage === 100, `Score: ${completeResult.percentage}`);
    assert('Complete profile is marked complete', completeResult.isComplete === true);

    // 2. Student Account Verification
    const student = await User.findOne({ email: 'demo.student01@vishnu.edu.in' });
    assert('Sample student account exists in DB', Boolean(student));

    // Update student profile with valid values
    student.cgpa = 7.0;
    student.branch = 'CSE';
    student.activeBacklogs = 0;
    student.tenthPct = 85;
    student.twelfthPct = 85;
    student.phone = '9876543210';
    await student.save();
    assert('Student profile updated with CGPA 7.0', student.cgpa === 7.0);

    // 3. Eligibility Engine Enforcement
    // Drive with minCgpa 9.5
    const highCgpaEligibility = {
      branches: ['CSE', 'IT'],
      minCgpa: 9.5,
      maxActiveBacklogs: 0,
      min10thPct: 70,
      min12thPct: 70
    };

    const highCgpaCheck = checkEligibility(student, highCgpaEligibility);
    assert('CGPA 7.0 student is rejected by 9.5 CGPA drive', highCgpaCheck.eligible === false);
    assert(
      'Rejection reason explicitly specifies CGPA cutoff',
      highCgpaCheck.reasons.some(r => r.includes('CGPA') && r.includes('9.5')),
      `Reasons: ${JSON.stringify(highCgpaCheck.reasons)}`
    );

    // Drive matching student qualifications
    const accessibleEligibility = {
      branches: ['CSE', 'IT', 'ECE'],
      minCgpa: 6.5,
      maxActiveBacklogs: 0,
      min10thPct: 60,
      min12thPct: 60
    };
    const accessibleCheck = checkEligibility(student, accessibleEligibility);
    assert('Student is eligible for drive with minCgpa 6.5', accessibleCheck.eligible === true);

    // 4. Test Application Lifecycle in DB
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({ name: 'Phase 4 Test Corp', isSample: true });
    }

    const testDrive = await Drive.create({
      company: company._id,
      title: 'Phase 4 Verification Drive',
      jobRole: 'Cloud Associate',
      packageLPA: 8.5,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'published',
      isSample: true,
      eligibility: {
        branches: ['CSE'],
        minCgpa: 6.5,
        maxActiveBacklogs: 0,
        min10thPct: 60,
        min12thPct: 60
      }
    });

    // Create Application
    const app = await Application.create({
      student: student._id,
      drive: testDrive._id,
      status: 'applied',
      isSample: true,
      history: [{ status: 'applied', note: 'Direct test apply', at: new Date() }]
    });
    assert('Application created in applied status', app.status === 'applied');

    // Duplicate check
    let duplicateCaught = false;
    try {
      await Application.create({
        student: student._id,
        drive: testDrive._id,
        status: 'applied',
        isSample: true
      });
    } catch (err) {
      duplicateCaught = err.code === 11000 || err.message.includes('duplicate');
    }
    assert('Duplicate application rejected by unique compound index', duplicateCaught);

    // Withdrawal check
    app.status = 'withdrawn';
    app.history.push({ status: 'withdrawn', note: 'Withdrawn by student', at: new Date() });
    await app.save();
    assert('Application status can be updated to withdrawn', app.status === 'withdrawn');

    // 5. Test Interview Retrieval
    const testInterview = await Interview.create({
      application: app._id,
      student: student._id,
      drive: testDrive._id,
      roundName: 'Technical Round 1',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      startTime: '10:00 AM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/xyz-test',
      status: 'scheduled',
      isSample: true
    });

    const studentInterviews = await Interview.find({ student: student._id });
    assert('Student interviews retrieved successfully', studentInterviews.length > 0);
    assert('Scheduled interview retains online meeting link', testInterview.meetingLink.includes('meet.google.com'));

    // 6. Test Offer Acceptance Workflow
    const testOffer = await Offer.create({
      application: app._id,
      student: student._id,
      drive: testDrive._id,
      company: company._id,
      jobRole: 'Cloud Associate',
      packageLPA: 8.5,
      location: 'Hyderabad',
      acceptDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      isSample: true
    });
    assert('Offer generated in pending state', testOffer.status === 'pending');

    // Accept Offer
    testOffer.status = 'accepted';
    testOffer.respondedAt = new Date();
    await testOffer.save();

    const acceptedOffer = await Offer.findById(testOffer._id);
    assert('Offer successfully updated to accepted status', acceptedOffer.status === 'accepted');

    // Clean up test records
    await Offer.findByIdAndDelete(testOffer._id);
    await Interview.findByIdAndDelete(testInterview._id);
    await Application.findByIdAndDelete(app._id);
    await Drive.findByIdAndDelete(testDrive._id);

    console.log('\n======================================================');
    console.log(`Phase 4 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
};

runTests();

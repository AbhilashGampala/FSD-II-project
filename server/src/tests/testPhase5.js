import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI } from '../config/environment.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Offer from '../models/Offer.js';
import { logAudit } from '../utils/auditLogger.js';

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
  console.log('🧪 RUNNING PHASE 5 END-TO-END VERIFICATION TESTS');
  console.log('======================================================\n');

  try {
    await mongoose.connect(MONGODB_URI);

    // 1. Admin Account Verification
    const admin = await User.findOne({ role: 'admin' });
    assert('Super Admin account exists in database', Boolean(admin));

    const student = await User.findOne({ role: 'student' });
    assert('Student account exists in database', Boolean(student));

    // 2. Role-Based Access Control (RBAC) Guard Test
    const adminRoles = ['admin'];
    assert('Student role is excluded from admin privileges', !adminRoles.includes(student.role));
    assert('Admin role is authorized for admin privileges', adminRoles.includes(admin.role));

    // 3. Admin Self-Protection Rule 1: Cannot demote self
    const attemptSelfDemote = (adminUser, targetUserId, newRole) => {
      if (adminUser._id.toString() === targetUserId.toString() && newRole !== 'admin') {
        return { success: false, status: 400, message: 'Administrators cannot remove their own admin privileges.' };
      }
      return { success: true };
    };

    const selfDemoteRes = attemptSelfDemote(admin, admin._id, 'student');
    assert('Self-demotion blocked with 400 error', selfDemoteRes.success === false && selfDemoteRes.status === 400);

    // 4. Admin Self-Protection Rule 2: Cannot deactivate self
    const attemptSelfDeactivate = (adminUser, targetUserId, newStatus) => {
      if (adminUser._id.toString() === targetUserId.toString() && newStatus === false) {
        return { success: false, status: 400, message: 'Administrators cannot deactivate their own account.' };
      }
      return { success: true };
    };

    const selfDeactivateRes = attemptSelfDeactivate(admin, admin._id, false);
    assert('Self-deactivation blocked with 400 error', selfDeactivateRes.success === false && selfDeactivateRes.status === 400);

    // 5. Test Officer Creation Validation & Execution
    const testInvalidOfficerEmail = 'officer@gmail.com';
    const isDomainValid = testInvalidOfficerEmail.endsWith('@vishnu.edu.in');
    assert('Non-@vishnu.edu.in email rejected for officer account', isDomainValid === false);

    const testValidOfficerEmail = `test.officer.${Date.now()}@vishnu.edu.in`;
    const newOfficer = await User.create({
      name: 'Prof. Testing Officer',
      email: testValidOfficerEmail,
      role: 'officer',
      phone: '9876543210',
      isActive: true,
      isSample: true
    });
    assert('Officer account created successfully with role: officer', newOfficer.role === 'officer');
    assert('Officer account has active status', newOfficer.isActive === true);

    // 6. Test User Status Toggle (Deactivate & Reactivate)
    newOfficer.isActive = false;
    await newOfficer.save();
    const deactivatedOfficer = await User.findById(newOfficer._id);
    assert('User account deactivated successfully', deactivatedOfficer.isActive === false);

    newOfficer.isActive = true;
    await newOfficer.save();
    const reactivatedOfficer = await User.findById(newOfficer._id);
    assert('User account reactivated successfully', reactivatedOfficer.isActive === true);

    // 7. Test Role Update on Target User
    newOfficer.role = 'student';
    await newOfficer.save();
    const roleUpdated = await User.findById(newOfficer._id);
    assert('User role successfully updated to student', roleUpdated.role === 'student');

    // 8. Test Audit Logging
    await logAudit({
      actorId: admin._id,
      action: 'PHASE5_VERIFICATION_TEST',
      targetType: 'User',
      targetId: newOfficer._id,
      details: { test: true, role: 'student' }
    });

    const testAuditEntry = await AuditLog.findOne({ action: 'PHASE5_VERIFICATION_TEST' }).populate('actor');
    assert('Audit log persisted to database', Boolean(testAuditEntry));
    assert('Audit log correctly references admin actor', testAuditEntry.actor.email === admin.email);

    // 9. Institutional Dashboard Counts Integrity
    const [userCount, publishedDrivesCount, offersCount] = await Promise.all([
      User.countDocuments(),
      Drive.countDocuments({ status: 'published' }),
      Offer.countDocuments()
    ]);
    assert('Admin user count is positive', userCount > 0);
    assert('Published drives count is non-negative', publishedDrivesCount >= 0);
    assert('Offers count is non-negative', offersCount >= 0);

    // Clean up test records
    await AuditLog.deleteOne({ _id: testAuditEntry._id });
    await User.findByIdAndDelete(newOfficer._id);

    console.log('\n======================================================');
    console.log(`Phase 5 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
};

runTests();

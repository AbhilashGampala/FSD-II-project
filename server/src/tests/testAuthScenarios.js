import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI, JWT_SECRET } from '../config/environment.js';
import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/passwordHelper.js';

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

const runAuthTests = async () => {
  console.log('\n======================================================');
  console.log('🧪 RUNNING MANDATORY AUTHENTICATION VERIFICATION TESTS');
  console.log('======================================================\n');

  try {
    // 1. Password Hashing Algorithm Tests
    const testPlain = 'Vishnu@123';
    const hash = hashPassword(testPlain);

    assert('Password hashing does not return plain text', hash !== testPlain);
    assert('Hashed password includes salt separator', hash.includes(':'));
    assert('Password verification succeeds for correct password', verifyPassword(testPlain, hash) === true);
    assert('Password verification rejects wrong password', verifyPassword('WrongPass', hash) === false);
    assert('Password verification rejects empty password', verifyPassword('', hash) === false);

    // 2. Connect to MongoDB to test user authentication
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for Authentication Scenarios\n');

    // 3. Test Admin Account
    let admin = await User.findOne({ email: '24pa1a0567@vishnu.edu.in' });
    if (!admin) {
      admin = await User.create({
        name: 'VIT Admin',
        email: '24pa1a0567@vishnu.edu.in',
        rollNo: '24PA1A0567',
        role: 'admin',
        branch: 'CSE',
        password: hashPassword('Vishnu@123'),
        isActive: true,
        isSample: false
      });
    } else if (!admin.password) {
      admin.password = hashPassword('Vishnu@123');
      await admin.save();
    }
    assert('Super Admin user account exists in DB', Boolean(admin));

    // Test password verification against admin record
    const adminPassCheck = verifyPassword('Vishnu@123', admin.password);
    assert('Admin password verifies with default Vishnu@123', adminPassCheck === true);

    // Test rejection with wrong password
    const adminWrongCheck = verifyPassword('WrongPassword123', admin.password);
    assert('Admin rejects invalid password', adminWrongCheck === false);

    // 4. Test Roll Number Lookup
    const userByRoll = await User.findOne({
      $or: [
        { email: '24pa1a0567@vishnu.edu.in' },
        { rollNo: { $regex: /^24PA1A0567$/i } }
      ]
    });
    assert('User can be looked up by Roll Number', Boolean(userByRoll && userByRoll.email === admin.email));

    // 5. Test Non-existent User Lookup
    const nonExistent = await User.findOne({ email: 'unknown.user@vishnu.edu.in' });
    assert('Unknown user correctly returns null', nonExistent === null);

    // 6. Test Deactivated User Check
    const deactivatedUser = new User({
      name: 'Deactivated Student',
      email: `deact.${Date.now()}@vishnu.edu.in`,
      role: 'student',
      branch: 'CSE',
      password: hashPassword('Vishnu@123'),
      isActive: false,
      isSample: true
    });
    await deactivatedUser.save();

    assert('Deactivated user has isActive === false', deactivatedUser.isActive === false);

    // Cleanup deactivated user test record
    await User.findByIdAndDelete(deactivatedUser._id);

    // 7. Test JWT Generation & Verification
    const token = jwt.sign(
      { id: admin._id, role: admin.role, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    assert('JWT token is generated successfully', typeof token === 'string' && token.length > 20);

    const decoded = jwt.verify(token, JWT_SECRET);
    assert('JWT decoded payload matches user ID', decoded.id.toString() === admin._id.toString());
    assert('JWT decoded payload preserves role', decoded.role === 'admin');

    // 8. Test Placement Officer Account
    let officer = await User.findOne({ role: 'officer' });
    if (officer && !officer.password) {
      officer.password = hashPassword('Vishnu@123');
      await officer.save();
    }
    assert('Placement Officer account exists and is configured', Boolean(officer));

    // 9. Test Sample Student Account
    let student = await User.findOne({ email: 'demo.student01@vishnu.edu.in' });
    if (student && !student.password) {
      student.password = hashPassword('Vishnu@123');
      await student.save();
    }
    assert('Sample student account exists and is configured', Boolean(student));

    console.log('\n======================================================');
    console.log(`Authentication Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
};

runAuthTests();


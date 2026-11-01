import assert from 'assert';
import { demoService } from '../../../client/src/services/demoService.js';
import { DEMO_USERS } from '../../../client/src/services/demoData.js';

console.log('====================================================');
console.log('🧪 RUNNING MANDATORY ROLE-BASED DEMO ACCESS TEST SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✔ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function runAsyncTests() {
  // Reset store fresh
  demoService.resetStore();

  console.log('--- 1. Role Identification & Verification ---');
  it('Student role is correctly defined and isolated', () => {
    const student = demoService.getDemoUser('student');
    assert.strictEqual(student.role, 'student');
    assert.strictEqual(student.isDemo, true);
    assert.strictEqual(student.email, 'demo.student01@vishnu.edu.in');
    assert.strictEqual(student.rollNo, '21PA1A0501');
    assert.notStrictEqual(student.role, 'admin');
    assert.notStrictEqual(student.role, 'officer');
  });

  it('Placement Officer role is correctly defined and isolated', () => {
    const officer = demoService.getDemoUser('officer');
    assert.strictEqual(officer.role, 'officer');
    assert.strictEqual(officer.isDemo, true);
    assert.strictEqual(officer.email, 'manikanta@vishnu.edu.in');
    assert.notStrictEqual(officer.role, 'admin');
    assert.notStrictEqual(officer.role, 'student');
  });

  it('Administrator role is correctly defined and isolated', () => {
    const admin = demoService.getDemoUser('admin');
    assert.strictEqual(admin.role, 'admin');
    assert.strictEqual(admin.isDemo, true);
    assert.strictEqual(admin.email, '24pa1a0567@vishnu.edu.in');
    assert.notStrictEqual(admin.role, 'student');
  });

  console.log('\n--- 2. Student Role Dashboard & Feature Exploration ---');
  await (async () => {
    const res = await demoService.getStudentDashboard();
    it('Student dashboard returns valid counts and non-empty data', () => {
      assert.strictEqual(res.success, true);
      assert.ok(res.counts.eligibleDrives >= 1, 'Should have eligible drives');
      assert.ok(res.counts.applied >= 1, 'Should have applied drives');
      assert.ok(res.profile.name, 'Profile name should be present');
      assert.strictEqual(res.profile.branch, 'CSE');
    });

    const appsRes = await demoService.getMyApplications();
    it('Student can explore personal applications', () => {
      assert.strictEqual(appsRes.success, true);
      assert.ok(Array.isArray(appsRes.applications));
      assert.ok(appsRes.applications.length >= 2);
    });

    const intvRes = await demoService.getMyInterviews();
    it('Student can explore upcoming scheduled interviews', () => {
      assert.strictEqual(intvRes.success, true);
      assert.ok(Array.isArray(intvRes.interviews));
      assert.ok(intvRes.interviews.length >= 1);
      assert.strictEqual(intvRes.interviews[0].round, 'Technical Interview 2');
    });

    const offersRes = await demoService.getMyOffers();
    it('Student can explore job offers and respond', async () => {
      assert.strictEqual(offersRes.success, true);
      assert.ok(offersRes.offers.length >= 1);
      const offerId = offersRes.offers[0]._id;
      const respondRes = await demoService.respondToOffer(offerId, 'accepted');
      assert.strictEqual(respondRes.success, true);
      assert.strictEqual(respondRes.offer.status, 'accepted');
    });

    it('Student profile update simulation reflects in demo session', async () => {
      const updateRes = await demoService.updateProfile({ phone: '9999888877' });
      assert.strictEqual(updateRes.success, true);
      assert.strictEqual(updateRes.user.phone, '9999888877');
    });
  })();

  console.log('\n--- 3. Placement Officer Dashboard & Feature Exploration ---');
  await (async () => {
    const offDash = await demoService.getOfficerDashboard();
    it('Officer dashboard provides campus-wide KPI statistics', () => {
      assert.strictEqual(offDash.success, true);
      assert.ok(offDash.counts.activeDrives >= 1);
      assert.ok(offDash.counts.companiesRegistered >= 5);
      assert.ok(offDash.upcomingDeadlines.length >= 1);
    });

    const comps = await demoService.getCompanies();
    it('Officer can view, filter, and create registered companies', async () => {
      assert.strictEqual(comps.success, true);
      assert.ok(comps.companies.length >= 5);

      const created = await demoService.createCompany({
        name: 'Google Cloud India',
        tier: 'Tier 1 / Super Dream',
        industry: 'Cloud Infrastructure',
        location: 'Hyderabad'
      });
      assert.strictEqual(created.success, true);
      assert.strictEqual(created.company.name, 'Google Cloud India');
    });

    const drives = await demoService.getDrives();
    it('Officer can manage placement drives and update status', async () => {
      assert.strictEqual(drives.success, true);
      assert.ok(drives.drives.length >= 4);

      const driveId = drives.drives[0]._id;
      const statusRes = await demoService.updateDriveStatus(driveId, 'completed');
      assert.strictEqual(statusRes.success, true);
    });

    it('Officer can view applicants and perform candidate bulk shortlisting', async () => {
      const driveApps = await demoService.getApplicationsByDrive('drive-01');
      assert.strictEqual(driveApps.success, true);
      assert.ok(driveApps.applications.length >= 1);

      const appIds = driveApps.applications.map((a) => a._id);
      const bulkRes = await demoService.bulkShortlist(appIds);
      assert.strictEqual(bulkRes.success, true);
    });
  })();

  console.log('\n--- 4. Administrator Dashboard & System Governance ---');
  await (async () => {
    const adminDash = await demoService.getAdminDashboard();
    it('Admin dashboard loads user and audit summaries', () => {
      assert.strictEqual(adminDash.success, true);
      assert.ok(adminDash.counts.users.total >= 100);
      assert.ok(adminDash.recentAuditLogs.length >= 1);
    });

    const users = await demoService.getUsers();
    it('Admin can manage user directory, toggle statuses and create officers', async () => {
      assert.strictEqual(users.success, true);
      assert.ok(users.users.length >= 5);

      const testUser = users.users.find((u) => u.role === 'student');
      const toggleRes = await demoService.toggleUserStatus(testUser._id, false);
      assert.strictEqual(toggleRes.success, true);

      const newOfficerRes = await demoService.createOfficerAccount({
        name: 'Dr. V. Prasad',
        email: 'prasad.tp@vishnu.edu.in',
        branch: 'ECE'
      });
      assert.strictEqual(newOfficerRes.success, true);
      assert.strictEqual(newOfficerRes.user.role, 'officer');
    });

    const audit = await demoService.getAuditLogs();
    it('Admin can review comprehensive audit logs', () => {
      assert.strictEqual(audit.success, true);
      assert.ok(audit.logs.length >= 3);
      assert.ok(audit.logs[0].action, 'Action name required');
    });
  })();

  console.log('\n====================================================');
  console.log(`📊 DEMO ACCESS TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAsyncTests();

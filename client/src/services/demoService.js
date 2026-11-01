/**
 * Demo Service for Offline / Fallback Role Exploration
 * 
 * Simulates backend API responses using in-memory / sessionStorage state.
 * Fully decoupled from production backend and database.
 */

import {
  DEMO_USERS,
  DEMO_COMPANIES,
  DEMO_DRIVES,
  DEMO_APPLICATIONS,
  DEMO_INTERVIEWS,
  DEMO_OFFERS,
  DEMO_STATS,
  DEMO_USER_DIRECTORY,
  DEMO_AUDIT_LOGS
} from './demoData.js';

// Storage keys
const SESSION_STORE_KEY = 'vit_demo_session_data';

// Helper to display a lightweight, non-intrusive notification for simulated demo mutations
export const notifyDemoAction = (actionMessage) => {
  if (typeof document === 'undefined') return;
  try {
    const existing = document.getElementById('vit-demo-action-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'vit-demo-action-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 max-w-md p-3.5 bg-white border border-[#E58A1F] shadow-lg rounded-xl text-xs flex items-start gap-3 text-[#252525] animate-bounce-once';
    toast.innerHTML = `
      <div class="w-6 h-6 rounded-lg bg-[#E58A1F]/15 flex items-center justify-center text-[#E58A1F] font-bold shrink-0 text-sm">
        ⚡
      </div>
      <div class="space-y-0.5">
        <p class="font-bold text-[#E58A1F]">Demo Action (Simulated Locally)</p>
        <p class="text-slate-600">${actionMessage}</p>
        <p class="text-[10px] text-slate-400">Notice: Changes are stored in local demo session and not saved to the production database.</p>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = 'opacity 0.4s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }
    }, 4500);
  } catch (err) {
    console.log('Demo Action:', actionMessage);
  }
};

const hasStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

class DemoService {
  constructor() {
    this.initStore();
  }

  initStore() {
    if (hasStorage()) {
      try {
        const stored = window.sessionStorage.getItem(SESSION_STORE_KEY);
        if (stored) {
          this.store = JSON.parse(stored);
          return;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    this.store = {
      companies: JSON.parse(JSON.stringify(DEMO_COMPANIES)),
      drives: JSON.parse(JSON.stringify(DEMO_DRIVES)),
      applications: JSON.parse(JSON.stringify(DEMO_APPLICATIONS)),
      interviews: JSON.parse(JSON.stringify(DEMO_INTERVIEWS)),
      offers: JSON.parse(JSON.stringify(DEMO_OFFERS)),
      stats: JSON.parse(JSON.stringify(DEMO_STATS)),
      users: JSON.parse(JSON.stringify(DEMO_USER_DIRECTORY)),
      auditLogs: JSON.parse(JSON.stringify(DEMO_AUDIT_LOGS)),
      studentProfile: JSON.parse(JSON.stringify(DEMO_USERS.student))
    };
    this.saveStore();
  }

  saveStore() {
    if (hasStorage()) {
      try {
        window.sessionStorage.setItem(SESSION_STORE_KEY, JSON.stringify(this.store));
      } catch (e) {
        // In-memory fallback
      }
    }
  }

  resetStore() {
    if (hasStorage()) {
      try {
        window.sessionStorage.removeItem(SESSION_STORE_KEY);
      } catch (e) {
        // Ignore
      }
    }
    this.initStore();
  }

  // Current Demo User
  getDemoUser(role = 'student') {
    return DEMO_USERS[role] || DEMO_USERS.student;
  }

  // --- STUDENT ENDPOINTS ---

  async getStudentDashboard() {
    const studentApps = this.store.applications.filter(
      (a) => a.student?.email === this.store.studentProfile.email || a.student?._id === this.store.studentProfile._id
    );

    const counts = {
      applied: studentApps.length,
      shortlisted: studentApps.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length,
      interviewsUpcoming: this.store.interviews.filter(
        (i) => i.student?.email === this.store.studentProfile.email && i.status === 'scheduled'
      ).length,
      offers: this.store.offers.filter(
        (o) => o.student?.email === this.store.studentProfile.email
      ).length,
      eligibleDrives: this.store.drives.filter((d) => d.status === 'active').length
    };

    const nextInterview = this.store.interviews.find(
      (i) => i.student?.email === this.store.studentProfile.email && i.status === 'scheduled'
    );

    const deadlinesClosingSoon = this.store.drives
      .filter((d) => d.status === 'active')
      .slice(0, 3);

    return {
      success: true,
      counts,
      nextInterview: nextInterview || null,
      deadlinesClosingSoon,
      completeness: { percentage: 100, isComplete: true, missing: [] },
      profile: this.store.studentProfile,
      stats: this.store.stats
    };
  }

  async getProfile() {
    return {
      success: true,
      profile: this.store.studentProfile,
      user: this.store.studentProfile
    };
  }

  async updateProfile(data) {
    this.store.studentProfile = {
      ...this.store.studentProfile,
      ...data
    };
    this.saveStore();
    notifyDemoAction('Profile details updated successfully');
    return {
      success: true,
      message: 'Profile updated successfully (Demo Mode)',
      user: this.store.studentProfile,
      profile: this.store.studentProfile
    };
  }

  async getMyApplications() {
    const apps = this.store.applications.filter(
      (a) => a.student?.email === this.store.studentProfile.email || a.student?._id === this.store.studentProfile._id
    );
    return {
      success: true,
      applications: apps
    };
  }

  async applyForDrive(driveId) {
    const drive = this.store.drives.find((d) => d._id === driveId);
    if (!drive) throw new Error('Drive not found');

    const existing = this.store.applications.find(
      (a) => (a.drive?._id === driveId || a.drive === driveId) &&
             (a.student?.email === this.store.studentProfile.email)
    );
    if (existing) {
      throw new Error('You have already applied for this placement drive.');
    }

    const newApp = {
      _id: `demo-app-${Date.now()}`,
      drive: drive,
      student: this.store.studentProfile,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentRound: 'Application Review',
      statusHistory: [
        { status: 'applied', date: new Date().toISOString(), note: 'Application submitted successfully (Demo Mode).' }
      ]
    };

    this.store.applications.unshift(newApp);
    this.saveStore();
    notifyDemoAction(`Application registered for ${drive.title} (${drive.company?.name})`);

    return {
      success: true,
      message: 'Application registered successfully (Demo Mode)',
      application: newApp
    };
  }

  async withdrawApplication(id) {
    this.store.applications = this.store.applications.filter((a) => a._id !== id);
    this.saveStore();
    notifyDemoAction('Application withdrawn');
    return {
      success: true,
      message: 'Application withdrawn (Demo Mode)'
    };
  }

  async getMyInterviews() {
    const interviews = this.store.interviews.filter(
      (i) => i.student?.email === this.store.studentProfile.email
    );
    return {
      success: true,
      interviews
    };
  }

  async getMyOffers() {
    const offers = this.store.offers.filter(
      (o) => o.student?.email === this.store.studentProfile.email
    );
    return {
      success: true,
      offers
    };
  }

  async respondToOffer(id, action) {
    const offer = this.store.offers.find((o) => o._id === id);
    if (offer) {
      offer.status = action;
      offer.respondedAt = new Date().toISOString();
      this.saveStore();
      notifyDemoAction(`Offer status updated to ${action}`);
    }
    return {
      success: true,
      message: `Offer response recorded as ${action} (Demo Mode)`,
      offer
    };
  }

  // --- OFFICER ENDPOINTS ---

  async getOfficerDashboard() {
    const activeDrives = this.store.drives.filter((d) => d.status === 'active');
    const pendingApps = this.store.applications.filter((a) => a.status === 'applied');
    const upcomingInterviews = this.store.interviews.filter((i) => i.status === 'scheduled');
    const totalOffers = this.store.offers.length;

    return {
      success: true,
      counts: {
        activeDrives: activeDrives.length,
        pendingApplications: pendingApps.length,
        upcomingInterviews: upcomingInterviews.length,
        totalOffers,
        companiesRegistered: this.store.companies.length
      },
      upcomingDeadlines: activeDrives.slice(0, 4),
      recentApplications: this.store.applications.slice(0, 6)
    };
  }

  async getCompanies(search = '') {
    let list = this.store.companies;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q));
    }
    return {
      success: true,
      companies: list
    };
  }

  async getCompany(id) {
    const comp = this.store.companies.find((c) => c._id === id);
    if (!comp) throw new Error('Company not found');
    return { success: true, company: comp };
  }

  async createCompany(data) {
    const newComp = {
      _id: `comp-${Date.now()}`,
      ...data,
      drivesCount: 0,
      createdAt: new Date().toISOString()
    };
    this.store.companies.unshift(newComp);
    this.saveStore();
    notifyDemoAction(`Company "${newComp.name}" registered`);
    return { success: true, company: newComp, message: 'Company created (Demo Mode)' };
  }

  async updateCompany(id, data) {
    const comp = this.store.companies.find((c) => c._id === id);
    if (comp) {
      Object.assign(comp, data);
      this.saveStore();
      notifyDemoAction(`Company "${comp.name}" updated`);
    }
    return { success: true, company: comp, message: 'Company updated (Demo Mode)' };
  }

  async deleteCompany(id) {
    this.store.companies = this.store.companies.filter((c) => c._id !== id);
    this.saveStore();
    notifyDemoAction('Company removed');
    return { success: true, message: 'Company deleted (Demo Mode)' };
  }

  async getDrives(params = {}) {
    let drives = [...this.store.drives];
    if (params.status && params.status !== 'all') {
      drives = drives.filter((d) => d.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      drives = drives.filter((d) => d.title.toLowerCase().includes(q) || d.company?.name.toLowerCase().includes(q));
    }
    return {
      success: true,
      drives,
      total: drives.length
    };
  }

  async getDrive(id) {
    const drive = this.store.drives.find((d) => d._id === id);
    if (!drive) throw new Error('Placement drive not found');
    return {
      success: true,
      drive,
      eligibility: {
        eligible: true,
        criteria: []
      }
    };
  }

  async createDrive(data) {
    const company = this.store.companies.find((c) => c._id === (data.company?._id || data.company)) || this.store.companies[0];
    const newDrive = {
      _id: `drive-${Date.now()}`,
      ...data,
      company,
      status: data.status || 'active',
      totalApplications: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString()
    };
    this.store.drives.unshift(newDrive);
    this.saveStore();
    notifyDemoAction(`New drive "${newDrive.title}" created`);
    return { success: true, drive: newDrive, message: 'Drive created (Demo Mode)' };
  }

  async updateDrive(id, data) {
    const drive = this.store.drives.find((d) => d._id === id);
    if (drive) {
      Object.assign(drive, data);
      this.saveStore();
      notifyDemoAction(`Drive "${drive.title}" updated`);
    }
    return { success: true, drive, message: 'Drive updated (Demo Mode)' };
  }

  async updateDriveStatus(id, status) {
    const drive = this.store.drives.find((d) => d._id === id);
    if (drive) {
      drive.status = status;
      this.saveStore();
      notifyDemoAction(`Drive status changed to ${status}`);
    }
    return { success: true, message: `Drive status changed to ${status} (Demo Mode)` };
  }

  async duplicateDrive(id) {
    const drive = this.store.drives.find((d) => d._id === id);
    if (!drive) throw new Error('Drive not found');
    const cloned = {
      ...JSON.parse(JSON.stringify(drive)),
      _id: `drive-${Date.now()}`,
      title: `${drive.title} (Copy)`,
      status: 'draft',
      totalApplications: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString()
    };
    this.store.drives.unshift(cloned);
    this.saveStore();
    notifyDemoAction(`Duplicated drive as "${cloned.title}"`);
    return { success: true, drive: cloned, message: 'Drive duplicated (Demo Mode)' };
  }

  async getApplicationsByDrive(driveId, params = {}) {
    let apps = this.store.applications.filter(
      (a) => (a.drive?._id === driveId || a.drive === driveId)
    );
    if (params.status && params.status !== 'all') {
      apps = apps.filter((a) => a.status === params.status);
    }
    return {
      success: true,
      applications: apps,
      total: apps.length
    };
  }

  async updateApplicationStatus(id, status, note = '') {
    const app = this.store.applications.find((a) => a._id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      if (!app.statusHistory) app.statusHistory = [];
      app.statusHistory.push({ status, date: new Date().toISOString(), note });
      this.saveStore();
      notifyDemoAction(`Candidate application status updated to ${status}`);
    }
    return { success: true, message: `Status updated to ${status} (Demo Mode)` };
  }

  async bulkShortlist(applicationIds, note = '') {
    this.store.applications.forEach((a) => {
      if (applicationIds.includes(a._id)) {
        a.status = 'shortlisted';
        a.updatedAt = new Date().toISOString();
      }
    });
    this.saveStore();
    notifyDemoAction(`Shortlisted ${applicationIds.length} candidate(s)`);
    return { success: true, message: `Shortlisted ${applicationIds.length} applications (Demo Mode)` };
  }

  async getInterviews(params = {}) {
    return {
      success: true,
      interviews: this.store.interviews,
      total: this.store.interviews.length
    };
  }

  async createInterview(data) {
    const newInterview = {
      _id: `interview-${Date.now()}`,
      ...data,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    this.store.interviews.unshift(newInterview);
    this.saveStore();
    notifyDemoAction(`Interview scheduled for round "${newInterview.round}"`);
    return { success: true, interview: newInterview, message: 'Interview scheduled (Demo Mode)' };
  }

  async updateInterview(id, data) {
    const intv = this.store.interviews.find((i) => i._id === id);
    if (intv) {
      Object.assign(intv, data);
      this.saveStore();
      notifyDemoAction('Interview details updated');
    }
    return { success: true, interview: intv, message: 'Interview updated (Demo Mode)' };
  }

  async updateInterviewStatus(id, status) {
    const intv = this.store.interviews.find((i) => i._id === id);
    if (intv) {
      intv.status = status;
      this.saveStore();
      notifyDemoAction(`Interview marked as ${status}`);
    }
    return { success: true, message: `Interview marked as ${status} (Demo Mode)` };
  }

  async getOffers(params = {}) {
    return {
      success: true,
      offers: this.store.offers,
      total: this.store.offers.length
    };
  }

  async createOffer(data) {
    const newOffer = {
      _id: `offer-${Date.now()}`,
      ...data,
      status: 'pending',
      issuedAt: new Date().toISOString()
    };
    this.store.offers.unshift(newOffer);
    this.saveStore();
    notifyDemoAction(`Placement offer issued for ${data.designation || 'Software Engineer'}`);
    return { success: true, offer: newOffer, message: 'Offer created (Demo Mode)' };
  }

  async getStats() {
    return {
      success: true,
      stats: this.store.stats
    };
  }

  async createStat(data) {
    const newStat = {
      _id: `stat-${Date.now()}`,
      ...data
    };
    this.store.stats.unshift(newStat);
    this.saveStore();
    notifyDemoAction('Placement statistics record created');
    return { success: true, stat: newStat };
  }

  async updateStat(id, data) {
    const stat = this.store.stats.find((s) => s._id === id);
    if (stat) {
      Object.assign(stat, data);
      this.saveStore();
      notifyDemoAction('Placement statistics record updated');
    }
    return { success: true, stat };
  }

  // --- ADMIN ENDPOINTS ---

  async getAdminDashboard() {
    const totalUsers = this.store.users.length;
    const students = this.store.users.filter((u) => u.role === 'student').length;
    const officers = this.store.users.filter((u) => u.role === 'officer').length;
    const admins = this.store.users.filter((u) => u.role === 'admin').length;

    const totalDrives = this.store.drives.length;
    const activeDrives = this.store.drives.filter((d) => d.status === 'active').length;

    const totalApps = this.store.applications.length;
    const shortlistedApps = this.store.applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length;

    const totalOffers = this.store.offers.length;
    const acceptedOffers = this.store.offers.filter((o) => o.status === 'accepted').length;

    return {
      success: true,
      counts: {
        users: { total: totalUsers + 130, students: students + 125, officers: officers + 4, admins: admins + 1 },
        drives: { total: totalDrives + 12, active: activeDrives },
        applications: { total: totalApps + 280, shortlisted: shortlistedApps + 95, offers: totalOffers + 40 },
        offers: { total: totalOffers + 40, accepted: acceptedOffers + 35 }
      },
      recentAuditLogs: this.store.auditLogs
    };
  }

  async getUsers(params = {}) {
    let users = [...this.store.users];
    if (params.role && params.role !== 'all') {
      users = users.filter((u) => u.role === params.role);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.rollNo?.toLowerCase().includes(q));
    }
    return {
      success: true,
      users,
      total: users.length,
      page: 1,
      pages: 1
    };
  }

  async updateUserRole(id, role) {
    const user = this.store.users.find((u) => u._id === id);
    if (user) {
      user.role = role;
      this.saveStore();
      notifyDemoAction(`User role updated to ${role}`);
    }
    return { success: true, message: `Role updated to ${role} (Demo Mode)` };
  }

  async toggleUserStatus(id, isActive) {
    const user = this.store.users.find((u) => u._id === id);
    if (user) {
      user.isActive = isActive;
      this.saveStore();
      notifyDemoAction(`User status toggled to ${isActive ? 'Active' : 'Inactive'}`);
    }
    return { success: true, message: `Status updated (Demo Mode)` };
  }

  async createOfficerAccount(data) {
    const newOfficer = {
      _id: `user-officer-${Date.now()}`,
      name: data.name,
      email: data.email,
      rollNo: `OFFICER-${Math.floor(100 + Math.random() * 900)}`,
      role: 'officer',
      branch: data.branch || 'CSE',
      phone: data.phone || '9848012345',
      isActive: true,
      isSample: false
    };
    this.store.users.push(newOfficer);
    this.saveStore();
    notifyDemoAction(`Officer account provisioned for "${newOfficer.name}"`);
    return { success: true, message: 'Officer account created (Demo Mode)', user: newOfficer };
  }

  async getAuditLogs(params = {}) {
    let logs = [...this.store.auditLogs];
    if (params.action && params.action !== 'all') {
      logs = logs.filter((l) => l.action === params.action);
    }
    return {
      success: true,
      logs,
      total: logs.length,
      page: 1,
      pages: 1
    };
  }
}

export const demoService = new DemoService();

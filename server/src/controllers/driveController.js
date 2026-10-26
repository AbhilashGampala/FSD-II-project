import Drive from '../models/Drive.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/drives - List drives with role-aware visibility and filters
export const getDrives = async (req, res, next) => {
  try {
    const { branch, minCgpa, minPackage, driveType, status, search } = req.query;
    const query = {};

    // Role-based visibility: Students can only view published drives
    if (req.user.role === 'student') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (driveType) {
      query.driveType = driveType;
    }

    if (minPackage) {
      query.packageLPA = { $gte: Number(minPackage) };
    }

    if (branch) {
      // Either drive is open to all branches (empty branches array) OR contains the specified branch
      query.$or = [
        { 'eligibility.branches': { $size: 0 } },
        { 'eligibility.branches': branch }
      ];
    }

    if (minCgpa) {
      query['eligibility.minCgpa'] = { $lte: Number(minCgpa) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } }
      ];
    }

    const drives = await Drive.find(query)
      .populate('company', 'name industry logoUrl website')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: drives.length, drives });
  } catch (error) {
    next(error);
  }
};

// GET /api/drives/:id - Get drive details
export const getDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('company')
      .populate('createdBy', 'name email role');

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Students cannot view draft or private drives directly
    if (req.user.role === 'student' && drive.status !== 'published') {
      return res.status(403).json({ success: false, message: 'This drive is not published yet' });
    }

    // Get applicant stats if officer or admin
    let stats = null;
    if (req.user.role !== 'student') {
      const totalApplications = await Application.countDocuments({ drive: drive._id });
      const shortlisted = await Application.countDocuments({ drive: drive._id, status: 'shortlisted' });
      const selected = await Application.countDocuments({ drive: drive._id, status: 'selected' });
      stats = { totalApplications, shortlisted, selected };
    }

    res.json({ success: true, drive, stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/drives - Create new drive
export const createDrive = async (req, res, next) => {
  try {
    const {
      company,
      title,
      jobRole,
      driveType = 'on-campus',
      packageLPA,
      locations,
      description,
      rounds,
      deadline,
      driveDate,
      status = 'draft',
      eligibility = {}
    } = req.body;

    if (!company || !title || !jobRole || packageLPA === undefined || !deadline || !driveDate) {
      return res.status(400).json({
        success: false,
        message: 'Company, title, job role, package, deadline, and drive date are required'
      });
    }

    // Check company existence
    const companyDoc = await Company.findById(company);
    if (!companyDoc) {
      return res.status(400).json({ success: false, message: 'Specified company does not exist' });
    }

    // Validate numbers
    if (Number(packageLPA) < 0) {
      return res.status(400).json({ success: false, message: 'Package cannot be negative' });
    }

    // Validate dates: deadline cannot be after driveDate
    const dDate = new Date(driveDate);
    const deadDate = new Date(deadline);
    if (deadDate > dDate) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline cannot be after the drive event date'
      });
    }

    const drive = await Drive.create({
      company,
      title: title.trim(),
      jobRole: jobRole.trim(),
      driveType,
      packageLPA: Number(packageLPA),
      locations: Array.isArray(locations) ? locations : [locations || 'Bhimavaram'],
      description: (description || '').trim(),
      rounds: Array.isArray(rounds) && rounds.length > 0 ? rounds : ['Online Aptitude Test', 'Technical Interview', 'HR Interview'],
      deadline: deadDate,
      driveDate: dDate,
      status,
      createdBy: req.user._id,
      isSample: false,
      eligibility: {
        branches: Array.isArray(eligibility.branches) ? eligibility.branches : [],
        minCgpa: Number(eligibility.minCgpa) || 0,
        min10thPct: Number(eligibility.min10thPct) || 0,
        min12thPct: Number(eligibility.min12thPct) || 0,
        maxActiveBacklogs: Number(eligibility.maxActiveBacklogs) || 0,
        graduationYear: eligibility.graduationYear ? Number(eligibility.graduationYear) : null
      }
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE_DRIVE',
      targetType: 'Drive',
      targetId: drive._id,
      details: { title: drive.title, packageLPA: drive.packageLPA, status: drive.status }
    });

    res.status(201).json({ success: true, message: 'Placement drive created successfully', drive });
  } catch (error) {
    next(error);
  }
};

// PUT /api/drives/:id - Update drive
export const updateDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const {
      company,
      title,
      jobRole,
      driveType,
      packageLPA,
      locations,
      description,
      rounds,
      deadline,
      driveDate,
      status,
      eligibility
    } = req.body;

    if (company) drive.company = company;
    if (title) drive.title = title.trim();
    if (jobRole) drive.jobRole = jobRole.trim();
    if (driveType) drive.driveType = driveType;
    if (packageLPA !== undefined) drive.packageLPA = Number(packageLPA);
    if (locations) drive.locations = Array.isArray(locations) ? locations : [locations];
    if (description !== undefined) drive.description = description.trim();
    if (rounds) drive.rounds = Array.isArray(rounds) ? rounds : drive.rounds;
    if (status) drive.status = status;

    if (deadline) drive.deadline = new Date(deadline);
    if (driveDate) drive.driveDate = new Date(driveDate);

    // Validate dates
    if (drive.deadline > drive.driveDate) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline cannot be after the drive event date'
      });
    }

    if (eligibility) {
      drive.eligibility = {
        branches: Array.isArray(eligibility.branches) ? eligibility.branches : drive.eligibility.branches,
        minCgpa: eligibility.minCgpa !== undefined ? Number(eligibility.minCgpa) : drive.eligibility.minCgpa,
        min10thPct: eligibility.min10thPct !== undefined ? Number(eligibility.min10thPct) : drive.eligibility.min10thPct,
        min12thPct: eligibility.min12thPct !== undefined ? Number(eligibility.min12thPct) : drive.eligibility.min12thPct,
        maxActiveBacklogs: eligibility.maxActiveBacklogs !== undefined ? Number(eligibility.maxActiveBacklogs) : drive.eligibility.maxActiveBacklogs,
        graduationYear: eligibility.graduationYear ? Number(eligibility.graduationYear) : drive.eligibility.graduationYear
      };
    }

    await drive.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE_DRIVE',
      targetType: 'Drive',
      targetId: drive._id,
      details: { title: drive.title, status: drive.status }
    });

    res.json({ success: true, message: 'Drive updated successfully', drive });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/drives/:id/status - Quick status toggle (publish, close, draft)
export const updateDriveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const previousStatus = drive.status;
    drive.status = status;
    await drive.save();

    await logAudit({
      actorId: req.user._id,
      action: 'CHANGE_DRIVE_STATUS',
      targetType: 'Drive',
      targetId: drive._id,
      details: { previousStatus, newStatus: status, title: drive.title }
    });

    res.json({ success: true, message: `Drive status changed to ${status}`, drive });
  } catch (error) {
    next(error);
  }
};

// POST /api/drives/:id/duplicate - Duplicate drive as draft
export const duplicateDrive = async (req, res, next) => {
  try {
    const original = await Drive.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const duplicated = await Drive.create({
      company: original.company,
      title: `${original.title} (Copy)`,
      jobRole: original.jobRole,
      driveType: original.driveType,
      packageLPA: original.packageLPA,
      locations: original.locations,
      description: original.description,
      rounds: original.rounds,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default +14 days
      driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Default +20 days
      status: 'draft',
      createdBy: req.user._id,
      isSample: false,
      eligibility: original.eligibility
    });

    await logAudit({
      actorId: req.user._id,
      action: 'DUPLICATE_DRIVE',
      targetType: 'Drive',
      targetId: duplicated._id,
      details: { originalId: original._id, newTitle: duplicated.title }
    });

    res.status(201).json({ success: true, message: 'Drive duplicated successfully as draft', drive: duplicated });
  } catch (error) {
    next(error);
  }
};

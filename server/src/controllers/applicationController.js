import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { checkEligibility } from '../utils/eligibility.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/applications/drive/:driveId - Officer review for a specific drive with filters
export const getApplicationsByDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { branch, status, minCgpa, maxCgpa } = req.query;

    const query = { drive: driveId };

    if (status) {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('student', 'name email rollNo branch cgpa tenthPct twelfthPct activeBacklogs phone admissionYear graduationYear isSample')
      .populate('drive', 'title jobRole packageLPA deadline status')
      .sort({ createdAt: -1 });

    // In-memory filter on populated student fields if provided
    if (branch) {
      applications = applications.filter((app) => app.student?.branch === branch);
    }
    if (minCgpa) {
      applications = applications.filter((app) => (app.student?.cgpa || 0) >= Number(minCgpa));
    }
    if (maxCgpa) {
      applications = applications.filter((app) => (app.student?.cgpa || 0) <= Number(maxCgpa));
    }

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/status - Change status and append to history (Officer & Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required' });
    }

    const application = await Application.findById(req.params.id)
      .populate('student', 'name email')
      .populate('drive', 'title');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = status;

    // Append to audit history
    application.history.push({
      status,
      note: note ? note.trim() : `Status changed from ${previousStatus} to ${status}`,
      at: new Date(),
      by: req.user._id
    });

    await application.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE_APPLICATION_STATUS',
      targetType: 'Application',
      targetId: application._id,
      details: {
        previousStatus,
        newStatus: status,
        student: application.student?.name,
        drive: application.drive?.title,
        note
      }
    });

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      application
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications/bulk-shortlist - Bulk shortlist selected rows (Officer & Admin)
export const bulkShortlistApplications = async (req, res, next) => {
  try {
    const { applicationIds = [], note = 'Shortlisted via bulk action' } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No applications selected' });
    }

    const applications = await Application.find({ _id: { $in: applicationIds } });

    for (const app of applications) {
      app.status = 'shortlisted';
      app.history.push({
        status: 'shortlisted',
        note,
        at: new Date(),
        by: req.user._id
      });
      await app.save();
    }

    await logAudit({
      actorId: req.user._id,
      action: 'BULK_SHORTLIST',
      targetType: 'Application',
      targetId: 'BULK',
      details: { count: applications.length, applicationIds }
    });

    res.json({
      success: true,
      message: `Successfully shortlisted ${applications.length} candidate(s)`
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications - Student applies for a published drive
export const applyForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.body;
    const studentId = req.user._id;

    if (!driveId) {
      return res.status(400).json({ success: false, message: 'Drive ID is required' });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    if (drive.status !== 'published') {
      return res.status(400).json({ success: false, message: 'This placement drive is not open for applications' });
    }

    // Check application deadline
    if (new Date() > new Date(drive.deadline)) {
      return res.status(400).json({ success: false, message: 'The deadline for this placement drive has passed' });
    }

    // Check duplicate application
    const existing = await Application.findOne({ drive: driveId, student: studentId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this placement drive' });
    }

    // Strict eligibility check on server
    const student = await User.findById(studentId);
    const eligibilityResult = checkEligibility(student, drive.eligibility);

    if (!eligibilityResult.eligible) {
      return res.status(400).json({
        success: false,
        message: eligibilityResult.firstFailingReason || 'You do not meet the eligibility criteria for this drive',
        reasons: eligibilityResult.reasons
      });
    }

    const application = await Application.create({
      drive: driveId,
      student: studentId,
      status: 'applied',
      history: [
        {
          status: 'applied',
          note: 'Application submitted by student',
          at: new Date(),
          by: studentId
        }
      ],
      isSample: false
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/mine - Logged in student views their own applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name industry logoUrl' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/withdraw - Student withdraws their application (only while applied)
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'applied') {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application once status has progressed to '${application.status}'`
      });
    }

    application.status = 'withdrawn';
    application.history.push({
      status: 'withdrawn',
      note: 'Withdrawn by student',
      at: new Date(),
      by: req.user._id
    });

    await application.save();

    res.json({ success: true, message: 'Application withdrawn successfully', application });
  } catch (error) {
    next(error);
  }
};

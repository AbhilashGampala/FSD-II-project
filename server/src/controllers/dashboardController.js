import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import Company from '../models/Company.js';
import Stat from '../models/Stat.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { checkEligibility } from '../utils/eligibility.js';
import { calculateCompleteness } from './profileController.js';

// GET /api/dashboard/officer - Summary statistics, deadlines, and recent applications
export const getOfficerDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      activeDrives,
      totalCompanies,
      totalApplications,
      shortlistedCount,
      interviewsThisWeek,
      offersMade,
      upcomingDeadlines,
      recentApplications
    ] = await Promise.all([
      Drive.countDocuments({ status: 'published' }),
      Company.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'shortlisted' }),
      Interview.countDocuments({
        date: { $gte: now, $lte: oneWeekFromNow },
        status: 'scheduled'
      }),
      Offer.countDocuments(),
      Drive.find({ status: 'published', deadline: { $gte: now } })
        .populate('company', 'name logoUrl')
        .sort({ deadline: 1 })
        .limit(5)
        .select('title jobRole packageLPA deadline locations isSample'),
      Application.find()
        .populate('student', 'name email rollNo branch cgpa')
        .populate('drive', 'title packageLPA')
        .sort({ createdAt: -1 })
        .limit(6)
        .select('status createdAt student drive isSample')
    ]);

    const hasSampleData = true;

    res.json({
      success: true,
      counts: {
        activeDrives,
        totalCompanies,
        totalApplications,
        shortlistedCount,
        interviewsThisWeek,
        offersMade
      },
      upcomingDeadlines,
      recentApplications,
      isSampleData: hasSampleData
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/student - Summary numbers, next interview, closing deadlines, placement stats
export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const student = await User.findById(studentId);
    const now = new Date();

    const [
      appliedCount,
      shortlistedCount,
      upcomingInterviewsCount,
      offersCount,
      nextInterview,
      publishedDrives,
      myApplications,
      stats
    ] = await Promise.all([
      Application.countDocuments({ student: studentId }),
      Application.countDocuments({ student: studentId, status: 'shortlisted' }),
      Interview.countDocuments({ student: studentId, date: { $gte: now }, status: 'scheduled' }),
      Offer.countDocuments({ student: studentId }),
      Interview.findOne({ student: studentId, date: { $gte: now }, status: 'scheduled' })
        .populate({
          path: 'drive',
          select: 'title packageLPA company',
          populate: { path: 'company', select: 'name logoUrl' }
        })
        .sort({ date: 1, startTime: 1 }),
      Drive.find({ status: 'published' })
        .populate('company', 'name logoUrl')
        .sort({ deadline: 1 }),
      Application.find({ student: studentId }).select('drive status'),
      Stat.find().sort({ year: -1 })
    ]);

    // Calculate applied drive IDs
    const appliedDriveIds = new Set(myApplications.map((a) => a.drive.toString()));

    // Evaluate eligibility for each drive
    let eligibleDrivesCount = 0;
    const deadlinesClosingSoon = [];

    for (const drive of publishedDrives) {
      const eligibilityResult = checkEligibility(student, drive.eligibility);
      if (eligibilityResult.eligible) {
        eligibleDrivesCount++;
      }

      // Collect closing soon (upcoming deadlines)
      if (new Date(drive.deadline) >= now && deadlinesClosingSoon.length < 4) {
        deadlinesClosingSoon.push({
          _id: drive._id,
          title: drive.title,
          jobRole: drive.jobRole,
          packageLPA: drive.packageLPA,
          deadline: drive.deadline,
          company: drive.company,
          isSample: drive.isSample,
          hasApplied: appliedDriveIds.has(drive._id.toString()),
          eligibility: eligibilityResult
        });
      }
    }

    const completeness = calculateCompleteness(student);

    res.json({
      success: true,
      counts: {
        applied: appliedCount,
        shortlisted: shortlistedCount,
        interviewsUpcoming: upcomingInterviewsCount,
        offers: offersCount,
        eligibleDrives: eligibleDrivesCount
      },
      nextInterview,
      deadlinesClosingSoon,
      stats,
      completeness,
      profile: student
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/admin - Institutional summary analytics and recent audit logs
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      studentCount,
      officerCount,
      adminCount,
      activeUsers,
      deactivatedUsers,
      totalDrives,
      publishedDrives,
      draftDrives,
      totalApplications,
      totalInterviews,
      totalOffers,
      acceptedOffers,
      recentAuditLogs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'officer' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Drive.countDocuments(),
      Drive.countDocuments({ status: 'published' }),
      Drive.countDocuments({ status: 'draft' }),
      Application.countDocuments(),
      Interview.countDocuments(),
      Offer.countDocuments(),
      Offer.countDocuments({ status: 'accepted' }),
      AuditLog.find()
        .populate('actor', 'name email role')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      counts: {
        users: {
          total: totalUsers,
          students: studentCount,
          officers: officerCount,
          admins: adminCount,
          active: activeUsers,
          deactivated: deactivatedUsers
        },
        drives: {
          total: totalDrives,
          published: publishedDrives,
          draft: draftDrives
        },
        applications: {
          total: totalApplications
        },
        interviews: {
          total: totalInterviews
        },
        offers: {
          total: totalOffers,
          accepted: acceptedOffers
        }
      },
      recentAuditLogs
    });
  } catch (error) {
    next(error);
  }
};


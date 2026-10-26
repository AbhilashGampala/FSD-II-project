import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import Company from '../models/Company.js';

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

    // Check if the majority of items are demo sample data
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

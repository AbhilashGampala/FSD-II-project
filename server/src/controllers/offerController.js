import Offer from '../models/Offer.js';
import Application from '../models/Application.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/offers - List all offers with filters (Officer & Admin)
export const getOffers = async (req, res, next) => {
  try {
    const { status, driveId, companyId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (driveId) query.drive = driveId;
    if (companyId) query.company = companyId;

    const offers = await Offer.find(query)
      .populate('student', 'name email rollNo branch phone')
      .populate('company', 'name industry logoUrl')
      .populate('drive', 'title jobRole packageLPA driveType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: offers.length, offers });
  } catch (error) {
    next(error);
  }
};

// POST /api/offers - Create job offer for a student (Officer & Admin)
export const createOffer = async (req, res, next) => {
  try {
    const {
      applicationId,
      jobRole,
      packageLPA,
      location = 'Hyderabad',
      joiningDate,
      offerLetterLink,
      acceptDeadline
    } = req.body;

    if (!applicationId || !packageLPA || !acceptDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application ID, package (LPA), and acceptance deadline are required'
      });
    }

    const application = await Application.findById(applicationId)
      .populate('student')
      .populate('drive');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Ensure application status is updated to selected
    if (application.status !== 'selected') {
      application.status = 'selected';
      application.history.push({
        status: 'selected',
        note: `Offer generated: ${packageLPA} LPA (${jobRole || application.drive.jobRole})`,
        at: new Date(),
        by: req.user._id
      });
      await application.save();
    }

    const offer = await Offer.create({
      application: application._id,
      student: application.student._id,
      drive: application.drive._id,
      company: application.drive.company,
      jobRole: (jobRole || application.drive.jobRole).trim(),
      packageLPA: Number(packageLPA),
      location: (location || 'Hyderabad').trim(),
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      offerLetterLink: (offerLetterLink || '').trim(),
      acceptDeadline: new Date(acceptDeadline),
      status: 'pending',
      isSample: false
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE_OFFER',
      targetType: 'Offer',
      targetId: offer._id,
      details: {
        student: application.student.name,
        company: application.drive.company,
        packageLPA: offer.packageLPA,
        role: offer.jobRole
      }
    });

    res.status(201).json({
      success: true,
      message: 'Placement offer recorded successfully',
      offer
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/offers/mine - Student views their job offers
export const getMyOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ student: req.user._id })
      .populate('company', 'name industry logoUrl')
      .populate('drive', 'title jobRole driveType')
      .sort({ createdAt: -1 });

    // Check expiration dynamically
    const now = new Date();
    for (const off of offers) {
      if (off.status === 'pending' && now > new Date(off.acceptDeadline)) {
        off.status = 'expired';
        await off.save();
      }
    }

    res.json({ success: true, count: offers.length, offers });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/offers/:id/respond - Student responds to offer (accept / decline)
export const respondToOffer = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Response must be accepted or declined' });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      student: req.user._id
    }).populate('company', 'name');

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    if (offer.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This offer is already marked as ${offer.status}`
      });
    }

    // Check deadline
    if (new Date() > new Date(offer.acceptDeadline)) {
      offer.status = 'expired';
      await offer.save();
      return res.status(400).json({
        success: false,
        message: 'The acceptance deadline for this offer has passed'
      });
    }

    offer.status = action;
    offer.respondedAt = new Date();
    await offer.save();

    res.json({
      success: true,
      message: `You have successfully ${action} the offer from ${offer.company.name}`,
      offer
    });
  } catch (error) {
    next(error);
  }
};

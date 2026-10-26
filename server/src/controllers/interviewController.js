import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/interviews - List interviews (Officer & Admin)
export const getInterviews = async (req, res, next) => {
  try {
    const { driveId, status, upcoming } = req.query;
    const query = {};

    if (driveId) query.drive = driveId;
    if (status) query.status = status;
    if (upcoming === 'true') {
      query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
      query.status = 'scheduled';
    }

    const interviews = await Interview.find(query)
      .populate('student', 'name email rollNo branch phone')
      .populate({
        path: 'drive',
        select: 'title jobRole packageLPA company',
        populate: { path: 'company', select: 'name logoUrl' }
      })
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

// POST /api/interviews - Schedule interview from an application (Officer & Admin)
export const createInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      roundName,
      date,
      startTime,
      mode = 'offline',
      venue,
      meetingLink,
      panel,
      instructions
    } = req.body;

    if (!applicationId || !roundName || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Application ID, round name, date, and start time are required'
      });
    }

    const application = await Application.findById(applicationId)
      .populate('student')
      .populate('drive');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: application._id,
      drive: application.drive._id,
      student: application.student._id,
      roundName: roundName.trim(),
      date: new Date(date),
      startTime: startTime.trim(),
      mode,
      venue: mode === 'offline' ? (venue || 'Placement Seminar Hall, Block A') : '',
      meetingLink: mode === 'online' ? (meetingLink || '') : '',
      panel: (panel || 'Placement Interview Panel').trim(),
      instructions: (instructions || 'Carry updated resumes and formal college attire.').trim(),
      status: 'scheduled',
      isSample: false
    });

    // Optionally update application history
    application.history.push({
      status: application.status,
      note: `Interview scheduled: ${roundName} on ${new Date(date).toLocaleDateString()} at ${startTime}`,
      at: new Date(),
      by: req.user._id
    });
    await application.save();

    await logAudit({
      actorId: req.user._id,
      action: 'SCHEDULE_INTERVIEW',
      targetType: 'Interview',
      targetId: interview._id,
      details: {
        roundName,
        student: application.student.name,
        drive: application.drive.title,
        date
      }
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/interviews/:id - Edit interview details
export const updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const { roundName, date, startTime, mode, venue, meetingLink, panel, instructions, status } = req.body;

    if (roundName) interview.roundName = roundName.trim();
    if (date) interview.date = new Date(date);
    if (startTime) interview.startTime = startTime.trim();
    if (mode) interview.mode = mode;
    if (venue !== undefined) interview.venue = venue.trim();
    if (meetingLink !== undefined) interview.meetingLink = meetingLink.trim();
    if (panel !== undefined) interview.panel = panel.trim();
    if (instructions !== undefined) interview.instructions = instructions.trim();
    if (status) interview.status = status;

    await interview.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE_INTERVIEW',
      targetType: 'Interview',
      targetId: interview._id,
      details: { roundName: interview.roundName, status: interview.status }
    });

    res.json({ success: true, message: 'Interview updated successfully', interview });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/interviews/:id/status - Update interview status (completed/cancelled)
export const updateInterviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    interview.status = status;
    await interview.save();

    await logAudit({
      actorId: req.user._id,
      action: 'CHANGE_INTERVIEW_STATUS',
      targetType: 'Interview',
      targetId: interview._id,
      details: { newStatus: status, roundName: interview.roundName }
    });

    res.json({ success: true, message: `Interview marked as ${status}`, interview });
  } catch (error) {
    next(error);
  }
};

// GET /api/interviews/mine - Student views their interview schedules
export const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ student: req.user._id })
      .populate({
        path: 'drive',
        select: 'title jobRole packageLPA company',
        populate: { path: 'company', select: 'name logoUrl' }
      })
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

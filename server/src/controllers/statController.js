import Stat from '../models/Stat.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/stats - Public to all logged-in accounts
export const getStats = async (req, res, next) => {
  try {
    const stats = await Stat.find().sort({ year: -1, createdAt: 1 });
    res.json({ success: true, count: stats.length, stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/stats - Create a new stat entry (Officer & Admin)
export const createStat = async (req, res, next) => {
  try {
    const { label, value = '', year = 2024, sourceUrl = '', sourceNote = '', verified = false } = req.body;

    if (!label) {
      return res.status(400).json({ success: false, message: 'Stat label is required' });
    }

    // Data Honesty rule: verified requires sourceUrl
    if (verified && (!sourceUrl || !sourceUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A statistic cannot be marked as verified without a valid published source URL'
      });
    }

    const stat = await Stat.create({
      label: label.trim(),
      value: value.trim(),
      year: Number(year) || 2024,
      sourceUrl: (sourceUrl || '').trim(),
      sourceNote: (sourceNote || '').trim(),
      verified: Boolean(verified && sourceUrl && sourceUrl.trim())
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE_STAT',
      targetType: 'Stat',
      targetId: stat._id,
      details: { label: stat.label, value: stat.value, verified: stat.verified }
    });

    res.status(201).json({ success: true, message: 'Statistic created', stat });
  } catch (error) {
    next(error);
  }
};

// PUT /api/stats/:id - Edit stat (Officer & Admin)
export const updateStat = async (req, res, next) => {
  try {
    const stat = await Stat.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ success: false, message: 'Statistic record not found' });
    }

    const { label, value, year, sourceUrl, sourceNote, verified } = req.body;

    const newSourceUrl = sourceUrl !== undefined ? sourceUrl.trim() : stat.sourceUrl;
    const newVerified = verified !== undefined ? Boolean(verified) : stat.verified;

    // Data Honesty Rule: verified requires sourceUrl
    if (newVerified && (!newSourceUrl || !newSourceUrl.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Data Honesty Rule: A statistic cannot be marked as verified without providing an official source URL'
      });
    }

    if (label !== undefined) stat.label = label.trim();
    if (value !== undefined) stat.value = value.trim();
    if (year !== undefined) stat.year = Number(year);
    if (sourceUrl !== undefined) stat.sourceUrl = newSourceUrl;
    if (sourceNote !== undefined) stat.sourceNote = sourceNote.trim();
    stat.verified = newVerified;

    await stat.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE_STAT',
      targetType: 'Stat',
      targetId: stat._id,
      details: { label: stat.label, value: stat.value, verified: stat.verified }
    });

    res.json({ success: true, message: 'Statistic updated successfully', stat });
  } catch (error) {
    next(error);
  }
};

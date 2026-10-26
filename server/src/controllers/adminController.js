import User, { ROLE_ENUM } from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/admin/users - List users with search, role, and status filters
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role && ROLE_ENUM.includes(role)) {
      query.role = role;
    }

    if (status !== undefined && status !== '') {
      query.isActive = status === 'active' || status === 'true';
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { rollNo: searchRegex },
        { branch: searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      users
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role - Update a user's role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!ROLE_ENUM.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${ROLE_ENUM.join(', ')}`
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Safety guard: Admin cannot remove their own admin role
    if (req.user._id.toString() === targetUser._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot remove their own admin privileges.'
      });
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    await logAudit({
      actorId: req.user._id,
      action: 'CHANGE_USER_ROLE',
      targetType: 'User',
      targetId: targetUser._id,
      details: {
        userEmail: targetUser.email,
        userName: targetUser.name,
        fromRole: previousRole,
        toRole: role
      }
    });

    res.json({
      success: true,
      message: `Updated ${targetUser.name}'s role from ${previousRole} to ${role}`,
      user: targetUser
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status - Toggle activate / deactivate user
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = typeof isActive === 'boolean' ? isActive : !targetUser.isActive;

    // Safety guard: Admin cannot deactivate themselves
    if (req.user._id.toString() === targetUser._id.toString() && newStatus === false) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot deactivate their own account.'
      });
    }

    targetUser.isActive = newStatus;
    await targetUser.save();

    await logAudit({
      actorId: req.user._id,
      action: newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      targetType: 'User',
      targetId: targetUser._id,
      details: {
        userEmail: targetUser.email,
        userName: targetUser.name,
        newStatus: newStatus ? 'active' : 'deactivated'
      }
    });

    res.json({
      success: true,
      message: `Account for ${targetUser.name} is now ${newStatus ? 'active' : 'deactivated'}`,
      user: targetUser
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users/officer - Create a new Placement Officer account
export const createOfficerAccount = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Officer name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Officer email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify Vishnu domain
    if (!cleanEmail.endsWith('@vishnu.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Placement Officer email must end with @vishnu.edu.in domain'
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account already exists for ${cleanEmail} with role: ${existingUser.role}`
      });
    }

    const officer = await User.create({
      name: name.trim(),
      email: cleanEmail,
      role: 'officer',
      phone: (phone || '').trim(),
      isActive: true,
      isSample: false
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE_OFFICER_ACCOUNT',
      targetType: 'User',
      targetId: officer._id,
      details: {
        officerName: officer.name,
        officerEmail: officer.email
      }
    });

    res.status(201).json({
      success: true,
      message: `Placement Officer account created successfully for ${officer.name}`,
      officer
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/audit - Search and filter institutional audit logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, targetType, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (action && action.trim()) {
      query.action = action.trim();
    }

    if (targetType && targetType.trim()) {
      query.targetType = targetType.trim();
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('actor', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: logs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      logs
    });
  } catch (error) {
    next(error);
  }
};

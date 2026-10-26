import AuditLog from '../models/AuditLog.js';

/**
 * Record an audit log entry for administrative or officer actions
 * @param {Object} params
 * @param {string} params.actorId - User ID who performed the action
 * @param {string} params.action - Name of action (e.g. 'CREATE_DRIVE', 'UPDATE_STATUS')
 * @param {string} params.targetType - Target model (e.g. 'Drive', 'Company', 'Application')
 * @param {string} [params.targetId] - Target document ID
 * @param {Object} [params.details] - Extra metadata about the modification
 */
export const logAudit = async ({ actorId, action, targetType, targetId = '', details = {} }) => {
  try {
    await AuditLog.create({
      actor: actorId,
      action,
      targetType,
      targetId: String(targetId),
      details
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

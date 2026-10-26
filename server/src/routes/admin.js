import { Router } from 'express';
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
  createOfficerAccount,
  getAuditLogs
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Restrict entire admin router to authenticated Admins
router.use(requireAuth, requireRole('admin'));

// User management routes
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);
router.post('/users/officer', createOfficerAccount);

// Audit logs
router.get('/audit', getAuditLogs);

export default router;

import { Router } from 'express';
import { getOfficerDashboard, getStudentDashboard, getAdminDashboard } from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/officer', requireRole('officer', 'admin'), getOfficerDashboard);
router.get('/student', requireRole('student', 'admin'), getStudentDashboard);
router.get('/admin', requireRole('admin'), getAdminDashboard);

export default router;

import { Router } from 'express';
import { getOfficerDashboard } from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/officer', requireRole('officer', 'admin'), getOfficerDashboard);

export default router;

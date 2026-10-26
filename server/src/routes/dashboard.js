import { getOfficerDashboard, getStudentDashboard } from '../controllers/dashboardController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/officer', requireRole('officer', 'admin'), getOfficerDashboard);
router.get('/student', requireRole('student', 'admin'), getStudentDashboard);

export default router;

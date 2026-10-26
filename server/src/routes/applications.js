import { Router } from 'express';
import {
  getApplicationsByDrive,
  updateApplicationStatus,
  bulkShortlistApplications,
  applyForDrive,
  getMyApplications,
  withdrawApplication
} from '../controllers/applicationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// Student routes
router.post('/', requireRole('student'), applyForDrive);
router.get('/mine', requireRole('student'), getMyApplications);
router.patch('/:id/withdraw', requireRole('student'), withdrawApplication);

// Officer & Admin routes
router.get('/drive/:driveId', requireRole('officer', 'admin'), getApplicationsByDrive);
router.patch('/:id/status', requireRole('officer', 'admin'), updateApplicationStatus);
router.post('/bulk-shortlist', requireRole('officer', 'admin'), bulkShortlistApplications);

export default router;

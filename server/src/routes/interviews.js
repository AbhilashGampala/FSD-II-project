import { Router } from 'express';
import {
  getInterviews,
  createInterview,
  updateInterview,
  updateInterviewStatus,
  getMyInterviews
} from '../controllers/interviewController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// Student route
router.get('/mine', requireRole('student'), getMyInterviews);

// Officer & Admin routes
router.get('/', requireRole('officer', 'admin'), getInterviews);
router.post('/', requireRole('officer', 'admin'), createInterview);
router.put('/:id', requireRole('officer', 'admin'), updateInterview);
router.patch('/:id/status', requireRole('officer', 'admin'), updateInterviewStatus);

export default router;

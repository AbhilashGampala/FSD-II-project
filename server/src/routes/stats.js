import { Router } from 'express';
import {
  getStats,
  createStat,
  updateStat
} from '../controllers/statController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// All authenticated users can view verified/unverified stats
router.get('/', getStats);

// Only Officer and Admin can edit placement statistics
router.post('/', requireRole('officer', 'admin'), createStat);
router.put('/:id', requireRole('officer', 'admin'), updateStat);

export default router;

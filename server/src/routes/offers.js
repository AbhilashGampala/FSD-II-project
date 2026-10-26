import { Router } from 'express';
import {
  getOffers,
  createOffer,
  getMyOffers,
  respondToOffer
} from '../controllers/offerController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// Student routes
router.get('/mine', requireRole('student'), getMyOffers);
router.patch('/:id/respond', requireRole('student'), respondToOffer);

// Officer & Admin routes
router.get('/', requireRole('officer', 'admin'), getOffers);
router.post('/', requireRole('officer', 'admin'), createOffer);

export default router;

import { Router } from 'express';
import {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  updateDriveStatus,
  duplicateDrive
} from '../controllers/driveController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// List & Detail (role-aware: students see published only)
router.get('/', getDrives);
router.get('/:id', getDriveById);

// Officer & Admin management
router.post('/', requireRole('officer', 'admin'), createDrive);
router.put('/:id', requireRole('officer', 'admin'), updateDrive);
router.patch('/:id/status', requireRole('officer', 'admin'), updateDriveStatus);
router.post('/:id/duplicate', requireRole('officer', 'admin'), duplicateDrive);

export default router;

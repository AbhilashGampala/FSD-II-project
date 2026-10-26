import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// All company routes require authentication
router.use(requireAuth);

// Anyone logged in can view company list and details
router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Modifications restricted to Placement Officer & Admin
router.post('/', requireRole('officer', 'admin'), createCompany);
router.put('/:id', requireRole('officer', 'admin'), updateCompany);
router.delete('/:id', requireRole('officer', 'admin'), deleteCompany);

export default router;

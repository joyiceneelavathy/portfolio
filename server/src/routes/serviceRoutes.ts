import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticateAdmin, createService);
router.put('/:id', authenticateAdmin, updateService);
router.delete('/:id', authenticateAdmin, deleteService);

export default router;

import { Router } from 'express';
import {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllEducation);
router.get('/:id', getEducationById);
router.post('/', authenticateAdmin, createEducation);
router.put('/:id', authenticateAdmin, updateEducation);
router.delete('/:id', authenticateAdmin, deleteEducation);

export default router;

import { Router } from 'express';
import {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllExperience);
router.get('/:id', getExperienceById);
router.post('/', authenticateAdmin, createExperience);
router.put('/:id', authenticateAdmin, updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;

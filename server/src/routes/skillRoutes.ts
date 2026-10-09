import { Router } from 'express';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllSkills);
router.get('/:id', getSkillById);
router.post('/', authenticateAdmin, createSkill);
router.put('/:id', authenticateAdmin, updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;

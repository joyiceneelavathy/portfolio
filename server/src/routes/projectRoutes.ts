import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateAdmin, createProject);
router.put('/:id', authenticateAdmin, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;

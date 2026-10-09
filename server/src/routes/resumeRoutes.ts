import { Router } from 'express';
import { getResume, updateResume } from '../controllers/resumeController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getResume);
router.put('/', authenticateAdmin, updateResume);
router.post('/', authenticateAdmin, updateResume);

export default router;

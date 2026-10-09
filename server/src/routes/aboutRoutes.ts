import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAbout);
router.put('/', authenticateAdmin, updateAbout);
router.post('/', authenticateAdmin, updateAbout);

export default router;

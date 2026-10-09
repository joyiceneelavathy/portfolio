import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateAdmin, updateSettings);
router.post('/', authenticateAdmin, updateSettings);

export default router;

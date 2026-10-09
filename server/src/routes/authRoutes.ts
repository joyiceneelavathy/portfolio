import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateAdmin, getMe);
router.post('/change-password', authenticateAdmin, changePassword);

export default router;

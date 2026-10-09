import { Router } from 'express';
import {
  submitContact,
  getContacts,
  markAsRead,
  deleteContact,
} from '../controllers/contactController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', submitContact);
router.get('/', authenticateAdmin, getContacts);
router.patch('/:id/read', authenticateAdmin, markAsRead);
router.delete('/:id', authenticateAdmin, deleteContact);

export default router;

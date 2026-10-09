import { Router } from 'express';
import {
  getAllSocialLinks,
  getSocialLinkById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/socialLinkController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllSocialLinks);
router.get('/:id', getSocialLinkById);
router.post('/', authenticateAdmin, createSocialLink);
router.put('/:id', authenticateAdmin, updateSocialLink);
router.delete('/:id', authenticateAdmin, deleteSocialLink);

export default router;

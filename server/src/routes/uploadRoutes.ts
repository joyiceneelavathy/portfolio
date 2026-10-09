import { Router, Request, Response, NextFunction } from 'express';
import { handleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Middleware to catch multer file format/size errors gracefully
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
};

router.post('/', authenticateAdmin, uploadMiddleware, handleFileUpload);

export default router;

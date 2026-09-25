import { Router } from 'express';
import multer from 'multer';
import { uploadDocument } from './documentsController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'));
    }
  }
});

// Endpoint: POST /api/v1/profiles/:profile_id/documents/extract
router.post('/:profile_id/documents/extract', authenticate, upload.single('file'), uploadDocument);

export default router;

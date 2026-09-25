import { Router } from 'express';
import { 
  getGuidance, 
  startTracking, 
  updateTrackingState, 
  listTracking, 
  getTracking,
  updateChecklist
} from './guidanceController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/v1/schemes/:scheme_id/guidance
router.get('/schemes/:scheme_id/guidance', authenticate, getGuidance);

// POST /api/v1/applications
router.post('/applications', authenticate, startTracking);

// GET /api/v1/applications
router.get('/applications', authenticate, listTracking);

// GET /api/v1/applications/:tracking_id
router.get('/applications/:tracking_id', authenticate, getTracking);

// PATCH /api/v1/applications/:tracking_id
router.patch('/applications/:tracking_id', authenticate, updateTrackingState);

// POST /api/v1/applications/:tracking_id/checklist
router.post('/applications/:tracking_id/checklist', authenticate, updateChecklist);

export default router;

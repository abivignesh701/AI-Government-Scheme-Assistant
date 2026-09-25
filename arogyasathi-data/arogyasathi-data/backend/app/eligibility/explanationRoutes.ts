import { Router } from 'express';
import { getExplanations, getSchemeDetail } from './explanationController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/v1/profiles/:profile_id/explanations
router.get('/profiles/:profile_id/explanations', authenticate, getExplanations);

// GET /api/v1/schemes/:scheme_id
router.get('/schemes/:scheme_id', authenticate, getSchemeDetail);

export default router;

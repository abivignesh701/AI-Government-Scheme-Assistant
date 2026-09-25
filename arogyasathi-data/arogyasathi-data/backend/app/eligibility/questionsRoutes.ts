import { Router } from 'express';
import { getQuestionPlan, answerQuestion } from './questionsController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/v1/profiles/:profile_id/questions
router.get('/:profile_id/questions', authenticate, getQuestionPlan);

// POST /api/v1/profiles/:profile_id/questions/answer
router.post('/:profile_id/questions/answer', authenticate, answerQuestion);

export default router;

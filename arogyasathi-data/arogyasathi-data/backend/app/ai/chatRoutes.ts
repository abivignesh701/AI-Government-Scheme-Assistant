import { Router } from 'express';
import { handleChat } from './chatController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /api/v1/assistant/chat
router.post('/assistant/chat', authenticate, handleChat);

export default router;

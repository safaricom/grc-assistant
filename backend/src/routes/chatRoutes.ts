import { Router } from 'express';
import { sendChatMessage } from '../controllers/chatController';

const router = Router();

/**
 * POST /api/chat
 * Send a message to the chat API and get a response
 * Body: { message: string, session_id?: string, include_sources?: boolean }
 */
router.post('/', sendChatMessage);

export default router;

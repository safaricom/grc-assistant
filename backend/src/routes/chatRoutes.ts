import { Router } from 'express';
import { sendChatMessage, getChatSessions, getChatHistory, deleteChatSession } from '../controllers/chatController';

const router = Router();

/**
 * POST /api/chat
 * Send a message to the chat API and get a response
 * Body: { message: string, session_id?: string, include_sources?: boolean, session_title?: string }
 */
router.post('/', sendChatMessage);

/**
 * GET /api/chat/sessions
 * Get all chat sessions for the authenticated user
 */
router.get('/sessions', getChatSessions);

/**
 * GET /api/chat/history/:sessionId
 * Get all messages for a specific chat session
 */
router.get('/history/:sessionId', getChatHistory);

/**
 * DELETE /api/chat/session/:sessionId
 * Delete a chat session and all its messages
 */
router.delete('/session/:sessionId', deleteChatSession);

export default router;

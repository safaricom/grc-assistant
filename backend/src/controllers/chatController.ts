import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../lib/db';
import { chatSessions, chatMessages } from '../lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Cache for the Cognito access token
let cognitoAccessToken: string | null = null;
let tokenExpiryTime: number = 0;

const AUTH_HOST = process.env.AUTH_HOST || '';
const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const API_HOST = process.env.API_HOST || '';
const API_KEY = process.env.API_KEY || '';

/**
 * Get a valid Cognito access token, reusing cached token if not expired
 */
async function getCognitoAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid (with 60s buffer)
  if (cognitoAccessToken && tokenExpiryTime > now + 60000) {
    return cognitoAccessToken;
  }

  // Get new token
  try {
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      `${AUTH_HOST}/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`,
        },
      }
    );

    const token = response.data.access_token;
    if (!token) {
      throw new Error('No access token received from Cognito');
    }
    
    cognitoAccessToken = token;
    const expiresIn = response.data.expires_in || 3600; // Default 1 hour
    tokenExpiryTime = now + (expiresIn * 1000);

    console.log('Successfully obtained Cognito access token');
    return token;
  } catch (error) {
    console.error('Failed to get Cognito access token:', error);
    throw new Error('Failed to authenticate with Cognito');
  }
}

/**
 * POST /api/chat
 * Proxies chat requests to the external RAG API and saves conversation history
 */
export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, session_id, include_sources, session_title } = req.body;
    const userId = (req.user as any)?.id;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate environment variables
    if (!AUTH_HOST || !CLIENT_ID || !CLIENT_SECRET || !API_HOST || !API_KEY) {
      console.error('Missing required environment variables for chat API');
      return res.status(500).json({ 
        error: 'Chat service is not properly configured. Please check server environment variables.' 
      });
    }

    // Get or create session
    let sessionId = session_id;
    if (!sessionId) {
      // Create new session
      const newSession = await db.insert(chatSessions).values({
        userId,
        title: session_title || message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      }).returning();
      sessionId = newSession[0].id;
    } else {
      // Verify session belongs to user
      const session = await db.query.chatSessions.findFirst({
        where: and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, userId)
        ),
      });
      
      if (!session) {
        return res.status(403).json({ error: 'Session not found or access denied' });
      }
    }

    // Save user message
    await db.insert(chatMessages).values({
      sessionId,
      content: message,
      role: 'user',
    });

    // Get Cognito access token
    const accessToken = await getCognitoAccessToken();

    // Call the external chat API
    const chatResponse = await axios.post(
      `${API_HOST}/Sandbox/api/v1/chat`,
      {
        message,
        session_id: sessionId,
        include_sources: include_sources !== false, // Default to true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
        },
        timeout: 30000, // 30 second timeout for RAG processing
      }
    );

    // Extract assistant response
    const assistantMessage = chatResponse.data.response || chatResponse.data.message || 'No response';

    // Save assistant message
    await db.insert(chatMessages).values({
      sessionId,
      content: assistantMessage,
      role: 'assistant',
    });

    // Update session updated_at timestamp
    await db.update(chatSessions)
      .set({ updatedAt: new Date() })
      .where(eq(chatSessions.id, sessionId));

    // Return response with session info
    return res.json({
      ...chatResponse.data,
      session_id: sessionId,
    });
  } catch (error: any) {
    console.error('Chat API error:', error.response?.data || error.message);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ 
          error: 'Chat request timed out. Please try again.' 
        });
      }
      
      if (error.response) {
        // Forward error from external API
        return res.status(error.response.status).json({
          error: error.response.data?.error || error.response.data?.message || 'External API error',
          details: error.response.data,
        });
      }
      
      if (error.request) {
        return res.status(503).json({ 
          error: 'Unable to reach chat service. Please try again later.' 
        });
      }
    }

    return res.status(500).json({ 
      error: 'An error occurred while processing your message',
      details: error.message,
    });
  }
};

/**
 * GET /api/chat/sessions
 * Get all chat sessions for the authenticated user
 */
export const getChatSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const sessions = await db.query.chatSessions.findMany({
      where: eq(chatSessions.userId, userId),
      orderBy: [desc(chatSessions.updatedAt)],
      with: {
        messages: {
          limit: 1,
          orderBy: [desc(chatMessages.timestamp)],
        },
      },
    });

    return res.json(sessions);
  } catch (error: any) {
    console.error('Error fetching chat sessions:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch chat sessions',
      details: error.message,
    });
  }
};

/**
 * GET /api/chat/history/:sessionId
 * Get all messages for a specific chat session
 */
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify session belongs to user
    const session = await db.query.chatSessions.findFirst({
      where: and(
        eq(chatSessions.id, sessionId),
        eq(chatSessions.userId, userId)
      ),
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get all messages for this session
    const messages = await db.query.chatMessages.findMany({
      where: eq(chatMessages.sessionId, sessionId),
      orderBy: [chatMessages.timestamp],
    });

    return res.json({
      session,
      messages,
    });
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch chat history',
      details: error.message,
    });
  }
};

/**
 * DELETE /api/chat/session/:sessionId
 * Delete a chat session (cascade deletes messages)
 */
export const deleteChatSession = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify session belongs to user and delete
    const result = await db.delete(chatSessions)
      .where(and(
        eq(chatSessions.id, sessionId),
        eq(chatSessions.userId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting chat session:', error);
    return res.status(500).json({ 
      error: 'Failed to delete chat session',
      details: error.message,
    });
  }
};

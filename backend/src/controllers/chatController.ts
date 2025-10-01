import { Request, Response } from 'express';
import axios from 'axios';

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
 * Proxies chat requests to the external RAG API
 */
export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, session_id, include_sources } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Validate environment variables
    if (!AUTH_HOST || !CLIENT_ID || !CLIENT_SECRET || !API_HOST || !API_KEY) {
      console.error('Missing required environment variables for chat API');
      return res.status(500).json({ 
        error: 'Chat service is not properly configured. Please check server environment variables.' 
      });
    }

    // Get Cognito access token
    const accessToken = await getCognitoAccessToken();

    // Call the external chat API
    const chatResponse = await axios.post(
      `${API_HOST}/Sandbox/api/v1/chat`,
      {
        message,
        session_id: session_id || Date.now().toString(),
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

    // Return the response from the chat API
    return res.json(chatResponse.data);
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

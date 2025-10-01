export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  processing_time?: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface ChatHistoryResponse {
  session: ChatSession;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  message: string;
  session_id?: string;
  session_title?: string;
  include_sources?: boolean;
}

export interface SendMessageResponse {
  response: string;
  session_id: string;
  sources?: string[];
  processing_time?: number;
}
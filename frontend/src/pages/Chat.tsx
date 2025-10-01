import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { MessageInput } from "@/components/MessageInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { api } from "@/lib/api";
import type { Message, ChatSession } from "@/types/chat";

export default function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load chat sessions from backend on mount
  const loadSessions = useCallback(async () => {
    try {
      const data = await api.get('/chat/sessions');
      // Convert API response to display format
      const processed = data.map((session: any) => ({
        id: session.id,
        title: session.title,
        messages: session.messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.timestamp),
        })) || [],
        created_at: new Date(session.createdAt),
        updated_at: new Date(session.updatedAt),
      }));
      setSessions(processed);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      // Don't show error toast on initial load - might just be no sessions yet
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Load full chat history when a session is selected
  const loadSessionHistory = async (sessionId: string) => {
    try {
      const data = await api.get(`/chat/history/${sessionId}`);
      const messages: Message[] = data.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: new Date(msg.timestamp),
      }));

      const session: ChatSession = {
        id: data.session.id,
        title: data.session.title,
        messages,
        created_at: new Date(data.session.createdAt),
        updated_at: new Date(data.session.updatedAt),
      };

      setCurrentSession(session);

      // Update in sessions list
      setSessions(prev => prev.map(s => 
        s.id === session.id ? session : s
      ));
    } catch (error) {
      console.error('Failed to load session history:', error);
      toast({
        title: 'Failed to load chat history',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // Create new session if none exists
      let session = currentSession;
      if (!session) {
        session = {
          id: Date.now().toString(),
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          messages: [],
          created_at: new Date(),
          updated_at: new Date()
        };
        setCurrentSession(session);
        setSessions(prev => [session!, ...prev]);
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date()
      };

      const updatedSession = {
        ...session,
        messages: [...session.messages, userMessage],
        updated_at: new Date()
      };

      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === session!.id ? updatedSession : s));

      // Send message to backend (which will call RAG API and save to DB)
      console.log('Sending message to server proxy /api/chat');

      const data = await api.post('/chat', {
        message: content,
        session_id: session.id,
        session_title: session.id ? undefined : content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        include_sources: true
      });

      console.log('Chat response received:', { 
        responseLength: data.response?.length, 
        sources: data.sources?.length,
        processingTime: data.processing_time,
        sessionId: data.session_id
      });

      // If new session was created, reload sessions and load the new session
      if (!session.id || session.id === Date.now().toString()) {
        await loadSessions();
        await loadSessionHistory(data.session_id);
      } else {
        // Add assistant message for existing session
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          sources: data.sources,
          processing_time: data.processing_time
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, assistantMessage],
          updated_at: new Date()
        };

        setCurrentSession(finalSession as any);
        setSessions(prev => prev.map(s => s.id === session!.id ? finalSession as any : s));
      }

    } catch (error: unknown) {
      // Better error reporting: show server response or error message if available
      const messageText = error instanceof Error ? error.message : String(error) || 'Unknown error';
      console.error('sendMessage error:', error);

      // Network-level failure (CORS, DNS, network down) commonly shows as 'Failed to fetch'
      if (messageText.includes('Failed to fetch')) {
        const apiHost = import.meta.env.VITE_API_HOST;
        const apiKeyPresent = Boolean(import.meta.env.VITE_API_KEY);
        console.error('Network diagnostics:', {
          apiHost,
          apiKeyPresent,
          origin: window.location.origin,
        });

        toast({
          title: 'Network Error',
          description: `Failed to reach the chat API. Check network/CORS and that VITE_API_HOST is correct. See console for diagnostics.`,
          variant: 'destructive'
        });
      } else {
        toast({
          title: "Error sending message",
          description: messageText.includes('Failed to get response') ? `${messageText}` : `Failed to send message: ${messageText}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  const createNewChat = () => {
    // Clear current session to show welcome screen
    setMessage("");
    setCurrentSession(null);
  };

  const selectSession = async (session: ChatSession) => {
    // Load full history for the selected session
    await loadSessionHistory(session.id);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await api.delete(`/chat/session/${sessionId}`);
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }

      toast({
        title: "Chat Deleted",
        description: "Chat session has been deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: 'Failed to delete session',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title: newTitle } : s
    ));
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar 
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onNewChat={createNewChat}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onRenameSession={handleRenameSession}
      />

      <div className="flex-1 flex flex-col h-screen">
        {currentSession ? (
          <>
            <ChatMessages messages={currentSession.messages as any} isLoading={isLoading} />
            <MessageInput 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <WelcomeScreen onNewChat={createNewChat} />
            <MessageInput 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
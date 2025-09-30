import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { MessageInput } from "@/components/MessageInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import type { Message, ChatSession } from "@/types/chat";

export default function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load chat sessions from localStorage
    const savedSessions = localStorage.getItem('grc-chat-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions) as ChatSession[];
      const processed = parsed.map((session) => ({
        ...session,
        created_at: new Date(session.created_at),
        updated_at: new Date(session.updated_at),
        messages: session.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setSessions(processed);
    }
  }, []);

  useEffect(() => {
    // Save sessions to localStorage
    localStorage.setItem('grc-chat-sessions', JSON.stringify(sessions));
  }, [sessions]);

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

      // Send message to server-side proxy which will add credentials and call the chat API.
      console.log('Sending message to server proxy /api/chat');

      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: content,
          session_id: session.id,
          include_sources: true
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API response:', response.status, errorText);
        // Include server error message if present
        throw new Error(`Failed to get response: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Chat response received:', { 
        responseLength: data.response?.length, 
        sources: data.sources?.length,
        processingTime: data.processing_time_ms 
      });

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
        processing_time: data.processing_time_ms
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updated_at: new Date()
      };

      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === session!.id ? finalSession : s));

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
    // Reset message input and create/select a fresh session so the input area is shown
    setMessage("");

    // Create a new session and select it immediately
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    setCurrentSession(newSession);
    setSessions(prev => [newSession, ...prev]);

    toast({
      title: "New Chat Ready",
      description: "Connected to GRC Assistant. You can start asking questions."
    });
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
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
            <ChatMessages messages={currentSession.messages} isLoading={isLoading} />
            <MessageInput 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <WelcomeScreen onNewChat={createNewChat} />
        )}
      </div>
    </div>
  );
}
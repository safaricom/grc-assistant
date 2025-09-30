import { useState } from "react";
import { Plus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { ChatSession } from "@/types/chat";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
}

export function ChatSidebar({ sessions, currentSessionId, onNewChat, onSelectSession, onDeleteSession, onRenameSession }: ChatSidebarProps) {
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const { toast } = useToast();

  const startRename = (session: ChatSession) => {
    setEditingTitle(session.id);
    setTempTitle(session.title);
  };

  const saveRename = (sessionId: string) => {
    if (tempTitle.trim()) {
      onRenameSession(sessionId, tempTitle.trim());
    }
    setEditingTitle(null);
    setTempTitle("");
  };

  const cancelRename = () => {
    setEditingTitle(null);
    setTempTitle("");
  };

  const deleteSession = (sessionId: string) => {
    onDeleteSession(sessionId);
    toast({
      title: "Chat Deleted",
      description: "Chat session has been deleted successfully."
    });
  };

  const handleTestAPI = async () => {
    if (!import.meta.env.DEV) return;

    const apiHost = import.meta.env.VITE_API_HOST;
    if (!apiHost) {
      toast({ title: 'No API host', description: 'VITE_API_HOST is not set', variant: 'destructive' });
      return;
    }

    const url = `${apiHost.replace(/\/$/, '')}/Sandbox/api/v1/chat`;
    console.log('Testing CORS preflight to', url);

    try {
      const resp = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,x-api-key,authorization'
        },
        mode: 'cors'
      });

      console.log('Preflight response', resp.status, resp.headers);

      if (resp.ok) {
        toast({ title: 'Preflight OK', description: `Status ${resp.status}` });
      } else {
        const body = await resp.text().catch(() => 'no body');
        toast({ title: 'Preflight failed', description: `Status ${resp.status} - ${body}`, variant: 'destructive' });
      }
    } catch (err: unknown) {
      console.error('Preflight error', err);

      const apiHost = import.meta.env.VITE_API_HOST;
      console.error('Preflight diagnostics', { apiHost, origin: window.location.origin });

      toast({
        title: 'Preflight error',
        description: `Failed to reach ${url}. This is likely a network or CORS issue. Check that VITE_API_HOST is correct and that the server allows your origin. See console for diagnostics.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col sticky top-0 h-screen">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex space-x-2">
          <Button 
            onClick={onNewChat} 
            className="flex-1 bg-gradient-hero text-white shadow-glow hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          {import.meta.env.DEV && (
            <Button
              variant="ghost"
              onClick={handleTestAPI}
            >
              Test API
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {sessions.map((session) => (
              <Card 
                key={session.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  currentSessionId === session.id ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => onSelectSession(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {editingTitle === session.id ? (
                      <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(session.id);
                          if (e.key === 'Escape') cancelRename();
                        }}
                        onBlur={() => saveRename(session.id)}
                        className="h-6 text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p className="text-sm font-medium truncate">{session.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {session.messages.length} messages • {session.updated_at.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startRename(session)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteSession(session.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs mt-1">Start a new conversation to begin</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
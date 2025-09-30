import { KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  message, 
  onMessageChange, 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask about GRC policies, compliance, or risk management..." 
}: MessageInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-border p-6 flex-shrink-0 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="min-h-[60px] max-h-32 resize-none"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={onSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-gradient-hero text-white shadow-glow hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
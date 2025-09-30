import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNewChat: () => void;
}

export function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Start a New Conversation</h2>
        <p className="text-muted-foreground mb-6">
          Ask questions about GRC policies, compliance requirements, risk management, or any other governance-related topics.
        </p>
        <Button 
          onClick={onNewChat} 
          className="bg-gradient-hero text-white shadow-glow hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
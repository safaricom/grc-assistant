import { AlertTriangle, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "high" | "medium" | "low" | "info";
  timestamp: string;
  priority?: string;
}

interface AlertCardProps {
  alerts: Alert[];
  className?: string;
}

const alertStyles = {
  high: {
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20"
  },
  medium: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10", 
    border: "border-warning/20"
  },
  low: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/20"
  },
  info: {
    icon: Info,
    color: "text-muted-foreground",
    bg: "bg-muted/10",
    border: "border-muted/20"
  }
};

export function AlertCard({ alerts, className }: AlertCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span>Active Alerts & Notifications</span>
          <Badge variant="secondary" className="ml-2">
            {alerts.length}
          </Badge>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            View All Alerts
          </Button>
          <Button variant="ghost" size="sm">
            Alert Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Important updates and system notifications requiring your attention
        </p>
        
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = alertStyles[alert.type];
            const IconComponent = style.icon;
            
            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                  style.bg,
                  style.border
                )}
              >
                <div className={cn("p-1 rounded-full", style.bg)}>
                  <IconComponent className={cn("w-4 h-4", style.color)} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>{alert.timestamp}</span>
                    {alert.priority && (
                      <Badge variant="outline" className="text-xs">
                        {alert.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
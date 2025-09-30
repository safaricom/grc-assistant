import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "stable";
  };
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning", 
  danger: "text-danger",
  info: "text-info"
};

const trendStyles = {
  up: "text-success bg-success/10",
  down: "text-danger bg-danger/10", 
  stable: "text-muted-foreground bg-muted/50"
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  variant = "default",
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-elegant transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className={cn("text-2xl font-bold", variantStyles[variant])}>
                {value}
              </h3>
              {trend && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-medium", trendStyles[trend.direction])}
                >
                  {trend.direction === "up" ? "↗" : trend.direction === "down" ? "↘" : "→"} {trend.value}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "danger" && "bg-danger/10",
            variant === "info" && "bg-info/10",
            variant === "default" && "bg-primary/10"
          )}>
            <Icon className={cn("w-6 h-6", variantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
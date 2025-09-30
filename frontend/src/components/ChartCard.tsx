import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  timeframe?: string;
  children: React.ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ChartCard({ 
  title, 
  subtitle, 
  timeframe, 
  children, 
  actionButton,
  className 
}: ChartCardProps) {
  return (
    <Card className={cn("group hover:shadow-elegant transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {timeframe && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{timeframe}</span>
            </Badge>
          )}
          
          {actionButton && (
            <Button variant="ghost" size="sm" onClick={actionButton.onClick}>
              {actionButton.label}
            </Button>
          )}
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

// Simple chart components for demonstration
export function DonutChart({ data, className }: { data: any[], className?: string }) {
  return (
    <div className={cn("flex items-center justify-center h-64", className)}>
      <div className="relative">
        {/* Simplified donut chart representation */}
        <div className="w-32 h-32 rounded-full border-[20px] border-muted relative">
          <div className="absolute inset-0 rounded-full border-[20px] border-success border-b-transparent border-l-transparent transform rotate-45"></div>
          <div className="absolute inset-0 rounded-full border-[20px] border-warning border-t-transparent border-r-transparent transform rotate-180"></div>
          <div className="absolute inset-0 rounded-full border-[20px] border-info border-b-transparent border-l-transparent transform rotate-270"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">94%</div>
            <div className="text-xs text-muted-foreground">Compliant</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="ml-8 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full", 
              index === 0 && "bg-success",
              index === 1 && "bg-warning", 
              index === 2 && "bg-info",
              index === 3 && "bg-muted"
            )}></div>
            <span className="text-sm text-foreground">{item.name}</span>
            <span className="text-sm text-muted-foreground">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ className }: { className?: string }) {
  return (
    <div className={cn("h-64 flex items-end justify-center space-x-1 px-4", className)}>
      {/* Simplified line chart representation */}
      <svg viewBox="0 0 300 150" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--success))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <polyline
          points="20,120 60,100 100,80 140,60 180,40 220,30 260,20"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="260" cy="20" r="4" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
}

export function GaugeChart({ value = 85, className }: { value?: number, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-64", className)}>
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute inset-0 border-[12px] border-muted rounded-t-full"></div>
        
        {/* Gauge fill */}
        <div 
          className="absolute inset-0 border-[12px] border-transparent border-t-success rounded-t-full transition-all duration-1000"
          style={{ 
            clipPath: `polygon(0 100%, ${value}% 100%, ${value}% 0, 0 0)` 
          }}
        ></div>
        
        {/* Center value */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-3xl font-bold text-foreground">{value}%</div>
          <div className="text-sm text-muted-foreground">Risk Score</div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-muted-foreground">Low Risk</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span className="text-muted-foreground">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-danger rounded-full"></div>
          <span className="text-muted-foreground">High Risk</span>
        </div>
      </div>
    </div>
  );
}
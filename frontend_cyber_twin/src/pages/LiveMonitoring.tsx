import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Shield, Wifi, Pause, Play } from "lucide-react";

const LiveMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const realTimeEvents = [
    {
      id: 1,
      type: "threat_detected",
      message: "Suspicious login attempt from unknown IP",
      source: "Technology → IT Infrastructure",
      severity: "high",
      timestamp: "13:45:32"
    },
    {
      id: 2,
      type: "system_alert",
      message: "Server utilization exceeded 90% threshold",
      source: "Thika Technology Hub",
      severity: "medium",
      timestamp: "13:44:18"
    },
    {
      id: 3,
      type: "security_scan",
      message: "Automated security scan completed successfully",
      source: "All Data Centers",
      severity: "low",
      timestamp: "13:43:45"
    },
    {
      id: 4,
      type: "threat_blocked",
      message: "Malicious traffic blocked at network perimeter",
      source: "Commercial → Customer Care",
      severity: "medium",
      timestamp: "13:42:12"
    },
    {
      id: 5,
      type: "user_activity",
      message: "Privileged user access granted for maintenance",
      source: "Financial Services → M-PESA Operations",
      severity: "low",
      timestamp: "13:41:38"
    }
  ];

  const systemMetrics = [
    { name: "Network Traffic", value: "2.4 Gbps", status: "normal", trend: "+5%" },
    { name: "Active Sessions", value: "145,892", status: "normal", trend: "+2%" },
    { name: "Threat Blocks", value: "1,247", status: "elevated", trend: "+12%" },
    { name: "System Load", value: "67%", status: "normal", trend: "-3%" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-500";
      case "elevated": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Live Monitoring</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isMonitoring ? "secondary" : "outline"} className="flex items-center space-x-1">
            <Wifi className="h-3 w-3" />
            <span>{isMonitoring ? "Live" : "Paused"}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{metric.name}</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`text-sm ${getStatusColor(metric.status)}`}>
                    {metric.trend}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Real-time Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {realTimeEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="mt-1">
                  {event.type === "threat_detected" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {event.type === "threat_blocked" && <Shield className="h-4 w-4 text-green-500" />}
                  {event.type === "system_alert" && <Activity className="h-4 w-4 text-orange-500" />}
                  {event.type === "security_scan" && <Shield className="h-4 w-4 text-blue-500" />}
                  {event.type === "user_activity" && <Activity className="h-4 w-4 text-gray-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.message}</p>
                    <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                      {event.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.source} • {event.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">Firewall Status</div>
                  <div className="text-sm text-muted-foreground">All firewalls operational</div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">Intrusion Detection</div>
                  <div className="text-sm text-muted-foreground">12 threats blocked in last hour</div>
                </div>
                <Badge variant="secondary">Monitoring</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">Vulnerability Scanner</div>
                  <div className="text-sm text-muted-foreground">Next scan in 2 hours</div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">Backup Systems</div>
                  <div className="text-sm text-muted-foreground">All backups current</div>
                </div>
                <Badge variant="secondary">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMonitoring;
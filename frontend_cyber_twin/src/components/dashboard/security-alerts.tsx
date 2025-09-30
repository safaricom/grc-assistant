import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, ExternalLink } from "lucide-react"

const alertsData = [
  {
    id: 1,
    type: "Unauthorized Access Attempt",
    division: "Financial Services",
    team: "M-PESA Operations",
    location: "Limuru Data Center",
    severity: "critical",
    time: "2 minutes ago",
    description: "Multiple failed login attempts detected"
  },
  {
    id: 2,
    type: "Network Anomaly",
    division: "Technology",
    team: "Network Operations",
    location: "Safaricom House",
    severity: "high",
    time: "5 minutes ago",
    description: "Unusual traffic pattern detected"
  },
  {
    id: 3,
    type: "Data Backup Failure",
    division: "Technology",
    team: "Data Management",
    location: "Thika Data Center",
    severity: "medium",
    time: "12 minutes ago",
    description: "Automated backup process failed"
  },
  {
    id: 4,
    type: "Phishing Email Campaign",
    division: "Commercial",
    team: "Customer Care",
    location: "Multiple Locations",
    severity: "high",
    time: "18 minutes ago",
    description: "Targeted phishing emails detected"
  },
  {
    id: 5,
    type: "VPN Connection Issues",
    division: "Human Resources",
    team: "HR Operations",
    location: "Remote Workers",
    severity: "medium",
    time: "25 minutes ago",
    description: "Multiple VPN disconnections"
  }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    case "high": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
    case "medium": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    case "low": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export function SecurityAlerts() {
  return (
    <Card className="card-cyber">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Recent Security Alerts
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertsData.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start space-x-4 p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{alert.type}</h3>
                  <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                    {alert.severity}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{alert.division}</span>
                  <span className="mx-2">→</span>
                  <span>{alert.team}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.location}</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.time}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
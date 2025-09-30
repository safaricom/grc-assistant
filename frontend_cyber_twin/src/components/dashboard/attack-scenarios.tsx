import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, DollarSign, Users, Network, Database, Store, Building } from "lucide-react"

const scenariosData = [
  {
    id: 1,
    title: "M-PESA Transaction Fraud",
    target: "Financial Services → M-PESA Operations",
    impact: "$2.8M loss, 285K agents affected",
    severity: "critical",
    icon: DollarSign,
    probability: "High",
    mitigation: "Real-time fraud detection enabled"
  },
  {
    id: 2,
    title: "Network Infrastructure Attack",
    target: "Technology → Network Operations", 
    impact: "12M subscribers, network outage",
    severity: "critical",
    icon: Network,
    probability: "Medium",
    mitigation: "Redundant systems deployed"
  },
  {
    id: 3,
    title: "Customer Data Breach",
    target: "Commercial → Customer Care",
    impact: "29M customer records exposed",
    severity: "high",
    icon: Database,
    probability: "Medium",
    mitigation: "Data encryption upgraded"
  },
  {
    id: 4,
    title: "Government Services Attack",
    target: "Gov & Regulatory → Gov Solutions",
    impact: "National security risk",
    severity: "critical",
    icon: Building,
    probability: "Low",
    mitigation: "Enhanced monitoring active"
  },
  {
    id: 5,
    title: "Retail Store POS Breach",
    target: "Commercial → Retail Operations",
    impact: "850 stores affected",
    severity: "medium",
    icon: Store,
    probability: "Medium",
    mitigation: "POS security patches applied"
  },
  {
    id: 6,
    title: "Enterprise Services Compromise",
    target: "Commercial → Enterprise Solutions",
    impact: "B2B service disruption",
    severity: "medium",
    icon: Users,
    probability: "Low",
    mitigation: "Access controls reviewed"
  }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return {
      badge: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      border: "border-red-500/20",
      bg: "bg-red-500/5"
    }
    case "high": return {
      badge: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      border: "border-orange-500/20",
      bg: "bg-orange-500/5"
    }
    case "medium": return {
      badge: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      border: "border-yellow-500/20",
      bg: "bg-yellow-500/5"
    }
    default: return {
      badge: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
      border: "border-gray-500/20",
      bg: "bg-gray-500/5"
    }
  }
}

export function AttackScenarios() {
  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
          Attack Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenariosData.map((scenario) => {
            const IconComponent = scenario.icon
            const severityStyles = getSeverityColor(scenario.severity)
            
            return (
              <div 
                key={scenario.id}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${severityStyles.border} ${severityStyles.bg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <Badge className={severityStyles.badge} variant="secondary">
                      {scenario.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm leading-tight">{scenario.title}</h3>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium">{scenario.target}</span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Impact: </span>
                      <span className="font-medium text-red-500">{scenario.impact}</span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Probability: </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          scenario.probability === 'High' ? 'border-red-500/50 text-red-500' :
                          scenario.probability === 'Medium' ? 'border-yellow-500/50 text-yellow-500' :
                          'border-green-500/50 text-green-500'
                        }`}
                      >
                        {scenario.probability}
                      </Badge>
                    </div>
                    
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Mitigation: </span>
                      <span className="font-medium text-green-600">{scenario.mitigation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
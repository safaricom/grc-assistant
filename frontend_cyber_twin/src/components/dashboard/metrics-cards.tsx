import { Users, AlertTriangle, CreditCard, Shield, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const metricsData = [
  {
    title: "Total Employees",
    value: "15,822",
    change: "+2.1%",
    changeType: "increase" as const,
    icon: Users,
    description: "Active users monitored",
    color: "primary"
  },
  {
    title: "Active Threats",
    value: "34",
    change: "-15%",
    changeType: "decrease" as const,
    icon: AlertTriangle,
    description: "Current security incidents",
    color: "danger"
  },
  {
    title: "M-PESA Daily Txns",
    value: "45M",
    change: "+8.2%",
    changeType: "increase" as const,
    icon: CreditCard,
    description: "Transaction volume today",
    color: "primary"
  },
  {
    title: "Security Coverage",
    value: "94.2%",
    change: "+1.1%",
    changeType: "increase" as const,
    icon: Shield,
    description: "Infrastructure protected",
    color: "success"
  }
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon
        const isPositiveChange = metric.changeType === "increase"
        const isSuccess = metric.color === "success"
        const isDanger = metric.color === "danger"
        
        return (
          <Card 
            key={metric.title} 
            className={`card-cyber hover:shadow-cyber-hover transition-all duration-300 ${
              index === 0 ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' : ''
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${
                isDanger ? 'bg-red-500/10' : 
                isSuccess ? 'bg-green-500/10' : 
                'bg-primary/10'
              }`}>
                <IconComponent className={`h-4 w-4 ${
                  isDanger ? 'text-red-500' : 
                  isSuccess ? 'text-green-500' : 
                  'text-primary'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                  <Badge 
                    variant={isPositiveChange ? "default" : "secondary"}
                    className={`text-xs ${
                      isPositiveChange 
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                        : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    }`}
                  >
                    {isPositiveChange ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
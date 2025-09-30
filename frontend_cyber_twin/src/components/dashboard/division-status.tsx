import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const divisionData = [
  {
    name: "Financial Services",
    head: "Sitoyo Lopokoiyit",
    employees: 3500,
    threatLevel: "low",
    status: "secure",
    incidents: 2
  },
  {
    name: "Technology",
    head: "Kris Senanu",
    employees: 2800,
    threatLevel: "medium",
    status: "monitoring",
    incidents: 8
  },
  {
    name: "Commercial",
    head: "Rita Okuthe",
    employees: 4200,
    threatLevel: "low",
    status: "secure",
    incidents: 1
  },
  {
    name: "Finance",
    head: "Dilip Pal",
    employees: 850,
    threatLevel: "high",
    status: "alert",
    incidents: 12
  },
  {
    name: "Human Resources",
    head: "Grace Githaiga",
    employees: 420,
    threatLevel: "low",
    status: "secure",
    incidents: 0
  },
  {
    name: "Government & Regulatory",
    head: "Steve Chege",
    employees: 180,
    threatLevel: "medium",
    status: "monitoring",
    incidents: 3
  }
]

const getThreatColor = (level: string) => {
  switch (level) {
    case "low": return "bg-green-500"
    case "medium": return "bg-yellow-500"
    case "high": return "bg-red-500"
    default: return "bg-gray-500"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "secure": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "monitoring": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    case "alert": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export function DivisionStatus() {
  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Division Security Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {divisionData.map((division) => (
            <div 
              key={division.name}
              className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors cursor-pointer bg-card/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getThreatColor(division.threatLevel)}`} />
                  <h3 className="font-medium text-sm">{division.name}</h3>
                </div>
                <Badge className={getStatusBadge(division.status)} variant="secondary">
                  {division.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {division.head.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{division.head}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Employees:</span>
                  <span className="font-medium">{division.employees.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active Incidents:</span>
                  <span className={`font-medium ${
                    division.incidents > 5 ? 'text-red-500' : 
                    division.incidents > 0 ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {division.incidents}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
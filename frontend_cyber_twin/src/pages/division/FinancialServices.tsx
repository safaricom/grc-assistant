import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, AlertTriangle, Shield, TrendingUp } from "lucide-react";

const FinancialServices = () => {
  const divisionData = {
    name: "Financial Services",
    head: "Sitoyo Lopokoiyit",
    employees: 3500,
    threatLevel: "medium",
    coverage: 98.5,
    activeThreats: 12,
    incidents: 3
  };

  const teams = [
    {
      name: "M-PESA Operations",
      lead: "John Kiprotich",
      members: 1200,
      threats: 8,
      coverage: 99.2,
      status: "critical"
    },
    {
      name: "KCB M-PESA",
      lead: "Sarah Wanjiku",
      members: 450,
      threats: 2,
      coverage: 97.8,
      status: "normal"
    },
    {
      name: "Digital Financial Services",
      lead: "Michael Ochieng",
      members: 800,
      threats: 1,
      coverage: 98.9,
      status: "normal"
    },
    {
      name: "Banking Partnerships",
      lead: "Grace Mueni",
      members: 1050,
      threats: 1,
      coverage: 98.1,
      status: "warning"
    }
  ];

  const metrics = [
    { name: "Daily Transactions", value: "45.2M", change: "+2.3%", trend: "up" },
    { name: "Transaction Value", value: "KSh 892B", change: "+5.1%", trend: "up" },
    { name: "Active Agents", value: "285,247", change: "+1.8%", trend: "up" },
    { name: "System Uptime", value: "99.94%", change: "+0.02%", trend: "up" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "warning": return "default";
      case "normal": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{divisionData.name}</h1>
        </div>
        <Badge variant={getStatusColor(divisionData.threatLevel)}>
          {divisionData.threatLevel} risk
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Division Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{divisionData.employees.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <Users className="h-3 w-3 mr-1" />
              Total Employees
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{divisionData.activeThreats}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Active Threats
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{divisionData.incidents}</div>
            <div className="text-sm text-muted-foreground">
              Security Incidents
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{divisionData.coverage}%</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <Shield className="h-3 w-3 mr-1" />
              Security Coverage
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{metric.name}</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-sm text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Security Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teams.map((team) => (
            <div key={team.name} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-muted-foreground">
                  Led by {team.lead} • {team.members.toLocaleString()} members
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-orange-500">{team.threats}</div>
                  <div className="text-xs text-muted-foreground">Threats</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-green-500">{team.coverage}%</div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                </div>
                <Badge variant={getStatusColor(team.status)}>
                  {team.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialServices;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, Users, AlertTriangle, Shield, Server } from "lucide-react";

const Technology = () => {
  const divisionData = {
    name: "Technology",
    head: "Cynthia Kropac",
    employees: 2800,
    threatLevel: "high",
    coverage: 99.2,
    activeThreats: 18,
    incidents: 1
  };

  const teams = [
    {
      name: "Network Operations",
      lead: "David Kimani",
      members: 850,
      threats: 12,
      coverage: 99.8,
      status: "critical"
    },
    {
      name: "IT Infrastructure",
      lead: "Alice Mutindi",
      members: 600,
      threats: 4,
      coverage: 98.5,
      status: "warning"
    },
    {
      name: "Software Development",
      lead: "Robert Omondi",
      members: 750,
      threats: 1,
      coverage: 99.1,
      status: "normal"
    },
    {
      name: "Cybersecurity",
      lead: "Mary Wanjiru",
      members: 600,
      threats: 1,
      coverage: 99.9,
      status: "normal"
    }
  ];

  const metrics = [
    { name: "Network Uptime", value: "99.97%", status: "excellent" },
    { name: "Active Servers", value: "1,056", status: "normal" },
    { name: "Data Processed", value: "847 TB", status: "normal" },
    { name: "Security Scans", value: "24/7", status: "active" }
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
          <Cpu className="h-6 w-6 text-primary" />
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
                <div className="text-2xl font-bold">{metric.value}</div>
                <Badge variant="secondary">{metric.status}</Badge>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Infrastructure Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Data Center Load</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Network Capacity</span>
                <span>64%</span>
              </div>
              <Progress value={64} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Technology;
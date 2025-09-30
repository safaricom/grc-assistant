import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Users, Activity, Eye } from "lucide-react";

const DivisionSecurity = () => {
  const divisions = [
    {
      name: "Financial Services",
      head: "Sitoyo Lopokoiyit",
      employees: 3500,
      activeThreats: 12,
      incidents: 3,
      coverage: 98.5,
      lastUpdate: "2 mins ago",
      status: "critical"
    },
    {
      name: "Technology", 
      head: "Cynthia Kropac",
      employees: 2800,
      activeThreats: 18,
      incidents: 1,
      coverage: 99.2,
      lastUpdate: "1 min ago",
      status: "high"
    },
    {
      name: "Commercial",
      head: "Peter Ndegwa", 
      employees: 4200,
      activeThreats: 5,
      incidents: 0,
      coverage: 95.8,
      lastUpdate: "5 mins ago",
      status: "normal"
    },
    {
      name: "Finance",
      head: "Dilip Pal",
      employees: 850,
      activeThreats: 2,
      incidents: 0,
      coverage: 97.1,
      lastUpdate: "3 mins ago", 
      status: "normal"
    },
    {
      name: "Human Resources",
      head: "Susan Mudhune",
      employees: 420,
      activeThreats: 1,
      incidents: 0,
      coverage: 94.3,
      lastUpdate: "8 mins ago",
      status: "normal"
    },
    {
      name: "Government & Regulatory",
      head: "Stephen Chege",
      employees: 180,
      activeThreats: 4,
      incidents: 1,
      coverage: 96.7,
      lastUpdate: "4 mins ago",
      status: "warning"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "high": return "destructive"; 
      case "warning": return "default";
      case "normal": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "warning": return <Shield className="h-4 w-4" />;
      case "normal": return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Division Security</h1>
        </div>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Real-time Monitoring
        </Button>
      </div>

      <div className="grid gap-6">
        {divisions.map((division) => (
          <Card key={division.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{division.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(division.status)} className="flex items-center space-x-1">
                    {getStatusIcon(division.status)}
                    <span>{division.status}</span>
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Head: {division.head} • Last update: {division.lastUpdate}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{division.employees.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center">
                    <Users className="h-3 w-3 mr-1" />
                    Employees
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{division.activeThreats}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Active Threats
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${division.incidents > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {division.incidents}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Security Incidents
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{division.coverage}%</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Coverage
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DivisionSecurity;
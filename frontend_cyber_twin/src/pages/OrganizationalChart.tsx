import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Shield } from "lucide-react";

const OrganizationalChart = () => {
  const divisions = [
    {
      name: "Financial Services",
      head: "Sitoyo Lopokoiyit",
      employees: 3500,
      teams: ["M-PESA Operations", "KCB M-PESA", "Digital Financial Services", "Banking Partnerships"],
      threatLevel: "medium"
    },
    {
      name: "Technology",
      head: "Cynthia Kropac",
      employees: 2800,
      teams: ["Network Operations", "IT Infrastructure", "Software Development", "Cybersecurity"],
      threatLevel: "high"
    },
    {
      name: "Commercial",
      head: "Peter Ndegwa",
      employees: 4200,
      teams: ["Customer Care", "Retail Operations", "Enterprise Solutions", "Marketing"],
      threatLevel: "low"
    },
    {
      name: "Finance",
      head: "Dilip Pal",
      employees: 850,
      teams: ["Financial Planning", "Revenue Assurance", "Procurement", "Internal Audit"],
      threatLevel: "low"
    },
    {
      name: "Human Resources",
      head: "Susan Mudhune",
      employees: 420,
      teams: ["Talent Acquisition", "Employee Relations", "Learning & Development", "Compensation"],
      threatLevel: "low"
    },
    {
      name: "Government & Regulatory",
      head: "Stephen Chege",
      employees: 180,
      teams: ["Regulatory Affairs", "Government Relations", "Compliance", "Legal"],
      threatLevel: "medium"
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Organizational Chart</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {divisions.map((division) => (
          <Card key={division.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{division.name}</CardTitle>
                <Badge variant={getThreatColor(division.threatLevel)}>
                  {division.threatLevel} risk
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{division.employees.toLocaleString()} employees</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Division Head</h4>
                <p className="text-sm text-muted-foreground">{division.head}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Key Teams</h4>
                <div className="flex flex-wrap gap-1">
                  {division.teams.map((team) => (
                    <Badge key={team} variant="outline" className="text-xs">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15,950</div>
              <div className="text-sm text-muted-foreground">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <div className="text-sm text-muted-foreground">High Risk Divisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">94.2%</div>
              <div className="text-sm text-muted-foreground">Security Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalChart;
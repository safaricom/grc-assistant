import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, MapPin, Activity, Zap, Thermometer, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataCenter {
  id: number;
  name: string;
  location: string;
  servers: number;
  utilization: number;
  uptime: number;
  temperature: number;
  power: number;
  status: string;
  teams: string[];
}

const DataCenters = () => {
  const [dataCenters, setDataCenters] = useState<DataCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataCenters = async () => {
      try {
        setLoading(true);
        setError(null);

  // Use relative API base by default so the frontend can proxy to the backend
  // when served from the frontend container (Nginx proxies /api -> backend:3000).
  const response = await fetch(`${API_BASE}/api/datacenters`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch data centers');
        }

        setDataCenters(result.data || []);
      } catch (err) {
        console.error('Error fetching data centers:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data centers');
      } finally {
        setLoading(false);
      }
    };

    fetchDataCenters();
  }, []);

  // Calculate summary statistics
  const totalServers = dataCenters.reduce((sum, dc) => sum + dc.servers, 0);
  const averageUptime = dataCenters.length > 0
    ? dataCenters.reduce((sum, dc) => sum + dc.uptime, 0) / dataCenters.length
    : 0;
  const averageUtilization = dataCenters.length > 0
    ? dataCenters.reduce((sum, dc) => sum + dc.utilization, 0) / dataCenters.length
    : 0;
  const averageTemperature = dataCenters.length > 0
    ? dataCenters.reduce((sum, dc) => sum + dc.temperature, 0) / dataCenters.length
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "secondary";
      case "warning": return "default";
      case "critical": return "destructive";
      default: return "secondary";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-500";
    if (utilization >= 75) return "text-orange-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Data Centers</h1>
          </div>
          <Button disabled>
            <Activity className="h-4 w-4 mr-2" />
            Live Monitoring
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading data centers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Data Centers</h1>
          </div>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Live Monitoring
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Data Centers</h1>
        </div>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Live Monitoring
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalServers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Servers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{averageUptime.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Average Uptime</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{averageUtilization.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Utilization</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{averageTemperature.toFixed(1)}°C</div>
              <div className="text-sm text-muted-foreground">Avg Temperature</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {dataCenters.length === 0 ? (
        <div className="text-center py-8">
          <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No data centers found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {dataCenters.map((dc) => (
            <Card key={dc.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{dc.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {dc.location}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(dc.status)}>
                    {dc.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{dc.servers}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center">
                      <Server className="h-3 w-3 mr-1" />
                      Servers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getUtilizationColor(dc.utilization)}`}>
                      {dc.utilization}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Utilization
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-500">{dc.uptime}%</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Uptime
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-500">{dc.temperature}°C</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center">
                      <Thermometer className="h-3 w-3 mr-1" />
                      Temperature
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Power Usage</span>
                    <span>{dc.power}%</span>
                  </div>
                  <Progress value={dc.power} className="h-2" />
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">Assigned Teams</h4>
                  <div className="flex flex-wrap gap-1">
                    {dc.teams.map((team) => (
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
      )}
    </div>
  );
};

export default DataCenters;
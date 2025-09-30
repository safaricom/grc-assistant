import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const dataCenterData = [
  {
    name: "Limuru",
    servers: 245,
    utilization: 78,
    team: "Core Banking"
  },
  {
    name: "Safaricom House",
    servers: 189,
    utilization: 82,
    team: "Customer Systems"
  },
  {
    name: "Thika",
    servers: 156,
    utilization: 65,
    team: "M-PESA Platform"
  },
  {
    name: "Kisumu",
    servers: 98,
    utilization: 71,
    team: "Regional Services"
  },
  {
    name: "Arena",
    servers: 134,
    utilization: 88,
    team: "Enterprise Services"
  }
]

export function DataCenterChart() {
  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Data Center Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Server utilization across facilities</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataCenterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                color: "hsl(var(--card-foreground))"
              }}
              formatter={(value, name) => [
                name === 'servers' ? `${value} servers` : `${value}%`,
                name === 'servers' ? 'Server Count' : 'Utilization'
              ]}
              labelFormatter={(label) => `${label} Data Center`}
            />
            <Bar 
              dataKey="servers" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              name="servers"
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {dataCenterData.map((center, index) => (
            <div key={center.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium">{center.name}</span>
                <span className="text-muted-foreground">→ {center.team}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">{center.servers} servers</span>
                <span className={`font-medium ${
                  center.utilization > 85 ? 'text-red-500' :
                  center.utilization > 75 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {center.utilization}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
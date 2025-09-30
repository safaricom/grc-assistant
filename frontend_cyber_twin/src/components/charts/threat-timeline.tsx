import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const threatTimelineData = [
  {
    day: "Mon",
    malware: 12,
    phishing: 8,
    unauthorized: 5,
    ddos: 2
  },
  {
    day: "Tue", 
    malware: 15,
    phishing: 12,
    unauthorized: 7,
    ddos: 3
  },
  {
    day: "Wed",
    malware: 9,
    phishing: 6,
    unauthorized: 4,
    ddos: 1
  },
  {
    day: "Thu",
    malware: 18,
    phishing: 14,
    unauthorized: 9,
    ddos: 4
  },
  {
    day: "Fri",
    malware: 22,
    phishing: 16,
    unauthorized: 11,
    ddos: 6
  },
  {
    day: "Sat",
    malware: 8,
    phishing: 5,
    unauthorized: 3,
    ddos: 1
  },
  {
    day: "Sun",
    malware: 6,
    phishing: 4,
    unauthorized: 2,
    ddos: 0
  }
]

export function ThreatTimeline() {
  return (
    <Card className="card-cyber">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">7-Day Threat Timeline</CardTitle>
        <p className="text-sm text-muted-foreground">Security incidents by type</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={threatTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
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
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="malware" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              name="Malware"
            />
            <Line 
              type="monotone" 
              dataKey="phishing" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
              name="Phishing"
            />
            <Line 
              type="monotone" 
              dataKey="unauthorized" 
              stroke="#eab308" 
              strokeWidth={2}
              dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
              name="Unauthorized Access"
            />
            <Line 
              type="monotone" 
              dataKey="ddos" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              name="DDoS Attempts"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
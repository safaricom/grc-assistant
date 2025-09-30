import { Shield, FileCheck, AlertTriangle, Clock, TrendingUp, Home } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { ChartCard, DonutChart, LineChart, GaugeChart } from "@/components/ChartCard";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const alerts = [
    {
      id: "1",
      title: "Policy Review Due for Data Privacy Policy",
      description: "Annual review required by compliance team within 5 days",
      type: "high" as const,
      timestamp: "19/09/2025, 16:45:32",
      priority: "HIGH PRIORITY"
    },
    {
      id: "2", 
      title: "New GDPR Update Available",
      description: "Regulatory changes require policy updates and staff training",
      type: "medium" as const,
      timestamp: "18/09/2025, 14:22:10",
      priority: "MEDIUM PRIORITY"
    }
  ];

  const policyData = [
    { name: "HR Policies", value: "23" },
    { name: "IT Security", value: "18" },
    { name: "Data Privacy", value: "12" },
    { name: "Financial", value: "8" }
  ];

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white shadow-glow">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Good Afternoon!</h1>
            </div>
            <p className="text-lg text-white/90 max-w-md">
              Optimize Your GRC Operations with AI Insights
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: 16:45:32</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>3/6 Equipment Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>27% Current</span>
              </div>
            </div>
            
            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Active Policies</span>
                </div>
                <div className="text-2xl font-bold">47</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Open Risks</span>
                </div>
                <div className="text-2xl font-bold">12</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Compliance Status</span>
                </div>
                <div className="text-2xl font-bold">94%</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Pending Tasks</span>
                </div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block text-right">
            <div className="text-6xl font-bold mb-2">19</div>
            <div className="text-lg">September 2025</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <AlertCard alerts={alerts} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Policies Active"
          value="47"
          subtitle="+3.5% from last month"
          trend={{ value: "+5", direction: "up" }}
          icon={Shield}
          variant="success"
        />
        
        <MetricCard
          title="Risk Assessment Score"
          value="94%"
          subtitle="Excellent condition"
          trend={{ value: "+2%", direction: "up" }}
          icon={TrendingUp}
          variant="success"
        />
        
        <MetricCard
          title="Compliance Rate"
          value="97%"
          subtitle="3/97 operational"
          trend={{ value: "0%", direction: "stable" }}
          icon={FileCheck}
          variant="info"
        />
        
        <MetricCard
          title="Critical Alerts"
          value="3"
          subtitle="Requiring immediate attention"
          trend={{ value: "-1", direction: "down" }}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Policy Compliance Overview"
          subtitle="Distribution across policy categories"
          timeframe="September 2024"
          actionButton={{
            label: "View Details",
            onClick: () => console.log("View policy details")
          }}
        >
          <DonutChart data={policyData} />
        </ChartCard>
        
        <ChartCard
          title="Risk Trend Analysis"
          subtitle="Risk monitoring over time"
          timeframe="Last 7 days"
          className="lg:row-span-1"
        >
          <LineChart />
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <ChartCard
        title="GRC Performance Metrics"
        subtitle="Overall system health and compliance status"
        timeframe="Real-time"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Risk Level Assessment</h4>
            <GaugeChart value={85} />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">System Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">pH Level:</span>
                <Badge variant="secondary">6.8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Temperature:</span>
                <Badge variant="secondary">22°C</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users:</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Status Indicators</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-foreground">Policy Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-foreground">Risk Assessments</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-foreground">Audit Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>
    </main>
  );
};

export default Index;

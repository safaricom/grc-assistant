import { Layout } from "@/components/layout/layout"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { DivisionStatus } from "@/components/dashboard/division-status"
import { SecurityAlerts } from "@/components/dashboard/security-alerts"
import { AttackScenarios } from "@/components/dashboard/attack-scenarios"
import { DataCenterChart } from "@/components/charts/data-center-chart"
import { ThreatTimeline } from "@/components/charts/threat-timeline"

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground">
            Monitor and secure Safaricom's digital infrastructure in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live Status</span>
          </div>
          <span>•</span>
          <span>Last updated: 30 seconds ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <MetricsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Division Status */}
        <div className="lg:col-span-2">
          <DivisionStatus />
        </div>
        
        {/* Right Column - Security Alerts */}
        <div className="lg:col-span-1">
          <SecurityAlerts />
        </div>
      </div>

      {/* Attack Scenarios */}
      <AttackScenarios />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCenterChart />
        <ThreatTimeline />
      </div>
    </div>
  );
};

export default Index;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Shield, Activity, Users, Database, Zap } from "lucide-react";

const SOCSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">SOC Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Alert Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-alerts">Critical Alerts</Label>
              <Switch id="critical-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="high-priority-alerts">High Priority Alerts</Label>
              <Switch id="high-priority-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="medium-alerts">Medium Priority Alerts</Label>
              <Switch id="medium-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="low-alerts">Low Priority Alerts</Label>
              <Switch id="low-alerts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Alert Threshold (per hour)</Label>
              <Input id="alert-threshold" type="number" defaultValue="50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Monitoring Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monitoring-interval">Monitoring Interval</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="real-time-monitoring">Real-time Monitoring</Label>
              <Switch id="real-time-monitoring" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="automated-scanning">Automated Vulnerability Scanning</Label>
              <Switch id="automated-scanning" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scan-frequency">Scan Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-size">SOC Team Size</Label>
              <Input id="team-size" type="number" defaultValue="12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift-rotation">Shift Rotation</Label>
              <Select defaultValue="24-7">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24-7">24/7 Coverage</SelectItem>
                  <SelectItem value="business-hours">Business Hours</SelectItem>
                  <SelectItem value="on-call">On-Call Rotation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="escalation-procedures">Automated Escalation</Label>
              <Switch id="escalation-procedures" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="response-time-sla">Response Time SLA (minutes)</Label>
              <Input id="response-time-sla" type="number" defaultValue="15" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data & Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="siem-integration">SIEM Integration</Label>
              <Switch id="siem-integration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="threat-intelligence">Threat Intelligence Feeds</Label>
              <Switch id="threat-intelligence" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="log-retention">Extended Log Retention</Label>
              <Switch id="log-retention" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period (days)</Label>
              <Input id="retention-period" type="number" defaultValue="90" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Incident Response</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="incident-severity">Default Incident Severity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-containment">Auto-Containment Threshold</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="automated-playbooks">Automated Response Playbooks</Label>
              <Switch id="automated-playbooks" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stakeholder-notifications">Stakeholder Notifications</Label>
              <Switch id="stakeholder-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default SOCSettings;
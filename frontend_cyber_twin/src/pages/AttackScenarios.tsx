import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, DollarSign, Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AttackScenarios = () => {
  type Scenario = {
    id: number;
    name: string;
    target: string;
    impact: string;
    severity: string;
    probability: number;
    mitigation: number;
    lastUpdated: string;
    description: string;
    timeline: string;
  };

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    target: '',
    impact: '',
    severity: 'medium',
    probability: 50,
    mitigation: 50,
    lastUpdated: 'just now',
    description: '',
    timeline: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/attacks`);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const body = await res.json();
        if (!body.success) throw new Error(body.message || 'unknown');
        setScenarios(body.data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch attack scenarios', err);
        setError(message || 'Failed to fetch attack scenarios');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/attacks`);
      const body = await res.json();
      if (!body.success) throw new Error(body.message || 'unknown');
      setScenarios(body.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFormError(null);
    // basic validation
    if (!form.name || !form.target || !form.description) {
      setFormError('Please fill required fields: name, target, description');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/attacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message || `Failed to create (${res.status})`);
      }
      // success: close modal, refresh
      setShowCreate(false);
      setForm({ name: '', target: '', impact: '', severity: 'medium', probability: 50, mitigation: 50, lastUpdated: 'just now', description: '', timeline: '' });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-red-500";
    if (probability >= 60) return "text-orange-500";
    if (probability >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getMitigationColor = (mitigation: number) => {
    if (mitigation >= 80) return "text-green-500";
    if (mitigation >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Attack Scenarios</h1>
        </div>
        <Button>
          <PlayCircle className="h-4 w-4 mr-2" />
          Run Simulation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">2</div>
              <div className="text-sm text-muted-foreground">Critical Scenarios</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">2</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">2</div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">80.8%</div>
              <div className="text-sm text-muted-foreground">Avg Mitigation</div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-end">
          <AlertDialog open={showCreate} onOpenChange={(open) => setShowCreate(open)}>
            <AlertDialogTrigger asChild>
              <Button>Create Scenario</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create Attack Scenario</AlertDialogTitle>
                <AlertDialogDescription>Provide details and submit to create a new attack scenario.</AlertDialogDescription>
              </AlertDialogHeader>

              <form onSubmit={submitForm} className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="Target" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                </div>
                <Input placeholder="Impact" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                    <option value="critical">critical</option>
                    <option value="high">high</option>
                    <option value="medium">medium</option>
                    <option value="low">low</option>
                  </select>
                  <Input type="number" placeholder="Probability" value={String(form.probability)} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} />
                  <Input type="number" placeholder="Mitigation" value={String(form.mitigation)} onChange={(e) => setForm({ ...form, mitigation: Number(e.target.value) })} />
                </div>
                <Input placeholder="Timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
                <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                {formError && <div className="text-destructive">{formError}</div>}

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Create'}</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading && <div>Loading scenarios...</div>}
        {error && <div className="text-destructive">{error}</div>}
        {!loading && !error && scenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{scenario.target}</div>
                </div>
                <Badge variant={getSeverityColor(scenario.severity)}>
                  {scenario.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Impact:</span>
                  <span>{scenario.impact}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Timeline:</span>
                  <span>{scenario.timeline}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attack Probability</span>
                    <span className={`font-medium ${getProbabilityColor(scenario.probability)}`}>
                      {scenario.probability}%
                    </span>
                  </div>
                  <Progress value={scenario.probability} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mitigation Readiness</span>
                    <span className={`font-medium ${getMitigationColor(scenario.mitigation)}`}>
                      {scenario.mitigation}%
                    </span>
                  </div>
                  <Progress value={scenario.mitigation} className="h-2" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Updated {scenario.lastUpdated}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AttackScenarios;
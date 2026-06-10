import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workmate AI" },
      { name: "description", content: "Turn goals into a prioritized, actionable plan." },
    ],
  }),
  component: TasksPage,
});

type Task = { title: string; priority: "low" | "medium" | "high"; estimate: string; due: string };

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [constraints, setConstraints] = useState("");
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const mut = useMutation({
    mutationFn: () => fn({ data: { goal, deadline, constraints } }),
    onSuccess: (d) => setTasks(d.tasks as Task[]),
    onError: (e: Error) => toast.error(e.message || "Failed to plan"),
  });

  const update = (i: number, patch: Partial<Task>) => {
    if (!tasks) return;
    const next = [...tasks];
    next[i] = { ...next[i], ...patch };
    setTasks(next);
  };

  const copy = () => {
    if (!tasks) return;
    navigator.clipboard.writeText(tasks.map((t) => `[${t.priority.toUpperCase()}] ${t.title} (${t.estimate}) — due ${t.due}`).join("\n"));
    toast.success("Copied plan");
  };

  const prioColor = (p: Task["priority"]) =>
    p === "high" ? "destructive" : p === "medium" ? "default" : "secondary";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={<ListChecks className="h-5 w-5" />} title="AI Task Planner" description="Describe a goal — get a prioritized plan you can edit." />
      <AiDisclaimer />

      <Card>
        <CardHeader><CardTitle className="text-base">Goal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Goal</Label>
            <Textarea rows={3} placeholder="e.g. Launch a beta of our mobile app" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input placeholder="e.g. End of Q3" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Constraints</Label>
              <Input placeholder="e.g. 2 engineers, $5k budget" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
            </div>
          </div>
          <Button onClick={() => mut.mutate()} disabled={!goal || mut.isPending}>
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate plan
          </Button>
        </CardContent>
      </Card>

      {tasks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Plan (editable)
              <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-2 h-3.5 w-3.5" /> Copy</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant={prioColor(t.priority)}>{t.priority}</Badge>
                  <Input className="flex-1" value={t.title} onChange={(e) => update(i, { title: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={t.priority} onValueChange={(v) => update(i, { priority: v as Task["priority"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Estimate" value={t.estimate} onChange={(e) => update(i, { estimate: e.target.value })} />
                  <Input placeholder="Due" value={t.due} onChange={(e) => update(i, { due: e.target.value })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

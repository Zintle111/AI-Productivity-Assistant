import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { research } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workmate AI" },
      { name: "description", content: "Get quick, structured briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

type Brief = { overview: string; keyFindings: string[]; considerations: string[]; nextReads: string[] };

function ResearchPage() {
  const fn = useServerFn(research);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"quick" | "deep">("quick");
  const [brief, setBrief] = useState<Brief | null>(null);

  const mut = useMutation({
    mutationFn: () => fn({ data: { topic, depth } }),
    onSuccess: (d) => setBrief(d as Brief),
    onError: (e: Error) => toast.error(e.message || "Failed to research"),
  });

  const update = <K extends keyof Brief>(k: K, v: Brief[K]) =>
    setBrief((b) => (b ? { ...b, [k]: v } : b));

  const copyAll = () => {
    if (!brief) return;
    const t = [
      "OVERVIEW", brief.overview,
      "", "KEY FINDINGS", ...brief.keyFindings.map((x) => `• ${x}`),
      "", "CONSIDERATIONS", ...brief.considerations.map((x) => `• ${x}`),
      "", "FURTHER READING", ...brief.nextReads.map((x) => `• ${x}`),
    ].join("\n");
    navigator.clipboard.writeText(t);
    toast.success("Copied briefing");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={<Search className="h-5 w-5" />} title="AI Research Assistant" description="Get a structured briefing on any topic in seconds." />
      <AiDisclaimer />

      <Card>
        <CardHeader><CardTitle className="text-base">Research request</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input placeholder="e.g. State of vector databases in 2026" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick overview</SelectItem>
                  <SelectItem value="deep">Deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => mut.mutate()} disabled={!topic || mut.isPending}>
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Research
          </Button>
        </CardContent>
      </Card>

      {brief && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Briefing (editable)
              <Button size="sm" variant="outline" onClick={copyAll}><Copy className="mr-2 h-3.5 w-3.5" /> Copy</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Overview</Label>
              <Textarea rows={5} value={brief.overview} onChange={(e) => update("overview", e.target.value)} />
            </div>
            <EditableList label="Key findings" items={brief.keyFindings} onChange={(v) => update("keyFindings", v)} />
            <EditableList label="Considerations" items={brief.considerations} onChange={(v) => update("considerations", v)} />
            <EditableList label="Further reading" items={brief.nextReads} onChange={(v) => update("nextReads", v)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EditableList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((it, i) => (
        <Input key={i} value={it} onChange={(e) => {
          const next = [...items];
          next[i] = e.target.value;
          onChange(next);
        }} />
      ))}
    </div>
  );
}

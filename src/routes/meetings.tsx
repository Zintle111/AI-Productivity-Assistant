import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workmate AI" },
      { name: "description", content: "Turn raw meeting notes into structured summaries and action items." },
    ],
  }),
  component: MeetingsPage,
});

type Summary = {
  keyPoints: string[];
  decisions: string[];
  actionItems: { task: string; owner: string }[];
  nextSteps: string[];
};

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState<Summary | null>(null);

  const mut = useMutation({
    mutationFn: () => fn({ data: { notes } }),
    onSuccess: (data) => setOut(data as Summary),
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  const copyAll = () => {
    if (!out) return;
    const text = [
      "KEY POINTS", ...out.keyPoints.map((p) => `• ${p}`),
      "", "DECISIONS", ...out.decisions.map((p) => `• ${p}`),
      "", "ACTION ITEMS", ...out.actionItems.map((a) => `• ${a.task} — ${a.owner}`),
      "", "NEXT STEPS", ...out.nextSteps.map((p) => `• ${p}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied summary");
  };

  const update = <K extends keyof Summary>(k: K, v: Summary[K]) =>
    setOut((s) => (s ? { ...s, [k]: v } : s));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={<FileText className="h-5 w-5" />} iconClassName="bg-meeting/10 text-meeting" title="Meeting Notes Summarizer" description="Paste meeting notes or transcripts; get structured takeaways." />
      <AiDisclaimer />

      <Card>
        <CardHeader><CardTitle className="text-base">Meeting notes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={10} placeholder="Paste meeting notes or transcript..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button onClick={() => mut.mutate()} disabled={notes.length < 20 || mut.isPending}>
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Summarize
          </Button>
        </CardContent>
      </Card>

      {out && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Summary (editable)
              <Button size="sm" variant="outline" onClick={copyAll}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EditableList label="Key Points" items={out.keyPoints} onChange={(v) => update("keyPoints", v)} />
            <EditableList label="Decisions" items={out.decisions} onChange={(v) => update("decisions", v)} />
            <div className="space-y-2">
              <Label>Action Items</Label>
              {out.actionItems.map((a, i) => (
                <div key={i} className="grid grid-cols-[1fr_180px] gap-2">
                  <Input value={a.task} onChange={(e) => {
                    const next = [...out.actionItems];
                    next[i] = { ...next[i], task: e.target.value };
                    update("actionItems", next);
                  }} />
                  <Input placeholder="Owner" value={a.owner} onChange={(e) => {
                    const next = [...out.actionItems];
                    next[i] = { ...next[i], owner: e.target.value };
                    update("actionItems", next);
                  }} />
                </div>
              ))}
            </div>
            <EditableList label="Next Steps" items={out.nextSteps} onChange={(v) => update("nextSteps", v)} />
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
      {items.map((item, i) => (
        <Input key={i} value={item} onChange={(e) => {
          const next = [...items];
          next[i] = e.target.value;
          onChange(next);
        }} />
      ))}
    </div>
  );
}

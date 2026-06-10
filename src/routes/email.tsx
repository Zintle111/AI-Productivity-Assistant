import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Copy, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workmate AI" },
      { name: "description", content: "Draft professional emails in seconds with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "persuasive" | "concise">("formal");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const mut = useMutation({
    mutationFn: () => fn({ data: { recipient, purpose, tone, length } }),
    onSuccess: (out) => { setSubject(out.subject); setBody(out.body); },
    onError: (e: Error) => toast.error(e.message || "Failed to generate"),
  });

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={<Mail className="h-5 w-5" />} iconClassName="bg-email/10 text-email" title="Smart Email Generator" description="Tell us the gist — we'll write a polished email." />
      <AiDisclaimer />

      <Card>
        <CardHeader><CardTitle className="text-base">Email details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="e.g. Hiring manager at Acme" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as typeof length)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">What's the email about?</Label>
            <Textarea id="purpose" rows={4} placeholder="e.g. Follow up on last week's interview and reiterate interest" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <Button onClick={() => mut.mutate()} disabled={!recipient || !purpose || mut.isPending}>
            {mut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate email
          </Button>
        </CardContent>
      </Card>

      {(subject || body) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Generated email (editable)
              <Button size="sm" variant="outline" onClick={() => copy(`Subject: ${subject}\n\n${body}`)}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy all
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea rows={14} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

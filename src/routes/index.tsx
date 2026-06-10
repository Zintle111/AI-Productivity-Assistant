import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessagesSquare, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Amateur" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft polished emails in seconds.", icon: Mail },
  { to: "/meetings", title: "Meeting Summarizer", desc: "Turn notes into action items.", icon: FileText },
  { to: "/tasks", title: "AI Task Planner", desc: "Break goals into a plan.", icon: ListChecks },
  { to: "/research", title: "Research Assistant", desc: "Quick briefings on any topic.", icon: Search },
  { to: "/chat", title: "AI Chatbot", desc: "Ask anything, anytime.", icon: MessagesSquare },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        icon={<Sparkles className="h-5 w-5" />}
        title="Welcome to Amateur"
        description="Your AI assistant for everyday workplace tasks. Pick a tool to get started."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between text-base">
                  {t.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold">Responsible AI</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Amateur generates suggestions to accelerate your work. Outputs may contain
            inaccuracies or omissions. Always review AI-generated content before sending,
            sharing, or making decisions based on it. Do not share confidential information
            you wouldn't share with a third-party service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

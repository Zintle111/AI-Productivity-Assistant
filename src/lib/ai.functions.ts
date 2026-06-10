import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

// ---------- Email ----------
const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.enum(["formal", "friendly", "persuasive", "concise"]),
  length: z.enum(["short", "medium", "long"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      system:
        "You are an expert email writer. Write professional, clear emails with a subject and body.",
      prompt: `Write an email to: ${data.recipient}\nPurpose: ${data.purpose}\nTone: ${data.tone}\nLength: ${data.length}`,
      experimental_output: Output.object({
        schema: z.object({
          subject: z.string(),
          body: z.string(),
        }),
      }),
    });
    return output;
  });

// ---------- Meeting summarizer ----------
const MeetingInput = z.object({ notes: z.string().min(10) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      system:
        "Summarize meeting notes into structured sections. Be accurate and concise.",
      prompt: `Meeting notes:\n\n${data.notes}`,
      experimental_output: Output.object({
        schema: z.object({
          keyPoints: z.array(z.string()),
          decisions: z.array(z.string()),
          actionItems: z.array(
            z.object({ task: z.string(), owner: z.string() })
          ),
          nextSteps: z.array(z.string()),
        }),
      }),
    });
    return output;
  });

// ---------- Task planner ----------
const TaskInput = z.object({
  goal: z.string().min(1),
  deadline: z.string().optional(),
  constraints: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TaskInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      system:
        "You are a project planner. Break goals into actionable, prioritized tasks.",
      prompt: `Goal: ${data.goal}\nDeadline: ${data.deadline ?? "n/a"}\nConstraints: ${data.constraints ?? "none"}`,
      experimental_output: Output.object({
        schema: z.object({
          tasks: z.array(
            z.object({
              title: z.string(),
              priority: z.enum(["low", "medium", "high"]),
              estimate: z.string(),
              due: z.string(),
            })
          ),
        }),
      }),
    });
    return output;
  });

// ---------- Research ----------
const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["quick", "deep"]),
});

export const research = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: getModel(),
      system:
        "You are a research assistant. Provide structured, balanced briefings. Note when information may be outdated.",
      prompt: `Topic: ${data.topic}\nDepth: ${data.depth}`,
      experimental_output: Output.object({
        schema: z.object({
          overview: z.string(),
          keyFindings: z.array(z.string()),
          considerations: z.array(z.string()),
          nextReads: z.array(z.string()),
        }),
      }),
    });
    return output;
  });

# AI Workplace Productivity Assistant — Build Plan

A clean, modern SaaS-style dashboard with sidebar navigation and 5 AI-powered tools. AI calls go through Lovable AI Gateway (Gemini) via TanStack server routes/functions.

## Pages & Routes

```
/               Dashboard (overview cards + recent activity)
/email          Smart Email Generator
/meetings       Meeting Notes Summarizer
/tasks          AI Task Planner
/research       AI Research Assistant
/chat           AI Chatbot Interface
```

Shared layout in `__root.tsx`: `SidebarProvider` + `AppSidebar` + header with `SidebarTrigger`. Each route gets its own `head()` meta.

## Features

**1. Smart Email Generator (`/email`)**
- Inputs: recipient, purpose/context, tone (formal / friendly / persuasive / concise), length.
- Output: editable subject + body in a textarea. Copy button. Regenerate.

**2. Meeting Notes Summarizer (`/meetings`)**
- Input: paste raw notes/transcript.
- Output: structured summary — Key Points, Decisions, Action Items (with owners), Next Steps. Editable.

**3. AI Task Planner (`/tasks`)**
- Input: a goal + deadline + constraints.
- Output: structured task list (title, priority, estimate, due). Editable inline. Streaming.

**4. AI Research Assistant (`/research`)**
- Input: topic + depth (quick / deep).
- Output: structured brief — Overview, Key Findings, Considerations, Suggested Next Reads. Editable markdown.

**5. AI Chatbot (`/chat`)**
- Streaming chat using AI SDK `useChat` + AI Elements (Conversation, Message, PromptInput, Shimmer).
- Single ephemeral conversation (no persistence) — keeps scope tight.

## Shared UI Elements
- Responsible AI disclaimer banner shown on every tool page ("AI-generated content may be inaccurate. Review before using.").
- Loading shimmer states.
- Toast notifications for errors (rate limit 429, credits 402).
- Editable outputs use `<Textarea>` / contentEditable blocks so users can refine before copying/exporting.
- Copy-to-clipboard on all outputs.

## Design Direction
Clean, modern SaaS aesthetic — think Linear / Notion / Vercel:
- Light + dark mode via existing tokens in `src/styles.css`.
- Refined neutral palette with a single deliberate accent (deep indigo/violet — not generic purple gradient).
- Inter-alternative pairing (e.g. Geist or similar) — avoid default Inter-on-white look.
- Generous spacing, subtle borders, soft shadows. Card-based layouts.
- All colors via semantic tokens (no hardcoded hex in components).

## Technical Architecture

**Backend (Lovable AI Gateway via AI SDK):**
- `src/lib/ai-gateway.server.ts` — provider helper (OpenAI-compatible, baseURL `https://ai.gateway.lovable.dev/v1`, `Lovable-API-Key` header).
- `src/routes/api/chat.ts` — streaming chat server route for the chatbot.
- `src/lib/ai.functions.ts` — `createServerFn` handlers for the 4 one-shot tools (email, summarizer, planner, research) using `streamText` → `toUIMessageStreamResponse` OR `generateText` with `Output.object` for structured outputs.
- Model: `google/gemini-3-flash-preview`.
- `LOVABLE_API_KEY` provisioned via `lovable_api_key--create`; read server-side only.

**Frontend:**
- Sidebar via shadcn `Sidebar` components, collapsible to icon mini-rail.
- AI Elements installed: `conversation message prompt-input shimmer tool` for the chatbot.
- React Query for server-fn calls (loading/error states).
- No database — outputs are session-scoped. (Can add persistence later if user wants.)

**No backend storage** — keeps scope minimal and avoids needing Lovable Cloud. If the user later wants history/saved drafts, we enable Cloud and add tables.

## Out of Scope (ask if wanted)
- Auth / multi-user
- Saving history (would need Lovable Cloud)
- File uploads (PDF/DOCX parsing for meetings)
- Team collaboration

## Deliverables
1. Sidebar layout + 6 routes with proper SEO meta per page.
2. 5 working AI features via Lovable AI Gateway.
3. Responsive (mobile sidebar becomes sheet, content reflows).
4. Responsible AI disclaimer on every tool.
5. Editable + copyable outputs everywhere.

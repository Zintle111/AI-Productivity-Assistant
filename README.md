# Amateur — AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using AI.

## Overview

Amateur is a SaaS-style dashboard with a clean, professional interface and five AI-powered productivity tools. It runs on [TanStack Start](https://tanstack.com/start) with React 19, Tailwind CSS, and shadcn/ui components. AI features are powered by the Lovable AI Gateway (Google Gemini).

## Features

| Tool | Route | Description |
|------|-------|-------------|
| **Smart Email Generator** | `/email` | Generate polished emails with customizable tone and length. |
| **Meeting Notes Summarizer** | `/meetings` | Turn raw notes into structured summaries with key points, decisions, and action items. |
| **AI Task Planner** | `/tasks` | Break a goal into a prioritized task list with deadlines. |
| **AI Research Assistant** | `/research` | Produce quick or deep briefings on any topic. |
| **AI Chatbot** | `/chat` | Streaming conversational AI for open-ended questions. |

All tools produce editable outputs with copy-to-clipboard support and include a responsible AI disclaimer.

## Tech Stack

- **Framework:** TanStack Start v1 (React 19, file-based routing, SSR/SSG)
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **AI Integration:** Lovable AI Gateway (`google/gemini-3-flash-preview`)
- **State & Data:** TanStack Query, React Hook Form, Zod validation
- **Build Tool:** Vite 7

## Project Structure

```
src/
├── components/          # Reusable UI components (shadcn/ui + custom)
│   ├── app-sidebar.tsx
│   ├── page-header.tsx
│   └── ai-disclaimer.tsx
├── lib/
│   ├── ai-gateway.server.ts   # AI provider configuration
│   ├── ai.functions.ts        # Server functions for structured AI outputs
│   └── utils.ts
├── routes/              # TanStack Start file-based routes
│   ├── __root.tsx       # Root layout with sidebar
│   ├── index.tsx        # Dashboard
│   ├── email.tsx
│   ├── meetings.tsx
│   ├── tasks.tsx
│   ├── research.tsx
│   └── chat.tsx
│   └── api/
│       └── chat.ts      # Streaming chat endpoint
├── styles.css           # Global styles & design tokens
└── server.ts            # SSR entry
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- A Lovable API key (auto-provisioned in Lovable Cloud environments)

### Install dependencies

```bash
bun install
```

### Run the development server

```bash
bun dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
bun run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LOVABLE_API_KEY` | Lovable AI Gateway API key (server-side only) |

## Design

- Clean, modern SaaS aesthetic inspired by Linear, Notion, and Vercel
- Semantic color tokens via CSS custom properties (light + dark mode ready)
- Collapsible sidebar navigation
- Fully responsive (mobile sidebar becomes a sheet)

## Responsible AI

Amateur generates suggestions to accelerate your work. AI outputs may contain inaccuracies or omissions. Always review generated content before sending, sharing, or making decisions based on it. Do not share confidential information you wouldn't share with a third-party service.

## License

Private — not open source.

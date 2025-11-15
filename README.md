# shadcnify

Tweakcn-inspired AI + manual theme generator for shadcn/ui projects. Describe a vibe in chat, get paired light/dark palettes, and refine tokens (colors, typography, shadows, spacing, sidebar) with instant preview.

## Features

- **AI Theme Chat** – Convex actions stream LLM responses and tool calls that directly update `ThemeProvider` tokens in real time.
- **Manual Theme Controls** – Color pickers, typography selectors, spacing / radius / shadow sliders for precise tweaks.
- **Live Preview Playground** – Shadcn component gallery reflects every change so designers/developers can validate instantly.
- **Persistent Theme State** – `ThemeProvider` syncs to `localStorage`, keeps light/dark tokens in sync when required, and supports sharing/export.
- **Convex Backend** – Convex functions handle chat persistence/streaming via `@convex-dev/persistent-text-streaming`; AI tools are typed with Zod schemas.

## Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) with shadcn/ui primitives
- [Convex](https://convex.dev/) backend + `@convex-dev/persistent-text-streaming`
- [ai-sdk](https://sdk.vercel.ai/) for model + tool orchestration (OpenRouter provider)
- [Bun](https://bun.sh/) for package/runtime (scripts use `bun`)

## Getting Started

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Configure environment**
   - Copy `.env.example` → `.env.local` (if present) or create `.env.local`.
   - Set `OPENROUTER_API_KEY=<your key>` so `convex/ai.ts` can call OpenRouter.
   - Optional Convex vars (auth, deployment) go in `.env.local` as well.

3. **Run Convex dev tools once (recommended)**

   ```bash
   bunx convex dev --once      # generates convex/_generated/*
   ```

4. **Start the app**
   ```bash
   bun run dev                 # runs Vite + Convex together
   ```
   Visit `http://localhost:5173`.

### Other scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `bun run dev:frontend` | Start Vite only                           |
| `bun run dev:backend`  | Start Convex dev server only              |
| `bun run build`        | Type-check + Vite build to `dist/`        |
| `bun run preview`      | Serve production build locally            |
| `bun run lint`         | `tsc` + ESLint (treat warnings as errors) |

## How It Works

- **Theme Provider** (`src/providers/themeProvider.tsx`) stores light/dark token config, writes CSS variables to `:root`, and persists in `localStorage`.
- **AI Tooling** (`convex/lib/theme.ts`) defines the `updateThemeTokens` tool schema using Zod. The LLM can only change tokens from this schema.
- **Streaming Chat**:
  1. Frontend posts prompt + current theme snapshot to `api.messages.sendMessage`.
  2. Convex action `streamChat` runs `streamText` with our system prompt and tool.
  3. When the model calls `updateThemeTokens`, we emit a base64 marker inside the stream; the client decodes it, applies updates via `ThemeProvider`, and shows a Task summary in the chat panel.
- **Manual Controls** – Tabs under `src/components/controls` let users edit tokens directly (color pickers, sliders, etc.), debounced into `ThemeProvider`.

## Customization Tips

- **Add new tokens** – Extend `themeVariableKeys` and `themeUpdatesSchema`, then update UI controls + preview components to use them.
- **Model provider** – Swap OpenRouter in `convex/ai.ts` for another provider compatible with ai-sdk.
- **Prompt tuning** – `SYSTEM_MESSAGE` in `convex/ai.ts` contains all guardrails (spacing limits, light/dark sync). Adjust for new rules.

## Troubleshooting

- **Convex codegen errors** – Run `bunx convex dev --once` after modifying anything in `convex/`.
- **AI responses missing updates** – Ensure your OpenRouter key is valid and the model supports tool calls.
- **Lint failures** – `bun run lint` fails on warnings per repo policy; fix ESLint + TypeScript warnings before committing.
- **Known issue** – The “dark-to-light” theme converter flow is still unreliable; expect mismatched tokens when trying to transplant dark palettes into light mode. Track progress in the issue tracker.

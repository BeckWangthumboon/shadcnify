# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the React client entry (`main.tsx`), shared styles (`index.css`), and UI modules such as `App.tsx`. Keep new components near their usage to preserve short import paths.
- `convex/` hosts backend logic: `schema.ts` defines tables, `myFunctions.ts` stores queries/mutations, `_generated/` holds auto-generated API bindings, and `auth.config.ts` wires Convex Auth. Export server functions here so they surface through `convex/_generated/api`.
- `public/` serves static assets bundled by Vite. Tooling and infra live at the repo root (`vite.config.ts`, `tsconfig*.json`, `setup.mjs`, `eslint.config.js`).

## Build, Test, and Development Commands

- `bun install` — install dependencies after cloning.
- `bun run dev` — runs Vite (`dev:frontend`) and the Convex dev server (`dev:backend`) concurrently for full-stack iteration.
- `bun run dev:backend` — starts only the Convex process; useful when debugging server functions or schema changes.
- `bun run build` — type-checks via `tsc -b` and emits a production build into `dist/`.
- `bun run lint` — runs `tsc` and ESLint with the repo config; treat warnings as failures.
- `bun run preview` — serves the `dist/` output locally to validate production artifacts.
- `bunx convex dev --once` — regenerates `convex/_generated/*` bindings whenever schema or server code changes.

## Coding Style & Naming Conventions

- Name React components with PascalCase (`SignOutButton`), hooks/utilities with camelCase, and Convex server modules descriptively (e.g., `myFunctions.ts`).
- Use shadcn/ui primitives when building new surfaces and reference Tailwind tokens from the shadcn preset (`bg-background`, `text-foreground`, `border-border`) instead of custom colors.
- Tailwind utilities belong directly in `className`; prefer readable stacks of classes over ad-hoc CSS when possible.
- Keep Convex exports pure and typed — queries end in `useQuery(api.module.function)` and mutations in `useMutation(...)` to match generated types.

## Testing Guidelines

- Automated tests are not yet configured; the user will run any necessary testing and QA before merging.

## Security & Configuration Tips

- Keep Convex environment variables and auth secrets in the Convex dashboard via CLI; never commit secrets or generated tokens.
- After schema or auth changes, re-run `convex dev --until-success` followed by `bunx convex dev --once` to ensure the local deployment is seeded and generated bindings are current before pushing changes.

## Project Context

- Building a single-page shadcn theme generator inspired by Tweakcn: AI-assisted theme chat + manual editor on top, live preview playground below.
- Theme state lives in `ThemeProvider`; colors are edited in hex (with OKLCH stored under the hood) via `react-colorful` pickers inside shadcn popovers.
- Manual controls focus on Colors (with light/dark mode toggle), Typography, Shadows, Spacing, Sidebar; preview gallery renders shadcn components to validate changes instantly.

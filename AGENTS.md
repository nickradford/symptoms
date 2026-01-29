# Agent Guidelines for Symptoms

## Build & Test Commands

- `bun run dev` - Start dev server on port 3000
- `bun run build` - Build for production
- `bun run test` - Run tests with vitest
- `bun run test -- path/to/test.ts` - Run single test file
- `bun run lint` - Run ESLint
- `bun run format` - Check Prettier formatting
- `bun run check` - Format + lint fix in one command

## Architecture

**Stack:** TanStack Start (React 19) + TailwindCSS + shadcn/ui

**Structure:**

- `src/routes/` - File-based routing (TanStack Router)
- `src/components/` - React components (ui/ for shadcn components)
- `src/lib/` - Utilities and helpers
- `src/router.tsx` - Router config
- Backend: Nitro for server routes

**Key Dependencies:**

- React 19, TypeScript 5.7
- TanStack Router for routing + devtools
- TailwindCSS 4 + Radix UI + Base UI
- Vitest for testing, Vite for bundling

## Code Style & Conventions

- **Imports:** Use `@/*` alias for src imports (configured in tsconfig)
- **Formatting:** Prettier (no semicolons, single quotes, trailing commas)
- **Linting:** TanStack ESLint config (React best practices)
- **Types:** Strict TypeScript mode enabled, no unused locals/params allowed
- **Components:** Functional components with shadcn/ui patterns
- **Naming:** PascalCase for components, camelCase for functions/variables

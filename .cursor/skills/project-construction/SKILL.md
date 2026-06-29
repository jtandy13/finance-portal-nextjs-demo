---
name: project-construction
description: Presents the WealthPort project construction canvas covering tech stack, app architecture, Clerk authentication, and database schema. Use when the user asks about the tech stack, how the project works, project setup, architecture overview, authentication flow, database schema, routes, or general onboarding to the codebase.
---

# Project Construction

Show the pre-built **Project Construction** canvas when the user wants an overview of how WealthPort (`finance-portal`) is built, configured, or organized.

## When to apply

Apply this skill when the user asks (explicitly or implicitly) for:

- Tech stack or dependencies
- How the project works or is structured
- Project setup, architecture, or onboarding
- Authentication (Clerk) or database (Drizzle / Neon) design
- Routes, middleware, or high-level data model

Do **not** apply for targeted tasks (fix a bug, edit a component, write a PR) unless they also want the overview canvas.

## Workflow

1. **Resolve the canvas path** — canvases live in Cursor's managed project directory, not the git repo:

   ```
   ~/.cursor/projects/<workspace-slug>/canvases/project-construction.canvas.tsx
   ```

   Derive `<workspace-slug>` from the workspace root (e.g. `Users-james-tandy-Documents-projects-financePortal` for `/Users/james.tandy/Documents/projects/financePortal`).

2. **Check the canvas exists** — read `project-construction.canvas.tsx` at that path.

   - **Exists** → present it (step 3). Update only if source files have materially changed since the canvas was written (see step 4).
   - **Missing** → create it first: read the [canvas skill](~/.cursor/skills-cursor/canvas/SKILL.md), then build `project-construction.canvas.tsx` from the source files listed below.

3. **Present the canvas** — always include a markdown link using the **full absolute path**:

   `[Project Construction](/Users/<user>/.cursor/projects/<workspace-slug>/canvases/project-construction.canvas.tsx)`

   Tell the user they can open it beside the chat. Optionally open it with the `open_resource` MCP tool (`cursor-app-control`).

   Add a **short chat summary** (3–5 bullets) covering:
   - Stack: Next.js 16, React 19, Tailwind v4, shadcn/ui, Clerk, Drizzle + Neon, Vitest
   - Auth: `src/proxy.ts` middleware → `getAuthenticatedUser()` in `src/lib/auth.ts`
   - Data: 10 Postgres tables in `src/db/schema.ts`
   - Routes: `/`, `/everyday-banking`, `/accounts`, `/wealth-management`

   Point to the canvas for diagrams and tables — do not duplicate the full schema or stack in chat.

4. **Keep the canvas current** — when updating, re-read these sources of truth:

   | Topic | File |
   |-------|------|
   | Tech stack, features, env vars | [README.md](README.md) |
   | Schema + relations | [src/db/schema.ts](src/db/schema.ts) |
   | Auth middleware | [src/proxy.ts](src/proxy.ts) |
   | User provisioning | [src/lib/auth.ts](src/lib/auth.ts) |
   | DB client | [src/db/index.ts](src/db/index.ts) |
   | App routes | [src/app/](src/app/) |

   Follow the canvas skill for layout, tokens, and TypeScript rules. The canvas must include:
   - Tech stack (grouped: framework, UI, data, auth, testing, tooling)
   - Request-flow diagram (Browser → Next.js → Clerk → pages → server layer → Drizzle → Neon)
   - Auth flow (middleware, protected routes, first-time provisioning)
   - Schema ER diagram + table reference with enums

5. **Answer follow-ups** — for specific questions, read the relevant source file and answer in chat. Re-open or update the canvas only if the user wants the visual artifact refreshed.

## Canvas filename

Always use: `project-construction.canvas.tsx`

## Anti-patterns

- Do not dump the full schema or stack as a markdown table when the canvas exists.
- Do not recreate the canvas on every trigger — read and present the existing file.
- Do not store the canvas inside the git repo; it belongs in the managed `canvases/` directory only.

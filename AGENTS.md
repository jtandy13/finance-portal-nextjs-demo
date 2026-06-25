<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

WealthPort (`finance-portal`) is a Next.js 16 / React 19 finance portal. Standard commands live in `package.json` and `README.md`; only the non-obvious caveats are below.

- **Dependencies** are installed automatically by the startup update script (`npm ci`). No manual install needed.
- **Lint / typecheck / test / build** need no external services — Vitest mocks the DB, Clerk, and `next/cache`. Run `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`.
- **Dev server**: `npm run dev` (port 3000). The build also succeeds without env vars because all routes are dynamic (`auth()` runs at request time, not build time).
- **Two external services are required to actually use the product**, and there is no `.env.example` in the repo despite the README referencing one. Create `.env` with: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL` (Neon HTTP/pooler URL). Optional: `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (default `/everyday-banking`).
  - Without Clerk keys the **public landing page (`/`) still renders 200**, but protected routes `/everyday-banking` and `/wealth-management` throw `@clerk/backend: Missing publishableKey`.
  - `DATABASE_URL` uses the Neon serverless **HTTP** driver (`@neondatabase/serverless`), not the raw Postgres wire protocol — a plain local Postgres URL will not work without the Neon proxy.
- **Data**: the provisioned database already contains banking/wealth data, so seeding is normally unnecessary. `npm run db:seed -- user_<clerkId>` is **destructive** — it wipes and recreates the demo user's rows — so only run it intentionally. Schema can be (re)created with `npm run db:push`. A freshly provisioned Clerk user with no seeded data gets empty default checking/savings accounts auto-created on first authenticated visit (`src/lib/auth.ts`).
- **Middleware** lives in `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`).

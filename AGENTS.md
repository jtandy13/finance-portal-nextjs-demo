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
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` must contain **only** the `pk_test_…`/`pk_live_…` value. If the `sk_…` secret key is accidentally appended to it, Clerk fails with `Publishable key not valid.` (and the app silently falls back to Clerk "keyless mode"). Keep the publishable and secret keys in separate variables.
  - `DATABASE_URL` uses the Neon serverless **HTTP** driver (`@neondatabase/serverless`), not the raw Postgres wire protocol — a plain local Postgres URL will not work without the Neon proxy.
  - Long-running processes (e.g. a `tmux` dev server) only see secrets present when they started; after secrets are added/changed, start the dev server in a **fresh** shell so it inherits the updated env. Updated secrets generally take effect on a new Cloud Agent VM, not the current running session.
- **Data**: the provisioned database already contains banking/wealth data, so seeding is normally unnecessary. `npm run db:seed -- user_<clerkId>` is **destructive** — it wipes and recreates the demo user's rows — so only run it intentionally. Schema can be (re)created with `npm run db:push`. A freshly provisioned Clerk user with no seeded data gets empty default checking/savings accounts auto-created on first authenticated visit (`src/lib/auth.ts`).
- **Middleware** lives in `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`).

## Routes (quick reference)

| Route | Auth | What it does |
|-------|------|--------------|
| `/` | Public | Marketing landing page; **Log In** / **Get Started** open Clerk modals |
| `/everyday-banking` | Protected | Banking dashboard — summary cards, recent transactions, **Quick Transfer** form |
| `/accounts` | Protected | Accounts overview — balance summary, account lists, **Transfer Funds** dialog |
| `/wealth-management` | Protected | Portfolio holdings and allocation |

Sidebar **Transfers** links to `/everyday-banking` (there is no `/transfers` page). **Settings** is disabled in the nav.

## Cloud Agent secrets

On Cursor Cloud VMs, secrets are injected as environment variables — you do **not** need a `.env` file. In addition to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL`, these are available for manual/E2E testing:

- `USERNAME` — Clerk sign-in email for the provisioned demo user
- `PASSWORD` — Clerk sign-in password for the provisioned demo user

The demo user already has seeded accounts (e.g. Premium Checking, High-Yield Savings) and wealth data. Do not run `db:seed` unless you intentionally want to reset that user's data.

If Clerk MFA blocks automated login, run `npm run clerk:disable-mfa` (see `src/scripts/disable-mfa.ts`).

## Manual / E2E testing

Use this flow to verify the app works end-to-end (e.g. with the `computerUse` subagent):

1. Start the dev server: `npm run dev` (port 3000). Restart in a fresh shell if secrets were added after a previous start.
2. Open `http://localhost:3000` — the public landing page should return 200 even without Clerk keys; protected routes need keys.
3. Click **Log In** in the header — Clerk opens a **modal** (email → password, not a separate `/sign-in` page).
4. Sign in with `USERNAME` / `PASSWORD`. Successful auth redirects to `/everyday-banking`.
5. **Transfer funds** — either:
   - **Quick Transfer** on `/everyday-banking` (right column): pick from/to accounts, enter amount, click **Send Funds**; or
   - **Transfer Funds** button on `/accounts` (opens the same form in a dialog).
6. Expect a green success message (`Transfer completed successfully.`) and updated checking/savings balances without a page refresh.

Server action: `createTransfer` in `src/lib/banking/actions.ts`. Form UI: `src/components/banking/quick-transfer-form.tsx`.

## Where to look in the codebase

| Task | Start here |
|------|------------|
| Auth / user provisioning | `src/lib/auth.ts`, `src/proxy.ts` |
| Banking queries & overview | `src/lib/banking/queries.ts` |
| Transfers (validation + action) | `src/lib/banking/transfer-schema.ts`, `src/lib/banking/actions.ts` |
| Accounts page metrics | `src/lib/accounts/queries.ts`, `src/lib/accounts/metrics.ts` |
| Wealth / portfolio | `src/lib/wealth/queries.ts` |
| DB schema | `src/db/schema.ts` |
| Shared test fixtures | `src/test/factories.ts` |

Unit/component tests: `npm run test:run`. Integration tests (separate Vitest config): `npm run test:integration`. Before `git push`, run `npm run lint && npm run test:run`.

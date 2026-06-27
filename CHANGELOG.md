# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-06-27

### Added

- **Accounts overview page** (`/accounts`) with a total available balance summary, deposit account and credit card lists, account insights (liquidity distribution + 30-day balance trend chart), and quick actions (transfer funds, pay bill, add account).
- `MaterialSymbol` component (`src/components/ui/material-symbol.tsx`) backed by Material Symbols via Google Fonts — loaded once in `src/app/material-symbols.css`.
- `balance_snapshots` table in the database schema that stores a per-day `total_balance` history (one row per user per day, enforced by a unique index), powering the 30-day balance trend chart.
- Account metrics library (`src/lib/accounts/metrics.ts`) with helpers for liquidity distribution and daily balance change, fully unit-tested.
- Account query helpers (`src/lib/accounts/queries.ts`) for fetching aggregated account data.
- Accounts sidebar entry in `AppSidebar`.

## [0.2.0] - 2026-05-01

### Added

- **Vitest** test runner with React Testing Library; coverage thresholds enforced via `vitest.config.ts` (`npm run test:coverage`).
- Extracted testable logic into dedicated modules: `src/lib/banking/metrics.ts`, `src/lib/banking/transfer-schema.ts`, and `src/lib/wealth/quotes.ts`.
- Server action tests for `src/lib/banking/actions.ts` and `src/lib/auth.ts`, with DB, Clerk, and `next/cache` mocked via `vi.mock`.
- Shared test fixtures in `src/test/factories.ts`.
- Clerk disable-MFA script (`scripts/disable-mfa.ts`) for the demo user.
- Rule requiring colocated tests for all new features and UI components.

### Changed

- Hardened ESLint flat config (`eslint-config-next`) with stricter rules; `npm run lint` and `npm run typecheck` now block CI deployments on failure.
- Drizzle ORM client is now lazily initialized to avoid build-time connection errors.
- CI workflow (`deploy-project.yml`) updated to run test, lint, and typecheck jobs in parallel before the build step; deployment is gated on all three passing.

## [0.1.0] - 2026-04-01

### Added

- **Next.js 16** app scaffold with TypeScript, Tailwind CSS v4, and the App Router.
- **Clerk** authentication with middleware (`src/proxy.ts`), sign-in UI, and automatic redirect to `/everyday-banking` after sign-in.
- **Drizzle ORM** with Neon serverless PostgreSQL; schema in `src/db/schema.ts` covers `users`, `accounts`, `transactions`, `transfers`, `portfolios`, and `balance_snapshots`.
- **Everyday Banking** page (`/everyday-banking`) — checking/savings account overview, fund transfers with Zod-validated server actions, and transaction history.
- **Wealth Management** page (`/wealth-management`) — portfolio holdings and allocation.
- **shadcn/ui** component library initialized with Tailwind v4 theme tokens.
- Home page (`/`) — public landing page visible without authentication.
- GitHub Actions CI/CD pipeline (`.github/workflows/deploy-project.yml`).
- Cursor workspace rules for shadcn/ui conventions, documentation sync, test requirements, and Google Stitch design integration.

[Unreleased]: https://github.com/jtandy13/financePortal/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/jtandy13/financePortal/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/jtandy13/financePortal/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/jtandy13/financePortal/releases/tag/v0.1.0

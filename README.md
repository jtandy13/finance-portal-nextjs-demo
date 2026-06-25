This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Clerk](https://clerk.com) authentication
- [Drizzle ORM](https://orm.drizzle.team) with [Neon](https://neon.tech) PostgreSQL
- [Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/react) for testing

## Getting Started

Copy the example env file and add your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.com/) and your Neon database URL from the [Neon Console](https://console.neon.tech/):

```bash
cp .env.example .env
```

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` — redirect after sign-in (default: `/everyday-banking`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` — redirect after sign-up (default: `/everyday-banking`)
- `DATABASE_URL` — Neon PostgreSQL connection string (pooler URL recommended)

After signing in, users are redirected to `/everyday-banking`. Seed demo banking data with your Clerk user ID:

```bash
npm run db:seed -- user_YOUR_CLERK_ID
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses Vitest with React Testing Library. Test files should be placed alongside the code they test with `.test.ts` or `.test.tsx` extensions.

```bash
npm run test          # run tests in watch mode
npm run test:ui       # run tests with Vitest UI
npm run test:run      # run tests once (CI mode)
npm run test:coverage # generate coverage report
```

Example test files:
- `src/lib/format.test.ts` — utility function tests
- `src/lib/utils.test.ts` — tailwind merge utility tests
- `src/components/ui/button.test.tsx` — component tests

## Database

Schema lives in `src/db/schema.ts`. The Drizzle client is exported from `src/db/index.ts` for use in Server Components, Route Handlers, and Server Actions.

```bash
npm run db:generate  # generate SQL migrations from schema changes
npm run db:migrate   # apply migrations
npm run db:push      # push schema directly (handy for local dev)
npm run db:studio    # open Drizzle Studio
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

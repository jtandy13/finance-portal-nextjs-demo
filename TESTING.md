# Testing Guide

This project uses [Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/react) for unit and component testing.

## Running Tests

```bash
npm run test          # watch mode (default)
npm run test:ui       # Vitest UI for interactive testing
npm run test:run      # single run (CI mode)
npm run test:coverage # coverage report
```

## File Organization

Place test files alongside the code they test:

```
src/
├── lib/
│   ├── format.ts
│   └── format.test.ts
└── components/
    └── ui/
        ├── button.tsx
        └── button.test.tsx
```

## Test File Patterns

Test files use the `.test.ts` or `.test.tsx` extension and are automatically discovered by Vitest.

### Utility Functions

```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format'

describe('formatCurrency', () => {
  it('formats positive numbers as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })
})
```

### React Components

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles clicks', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

## Configuration

- **Vitest config**: `vitest.config.ts`
- **Test setup**: `src/test/setup.ts` (runs before each test file)
- **Coverage config**: configured in `vitest.config.ts` with v8 provider

## Testing Library Principles

Follow [Testing Library](https://testing-library.com) best practices:

1. **Query by role/label first** — `getByRole('button', { name: /submit/i })`
2. **Avoid implementation details** — test behavior, not internal state
3. **User-centric tests** — interact as a user would (click, type, etc.)
4. **Async user events** — always `await` userEvent interactions

## Coverage

Coverage reports are generated in the `coverage/` directory:

```bash
npm run test:coverage
```

Coverage is configured to exclude:
- `node_modules/`
- Test setup files (`src/test/`)
- Type definitions (`*.d.ts`)
- Config files
- `.next/` build output

## Example Tests

Check these files for testing patterns:
- `src/lib/format.test.ts` — utility testing
- `src/lib/utils.test.ts` — third-party integration testing
- `src/components/ui/button.test.tsx` — component testing

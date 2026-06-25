import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('px-4', 'py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
  })

  it('handles conditional classes with clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('merges tailwind classes correctly with twMerge', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
  })

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })

  it('handles arrays of classes', () => {
    expect(cn(['px-4', 'py-2'], 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
  })
})

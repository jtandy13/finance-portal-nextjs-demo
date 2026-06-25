import { describe, it, expect } from 'vitest'
import { formatCurrency, formatSignedCurrency, formatShortDate, formatPercent } from './format'

describe('formatCurrency', () => {
  it('formats positive numbers as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
    expect(formatCurrency(50.5)).toBe('$50.50')
  })

  it('formats negative numbers as currency', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00')
  })

  it('formats string numbers as currency', () => {
    expect(formatCurrency('1234.56')).toBe('$1,234.56')
  })

  it('formats zero as currency', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatSignedCurrency', () => {
  it('adds plus sign for positive values', () => {
    expect(formatSignedCurrency(1000)).toBe('+$1,000.00')
    expect(formatSignedCurrency(50.5)).toBe('+$50.50')
  })

  it('adds minus sign for negative values', () => {
    expect(formatSignedCurrency(-1000)).toBe('-$1,000.00')
    expect(formatSignedCurrency(-50.5)).toBe('-$50.50')
  })

  it('does not add sign for zero', () => {
    expect(formatSignedCurrency(0)).toBe('$0.00')
  })

  it('handles string input', () => {
    expect(formatSignedCurrency('1234.56')).toBe('+$1,234.56')
    expect(formatSignedCurrency('-1234.56')).toBe('-$1,234.56')
  })
})

describe('formatShortDate', () => {
  it('formats Date objects', () => {
    const date = new Date('2024-06-15')
    const formatted = formatShortDate(date)
    expect(formatted).toMatch(/Jun 1[45]/)
  })

  it('formats ISO date strings', () => {
    const formatted = formatShortDate('2024-12-25')
    expect(formatted).toMatch(/Dec 2[45]/)
  })
})

describe('formatPercent', () => {
  it('formats positive percentages with plus sign', () => {
    expect(formatPercent(5.5)).toBe('+5.5%')
    expect(formatPercent(12.34)).toBe('+12.3%')
  })

  it('formats negative percentages with minus sign', () => {
    expect(formatPercent(-5.5)).toBe('-5.5%')
    expect(formatPercent(-12.34)).toBe('-12.3%')
  })

  it('formats zero without sign', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })

  it('respects custom decimal places', () => {
    expect(formatPercent(5.5678, 0)).toBe('+6%')
    expect(formatPercent(5.5678, 2)).toBe('+5.57%')
    expect(formatPercent(5.5678, 3)).toBe('+5.568%')
  })
})

import { describe, expect, it } from 'vitest'
import { formatPageStatus, isValidUxMode, resolveInitialUxMode, MODES, UX_MODES } from '../../src/features/pdfcomponent/domain/labState.js'

describe('labState helpers', () => {
  it('validates runtime modes and resolves query priority over storage', () => {
    expect(MODES).toEqual(['designer', 'form', 'viewer'])
    expect(UX_MODES).toEqual(['default', 'canvas-first'])
    expect(isValidUxMode('canvas-first')).toBe(true)
    expect(isValidUxMode('invalid')).toBe(false)
    expect(
      resolveInitialUxMode({
        search: '?ux=default',
        storedMode: 'canvas-first',
        fallback: 'canvas-first',
      }),
    ).toBe('default')
  })

  it('falls back to stored mode and safe page labels', () => {
    expect(
      resolveInitialUxMode({
        search: '?ux=invalid',
        storedMode: 'canvas-first',
        fallback: 'default',
      }),
    ).toBe('canvas-first')

    expect(
      formatPageStatus({
        currentPage: 0,
        totalPages: 0,
      }),
    ).toBe('Página 1 / 1')
  })
})

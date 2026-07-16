import { describe, expect, it } from 'vitest'
import { getLabCollaborationSummary } from '@/features/pdfcomponent/domain/labPresentation.js'

describe('features/pdfcomponent/domain/labPresentation', () => {
  it('reuses core access rules for visible, editable and locked counts', () => {
    const summary = getLabCollaborationSummary({
      activeUserId: 'r1',
      isGlobalView: false,
      schemas: [
        {
          id: 'mine',
          ownerRecipientId: 'r1',
        },
        {
          id: 'mine-locked',
          ownerRecipientId: 'r1',
          lock: { lockedBy: 'r1' },
        },
        {
          id: 'other-locked',
          ownerRecipientId: 'r1',
          lock: { lockedBy: 'r2' },
        },
        {
          id: 'object-locked',
          ownerRecipientId: 'r1',
          locked: true,
        },
        {
          id: 'readonly',
          ownerRecipientId: 'r1',
          readonly: true,
        },
        {
          id: 'shared',
          ownerMode: 'shared',
          ownerRecipientIds: ['r1', 'r2'],
        },
        {
          id: 'other-owner',
          ownerRecipientId: 'r2',
        },
      ] as any,
    })

    expect(summary.visibleCount).toBe(6)
    expect(summary.editableCount).toBe(3)
    expect(summary.lockedCount).toBe(2)
  })

  it('shows everything in global view without losing editable counts', () => {
    const summary = getLabCollaborationSummary({
      activeUserId: 'r1',
      isGlobalView: true,
      schemas: [
        {
          id: 'mine',
          ownerRecipientId: 'r1',
        },
        {
          id: 'other-owner',
          ownerRecipientId: 'r2',
        },
      ] as any,
    })

    expect(summary.visibleCount).toBe(2)
    expect(summary.editableCount).toBe(2)
    expect(summary.lockedCount).toBe(0)
  })
})

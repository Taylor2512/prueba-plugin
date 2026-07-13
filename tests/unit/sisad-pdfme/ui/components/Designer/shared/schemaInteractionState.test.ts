import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { resolveSchemaInteractionState } from '@/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState';

const makeSchema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    name: overrides.id,
    type: 'text',
    position: { x: 0, y: 0 },
    width: 10,
    height: 10,
    ...overrides,
  }) as unknown as SchemaForUI;

type InteractionSchemaOverrides = Partial<SchemaForUI> & {
  id: string;
  readOnly?: boolean;
  state?: string;
  lock?: { lockedBy?: string } | null;
};

const makeInteractionSchema = (overrides: InteractionSchemaOverrides): SchemaForUI =>
  makeSchema(overrides);

describe('schemaInteractionState', () => {
  it('keeps assignment enabled for read-only schemas', () => {
    const state = resolveSchemaInteractionState(makeInteractionSchema({ id: 'field-1', readOnly: true }));

    expect(state.isReadOnly).toBe(true);
    expect(state.disabledControls).toContain('edit');
    expect(state.disabledControls).toContain('toggle-required');
    expect(state.disabledControls).not.toContain('assign-recipient');
  });

  it('keeps assignment enabled for locked schemas', () => {
    const state = resolveSchemaInteractionState(makeInteractionSchema({ id: 'field-2', state: 'locked' }));

    expect(state.isLocked).toBe(true);
    expect(state.visibleBadge).toEqual({ label: 'Bloqueado para edición', color: 'error' });
    expect(state.disabledControls).toContain('toggle-visibility');
    expect(state.disabledControls).not.toContain('assign-recipient');
  });
});

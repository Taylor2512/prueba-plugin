import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { resolveSchemaInteractionState } from '@/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState';
import { resolveSchemaAccessState } from '@/sisad-pdfme/ui/collaboration/schemaRuntimeAccess';

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
  readonly?: boolean;
  locked?: boolean;
  state?: string;
  lock?: { lockedBy?: string | null; ownerUserId?: string | null; reason?: string | null } | null;
};

const makeInteractionSchema = (overrides: InteractionSchemaOverrides): SchemaForUI =>
  makeSchema(overrides);

const makeCollaborationContext = (overrides: Record<string, unknown> = {}) =>
  ({
    recipientOptions: [],
    recipientColorMap: new Map(),
    recipientNameMap: new Map(),
    activeRecipientId: 'recipient-1',
    activeRecipient: { id: 'recipient-1', name: 'Cliente Principal', role: 'signer', color: '#2563EB' },
    isGlobalView: false,
    actorColor: '#2563EB',
    canEditStructure: true,
    actorId: 'actor-1',
    ...overrides,
  }) as any;

describe('schemaInteractionState', () => {
  it('resolves available schemas without flags', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-0', ownerRecipientId: 'recipient-owner' }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.collaborationLock).toBe('none');
    expect(state.statusLabel).toBe('Disponible');
    expect(state.objectLocked).toBe(false);
    expect(state.readonly).toBe(false);
    expect(state.canEditProperties).toBe(true);
    expect(state.canMove).toBe(true);
    expect(state.canResize).toBe(true);
    expect(state.canDelete).toBe(true);
    expect(state.canReassign).toBe(true);
    expect(state.lockOwnerId).toBeNull();
  });

  it('resolves my collaboration lock from schema.lock.lockedBy', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-1', state: 'locked', lock: { lockedBy: 'actor-1' } }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.collaborationLock).toBe('mine');
    expect(state.statusLabel).toBe('En edición por ti');
    expect(state.canEditProperties).toBe(true);
    expect(state.canReassign).toBe(true);
    expect(state.visibleBadge).toEqual({ label: 'En edición por ti', color: 'success' });
  });

  it('resolves another actor lock from schema.lock.lockedBy', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-2', state: 'locked', lock: { lockedBy: 'actor-2' } }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.collaborationLock).toBe('other');
    expect(state.statusLabel).toBe('Bloqueado por actor-2');
    expect(state.canEditProperties).toBe(false);
    expect(state.canReassign).toBe(false);
    expect(state.visibleBadge).toEqual({ label: 'Bloqueado por actor-2', color: 'error' });
  });

  it('keeps object locks separate from collaboration locks', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-3', locked: true }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.objectLocked).toBe(true);
    expect(state.statusLabel).toBe('Posición bloqueada');
    expect(state.canEditProperties).toBe(true);
    expect(state.canMove).toBe(false);
    expect(state.canResize).toBe(false);
    expect(state.canReassign).toBe(true);
  });

  it('marks readonly schemas as solo lectura without hiding reassignment', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-4', readOnly: true }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.readonly).toBe(true);
    expect(state.statusLabel).toBe('Solo lectura');
    expect(state.canEditProperties).toBe(false);
    expect(state.canReassign).toBe(true);
    expect(state.disabledControls).toContain('edit');
    expect(state.disabledControls).toContain('toggle-required');
  });

  it('treats readonly alias the same way', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-5', readonly: true }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.readonly).toBe(true);
    expect(state.statusLabel).toBe('Solo lectura');
  });

  it('keeps object locks and my collaboration lock independent', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-6', locked: true, lock: { lockedBy: 'actor-1' } }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.collaborationLock).toBe('mine');
    expect(state.objectLocked).toBe(true);
    expect(state.statusLabel).toBe('En edición por ti');
    expect(state.canMove).toBe(false);
    expect(state.canReassign).toBe(true);
  });

  it('keeps object locks and another actor lock independent', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-7', locked: true, lock: { lockedBy: 'actor-2' } }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.collaborationLock).toBe('other');
    expect(state.objectLocked).toBe(true);
    expect(state.statusLabel).toBe('Bloqueado por actor-2');
    expect(state.canEditProperties).toBe(false);
    expect(state.canReassign).toBe(false);
  });

  it('marks structure permission gaps explicitly', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({ id: 'field-8' }),
      { collaborationContext: makeCollaborationContext({ canEditStructure: false }) },
    );

    expect(state.statusLabel).toBe('Sin permiso de edición');
    expect(state.canEditProperties).toBe(false);
    expect(state.canReassign).toBe(false);
    expect(state.visibleBadge).toEqual({ label: 'Sin permiso de edición', color: 'error' });
  });

  it('keeps lock owner data separate from ownerRecipientId', () => {
    const state = resolveSchemaInteractionState(
      makeInteractionSchema({
        id: 'field-9',
        ownerRecipientId: 'recipient-owner',
      }),
      { collaborationContext: makeCollaborationContext() },
    );

    expect(state.lockOwnerId).toBeNull();
    expect(state.statusLabel).toBe('Disponible');
  });

  it('resolves access state labels for collaboration actions', () => {
    const ownLock = resolveSchemaAccessState(
      makeInteractionSchema({ id: 'field-10', state: 'locked', lock: { lockedBy: 'actor-1' } }),
      makeCollaborationContext(),
      makeCollaborationContext().activeRecipient,
    );

    expect(ownLock.canReassign).toBe(true);
    expect(ownLock.contextMenuLockLabel).toBe('Liberar edición');
    expect(ownLock.contextMenuLockDisabled).toBe(false);

    const otherLock = resolveSchemaAccessState(
      makeInteractionSchema({ id: 'field-11', state: 'locked', lock: { lockedBy: 'actor-2' } }),
      makeCollaborationContext(),
      makeCollaborationContext().activeRecipient,
    );

    expect(otherLock.canReassign).toBe(false);
    expect(otherLock.contextMenuLockLabel).toBe('Bloqueado por actor-2');
    expect(otherLock.contextMenuLockDisabled).toBe(true);
  });
});

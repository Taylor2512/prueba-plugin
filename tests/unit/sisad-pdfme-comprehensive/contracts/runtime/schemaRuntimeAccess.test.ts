import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@/sisad-pdfme/common';
import { resolveRuntimeSchemaAccess } from '@/sisad-pdfme/ui/collaboration/schemaRuntimeAccess';

const context = (activeRecipientId: string | null = 'user-a', isGlobalView = false) => ({
  recipientColorMap: new Map<string, string>(),
  recipientNameMap: new Map<string, string>(),
  activeRecipientId,
  activeRecipient: null,
  isGlobalView,
  actorColor: null,
  canEditStructure: true,
  actorId: activeRecipientId,
});

const schema = (overrides: Record<string, unknown> = {}) => ({
  id: 'schema-1',
  name: 'field',
  type: 'text',
  content: '',
  readOnly: false,
  ...overrides,
}) as unknown as SchemaForUI;

describe('resolveRuntimeSchemaAccess Form policy', () => {
  it('keeps an unassigned schema editable in Form', () => {
    expect(resolveRuntimeSchemaAccess(schema(), 'form', context())).toMatchObject({
      visible: true,
      editable: true,
      readonly: false,
      reason: 'no-owner',
    });
  });

  it('allows the active owner and shared schemas', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'user-a' }), 'form', context()).editable).toBe(true);
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientIds: ['user-a', 'user-b'] }), 'form', context()).editable).toBe(true);
  });

  it('does not expose another recipient as editable', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'user-b' }), 'form', context())).toMatchObject({
      visible: false,
      editable: false,
      readonly: true,
      reason: 'otherrecipient',
    });
  });

  it('preserves readonly and locked precedence', () => {
    expect(resolveRuntimeSchemaAccess(schema({ readOnly: true }), 'form', context()).editable).toBe(false);
    expect(resolveRuntimeSchemaAccess(schema({ locked: true }), 'form', context()).editable).toBe(false);
  });

  it('keeps Viewer and PDF readonly, including unassigned schemas', () => {
    expect(resolveRuntimeSchemaAccess(schema(), 'viewer', context()).editable).toBe(false);
    expect(resolveRuntimeSchemaAccess(schema(), 'pdf', context()).editable).toBe(false);
  });

  it('keeps global Form view readonly for another recipient', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'user-b' }), 'form', context(null, true))).toMatchObject({
      visible: true,
      editable: false,
      readonly: true,
      reason: 'global-view',
    });
  });

  it('keeps global Form view readonly for unassigned schemas', () => {
    expect(resolveRuntimeSchemaAccess(schema(), 'form', context(null, true))).toMatchObject({
      visible: true,
      editable: false,
      readonly: true,
      reason: 'global-view',
    });
  });
});

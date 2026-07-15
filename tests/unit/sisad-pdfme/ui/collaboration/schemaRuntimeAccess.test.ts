import { describe, it, expect } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  resolveRuntimeSchemaAccess,
  countRuntimeAccess,
} from '@/sisad-pdfme/ui/collaboration/schemaRuntimeAccess';

const ctx = (over: Partial<{ activeRecipientId: string | null; isGlobalView: boolean; canEditStructure: boolean }> = {}) => ({
  recipientColorMap: new Map<string, string>([['r1', '#111'], ['r2', '#222']]),
  recipientNameMap: new Map<string, string>([['r1', 'Uno'], ['r2', 'Dos']]),
  activeRecipientId: 'r1' as string | null,
  activeRecipient: null,
  isGlobalView: false,
  actorColor: '#000',
  canEditStructure: true,
  ...over,
});

const schema = (over: Record<string, unknown> = {}): SchemaForUI =>
  ({ id: 's', type: 'text', name: 's', position: { x: 0, y: 0 }, width: 10, height: 10, ...over } as unknown as SchemaForUI);

describe('schemaRuntimeAccess', () => {
  it('hidden: invisible + non-editable in every mode', () => {
    const a = resolveRuntimeSchemaAccess(schema({ hidden: true, ownerRecipientId: 'r1' }), 'form', ctx());
    expect(a.visible).toBe(false);
    expect(a.editable).toBe(false);
    expect(a.reason).toBe('hidden');
  });

  it('designer + user view: honors recipient filtering (not show-all)', () => {
    // Other recipient's schema is invisible even in designer when not global.
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r2' }), 'designer', ctx()).visible).toBe(false);
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r2' }), 'designer', ctx()).reason).toBe('other-recipient');
    // Active owner / no-owner / shared are visible + structurally editable.
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'designer', ctx()).editable).toBe(true);
    expect(resolveRuntimeSchemaAccess(schema({}), 'designer', ctx()).visible).toBe(true); // no-owner contextual
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1', locked: true }), 'designer', ctx()).editable).toBe(false);
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'designer', ctx({ canEditStructure: false })).editable).toBe(false);
  });

  it('designer + global view: all non-hidden visible', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r2' }), 'designer', ctx({ isGlobalView: true })).visible).toBe(true);
  });

  it('form + user view: only active owner editable, other recipient invisible', () => {
    const own = resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'form', ctx());
    expect(own.visible).toBe(true);
    expect(own.editable).toBe(true);
    expect(own.reason).toBe('active-owner');

    const other = resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r2' }), 'form', ctx());
    expect(other.visible).toBe(false);
    expect(other.editable).toBe(false);
    expect(other.reason).toBe('other-recipient');
  });

  it('form: ownerRecipientIds membership grants visibility', () => {
    const a = resolveRuntimeSchemaAccess(schema({ ownerRecipientIds: ['r2', 'r1'], ownerMode: 'multi' }), 'form', ctx());
    expect(a.visible).toBe(true);
    expect(a.editable).toBe(true);
  });

  it('form: shared schema visible + editable for anyone', () => {
    const a = resolveRuntimeSchemaAccess(schema({ ownerRecipientIds: ['r2'], ownerMode: 'shared' }), 'form', ctx());
    expect(a.visible).toBe(true);
    expect(a.editable).toBe(true);
    expect(a.reason).toBe('shared');
  });

  it('form: locked/readonly visible but not editable', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1', locked: true }), 'form', ctx()).reason).toBe('locked');
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1', readOnly: true }), 'form', ctx()).editable).toBe(false);
  });

  it('global view: all visible, only active recipient editable', () => {
    const other = resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r2' }), 'form', ctx({ isGlobalView: true }));
    expect(other.visible).toBe(true);
    expect(other.editable).toBe(false);
    expect(other.reason).toBe('global-view');
  });

  it('viewer + pdf: never editable', () => {
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'viewer', ctx()).editable).toBe(false);
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'viewer', ctx()).readonly).toBe(true);
    expect(resolveRuntimeSchemaAccess(schema({ ownerRecipientId: 'r1' }), 'pdf', ctx()).editable).toBe(false);
  });

  it('ownerColor: taken from schema, stable across active recipient changes', () => {
    const s = schema({ ownerRecipientId: 'r2', ownerColor: '#abcdef' });
    expect(resolveRuntimeSchemaAccess(s, 'form', ctx({ activeRecipientId: 'r1', isGlobalView: true })).ownerColor).toBe('#abcdef');
    expect(resolveRuntimeSchemaAccess(s, 'form', ctx({ activeRecipientId: 'r2', isGlobalView: true })).ownerColor).toBe('#abcdef');
  });

  it('countRuntimeAccess: parity with per-schema rule', () => {
    const schemas = [
      schema({ id: 'a', ownerRecipientId: 'r1' }),
      schema({ id: 'b', ownerRecipientId: 'r2' }),
      schema({ id: 'c', ownerRecipientId: 'r1', locked: true }),
      schema({ id: 'd', hidden: true }),
    ];
    const counts = countRuntimeAccess(schemas, 'form', ctx());
    expect(counts.visible).toBe(2); // a + c (r1); b other, d hidden
    expect(counts.editable).toBe(1); // a only
    expect(counts.locked).toBe(1); // c
  });
});

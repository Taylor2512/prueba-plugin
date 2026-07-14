/**
 * TASK-PDFME-006 — la reasignación del diseñador debe voltear los derechos de
 * edición del Form runtime: el destinatario anterior pierde el campo y el
 * nuevo lo gana, usando el MISMO service de reasignación y el MISMO resolver
 * de acceso runtime (sin renderer paralelo).
 */
import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { resolveRuntimeSchemaAccess } from '@/sisad-pdfme/ui/collaboration/schemaRuntimeAccess';
import { assignSchemaOwner } from '@/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService';

const ctx = (activeRecipientId: string | null) => ({
  recipientColorMap: new Map<string, string>([
    ['client', '#2563EB'],
    ['guarantor', '#DC2626'],
  ]),
  recipientNameMap: new Map<string, string>([
    ['client', 'Cliente Principal'],
    ['guarantor', 'Avalista'],
  ]),
  activeRecipientId,
  activeRecipient: null,
  isGlobalView: false,
  actorColor: null,
  canEditStructure: true,
});

const makeSchema = (over: Record<string, unknown> = {}): SchemaForUI =>
  ({
    id: 'field-1',
    schemaUid: 'uid-field-1',
    type: 'text',
    name: 'field-1',
    position: { x: 0, y: 0 },
    width: 90,
    height: 10,
    ...over,
  } as unknown as SchemaForUI);

describe('form runtime access after designer reassignment', () => {
  it('previous recipient loses edit rights and the new one gains them', () => {
    const pages: SchemaForUI[][] = [[makeSchema({ ownerRecipientId: 'client' })]];

    // Antes de reasignar: el cliente edita; el avalista ni siquiera lo ve.
    expect(resolveRuntimeSchemaAccess(pages[0][0], 'form', ctx('client')).editable).toBe(true);
    expect(resolveRuntimeSchemaAccess(pages[0][0], 'form', ctx('guarantor')).visible).toBe(false);

    const { pages: nextPages, changedSchemaUids } = assignSchemaOwner({
      pages,
      schemaUids: ['uid-field-1'],
      recipient: { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
      actorId: 'client',
    });
    expect(changedSchemaUids).toEqual(['uid-field-1']);
    const reassigned = nextPages[0][0];

    // Después: el avalista edita; el cliente pierde acceso.
    const newOwner = resolveRuntimeSchemaAccess(reassigned, 'form', ctx('guarantor'));
    expect(newOwner.visible).toBe(true);
    expect(newOwner.editable).toBe(true);
    expect(newOwner.reason).toBe('active-owner');
    expect(newOwner.ownerColor).toBe('#DC2626');

    const previousOwner = resolveRuntimeSchemaAccess(reassigned, 'form', ctx('client'));
    expect(previousOwner.visible).toBe(false);
    expect(previousOwner.editable).toBe(false);
    expect(previousOwner.reason).toBe('other-recipient');
  });

  it('locked schemas stay non-editable for the new owner after reassignment', () => {
    const pages: SchemaForUI[][] = [[makeSchema({ ownerRecipientId: 'client', locked: true })]];
    const { pages: nextPages } = assignSchemaOwner({
      pages,
      schemaUids: ['uid-field-1'],
      recipient: { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
    });

    const access = resolveRuntimeSchemaAccess(nextPages[0][0], 'form', ctx('guarantor'));
    expect(access.visible).toBe(true);
    expect(access.editable).toBe(false);
  });

  it('viewer mode never grants editing, even to the new owner', () => {
    const pages: SchemaForUI[][] = [[makeSchema({ ownerRecipientId: 'client' })]];
    const { pages: nextPages } = assignSchemaOwner({
      pages,
      schemaUids: ['uid-field-1'],
      recipient: { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
    });

    const access = resolveRuntimeSchemaAccess(nextPages[0][0], 'viewer', ctx('guarantor'));
    expect(access.editable).toBe(false);
  });
});

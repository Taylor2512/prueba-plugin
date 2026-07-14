/**
 * TASK-PDFME-007 — la reasignación hecha en el diseñador debe sobrevivir el
 * roundtrip snapshot: serialize → deserialize conserva ownership, colores y
 * assignments coherentes con los schemas.
 */
import { describe, expect, test } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { snapshotAdapter, type DesignerState } from '@/sisad-pdfme/shared/snapshotAdapter';
import { assignSchemaOwner } from '@/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService';
import { buildRecipientAssignments } from '@/sisad-pdfme/assignments';

const makeSchema = (over: Record<string, unknown> = {}) =>
  ({
    id: 'field-1',
    schemaUid: 'uid-field-1',
    type: 'text',
    name: 'field-1',
    position: { x: 18, y: 24 },
    width: 92,
    height: 12,
    fileId: 'doc-1',
    pageNumber: 1,
    ownerRecipientId: 'client',
    ownerRecipientIds: ['client'],
    recipientId: 'client',
    ownerColor: '#2563EB',
    locked: true,
    ...over,
  } as unknown as SchemaForUI);

const buildState = (schemas: SchemaForUI[]): DesignerState => ({
  documents: [
    {
      documentId: 'doc-1',
      name: 'Documento 1',
      order: 1,
      pages: [
        {
          pageNumber: 1,
          schemas: schemas as never[],
          background: { mode: 'url', value: 'https://example.test/page-1.png' } as never,
        },
      ],
    },
  ],
  recipients: [
    { id: 'client', name: 'Cliente Principal', color: '#2563EB' },
    { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
  ],
  assignments: [],
  signatureConfig: { defaultMode: 'draw', allowedModes: ['draw', 'p12', 'provider'] },
  providerConfig: { defaultProvider: 'oneshot', allowedProviders: ['oneshot'] },
});

describe('snapshot persistence after reassignment', () => {
  test('serialize → deserialize preserva ownership reasignado, color y locks', () => {
    const { pages } = assignSchemaOwner({
      pages: [[makeSchema()]],
      schemaUids: ['uid-field-1'],
      recipient: { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
      actorId: 'client',
    });

    const state = buildState(pages[0]);
    state.assignments = [
      { schemaUid: 'uid-field-1', recipientId: 'guarantor', scope: 'recipient' },
    ];

    const snapshot = snapshotAdapter.serialize(
      state,
      { name: 'contrato', createdByUserId: 'user-1' },
      { backgroundMode: 'url' },
    );
    const restored = snapshotAdapter.deserialize(snapshot);

    const schema = restored.documents[0].pages[0].schemas[0] as Record<string, unknown>;
    expect(schema.ownerRecipientId).toBe('guarantor');
    expect(schema.ownerRecipientIds).toEqual(['guarantor']);
    expect(schema.recipientId).toBe('guarantor');
    expect(schema.ownerRecipientName).toBe('Avalista');
    expect(schema.ownerColor).toBe('#DC2626');
    expect(schema.recipientColor).toBe('#DC2626');
    expect(schema.userColor).toBe('#DC2626');
    expect(schema.lastModifiedBy).toBe('client');
    // Invariantes: lock y geometría intactos tras el roundtrip.
    expect(schema.locked).toBe(true);
    expect(schema.width).toBe(92);
    expect(schema.height).toBe(12);

    expect(restored.recipients.map((r) => r.id)).toEqual(['client', 'guarantor']);
    expect(restored.assignments).toEqual([
      { schemaUid: 'uid-field-1', recipientId: 'guarantor', scope: 'recipient' },
    ]);
    expect(restored.signatureConfig.defaultMode).toBe('draw');
    expect(restored.providerConfig.defaultProvider).toBe('oneshot');
  });

  test('los assignments derivados de schemas reflejan la reasignación', () => {
    const { pages } = assignSchemaOwner({
      pages: [[makeSchema()]],
      schemaUids: ['uid-field-1'],
      recipient: { id: 'guarantor', name: 'Avalista', color: '#DC2626' },
    });

    const assignments = buildRecipientAssignments(pages as never);
    expect(Object.keys(assignments)).toEqual(['guarantor']);
    expect(assignments.guarantor['doc-1']['1']).toEqual(['uid-field-1']);
  });
});

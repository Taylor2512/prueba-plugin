import { describe, expect, test } from 'vitest';
import { makeEmptySnapshot } from '@/sisad-pdfme/shared/snapshot.js';
import {
  snapshotAdapter,
  resolveSnapshotConnectivityByFile,
  resolveSnapshotConnectivityBySchema,
  type DesignerState,
} from '@/sisad-pdfme/shared/snapshotAdapter.js';

const baseState: DesignerState = {
  templateSchemaVersion: '3.1.0',
  activeDocumentId: 'doc-1',
  documents: [
    {
      documentId: 'doc-1',
      name: 'Documento 1',
      order: 0,
      pages: [
        {
          pageNumber: 1,
          background: { type: 'none' as const },
          schemas: [
            {
              id: 'schema-1',
              name: 'field_name',
              type: 'text',
              content: 'Hola',
              position: { x: 10, y: 12 },
              width: 80,
              height: 20,
              __designer: {
                schemaUid: 'uid-1',
                templateVersion: '2.0.0',
                documentId: 'doc-1',
                pageNumber: 1,
                recipientId: 'recipient-1',
                recipientName: 'Cliente Principal',
                recipientColor: '#2563EB',
                version: 0,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
              },
            },
          ],
        },
      ],
    },
  ],
  uploadedDocuments: [
    {
      documentId: 'doc-1',
      name: 'Documento 1',
      order: 0,
      pages: [],
    },
  ],
  recipients: [
    { id: 'recipient-1', name: 'Cliente Principal', color: '#2563EB' },
  ],
  assignments: [
    { schemaUid: 'uid-1', recipientId: 'recipient-1', scope: 'recipient' as const },
  ],
  connectivity: {
    byFile: {
      'doc-1': { route: 'step-two' },
    },
  },
  inputs: [{ field_1: 'value-1' }],
  contributors: [{ id: 'user-1', name: 'Reviewer', role: 'editor' }],
  history: [{ id: 'evt-1', type: 'schema.updated', timestamp: 1 }],
  signatureConfig: { defaultMode: 'draw' as const, allowedModes: ['draw'] },
  signaturePolicyId: 'sisad',
  signatureMode: 'draw',
  signatureProviderKey: null,
  providerConfig: { defaultProvider: 'draw', allowedProviders: ['draw'] },
  delivery: { channel: 'email' },
  message: { subject: 'Guardar borrador' },
  security: { visibility: 'internal' },
  comments: [
    {
      commentId: 'c-1',
      schemaUid: 'uid-1',
      authorUserId: 'user-1',
      authorName: 'Reviewer',
      text: 'OK',
      createdAt: '2026-01-01T00:00:00.000Z',
      resolved: false,
    },
  ],
};

describe('snapshotAdapter', () => {
  test('serializes and deserializes designer state without losing critical contract', () => {
    const snapshot = snapshotAdapter.serialize(baseState, {
      name: 'Template de prueba',
      createdByUserId: 'user-1',
    });

    expect(snapshot.version).toBe('2.0.0');
    expect(snapshot.templateSchemaVersion).toBe('3.1.0');
    expect(snapshot.activeDocumentId).toBe('doc-1');
    expect(snapshot.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#2563EB');
    expect(snapshot.uploadedDocuments).toHaveLength(1);
    expect(snapshot.connectivity?.byFile?.['doc-1']).toMatchObject({ route: 'step-two' });
    expect(resolveSnapshotConnectivityByFile(snapshot, 'doc-1')).toMatchObject({ route: 'step-two' });
    expect(
      resolveSnapshotConnectivityBySchema(
        {
          ...snapshot,
          connectivity: {
            bySchema: {
              'doc-1': {
                'uid-1': {
                  indexId: 'index-1',
                  indexName: 'Nro. Documento',
                  schemaName: 'field_name',
                  schemaType: 'text',
                },
              },
            },
          },
        },
        'doc-1',
        'uid-1',
      ),
    ).toMatchObject({
      indexId: 'index-1',
      indexName: 'Nro. Documento',
      schemaName: 'field_name',
      schemaType: 'text',
    });
    expect(snapshot.inputs).toHaveLength(1);
    expect(snapshot.contributors).toHaveLength(1);
    expect(snapshot.history).toHaveLength(1);
    expect(snapshot.signaturePolicyId).toBe('sisad');
    expect(snapshot.signatureMode).toBe('draw');

    const restored = snapshotAdapter.deserialize(snapshot);
    expect(restored.documents).toHaveLength(1);
    expect(restored.recipients).toHaveLength(1);
    expect(restored.assignments).toHaveLength(1);
    expect(restored.comments).toHaveLength(1);
    expect(restored.activeDocumentId).toBe('doc-1');
    expect(restored.signaturePolicyId).toBe('sisad');
  });

  test('migrates legacy snapshots and preserves recipient color precedence', () => {
    const migrated = snapshotAdapter.migrate({
      name: 'Legacy template',
      schemas: [[
        {
          id: 'legacy-1',
          name: 'legacy_field',
          type: 'text',
          content: 'legacy',
          position: { x: 1, y: 2 },
          width: 80,
          height: 18,
          ownerRecipientId: 'recipient-1',
          ownerColor: '#112233',
        },
      ]],
      basePdf: 'data:application/pdf;base64,AAA=',
      singType: 'oneshot',
      connectivityMapping: {
        'legacy-doc': { route: 'connected' },
      },
    });

    expect(migrated.version).toBe('2.0.0');
    expect(migrated.documents[0]?.pages[0]?.background.type).toBe('base64');
    expect(migrated.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#112233');
    expect(migrated.signaturePolicyId).toBe('oneshot');
    expect(migrated.signatureMode).toBe('provider');
    expect(migrated.connectivity?.byFile?.['legacy-doc']).toMatchObject({ route: 'connected' });
  });

  test('normalizes connectivity helper lookups when bySchema is nested by file', () => {
    const snapshot = makeEmptySnapshot({
      connectivity: {
        byFile: {
          'doc-2': {
            cabinetId: 'cab-1',
            folderId: 'fold-1',
            subfolderId: 'sub-1',
            fileTypeId: 'ft-1',
          },
        },
        bySchema: {
          'doc-2': {
            'uid-2': {
              indexId: 'idx-2',
              indexName: 'Cliente',
              schemaName: 'customer',
              schemaType: 'text',
            },
          },
        },
      },
    });

    expect(resolveSnapshotConnectivityByFile(snapshot, 'doc-2')).toMatchObject({
      cabinetId: 'cab-1',
      folderId: 'fold-1',
      subfolderId: 'sub-1',
      fileTypeId: 'ft-1',
    });
    expect(resolveSnapshotConnectivityBySchema(snapshot, 'doc-2', 'uid-2')).toMatchObject({
      indexId: 'idx-2',
      indexName: 'Cliente',
      schemaName: 'customer',
      schemaType: 'text',
    });
  });

  test('preserves checkboxGroup options, selectedOptionIds and group metadata in round-trip', () => {
    const state: DesignerState = {
      ...baseState,
      documents: [
        {
          documentId: 'doc-1',
          name: 'Documento 1',
          order: 0,
          pages: [
            {
              pageNumber: 1,
              background: { type: 'none' as const },
              schemas: [
                {
                  id: 'schema-checkbox-group-1',
                  name: 'beneficios',
                  type: 'checkboxGroup',
                  position: { x: 10, y: 20 },
                  width: 40,
                  height: 24,
                  options: [
                    { optionId: 'option_1', label: 'Décimos' },
                    { optionId: 'option_2', label: 'Fondos' },
                  ],
                  selectedOptionIds: ['option_1'],
                  content: 'option_1',
                  __designer: {
                    schemaUid: 'uid-checkbox-group-1',
                    templateVersion: '2.0.0',
                    documentId: 'doc-1',
                    pageNumber: 1,
                    recipientId: 'recipient-1',
                    recipientColor: '#2563EB',
                    version: 0,
                    createdAt: '2026-01-01T00:00:00.000Z',
                    updatedAt: '2026-01-01T00:00:00.000Z',
                    group: {
                      groupId: 'group-checkbox-1',
                      groupType: 'checkbox',
                      groupName: 'Beneficios',
                      lockedAsGroup: true,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const snapshot = snapshotAdapter.serialize(state, { name: 't', createdByUserId: 'u' });
    const restored = snapshotAdapter.deserialize(snapshot);
    const schema = restored.documents[0]?.pages[0]?.schemas[0] as Record<string, unknown>;

    expect(schema.type).toBe('checkboxGroup');
    expect(schema.options).toHaveLength(2);
    expect(schema.selectedOptionIds).toEqual(['option_1']);
    const group = (schema.__designer as { group?: Record<string, unknown> }).group;
    expect(group?.groupId).toBe('group-checkbox-1');
    expect(group?.groupType).toBe('checkbox');
    expect(group?.lockedAsGroup).toBe(true);
    expect((schema.__designer as Record<string, unknown>).recipientColor).toBe('#2563EB');
  });

  test('preserves radioGroup options, selectedOptionId and group metadata in round-trip', () => {
    const state: DesignerState = {
      ...baseState,
      documents: [
        {
          documentId: 'doc-1',
          name: 'Documento 1',
          order: 0,
          pages: [
            {
              pageNumber: 1,
              background: { type: 'none' as const },
              schemas: [
                {
                  id: 'schema-radio-group-1',
                  name: 'opciones',
                  type: 'radioGroup',
                  position: { x: 10, y: 20 },
                  width: 40,
                  height: 24,
                  options: [
                    { optionId: 'option_1', label: 'A' },
                    { optionId: 'option_2', label: 'B' },
                  ],
                  selectedOptionId: 'option_2',
                  content: 'option_2',
                  __designer: {
                    schemaUid: 'uid-radio-group-1',
                    templateVersion: '2.0.0',
                    documentId: 'doc-1',
                    pageNumber: 1,
                    recipientId: 'recipient-1',
                    recipientColor: '#2563EB',
                    version: 0,
                    createdAt: '2026-01-01T00:00:00.000Z',
                    updatedAt: '2026-01-01T00:00:00.000Z',
                    group: {
                      groupId: 'group-radio-1',
                      groupType: 'radio',
                      groupName: 'Opciones',
                      lockedAsGroup: true,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const snapshot = snapshotAdapter.serialize(state, { name: 't', createdByUserId: 'u' });
    const restored = snapshotAdapter.deserialize(snapshot);
    const schema = restored.documents[0]?.pages[0]?.schemas[0] as Record<string, unknown>;

    expect(schema.type).toBe('radioGroup');
    expect(schema.options).toHaveLength(2);
    expect(schema.selectedOptionId).toBe('option_2');
    const group = (schema.__designer as { group?: Record<string, unknown> }).group;
    expect(group?.groupId).toBe('group-radio-1');
    expect(group?.groupType).toBe('radio');
    expect(group?.lockedAsGroup).toBe(true);
  });

  test('legacy migration preserves an existing __designer.group', () => {
    const migrated = snapshotAdapter.migrate({
      name: 'Legacy with group',
      schemas: [[
        {
          id: 'legacy-group-1',
          name: 'beneficios',
          type: 'checkboxGroup',
          position: { x: 1, y: 2 },
          width: 40,
          height: 24,
          options: [{ optionId: 'option_1', label: 'A' }],
          selectedOptionIds: ['option_1'],
          ownerColor: '#112233',
          __designer: {
            group: { groupId: 'g-1', groupType: 'checkbox', groupName: 'Beneficios', lockedAsGroup: true },
          },
        },
      ]],
      basePdf: 'data:application/pdf;base64,AAA=',
    });

    const schema = migrated.documents[0]?.pages[0]?.schemas[0] as Record<string, unknown>;
    const group = (schema.__designer as { group?: Record<string, unknown> }).group;
    expect(group?.groupId).toBe('g-1');
    expect(group?.groupType).toBe('checkbox');
  });

  test('validates official snapshot shape', () => {
    const snapshot = makeEmptySnapshot();
    expect(snapshotAdapter.validate(snapshot)).toEqual({ valid: true, errors: [] });
    expect(snapshotAdapter.validate(null)).toEqual({ valid: false, errors: ['El snapshot no es un objeto válido'] });
  });
});

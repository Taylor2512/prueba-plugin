import { describe, expect, test } from 'vitest';
import { makeEmptySnapshot } from '@/sisad-pdfme/shared/snapshot.js';
import { snapshotAdapter } from '@/sisad-pdfme/shared/snapshotAdapter.js';

const baseState = {
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
  recipients: [
    { id: 'recipient-1', name: 'Cliente Principal', color: '#2563EB' },
  ],
  assignments: [
    { schemaUid: 'uid-1', recipientId: 'recipient-1', scope: 'recipient' as const },
  ],
  signatureConfig: { defaultMode: 'draw' as const, allowedModes: ['draw'] },
  providerConfig: { defaultProvider: 'draw', allowedProviders: ['draw'] },
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
    expect(snapshot.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#2563EB');

    const restored = snapshotAdapter.deserialize(snapshot);
    expect(restored.documents).toHaveLength(1);
    expect(restored.recipients).toHaveLength(1);
    expect(restored.assignments).toHaveLength(1);
    expect(restored.comments).toHaveLength(1);
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
    });

    expect(migrated.version).toBe('2.0.0');
    expect(migrated.documents[0]?.pages[0]?.background.type).toBe('base64');
    expect(migrated.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#112233');
  });

  test('preserves checkboxGroup options, selectedOptionIds and group metadata in round-trip', () => {
    const state = {
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

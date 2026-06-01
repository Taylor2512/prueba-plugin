import { describe, expect, test } from 'vitest';
import { makeEmptySnapshot } from '../../src/sisad-pdfme/shared/snapshot.js';
import { snapshotAdapter } from '../../src/sisad-pdfme/shared/snapshotAdapter.js';

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

  test('validates official snapshot shape', () => {
    const snapshot = makeEmptySnapshot();
    expect(snapshotAdapter.validate(snapshot)).toEqual({ valid: true, errors: [] });
    expect(snapshotAdapter.validate(null)).toEqual({ valid: false, errors: ['El snapshot no es un objeto válido'] });
  });
});

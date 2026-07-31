import { expect, test } from '@playwright/test';
import { snapshotAdapter } from '../../src/sisad-pdfme/shared/snapshotAdapter.js';

test.describe('detail-view snapshot contract', () => {
  test('roundtrips schema metadata, comments and assignments', () => {
    const snapshot = snapshotAdapter.serialize(
      {
        documents: [
          {
            documentId: 'doc-1',
            name: 'Documento',
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
        recipients: [{ id: 'recipient-1', name: 'Cliente Principal', color: '#2563EB' }],
        assignments: [{ schemaUid: 'uid-1', recipientId: 'recipient-1', scope: 'recipient' as const }],
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
      },
      { name: 'Template', createdByUserId: 'user-1' },
    );

    const restored = snapshotAdapter.deserialize(snapshot);
    expect(snapshot.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#2563EB');
    expect(restored.recipients[0]?.color).toBe('#2563EB');
    expect(restored.assignments[0]?.recipientId).toBe('recipient-1');
    expect(restored.comments?.[0]?.text).toBe('OK');
  });

  test('migrates imported snapshots without losing owner data', () => {
    const migrated = snapshotAdapter.migrate({
      name: 'Imported',
      schemas: [[
        {
          id: 'source-1',
          name: 'source_name',
          type: 'text',
          content: 'source',
          position: { x: 1, y: 2 },
          width: 50,
          height: 18,
          ownerRecipientId: 'recipient-9',
          ownerRecipientName: 'Firmante',
          ownerColor: '#0f172a',
        },
      ]],
      basePdf: 'data:application/pdf;base64,AAA=',
    });

    expect(migrated.version).toBe('2.0.0');
    expect(migrated.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientId).toBe('recipient-9');
    expect(migrated.documents[0]?.pages[0]?.schemas[0]?.__designer.recipientColor).toBe('#0f172a');
    expect(migrated.documents[0]?.pages[0]?.background.type).toBe('base64');
    expect(snapshotAdapter.validate(migrated).valid).toBe(true);
  });
});

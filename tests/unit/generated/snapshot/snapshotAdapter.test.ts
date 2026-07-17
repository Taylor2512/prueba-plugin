import { describe, expect, it } from 'vitest';
import {
  SnapshotAdapterImpl,
  extractAssignmentsFromSnapshot,
  extractDocumentsFromSnapshot,
  normalizeSnapshotConnectivity,
  resolveDocumentTemplate,
  resolveSnapshotConnectivityByFile,
  resolveSnapshotConnectivityBySchema,
  serializeSnapshotForTxt,
} from '@/sisad-pdfme/shared/snapshotAdapter';

describe('snapshot adapter', () => {
  const adapter = new SnapshotAdapterImpl();

  it('serialize/deserialize preserva estado funcional', () => {
    const state = {
      activeDocumentId: 'doc-1',
      documents: [{ documentId: 'doc-1', name: 'Doc', order: 0, pages: [] }],
      recipients: [{ id: 'r1', name: 'Recipient', order: 0 }],
      assignments: [{ schemaUid: 's1', recipientId: 'r1', scope: 'recipient' }],
      signatureConfig: { defaultMode: 'draw', allowedModes: ['draw', 'provider'] },
      providerConfig: { defaultProvider: 'draw', allowedProviders: ['draw'] },
      connectivity: { byFile: { 'doc-1': { mode: 'json' } } },
      inputs: [{ s1: 'valor' }],
    } as any;
    const snapshot = adapter.serialize(state, { name: 'Template', createdByUserId: 'tester' } as any);
    const restored = adapter.deserialize(snapshot);
    expect(snapshot.version).toBeTruthy();
    expect(restored).toMatchObject({ activeDocumentId: 'doc-1', inputs: [{ s1: 'valor' }] });
    expect(restored.assignments).toEqual(state.assignments);
  });

  it('valida campos obligatorios', () => {
    expect(adapter.validate(null).valid).toBe(false);
    const result = adapter.validate({ version: '2.0.0' });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('documents');
  });

  it('migra legacy preservando schemas, recipient y policy de firma', () => {
    const migrated = adapter.migrate({
      name: 'Legacy',
      schemas: [[{ id: 'schema-1', name: 'firma', type: 'signature', ownerRecipientId: 'r1' }]],
      recipients: [{ id: 'r1', name: 'Cliente', order: 0 }],
      singType: 'oneshot',
    });
    expect(migrated.documents[0].pages[0].schemas[0].__designer?.schemaUid).toBe('schema-1');
    expect(migrated.assignments).toContainEqual(expect.objectContaining({ schemaUid: 'schema-1', recipientId: 'r1' }));
    expect(migrated.signatureMode).toBe('provider');
    expect(migrated.signaturePolicyId).toBe('oneshot');
  });

  it('normaliza y resuelve connectivity por archivo/schema', () => {
    const snapshot = {
      connectivity: {
        byFile: { 'file-a': { mode: 'json' } },
        bySchema: { 'file-a': { 'schema-1': { path: '$.name' } } },
      },
    };
    expect(normalizeSnapshotConnectivity({} as any)).toBeUndefined();
    expect(resolveSnapshotConnectivityByFile(snapshot, 'file-a')).toMatchObject({ mode: 'json' });
    expect(resolveSnapshotConnectivityBySchema(snapshot, 'file-a', 'schema-1')).toMatchObject({ path: '$.name' });
    expect(resolveSnapshotConnectivityBySchema(snapshot, null, 'schema-1')).toMatchObject({ path: '$.name' });
  });

  it('soporta snapshots host con documents/template/assignments', () => {
    const snapshot = {
      documents: [{ id: 'file-a', template: { schemas: [[{ id: 's1' }]] }, assignments: { r1: {} } }],
    };
    expect(extractDocumentsFromSnapshot(snapshot)).toHaveLength(1);
    expect(resolveDocumentTemplate(snapshot, 'file-a')?.schemas[0][0].id).toBe('s1');
    expect(extractAssignmentsFromSnapshot(snapshot, 'file-a')).toEqual({ r1: {} });
    expect(serializeSnapshotForTxt(snapshot)).toContain('file-a');
  });
});

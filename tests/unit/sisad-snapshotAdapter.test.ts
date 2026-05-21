/**
 * FASE 10 — Tests: Snapshot Adapter
 * Valida serialize/deserialize idempotencia, migración v1→v2 y validación.
 */
import { describe, it, expect } from 'vitest';
import { snapshotAdapter } from '../../src/sisad-pdfme/shared/snapshotAdapter.js';
import {
  makeEmptySnapshot,
  SNAPSHOT_VERSION,
  isLegacySnapshot,
  type SnapshotDocument,
} from '../../src/sisad-pdfme/shared/snapshot.js';
import type { DesignerState } from '../../src/sisad-pdfme/shared/snapshotAdapter.js';

function makeState(overrides?: Partial<DesignerState>): DesignerState {
  return {
    documents: [],
    recipients: [],
    assignments: [],
    signatureConfig: { defaultMode: 'draw', allowedModes: ['draw'] },
    providerConfig: { defaultProvider: 'draw', allowedProviders: ['draw'] },
    ...overrides,
  };
}

const META = { name: 'Test', createdByUserId: 'user-1' };

describe('validate', () => {
  it('rechaza null', () => {
    expect(snapshotAdapter.validate(null).valid).toBe(false);
  });

  it('rechaza snapshot sin documents', () => {
    const bad = { version: SNAPSHOT_VERSION, templateId: 'x', recipients: [], assignments: [], signatureConfig: {}, metadata: {} };
    expect(snapshotAdapter.validate(bad).valid).toBe(false);
  });

  it('acepta snapshot mínimo válido', () => {
    const ok = makeEmptySnapshot();
    expect(snapshotAdapter.validate(ok).valid).toBe(true);
  });
});

describe('serialize → deserialize idempotente', () => {
  it('estado vacío ida y vuelta', () => {
    const state = makeState();
    const snap = snapshotAdapter.serialize(state, META);
    const restored = snapshotAdapter.deserialize(snap);
    const snap2 = snapshotAdapter.serialize(restored, META);
    expect(snap2.documents).toEqual(snap.documents);
    expect(snap2.recipients).toEqual(snap.recipients);
    expect(snap2.assignments).toEqual(snap.assignments);
  });

  it('recipients se conservan', () => {
    const state = makeState({
      recipients: [{ id: 'r-1', name: 'Ana', color: '#3B82F6', isActive: true }],
    });
    const snap = snapshotAdapter.serialize(state, META);
    const restored = snapshotAdapter.deserialize(snap);
    expect(restored.recipients).toEqual(state.recipients);
  });
});

describe('isLegacySnapshot', () => {
  it('detecta snapshot sin version como legacy', () => {
    expect(isLegacySnapshot({ schemas: [[]] })).toBe(true);
  });

  it('detecta version "1.0.0" como legacy', () => {
    expect(isLegacySnapshot({ version: '1.0.0', schemas: [[]] })).toBe(true);
  });

  it('no detecta v2 como legacy', () => {
    expect(isLegacySnapshot(makeEmptySnapshot())).toBe(false);
  });

  it('retorna false para no-objeto', () => {
    expect(isLegacySnapshot(null)).toBe(false);
    expect(isLegacySnapshot('string')).toBe(false);
  });

  it('no trata versión con sufijo pre-release como legacy cuando la base es >= 2.0.0', () => {
    // fix: compareVersions strips pre-release suffix before Number() conversion
    expect(isLegacySnapshot({ version: '2.0.0-beta' })).toBe(false);
    expect(isLegacySnapshot({ version: '2.0.0-rc.1' })).toBe(false);
    expect(isLegacySnapshot({ version: '3.0.0-alpha' })).toBe(false);
  });

  it('trata versión con sufijo pre-release como legacy cuando la base es < 2.0.0', () => {
    expect(isLegacySnapshot({ version: '1.9.9-hotfix' })).toBe(true);
  });
});

describe('migrate', () => {
  it('migra snapshot legacy sin version a v2', () => {
    const legacy = {
      name: 'Template viejo',
      schemas: [[{ name: 'campo1', type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 }]],
    };
    const migrated = snapshotAdapter.migrate(legacy);
    expect(migrated.version).toBe(SNAPSHOT_VERSION);
    expect(migrated.documents).toHaveLength(1);
    expect(migrated.documents[0].pages).toHaveLength(1);
    expect(migrated.documents[0].pages[0].schemas).toHaveLength(1);
  });

  it('migra sin perder schemas', () => {
    const legacySchemas = [
      [{ name: 'f1', type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 }],
      [{ name: 'f2', type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 }],
    ];
    const legacy = { schemas: legacySchemas };
    const migrated = snapshotAdapter.migrate(legacy);
    const totalSchemas = migrated.documents[0].pages.reduce(
      (acc, p) => acc + p.schemas.length, 0,
    );
    expect(totalSchemas).toBe(2);
  });

  it('agrega __designer a cada schema migrado', () => {
    const legacy = {
      schemas: [[{ name: 'campo1', type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 }]],
    };
    const migrated = snapshotAdapter.migrate(legacy);
    const schema = migrated.documents[0].pages[0].schemas[0];
    expect(schema.__designer).toBeDefined();
    expect(schema.__designer.schemaUid).toBeDefined();
    expect(schema.__designer.templateVersion).toBe(SNAPSHOT_VERSION);
  });

  it('no muta snapshot que ya es v2', () => {
    const v2 = makeEmptySnapshot();
    const result = snapshotAdapter.migrate(v2);
    expect(result).toBe(v2); // misma referencia — no se creó copia
  });
});

describe('snapshot con orphaned schemas', () => {
  it('deserializa correctamente aunque un recipient esté eliminado', () => {
    const snap = makeEmptySnapshot({
      documents: [{
        documentId: 'doc-1',
        name: 'Doc',
        order: 0,
        pages: [{
          pageNumber: 1,
          schemas: [{
            name: 'campo',
            type: 'text',
            __designer: {
              schemaUid: 'uid-orphan',
              templateVersion: SNAPSHOT_VERSION,
              documentId: 'doc-1',
              pageNumber: 1,
              recipientId: 'deleted-recipient', // recipient ya no existe
            },
          }],
          background: { type: 'none' },
        }],
      }] as SnapshotDocument[],
      recipients: [], // recipient eliminado
    });

    const state = snapshotAdapter.deserialize(snap);
    const totalSchemas = state.documents[0].pages[0].schemas.length;
    expect(totalSchemas).toBe(1); // schema sigue ahí aunque su recipient no exista
  });
});

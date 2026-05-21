/**
 * FASE 10 — Tests: Local Mode (sin backend)
 * Cubre localSnapshotStore, localFormStorage y createLocalModeConfig.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  LocalSnapshotStoreImpl,
  LocalStorageQuotaError,
  SnapshotNotFoundError,
  type SnapshotIndexEntry,
} from '../../src/sisad-pdfme/shared/localSnapshotStore.js';
import {
  LocalFormStorage,
  createLocalFormStorage,
} from '../../src/sisad-pdfme/shared/localFormStorage.js';
import {
  createLocalModeConfig,
  diagnoseLocalMode,
} from '../../src/sisad-pdfme/shared/localMode.js';
import { makeEmptySnapshot } from '../../src/sisad-pdfme/shared/snapshot.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Storage en memoria para tests (no usa localStorage real) */
function makeMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => { map.clear(); },
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() { return map.size; },
  };
}

function makeStore(storage?: Storage) {
  return new LocalSnapshotStoreImpl({ storage: storage ?? makeMemoryStorage() });
}

function makeSnapshot(overrides: Partial<Parameters<typeof makeEmptySnapshot>[0]> = {}) {
  return makeEmptySnapshot({
    templateId: 'tpl-001',
    name: 'Test Template',
    ...overrides,
  });
}

// ── LocalSnapshotStore ───────────────────────────────────────────────────────

describe('LocalSnapshotStoreImpl', () => {
  let store: LocalSnapshotStoreImpl;

  beforeEach(() => {
    store = makeStore();
  });

  it('guarda y carga un snapshot correctamente', () => {
    const snap = makeSnapshot();
    store.saveSnapshot(snap);
    const loaded = store.loadSnapshot(snap.templateId);
    expect(loaded).toBeDefined();
    expect(loaded?.templateId).toBe(snap.templateId);
    expect(loaded?.version).toBe('2.0.0');
  });

  it('loadSnapshot retorna undefined para templateId inexistente', () => {
    const result = store.loadSnapshot('no-existe');
    expect(result).toBeUndefined();
  });

  it('loadSnapshotOrThrow lanza SnapshotNotFoundError si no existe', () => {
    expect(() => store.loadSnapshotOrThrow('no-existe'))
      .toThrow(SnapshotNotFoundError);
    expect(() => store.loadSnapshotOrThrow('no-existe'))
      .toThrow(/no-existe/);
  });

  it('hasSnapshot retorna true/false correctamente', () => {
    const snap = makeSnapshot();
    expect(store.hasSnapshot(snap.templateId)).toBe(false);
    store.saveSnapshot(snap);
    expect(store.hasSnapshot(snap.templateId)).toBe(true);
  });

  it('deleteSnapshot elimina el snapshot y su entrada en el índice', () => {
    const snap = makeSnapshot();
    store.saveSnapshot(snap);
    store.deleteSnapshot(snap.templateId);
    expect(store.loadSnapshot(snap.templateId)).toBeUndefined();
    expect(store.listSnapshots()).toHaveLength(0);
  });

  it('listSnapshots retorna metadata de todos los snapshots guardados', () => {
    store.saveSnapshot(makeSnapshot({ templateId: 'tpl-001', name: 'A' }));
    store.saveSnapshot(makeSnapshot({ templateId: 'tpl-002', name: 'B' }));
    const list = store.listSnapshots();
    expect(list).toHaveLength(2);
    const ids = list.map((e) => e.templateId);
    expect(ids).toContain('tpl-001');
    expect(ids).toContain('tpl-002');
  });

  it('saveSnapshot actualiza el índice al sobreescribir un template existente', () => {
    const snap = makeSnapshot();
    store.saveSnapshot(snap);
    // Sobreescribir con nombre nuevo
    store.saveSnapshot({ ...snap, metadata: { ...snap.metadata, name: 'Renamed' } });
    const list = store.listSnapshots();
    expect(list).toHaveLength(1); // no duplica
    expect(list[0].name).toBe('Renamed');
  });

  it('clearAll elimina todos los snapshots e índice', () => {
    store.saveSnapshot(makeSnapshot({ templateId: 'tpl-001' }));
    store.saveSnapshot(makeSnapshot({ templateId: 'tpl-002' }));
    store.clearAll();
    expect(store.listSnapshots()).toHaveLength(0);
    expect(store.loadSnapshot('tpl-001')).toBeUndefined();
  });

  it('estimateSize retorna número positivo', () => {
    const snap = makeSnapshot();
    expect(store.estimateSize(snap)).toBeGreaterThan(0);
  });

  it('loadSnapshot retorna undefined (con warn) para JSON corrupto', () => {
    const storage = makeMemoryStorage();
    const store = makeStore(storage);
    // Inyectar JSON corrupto directamente en el storage
    storage.setItem('sisad:snapshot:corrupt-tpl', '{invalid json}}');
    const result = store.loadSnapshot('corrupt-tpl');
    expect(result).toBeUndefined();
    // La distinción clave: no lanza — solo avisa
  });

  it('lanza LocalStorageQuotaError cuando el storage lanza QuotaExceededError', () => {
    const failStorage = makeMemoryStorage();
    const origSetItem = failStorage.setItem.bind(failStorage);
    // Simular quota excedida en el primer setItem de datos (no el índice)
    let callCount = 0;
    failStorage.setItem = (k: string, v: string) => {
      callCount++;
      if (callCount === 1) {
        const err = new DOMException('QuotaExceededError', 'QuotaExceededError');
        throw err;
      }
      origSetItem(k, v);
    };
    const failStore = new LocalSnapshotStoreImpl({ storage: failStorage });
    expect(() => failStore.saveSnapshot(makeSnapshot()))
      .toThrow(LocalStorageQuotaError);
  });
});

// ── LocalFormStorage ─────────────────────────────────────────────────────────

describe('LocalFormStorage', () => {
  let storage: LocalFormStorage;

  beforeEach(() => {
    storage = new LocalFormStorage({
      templateId: 'tpl-001',
      storage: makeMemoryStorage(),
    });
  });

  it('saveInput / hasInput funciona correctamente', () => {
    expect(storage.hasInput('schema-1')).toBe(false);
    storage.saveInput('schema-1', 'valor firmado');
    expect(storage.hasInput('schema-1')).toBe(true);
  });

  it('hasInput retorna false para cadena vacía', () => {
    storage.saveInput('schema-empty', '');
    expect(storage.hasInput('schema-empty')).toBe(false);
  });

  it('hasInput retorna false para null', () => {
    storage.saveInput('schema-null', null);
    expect(storage.hasInput('schema-null')).toBe(false);
  });

  it('saveInputForRecipient / getInputs por recipientId', () => {
    storage.saveInputForRecipient('schema-1', 'val-1', 'recipient-A');
    storage.saveInputForRecipient('schema-2', 'val-2', 'recipient-A');
    const inputs = storage.getInputs('recipient-A');
    expect(Object.keys(inputs)).toHaveLength(2);
    expect(inputs['schema-1']).toBe('val-1');
    expect(inputs['schema-2']).toBe('val-2');
  });

  it('clearInputs limpia solo el recipient indicado', () => {
    storage.saveInputForRecipient('schema-1', 'val', 'rec-A');
    storage.saveInputForRecipient('schema-2', 'val', 'rec-B');
    storage.clearInputs('rec-A');
    expect(storage.getInputs('rec-A')).toEqual({});
    expect(Object.keys(storage.getInputs('rec-B'))).toHaveLength(1);
  });

  it('clearInputs sin args limpia todo', () => {
    storage.saveInputForRecipient('schema-1', 'x', 'rec-A');
    storage.saveInputForRecipient('schema-2', 'y', 'rec-B');
    storage.clearInputs();
    expect(storage.getInputs('rec-A')).toEqual({});
    expect(storage.getInputs('rec-B')).toEqual({});
  });

  it('promoteCurrentInputs mueve __current al recipientId real', () => {
    storage.saveInput('schema-1', 'firma-x');
    storage.saveInput('schema-2', 'texto-y');
    storage.promoteCurrentInputs('rec-Z');
    const promoted = storage.getInputs('rec-Z');
    expect(promoted['schema-1']).toBe('firma-x');
    expect(promoted['schema-2']).toBe('texto-y');
    // __current debe estar vacío
    expect(storage.getCurrentInputs()).toEqual({});
  });

  it('createLocalFormStorage es un factory que retorna LocalFormStorage', () => {
    const s = createLocalFormStorage({ templateId: 'x', storage: makeMemoryStorage() });
    expect(s).toBeInstanceOf(LocalFormStorage);
  });

  it('promoteCurrentInputs no hace nada si no hay inputs en __current', () => {
    const mem = makeMemoryStorage();
    const s = new LocalFormStorage({ templateId: 'tpl', storage: mem });
    const beforeSize = mem.length;
    s.promoteCurrentInputs('rec-A');
    // No se deben haber escrito claves nuevas
    expect(mem.length).toBe(beforeSize);
  });

  it('los IDs con dos puntos (:) no colisionan como separadores de clave', () => {
    const mem = makeMemoryStorage();
    // templateId, recipientId y schemaUid contienen ':'
    const s1 = new LocalFormStorage({ templateId: 'tpl:A', storage: mem });
    const s2 = new LocalFormStorage({ templateId: 'tpl', storage: mem });
    s1.saveInputForRecipient('uid:1', 'valor-A', 'rec:X');
    s2.saveInputForRecipient('uid:1', 'valor-B', 'rec:X');
    // Las dos instancias tienen templateIds distintos → no deben solaparse
    const inputsA = s1.getInputs('rec:X');
    const inputsB = s2.getInputs('rec:X');
    expect(inputsA['uid:1']).toBe('valor-A');
    expect(inputsB['uid:1']).toBe('valor-B');
    expect(inputsA['uid:1']).not.toBe(inputsB['uid:1']);
  });
});

// ── createLocalModeConfig ─────────────────────────────────────────────────────

describe('createLocalModeConfig', () => {
  it('retorna config completa con defaults', () => {
    const mem = makeMemoryStorage();
    const config = createLocalModeConfig({
      templateId: 'tpl-x',
      snapshotStorage: mem,
      formStorage: mem,
    });
    expect(config.collaborationMode).toBe('offline');
    expect(config.serializeOptions.backgroundMode).toBe('base64');
    expect(config.signaturePolicy.allowedProviders).toContain('draw');
    expect(config.signaturePolicy.allowedProviders).toContain('image');
    expect(config.signaturePolicy.allowedProviders).not.toContain('p12');
    expect(config.signaturePolicy.defaultProvider).toBe('draw');
    expect(config.templateId).toBe('tpl-x');
  });

  it('incluye p12 cuando allowP12ClientSide=true', () => {
    const config = createLocalModeConfig({
      allowP12ClientSide: true,
      snapshotStorage: makeMemoryStorage(),
      formStorage: makeMemoryStorage(),
    });
    expect(config.signaturePolicy.allowedProviders).toContain('p12');
  });

  it('snapshotStore y formStorage son instancias correctas', () => {
    const config = createLocalModeConfig({ snapshotStorage: makeMemoryStorage(), formStorage: makeMemoryStorage() });
    expect(config.snapshotStore).toBeInstanceOf(LocalSnapshotStoreImpl);
    expect(config.formStorage).toBeInstanceOf(LocalFormStorage);
  });

  it('funciona sin opciones (defaults de entorno)', () => {
    // En jsdom sessionStorage y localStorage están disponibles
    expect(() => createLocalModeConfig()).not.toThrow();
  });
});

// ── diagnoseLocalMode ─────────────────────────────────────────────────────────

describe('diagnoseLocalMode', () => {
  it('retorna objeto con campos requeridos', () => {
    const diag = diagnoseLocalMode();
    expect(typeof diag.localStorage).toBe('boolean');
    expect(typeof diag.sessionStorage).toBe('boolean');
    expect(typeof diag.cryptoRandomUUID).toBe('boolean');
    expect(typeof diag.fullySupported).toBe('boolean');
    expect(Array.isArray(diag.warnings)).toBe(true);
  });

  it('retorna booleanos para localStorage y sessionStorage', () => {
    const diag = diagnoseLocalMode();
    // En algunos entornos de test localStorage puede no estar disponible;
    // solo verificamos que los campos sean booleanos
    expect(typeof diag.localStorage).toBe('boolean');
    expect(typeof diag.sessionStorage).toBe('boolean');
    // fullySupported debe ser coherente con los flags individuales
    if (!diag.localStorage || !diag.sessionStorage || !diag.cryptoRandomUUID) {
      expect(diag.fullySupported).toBe(false);
      expect(diag.warnings.length).toBeGreaterThan(0);
    }
  });
});

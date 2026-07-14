import type { SisadPdfmePersistenceAdapter } from '../config/SisadPdfmeConfig.js';

export type { SisadPdfmePersistenceAdapter };

export const createPersistenceAdapter = <TSnapshot = unknown>(): SisadPdfmePersistenceAdapter<TSnapshot> => ({
  serializeSnapshot(snapshot) {
    return JSON.stringify(snapshot ?? null);
  },
  deserializeSnapshot(value) {
    if (!value) return null;
    try {
      return JSON.parse(value) as TSnapshot;
    } catch {
      return null;
    }
  },
});

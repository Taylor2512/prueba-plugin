/**
 * LOCAL SNAPSHOT STORE — Modo sin backend
 *
 * Persiste OfficialTemplateSnapshot en localStorage para que el designer
 * funcione completamente offline/sin servidor.
 *
 * Claves en localStorage:
 *   sisad:snapshot:<templateId>       → JSON del snapshot
 *   sisad:snapshot:__index            → JSON de { id: string; name: string; updatedAt: string }[]
 *
 * Límites de localStorage (~5MB):
 *   - Los backgrounds en base64 pueden ser grandes.
 *   - Si el snapshot supera el límite, saveSnapshot lanza LocalStorageQuotaError.
 *   - El caller debe manejar el error (mostrar mensaje al usuario).
 *
 * No hay sincronización multi-tab (no se usa BroadcastChannel aquí).
 * Para colaboración real usar el backend REST.
 */
import type { OfficialTemplateSnapshot } from './snapshot.js';
import { readJsonStorageValue, resolveBrowserStorage } from './webStorage.js';

// ── Constantes ──────────────────────────────────────────────────────────────

const KEY_PREFIX = 'sisad:snapshot:';

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface SnapshotIndexEntry {
  templateId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalSnapshotStoreOptions {
  /** Prefijo personalizado para pruebas o aislamiento por tenant */
  keyPrefix?: string;
  /** Storage alternativo (ej. sessionStorage). Por defecto: localStorage */
  storage?: Storage;
}

// ── Errores ──────────────────────────────────────────────────────────────────

export class LocalStorageQuotaError extends Error {
  constructor(public readonly templateId: string) {
    super(
      `No hay suficiente espacio en localStorage para guardar el snapshot '${templateId}'. ` +
      `Considera reducir los backgrounds o limpiar snapshots antiguos.`,
    );
    this.name = 'LocalStorageQuotaError';
  }
}

export class SnapshotNotFoundError extends Error {
  constructor(public readonly templateId: string) {
    super(`Snapshot '${templateId}' no encontrado en el store local.`);
    this.name = 'SnapshotNotFoundError';
  }
}

// ── Implementación ───────────────────────────────────────────────────────────

export class LocalSnapshotStoreImpl {
  private readonly prefix: string;
  private readonly storage: Storage;

  constructor(options: LocalSnapshotStoreOptions = {}) {
    this.prefix = options.keyPrefix ?? KEY_PREFIX;
    this.storage = options.storage ?? resolveBrowserStorage('local');
  }

  /** Guarda (o actualiza) un snapshot. Lanza LocalStorageQuotaError si no hay espacio. */
  saveSnapshot(snapshot: OfficialTemplateSnapshot): void {
    const key = this._key(snapshot.templateId);
    const serialized = JSON.stringify(snapshot);
    try {
      this.storage.setItem(key, serialized);
      this._updateIndex({
        templateId: snapshot.templateId,
        name: snapshot.metadata?.name ?? snapshot.templateId,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      });
    } catch (e) {
      if (e instanceof DOMException && (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        throw new LocalStorageQuotaError(snapshot.templateId);
      }
      throw e;
    }
  }

  /** Carga un snapshot por templateId. Retorna undefined si no existe (no lanza). */
  loadSnapshot(templateId: string): OfficialTemplateSnapshot | undefined {
    const raw = this.storage.getItem(this._key(templateId));
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as OfficialTemplateSnapshot;
    } catch {
      console.warn(`[LocalSnapshotStore] Snapshot '${templateId}' está corrupto en el store local y será ignorado.`);
      return undefined;
    }
  }

  /** Carga un snapshot o lanza SnapshotNotFoundError si no existe. */
  loadSnapshotOrThrow(templateId: string): OfficialTemplateSnapshot {
    const snap = this.loadSnapshot(templateId);
    if (!snap) throw new SnapshotNotFoundError(templateId);
    return snap;
  }

  /** Elimina un snapshot del store. Si no existe, no hace nada. */
  deleteSnapshot(templateId: string): void {
    this.storage.removeItem(this._key(templateId));
    this._removeFromIndex(templateId);
  }

  /** Lista todos los snapshots guardados (solo metadatos, no el contenido completo). */
  listSnapshots(): SnapshotIndexEntry[] {
    return readJsonStorageValue(this.storage, this._indexKey(), []);
  }

  /** Comprueba si existe un snapshot para el templateId dado. */
  hasSnapshot(templateId: string): boolean {
    return this.storage.getItem(this._key(templateId)) !== null;
  }

  /** Elimina todos los snapshots del store (útil para tests y reset). */
  clearAll(): void {
    const entries = this.listSnapshots();
    for (const entry of entries) {
      this.storage.removeItem(this._key(entry.templateId));
    }
    this.storage.removeItem(this._indexKey());
  }

  /** Estima el tamaño en bytes del snapshot serializado (aproximado). */
  estimateSize(snapshot: OfficialTemplateSnapshot): number {
    return JSON.stringify(snapshot).length * 2; // UTF-16 → 2 bytes/char aproximado
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private _key(templateId: string): string {
    return `${this.prefix}${templateId}`;
  }

  private _indexKey(): string {
    return `${this.prefix}__index`;
  }

  private _updateIndex(entry: SnapshotIndexEntry): void {
    const current = this.listSnapshots();
    const idx = current.findIndex((e) => e.templateId === entry.templateId);
    if (idx >= 0) {
      current[idx] = entry;
    } else {
      current.push(entry);
    }
    try {
      this.storage.setItem(this._indexKey(), JSON.stringify(current));
    } catch {
      // Si falla el índice no bloqueamos el guardado principal
    }
  }

  private _removeFromIndex(templateId: string): void {
    const current = this.listSnapshots().filter((e) => e.templateId !== templateId);
    try {
      this.storage.setItem(this._indexKey(), JSON.stringify(current));
    } catch {
      // no-op
    }
  }

}

/** Singleton para uso general en modo sin backend. */
export const localSnapshotStore = new LocalSnapshotStoreImpl();
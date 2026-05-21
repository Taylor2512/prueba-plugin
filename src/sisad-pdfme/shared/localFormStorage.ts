/**
 * LOCAL FORM STORAGE — Modo sin backend
 *
 * Implementación de ExternalFormStorage sobre sessionStorage (por defecto).
 * Persiste los inputs del formulario externo cliente-a-cliente sin servidor.
 *
 * Estrategia de namespacing:
 *   sisad:form:<templateId>:<recipientId>:<schemaUid>  → JSON del valor
 *   sisad:form:<templateId>:<recipientId>:__uids       → JSON de string[]
 *
 * Por qué sessionStorage y no localStorage:
 *   - Los datos del formulario son efímeros por sesión (privacidad).
 *   - El usuario puede elegir pasar localStorage mediante options.storage.
 *
 * Seguridad: no hay cifrado — solo para uso sin backend (dev / local).
 * Para producción con backend, usar la implementación REST del padre.
 */
import type { ExternalFormStorage } from '../externalForms/externalFormRunner.js';

// ── Constantes ────────────────────────────────────────────────────────────────

const FORM_PREFIX = 'sisad:form:';

// ── Opciones ─────────────────────────────────────────────────────────────────

export interface LocalFormStorageOptions {
  templateId: string;
  /** Por defecto sessionStorage. Pasar localStorage para persistencia entre tabs. */
  storage?: Storage;
}

// ── Implementación ────────────────────────────────────────────────────────────

export class LocalFormStorage implements ExternalFormStorage {
  private readonly templateId: string;
  private readonly storage: Storage;

  constructor(options: LocalFormStorageOptions) {
    this.templateId = options.templateId;
    this.storage = options.storage ?? this._resolveDefaultStorage();
  }

  saveInput(schemaUid: string, value: unknown): void {
    // Requiere recipientId en el contexto — usamos un current recipient implícito.
    // La API del contrato no recibe recipientId en saveInput; lo manejamos con
    // una clave sin recipient y el índice en __current.
    const key = this._schemaKey('__current', schemaUid);
    this._setItem(key, JSON.stringify(value));
    this._addToUidIndex('__current', schemaUid);
  }

  getInputs(recipientId: string): Record<string, unknown> {
    const uids = this._getUidIndex(recipientId);
    const result: Record<string, unknown> = {};
    for (const uid of uids) {
      const raw = this.storage.getItem(this._schemaKey(recipientId, uid));
      if (raw !== null) {
        try {
          result[uid] = JSON.parse(raw);
        } catch {
          result[uid] = raw;
        }
      }
    }
    return result;
  }

  hasInput(schemaUid: string): boolean {
    const key = this._schemaKey('__current', schemaUid);
    const val = this.storage.getItem(key);
    if (val === null) return false;
    try {
      const parsed = JSON.parse(val);
      return parsed !== null && parsed !== undefined && parsed !== '';
    } catch {
      return val !== '';
    }
  }

  clearInputs(recipientId?: string): void {
    if (recipientId !== undefined) {
      // Limpia solo el recipient indicado
      const uids = this._getUidIndex(recipientId);
      for (const uid of uids) {
        this.storage.removeItem(this._schemaKey(recipientId, uid));
      }
      this.storage.removeItem(this._uidIndexKey(recipientId));
      this._removeFromRecipientIndex(recipientId);
      return;
    }
    // Sin recipientId: eliminar todos los keys con nuestro prefijo de template
    const prefix = `${FORM_PREFIX}${this._enc(this.templateId)}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const k = this.storage.key(i);
      if (k && k.startsWith(prefix)) keysToRemove.push(k);
    }
    for (const k of keysToRemove) {
      this.storage.removeItem(k);
    }
  }

  /**
   * Versión mejorada de saveInput que acepta recipientId explícito.
   * Usar en lugar de saveInput cuando el recipient es conocido en el runner.
   */
  saveInputForRecipient(schemaUid: string, value: unknown, recipientId: string): void {
    const key = this._schemaKey(recipientId, schemaUid);
    this._setItem(key, JSON.stringify(value));
    this._addToUidIndex(recipientId, schemaUid);
  }

  /** Obtiene todos los inputs del recipient actual (clave '__current'). */
  getCurrentInputs(): Record<string, unknown> {
    return this.getInputs('__current');
  }

  /** Mueve los inputs de '__current' al recipientId real una vez conocido. */
  promoteCurrentInputs(recipientId: string): void {
    const currentInputs = this.getCurrentInputs();
    if (Object.keys(currentInputs).length === 0) return;
    for (const [uid, value] of Object.entries(currentInputs)) {
      this.saveInputForRecipient(uid, value, recipientId);
    }
    this.clearInputs('__current');
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  /** Encode colons and percent signs in a key segment to prevent separator collisions. */
  private _enc(s: string): string {
    return s.replace(/%/g, '%25').replace(/:/g, '%3A');
  }

  private _schemaKey(recipientId: string, schemaUid: string): string {
    return `${FORM_PREFIX}${this._enc(this.templateId)}:${this._enc(recipientId)}:${this._enc(schemaUid)}`;
  }

  private _uidIndexKey(recipientId: string): string {
    return `${FORM_PREFIX}${this._enc(this.templateId)}:${this._enc(recipientId)}:__uids`;
  }

  private _getUidIndex(recipientId: string): string[] {
    try {
      const raw = this.storage.getItem(this._uidIndexKey(recipientId));
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  private _addToUidIndex(recipientId: string, schemaUid: string): void {
    const current = this._getUidIndex(recipientId);
    if (!current.includes(schemaUid)) {
      current.push(schemaUid);
      try {
        this.storage.setItem(this._uidIndexKey(recipientId), JSON.stringify(current));
      } catch {
        // no-op si falla
      }
    }
    // Registrar el recipientId en el índice de recipients conocidos
    this._addToRecipientIndex(recipientId);
  }

  private _recipientIndexKey(): string {
    return `${FORM_PREFIX}${this._enc(this.templateId)}:__recipients`;
  }

  private _addToRecipientIndex(recipientId: string): void {
    const current = this._getRecipientIndex();
    if (!current.includes(recipientId)) {
      current.push(recipientId);
      try {
        this.storage.setItem(this._recipientIndexKey(), JSON.stringify(current));
      } catch {
        // no-op
      }
    }
  }

  private _removeFromRecipientIndex(recipientId: string): void {
    const current = this._getRecipientIndex().filter((id) => id !== recipientId);
    try {
      this.storage.setItem(this._recipientIndexKey(), JSON.stringify(current));
    } catch {
      // no-op
    }
  }

  private _getRecipientIndex(): string[] {
    try {
      const raw = this.storage.getItem(this._recipientIndexKey());
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  private _setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (e) {
      // sessionStorage también tiene quota aunque más grande
      if (e instanceof DOMException) {
        console.warn(`[LocalFormStorage] No se pudo guardar '${key}': quota excedida.`);
      }
    }
  }

  private _resolveDefaultStorage(): Storage {
    if (typeof sessionStorage !== 'undefined') return sessionStorage;
    if (typeof localStorage !== 'undefined') return localStorage;
    return this._noopStorage();
  }

  /** Storage no-op para SSR / entornos sin Web Storage API. */
  private _noopStorage(): Storage {
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
}

/**
 * Factory para crear un LocalFormStorage por templateId.
 * Usar en el runner de externalForms cuando no hay backend disponible.
 *
 * @example
 * const storage = createLocalFormStorage({ templateId: snapshot.templateId });
 * // Pasar al ExternalFormRunner como prop storage
 */
export function createLocalFormStorage(options: LocalFormStorageOptions): LocalFormStorage {
  return new LocalFormStorage(options);
}

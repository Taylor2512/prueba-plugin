/**
 * FASE 3 — Sistema de Locks
 *
 * LockManager gestiona el ciclo de vida completo de un lock de schema.
 * En modo colaborativo: sincroniza via Yjs Awareness (efímero, auto-purga al desconectar).
 * En modo offline: usa Map local en memoria.
 *
 * TTL diferenciado:
 *   - Schemas de firma: 15s
 *   - Resto: 30s
 *   - Heartbeat: cada 10s
 *
 * El lock NO se persiste en el snapshot oficial.
 */

export interface SchemaLock {
  schemaUid: string;
  ownerUserId: string;
  ownerDisplayName: string;
  /** Color hex del usuario — para el badge visual en canvas */
  ownerColor: string;
  acquiredAt: number;
  expiresAt: number;
  heartbeatAt: number;
  /** Tipo de schema — para TTL diferenciado */
  schemaType?: string;
}

export interface LockTTLConfig {
  /** TTL para schemas no-firma (ms) */
  default: number;
  /** TTL para schemas de firma (ms) — más corto por sensibilidad */
  signature: number;
  /** Intervalo de heartbeat (ms) */
  heartbeatInterval: number;
}

export const DEFAULT_LOCK_TTL: LockTTLConfig = {
  default: 30_000,
  signature: 15_000,
  heartbeatInterval: 10_000,
} as const;

export type LockResult =
  | { acquired: true; lock: SchemaLock }
  | { acquired: false; existingLock: SchemaLock };

type LockSubscriber = (lock: SchemaLock | null) => void;

/** Información mínima del usuario actual — inyectada por el contexto */
export interface CurrentUserInfo {
  userId: string;
  displayName: string;
  color: string;
}

export class LockManager {
  private locks = new Map<string, SchemaLock>();
  private subscribers = new Map<string, Set<LockSubscriber>>();
  private heartbeatTimers = new Map<string, ReturnType<typeof setInterval>>();

  constructor(
    private readonly currentUser: CurrentUserInfo,
    private readonly ttlConfig: LockTTLConfig = DEFAULT_LOCK_TTL,
    /** Callback para sincronizar con Yjs Awareness (opcional) */
    private readonly onLockChange?: (schemaUid: string, lock: SchemaLock | null) => void,
  ) {}

  /** Intenta adquirir el lock. Retorna el resultado. */
  async acquire(schemaUid: string, schemaType?: string): Promise<LockResult> {
    this.purgeExpired();

    const existing = this.locks.get(schemaUid);
    if (existing && existing.ownerUserId !== this.currentUser.userId) {
      return { acquired: false, existingLock: existing };
    }

    const ttl = schemaType === 'signature'
      ? this.ttlConfig.signature
      : this.ttlConfig.default;

    const now = Date.now();
    const lock: SchemaLock = {
      schemaUid,
      ownerUserId: this.currentUser.userId,
      ownerDisplayName: this.currentUser.displayName,
      ownerColor: this.currentUser.color,
      acquiredAt: now,
      expiresAt: now + ttl,
      heartbeatAt: now,
      schemaType,
    };

    this.locks.set(schemaUid, lock);
    this._notifySubscribers(schemaUid, lock);
    this.onLockChange?.(schemaUid, lock);

    return { acquired: true, lock };
  }

  /** Libera el lock de un schema (solo si pertenece al usuario actual) */
  async release(schemaUid: string): Promise<void> {
    const lock = this.locks.get(schemaUid);
    if (!lock || lock.ownerUserId !== this.currentUser.userId) return;

    this._stopHeartbeat(schemaUid);
    this.locks.delete(schemaUid);
    this._notifySubscribers(schemaUid, null);
    this.onLockChange?.(schemaUid, null);
  }

  /** Libera todos los locks del usuario actual */
  async releaseAll(): Promise<void> {
    const ownedUids = Array.from(this.locks.entries())
      .filter(([, lock]) => lock.ownerUserId === this.currentUser.userId)
      .map(([uid]) => uid);

    for (const uid of ownedUids) {
      await this.release(uid);
    }
  }

  /** Renueva el TTL mientras el schema está seleccionado */
  async heartbeat(schemaUid: string): Promise<void> {
    const lock = this.locks.get(schemaUid);
    if (!lock || lock.ownerUserId !== this.currentUser.userId) return;

    const ttl = lock.schemaType === 'signature'
      ? this.ttlConfig.signature
      : this.ttlConfig.default;

    const now = Date.now();
    const renewed: SchemaLock = {
      ...lock,
      expiresAt: now + ttl,
      heartbeatAt: now,
    };

    this.locks.set(schemaUid, renewed);
    this.onLockChange?.(schemaUid, renewed);
  }

  /** Inicia heartbeat automático para un schema. Se detiene al liberar. */
  startHeartbeat(schemaUid: string): void {
    this._stopHeartbeat(schemaUid);
    const timer = setInterval(() => {
      this.heartbeat(schemaUid);
    }, this.ttlConfig.heartbeatInterval);
    this.heartbeatTimers.set(schemaUid, timer);
  }

  private _stopHeartbeat(schemaUid: string): void {
    const timer = this.heartbeatTimers.get(schemaUid);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(schemaUid);
    }
  }

  /** Verdadero si el schema está bloqueado por otro usuario */
  isLockedByOther(schemaUid: string): boolean {
    const lock = this.locks.get(schemaUid);
    if (!lock) return false;
    if (lock.expiresAt < Date.now()) return false;
    return lock.ownerUserId !== this.currentUser.userId;
  }

  /** Obtiene el lock actual de un schema (null si no existe o expiró) */
  getLock(schemaUid: string): SchemaLock | null {
    const lock = this.locks.get(schemaUid);
    if (!lock) return null;
    if (lock.expiresAt < Date.now()) {
      this.locks.delete(schemaUid);
      return null;
    }
    return lock;
  }

  /** Elimina locks huérfanos expirados */
  purgeExpired(): void {
    const now = Date.now();
    for (const [uid, lock] of this.locks.entries()) {
      if (lock.expiresAt < now) {
        this.locks.delete(uid);
        this._stopHeartbeat(uid);
        this._notifySubscribers(uid, null);
        this.onLockChange?.(uid, null);
      }
    }
  }

  /**
   * Aplica un lock remoto (recibido de Yjs Awareness).
   * No valida ownership — la validación es responsabilidad del peer emisor.
   */
  applyRemoteLock(lock: SchemaLock): void {
    this.locks.set(lock.schemaUid, lock);
    this._notifySubscribers(lock.schemaUid, lock);
  }

  /**
   * Elimina un lock remoto (el peer se desconectó o lo liberó).
   */
  removeRemoteLock(schemaUid: string): void {
    const lock = this.locks.get(schemaUid);
    if (!lock || lock.ownerUserId === this.currentUser.userId) return;
    this.locks.delete(schemaUid);
    this._notifySubscribers(schemaUid, null);
  }

  /**
   * Suscribe a cambios de lock de un schema específico.
   * Retorna la función de unsubscribe.
   */
  subscribe(schemaUid: string, cb: LockSubscriber): () => void {
    if (!this.subscribers.has(schemaUid)) {
      this.subscribers.set(schemaUid, new Set());
    }
    this.subscribers.get(schemaUid)!.add(cb);
    return () => {
      this.subscribers.get(schemaUid)?.delete(cb);
    };
  }

  private _notifySubscribers(schemaUid: string, lock: SchemaLock | null): void {
    this.subscribers.get(schemaUid)?.forEach((cb) => cb(lock));
  }

  /**
   * Para tests: inyectar un lock directamente sin pasar por acquire().
   * Solo disponible en entorno de pruebas.
   */
  _injectLockForTest(lock: SchemaLock): void {
    this.locks.set(lock.schemaUid, lock);
  }

  /** Para tests: obtener todos los locks activos */
  _getAllLocksForTest(): Map<string, SchemaLock> {
    return new Map(this.locks);
  }
}

/** Factory para crear un LockManager con configuración por defecto */
export function createLockManager(
  currentUser: CurrentUserInfo,
  options?: {
    ttlConfig?: Partial<LockTTLConfig>;
    onLockChange?: (schemaUid: string, lock: SchemaLock | null) => void;
  },
): LockManager {
  const ttlConfig = { ...DEFAULT_LOCK_TTL, ...options?.ttlConfig };
  return new LockManager(currentUser, ttlConfig, options?.onLockChange);
}

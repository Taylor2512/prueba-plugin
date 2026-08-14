/**
 * Runtime de fuentes de datos: ciclo de vida, carreras y aislamiento por scope.
 *
 * ## Los tres problemas que resuelve
 *
 * **1. Respuestas fuera de orden.** El usuario teclea `a`, `ab`, `abc`. Si la
 * respuesta de `a` llega la última, la lista muestra resultados de `a` mientras
 * el cuadro dice `abc`. Cada petición lleva número de secuencia y una respuesta
 * más antigua que la última aplicada se **descarta**, no se pinta.
 *
 * **2. Fuga de datos entre usuarios.** Una caché indexada sólo por URL sirve a
 * B lo que se cargó para A. La clave incluye siempre el scope
 * (`runtimeSession × user × document`) además de la consulta, de modo que dos
 * usuarios del mismo realm no comparten resultados autenticados.
 *
 * **3. Peticiones huérfanas.** Al cambiar de usuario o documento, las
 * peticiones del scope anterior no pueden escribir en el nuevo. `dispose` y
 * el cambio de scope las abortan.
 *
 * Single-flight: dos peticiones idénticas simultáneas comparten una sola
 * llamada en vuelo en vez de duplicar tráfico.
 */
import type { HttpClientAdapter } from '../http/httpClient.js';

export type DataScope = {
  runtimeSessionId?: string;
  userId?: string;
  documentId?: string;
};

export type DataQuery = {
  sourceKey: string;
  search?: string;
  cursor?: string | null;
  page?: number;
  limit?: number;
  params?: Record<string, unknown>;
};

export type DataRequestStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type DataResult<T = unknown> = {
  status: DataRequestStatus;
  data?: T;
  error?: unknown;
  /** Secuencia de la petición que produjo este resultado. */
  sequence: number;
  /** `true` si el resultado vino de caché. */
  fromCache: boolean;
};

/**
 * Clave de caché.
 *
 * El scope va SIEMPRE, aunque parezca redundante: es lo que impide servir a
 * un usuario los resultados autenticados de otro.
 */
export const dataCacheKey = (scope: DataScope, query: DataQuery): string =>
  JSON.stringify([
    scope.runtimeSessionId ?? '',
    scope.userId ?? '',
    scope.documentId ?? '',
    query.sourceKey,
    query.search ?? '',
    query.cursor ?? '',
    query.page ?? 0,
    query.limit ?? 0,
    query.params ? Object.keys(query.params).sort().map((key) => `${key}=${String(query.params?.[key])}`).join('&') : '',
  ]);

export type DataSourceExecutor<T = unknown> = (
  query: DataQuery,
  context: { scope: DataScope; signal: AbortSignal; httpClient?: HttpClientAdapter },
) => Promise<T>;

export type DataSourceRuntimeOptions = {
  httpClient?: HttpClientAdapter;
  /** Tiempo de vida de la caché en ms. `0` la desactiva. */
  cacheTtlMs?: number;
  /** Reloj inyectable, para poder probar el TTL sin esperar. */
  now?: () => number;
};

type CacheEntry = { value: unknown; storedAt: number };

export class DataSourceRuntime {
  private sequence = 0;
  private lastAppliedSequence = 0;
  private scope: DataScope = {};
  private readonly cache = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<string, { promise: Promise<unknown>; controller: AbortController }>();
  private disposed = false;

  constructor(private readonly options: DataSourceRuntimeOptions = {}) {}

  /**
   * Cambia el scope activo.
   *
   * Aborta todo lo que estuviera en vuelo: una respuesta pedida para el
   * usuario A no puede aterrizar en la vista del usuario B.
   */
  setScope(scope: DataScope): void {
    const changed = dataCacheKey(this.scope, { sourceKey: '' }) !== dataCacheKey(scope, { sourceKey: '' });
    this.scope = { ...scope };
    if (changed) this.abortInFlight();
  }

  getScope(): DataScope {
    return { ...this.scope };
  }

  /** Peticiones actualmente en vuelo. Permite comprobar el single-flight. */
  inFlightCount(): number {
    return this.inFlight.size;
  }

  async query<T>(query: DataQuery, executor: DataSourceExecutor<T>): Promise<DataResult<T>> {
    if (this.disposed) {
      return { status: 'cancelled', sequence: this.sequence, fromCache: false };
    }

    const key = dataCacheKey(this.scope, query);
    const sequence = ++this.sequence;

    const cached = this.readCache(key);
    if (cached) {
      this.lastAppliedSequence = Math.max(this.lastAppliedSequence, sequence);
      return { status: 'success', data: cached as T, sequence, fromCache: true };
    }

    // Single-flight: una petición idéntica ya en vuelo se reutiliza.
    const existing = this.inFlight.get(key);
    const controller = existing?.controller ?? new AbortController();
    const promise =
      existing?.promise ??
      executor(query, { scope: this.getScope(), signal: controller.signal, httpClient: this.options.httpClient });

    if (!existing) {
      this.inFlight.set(key, { promise: promise as Promise<unknown>, controller });
    }

    try {
      const data = (await promise) as T;

      if (this.disposed || controller.signal.aborted) {
        return { status: 'cancelled', sequence, fromCache: false };
      }
      // Respuesta obsoleta: llegó después de que se aplicara otra más nueva.
      if (sequence < this.lastAppliedSequence) {
        return { status: 'cancelled', sequence, fromCache: false };
      }

      this.lastAppliedSequence = sequence;
      this.writeCache(key, data);
      return { status: 'success', data, sequence, fromCache: false };
    } catch (error) {
      if (this.disposed || controller.signal.aborted) {
        return { status: 'cancelled', sequence, fromCache: false };
      }
      return { status: 'error', error, sequence, fromCache: false };
    } finally {
      if (this.inFlight.get(key)?.promise === promise) {
        this.inFlight.delete(key);
      }
    }
  }

  private readCache(key: string): unknown | undefined {
    const ttl = this.options.cacheTtlMs ?? 0;
    if (ttl <= 0) return undefined;
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    const now = this.options.now?.() ?? Date.now();
    if (now - entry.storedAt > ttl) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  private writeCache(key: string, value: unknown): void {
    if ((this.options.cacheTtlMs ?? 0) <= 0) return;
    this.cache.set(key, { value, storedAt: this.options.now?.() ?? Date.now() });
  }

  private abortInFlight(): void {
    this.inFlight.forEach((entry) => entry.controller.abort());
    this.inFlight.clear();
  }

  /** Invalida la caché de una fuente, o toda si no se nombra. */
  invalidate(sourceKey?: string): number {
    if (!sourceKey) {
      const size = this.cache.size;
      this.cache.clear();
      return size;
    }
    let removed = 0;
    Array.from(this.cache.keys()).forEach((key) => {
      if ((JSON.parse(key) as string[])[3] === sourceKey) {
        this.cache.delete(key);
        removed += 1;
      }
    });
    return removed;
  }

  /** Libera todo. Tras esto ninguna respuesta pendiente puede escribir. */
  dispose(): void {
    this.disposed = true;
    this.abortInFlight();
    this.cache.clear();
  }
}

export const createDataSourceRuntime = (options: DataSourceRuntimeOptions = {}): DataSourceRuntime =>
  new DataSourceRuntime(options);

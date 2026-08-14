/**
 * HttpClientAdapter — contrato de transporte del runtime.
 *
 * ## Por qué existe y qué NO duplica
 *
 * `designerEngine` ya poseía `SchemaRequestConfig`/`SchemaHttpClientConfig`:
 * configuración **declarativa** que describe QUÉ llamar (endpoint, método,
 * mapeos) y se edita en el inspector. Lo que no existía es el **transporte**:
 * quién ejecuta la petición. El core hacía `fetch(...)` directo en cuatro
 * puntos sueltos, sin timeout, sin cancelación y sin política de credenciales.
 *
 * Este módulo es la autoridad única de EJECUCIÓN. No reemplaza la
 * configuración declarativa: la consume.
 *
 * ## Neutralidad de transporte
 *
 * El core no depende de Axios ni de `fetch`. Depende de esta interfaz
 * estructural, así que el host puede inyectar:
 *
 * - su instancia Axios ya configurada —heredando `baseURL`, interceptores,
 *   inyección de `Authorization` y refresh—;
 * - un cliente basado en `fetch`;
 * - un transporte falso en tests.
 *
 * SISAD-PDFME nunca lee el token de Redux ni de `localStorage`: el host lo
 * inyecta por interceptor o por `resolveHeaders(context)`.
 *
 * ## Seguridad de cabeceras sensibles
 *
 * `Authorization`, `Cookie` y `Proxy-Authorization` NO se reenvían a cualquier
 * origen. Una definición de schema no puede, por sí sola, provocar la
 * exfiltración de credenciales del host hacia un dominio de terceros.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export type HttpResponseType = 'json' | 'text' | 'arrayBuffer' | 'blob';

export type HttpRequest = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
  responseType?: HttpResponseType;
};

export type HttpResponse<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  data: T;
};

export interface HttpClientAdapter {
  request<T = unknown>(request: HttpRequest): Promise<HttpResponse<T>>;
}

/** Contexto que recibe `resolveHeaders`. Sin secretos: los aporta el host. */
export type HttpHeaderContext = {
  request: Pick<HttpRequest, 'method' | 'url'>;
  runtimeSessionId?: string;
  userId?: string;
  documentId?: string;
  sourceKey?: string;
};

export type HttpHeaderResolver = (
  context: HttpHeaderContext,
) => Promise<Record<string, string>> | Record<string, string>;

/** Cabeceras que transportan credenciales. Comparación en minúsculas. */
export const SENSITIVE_HEADERS: readonly string[] = [
  'authorization',
  'cookie',
  'proxy-authorization',
  'x-api-key',
  'x-auth-token',
];

export const isSensitiveHeader = (name: string): boolean =>
  SENSITIVE_HEADERS.includes(name.trim().toLowerCase());

export class HttpClientError extends Error {
  constructor(
    public readonly code:
      | 'timeout'
      | 'aborted'
      | 'network'
      | 'invalid-url'
      | 'response-too-large'
      | 'adapter-missing',
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

/**
 * Origen de una URL, o `null` si es relativa.
 *
 * Una URL relativa es, por definición, del mismo origen que el documento.
 */
export const originOf = (url: string, baseUrl?: string): string | null => {
  const candidate = String(url ?? '').trim();
  if (!candidate) return null;
  try {
    const base = baseUrl || (typeof location !== 'undefined' ? location.href : undefined);
    return new URL(candidate, base).origin;
  } catch {
    return null;
  }
};

export type SensitiveHeaderPolicy = {
  /**
   * Orígenes a los que SÍ se permite enviar cabeceras sensibles, además del
   * propio. Deben declararse en la configuración del host, nunca en una
   * plantilla.
   */
  allowedOrigins?: string[];
  /** Origen propio. Por defecto el del documento. */
  selfOrigin?: string | null;
};

/**
 * ¿Se pueden enviar cabeceras sensibles a esta URL?
 *
 * Default cerrado: sólo mismo origen o allowlist explícita. Una URL que no se
 * puede analizar se trata como no permitida — lo no interpretable no recibe
 * credenciales.
 */
export const allowsSensitiveHeaders = (
  url: string,
  policy: SensitiveHeaderPolicy = {},
  baseUrl?: string,
): boolean => {
  const selfOrigin =
    policy.selfOrigin ?? (typeof location !== 'undefined' ? location.origin : null);
  const target = originOf(url, baseUrl);
  if (target === null) return false;
  if (selfOrigin && target === selfOrigin) return true;
  return (policy.allowedOrigins ?? []).includes(target);
};

/**
 * Aplica la política a un conjunto de cabeceras.
 *
 * Devuelve las cabeceras permitidas y la lista de las bloqueadas, para que el
 * llamador pueda registrarlo sin volcar su valor en ningún log.
 */
export const applySensitiveHeaderPolicy = (
  url: string,
  headers: Record<string, string>,
  policy: SensitiveHeaderPolicy = {},
  baseUrl?: string,
): { headers: Record<string, string>; blocked: string[] } => {
  if (allowsSensitiveHeaders(url, policy, baseUrl)) {
    return { headers: { ...headers }, blocked: [] };
  }
  const allowed: Record<string, string> = {};
  const blocked: string[] = [];
  Object.entries(headers).forEach(([name, value]) => {
    if (isSensitiveHeader(name)) {
      blocked.push(name);
      return;
    }
    allowed[name] = value;
  });
  return { headers: allowed, blocked };
};

/**
 * Precedencia de cabeceras, única y documentada.
 *
 * 1. defaults del cliente host (los aplica el propio cliente inyectado);
 * 2. configuración de transporte del runtime;
 * 3. cabeceras estáticas NO sensibles de la DataSource;
 * 4. `resolveHeaders(context)`;
 * 5. cabeceras técnicas del provider.
 *
 * Las capas 3 en adelante no pueden introducir cabeceras sensibles: una
 * plantilla no confiable no debe poder inyectar `Authorization`.
 */
export type HttpHeaderLayers = {
  transport?: Record<string, string>;
  dataSource?: Record<string, string>;
  resolved?: Record<string, string>;
  provider?: Record<string, string>;
};

export const mergeHeaderLayers = (layers: HttpHeaderLayers): Record<string, string> => {
  const merged: Record<string, string> = { ...(layers.transport ?? {}) };
  // La DataSource es configuración declarativa y puede venir de una plantilla:
  // sus cabeceras sensibles se descartan siempre.
  Object.entries(layers.dataSource ?? {}).forEach(([name, value]) => {
    if (!isSensitiveHeader(name)) merged[name] = value;
  });
  Object.assign(merged, layers.resolved ?? {});
  Object.assign(merged, layers.provider ?? {});
  return merged;
};

const appendQuery = (url: string, query?: Record<string, unknown>): string => {
  if (!query || Object.keys(query).length === 0) return url;
  const pairs: string[] = [];
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(entry))}`));
      return;
    }
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  if (!pairs.length) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${pairs.join('&')}`;
};

/**
 * Combina el `AbortSignal` del llamador con un timeout propio.
 *
 * Devuelve también el `dispose` para no dejar temporizadores ni listeners
 * colgando cuando la petición termina antes.
 */
const withTimeout = (
  timeoutMs: number | undefined,
  signal: AbortSignal | undefined,
): { signal: AbortSignal | undefined; dispose: () => void; timedOut: () => boolean } => {
  if (!timeoutMs && !signal) return { signal: undefined, dispose: () => undefined, timedOut: () => false };
  const controller = new AbortController();
  let timedOut = false;

  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  if (signal?.aborted) controller.abort();

  const timer =
    timeoutMs && timeoutMs > 0
      ? setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs)
      : null;

  return {
    signal: controller.signal,
    dispose: () => {
      if (timer) clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    },
    timedOut: () => timedOut,
  };
};

export type FetchLike = (input: string, init?: Record<string, unknown>) => Promise<Response>;

export type FetchHttpClientOptions = {
  fetch: FetchLike;
  baseUrl?: string;
  resolveHeaders?: HttpHeaderResolver;
  /** Política de cabeceras sensibles. Cerrada por defecto. */
  sensitiveHeaderPolicy?: SensitiveHeaderPolicy;
  defaultTimeoutMs?: number;
  /** Contexto de scope, para `resolveHeaders`. */
  context?: Omit<HttpHeaderContext, 'request'>;
};

const resolveUrl = (url: string, baseUrl?: string): string => {
  if (!baseUrl) return url;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
};

export const createFetchHttpClientAdapter = (
  options: FetchHttpClientOptions,
): HttpClientAdapter => ({
  async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const url = appendQuery(resolveUrl(request.url, options.baseUrl), request.query);
    const resolved = options.resolveHeaders
      ? await options.resolveHeaders({
        request: { method: request.method, url },
        ...(options.context ?? {}),
      })
      : {};

    const merged = mergeHeaderLayers({
      transport: request.headers,
      resolved,
    });
    const { headers } = applySensitiveHeaderPolicy(
      url,
      merged,
      options.sensitiveHeaderPolicy,
      options.baseUrl,
    );

    const timeout = withTimeout(request.timeoutMs ?? options.defaultTimeoutMs, request.signal);
    try {
      const response = await options.fetch(url, {
        method: request.method,
        headers,
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        signal: timeout.signal,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers?.forEach?.((value: string, key: string) => {
        responseHeaders[key] = value;
      });

      const data = await readBody<T>(response, request.responseType ?? 'json');
      return { status: response.status, headers: responseHeaders, data };
    } catch (error) {
      if (timeout.timedOut()) {
        throw new HttpClientError('timeout', `la petición a ${url} superó el tiempo máximo`, error);
      }
      if (request.signal?.aborted || (error as { name?: string })?.name === 'AbortError') {
        throw new HttpClientError('aborted', `petición cancelada: ${url}`, error);
      }
      throw new HttpClientError('network', `fallo de red en ${url}`, error);
    } finally {
      timeout.dispose();
    }
  },
});

const readBody = async <T>(response: Response, responseType: HttpResponseType): Promise<T> => {
  if (responseType === 'text') return (await response.text()) as unknown as T;
  if (responseType === 'arrayBuffer') return (await response.arrayBuffer()) as unknown as T;
  if (responseType === 'blob') return (await response.blob()) as unknown as T;
  const text = await response.text();
  if (!text) return null as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};

/**
 * Forma mínima de una instancia Axios.
 *
 * Se declara estructuralmente para NO añadir Axios como dependencia del core.
 * El host pasa su instancia ya configurada y el runtime hereda `baseURL`,
 * interceptores, inyección de `Authorization`, refresh y observabilidad sin
 * conocer nada de eso.
 */
export type AxiosLikeInstance = {
  request<T = unknown>(config: Record<string, unknown>): Promise<{
    status: number;
    headers: Record<string, string> | unknown;
    data: T;
  }>;
  defaults?: { baseURL?: string };
};

export type AxiosHttpClientOptions = {
  resolveHeaders?: HttpHeaderResolver;
  sensitiveHeaderPolicy?: SensitiveHeaderPolicy;
  defaultTimeoutMs?: number;
  context?: Omit<HttpHeaderContext, 'request'>;
};

const AXIOS_RESPONSE_TYPE: Record<HttpResponseType, string> = {
  json: 'json',
  text: 'text',
  arrayBuffer: 'arraybuffer',
  blob: 'blob',
};

export const createAxiosHttpClientAdapter = (
  instance: AxiosLikeInstance,
  options: AxiosHttpClientOptions = {},
): HttpClientAdapter => ({
  async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const baseUrl = instance.defaults?.baseURL;
    const absoluteUrl = resolveUrl(request.url, baseUrl);
    const resolved = options.resolveHeaders
      ? await options.resolveHeaders({
        request: { method: request.method, url: absoluteUrl },
        ...(options.context ?? {}),
      })
      : {};

    const merged = mergeHeaderLayers({ transport: request.headers, resolved });
    // Sólo se filtran las cabeceras que AÑADE el runtime. Las que inyecta un
    // interceptor del host son decisión suya y no pasan por aquí.
    const { headers } = applySensitiveHeaderPolicy(
      absoluteUrl,
      merged,
      options.sensitiveHeaderPolicy,
      baseUrl,
    );

    const timeout = withTimeout(request.timeoutMs ?? options.defaultTimeoutMs, request.signal);
    try {
      const response = await instance.request<T>({
        method: request.method,
        url: request.url,
        headers,
        params: request.query,
        data: request.body,
        signal: timeout.signal,
        responseType: AXIOS_RESPONSE_TYPE[request.responseType ?? 'json'],
      });
      return {
        status: response.status,
        headers: (response.headers as Record<string, string>) ?? {},
        data: response.data,
      };
    } catch (error) {
      if (timeout.timedOut()) {
        throw new HttpClientError('timeout', `la petición a ${absoluteUrl} superó el tiempo máximo`, error);
      }
      if (request.signal?.aborted || (error as { name?: string })?.name === 'CanceledError') {
        throw new HttpClientError('aborted', `petición cancelada: ${absoluteUrl}`, error);
      }
      throw new HttpClientError('network', `fallo de red en ${absoluteUrl}`, error);
    } finally {
      timeout.dispose();
    }
  },
});

/** Adapter ausente: falla explícito en vez de intentar `fetch` global. */
export const createMissingHttpClientAdapter = (): HttpClientAdapter => ({
  request() {
    return Promise.reject(
      new HttpClientError(
        'adapter-missing',
        'no se inyectó ningún HttpClientAdapter: el host debe proveerlo en resources.integrations.httpClient',
      ),
    );
  },
});

/**
 * Contrato del transporte HTTP (RTP-470).
 *
 * El core no puede acoplarse a Axios ni a `fetch`, y una definición de schema
 * no puede provocar por sí sola la exfiltración de credenciales del host.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  HttpClientError,
  allowsSensitiveHeaders,
  applySensitiveHeaderPolicy,
  createAxiosHttpClientAdapter,
  createFetchHttpClientAdapter,
  createMissingHttpClientAdapter,
  isSensitiveHeader,
  mergeHeaderLayers,
  originOf,
  type AxiosLikeInstance,
} from '../../../../../src/sisad-pdfme/integration/http/httpClient';

const jsonResponse = (body: unknown, status = 200, headers: Record<string, string> = {}) => ({
  status,
  headers: {
    forEach: (callback: (value: string, key: string) => void) =>
      Object.entries(headers).forEach(([key, value]) => callback(value, key)),
  },
  text: () => Promise.resolve(JSON.stringify(body)),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  blob: () => Promise.resolve({} as Blob),
}) as unknown as Response;

const SELF = 'https://app.host.test';
const OTHER = 'https://tercero.example';

describe('política de cabeceras sensibles', () => {
  it('reconoce las cabeceras que llevan credenciales', () => {
    ['Authorization', 'cookie', 'Proxy-Authorization', 'X-Api-Key'].forEach((name) => {
      expect(isSensitiveHeader(name), name).toBe(true);
    });
    expect(isSensitiveHeader('Content-Type')).toBe(false);
  });

  it('permite el mismo origen y bloquea el resto por defecto', () => {
    const policy = { selfOrigin: SELF };
    expect(allowsSensitiveHeaders(`${SELF}/api/x`, policy)).toBe(true);
    expect(allowsSensitiveHeaders(`${OTHER}/api/x`, policy)).toBe(false);
  });

  it('permite un origen declarado explícitamente en la allowlist', () => {
    expect(
      allowsSensitiveHeaders(`${OTHER}/api/x`, { selfOrigin: SELF, allowedOrigins: [OTHER] }),
    ).toBe(true);
  });

  it('una URL no analizable no recibe credenciales', () => {
    expect(originOf('http://')).toBeNull();
    expect(allowsSensitiveHeaders('http://', { selfOrigin: SELF })).toBe(false);
    expect(originOf('')).toBeNull();
    expect(allowsSensitiveHeaders('', { selfOrigin: SELF })).toBe(false);
  });

  it('un esquema opaco tampoco recibe credenciales', () => {
    expect(allowsSensitiveHeaders('javascript:fetch(1)', { selfOrigin: SELF })).toBe(false);
    expect(allowsSensitiveHeaders('data:text/html,x', { selfOrigin: SELF })).toBe(false);
  });

  it('bloquea sólo las sensibles y conserva el resto', () => {
    const { headers, blocked } = applySensitiveHeaderPolicy(
      `${OTHER}/api`,
      { Authorization: 'Bearer secreto', 'Content-Type': 'application/json' },
      { selfOrigin: SELF },
    );
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(blocked).toEqual(['Authorization']);
    expect(JSON.stringify(headers)).not.toContain('secreto');
  });
});

describe('precedencia de cabeceras', () => {
  it('la DataSource no puede inyectar cabeceras sensibles', () => {
    const merged = mergeHeaderLayers({
      dataSource: { Authorization: 'Bearer desde-plantilla', 'X-Tenant': 'acme' },
    });
    expect(merged).toEqual({ 'X-Tenant': 'acme' });
  });

  it('el resolver del host gana sobre la configuración declarativa', () => {
    const merged = mergeHeaderLayers({
      transport: { 'X-Tenant': 'transport' },
      dataSource: { 'X-Tenant': 'datasource' },
      resolved: { 'X-Tenant': 'resolver', Authorization: 'Bearer host' },
    });
    expect(merged['X-Tenant']).toBe('resolver');
    expect(merged.Authorization).toBe('Bearer host');
  });

  it('las cabeceras técnicas del provider son la última capa', () => {
    const merged = mergeHeaderLayers({
      resolved: { 'X-Trace': 'a' },
      provider: { 'X-Trace': 'b' },
    });
    expect(merged['X-Trace']).toBe('b');
  });
});

describe('adapter fetch', () => {
  it('ejecuta la petición y devuelve JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }, 200, { 'x-total': '9' }));
    const client = createFetchHttpClientAdapter({ fetch: fetchMock, sensitiveHeaderPolicy: { selfOrigin: SELF } });
    const response = await client.request({ method: 'GET', url: `${SELF}/api/items` });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: true });
    expect(response.headers['x-total']).toBe('9');
  });

  it('serializa query params sin perder arrays', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createFetchHttpClientAdapter({ fetch: fetchMock });
    await client.request({ method: 'GET', url: `${SELF}/api`, query: { q: 'a b', tag: ['x', 'y'], vacio: null } });
    const called = fetchMock.mock.calls[0][0] as string;
    expect(called).toContain('q=a%20b');
    expect(called).toContain('tag=x&tag=y');
    expect(called).not.toContain('vacio');
  });

  it('aplica resolveHeaders del host', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createFetchHttpClientAdapter({
      fetch: fetchMock,
      sensitiveHeaderPolicy: { selfOrigin: SELF },
      resolveHeaders: () => ({ Authorization: 'Bearer del-host' }),
    });
    await client.request({ method: 'GET', url: `${SELF}/api` });
    expect((fetchMock.mock.calls[0][1] as { headers: Record<string, string> }).headers.Authorization).toBe(
      'Bearer del-host',
    );
  });

  it('NO envía Authorization a un origen no permitido', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createFetchHttpClientAdapter({
      fetch: fetchMock,
      sensitiveHeaderPolicy: { selfOrigin: SELF },
      resolveHeaders: () => ({ Authorization: 'Bearer del-host' }),
    });
    await client.request({ method: 'GET', url: `${OTHER}/api` });
    const headers = (fetchMock.mock.calls[0][1] as { headers: Record<string, string> }).headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it('honra AbortSignal', async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          controller.signal.addEventListener('abort', () => {
            const error = new Error('abort');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    );
    const client = createFetchHttpClientAdapter({ fetch: fetchMock });
    const pending = client.request({ method: 'GET', url: `${SELF}/api`, signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });

  it('aplica timeout', async () => {
    const fetchMock = vi.fn().mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => {
            const error = new Error('abort');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    );
    const client = createFetchHttpClientAdapter({ fetch: fetchMock });
    await expect(
      client.request({ method: 'GET', url: `${SELF}/api`, timeoutMs: 5 }),
    ).rejects.toMatchObject({ code: 'timeout' });
  });

  it('soporta respuesta binaria y de texto', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ a: 1 }));
    const client = createFetchHttpClientAdapter({ fetch: fetchMock });
    expect(await client.request({ method: 'GET', url: `${SELF}/a`, responseType: 'text' })).toMatchObject({
      data: '{"a":1}',
    });
    expect(
      (await client.request({ method: 'GET', url: `${SELF}/a`, responseType: 'arrayBuffer' })).data,
    ).toBeInstanceOf(ArrayBuffer);
  });

  it('convierte fallos de red en HttpClientError', async () => {
    const client = createFetchHttpClientAdapter({ fetch: vi.fn().mockRejectedValue(new Error('boom')) });
    await expect(client.request({ method: 'GET', url: `${SELF}/api` })).rejects.toBeInstanceOf(HttpClientError);
  });
});

describe('adapter Axios inyectado', () => {
  const axiosLike = (): AxiosLikeInstance & { calls: Record<string, unknown>[] } => {
    const calls: Record<string, unknown>[] = [];
    return {
      calls,
      defaults: { baseURL: `${SELF}/api` },
      request: <T,>(config: Record<string, unknown>) => {
        calls.push(config);
        return Promise.resolve({ status: 200, headers: {} as unknown, data: { ok: true } as T });
      },
    };
  };

  it('reutiliza la instancia del host y hereda su baseURL', async () => {
    const instance = axiosLike();
    const client = createAxiosHttpClientAdapter(instance, { sensitiveHeaderPolicy: { selfOrigin: SELF } });
    const response = await client.request({ method: 'GET', url: '/items' });
    expect(response.data).toEqual({ ok: true });
    expect(instance.calls[0].url).toBe('/items');
  });

  it('no añade Authorization propio a un origen ajeno', async () => {
    const instance = axiosLike();
    const client = createAxiosHttpClientAdapter(instance, {
      sensitiveHeaderPolicy: { selfOrigin: SELF },
      resolveHeaders: () => ({ Authorization: 'Bearer x' }),
    });
    await client.request({ method: 'GET', url: `${OTHER}/items` });
    expect((instance.calls[0].headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('propaga método, query y body', async () => {
    const instance = axiosLike();
    const client = createAxiosHttpClientAdapter(instance);
    await client.request({ method: 'POST', url: '/x', query: { a: 1 }, body: { b: 2 } });
    expect(instance.calls[0]).toMatchObject({ method: 'POST', params: { a: 1 }, data: { b: 2 } });
  });
});

describe('adapter ausente', () => {
  it('falla explícito en vez de intentar un fetch global', async () => {
    await expect(
      createMissingHttpClientAdapter().request({ method: 'GET', url: '/x' }),
    ).rejects.toMatchObject({ code: 'adapter-missing' });
  });
});

/**
 * Descarga de assets remotos (RTP-530).
 *
 * El defecto que cierra este contrato no es de plumbing: `fetch(url).then(r =>
 * r.arrayBuffer())` **no mira el status**, así que un 404 que devuelve una
 * página HTML de error se convierte en «bytes de fuente» y revienta mucho más
 * tarde dentro de fontkit, con un mensaje que no menciona ni la URL ni el
 * código HTTP.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AssetFetchError,
  fetchAssetArrayBuffer,
  fetchAssetBlob,
  type AssetTransport,
} from '../../../../src/sisad-pdfme/common/assetFetch';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

const stubFetch = (response: Partial<Response>) => {
  const spy = vi.fn(async () => response as Response);
  globalThis.fetch = spy as unknown as typeof fetch;
  return spy;
};

describe('sin transporte inyectado', () => {
  it('devuelve los bytes cuando la respuesta es correcta', async () => {
    const bytes = new ArrayBuffer(8);
    stubFetch({ status: 200, arrayBuffer: async () => bytes });

    await expect(fetchAssetArrayBuffer('https://cdn.example/font.ttf')).resolves.toBe(bytes);
  });

  it('falla nombrando URL y status en vez de devolver la página de error', async () => {
    stubFetch({ status: 404, arrayBuffer: async () => new ArrayBuffer(2) });

    await expect(fetchAssetArrayBuffer('https://cdn.example/missing.ttf')).rejects.toThrow(
      AssetFetchError,
    );
    await expect(fetchAssetArrayBuffer('https://cdn.example/missing.ttf')).rejects.toThrow(
      /404.*missing\.ttf/,
    );
  });

  it('trata cualquier status fuera de 2xx como fallo', async () => {
    for (const status of [301, 400, 500]) {
      stubFetch({ status, arrayBuffer: async () => new ArrayBuffer(1) });
      await expect(fetchAssetArrayBuffer('https://cdn.example/a.ttf')).rejects.toBeInstanceOf(
        AssetFetchError,
      );
    }
  });

  it('propaga el signal de aborto al fetch global', async () => {
    const spy = stubFetch({ status: 200, arrayBuffer: async () => new ArrayBuffer(1) });
    const controller = new AbortController();

    await fetchAssetArrayBuffer('https://cdn.example/font.ttf', { signal: controller.signal });

    expect(spy).toHaveBeenCalledWith('https://cdn.example/font.ttf', { signal: controller.signal });
  });

  it('descarga blobs con la misma verificación de status', async () => {
    const blob = new Blob(['pdf']);
    stubFetch({ status: 200, blob: async () => blob });
    await expect(fetchAssetBlob('https://cdn.example/base.pdf')).resolves.toBe(blob);

    stubFetch({ status: 403, blob: async () => blob });
    await expect(fetchAssetBlob('https://cdn.example/base.pdf')).rejects.toBeInstanceOf(
      AssetFetchError,
    );
  });
});

describe('con transporte del host', () => {
  const transportReturning = (status: number, data: unknown) => {
    const request = vi.fn(async (_input: Record<string, unknown>) => ({ status, data }));
    return { transport: { request } as unknown as AssetTransport, request };
  };

  it('usa el transporte inyectado y no el fetch global', async () => {
    const globalSpy = stubFetch({ status: 200, arrayBuffer: async () => new ArrayBuffer(1) });
    const bytes = new ArrayBuffer(4);
    const { transport, request } = transportReturning(200, bytes);

    await expect(
      fetchAssetArrayBuffer('https://cdn.example/font.ttf', { transport }),
    ).resolves.toBe(bytes);
    expect(globalSpy).not.toHaveBeenCalled();
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('pide GET binario y traslada timeout y signal', async () => {
    const { transport, request } = transportReturning(200, new ArrayBuffer(1));
    const controller = new AbortController();

    await fetchAssetArrayBuffer('https://cdn.example/font.ttf', {
      transport,
      timeoutMs: 5_000,
      signal: controller.signal,
    });

    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://cdn.example/font.ttf',
      responseType: 'arrayBuffer',
      signal: controller.signal,
      timeoutMs: 5_000,
    });
  });

  it('verifica el status también cuando responde el transporte', async () => {
    const { transport } = transportReturning(500, new ArrayBuffer(1));

    await expect(
      fetchAssetArrayBuffer('https://cdn.example/font.ttf', { transport }),
    ).rejects.toBeInstanceOf(AssetFetchError);
  });

  it('pide blob cuando el asset es un PDF base', async () => {
    const blob = new Blob(['pdf']);
    const { transport, request } = transportReturning(200, blob);

    await expect(fetchAssetBlob('https://cdn.example/base.pdf', { transport })).resolves.toBe(blob);
    expect(request.mock.calls[0][0]).toMatchObject({ responseType: 'blob' });
  });
});

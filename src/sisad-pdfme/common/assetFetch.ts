/**
 * Descarga de assets por URL: fuentes tipográficas y PDF base.
 *
 * ## Por qué existe
 *
 * Tres puntos del pipeline resolvían un asset remoto con `fetch(url).then(r =>
 * r.arrayBuffer())`. Ese patrón tiene un defecto que no es de estilo: **no mira
 * el status**. Un 404 que devuelve una página HTML de error se convierte en
 * «bytes de fuente» y el fallo aparece mucho después, dentro de fontkit o de
 * pdf-lib, con un mensaje que no menciona la URL ni el código HTTP.
 *
 * Además no había forma de imponer timeout, abort ni política de credenciales,
 * que es justo lo que el host inyecta con su `HttpClientAdapter`.
 *
 * ## Por qué el puerto se declara aquí y no se importa
 *
 * `common` es la capa más baja: hoy no depende de `integration` y crear esa
 * arista sólo para tipar el transporte invertiría las capas. En su lugar se
 * declara el contrato **mínimo** que este módulo necesita. `HttpClientAdapter`
 * lo satisface estructuralmente, así que el cliente del host encaja sin que
 * `common` sepa que `integration` existe.
 *
 * No hay singleton: el transporte se pasa por llamada. Un módulo con estado
 * global se filtraría entre instancias, que es exactamente lo que el resto del
 * runtime evita.
 */

/**
 * Contrato mínimo de transporte que necesita la descarga de assets.
 *
 * Deliberadamente más estrecho que `HttpClientAdapter`: sólo GET y sólo los
 * tipos de respuesta binarios. Cualquier adapter que cumpla el contrato ancho
 * cumple éste.
 */
export type AssetTransport = {
  request<T>(request: {
    method: 'GET';
    url: string;
    responseType: 'arrayBuffer' | 'blob';
    signal?: AbortSignal;
    timeoutMs?: number;
  }): Promise<{ status: number; data: T }>;
};

export type AssetFetchOptions = {
  /** Transporte del host. Sin él se usa `fetch` global. */
  transport?: AssetTransport;
  signal?: AbortSignal;
  timeoutMs?: number;
};

/** Error de descarga que sí nombra la URL y el status. */
export class AssetFetchError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
  ) {
    super(`No se pudo descargar el asset (${status}): ${url}`);
    this.name = 'AssetFetchError';
  }
}

const assertOk = (url: string, status: number): void => {
  if (status < 200 || status >= 300) throw new AssetFetchError(url, status);
};

/** Descarga un asset como `ArrayBuffer`. */
export const fetchAssetArrayBuffer = async (
  url: string,
  options: AssetFetchOptions = {},
): Promise<ArrayBuffer> => {
  if (options.transport) {
    const response = await options.transport.request<ArrayBuffer>({
      method: 'GET',
      url,
      responseType: 'arrayBuffer',
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
    assertOk(url, response.status);
    return response.data;
  }

  const response = await fetch(url, { signal: options.signal });
  assertOk(url, response.status);
  return response.arrayBuffer();
};

/** Descarga un asset como `Blob`. */
export const fetchAssetBlob = async (url: string, options: AssetFetchOptions = {}): Promise<Blob> => {
  if (options.transport) {
    const response = await options.transport.request<Blob>({
      method: 'GET',
      url,
      responseType: 'blob',
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
    assertOk(url, response.status);
    return response.data;
  }

  const response = await fetch(url, { signal: options.signal });
  assertOk(url, response.status);
  return response.blob();
};

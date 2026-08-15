# HTTP Client Contract

## Propósito

SISAD-PDFME puede consumir recursos remotos sin acoplarse a Axios, fetch, Redux,
cookies, un backend concreto o una aplicación host.

## Autoridad

El core depende de un contrato estructural:

```ts
export type HttpRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  url: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob';
};

export type HttpResponse<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  data: T;
};

export interface HttpClientAdapter {
  request<T = unknown>(request: HttpRequest): Promise<HttpResponse<T>>;
}
```

No se requiere que el contrato anterior sea idéntico en nombre si live source ya posee
una abstracción equivalente. Debe existir una sola autoridad.

## Inyección desde el host

La frontera pública debe aceptar runtime resources no serializables:

```ts
resources: {
  integrations: {
    httpClient,
    dataSources,
    signatureExecution,
    fonts
  }
}
```

La forma exacta debe reconciliarse con `SisadPdfmeInstanceResources`; no crear una
segunda raíz si `adapters` o `resources` ya resuelven el mismo problema.

## Axios

Axios es una integración opcional, no dependencia del core.

Patrón recomendado:

```ts
const api = axios.create({
  baseURL: env.API_URL
});

api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const httpClient = createAxiosHttpClientAdapter(api);
```

Al reutilizar `api`, SISAD-PDFME hereda la conducta configurada por el host mediante
el adapter, sin conocer cómo se obtiene el token.

También puede existir una factory que reciba una configuración Axios, siempre fuera
del template/snapshot y sin hacer de Axios una dependencia obligatoria del core.

## Fetch u otros clientes

Debe poder existir una implementación equivalente:

```ts
const httpClient = createFetchHttpClientAdapter({
  fetch: window.fetch.bind(window),
  baseUrl,
  resolveHeaders
});
```

Cualquier cliente futuro puede participar si implementa `HttpClientAdapter`.

## Authorization y headers

Modos conceptuales:

- `client`: el cliente inyectado resuelve defaults/interceptors;
- `resolver`: el host entrega headers dinámicos por request;
- `none`: no se inyectan credenciales;
- `provider`: un DataSource/Signature provider resuelve su propia autenticación.

No leer tokens directamente desde Redux/localStorage dentro de SISAD-PDFME.

Ejemplo:

```ts
resolveHeaders: async (context) => {
  const token = hostSession.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

## Seguridad de headers sensibles

Authorization, Cookie, Proxy-Authorization y secretos equivalentes no se deben reenviar
automáticamente a cualquier origen.

Default seguro:

```text
same origin
OR explicit allowed origin
=> sensitive headers pueden enviarse

otro origen
=> sensitive headers bloqueados
```

Una source remota no puede desactivar esta regla desde un template no confiable.

## Precedencia

La precedencia debe ser única y documentada. Recomendación:

1. defaults/interceptors del cliente host;
2. configuración runtime del transport;
3. headers estáticos no sensibles de DataSource;
4. `resolveHeaders(context)`;
5. headers técnicos generados por el provider.

Conflictos de headers sensibles deben seguir política explícita, no merge silencioso.

## Lifecycle

Todo request debe soportar cuando aplique:

- AbortSignal;
- timeout;
- correlación;
- tamaño máximo;
- tipos de contenido permitidos;
- logging seguro;
- retry sólo cuando sea semánticamente seguro;
- cleanup al desmontar/cambiar session/document/User.

## Persistencia

No serializar:

- cliente HTTP;
- instancia Axios;
- interceptors;
- funciones;
- Authorization;
- cookies;
- API keys;
- client secrets.

El patrón actual donde el bundle elimina adapters no serializables debe extenderse a
los integration runtime resources equivalentes.

## Tests mínimos

- cliente Axios-like inyectado;
- cliente fetch-like inyectado;
- Authorization mediante interceptor;
- Authorization mediante resolver;
- no Authorization cross-origin no permitido;
- AbortSignal;
- timeout;
- request concurrente;
- response JSON/text/binary;
- adapter ausente;
- snapshot/bundle sin secretos ni funciones.

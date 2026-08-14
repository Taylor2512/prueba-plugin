# Fuentes de datos HTTP

SISAD-PDFME no obliga al proyecto consumidor a usar Axios.

El consumidor puede reutilizar su cliente HTTP existente. Si ese cliente ya tiene
interceptors, baseURL y Authorization, el adapter preserva esa conducta.

La alternativa es inyectar un resolver de headers dinámicos.

## Regla

```text
template
→ sourceKey
→ DataSource
→ HttpClientAdapter
→ cliente del host
```

No:

```text
template
→ token
→ axios directo
```

## APIs arbitrarias

Una API puede devolver:

- scalar;
- object;
- array;
- objeto paginado;
- arrays anidados.

La selección de datos usa JSON Pointer/JSONPath y mappings declarativos.

## Select remoto

El dropdown puede mostrar aproximadamente cinco filas y permitir scroll, mientras el pageSize
remoto puede ser mayor. Para grandes volúmenes se usa búsqueda remota y virtualización.

## Authentication

El host controla Authorization.

Recomendado:

- Axios instance con interceptor;
- o `resolveHeaders`;
- o provider custom.

Nunca guardar Authorization en snapshot/template.

## Orígenes

Headers sensibles no se reenvían a un origen arbitrario. El host configura allowlist/policy.

## Generación PDF

Viewer/Generator usan el valor ya confirmado. No dependen de una consulta HTTP posterior.

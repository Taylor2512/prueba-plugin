# Schema config, persistencia, API y Form JSON

## 1. El schema ya no es solo UI

En la arquitectura actual, cada schema no representa únicamente un elemento visual. También puede cargar configuración semántica y de runtime. Eso es lo que vuelve a `sisad-pdfme` reutilizable en escenarios reales.

## 2. Núcleo del contrato

El contrato actual de configuración incluye:

- `identity`
- `prefill`
- `persistence`
- `api`
- `form`
- `integrations`
- `collaboration`
- `metadata`

Este contrato ya vive cerca del `designerEngine` y del runtime adapter.

## 3. `SchemaPersistenceConfig`

La persistencia ya soporta una estructura clara:
- `enabled`
- `mode`
- `key`
- `includeHidden`
- `includeMeta`

### Casos de uso
- recordar valores de draft
- mantener inputs entre navegación
- persistir información operativa local

### Ejemplo

```ts
const persistence = {
  enabled: true,
  mode: 'local',
  key: 'cliente.nombre',
  includeHidden: false,
  includeMeta: false,
};
```

## 4. `SchemaRequestConfig`

Permite configurar consultas o envíos remotos:
- `enabled`
- `endpoint`
- `method`
- `requestMode`
- `http`
- `headers`
- `params`
- `requestMapping`
- `responseMapping`
- `timeoutMs`

### Casos de uso
- cargar opciones para un select
- autocompletar campos desde API
- sincronizar un schema con backend
- disparar lectura o submit parcial

### Ejemplo

```ts
const api = {
  enabled: true,
  endpoint: '/customers/search',
  method: 'GET',
  requestMode: 'read',
  params: {
    q: '{{schema.value}}',
  },
  responseMapping: {
    customerName: 'data.name',
    customerEmail: 'data.email',
  },
};
```

## 5. `SchemaHttpClientConfig`

La configuración HTTP permite:
- heredar del sistema
- sobrescribir baseURL
- timeout
- withCredentials
- headers
- auth

### Modos recomendados
- `inheritSystem: true` para la mayoría
- `inheritSystem: false` solo si el schema requiere endpoint aislado

## 6. `SchemaHttpAuthConfig`

Admite:
- `inherit`
- `manual`

Y tipos:
- bearer
- basic
- apiKey
- custom

### Ejemplo

```ts
const http = {
  inheritSystem: false,
  baseURL: 'https://api.partner.com',
  auth: {
    mode: 'manual',
    type: 'apiKey',
    headerName: 'x-api-key',
    headerValue: 'secret-key',
  },
};
```

## 7. `SchemaFormJsonConfig`

Permite definir cómo un schema participa en el payload JSON:
- `enabled`
- `collect`
- `format`
- `rootKey`
- `includeEmpty`
- `includeHidden`
- `includeMeta`

### Casos de uso
- exportar snapshot del formulario
- construir payload para submit
- integrar con sistemas externos
- consolidar datos de varios schemas

### Ejemplo

```ts
const form = {
  enabled: true,
  collect: true,
  format: 'nested',
  rootKey: 'formData',
  includeEmpty: false,
  includeHidden: false,
  includeMeta: true,
};
```

## 8. `resolveDesignerHttpClientConfig`

Esta función es fundamental porque combina:
- config del schema
- config global del engine

Es el punto correcto para decidir configuración efectiva de requests.

### Regla
No resolver configuración HTTP dentro del widget visual; resolverla en esta capa y luego renderizar resultado.

## 9. `createSchemaDataRuntimeAdapter`

Este adaptador abstrae:
- storage
- fetch
- reloj/now

Es la pieza ideal para ejecutar runtime sin acoplarlo al navegador directo.

### Beneficios
- testabilidad
- inyección de mocks
- separación de UI y ejecución

## 10. Validación de configuración

El widget actual ya inspecciona faltantes como:
- key de storage
- endpoint
- baseURL
- auth manual incompleta

Eso está muy bien y conviene formalizarlo más en una función reusable.

### Recomendación
Extraer funciones como:
- `validatePersistenceConfig`
- `validateApiConfig`
- `validateFormConfig`

## 11. Buen diseño del bloque “Conexiones”

Lo correcto es presentar tres subbloques:

### Persistencia
- switch
- key
- modo
- flags extra

### API
- switch
- endpoint
- método
- modo
- auth
- mapping

### Form JSON
- switch
- collect
- formato
- rootKey
- flags de inclusión

## 12. Ejemplo de update de config

```ts
updateSchemaConfig?.({
  persistence: {
    ...schemaConfig?.persistence,
    enabled: true,
    key: 'cliente.cedula',
  },
});
```

## 13. Ejemplo de resolución efectiva

```ts
const resolvedHttp = resolveDesignerHttpClientConfig(schemaConfig, designerEngine);

if (schemaConfig?.api?.enabled && resolvedHttp) {
  // ejecutar request con config efectiva
}
```

## 14. Diseño recomendado de documentación de contracts

Cada contrato debe documentar:
- definición TS
- valores por defecto
- ejemplo mínimo
- ejemplo completo
- casos de uso
- riesgos
- validaciones

## 15. Riesgos actuales

### 15.1 Mezclar UI con runtime
El widget visual conoce bastante del runtime; a largo plazo convendría un servicio de config validation y de config summary.

### 15.2 Crecimiento del config object
Si cada nueva feature se agrega al mismo objeto sin modularidad, se volverá difícil de versionar.

### 15.3 Compatibilidad hacia atrás
Cambiar nombres de keys de config rompe templates persistidos. Toda evolución debe considerar migración.

## 16. Recomendación operativa

Tratar el schema config como producto:
- versionarlo
- validarlo
- resumirlo visualmente
- documentarlo con ejemplos
- probarlo fuera del inspector

## 17. Checklist

- ¿La nueva opción pertenece al schema o al engine?
- ¿Debe persistirse?
- ¿Afecta preview o solo submit?
- ¿Se hereda del sistema o es local?
- ¿Cómo se valida?
- ¿Cómo se serializa?

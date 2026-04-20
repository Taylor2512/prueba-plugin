# Runtime de datos, persistencia, API y salida JSON

## Introducción

SISAD PDFME permite que cada schema transporte comportamiento de datos además de comportamiento visual. Esto aparece especialmente en:

- `persistence`
- `api`
- `form`
- `prefill`
- `metadata`

La capa clave para esto es el runtime adapter de datos.

## Persistencia

### Objetivo
Guardar valores capturados para restaurar drafts, mantener estado local y soportar formularios complejos.

### Campos observables
- `enabled`
- `mode`
- `key`
- `includeHidden`
- `includeMeta`

### Ejemplo

```ts
mergeSchemaDesignerConfig(schema, {
  persistence: {
    enabled: true,
    mode: 'hybrid',
    key: 'form.campo-1',
    includeHidden: true,
  },
});
```

## API remota

### Objetivo
Obtener opciones, autocompletar datos, validar o sincronizar información remota.

### Campos observables
- `enabled`
- `endpoint`
- `method`
- `http`
- `params`
- `requestMapping`
- `responseMapping`
- `timeoutMs`

### Ejemplo

```ts
mergeSchemaDesignerConfig(schema, {
  api: {
    enabled: true,
    endpoint: '/fields/options',
    method: 'POST',
    params: { page: '1' },
    requestMapping: { value: 'schema.content' },
    responseMapping: { options: 'data.items' },
    timeoutMs: 4000,
  },
});
```

## Form JSON

### Objetivo
Exponer una salida de formulario estructurada y configurable.

### Campos observables
- `enabled`
- `collect`
- `format`
- `rootKey`
- `includeEmpty`
- `includeHidden`
- `includeMeta`

### Ejemplo

```ts
mergeSchemaDesignerConfig(schema, {
  form: {
    enabled: true,
    collect: true,
    format: 'flat',
    rootKey: 'formData',
    includeEmpty: false,
    includeHidden: false,
    includeMeta: true,
  },
});
```

## HTTP heredable

`resolveDesignerHttpClientConfig` compone engine y field-level config.

### Casos
- herencia completa;
- baseURL local;
- headers adicionales;
- auth manual;
- API key específica.

## Validación del widget de conexiones

La implementación observada en `SchemaConnectionsWidget` construye tags y mensajes como:

- Auth heredada / Auth manual
- Validación OK / parcial
- Sin validar
- missing fields: storageKey, endpoint, baseURL, auth

Esto demuestra que el widget no solo edita config: también la evalúa.

## Recomendaciones de documentación

- describir precedencia entre config global y local;
- mostrar ejemplos de `requestMapping` y `responseMapping`;
- documentar ejemplos para select, autocomplete, lookup y submit parcial;
- documentar qué significa `collect` en `form`.

## Ejemplo completo

```ts
const nextSchema = mergeSchemaDesignerConfig(
  schema,
  {
    persistence: {
      enabled: true,
      mode: 'local',
      key: 'customer.email',
    },
    api: {
      enabled: true,
      endpoint: '/customers/lookup',
      method: 'POST',
      http: {
        inheritSystem: true,
      },
      requestMapping: {
        email: 'schema.content',
      },
      responseMapping: {
        fullName: 'data.customer.name',
        phone: 'data.customer.phone',
      },
    },
    form: {
      enabled: true,
      collect: true,
      format: 'nested',
      rootKey: 'customerForm',
      includeMeta: true,
    },
  },
  engine,
);
```

## Buenas prácticas

1. usar keys de persistencia únicas;
2. no habilitar API sin endpoint;
3. validar baseURL si `inheritSystem = false`;
4. documentar contractos remotos por field;
5. agregar pruebas de runtime.

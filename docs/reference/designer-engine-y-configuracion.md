# Motor de diseño (`designerEngine`) y configuración de schemas

## Objetivo del engine

`designerEngine.ts` es la capa que transforma el diseñador en una plataforma configurable. En vez de hardcodear sidebars, estilos, comportamiento del canvas y metadata de schemas dentro del editor, el engine permite inyectar estos comportamientos desde afuera mediante un builder fluido.

El engine resuelve cinco problemas clave:

1. personalización de la UI sin fork adicional;
2. persistencia de configuración por schema;
3. configuración HTTP global y heredable;
4. identidad estable de los fields;
5. ejecución de hooks de creación y defaults colaborativos.

## Builder principal

El punto de entrada es `DesignerEngineBuilder`.

### Métodos observados

El builder soporta al menos estas capacidades:

- `withLeftSidebar(renderer)`
- `withRightSidebar(renderer)`
- `withLeftSidebarProps(left)`
- `withRightSidebarProps(right)`
- `withCanvasFeatureToggles(featureToggles)`
- `withCanvasStyleOverrides(styleOverrides)`
- `withCanvasClassNames(classNames)`
- `withCanvasComponents(components)`
- `withCanvasUseDefaultStyles(useDefaultStyles)`
- `withHttpAxiosConfig(axios)`
- `withSchemaConfigStorageKey(configStorageKey)`
- `withSchemaIdentityFactory(identityFactory)`
- `withSchemaCreationHook(onCreate)`
- `withAutoAttachIdentity(autoAttachIdentity)`
- `build()`
- `buildOptions(options)` 

## Qué problema resuelve cada capacidad

### Sidebars reemplazables

Permiten montar experiencias de marca propias sin modificar el runtime base. Esto es valioso para vender el producto como plataforma.

### Feature toggles del canvas

Permiten activar/desactivar guides, snap lines, moveable, padding y otros elementos visuales según modo de uso.

### Style overrides y classNames

Permiten hacer theming o integración con design systems externos.

### HTTP global

Permite definir un cliente HTTP heredable por todos los schemas con comportamiento local adicional.

### Clave de almacenamiento

`withSchemaConfigStorageKey` aísla la configuración interna dentro del schema. Esto evita colisiones entre proyectos.

### Identidad

`withSchemaIdentityFactory` permite fabricar identidades estables y personalizadas.

### Hook de creación

`withSchemaCreationHook` permite ejecutar reglas justo cuando el schema se crea.

### AutoAttachIdentity

Evita depender de adjuntar identidad manualmente tras cada inserción.

## Modelo de configuración por schema

El engine almacena metadata en una clave configurable dentro del schema. Las secciones más relevantes que se observan en el código y documentación son:

- `identity`
- `prefill`
- `persistence`
- `api`
- `form`
- `metadata`
- `integrations`

## Funciones de lectura y escritura

### `getSchemaDesignerConfig`

Lee la configuración persistida del schema.

Uso recomendado:

```ts
const config = getSchemaDesignerConfig(schema, engine);
if (config?.persistence?.enabled) {
  // mostrar badge Guardar
}
```

### `setSchemaDesignerConfig`

Conviene usarla cuando quieres sobrescribir la configuración de forma controlada.

### `mergeSchemaDesignerConfig`

Es la utilidad más importante para el día a día del inspector. Permite aplicar parches sin perder bloques anidados.

Ejemplo realista:

```ts
const next = mergeSchemaDesignerConfig(
  schema,
  {
    api: {
      enabled: true,
      endpoint: '/catalog/options',
      method: 'GET',
      responseMapping: {
        options: 'data.items',
      },
    },
  },
  engine,
);
```

## Configuración HTTP

### `withHttpAxiosConfig`

Permite definir comportamiento global:

```ts
const engine = new DesignerEngineBuilder()
  .withHttpAxiosConfig({
    baseURL: 'https://api.mycompany.com',
    timeoutMs: 3000,
    headers: {
      Authorization: 'Bearer token',
      'X-App': 'sisad-editor',
    },
    auth: {
      mode: 'manual',
      type: 'bearer',
      token: 'token',
    },
  })
  .build();
```

### `resolveDesignerHttpClientConfig`

Resuelve la configuración efectiva combinando engine y overrides del schema.

Casos esperables:

- heredar todo del engine;
- heredar y añadir headers;
- desactivar herencia y usar baseURL local;
- auth manual por schema;
- API key específica del field.

## Runtime adapter de datos

La documentación y las pruebas muestran la existencia de `createSchemaDataRuntimeAdapter`, que desacopla la lógica de persistencia y fetch del resto de la UI.

### Responsabilidades del adapter

- leer valores persistidos;
- escribir valores persistidos;
- componer cliente HTTP efectivo;
- facilitar consultas API configuradas por schema;
- construir envelopes JSON de formulario.

### Beneficios

- testabilidad;
- reemplazo de storage;
- reemplazo de `fetchImpl`;
- independencia respecto al browser real.

## Identidad de schemas

`attachSchemaIdentity` usa:

- el `identityFactory` si existe;
- o un fallback con:
  - `id`
  - `key`
  - `namespace`
  - `version`
  - `tags`

Ejemplo de identidad custom:

```ts
const engine = new DesignerEngineBuilder()
  .withSchemaIdentityFactory((schema, context) => ({
    id: schema.id,
    key: `sales-${schema.name}`,
    namespace: 'sales-contract',
    version: '2',
    tags: [schema.type, context.activeFileId || 'default-file'],
  }))
  .build();
```

## Hook de creación

Puedes aplicar defaults de negocio al crear un schema.

```ts
const engine = new DesignerEngineBuilder()
  .withSchemaCreationHook((schema, context) => {
    return mergeSchemaDesignerConfig(schema, {
      persistence: {
        enabled: true,
        mode: 'local',
        key: `draft.${context.pageCursor}.${schema.name}`,
      },
    });
  })
  .build();
```

## Defaults colaborativos

En la versión actual también aparecen integraciones de colaboración como `applySchemaCollaborativeDefaults`. Esto implica que el engine ya no solo gobierna styling y storage, sino también ownership y coordinación multiusuario.

## Buenas prácticas

1. usa `mergeSchemaDesignerConfig` para parches;
2. no mutar directamente el schema;
3. define una `configStorageKey` aislada por producto;
4. centraliza la auth global en el engine;
5. limita overrides locales a lo estrictamente necesario;
6. agrega pruebas unitarias para cada nueva sección del config;
7. documenta el contrato de cada bloque (`persistence`, `api`, `form`, etc.).

## Ejemplo completo

```ts
import { DesignerEngineBuilder } from '@sisad-pdfme/ui';

export const editorEngine = new DesignerEngineBuilder()
  .withCanvasFeatureToggles({
    guides: true,
    selecto: true,
    moveable: true,
    snapLines: true,
    padding: true,
    mask: false,
  })
  .withHttpAxiosConfig({
    inheritSystem: true,
    baseURL: 'https://api.company.com',
    timeoutMs: 5000,
    headers: { 'X-Product': 'contracts' },
    auth: {
      mode: 'manual',
      type: 'bearer',
      token: 'demo-token',
    },
  })
  .withSchemaConfigStorageKey('__contractsDesigner')
  .withSchemaIdentityFactory((schema) => ({
    id: schema.id,
    key: schema.name,
    namespace: 'contracts',
    version: '1',
    tags: [schema.type],
  }))
  .withSchemaCreationHook((schema) =>
    mergeSchemaDesignerConfig(schema, {
      persistence: {
        enabled: true,
        mode: 'local',
        key: `contracts.${schema.name}`,
      },
      form: {
        enabled: true,
        collect: true,
        format: 'flat',
        rootKey: 'formData',
      },
    }),
  )
  .withAutoAttachIdentity(true)
  .build();
```

## Errores comunes

- sobrescribir todo `api` cuando solo quieres cambiar `headers`;
- usar keys de persistence no únicas;
- no documentar `responseMapping`;
- mezclar auth global y auth local sin una política clara;
- persistir campos ocultos sin necesidad.

## Estrategia de documentación recomendada

Toda evolución del engine debería acompañarse con:

- ejemplo mínimo;
- ejemplo avanzado;
- tabla de propiedades;
- riesgos;
- reglas de precedencia;
- prueba unitaria asociada.

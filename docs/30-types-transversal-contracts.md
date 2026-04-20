# Tipos y contratos transversales

## 1. Propósito

El repositorio ya no funciona como una adaptación superficial de un editor PDF. La presencia de módulos separados para `common`, `generator`, `converter`, `schemas`, `ui` y `pdf-lib`, más capas propias como colaboración, persistencia, API, form-json, sidebars, overlays e inline edit, obliga a tratar los tipos como contratos de plataforma y no solo como ayuda de TypeScript.

## 2. Zonas donde los contratos importan más

### 2.1 `common/types.ts`
Debe convertirse en la fuente de verdad para:
- plantilla (`template`)
- schemas
- inputs
- basePdf
- runtime config
- identidad de schemas
- configuración persistente de diseño

### 2.2 `ui/types.ts`
Debe expresar:
- estado del editor
- runtime api
- callbacks de interacción
- configuración del engine
- surface api pública

### 2.3 `generator/types.ts` y `converter/types.d.ts`
Deben contener contratos puros de procesamiento, sin contaminarse con detalles del editor visual.

## 3. Principio rector

Separar tipos en tres niveles:

### A. Tipos de dominio
No saben nada del canvas ni de React.
Ejemplos:
- `Template`
- `Schema`
- `BasePdf`
- `SchemaIdentity`
- `SchemaDesignerConfig`

### B. Tipos de runtime
Conectan dominio con ejecución.
Ejemplos:
- `DesignerEngine`
- `SchemaDataRuntimeAdapter`
- `HttpClientConfig`
- `CollaborationChannel`
- `FormJsonEnvelope`

### C. Tipos de UI
Solo describen comportamiento visual e interacción.
Ejemplos:
- `SelectionToolbarMode`
- `RightSidebarViewMode`
- `InteractionState`
- `FloatingToolbarPosition`
- `InlineEditState`

## 4. Contratos que conviene formalizar mejor

### 4.1 Schema identity
Hoy ya hay soporte documental y técnico para identidad y hooks de creación. Conviene unificarlo en una interfaz estable como:

```ts
export interface SchemaIdentity {
  id: string;
  key?: string;
  namespace?: string;
  version?: string;
  tags?: string[];
}
```

### 4.2 Configuración persistente del schema
La configuración del schema ya abarca persistencia, API, form, metadata e integraciones. Conviene consolidarla como un contrato explícito:

```ts
export interface SchemaDesignerConfig {
  identity?: SchemaIdentity;
  prefill?: SchemaPrefillConfig;
  persistence?: SchemaPersistenceConfig;
  api?: SchemaRequestConfig;
  form?: SchemaFormConfig;
  metadata?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  collaboration?: SchemaCollaborationConfig;
}
```

### 4.3 Persistencia
```ts
export interface SchemaPersistenceConfig {
  enabled: boolean;
  mode?: "local" | "session" | "indexedDB" | "hybrid";
  key?: string;
  includeHidden?: boolean;
  includeMetadata?: boolean;
  strategy?: "replace" | "merge" | "append";
  ttlMs?: number;
}
```

### 4.4 API / HTTP
```ts
export interface SchemaRequestConfig {
  enabled: boolean;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requestMode?: "read" | "write" | "read-write";
  requestMapping?: Record<string, unknown>;
  responseMapping?: Record<string, unknown>;
  params?: Record<string, string>;
  timeoutMs?: number;
  http?: SchemaHttpClientConfig;
}
```

```ts
export interface SchemaHttpClientConfig {
  inheritSystem?: boolean;
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  auth?: SchemaHttpAuthConfig;
}
```

### 4.5 Form JSON
```ts
export interface SchemaFormConfig {
  enabled: boolean;
  collect?: boolean;
  format?: "flat" | "nested";
  rootKey?: string;
  includeEmpty?: boolean;
  includeHidden?: boolean;
  includeMeta?: boolean;
  alias?: string;
  path?: string;
}
```

### 4.6 Colaboración
La colaboración ya aparece en código y tests. Debe tener un contrato aislado:

```ts
export interface SchemaCollaborationConfig {
  enabled?: boolean;
  room?: string;
  lockMode?: "soft" | "hard";
  commentsEnabled?: boolean;
  awarenessEnabled?: boolean;
}
```

## 5. Riesgos actuales si no se formalizan

- duplicidad entre `common/types.ts` y `ui/types.ts`
- crecimiento de widgets que asumen estructura informal del config storage
- acoplamiento entre inspector y engine
- dificultad para publicar un SDK estable
- migraciones frágiles al renombrar namespaces

## 6. Recomendación de carpetas para contratos

```text
src/sisad-pdfme/contracts/
  template.ts
  schema.ts
  runtime.ts
  ui.ts
  collaboration.ts
  http.ts
  form-json.ts
```

Luego:
- `common` importa desde `contracts`
- `ui` importa desde `contracts`
- `generator` consume solo contratos puros

## 7. Ejemplo de implementación

### Paso 1
Crear `contracts/schema-config.ts`:

```ts
export * from "./identity";
export * from "./persistence";
export * from "./request";
export * from "./form";
export * from "./collaboration";
```

### Paso 2
Reexportar desde `common/index.ts`

```ts
export type {
  SchemaDesignerConfig,
  SchemaPersistenceConfig,
  SchemaRequestConfig,
  SchemaFormConfig,
} from "../contracts/schema-config";
```

### Paso 3
Actualizar widgets del inspector para leer solo contratos públicos.

## 8. Criterio de calidad

Un contrato transversal está bien definido cuando:
- no depende de React
- puede serializarse
- tiene defaults claros
- tiene compatibilidad hacia atrás
- tiene tests de construcción y merge

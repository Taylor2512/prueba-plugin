# Documentación técnica — `src/sisad-pdfme/common/*`

Documentación preparada para los archivos core compartidos de `@sisad-pdfme/common`.

Archivos cubiertos:

- `collaboration.ts`
- `comments.ts`
- `constants.ts`
- `dynamicTemplate.ts`
- `expression.ts`
- `helper.ts`
- `index.ts`
- `pluginRegistry.ts`
- `schema.ts`
- `types.ts`
- `version.ts`

> Criterio de arquitectura: estos archivos pertenecen al núcleo común. No deben importar React, componentes visuales, CSS, sidebars, canvas, Moveable ni Selecto. Su responsabilidad es contrato, datos, validación, helpers, plugins, comentarios, colaboración, templates dinámicos y exports públicos.

---

## 1. `collaboration.ts`

### Responsabilidad

Módulo común para colaboración, comentarios base y assignments. Centraliza normalización de usuarios/destinatarios, creación de comentarios/anclas, filtrado colaborativo y generación de índices de schemas por usuario, destinatario, documento y página.

### API pública

```ts
normalizeRecipientIds(value)
resolveSchemaAuthorId(schema)
schemaMatchesAuthorView(schema, filter)
filterSchemasByAuthorView(schemas, filter)
createSchemaComment(text, identity, overrides)
createSchemaCommentAnchor(anchor, identity)
upsertById(items, nextItem)
removeById(items, id)
buildSchemaAssignments(schemas)
buildUserSchemaAssignments(schemas)
buildUserRecipientAssignments(schemas, options)
validateCollaborativeSchemas(schemas)
```

### Encabezado recomendado

```ts
/**
 * collaboration.ts
 *
 * Utilidades puras de colaboración para `sisad-pdfme`.
 *
 * Este módulo no pertenece a la UI. Su función es normalizar ids,
 * crear comentarios/anclas, resolver visibilidad colaborativa y construir
 * estructuras de assignments derivadas de los schemas actuales.
 *
 * Estructuras principales:
 *
 * - SchemaAssignments:
 *   assignments[recipientId][fileId][pageKey] = [schemaUid]
 *
 * - UserRecipientSchemaAssignments:
 *   assignments[userId][recipientId][fileId][pageKey] = [schemaUid]
 *
 * Reglas:
 *
 * - `schemaUid` es la identidad técnica preferida del schema.
 * - `id` y `name` solo son fallback de compatibilidad.
 * - `ownerRecipientId/ownerRecipientIds` definen ownership funcional.
 * - `createdBy/lastModifiedBy` definen autoría colaborativa.
 * - `__shared__` representa schemas compartidos/globales.
 */
```

### Notas por función

#### `normalizeRecipientIds`

Normaliza ids recibidos como array o string separado por comas. Elimina espacios, valores vacíos y duplicados.

#### `createSchemaComment`

Crea un comentario completo con `id`, `scope`, `fileId`, `pageNumber`, `fieldId`, `schemaUid`, autor, fechas, texto, estado y replies.

#### `createSchemaCommentAnchor`

Crea un ancla visual de comentario asociada a documento, página, coordenada o schema.

#### `buildSchemaAssignments`

Agrupa schemas por destinatario:

```txt
assignments[recipientId][fileId][pageKey] = [schemaUid]
```

#### `buildUserSchemaAssignments`

Agrupa schemas por autor:

```txt
assignments[userId][fileId][pageKey] = [schemaUid]
```

#### `buildUserRecipientAssignments`

Agrupa por usuario y destinatario:

```txt
assignments[userId][recipientId][fileId][pageKey] = [schemaUid]
```

### Riesgos detectados

1. `createSchemaComment` y `createSchemaCommentAnchor` sobrescriben `authorId`, `authorName` y `authorColor` con `undefined` si `identity` viene vacío, aunque esos valores existan en `overrides` o `anchor`.
2. `Date.now()` se llama más de una vez para `timestamp` y `createdAt`; pueden diferir por milisegundos.
3. `normalizeText` solo acepta strings. Si el backend entrega ids numéricos, se pierden.
4. `pageNumber`, `x` y `y` solo aceptan números reales, no strings numéricos.
5. En `ownerMode: 'shared'`, `buildUserRecipientAssignments` puede guardar el mismo schema en `__unassigned__` y `__shared__`. Debes decidir si eso es trazabilidad deseada o duplicidad lógica.

---

## 2. `comments.ts`

### Responsabilidad

Fachada común para comentarios de schema y comentarios top-level del template. Soporta dos almacenamientos compatibles:

```txt
schema.comments[]
schema.commentAnchors[]
```

Y:

```txt
template.pdfComments[]
template.__commentAnchors[] // compatibilidad legacy
```

### API pública

```ts
findSchemaByUid(template, schemaUid)
addAnchorToSchema(schema, anchor, identity)
addCommentToSchema(schema, text, identity, anchor)
addCommentWithAnchorToTemplate(template, anchor, text, identity)
upsertTopLevelComment(template, entry)
removeTopLevelComment(template, commentId)
updateCommentInSchema(schema, commentId, updates)
deleteCommentFromSchema(schema, commentId)
resolveCommentInSchema(schema, commentId, resolved)
filterCommentsByFileAndPage(template, fileId, pageNumber)
```

### Encabezado recomendado

```ts
/**
 * comments.ts
 *
 * Capa común para gestionar comentarios y anclas del diseñador PDF.
 *
 * Este módulo opera sobre estructuras de datos, no sobre UI. Permite
 * crear, actualizar, eliminar, resolver y filtrar comentarios asociados
 * a schemas o a ubicaciones top-level del documento.
 *
 * Almacenamiento soportado:
 *
 * - `schema.comments[]` para comentarios embebidos en un campo.
 * - `schema.commentAnchors[]` para anclas visuales del campo.
 * - `template.pdfComments[]` como almacenamiento canónico top-level.
 * - `template.__commentAnchors[]` como compatibilidad legacy.
 */
```

### Notas por función

#### `findSchemaByUid`

Busca un schema dentro de `template.schemas` usando prioridad:

```txt
schemaUid → id → name
```

Retorna `{ pageIndex, index, schema }` o `null`.

#### `addCommentWithAnchorToTemplate`

Si el anchor contiene `schemaUid` y existe el schema, agrega el comentario dentro del schema. Si no existe, lo guarda como comentario top-level del template.

#### `filterCommentsByFileAndPage`

Devuelve comentarios de schemas y top-level, deduplicados por `commentId`, filtrando opcionalmente por `fileId` y `pageNumber`.

### Riesgos detectados

1. `commentsCount` aumenta o disminuye en cada operación, pero si se hace `upsert` sobre un comentario existente, el contador puede quedar inflado.
2. `removeTopLevelComment` elimina solo top-level; no elimina comentarios embebidos en schemas.
3. `resolveCommentInSchema` solo resuelve comentarios dentro de schema; no resuelve top-level.
4. `filterCommentsByFileAndPage` compara `fileId` usando `String`; correcto para compatibilidad, pero debe mantenerse consistente con `schema.fileId/fileTemplateId`.
5. Hay uso de `as any` en creación de anchors y comments. Sería ideal tipar mejor `PdfComment` y `TopLevelPdfCommentEntry` para reducir casts.

---

## 3. `constants.ts`

### Responsabilidad

Define constantes físicas, PDF base A4, ratios de conversión y fuente por defecto.

### API pública

```ts
PT_TO_PX_RATIO
PT_TO_MM_RATIO
MM_TO_PT_RATIO
ZOOM
BLANK_A4_PDF
CUSTOM_A4_PDF
BLANK_PDF
DEFAULT_FONT_NAME
DEFAULT_FONT_VALUE
```

### Encabezado recomendado

```ts
/**
 * constants.ts
 *
 * Constantes base para unidades, PDF por defecto y fuente fallback.
 *
 * Este archivo debe mantenerse estable porque afecta rendering,
 * generación PDF, conversión de unidades y templates sin PDF cargado.
 */
```

### Riesgos detectados

1. `BLANK_PDF` está deprecado y apunta a `CUSTOM_A4_PDF`. Conviene mantenerlo solo por compatibilidad.
2. `DEFAULT_FONT_VALUE` es una cadena base64 muy grande. No debe copiarse en logs ni documentación extensa.
3. Cambiar ratios como `PT_TO_MM_RATIO` o `ZOOM` puede romper layout y generación.

---

## 4. `dynamicTemplate.ts`

### Responsabilidad

Genera un template ajustado para contenido dinámico, especialmente tablas o schemas que pueden crecer en altura. Solo procesa templates con `BlankPdf`; si el `basePdf` es PDF real/custom, retorna el template original.

### API pública

```ts
getDynamicTemplate({ template, input, _cache, options, getDynamicHeights })
```

### Encabezado recomendado

```ts
/**
 * dynamicTemplate.ts
 *
 * Motor de reflujo para templates con schemas de altura dinámica.
 *
 * Su objetivo es calcular alturas reales, dividir contenido en páginas
 * cuando no cabe y devolver un nuevo template con schemas reposicionados.
 *
 * Reglas:
 *
 * - Solo aplica a `BlankPdf`.
 * - Procesa cada página de forma independiente.
 * - No propaga offset entre páginas originales.
 * - Respeta el orden original de schemas dentro de cada página.
 * - Usa `__bodyRange` y `__isSplit` para marcar schemas divididos.
 */
```

### Flujo interno

```txt
1. Verifica que basePdf sea BlankPdf.
2. Calcula alto útil de página: height - paddingTop - paddingBottom.
3. Normaliza schemas por página y los ordena por Y.
4. Calcula alturas dinámicas con concurrencia limitada.
5. Divide filas/contenido entre páginas.
6. Reordena cada página según orden original.
7. Elimina páginas vacías al final.
8. Si no hubo cambios, retorna el template original.
9. Si hubo cambios, retorna { basePdf, schemas: resultPages }.
```

### Riesgos detectados

1. El retorno `{ basePdf, schemas: resultPages }` puede perder metadata adicional del template original si existía, por ejemplo `documents`, `pdfComments`, `recipients`, `version`, etc.
2. El procesamiento es independiente por página. Eso es eficiente, pero significa que el overflow de una página no empuja contenido de páginas posteriores originales.
3. `orderMap` usa `schema.name` como clave. Si hay nombres repetidos, el orden puede ser ambiguo.
4. `getDynamicHeights` devuelve `[0]` si no hay alturas; esto puede crear schemas de altura 0.

### Ajuste recomendado

Preservar metadata del template:

```ts
return { ...template, basePdf, schemas: resultPages };
```

---

## 5. `expression.ts`

### Responsabilidad

Motor seguro de placeholders y expresiones dentro de contenido textual. Evalúa expresiones encerradas en `{ ... }` usando AST de `acorn`, con validación de sintaxis permitida, globals controlados y protección básica contra prototype pollution.

### API pública

```ts
replacePlaceholders({ content, data, schemas })
```

### Encabezado recomendado

```ts
/**
 * expression.ts
 *
 * Evaluador seguro de placeholders para contenido dinámico.
 *
 * Permite expresiones dentro de `{ ... }` usando un subconjunto controlado
 * de JavaScript evaluado desde AST, no mediante `eval`.
 *
 * Incluye:
 *
 * - cache de expresiones parseadas;
 * - parseo defensivo de strings JSON;
 * - globals permitidos;
 * - Object.assign seguro;
 * - bloqueo de `constructor`, `__proto__`, `prototype` y métodos peligrosos;
 * - helpers de fecha;
 * - fallback: si una expresión falla, conserva el placeholder original.
 */
```

### Comportamiento esperado

```txt
Entrada:  "Hola {user.name}, total: {price * qty}"
Contexto: { user: { name: "Ana" }, price: 10, qty: 3 }
Salida:   "Hola Ana, total: 30"
```

### Riesgos detectados

1. `parseDataCache` usa `JSON.stringify(data)` como key. En objetos grandes o con orden variable puede crecer demasiado o generar claves costosas.
2. Se permite `Date`, `Array`, `String`, `Number`, `JSON` y funciones globales. Aunque el AST está validado, conviene mantener tests de seguridad.
3. `CallExpression` permite llamar funciones si están en el contexto o globals permitidos. Esto debe ser deliberado.
4. La función conserva el placeholder original si falla, lo cual es bueno para resiliencia, pero puede ocultar errores si no hay modo debug.
5. El parser soporta expresiones con llaves anidadas mediante contador, lo cual es correcto, pero requiere tests de casos incompletos.

---

## 6. `helper.ts`

### Responsabilidad

Colección de utilidades comunes para validación, conversión de unidades, PDFs, fuentes, base64 y verificación de props.

### API pública

```ts
cloneDeep
getFallbackFontName
getDefaultFont
mm2pt
pt2mm
pt2px
px2mm
isHexValid
migrateTemplate
getInputFromTemplate
getB64BasePdf
isBlankPdf
b64toUint8Array
checkFont
checkPlugins
checkInputs
checkUIOptions
checkPreviewProps
checkDesignerProps
checkUIProps
checkTemplate
checkGenerateProps
```

### Encabezado recomendado

```ts
/**
 * helper.ts
 *
 * Utilidades transversales de `@sisad-pdfme/common`.
 *
 * Contiene conversiones físicas, normalización de PDF base, fuentes,
 * migración de templates legacy, conversión base64 y validaciones Zod
 * de contratos públicos.
 */
```

### Riesgos detectados

1. `cloneDeep = structuredClone` es limpio, pero puede fallar si recibe funciones, clases, DOM nodes u objetos no clonables.
2. `getB64BasePdf` hace `fetch` si recibe una URL en browser. Debe evitarse con URLs no confiables si el host no controla origen.
3. `migrateTemplate` muta el template recibido. Esto es intencional, pero debe documentarse porque otros helpers suelen clonar.
4. `checkFont` exige exactamente un fallback; correcto, pero puede romper integraciones si se registran fuentes sin fallback explícito.
5. `checkTemplate` migra y valida; si se usa en flujo de solo lectura, recordar que puede modificar estructura legacy.

---

## 7. `index.ts`

### Responsabilidad

Barril público de `@sisad-pdfme/common`. Reexporta constantes, helpers, colaboración, comentarios, templates dinámicos, expresiones, plugin registry y tipos.

### Encabezado recomendado

```ts
/**
 * index.ts
 *
 * Entrada pública de `@sisad-pdfme/common`.
 *
 * Este archivo define qué APIs quedan disponibles para el resto del
 * monorepo y para consumidores externos. Evitar exportar helpers internos
 * accidentales porque este archivo se convierte en contrato público.
 */
```

### Riesgos detectados

1. Todo lo exportado aquí se vuelve API pública de facto.
2. Si se elimina o renombra un export, puede romper `designer`, `form`, `viewer`, `generator` o integraciones externas.
3. Conviene separar mentalmente exports estables de compatibilidad legacy.

---

## 8. `pluginRegistry.ts`

### Responsabilidad

Wrapper de colección de plugins con métodos de búsqueda por tipo y resolución de familia/inspector para DetailView.

### API pública

```ts
pluginRegistry(plugins)
```

Retorna:

```ts
{
  plugins,
  entries,
  values,
  exists,
  findWithLabelByType,
  findByType,
  getFamilyByType,
  getSupportedActionsByType,
  getStrategiesByType,
  getVisibleSectionsByType,
}
```

### Encabezado recomendado

```ts
/**
 * pluginRegistry.ts
 *
 * Adaptador de plugins para resolver schemas por tipo y exponer metadata
 * de inspector/familia al diseñador.
 *
 * Une la configuración declarada por cada plugin con presets canónicos
 * de `schemaFamilies`, permitiendo que DetailView muestre secciones,
 * acciones y estrategias según el tipo de schema.
 */
```

### Riesgos detectados

1. `findWithLabelByType` depende de `plugin.propPanel.defaultSchema.type`. Si un plugin no define bien `defaultSchema`, no será localizable.
2. `getFamilyByType` mezcla preset base con overrides del plugin. Es correcto, pero conviene testear precedencia.
3. El archivo importa desde `../schemas/schemaFamilies.js`; eso introduce acoplamiento de `common` hacia `schemas`. Si `common` debe ser totalmente independiente, este punto debe revisarse.

---

## 9. `schema.ts`

### Responsabilidad

Contratos runtime de validación con Zod. Define enums, schemas de comentarios, anchors, schemas PDF, template, inputs, fuentes, plugins, opciones y props públicas.

### API pública

```ts
Lang
CommentScope
Dict
Mode
ColorType
Size
SchemaCommentReply
SchemaComment
CommentAnchor
Schema
SchemaForUI
BlankPdf
CustomPdf
BasePdf
LegacySchemaPageArray
SchemaPageArray
Template
Inputs
Font
Plugin
CommonOptions
GeneratorOptions
GenerateProps
UIOptions
UIProps
PreviewProps
DesignerProps
```

### Encabezado recomendado

```ts
/**
 * schema.ts
 *
 * Contratos Zod de `@sisad-pdfme/common`.
 *
 * Este archivo valida la forma runtime de templates, schemas, comentarios,
 * anchors, opciones UI, props públicas, plugins y fuentes.
 *
 * Todo cambio aquí puede afectar import/export, snapshot, generator,
 * designer, form, viewer e integraciones externas.
 */
```

### Riesgos detectados

1. `Schema` permite `.passthrough()` en varias zonas; esto da flexibilidad para plugins y snapshot, pero permite metadata no validada.
2. `ownerRecipientIds` en Zod aparece como `z.array(z.string())`, mientras otros módulos aceptan también string separado por comas. Si llega string al contrato estricto, puede fallar.
3. `commentsAnchors` y `commentAnchors` coexisten; parece compatibilidad legacy, pero debe documentarse como alias.
4. `Plugin` se valida de forma flexible, pero la calidad real del plugin depende de que `pdf`, `ui` y `propPanel.defaultSchema` estén correctamente implementados.

---

## 10. `types.ts`

### Responsabilidad

Tipos TypeScript derivados de Zod y contratos extendidos para plugins, renderer PDF, renderer UI, property panel, inspector y registry de plugins.

### API pública

Incluye:

```ts
PDFRenderProps
UIRenderProps
PropPanelWidgetProps
PropPanelInspectorSectionKey
PropPanelInspectorConfig
PropPanel
Plugin
Plugins
PluginRegistry
Lang
Dict
Mode
Schema
SchemaForUI
SchemaComment
CommentAnchor
Font
Template
GenerateProps
UIProps
PreviewProps
DesignerProps
SchemaPageArray
LegacySchemaPageArray
```

### Encabezado recomendado

```ts
/**
 * types.ts
 *
 * Tipos públicos de `@sisad-pdfme/common` derivados de los contratos Zod
 * y extendidos con contratos de plugins, renderer PDF, renderer UI,
 * propPanel e inspector.
 *
 * Este archivo es el contrato TypeScript principal entre common, schemas,
 * ui, generator, viewer, form e integraciones externas.
 */
```

### Riesgos detectados

1. `Plugins = { [key: string]: Plugin<any> }` mantiene flexibilidad, pero reduce type-safety por plugin.
2. `UIRenderProps.onChange` acepta un objeto o un array de cambios; esto es potente, pero debe mantenerse consistente con command/snapshot.
3. `PropPanelInspectorSectionKey` usa nombres como `general`, `layout`, `style`, etc.; si el DetailView usa otra taxonomía como `identity`, `box`, `appearance`, hay que mapear explícitamente.
4. `PluginRegistry.getFamilyByType` declara retorno `PluginFamilyDefinition | null`, pero la implementación actual puede devolver un objeto mezclado incluso si no hay plugin. Revisar coherencia.

---

## 11. `version.ts`

### Responsabilidad

Define la versión pública del paquete.

### API pública

```ts
PDFME_VERSION = '5.5.8'
```

### Encabezado recomendado

```ts
/**
 * version.ts
 *
 * Versión pública del paquete `@sisad-pdfme/common`.
 *
 * Debe actualizarse junto con cambios de contrato, snapshots,
 * migraciones o releases internos del fork SISAD PDFME.
 */
```

### Riesgos detectados

1. Si la versión no se actualiza al cambiar snapshot o contratos, será difícil migrar templates.
2. La versión debería estar sincronizada con package/release si existe pipeline de publicación.

---

# Recomendaciones transversales

## 1. Mantener separación estricta

Estos módulos son `common`. No deben importar:

```txt
React
Ant Design components
CSS
RightSidebar
Canvas
Moveable
Selecto
Designer state
DOM APIs salvo helpers explícitamente browser-aware
```

## 2. Fuente de verdad del schema

Mantener siempre estos campos como identidad crítica:

```txt
schemaUid
type
fileId / fileTemplateId
pageNumber
name
ownerRecipientId / ownerRecipientIds
ownerMode
createdBy / lastModifiedBy
userColor / ownerColor
comments / commentAnchors
```

## 3. Comentarios y anchors

Conviene conservar compatibilidad con:

```txt
template.pdfComments
template.__commentAnchors
schema.comments
schema.commentAnchors
schema.commentsAnchors
```

Pero documentar cuál es canónico:

```txt
Top-level canónico: template.pdfComments
Schema-level canónico: schema.comments + schema.commentAnchors
```

## 4. Validación estricta opcional

Actualmente existen validaciones ligeras. Para QA o migraciones, conviene agregar una validación fuerte separada:

```ts
validateTemplateIntegrity(template)
validateCollaborativeSchemaIntegrity(schemas)
validateCommentIntegrity(template)
```

No reemplazar las validaciones actuales si ya se usan en runtime.

## 5. Tests recomendados

### `collaboration.ts`

```txt
[ ] normalizeRecipientIds con array, string, duplicados y null.
[ ] buildSchemaAssignments con owner single/multi/shared.
[ ] buildUserRecipientAssignments sin owner y con shared.
[ ] createSchemaComment preserva overrides cuando identity está vacío.
```

### `comments.ts`

```txt
[ ] addCommentToSchema crea comment + anchor.
[ ] addCommentWithAnchorToTemplate guarda en schema cuando existe schemaUid.
[ ] addCommentWithAnchorToTemplate guarda top-level cuando no existe schemaUid.
[ ] filterCommentsByFileAndPage deduplica comentarios.
[ ] deleteCommentFromSchema actualiza commentsCount correctamente.
```

### `dynamicTemplate.ts`

```txt
[ ] Retorna template original si basePdf no es BlankPdf.
[ ] Divide filas cuando no caben en la página.
[ ] No deja header solo en página anterior.
[ ] No pierde metadata del template original.
```

### `expression.ts`

```txt
[ ] Reemplaza placeholders simples.
[ ] Evalúa Math, Date y JSON permitidos.
[ ] Bloquea constructor, __proto__, prototype.
[ ] Conserva placeholder original si falla.
[ ] No permite sintaxis no soportada.
```

### `schema.ts` / `types.ts`

```txt
[ ] Template valida basePdf + schemas.
[ ] Schema acepta metadata colaborativa.
[ ] CommentAnchor y SchemaComment validan pageNumber positivo.
[ ] Plugin exige pdf/ui/propPanel/defaultSchema.
```

---

# Cambios prioritarios sugeridos

1. En `dynamicTemplate.ts`, devolver `{ ...template, basePdf, schemas: resultPages }` para no perder metadata.
2. En `collaboration.ts`, preservar autor desde `overrides` o `anchor` cuando `identity` no lo trae.
3. En `collaboration.ts`, usar un único `now` para `timestamp` y `createdAt`.
4. En `comments.ts`, revisar si `commentsCount` debe aumentar solo al insertar y no al actualizar.
5. En `schema.ts`, decidir si `ownerRecipientIds` debe aceptar también string para compatibilidad con `normalizeRecipientIds`.
6. En `pluginRegistry.ts`, revisar si `common` puede depender de `schemas/schemaFamilies` o si ese preset debe moverse a `common`.
7. En `expression.ts`, agregar límites o limpieza de cache para evitar crecimiento indefinido.

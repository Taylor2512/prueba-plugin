# Auditoría de refactorización dinámica de `src/sisad-pdfme/schemas`

**Versión:** 1.0  
**Fecha:** 2026-08-04  
**Ruta real:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/src/sisad-pdfme/schemas`  
**Archivos inventariados:** 90  
**Líneas inventariadas:** 15,226  
**Contenido completo en el pack:** 88  
**Archivos omitidos por el generador:** 2

> La carpeta correcta del proyecto es `schemas` en plural. El inventario contiene
> 90 archivos. Los archivos `signature/dateSigned.ts` y
> `signature/signingSchemaFactory.ts` aparecen como “omitido generado”; su
> recomendación se basa en su rol, imports, documentación y uso, pero deben abrirse
> directamente en el repositorio antes de modificarlos.

## Veredicto

La arquitectura no parte de cero. Ya existen patrones útiles:

- Factory: `actionSchemaFactory`, `optionGroupFactory`,
  `signingSchemaFactory`, `textLikeSchemaFactory`.
- Template Method: `renderSchemaWithChrome`.
- Strategy: `optionSelectionBehavior`, validation y renderers.
- Adapter: `optionValueAdapter`, `schemaValueAdapter`.
- Decorator/Policy: `fieldChrome`.
- Registry: plugins, providers y familias.

El problema principal es que esos patrones están **fragmentados**. La fuente de
verdad de un schema se reparte entre `index.ts`, `schemaFamilies.ts`,
`schemaBuilder.ts`, su plugin, su propPanel, sus renderers, sus value adapters y
sus reglas visuales. Agregar un tipo nuevo todavía obliga a editar varias listas
y puede producir drift entre Designer, Form, Viewer, PDF, inspector y snapshot.

## Objetivo observable

Agregar un schema nuevo debería requerir:

1. un `SchemaManifest` o preset;
2. sus estrategias realmente particulares;
3. pruebas de contrato.

No debería requerir editar manualmente varias listas de tipos, familias,
inspectores, colores, value readers y registries.

## Arquitectura objetivo

```text
SchemaManifest<TSchema, TValue>
├── identity
│   ├── type
│   ├── aliases
│   ├── family
│   ├── category
│   └── tags
├── capabilities
├── defaults: SchemaDefaultFactory
├── value: SchemaValueCodec
├── validation: SchemaValidationStrategy
├── renderers
│   ├── designer
│   ├── form
│   ├── viewer
│   └── pdf
├── inspector: InspectorDefinition
├── appearance: SchemaAppearancePolicy
├── interaction: SchemaInteractionPolicy
├── migration[]
└── lifecycle?
        └── dispose()
```

```text
SchemaManifest
      │
      ▼
createPdfmePlugin(manifest)       ← Adapter
      │
      ▼
SchemaRegistry                    ← única fuente de registro
      │
      ├── Designer
      ├── Form
      ├── Viewer
      ├── PDF
      ├── Inspector
      ├── Snapshot
      └── Controller
```

### Contrato propuesto

```ts
export type SchemaMode = 'designer' | 'form' | 'viewer' | 'pdf';

export interface SchemaValueCodec<TSchema, TValue> {
  read(schema: TSchema, runtimeValue?: unknown): TValue;
  write(schema: TSchema, value: TValue): Partial<TSchema>;
  normalize(value: unknown, schema: TSchema): TValue;
  equals(left: TValue, right: TValue): boolean;
  migrateLegacy?(schema: unknown): Partial<TSchema>;
}

export interface SchemaValidationStrategy<TSchema, TValue> {
  validate(args: {
    schema: TSchema;
    value: TValue;
    mode: SchemaMode;
    context: SchemaRuntimeContext;
  }): SchemaValidationResult;
}

export interface SchemaManifest<TSchema, TValue> {
  type: string;
  aliases?: readonly string[];
  family: string;
  category: string;
  tags: readonly string[];
  capabilities: readonly string[];
  defaults: SchemaDefaultFactory<TSchema>;
  value: SchemaValueCodec<TSchema, TValue>;
  validation?: SchemaValidationStrategy<TSchema, TValue>;
  renderers: Partial<Record<SchemaMode, SchemaRenderer<TSchema, TValue>>>;
  inspector: InspectorDefinition<TSchema>;
  appearance?: SchemaAppearancePolicy<TSchema>;
  interaction?: SchemaInteractionPolicy<TSchema, TValue>;
  migrations?: readonly SchemaMigration[];
}
```

## Decisiones de diseño

### 1. Un solo registry

No crear un segundo registry paralelo. Evolucionar `schemas/index.ts` y
`schemaBuilder.ts`:

- built-ins inmutables;
- registry scoped por instancia;
- aliases dentro del manifest;
- cache invalidable;
- API legacy como fachada.

### 2. Compatibilidad incremental

Aplicar Strangler Pattern:

```text
plugin legacy
→ adapter legacyToManifest
→ registry nuevo
```

y:

```text
manifest nuevo
→ createPdfmePlugin
→ Plugin<Schema> compatible
```

No migrar los 90 archivos en un solo commit.

### 3. Cero estado global mutable en renderers

Eliminar o encapsular:

- caches por schema id a nivel de módulo;
- mapas de doble clic compartidos;
- registries de providers compartidos entre instancias;
- listeners sin `dispose`.

### 4. Separar cuatro conceptos de color

```text
owner color      → quién es responsable
semantic color   → aprobar/rechazar/estado
content color    → imagen/SVG/barcode/shape/table
selection color  → estado de selección del Designer
```

`fieldChrome` no debe inferir tipos mediante listas propias. Debe recibir la
policy resuelta por el manifest.

### 5. Un codec de valor por tipo

Dejar de inferir valores globalmente desde `content`, `checked`,
`selectedOptionId` o listas separadas. Cada manifest define su codec y
migración legacy.

### 6. Inspector declarativo

`commonInspectorFields` debe convertirse en:

```text
FieldDefinition catalog
+ capability composers
+ typed conditions
+ family profile
+ schema overrides
```

No usar expresiones string dispersas como única lógica.

### 7. Render model compartido

Para familias complejas:

```text
schema + value + context
→ normalize/validate/layout
→ RenderModel
→ UI Renderer | PDF Renderer
```

Esto evita que UI y PDF recalculen distinto.

## Hallazgos críticos

1. `schemaBuilder.ts` usa caches globales y `JSON.stringify` para deduplicar
   emisiones; puede colisionar entre dos instancias con el mismo schema id.
2. `options/optionGroupRenderer.ts` usa `Map` global para doble clic y commits.
3. `schemas/index.ts` reconstruye mapas de plugins y aliases en múltiples
   consultas y mantiene plugins externos en estado global.
4. `schemaFamilies.ts` mantiene tres taxonomías y listas manuales.
5. `fieldChrome.ts` concentra color, tipos, policy, DOM y estilos en 617 líneas.
6. `commonInspectorFields.ts` contiene factories privadas sin consumo y
   condiciones string difíciles de tipar.
7. `schemaGuards.ts` repite tipos con casing distinto a los tipos registrados.
8. `schemaDom.ts` usa `innerHTML` para iconos y labels.
9. `attachment.ts` persiste nombres, pero el archivo real requiere un adapter
   del host y un valor serializable.
10. Signature, table, text y date contienen módulos de más de 500–700 líneas.
11. `optionGroupEditorFactory.ts` importa una ruta profunda del RightSidebar,
    invirtiendo la dependencia schemas → UI concreta.
12. Dos archivos críticos de firma fueron omitidos por el context pack y deben
    auditarse directamente.

## Orden de implementación

### Fase 0 — Baseline

- congelar snapshots y templates reales;
- inventariar plugins, aliases, tipos y defaults;
- generar matriz Designer/Form/Viewer/PDF/Snapshot;
- ejecutar build, lint, Vitest, Playwright y jscpd.

### Fase 1 — Contratos sin cambiar comportamiento

- ampliar `SchemaDefinition` hacia `SchemaManifest`;
- crear adapter manifest ↔ Plugin;
- crear registry scoped;
- mantener exports legacy;
- introducir `SchemaRuntimeContext` y lifecycle/dispose.

### Fase 2 — Núcleo transversal

- value codecs;
- validation strategies;
- inspector composer;
- appearance policy;
- renderer template;
- canonical type normalization.

### Fase 3 — Text-like, number y date

Primero por menor impacto estructural y alto reuso.

### Fase 4 — Choice/boolean

Unificar checkbox, select, radioGroup y checkboxGroup sobre OptionModel.

### Fase 5 — Signature

Migrar por mode/provider; preservar eventos, metadata y snapshot.

### Fase 6 — Actions y visuales

Attachment/note/approve/decline, image/SVG, shapes y barcode.

### Fase 7 — Tables

Separar modelo, layout y renderers. Es la familia algorítmica de mayor riesgo.

### Fase 8 — Extensibilidad pública

- custom manifests;
- registration API;
- optional lazy loaders;
- docs y consumer test externo.

## Métricas de aceptación

- nuevo schema built-in: máximo 2 archivos productivos;
- cero listas manuales de tipos fuera del manifest/registry;
- cero estado mutable global en renderers;
- cero imports desde schemas hacia componentes concretos del RightSidebar;
- cero `innerHTML` con contenido dinámico;
- paridad de los cuatro modos y snapshot por schema;
- archivos coordinadores preferentemente <300 líneas;
- algoritmos mayores permitidos solo con responsabilidad única y tests;
- cero duplicidad funcional reportada por jscpd en código propio;
- no regresión visual del owner tone;
- no pérdida de `schemaUid`, document routing, recipient, locks o valores.

## Gates

```bash
npm run lint
npm run build
npm run quality
npm run quality:direct-config-readers
npm run quality:source-language-boundary
npm run quality:duplicates:owned
npm test -- --run
npm run test:e2e
```

Añadir suites contractuales:

```text
schema-manifest.contract.test.ts
schema-value-codec.contract.test.ts
schema-renderer-parity.contract.test.ts
schema-inspector.contract.test.ts
schema-snapshot-roundtrip.contract.test.ts
schema-registry-scope.contract.test.ts
```

# Auditoría archivo por archivo

| # | Archivo | LOC | Estado | Patrón objetivo | Problema principal | Acción propuesta | Prioridad | Riesgo |
|---:|---|---:|---|---|---|---|:---:|---|
| 1 | `src/sisad-pdfme/schemas/constants.ts` | 2 | completo | Value Object / Constants | Puede convertirse en un contenedor de constantes heterogéneas y duplicar tokens o políticas. | Conservar únicamente constantes verdaderamente transversales y sin comportamiento. Mover colores a appearance/tokens y reglas a policies; mantener aquí solo valores estables. | P2 | Bajo |
| 2 | `src/sisad-pdfme/schemas/groupSchemaRender.ts` | 252 | completo | Primitive Renderer | Mezcla estilos, variantes y primitivas; además conserva builders de indicadores que compiten con optionIndicator. | Ser una librería de primitivas DOM sin estado ni decisión de negocio. Eliminar indicadores duplicados; recibir un render model y delegar el indicador a optionIndicator. | P0 | Alto |
| 3 | `src/sisad-pdfme/schemas/index.ts` | 415 | completo | Registry + Facade | Es un composition root de 415 líneas; reconstruye mapas, mantiene estado global y concentra demasiadas responsabilidades. | Convertirse en fachada compatible sobre un único SchemaRegistry. BuiltInRegistry inmutable + registry por instancia; cache invalidable; extraer naming, defaults y patching a servicios. | P0 | Muy alto |
| 4 | `src/sisad-pdfme/schemas/modules.d.ts` | 32 | completo | Boundary Declaration | Puede ocultar tipos incompletos y propagar unknown/any. | Mantener declaraciones mínimas y alineadas con versiones instaladas. Separar una declaración por dependencia y añadir contract tests de tipos. | P3 | Bajo |
| 5 | `src/sisad-pdfme/schemas/schemaBuilder.ts` | 170 | completo | Abstract Factory + Adapter | El cache global por schema id cruza instancias y JSON.stringify se ejecuta en una ruta caliente. | Ser el adapter entre SchemaManifest y Plugin de pdfme. Mover dedupe a una EmissionPolicy por runtime; ampliar SchemaDefinition a manifest tipado y mantener overload legacy. | P0 | Muy alto |
| 6 | `src/sisad-pdfme/schemas/schemaFamilies.ts` | 363 | completo | Capability Registry / Policy | Tres taxonomías y varios Set/Record manuales pueden divergir; tipos desconocidos caen silenciosamente en text. | Derivar familia, inspector, acciones y capabilities desde el manifest registrado. Eliminar listas dispersas; usar fallback unknown/custom explícito y validación de registry. | P0 | Muy alto |
| 7 | `src/sisad-pdfme/schemas/utils.ts` | 294 | completo | Utility Decomposition | Es un grab bag de alta centralidad y alto acoplamiento. | Separar utilidades por responsabilidad estable. pdfGeometry, colorCodec, fileReader, svgIcon, errorView y tableSizing; conservar reexports temporales. | P1 | Alto |
| 8 | `src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts` | 166 | completo | Factory + Decorator | Combina construcción DOM, color, contenido y PDF. | Exponer render models y builders pequeños por action kind. ActionAppearancePolicy + ActionDomRenderer + ActionPdfRenderer; semantic color separado de owner chrome. | P1 | Alto |
| 9 | `src/sisad-pdfme/schemas/actions/approve.ts` | 19 | completo | Preset / Manifest | Aún conoce detalles de iconSvg y color que deberían provenir del descriptor/factory. | Ser un manifest declarativo mínimo. Declarar semanticTone=success, command, label, icon y tags; la factory resuelve UI/PDF/eventos. | P1 | Medio |
| 10 | `src/sisad-pdfme/schemas/actions/attachment.ts` | 206 | completo | Strategy + Adapter | Mezcla UI, validación, serialización de nombres y emisión; el File no puede persistirse en schema. | Separar FilePolicy, AttachmentValueCodec y HostUploadAdapter. El plugin emite AttachmentSelectedEvent con metadata; el host sube y devuelve un valor serializable. | P0 | Muy alto |
| 11 | `src/sisad-pdfme/schemas/actions/createDecisionActionPlugin.ts` | 267 | completo | Abstract Factory + Command | Mezcla render, estado, command y event transport; usa DOM directo e iconSvg manual. | Crear un DecisionActionDefinition consumido por una factory. Inyectar command dispatcher/event bridge existente; usar icon renderer seguro; resolver owner/semantic tone por policy. | P0 | Muy alto |
| 12 | `src/sisad-pdfme/schemas/actions/decline.ts` | 18 | completo | Preset / Manifest | Duplica la forma estructural de approve. | Ser un manifest declarativo mínimo. Declarar semanticTone=danger, command, label, icon y tags; compartir toda la implementación. | P1 | Medio |
| 13 | `src/sisad-pdfme/schemas/actions/note.ts` | 114 | completo | Preset + Strategy | Su propPanel y PDF conocen detalles visuales y colores propios. | Ser un preset action/content declarativo. Usar ActionFactory con kind=note, semanticTone=warning y inspector profile específico. | P1 | Alto |
| 14 | `src/sisad-pdfme/schemas/barcodes/constants.ts` | 23 | completo | Descriptor Constants | Los tipos pueden repetirse en familias, inspector y factories. | Ser la fuente de BarcodeDescriptor por tipo. Cada descriptor define encoder id, capabilities, defaults y restricciones. | P1 | Medio |
| 15 | `src/sisad-pdfme/schemas/barcodes/helper.ts` | 186 | completo | Strategy | Condicionales por tipo y normalización quedan acoplados a una sola función. | BarcodeEncoderStrategy por descriptor. Resolver encoder/validation desde descriptor; cachear resultados por input+config cuando sea seguro. | P1 | Alto |
| 16 | `src/sisad-pdfme/schemas/barcodes/index.ts` | 23 | completo | Composite Registry Entry | Es una capa de registro manual adicional. | Construir plugins desde BarcodeDescriptor[]. Registrar todos los barcodes con map(createBarcodePlugin). | P1 | Medio |
| 17 | `src/sisad-pdfme/schemas/barcodes/pdfRender.ts` | 37 | completo | Renderer Strategy | Puede repetir resolución/validación de UI. | Consumir un BarcodeRenderModel común. prepareBarcodeRenderModel una vez; PDF solo dibuja. | P1 | Alto |
| 18 | `src/sisad-pdfme/schemas/barcodes/propPanel.ts` | 238 | completo | Inspector Composer | El branching por tipo puede divergir de constants/helper. | Generar el panel desde el descriptor. Inspector sections y restricciones salen de BarcodeDescriptor. | P1 | Alto |
| 19 | `src/sisad-pdfme/schemas/barcodes/types.ts` | 12 | completo | Discriminated Union | No expresa capacidades y opciones particulares por variante. | Crear unión discriminada por barcode type. Tipos derivados del catálogo const y configuración común/particular. | P2 | Medio |
| 20 | `src/sisad-pdfme/schemas/barcodes/uiRender.ts` | 111 | completo | Renderer Strategy + Decorator | Puede mezclar contenido semántico y chrome de ownership. | Consumir BarcodeRenderModel y renderSchemaWithChrome. El contenido barcode se preserva; owner tone solo vive en chrome. | P0 | Alto |
| 21 | `src/sisad-pdfme/schemas/checkbox/index.ts` | 204 | completo | Boolean Schema Factory | Es un plugin monolítico y comparte conceptos con optionIndicator/value adapters. | Ser una configuración de createBooleanSchemaPlugin. Reusar indicator renderer, value codec, validation y inspector composer. | P0 | Alto |
| 22 | `src/sisad-pdfme/schemas/checkboxGroup/index.ts` | 342 | completo | Composite + Strategy | Aún contiene normalización, límites, editor y plugin; exporta __test__ desde producción. | Ser una definición fina sobre OptionGroupFactory. Mover límites y codec a strategies; tests importan módulos puros, no __test__. | P0 | Muy alto |
| 23 | `src/sisad-pdfme/schemas/date/date.ts` | 16 | completo | Preset / Manifest | El archivo es fino, pero depende de un helper/factory demasiado grande. | Conservarlo como descriptor declarativo. Declarar mode=date, formatter, parser, defaults e inspector profile. | P1 | Medio |
| 24 | `src/sisad-pdfme/schemas/date/dateTime.ts` | 16 | completo | Preset / Manifest | El archivo es fino, pero depende de un helper/factory demasiado grande. | Conservarlo como descriptor declarativo. Declarar mode=dateTime, formatter, parser, defaults e inspector profile. | P1 | Medio |
| 25 | `src/sisad-pdfme/schemas/date/helper.ts` | 508 | completo | Abstract Factory + Strategy | 508 líneas concentran factory, DOM, formato y validación. | Separar DateSchemaFactory, DateValueCodec, DateFormatterStrategy y renderers. Compartir un DateRenderModel; preset decide solo mode y defaults. | P0 | Muy alto |
| 26 | `src/sisad-pdfme/schemas/date/time.ts` | 16 | completo | Preset / Manifest | El archivo es fino, pero depende de un helper/factory demasiado grande. | Conservarlo como descriptor declarativo. Declarar mode=time, formatter, parser, defaults e inspector profile. | P1 | Medio |
| 27 | `src/sisad-pdfme/schemas/date/types.ts` | 21 | completo | Discriminated Union | No separa claramente date/time/dateTime ni formato/valor. | Unión discriminada por mode. DateSchema | TimeSchema | DateTimeSchema con value codec tipado. | P1 | Medio |
| 28 | `src/sisad-pdfme/schemas/graphics/image.ts` | 233 | completo | Strategy + Lifecycle | Mezcla fuente, upload, Object URL, UI, PDF y defaults. | Crear ImageSourceStrategy y ImageLifecycle. Separar fixed/url/data/file; revocar Object URLs; inspector por capability upload. | P0 | Muy alto |
| 29 | `src/sisad-pdfme/schemas/graphics/imagehelper.ts` | 156 | completo | Pure Utility | Debe permanecer libre de DOM y estado global. | Conservar como servicio puro con cache opcional. Normalizar errores, límites y formatos; tests con fixtures. | P2 | Medio |
| 30 | `src/sisad-pdfme/schemas/graphics/svg.ts` | 123 | completo | Sanitizer Strategy + Renderer | La validación básica puede ser insuficiente para contenido no confiable. | Separar SvgSanitizer, SvgValueCodec y renderers. Inyectar sanitizer; prohibir scripts/foreignObject/URLs según policy. | P0 | Muy alto |
| 31 | `src/sisad-pdfme/schemas/multiVariableText/helper.ts` | 94 | completo | Interpreter / Pure Functions | Puede divergir del motor de expresiones general. | Ser un adapter fino sobre una única ExpressionEngine. Mantener parser puro y contrato de errores; evitar regex duplicadas. | P1 | Alto |
| 32 | `src/sisad-pdfme/schemas/multiVariableText/index.ts` | 23 | completo | Manifest | Registro manual. | Ser un manifest fino. Declarar renderer strategies, codec, inspector y dynamic capability. | P1 | Medio |
| 33 | `src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts` | 21 | completo | Renderer Strategy | Puede repetir evaluación y validación de UI. | Consumir VariableTextEvaluationResult. Evaluar una vez con ExpressionEngine; renderer solo pinta. | P1 | Alto |
| 34 | `src/sisad-pdfme/schemas/multiVariableText/propPanel.ts` | 167 | completo | Inspector Composer | Contiene detalles de layout/DOM específicos. | Componer campos comunes y fields declarativos de variables. Usar InspectorFieldFactory y custom widget aislado. | P1 | Alto |
| 35 | `src/sisad-pdfme/schemas/multiVariableText/types.ts` | 6 | completo | Domain Type | Tipo demasiado pequeño para expresar bindings y errores. | Tipar variables, bindings, fallback y validation. Separar template text de resolved value. | P2 | Medio |
| 36 | `src/sisad-pdfme/schemas/multiVariableText/uiRender.ts` | 168 | completo | Renderer + Interpreter Adapter | Une DOM contentEditable, optimización y evaluación. | Separar editor renderer de evaluation service. Controlar lifecycle/listeners y reutilizar TextRenderModel. | P0 | Alto |
| 37 | `src/sisad-pdfme/schemas/number/index.ts` | 86 | completo | Text-like Preset + Value Strategy | Puede duplicar formato/validation y tratar números como strings. | Ser preset de TextLikeFactory con NumberValueCodec. Formato, parse, validation y PDF mediante NumberFormatStrategy. | P0 | Alto |
| 38 | `src/sisad-pdfme/schemas/options/optionGroupEditorFactory.ts` | 205 | completo | Editor Factory + Reducer | Importa guards desde una ruta profunda del RightSidebar y mezcla estado mutable con DOM. | Ser un editor desacoplado con OptionEditorController. Inyectar interactionGuard; usar reducer/commands puros y lifecycle de listeners. | P0 | Muy alto |
| 39 | `src/sisad-pdfme/schemas/options/optionGroupFactory.ts` | 563 | completo | Abstract Factory | 563 líneas; sigue teniendo demasiados subdominios y mutación de estilos. | Dividir la factory en módulos puros coordinados por una fachada. OptionDefaultsFactory, GeometryPolicy, RuntimeAdapter, InspectorComposer y PluginFactory. | P0 | Muy alto |
| 40 | `src/sisad-pdfme/schemas/options/optionGroupLayout.ts` | 76 | completo | Geometry Policy | Buen módulo puro; riesgo de constantes duplicadas con canvas. | Conservar como policy pura e inyectable. Añadir constraints y tests de roundtrip/tolerancia. | P1 | Medio |
| 41 | `src/sisad-pdfme/schemas/options/optionGroupPdfRender.ts` | 74 | completo | Renderer Strategy | Puede divergir de indicator/UI y owner color. | Consumir OptionGroupRenderModel. Compartir layout, selection y color policy; PDF solo traduce a primitivas. | P0 | Alto |
| 42 | `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts` | 305 | completo | State Machine + Renderer | Map global por grupo/opción cruza instancias y conserva memoria; la interacción vive dentro del renderer. | Usar InteractionController por runtime. Estado de click inyectado; reducer por mode; renderer sin estado global. | P0 | Muy alto |
| 43 | `src/sisad-pdfme/schemas/options/optionIndicator.ts` | 263 | completo | Renderer Strategy | Duplica parsing/color policy de fieldChrome. | Ser un renderer puro que recibe un VisualTone resuelto. Eliminar resolución propia de owner/semantic color; devolver DOM/SVG desde un model. | P0 | Alto |
| 44 | `src/sisad-pdfme/schemas/options/OptionListWidget.tsx` | 12 | completo | React Adapter | Puede ser innecesario si solo reexporta otro componente. | Conservar como adapter mínimo o eliminar wrapper redundante. Una sola implementación pública del widget. | P2 | Bajo |
| 45 | `src/sisad-pdfme/schemas/options/optionModel.ts` | 78 | completo | Domain Model | Debe convertirse en SSOT; hoy algunos tipos aún usan strings. | Conservar y ampliar como modelo canónico. OptionItem siempre {optionId,label,value,order,disabled}; migrations para legacy. | P0 | Alto |
| 46 | `src/sisad-pdfme/schemas/options/optionPropPanel.tsx` | 31 | completo | React Adapter | Puede ocultar contratos poco tipados. | Tipar props y delegar al editor único. Sin lógica de dominio ni estado duplicado. | P2 | Bajo |
| 47 | `src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts` | 125 | completo | Strategy | Buen núcleo puro; algunos fallbacks seleccionan option_1 implícitamente. | Conservar como estrategias explícitas y sin fallback silencioso. SelectionPolicy define empty/default/required por schema. | P0 | Alto |
| 48 | `src/sisad-pdfme/schemas/options/optionTypes.ts` | 19 | completo | Domain Type | El tipo debe ser la única representación interna. | Ampliar y volver canónico. Readonly, generic TValue y migration desde string. | P1 | Medio |
| 49 | `src/sisad-pdfme/schemas/options/optionValueAdapter.ts` | 46 | completo | Adapter / Codec | Tiene alcance limitado y puede duplicar schemaValueAdapter. | Integrarlo en SchemaValueCodec<OptionValue>. Un codec por manifest con read/write/migrate/equality. | P0 | Alto |
| 50 | `src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts` | 470 | completo | Builder + Flyweight | 470 líneas, condiciones string, labels mezclados y varias factories privadas sin uso. | Crear un catálogo tipado de FieldDefinition y compositores por capability. Eliminar dead code; Condition DSL tipada; i18n; objetos readonly/cacheados. | P0 | Muy alto |
| 51 | `src/sisad-pdfme/schemas/radioGroup/index.ts` | 279 | completo | Composite + Strategy | Duplica estructura conceptual de checkboxGroup. | Ser una definición fina sobre OptionGroupFactory. Configurar selectionMode=single, indicator=circle y strategy; cero lógica de editor local. | P0 | Muy alto |
| 52 | `src/sisad-pdfme/schemas/select/index.ts` | 338 | completo | Single Choice Factory | Mantiene un editor paralelo a optionGroupEditorFactory y representa opciones como string. | Usar OptionModel y createSingleChoiceSchemaPlugin. Unificar OptionItem, codec, editor, aliases select/dropdown y render model. | P0 | Muy alto |
| 53 | `src/sisad-pdfme/schemas/shapes/line.ts` | 102 | completo | Preset + Renderer Strategy | Duplica estructura con rect/ellipse y color. | Ser un descriptor sobre ShapeFactory. kind=line, geometry, stroke policy e inspector declarativos. | P1 | Alto |
| 54 | `src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts` | 153 | completo | Abstract Factory | Comparte lógica, pero aún mezcla render/defaults/inspector. | Convertir a createShapeSchemaPlugin(config). ShapeRendererStrategy por kind y shared appearance policy. | P1 | Alto |
| 55 | `src/sisad-pdfme/schemas/shared/fieldChrome.ts` | 617 | completo | Decorator + Policy | 617 líneas; mezcla color math, taxonomía por tipos, policy, DOM y estilos inline; duplica familias. | Separar SchemaAppearancePolicy, ColorCodec y FieldChromeDecorator. La familia/semantic accent sale del manifest; decorator aplica un VisualTone ya resuelto. | P0 | Muy alto |
| 56 | `src/sisad-pdfme/schemas/shared/imageFileInput.ts` | 40 | completo | Factory + Lifecycle | Debe controlar listeners, validación y cleanup. | Crear FileInputAdapter configurable. Retornar dispose(); inyectar FilePolicy y accept. | P1 | Alto |
| 57 | `src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts` | 80 | completo | Template Method | Es una buena abstracción; solo debe evitar crecer hacia lógica de familia. | Conservar como template method estable. Recibir RenderContext y AppearanceResult; soportar dispose del renderer. | P0 | Medio |
| 58 | `src/sisad-pdfme/schemas/shared/schemaDom.ts` | 133 | completo | DOM Adapter | Usa innerHTML para iconSvg+label y contiene estilos de acción. | Ser un adapter DOM seguro y neutral. Construir icon node sin innerHTML; estilos por classes/vars; sin comportamiento. | P0 | Alto |
| 59 | `src/sisad-pdfme/schemas/shared/schemaGuards.ts` | 165 | completo | Specification | Repite listas de tipos, usa casing inconsistente y tiene import al final del archivo. | Derivar guards de manifests/canonical type normalization. Specifications reutilizables; canonical lowercase aliases; import ordering. | P0 | Alto |
| 60 | `src/sisad-pdfme/schemas/shared/schemaTypes.ts` | 171 | completo | Domain Model | Varios tipos no exportados/no usados y duplican contratos de common/contracts. | Ser el modelo canónico o trasladarse a contracts/schema. Exportar ids/value types utilizados; unión discriminada; eliminar aliases duplicados. | P0 | Muy alto |
| 61 | `src/sisad-pdfme/schemas/signature/dateSigned.ts` | 136 | omitido generado | Derived Preset + Strategy | Contenido omitido en el pack; debe verificarse contra el factory y snapshot. | Ser preset derivado de signing factory. DateSignedValueStrategy calcula desde evento de firma; no depende de content manual. | P0 | Muy alto |
| 62 | `src/sisad-pdfme/schemas/signature/index.ts` | 433 | completo | Signing Manifest + Renderer | 433 líneas y DOM directo; contiene demasiada lógica para un entrypoint. | Ser una definición fina sobre SigningSchemaFactory. Renderers separados por mode; provider/event/validation mediante strategies. | P0 | Muy alto |
| 63 | `src/sisad-pdfme/schemas/signature/initials.ts` | 43 | completo | Preset | Buen preset, pero debe depender solo de la factory pública. | Conservar como manifest mínimo. kind=initials, size, placeholder, capabilities. | P1 | Medio |
| 64 | `src/sisad-pdfme/schemas/signature/propPanel.ts` | 724 | completo | Inspector Composer + State Machine | 724 líneas, 36 accesos document y lógica condicional compleja. | Dividir en secciones declarativas y widgets aislados. SignatureInspectorProfile por mode; ProviderWidget, DrawConfig, UploadConfig, P12Config; typed conditions. | P0 | Muy alto |
| 65 | `src/sisad-pdfme/schemas/signature/providerRegistry.ts` | 207 | completo | Registry + Adapter | Registry global puede mezclar aplicaciones/instancias y resources. | Registry scoped por runtime con built-ins inmutables. ProviderAdapter normaliza host; registry solo descriptors y capability lookup. | P0 | Muy alto |
| 66 | `src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts` | 125 | omitido generado | Abstract Factory | Contenido omitido en el pack; es una pieza crítica y debe revisarse en repo. | Ser la única factory de signature/initials/dateSigned. Config declarativa + manifest + mode strategies; compatibilidad con exports actuales. | P0 | Muy alto |
| 67 | `src/sisad-pdfme/schemas/signature/types.ts` | 344 | completo | Discriminated Union | La normalización y defaults dentro del módulo de tipos mezclan domain y behavior. | Separar tipos puros de normalizers/policies. SignatureSchema discriminada por mode; capabilities derivadas del provider descriptor. | P0 | Alto |
| 68 | `src/sisad-pdfme/schemas/signature/validation.ts` | 72 | completo | Validation Strategy | Debe distinguir validez por modo/provider y no usar empty content como regla universal. | Crear strategy por signature mode. validateDraw, validateImage, validateP12, validateProvider y aggregate result. | P0 | Muy alto |
| 69 | `src/sisad-pdfme/schemas/tables/cell.ts` | 152 | completo | Value Object / Nested Schema | Puede acoplar el inspector de celdas al plugin principal. | Conservar como componente de dominio de tabla. CellDescriptor + style/value codec; no registrarlo como schema canvas independiente. | P2 | Medio |
| 70 | `src/sisad-pdfme/schemas/tables/classes.ts` | 402 | completo | Domain Model | Clases mutables y cálculo/layout pueden quedar acoplados a render. | Separar modelo inmutable de TableLayoutEngine. Factories para construir; layout como servicio puro; preservar API con adapters. | P1 | Alto |
| 71 | `src/sisad-pdfme/schemas/tables/dynamicTemplate.ts` | 88 | completo | Sizing Strategy | Debe compartir layout con UI/PDF para evitar divergencia. | Conservar como estrategia pura coordinada por TableLayoutEngine. Mismo input normalizado y métricas en preflight/UI/PDF. | P0 | Alto |
| 72 | `src/sisad-pdfme/schemas/tables/helper.ts` | 172 | completo | Inspector/Data Builder | Mezcla transformación de datos e inspector. | Separar TableDataAdapter y TableInspectorComposer. Helpers puros por responsabilidad; tipos estrictos. | P1 | Alto |
| 73 | `src/sisad-pdfme/schemas/tables/index.ts` | 22 | completo | Manifest | Registro manual. | Ser manifest fino sobre TableSchemaFactory. Declarar renderers, layout engine, codec, inspector y capabilities. | P1 | Medio |
| 74 | `src/sisad-pdfme/schemas/tables/pdfRender.ts` | 144 | completo | Renderer Strategy | Declara contratos locales porque tableHelper no exporta tipos; riesgo de drift. | Consumir TableRenderModel tipado. Exportar contrato canónico desde types; PDF no recalcula modelo. | P0 | Alto |
| 75 | `src/sisad-pdfme/schemas/tables/propPanel.ts` | 119 | completo | Inspector Composer | Usa ts-expect-error/casts genéricos y mezcla widgets. | Componer secciones tipadas desde TableDescriptor. Eliminar cast mediante PropPanelWidgetProps<TableSchema> o adapter tipado. | P0 | Alto |
| 76 | `src/sisad-pdfme/schemas/tables/tableHelper.ts` | 278 | completo | Layout Engine | Puede mezclar algoritmo, pdf-lib y configuración. | Ser TableLayoutEngine puro con adapters de salida. Entrada normalizada; salida rows/cells/bounds; renderers UI/PDF consumen lo mismo. | P0 | Muy alto |
| 77 | `src/sisad-pdfme/schemas/tables/types.ts` | 87 | completo | Domain Types | Necesita distinguir input, normalized model y render model. | Crear tipos por etapa. TableInput -> NormalizedTable -> TableLayout -> TableRenderModel. | P0 | Alto |
| 78 | `src/sisad-pdfme/schemas/tables/uiRender.ts` | 477 | completo | Renderer Strategy + Interaction Controller | 477 líneas con DOM, estado e interacción; riesgo de rerender costoso. | Separar TableUiRenderer y TableInteractionController. Diff de celdas, dispose listeners, render model compartido y memoización. | P0 | Muy alto |
| 79 | `src/sisad-pdfme/schemas/text/constants.ts` | 104 | completo | Constants / Value Objects | Puede mezclar tokens, defaults y reglas lingüísticas. | Separar TextDefaults de LineBreakRules. Mantener arrays readonly y configuración inyectable por locale. | P2 | Medio |
| 80 | `src/sisad-pdfme/schemas/text/extraFormatter.ts` | 83 | completo | Strategy Registry | Puede crecer mediante condicionales. | FormatterRegistry basado en descriptor. registerFormatter(id, format, parse?, validate?). | P1 | Medio |
| 81 | `src/sisad-pdfme/schemas/text/helper.ts` | 544 | completo | Layout Engine | 544 líneas de algoritmo; responsabilidades de font cache, browser quirks y wrapping. | Dividir TextMetricsService, LineBreaker y DynamicFontSizer. Mantener funciones puras, caches acotadas e inyección de font metrics. | P0 | Muy alto |
| 82 | `src/sisad-pdfme/schemas/text/index.ts` | 23 | completo | Manifest | Debe evitar ser un export manual más. | Ser manifest fino sobre TextSchemaFactory. Declarar renderer strategies, codec, validation, inspector y defaults. | P1 | Medio |
| 83 | `src/sisad-pdfme/schemas/text/pdfRender.ts` | 236 | completo | Renderer Strategy | Puede repetir layout/formatting de UI. | Consumir TextRenderModel. Un TextLayoutEngine produce líneas, font size, alignment y colors. | P0 | Muy alto |
| 84 | `src/sisad-pdfme/schemas/text/propPanel.ts` | 173 | completo | Inspector Composer | Puede repetir fields y mapping; dependencias de i18n/defaults. | Componer desde common field catalog + TextCapabilities. Secciones declarativas y typed conditions. | P0 | Alto |
| 85 | `src/sisad-pdfme/schemas/text/types.ts` | 30 | completo | Domain Types | Debe separar schema persistido, normalized y render model. | Crear tipos por etapa y enums const. TextSchema, NormalizedTextSchema, TextRenderModel. | P1 | Alto |
| 86 | `src/sisad-pdfme/schemas/text/uiRender.ts` | 314 | completo | Renderer + Editor Strategy | 314 líneas; browser workaround, DOM, edición y layout en un módulo. | Separar TextUiRenderer, ContentEditableAdapter y TextLayoutEngine. Lifecycle con dispose; no listeners duplicados; model compartido con PDF. | P0 | Muy alto |
| 87 | `src/sisad-pdfme/schemas/textLike/textLikePresets.ts` | 44 | completo | Preset | Es una buena dirección; debe ser 100% declarativo. | Conservar como lista de manifests/presets. Añadir aliases, source binding, validation profile y default label. | P1 | Medio |
| 88 | `src/sisad-pdfme/schemas/textLike/textLikeSchemaFactory.ts` | 85 | completo | Abstract Factory | Todavía clona defaultSchema y construye inspector local. | Integrarla con SchemaManifest y DefaultFactory. TextLikePresetConfig declara codec/validation/binding; no cloneDeep en hot path. | P0 | Alto |
| 89 | `src/sisad-pdfme/schemas/values/schemaValueAdapter.ts` | 42 | completo | Adapter / Codec | La inferencia por campos content/checked es ambigua y no tiene write/equality/migration. | Reemplazar por SchemaValueCodec registrado en cada manifest. read, write, normalize, validate, equals y migrateLegacy por tipo. | P0 | Muy alto |
| 90 | `src/sisad-pdfme/schemas/text/icons/index.ts` | 30 | completo | Asset Adapter | Bajo riesgo; puede duplicar iconos de Lucide. | Conservar o migrar a un IconRegistry único. Preferir currentColor y evitar SVG strings duplicados. | P3 | Bajo |


# Dependencias que no deben invertirse

Permitido:

```text
schemas → common/contracts/shared abstractions
schemas → collaboration appearance contract
UI → schemas registry/manifests
generator → schemas renderers
```

Prohibido como estado final:

```text
schemas → RightSidebar/DetailView component
schemas → examples/features/modules
schema renderer → host endpoint
schema renderer → segundo event bus
schema renderer → registry global mutable
```

# Estrategia de commits

1. Un dominio por commit.
2. Primero characterization tests.
3. Después adapter/contract.
4. Migrar una familia.
5. Ejecutar gates focales.
6. Actualizar snapshot/migration solo con evidencia.
7. Retirar código legacy en otro commit.

# Qué no hacer

- no reescribir todo `schemas` de una vez;
- no introducir una jerarquía de clases por cada tipo;
- no crear un segundo plugin registry;
- no mover lógica a hooks React sin necesidad;
- no usar Context para datos que pertenecen al render context;
- no convertir algoritmos puros en services con estado;
- no ocultar incompatibilidades con `as any`;
- no marcar tareas terminadas sin build/tests;
- no modificar generator o snapshot para “hacer pasar” una familia sin
  caracterización previa.

# Resultado esperado

Después de la migración, una definición debería verse así:

```ts
export const approveManifest = defineSchema({
  type: 'approve',
  aliases: [],
  family: 'action',
  category: 'Acción',
  tags: ['approve', 'decision'],
  capabilities: ['designer', 'form', 'viewer', 'pdf', 'assignment'],
  defaults: actionDefaults({
    label: 'Aprobar',
    semanticTone: 'success',
  }),
  value: decisionActionCodec,
  validation: optionalActionValidation,
  appearance: actionAppearancePolicy,
  interaction: decisionCommandPolicy('approve'),
  inspector: actionInspectorProfile,
  renderers: decisionActionRenderers,
});
```

y su registro:

```ts
registry.register(approveManifest);
```

Sin editar manualmente `schemaFamilies`, sets de color, lectores de valor,
inspectores paralelos o listas adicionales.

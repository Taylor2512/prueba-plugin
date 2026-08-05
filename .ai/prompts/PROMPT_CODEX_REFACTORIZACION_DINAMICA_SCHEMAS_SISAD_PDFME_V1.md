# Prompt maestro — Refactorización dinámica de `src/sisad-pdfme/schemas`

Actúa como arquitecto y desarrollador principal de TypeScript/React/PDFME.

## Repositorio

```text
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Dominio

```text
src/sisad-pdfme/schemas
```

La carpeta es `schemas` en plural.

## Objetivo

Refactorizar incrementalmente los 90 archivos del dominio para que cada schema
sea extensible, declarativo, reutilizable y dinámico, sin perder comportamiento,
compatibilidad, snapshots, routing, recipients, ownership, firma, Designer,
Form, Viewer ni PDF.

## Lectura inicial obligatoria

1. `AGENTS.md`
2. `src/sisad-pdfme/schemas/AGENTS.md`
3. `.ai/START.md`
4. `.ai/routes/schemas.md`
5. `.ai/knowledge/domain/SCHEMA-BEHAVIOR-MATRIX.md`
6. `docs/04-schemas/**`
7. la auditoría `AUDITORIA_REFACTORIZACION_DINAMICA_SCHEMAS_SISAD_PDFME_V1.md`
8. código y tests focales de la familia seleccionada.

## Restricciones

- No ejecutar una reescritura big-bang.
- No crear un segundo registry, event bus, snapshot o renderer.
- Mantener el `Plugin<Schema>` de pdfme mediante adapters.
- No importar desde schemas hacia examples/features/modules.
- Eliminar progresivamente imports a componentes concretos del RightSidebar.
- No usar `as any` para ocultar incompatibilidades.
- No cambiar geometría, snapshot o generator sin prueba roja específica.
- Un writer por tarea.
- Máximo dos subagentes read-only.
- Máximo cinco archivos productivos por commit.
- No afirmar gates no ejecutados.
- Preservar:
  - schemaUid;
  - id/name/type;
  - documentId/pageNumber;
  - ownerRecipientId/ownerRecipientIds/ownerColor;
  - required/readOnly/locked;
  - selección;
  - valores;
  - snapshotVersion;
  - paridad UI/PDF.

## Arquitectura objetivo

Evoluciona `schemaBuilder.ts` y `schemas/index.ts` para soportar un
`SchemaManifest<TSchema,TValue>` con:

```text
identity
aliases
family
category/tags
capabilities
defaults factory
value codec
validation strategy
renderers por modo
inspector definition
appearance policy
interaction policy
migrations
lifecycle/dispose
```

Usa:

- Registry;
- Abstract Factory;
- Strategy;
- Adapter;
- Template Method;
- Decorator;
- Policy;
- Composite;
- State Machine solo donde exista interacción real.

No uses patrones decorativos sin reducir acoplamiento o duplicidad.

## Orden obligatorio

### Iteración 0

Solo análisis y characterization:

```bash
pwd
git branch --show-current
git status --short
git rev-parse HEAD
```

Inventaria la familia y escribe tests antes de tocar comportamiento.

### Iteración 1

Contratos compatibles:

- SchemaManifest;
- SchemaValueCodec;
- SchemaValidationStrategy;
- SchemaRuntimeContext;
- lifecycle/dispose;
- adapter manifest→Plugin;
- adapter plugin legacy→manifest.

### Iteración 2

Registry scoped:

- built-ins inmutables;
- custom registry por instancia;
- aliases en manifest;
- cache invalidable;
- fachada legacy.

### Iteración 3

Migrar una familia, no varias.

Orden:

1. textLike/number/date;
2. choice/boolean;
3. signature;
4. actions;
5. media/shapes/barcodes;
6. table.

## Tarea inicial recomendada

Comienza por una task card llamada:

```text
SCHEMA-DYN-001 — Contratos y registry compatible
```

Archivos candidatos:

```text
src/sisad-pdfme/schemas/schemaBuilder.ts
src/sisad-pdfme/schemas/index.ts
src/sisad-pdfme/schemas/schemaFamilies.ts
src/sisad-pdfme/schemas/shared/schemaTypes.ts
tests/unit/sisad-pdfme/schemas/schemaRegistry.contract.test.ts
```

No migres una familia completa en este primer commit.

## Criterios de aceptación de SCHEMA-DYN-001

- API actual continúa compilando.
- builtInPlugins y registerFieldPlugin siguen disponibles.
- dos instancias pueden registrar tipos distintos sin contaminarse.
- aliases se resuelven desde una sola fuente.
- tipos desconocidos no caen silenciosamente en text sin issue.
- no se usa cache global de onChange.
- tests prueban aislamiento de registry.
- no cambia el resultado visual.

## Siguientes tasks

```text
SCHEMA-DYN-002 — Value codecs y migración legacy
SCHEMA-DYN-003 — Inspector field catalog y conditions tipadas
SCHEMA-DYN-004 — Appearance policy y FieldChromeDecorator
SCHEMA-DYN-005 — TextRenderModel y familia text-like
SCHEMA-DYN-006 — OptionModel y choice factory
SCHEMA-DYN-007 — Signing factory por mode/provider
SCHEMA-DYN-008 — Action command policies y attachment adapter
SCHEMA-DYN-009 — Visual render models
SCHEMA-DYN-010 — TableLayoutEngine
SCHEMA-DYN-011 — Custom manifest API y consumer test
```

## Verificación por iteración

Ejecuta primero tests focales. Luego:

```bash
npm run lint
npm run build
npm run quality:direct-config-readers
npm run quality:source-language-boundary
npm run quality:duplicates:owned
npm test -- --run
```

Playwright cuando cambie UI, interacción o geometría.

## Formato de entrega

```text
1. causa y deuda confirmada
2. archivos leídos
3. tests de caracterización
4. diseño aplicado y por qué
5. archivos modificados
6. compatibilidad preservada
7. gates ejecutados
8. gates no ejecutados
9. riesgos
10. rollback
11. siguiente task
```

## Condición de parada

Detente y entrega handoff cuando:

- la tarea requiera más de cinco archivos productivos;
- aparezca un cambio de snapshot/geometría no previsto;
- sea necesario tocar otra familia;
- no exista prueba focal;
- surja una API paralela;
- se detecte dependencia del host dentro del core;
- los gates fallen por causas ajenas no diagnosticadas.

No continúes en ciclos de análisis repetidos. Después de una lectura focal,
formula una hipótesis verificable, crea el test y realiza un parche pequeño.

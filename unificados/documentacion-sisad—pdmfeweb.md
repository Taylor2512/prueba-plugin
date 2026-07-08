# Contexto para IA — Documentación Markdown

> Generado con `ai-context-pack.mjs v1.2.0`.

## Cómo usar este archivo con un proveedor de IA

- Usa las rutas relativas como referencia; no asumas archivos que no estén listados.
- Prioriza la tabla de archivos y los símbolos antes de proponer cambios.
- Cuando sugieras modificaciones, menciona la ruta exacta del archivo afectado.
- Los secretos, tokens y cadenas largas se redactan automáticamente salvo que se use `--no-redact`.

## Metadatos

- **Carpeta base:** `prueba-plugin`
- **Perfil:** `docs`
- **Modo:** `compact`
- **Fecha generación:** `2026-07-08T22:03:35.807Z`
- **Extensiones incluidas:** `.md, .mdx`
- **Archivos candidatos incluidos:** `78`
- **Límite por archivo:** `120 KB`
- **Límite total de contenido:** `1800 KB`

## Estructura incluida

```text
prueba-plugin
├── .ai
│   ├── agents
│   │   └── registry.md
│   ├── architecture
│   │   ├── design-patterns-by-process.md
│   │   ├── docusign-designer-process-analysis.md
│   │   ├── schema-object-model.md
│   │   └── solid-and-oop-guidelines.md
│   ├── context
│   │   ├── canvas-multipage-context.md
│   │   ├── commandbus-context.md
│   │   ├── css-visual-context.md
│   │   ├── designer-runtime-context.md
│   │   ├── docusign-like-context.md
│   │   ├── inspector-context.md
│   │   ├── schema-families-context.md
│   │   ├── schema-object-model-context.md
│   │   ├── snapshot-designer-context.md
│   │   ├── solid-oop-context.md
│   │   └── task-execution-contract.md
│   ├── CONTEXT_BUDGET.md
│   ├── context-map.md
│   ├── INDEX.md
│   ├── memory
│   │   ├── decisions.md
│   │   ├── project-memory.md
│   │   └── session-handoff.md
│   ├── playbooks
│   │   ├── PB-001-canvas-multipage.md
│   │   ├── PB-002-selection-transform.md
│   │   ├── PB-003-schema-families.md
│   │   ├── PB-004-inspector-detailview.md
│   │   ├── PB-005-snapshot-designer.md
│   │   ├── PB-006-css-visual.md
│   │   └── PB-007-refactor-solid.md
│   ├── prompts
│   │   ├── create-next-task-card.prompt.md
│   │   ├── diagnose-only.prompt.md
│   │   ├── execute-task-card.prompt.md
│   │   ├── implement-only.prompt.md
│   │   └── update-memory.prompt.md
│   ├── ROUTER.md
│   ├── rules
│   │   ├── canvas-rules.md
│   │   ├── context-budget-rules.md
│   │   ├── css-rules.md
│   │   ├── docusign-process-rules.md
│   │   ├── global-designer-rules.md
│   │   ├── inspector-rules.md
│   │   ├── moveable-selecto-rules.md
│   │   ├── no-loop-rules.md
│   │   ├── schema-rules.md
│   │   ├── snapshot-rules.md
│   │   ├── solid-rules.md
│   │   └── type-safety-rules.md
│   └── task-cards
│       ├── TASK-001-fix-multipage.md
│       ├── TASK-002-harden-selecto-moveable.md
│       ├── TASK-003-stabilize-option-groups.md
│       ├── TASK-004-schema-object-model.md
│       ├── TASK-005-reduce-any.md
│       ├── TASK-006-improve-inspector-sections.md
│       ├── TASK-007-compact-docusign-like-fields.md
│       ├── TASK-008-clean-feature-wrappers.md
│       ├── TASK-009-designer-snapshot-roundtrip.md
│       └── TASK-010-commandbus-actions.md
├── .tailwind-migration-backups
│   └── 20260708-111736
│       └── reports
│           └── tailwind-migration
│               └── README.md
├── docs
│   ├── 00-index
│   │   └── README.md
│   ├── 01-architecture
│   │   ├── 01-overview.md
│   │   ├── 02-ai-execution-model.md
│   │   ├── 03-solid-oop-patterns.md
│   │   └── 04-docusign-like-analysis.md
│   ├── 02-processes
│   │   ├── 01-canvas-multipage.md
│   │   ├── 02-selection-transform.md
│   │   ├── 03-schema-configuration.md
│   │   └── 04-snapshot-designer.md
│   ├── 03-schemas
│   │   ├── 01-schema-object-model.md
│   │   ├── 02-schema-families.md
│   │   ├── 03-inspector-sections.md
│   │   └── 04-docusign-field-mapping.md
│   └── 04-validation
│       ├── 01-manual-checklists.md
│       └── 02-regression-matrix.md
├── README.md
├── reports
│   └── tailwind-migration
│       ├── line-by-line-style-audit.md
│       └── README.md
├── scripts
│   └── README.md
└── test-results
    └── standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium
        └── error-context.md
```

## Archivos incluidos

| # | Ruta | Lenguaje | Líneas | KB original | Estado |
|---:|---|---|---:|---:|---|
| 1 | `README.md` | markdown | 100 | 2.5 | completo |
| 2 | `docs/00-index/README.md` | markdown | 27 | 0.7 | completo |
| 3 | `docs/01-architecture/01-overview.md` | markdown | 24 | 0.4 | completo |
| 4 | `docs/01-architecture/02-ai-execution-model.md` | markdown | 22 | 0.3 | completo |
| 5 | `docs/01-architecture/03-solid-oop-patterns.md` | markdown | 25 | 0.3 | completo |
| 6 | `docs/01-architecture/04-docusign-like-analysis.md` | markdown | 23 | 0.3 | completo |
| 7 | `docs/02-processes/01-canvas-multipage.md` | markdown | 19 | 0.3 | completo |
| 8 | `docs/02-processes/02-selection-transform.md` | markdown | 7 | 0.2 | completo |
| 9 | `docs/02-processes/03-schema-configuration.md` | markdown | 14 | 0.2 | completo |
| 10 | `docs/02-processes/04-snapshot-designer.md` | markdown | 12 | 0.2 | completo |
| 11 | `docs/03-schemas/01-schema-object-model.md` | markdown | 14 | 0.2 | completo |
| 12 | `docs/03-schemas/02-schema-families.md` | markdown | 12 | 0.4 | completo |
| 13 | `docs/03-schemas/03-inspector-sections.md` | markdown | 22 | 0.2 | completo |
| 14 | `docs/03-schemas/04-docusign-field-mapping.md` | markdown | 16 | 0.4 | completo |
| 15 | `docs/04-validation/01-manual-checklists.md` | markdown | 16 | 0.3 | completo |
| 16 | `docs/04-validation/02-regression-matrix.md` | markdown | 13 | 0.3 | completo |
| 17 | `.ai/CONTEXT_BUDGET.md` | markdown | 48 | 1.0 | completo |
| 18 | `.ai/context-map.md` | markdown | 25 | 0.9 | completo |
| 19 | `.ai/INDEX.md` | markdown | 62 | 1.6 | completo |
| 20 | `.ai/ROUTER.md` | markdown | 52 | 1.3 | completo |
| 21 | `scripts/README.md` | markdown | 21 | 0.4 | completo |
| 22 | `.ai/agents/registry.md` | markdown | 31 | 0.8 | completo |
| 23 | `.ai/architecture/design-patterns-by-process.md` | markdown | 12 | 0.4 | completo |
| 24 | `.ai/architecture/docusign-designer-process-analysis.md` | markdown | 50 | 0.8 | completo |
| 25 | `.ai/architecture/schema-object-model.md` | markdown | 41 | 0.6 | completo |
| 26 | `.ai/architecture/solid-and-oop-guidelines.md` | markdown | 33 | 0.7 | completo |
| 27 | `.ai/context/canvas-multipage-context.md` | markdown | 46 | 0.8 | completo |
| 28 | `.ai/context/commandbus-context.md` | markdown | 18 | 0.4 | completo |
| 29 | `.ai/context/css-visual-context.md` | markdown | 26 | 0.4 | completo |
| 30 | `.ai/context/designer-runtime-context.md` | markdown | 31 | 0.5 | completo |
| 31 | `.ai/context/docusign-like-context.md` | markdown | 26 | 0.4 | completo |
| 32 | `.ai/context/inspector-context.md` | markdown | 27 | 0.3 | completo |
| 33 | `.ai/context/schema-families-context.md` | markdown | 27 | 0.5 | completo |
| 34 | `.ai/context/schema-object-model-context.md` | markdown | 33 | 0.5 | completo |
| 35 | `.ai/context/snapshot-designer-context.md` | markdown | 20 | 0.3 | completo |
| 36 | `.ai/context/solid-oop-context.md` | markdown | 39 | 0.6 | completo |
| 37 | `.ai/context/task-execution-contract.md` | markdown | 14 | 0.3 | completo |
| 38 | `.ai/memory/decisions.md` | markdown | 21 | 0.5 | completo |
| 39 | `.ai/memory/project-memory.md` | markdown | 40 | 1.0 | completo |
| 40 | `.ai/memory/session-handoff.md` | markdown | 16 | 0.2 | completo |
| 41 | `.ai/playbooks/PB-001-canvas-multipage.md` | markdown | 20 | 0.5 | completo |
| 42 | `.ai/playbooks/PB-002-selection-transform.md` | markdown | 18 | 0.3 | completo |
| 43 | `.ai/playbooks/PB-003-schema-families.md` | markdown | 18 | 0.3 | completo |
| 44 | `.ai/playbooks/PB-004-inspector-detailview.md` | markdown | 17 | 0.3 | completo |
| 45 | `.ai/playbooks/PB-005-snapshot-designer.md` | markdown | 18 | 0.3 | completo |
| 46 | `.ai/playbooks/PB-006-css-visual.md` | markdown | 18 | 0.3 | completo |
| 47 | `.ai/playbooks/PB-007-refactor-solid.md` | markdown | 18 | 0.3 | completo |
| 48 | `.ai/prompts/create-next-task-card.prompt.md` | markdown | 14 | 0.2 | completo |
| 49 | `.ai/prompts/diagnose-only.prompt.md` | markdown | 14 | 0.2 | completo |
| 50 | `.ai/prompts/execute-task-card.prompt.md` | markdown | 23 | 0.4 | completo |
| 51 | `.ai/prompts/implement-only.prompt.md` | markdown | 10 | 0.2 | completo |
| 52 | `.ai/prompts/update-memory.prompt.md` | markdown | 5 | 0.2 | completo |
| 53 | `.ai/rules/canvas-rules.md` | markdown | 8 | 0.2 | completo |
| 54 | `.ai/rules/context-budget-rules.md` | markdown | 20 | 0.3 | completo |
| 55 | `.ai/rules/css-rules.md` | markdown | 8 | 0.2 | completo |
| 56 | `.ai/rules/docusign-process-rules.md` | markdown | 13 | 0.2 | completo |
| 57 | `.ai/rules/global-designer-rules.md` | markdown | 8 | 0.2 | completo |
| 58 | `.ai/rules/inspector-rules.md` | markdown | 7 | 0.2 | completo |
| 59 | `.ai/rules/moveable-selecto-rules.md` | markdown | 25 | 0.3 | completo |
| 60 | `.ai/rules/no-loop-rules.md` | markdown | 12 | 0.6 | completo |
| 61 | `.ai/rules/schema-rules.md` | markdown | 8 | 0.2 | completo |
| 62 | `.ai/rules/snapshot-rules.md` | markdown | 7 | 0.2 | completo |
| 63 | `.ai/rules/solid-rules.md` | markdown | 8 | 0.2 | completo |
| 64 | `.ai/rules/type-safety-rules.md` | markdown | 8 | 0.2 | completo |
| 65 | `.ai/task-cards/TASK-001-fix-multipage.md` | markdown | 69 | 2.3 | completo |
| 66 | `.ai/task-cards/TASK-002-harden-selecto-moveable.md` | markdown | 37 | 0.9 | completo |
| 67 | `.ai/task-cards/TASK-003-stabilize-option-groups.md` | markdown | 32 | 0.7 | completo |
| 68 | `.ai/task-cards/TASK-004-schema-object-model.md` | markdown | 31 | 0.6 | completo |
| 69 | `.ai/task-cards/TASK-005-reduce-any.md` | markdown | 22 | 0.4 | completo |
| 70 | `.ai/task-cards/TASK-006-improve-inspector-sections.md` | markdown | 25 | 0.5 | completo |
| 71 | `.ai/task-cards/TASK-007-compact-docusign-like-fields.md` | markdown | 28 | 0.6 | completo |
| 72 | `.ai/task-cards/TASK-008-clean-feature-wrappers.md` | markdown | 25 | 0.5 | completo |
| 73 | `.ai/task-cards/TASK-009-designer-snapshot-roundtrip.md` | markdown | 25 | 0.4 | completo |
| 74 | `.ai/task-cards/TASK-010-commandbus-actions.md` | markdown | 32 | 0.5 | completo |
| 75 | `reports/tailwind-migration/line-by-line-style-audit.md` | markdown | 227 | 21.6 | completo |
| 76 | `reports/tailwind-migration/README.md` | markdown | 76 | 4.6 | completo |
| 77 | `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md` | markdown | 576 | 28.7 | completo |
| 78 | `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md` | markdown | 76 | 3.4 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1437
- **directorio ignorado: dependencia/build/salida generada:** 7

## Totales

- **KB originales candidatos:** `94.7`
- **KB incluidos en contenido:** `94.6`
- **Comentarios reducidos:** `desactivada`
- **JSON de datos en React:** `omitido por defecto`
- **Redacción de secretos:** `activa`

---

# Contenido consolidado

<a id="file-0001"></a>

### 0001 — `README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `100`
- **Tamaño original:** `2.5 KB`
- **SHA1 corto:** `cab29d8cf1`
- **Estado:** `completo`

```markdown
# SISAD PDFME Designer — AI Architecture v3 Complete

Generado: `2026-06-15T15:04:39+00:00`

Arquitectura Markdown completa para continuar el desarrollo del **componente diseñador PDF** de `sisad-pdfme`, optimizada para proveedores de IA como Claude, Codex, Copilot, Gemini u otros.

## Alcance estricto

Este paquete se enfoca únicamente en:

``​`txt
Designer
Canvas
Schemas
LeftSidebar / catálogo
RightSidebar / DetailView / ListView
Toolbar contextual
Moveable
Selecto
CommandBus
Snapshot del diseñador
Configuración visual y funcional de campos
Multipágina / multidocumento dentro del diseñador
CSS del diseñador
Refactor SOLID/OOP del diseñador
``​`

No se enfoca en:

``​`txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms como flujo de negocio
Form/Viewer/Generator como implementación principal
``​`

Form/Viewer/Generator solo aparecen como **contrato de compatibilidad** para no romper metadata, snapshot ni schema contracts.

## Objetivo

Evitar que los proveedores de IA entren en loops de análisis, consuman tokens sin sentido o vuelvan a auditar todo el proyecto en cada tarea.

La arquitectura está diseñada para trabajar por:

``​`txt
Router
→ Context budget
→ Task-card cerrada
→ Playbook focalizado
→ Reglas estrictas
→ Archivos candidatos
→ Criterio de parada
→ Reporte final
``​`

## Principio rector

No corregir por síntoma. Corregir por proceso:

``​`txt
Proceso
→ Componentes involucrados
→ Fuente de verdad
→ Estados válidos
→ Datos preservados
→ Validación
→ Implementación mínima
``​`

## Cómo usar

1. Copia este paquete en la raíz del proyecto.
2. Empieza cada tarea con `START_PROMPT.md`.
3. Selecciona una `task-card` en `.ai/task-cards`.
4. Ejecuta solo esa tarea.
5. Si excede presupuesto, detenerse y crear nueva task-card.

## Instalación

``​`bash
bash scripts/install-architecture.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
``​`

## Limpieza previa opcional

Incluye scripts seguros para limpiar `.md` anteriores y carpetas vacías:

``​`bash
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm --backup

bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm
``​`
```

<a id="file-0002"></a>

### 0002 — `docs/00-index/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `0a7062fa5b`
- **Estado:** `completo`

```markdown
# Índice documental v3

## Arquitectura

- `docs/01-architecture/01-overview.md`
- `docs/01-architecture/02-ai-execution-model.md`
- `docs/01-architecture/03-solid-oop-patterns.md`
- `docs/01-architecture/04-docusign-like-analysis.md`

## Procesos

- `docs/02-processes/01-canvas-multipage.md`
- `docs/02-processes/02-selection-transform.md`
- `docs/02-processes/03-schema-configuration.md`
- `docs/02-processes/04-snapshot-designer.md`

## Schemas

- `docs/03-schemas/01-schema-object-model.md`
- `docs/03-schemas/02-schema-families.md`
- `docs/03-schemas/03-inspector-sections.md`
- `docs/03-schemas/04-docusign-field-mapping.md`

## Validación

- `docs/04-validation/01-manual-checklists.md`
- `docs/04-validation/02-regression-matrix.md`
```

<a id="file-0003"></a>

### 0003 — `docs/01-architecture/01-overview.md`

- **Lenguaje:** `markdown`
- **Líneas:** `24`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `350a92d8e5`
- **Estado:** `completo`

```markdown
# Overview — PDF Designer

El diseñador PDF de SISAD PDFME es un runtime visual para ubicar y configurar schemas sobre documentos PDF.

## Componentes

- Designer;
- Canvas;
- Paper;
- Renderer;
- Schemas;
- LeftSidebar;
- RightSidebar;
- DetailView;
- ListView;
- Toolbar contextual;
- Moveable;
- Selecto;
- CommandBus;
- Snapshot.

## No incluye

Flujos de negocio externos ni firma backend.
```

<a id="file-0004"></a>

### 0004 — `docs/01-architecture/02-ai-execution-model.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `41be5aed80`
- **Estado:** `completo`

```markdown
# AI Execution Model

## Problema

Prompts amplios causan loops y consumo excesivo.

## Solución

Task-cards cerradas con presupuesto.

## Modelo

``​`txt
Router
→ Task-card
→ Contexto
→ Regla
→ Playbook
→ rg
→ Cambios mínimos
→ Reporte
``​`
```

<a id="file-0005"></a>

### 0005 — `docs/01-architecture/03-solid-oop-patterns.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `fc89393302`
- **Estado:** `completo`

```markdown
# SOLID / OOP / patrones

## Enfoque

Composición sobre herencia.

## Patrones

- Registry;
- Factory;
- Strategy;
- Adapter;
- Template Method;
- Decorator funcional;
- Composite;
- Command;
- State;
- Facade.

## Principios

- SRP por módulo.
- OCP por registry.
- ISP por capabilities.
- DIP contra contratos.
```

<a id="file-0006"></a>

### 0006 — `docs/01-architecture/04-docusign-like-analysis.md`

- **Lenguaje:** `markdown`
- **Líneas:** `23`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `988d5c7e5a`
- **Estado:** `completo`

```markdown
# Análisis DocuSign-like

## Referencia funcional

DocuSign trabaja con documentos, recipients y tabs/campos.

## Procesos aplicables

- ubicación fija;
- anchor/AutoPlace;
- required/locked;
- dataLabel;
- tooltip;
- validation;
- checkbox groups;
- radio groups;
- prefill;
- inspector;
- audit.

## Regla

No copiar marca ni UI propietaria.
```

<a id="file-0007"></a>

### 0007 — `docs/02-processes/01-canvas-multipage.md`

- **Lenguaje:** `markdown`
- **Líneas:** `19`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `4b52c0b6a2`
- **Estado:** `completo`

```markdown
# Proceso — Canvas multipágina

## Flujo

``​`txt
event
→ page target
→ coordinate conversion
→ schema metadata
→ render page
→ overlay real rect
``​`

## Validación

- drop página 2;
- selección página 2;
- move/resize página 2;
- snapshot conserva página.
```

<a id="file-0008"></a>

### 0008 — `docs/02-processes/02-selection-transform.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `91371e114d`
- **Estado:** `completo`

```markdown
# Proceso — Selection/Transform

Selecto selecciona roots. Moveable transforma roots.

Excluir options, botón +, toolbar, inputs y overlays.

Shortcuts no corren durante inline edit.
```

<a id="file-0009"></a>

### 0009 — `docs/02-processes/03-schema-configuration.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b3ed2b892b`
- **Estado:** `completo`

```markdown
# Proceso — Configuración de schema

## Flujo

``​`txt
schema selected
→ inspector contract
→ widget por section
→ command update
→ snapshot state
→ re-render
``​`

No mutar schema desde widgets sin command/update centralizado.
```

<a id="file-0010"></a>

### 0010 — `docs/02-processes/04-snapshot-designer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `707d0d8d26`
- **Estado:** `completo`

```markdown
# Proceso — Snapshot diseñador

Preserva:

- document/page;
- geometry;
- ownership;
- options;
- selected values;
- __designer.

Roundtrip debe devolver lo mismo.
```

<a id="file-0011"></a>

### 0011 — `docs/03-schemas/01-schema-object-model.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `cf52ce4e23`
- **Estado:** `completo`

```markdown
# Schema Object Model

``​`txt
BaseSchema
→ Family schema
→ Plugin
→ Factory
→ Renderer
→ ValueAdapter
→ InspectorContract
→ Command handlers
``​`

Datos serializables. Comportamiento en plugins/adapters.
```

<a id="file-0012"></a>

### 0012 — `docs/03-schemas/02-schema-families.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `eee06bf9f9`
- **Estado:** `completo`

```markdown
# Schema Families

| Familia | Schemas |
|---|---|
| text-like | text, number, date, fullName, email |
| boolean | checkbox |
| option-based | checkboxGroup, radioGroup, select |
| signing-based | signature, initials, dateSigned |
| action-based | approve, decline, attachment, note |
| media | image, stamp |
| shape | line, rect, ellipse |
| table | table |
```

<a id="file-0013"></a>

### 0013 — `docs/03-schemas/03-inspector-sections.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `8765ea7a97`
- **Estado:** `completo`

```markdown
# Inspector Sections

Secciones:

``​`txt
basics
content
options
signature
appearance
validation
dataLabel
help
location
autoPlace
permissions
conditional
dataBindings
advanced
``​`

Cada familia declara qué secciones usa.
```

<a id="file-0014"></a>

### 0014 — `docs/03-schemas/04-docusign-field-mapping.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `5462b664f2`
- **Estado:** `completo`

```markdown
# Field mapping DocuSign-like

| DocuSign | SISAD |
|---|---|
| SignHere | signature |
| InitialHere | initials |
| DateSigned | dateSigned |
| Text | text |
| Number | number |
| Checkbox | checkbox |
| RadioGroup | radioGroup |
| List | select/dropdown |
| FormulaTab | formula |
| SignerAttachment | attachment |
| Note | note |
| Approve/Decline | approve/decline |
```

<a id="file-0015"></a>

### 0015 — `docs/04-validation/01-manual-checklists.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `63ba5f8a42`
- **Estado:** `completo`

```markdown
# Manual Checklists

## Multipágina

- Drop en página 2.
- Selección en página 2.
- Move en página 2.
- Resize en página 2.
- Toolbar en página 2.
- Snapshot conserva página.

## Grupos

- Botón + fuera de Moveable.
- Option interna no seleccionable.
- Snapshot conserva selected.
```

<a id="file-0016"></a>

### 0016 — `docs/04-validation/02-regression-matrix.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `090e2a3b67`
- **Estado:** `completo`

```markdown
# Regression Matrix

| Proceso | Validación |
|---|---|
| Drop | page metadata correcta |
| Select | root only |
| Move | conserva owner/page |
| Resize | conserva owner/page |
| Rotate | conserva owner/page |
| Botón + | no target transformable |
| Snapshot | roundtrip |
| Inspector | sección correcta |
| CSS | no rompe geometry |
```

<a id="file-0017"></a>

### 0017 — `.ai/CONTEXT_BUDGET.md`

- **Lenguaje:** `markdown`
- **Líneas:** `48`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `5a3bc3d5c6`
- **Estado:** `completo`

```markdown
# CONTEXT_BUDGET — Presupuesto de tokens y análisis

## Presupuesto fijo por tarea

``​`txt
1 task-card
1 contexto
1 regla principal
1 playbook
2 comandos rg máximo
8 archivos abiertos máximo
5 archivos modificados máximo
1 proceso por pasada
``​`

## Criterio de parada

Detenerse si:

``​`txt
[ ] La solución requiere más de 5 archivos modificados.
[ ] Hay que abrir más de 8 archivos.
[ ] La causa raíz pertenece a otro proceso.
[ ] Hay que tocar host/negocio.
[ ] Hay que tocar Form/Viewer/Generator como implementación.
[ ] Hay que modificar SnapshotAdapter globalmente.
[ ] Hay que ejecutar suite completa.
[ ] Hay que crear una arquitectura nueva.
``​`

## Qué hacer al detenerse

Entregar:

``​`md
# Diagnóstico parcial
## Bloqueo
## Por qué excede presupuesto
## Nueva task-card propuesta
## Archivos sugeridos
``​`

## Prohibido

- "Voy a revisar todo el proyecto".
- "Voy a cargar todos los Markdown".
- "Voy a hacer una auditoría completa" dentro de una task-card.
- Repetir análisis DocuSign si ya existe contexto.
```

<a id="file-0018"></a>

### 0018 — `.ai/context-map.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `a9feed1c0f`
- **Estado:** `completo`

```markdown
# Context Map — PDF Designer only

## Runtime

| Área | Archivos orientativos |
|---|---|
| Designer | `src/sisad-pdfme/ui/Designer.tsx` |
| Canvas | `ui/components/Designer/Canvas/*` |
| Paper/Renderer | `ui/components/Paper.tsx`, `Renderer.tsx`, `StaticSchema.tsx` |
| Schemas | `src/sisad-pdfme/schemas/*` |
| DetailView | `ui/components/Designer/RightSidebar/DetailView/*` |
| ListView | `ui/components/Designer/RightSidebar/ListView/*` |
| LeftSidebar | `ui/components/Designer/LeftSidebar*` |
| Overlays | `ui/components/Designer/Canvas/overlays/*` |
| Commands | `ui/commands/*`, `selectionCommands.ts` |
| Snapshot | `shared/snapshotAdapter.ts`, `schemaDesignerMeta.ts` |
| CSS | `ui/styles/*` |

## Límites

El diseñador no implementa negocio SISAD.

Form/Viewer/Generator solo son contrato de compatibilidad.

externalForms no es foco de implementación en esta arquitectura.
```

<a id="file-0019"></a>

### 0019 — `.ai/INDEX.md`

- **Lenguaje:** `markdown`
- **Líneas:** `62`
- **Tamaño original:** `1.6 KB`
- **SHA1 corto:** `651d2f086c`
- **Estado:** `completo`

```markdown
# .ai/INDEX.md — Índice mínimo del diseñador

## Carga base obligatoria

``​`txt
.ai/ROUTER.md
.ai/CONTEXT_BUDGET.md
.ai/memory/project-memory.md
.ai/context-map.md
.ai/agents/registry.md
``​`

## Flujo

``​`txt
Mensaje del usuario
→ ROUTER decide dominio
→ seleccionar task-card
→ cargar contexto focal
→ cargar regla principal
→ cargar playbook
→ ejecutar dentro de presupuesto
``​`

## No cargar por defecto

- todos los `.md`;
- todo `sisad-pdfme.md`;
- todo `codigo-sisad-pdfme.txt`;
- reportes históricos largos;
- prompts no relacionados;
- fuentes externas.

## Contextos disponibles

| Dominio | Contexto |
|---|---|
| Runtime diseñador | `.ai/context/designer-runtime-context.md` |
| Multipágina/canvas | `.ai/context/canvas-multipage-context.md` |
| Modelo de schemas | `.ai/context/schema-object-model-context.md` |
| Familias de schema | `.ai/context/schema-families-context.md` |
| Inspector | `.ai/context/inspector-context.md` |
| CommandBus | `.ai/context/commandbus-context.md` |
| Snapshot diseñador | `.ai/context/snapshot-designer-context.md` |
| CSS visual | `.ai/context/css-visual-context.md` |
| SOLID/OOP | `.ai/context/solid-oop-context.md` |
| DocuSign-like | `.ai/context/docusign-like-context.md` |

## Task-cards principales

``​`txt
TASK-001-fix-multipage.md
TASK-002-harden-selecto-moveable.md
TASK-003-stabilize-option-groups.md
TASK-004-schema-object-model.md
TASK-005-reduce-any.md
TASK-006-improve-inspector-sections.md
TASK-007-compact-docusign-like-fields.md
TASK-008-clean-feature-wrappers.md
TASK-009-designer-snapshot-roundtrip.md
TASK-010-commandbus-actions.md
``​`
```

<a id="file-0020"></a>

### 0020 — `.ai/ROUTER.md`

- **Lenguaje:** `markdown`
- **Líneas:** `52`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `0368b68e59`
- **Estado:** `completo`

```markdown
# ROUTER — Selección de contexto y task-card

## Pregunta 1 — ¿Qué proceso toca?

| Señal del usuario | Task-card |
|---|---|
| página 2 falla, hojas, multipágina, coordenadas, drop | TASK-001 |
| selección, mover, resize, rotate, shortcuts, Selecto, Moveable | TASK-002 |
| checkboxGroup, radioGroup, dropdown, botón +, options | TASK-003 |
| SOLID, POO, objetos, schemas, registry, factories | TASK-004 |
| any, casts, tipos, unknown, guards | TASK-005 |
| DetailView, inspector, propiedades, ListView | TASK-006 |
| diseño, visual, DocuSign-like, field chrome | TASK-007 |
| wrappers, features, archivos triviales | TASK-008 |
| guardar, importar, snapshot, metadata | TASK-009 |
| commandBus, selectionCommands, undo/redo | TASK-010 |

## Pregunta 2 — ¿Qué NO se toca?

Siempre excluir por defecto:

``​`txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms flujo de negocio
``​`

## Pregunta 3 — ¿Hace falta análisis global?

Respuesta por defecto: NO.

Solo se permite análisis global si el usuario pide explícitamente auditoría general.

## Resultado del router

Antes de modificar, el agente debe declarar:

``​`md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
``​`
```

<a id="file-0021"></a>

### 0021 — `scripts/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `0e32d4fbf2`
- **Estado:** `completo`

```markdown
# Scripts

## Instalar arquitectura

``​`bash
bash scripts/install-architecture.sh /ruta/proyecto
``​`

## Eliminar Markdown anteriores

``​`bash
node scripts/delete-existing-markdown.mjs /ruta/proyecto --dry-run
node scripts/delete-existing-markdown.mjs /ruta/proyecto --confirm --backup
``​`

## Eliminar carpetas vacías

``​`bash
bash scripts/clean-empty-dirs.sh /ruta/proyecto --dry-run
bash scripts/clean-empty-dirs.sh /ruta/proyecto --confirm
``​`
```

<a id="file-0022"></a>

### 0022 — `.ai/agents/registry.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `46fae4a9d8`
- **Estado:** `completo`

```markdown
# Agent Registry

## designer-runtime-agent
Uso: estado general del diseñador, composición, runtime ownership.

## canvas-runtime-agent
Uso: multipágina, coordenadas, drop, page metadata, overlays.

## moveable-selecto-agent
Uso: Moveable, Selecto, selection, transform, shortcuts, guards.

## schema-architecture-agent
Uso: schema registry, schema families, factories, object model.

## inspector-agent
Uso: DetailView, ListView, inspector sections, widgets.

## commandbus-agent
Uso: commandBus, selectionCommands, action contracts.

## snapshot-designer-agent
Uso: snapshot del diseñador, metadata, roundtrip.

## css-visual-agent
Uso: CSS scoped, tokens, visual compact, fieldChrome.

## solid-refactor-agent
Uso: SOLID, OOP, type safety, reducción de any.

## docusign-process-agent
Uso: aplicar contratos funcionales DocuSign-like ya resumidos.
```

<a id="file-0023"></a>

### 0023 — `.ai/architecture/design-patterns-by-process.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `eedef94a06`
- **Estado:** `completo`

```markdown
# Patrones por proceso del diseñador

| Proceso | Patrón |
|---|---|
| Crear schema | Factory Method + Registry |
| Render schema | Template Method + Decorator |
| Editar propiedades | Strategy + Registry |
| Valores | Adapter + Strategy |
| Transformar | Command + State |
| Grupos | Composite + Command |
| Snapshot | Adapter + Memento |
| Host bridge | Facade |
```

<a id="file-0024"></a>

### 0024 — `.ai/architecture/docusign-designer-process-analysis.md`

- **Lenguaje:** `markdown`
- **Líneas:** `50`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `842f4a71fe`
- **Estado:** `completo`

```markdown
# Análisis funcional DocuSign-like aplicado al diseñador

## Procesos

1. Cargar/preparar documento.
2. Definir recipients.
3. Añadir campos/tabs.
4. Ubicar campos.
5. Configurar propiedades.
6. Validar campos.
7. Completar/firma.
8. Auditar resultado.

## Mapeo funcional

| DocuSign | sisad-pdfme |
|---|---|
| SignHere | signature |
| InitialHere | initials |
| DateSigned | dateSigned |
| Text | text |
| Number | number |
| Checkbox | checkbox |
| Checkbox group | checkboxGroup |
| RadioGroup | radioGroup |
| List | select/dropdown |
| FormulaTab | formula |
| SignerAttachment | attachment |
| Note | note |
| Approve | approve |
| Decline | decline |

## Propiedades comunes

``​`txt
recipient
required
readOnly/locked
dataLabel
tooltip
validation
appearance
location
autoPlace
permissions
conditional
prefill
dataBindings
audit
``​`
```

<a id="file-0025"></a>

### 0025 — `.ai/architecture/schema-object-model.md`

- **Lenguaje:** `markdown`
- **Líneas:** `41`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `1c099f7d7e`
- **Estado:** `completo`

```markdown
# Modelo de objetos de schema

## Capas

``​`txt
Data object
Plugin
Factory
Renderer
ValueAdapter
InspectorContract
PdfCompatibilityContract
SnapshotAdapter
CommandHandlers
``​`

## Data object

Debe ser serializable.

## Plugin contract

``​`ts
type SchemaPlugin<TSchema extends SisadSchema> = {
  type: TSchema['type'];
  family: SchemaFamily;
  createDefault(ctx): TSchema;
  renderDesigner(root, schema, ctx): void;
  getCapabilities(schema): SchemaInteractionCapabilities;
};
``​`

## Inspector contract

``​`ts
type SchemaInspectorContract = {
  type: string;
  family: SchemaFamily;
  sections: Record<string, boolean>;
};
``​`
```

<a id="file-0026"></a>

### 0026 — `.ai/architecture/solid-and-oop-guidelines.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `6149abb195`
- **Estado:** `completo`

```markdown
# SOLID y POO para el diseñador PDF

## Decisión

Usar POO basada en contratos y composición, no herencia profunda.

## Aplicación SOLID

| Principio | Aplicación |
|---|---|
| SRP | schemaTypes solo tipos, fieldChrome solo visual, commandBus solo comandos |
| OCP | nuevos schemas por registry/factory/config |
| LSP | plugin reemplazable sin romper snapshot |
| ISP | interfaces por capacidad |
| DIP | Canvas/Inspector dependen de contratos |

## Composición

``​`ts
type TextSchema =
  BaseSchema<'text'>
  & HasAppearance
  & HasValidation
  & HasDataBinding;
``​`

## Evitar

``​`ts
class TextSchema extends BaseSchema
``​`

si el objeto debe serializarse al snapshot.
```

<a id="file-0027"></a>

### 0027 — `.ai/context/canvas-multipage-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `46`
- **Tamaño original:** `0.8 KB`
- **SHA1 corto:** `430eb1bd9e`
- **Estado:** `completo`

```markdown
# Canvas Multipage Context

## Regla central

Ninguna interacción debe asumir página 1.

## Página DOM

Cada página debe tener:

``​`html
data-paper-page="true"
data-document-id="..."
data-page-number="..."
data-page-index="..."
``​`

## Schema DOM

Cada schema root debe tener:

``​`html
data-schema-id="..."
data-schema-uid="..."
data-document-id="..."
data-page-number="..."
data-page-index="..."
``​`

## Flujo correcto

``​`txt
pointer/drop
→ resolver página bajo puntero
→ convertir client point a page point
→ crear/update schema con documentId + pageNumber
→ render en página correcta
→ overlay contra rect real
``​`

## Validación

- Drop en página 2 crea en página 2.
- Selecto ve targets de todas las páginas.
- Moveable transforma contra página dueña.
- Toolbar aparece en la página del schema.
```

<a id="file-0028"></a>

### 0028 — `.ai/context/commandbus-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `f44cd6b33f`
- **Estado:** `completo`

```markdown
# CommandBus Context

Toda mutación relevante del diseñador debe pasar por command bus o selectionCommands.

## Acciones

- addGroupOption;
- deleteSelection;
- duplicateSelection;
- pasteSelection;
- alignSelection;
- distributeSelection;
- transform schema;
- update schema property.

## Regla

Los componentes visuales disparan comandos. No mutan estado directamente.
```

<a id="file-0029"></a>

### 0029 — `.ai/context/css-visual-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `04f57c8bd3`
- **Estado:** `completo`

```markdown
# CSS Visual Context

## Runtime CSS

Todo bajo:

``​`css
.sisad-pdfme-root
``​`

## Reglas

- PDF protagonista.
- Campos como overlays ligeros.
- Owner color sutil.
- Border selected claro.
- Sin badges técnicos permanentes.
- No tocar `.moveable-*` ni `.selecto-*` desde host.
- No resolver hit-testing con z-index.

## Archivos

- tokens.css
- sisad-pdfme-global.css
- canvas-interactions.css
- sisad-pdfme-runtime.css
```

<a id="file-0030"></a>

### 0030 — `.ai/context/designer-runtime-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `d858d1d3e3`
- **Estado:** `completo`

```markdown
# Designer Runtime Context

El diseñador PDF es el dueño de:

- canvas;
- schemas;
- left sidebar;
- right sidebar;
- DetailView;
- ListView;
- overlays;
- toolbar contextual;
- selection;
- Moveable;
- Selecto;
- command bus;
- snapshot del diseñador;
- CSS runtime.

## No pertenece al diseñador

- StepOne;
- StepTwo host;
- APIs SISAD;
- Uanataca/liveness;
- flujo de negocio;
- externalForms como proceso externo.

## Contratos

El diseñador debe preservar metadata para que otros módulos puedan consumir el snapshot.
```

<a id="file-0031"></a>

### 0031 — `.ai/context/docusign-like-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `26`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `386f9e591d`
- **Estado:** `completo`

```markdown
# DocuSign-like Context

DocuSign se usa como referencia funcional.

## Procesos de referencia

- documentos;
- recipients;
- tabs/campos;
- ubicación fija;
- anchor/AutoPlace;
- PDF form field transform;
- required/locked;
- dataLabel;
- tooltip;
- validation;
- checkbox groups;
- radio groups;
- prefill;
- inspector de propiedades;
- firma como estado/acción;
- auditoría.

## Regla

No copiar CSS, HTML, SVG, branding ni nombres visuales propietarios.
```

<a id="file-0032"></a>

### 0032 — `.ai/context/inspector-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `ec1285a5bc`
- **Estado:** `completo`

```markdown
# Inspector Context

DetailView/ListView pertenecen al diseñador.

## Secciones canónicas

``​`txt
basics
content
options
signature
appearance
validation
dataLabel
help
location
autoPlace
permissions
conditional
dataBindings
collaboration
advanced
``​`

## Regla

El inspector debe decidir por contrato/familia, no por switches repetidos.
```

<a id="file-0033"></a>

### 0033 — `.ai/context/schema-families-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `27`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `69477f80d5`
- **Estado:** `completo`

```markdown
# Schema Families Context

## Familias

``​`txt
text-like
option-based
boolean
signing-based
action-based
media
shape
table
advanced
``​`

## Prioridad

- option-based: checkboxGroup, radioGroup, select/dropdown.
- boolean: checkbox.
- signing-based: signature, initials, dateSigned.
- action-based: approve, decline, attachment, note.
- text-like: text, number, date/time, fullName, email, company, title.

## Regla

Cada familia debe compartir factory, renderer, capabilities y value adapter cuando aplique.
```

<a id="file-0034"></a>

### 0034 — `.ai/context/schema-object-model-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `33`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `666a0739ad`
- **Estado:** `completo`

```markdown
# Schema Object Model Context

## Capas

``​`txt
Data object
→ Plugin
→ Factory
→ Renderer
→ Value adapter
→ Inspector contract
→ PDF compatibility contract
→ Snapshot adapter
→ Command handlers
``​`

## Data object

Debe ser plano, serializable y versionable.

No debe incluir:

- DOM;
- funciones;
- instancias React;
- File directo sin adapter;
- provider runtime vivo.

## Identidad

- `schemaUid` = identidad técnica.
- `name/label` = visual.
- `dataLabel/fieldKey` = integración.
```

<a id="file-0035"></a>

### 0035 — `.ai/context/snapshot-designer-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `67db02d37e`
- **Estado:** `completo`

```markdown
# Snapshot Designer Context

Snapshot del diseñador preserva:

- documents;
- pages;
- schemas;
- assignments;
- ownership;
- geometry;
- group options;
- selected values;
- __designer metadata.

## Prohibido

- snapshot paralelo;
- guardar solo página activa;
- perder documentId/pageNumber;
- convertir options internas en schemas.
```

<a id="file-0036"></a>

### 0036 — `.ai/context/solid-oop-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `39`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `94a3923637`
- **Estado:** `completo`

```markdown
# SOLID / OOP Context

## Enfoque

POO basada en contratos y composición.

Preferir:

``​`txt
interfaces
type aliases
discriminated unions
factories
strategy objects
adapters
commands
state unions
type guards
composition over inheritance
``​`

Evitar:

``​`txt
class BaseSchema extendida por todo
herencia profunda
Record<string, any>
as any nuevo
mega switch por schema.type
objetos no serializables
``​`

## SOLID

- SRP: un módulo, una responsabilidad.
- OCP: extender por registry/factory/config.
- LSP: todo plugin cumple contrato base.
- ISP: interfaces pequeñas por capacidad.
- DIP: UI depende de contratos.
```

<a id="file-0037"></a>

### 0037 — `.ai/context/task-execution-contract.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `961079482a`
- **Estado:** `completo`

```markdown
# Task Execution Contract

Toda tarea debe tener:

- objetivo;
- alcance;
- archivos candidatos;
- archivos prohibidos;
- búsquedas permitidas;
- presupuesto;
- validación manual;
- criterio de parada.

Si la tarea no tiene eso, pedir aclaración o crear task-card antes de modificar.
```

<a id="file-0038"></a>

### 0038 — `.ai/memory/decisions.md`

- **Lenguaje:** `markdown`
- **Líneas:** `21`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `2e3f0699d5`
- **Estado:** `completo`

```markdown
# Decisions Log

## ADR-001 — PDF Designer only

La arquitectura v3 se limita al componente diseñador PDF.

## ADR-002 — Task-cards

Toda implementación debe partir de una task-card cerrada.

## ADR-003 — Context budget

Se limita el contexto a 1 contexto + 1 regla + 1 playbook + 1 task-card.

## ADR-004 — Composition over inheritance

En schemas se prefiere composición, factories, strategies, adapters y type guards sobre herencia profunda.

## ADR-005 — DocuSign-like no copy

DocuSign se usa como referencia funcional, no visual ni de marca.
```

<a id="file-0039"></a>

### 0039 — `.ai/memory/project-memory.md`

- **Lenguaje:** `markdown`
- **Líneas:** `40`
- **Tamaño original:** `1.0 KB`
- **SHA1 corto:** `b8fe99c65f`
- **Estado:** `completo`

```markdown
# Project Memory — Designer PDF

## Objetivo

Construir y estabilizar el componente diseñador PDF de `sisad-pdfme`:

- visual compacto;
- multipágina/multidocumento;
- schema plugins;
- owner/recipient colors;
- canvas interactions;
- DetailView/ListView;
- command bus;
- snapshot;
- compatibilidad Form/Viewer/Generator;
- UX funcional tipo DocuSign/Wix.

## Reglas fuertes

- El color del destinatario activo solo aplica a schemas nuevos.
- Schemas existentes conservan owner/color original.
- `checkboxGroup` y `radioGroup` son grupos lógicos.
- Las opciones internas no son schemas.
- Root usa `data-schema-id`.
- Options usan `data-option-id`.
- Botón + usa `data-role="group-add-option"` y vive fuera del root transformable.
- No-overlap por `owner + documentId + pageNumber`.
- Snapshot preserva metadata.
- No duplicar runtime en hosts.

## Prioridad de tareas

1. Multipágina.
2. Guards Selecto/Moveable.
3. Option groups.
4. Schema object model.
5. Type safety.
6. Inspector sections.
7. Visual compact.
8. Wrappers cleanup.
```

<a id="file-0040"></a>

### 0040 — `.ai/memory/session-handoff.md`

- **Lenguaje:** `markdown`
- **Líneas:** `16`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `60d8ad7c58`
- **Estado:** `completo`

```markdown
# Session Handoff

Actualizar al cerrar una sesión.

## Formato

``​`md
## YYYY-MM-DD
- Task-card:
- Objetivo:
- Archivos modificados:
- Cambios:
- Validación:
- Riesgos:
- Nueva task-card:
``​`
```

<a id="file-0041"></a>

### 0041 — `.ai/playbooks/PB-001-canvas-multipage.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `e35218050d`
- **Estado:** `completo`

```markdown
# PB-001 — Canvas multipágina

## Objetivo

Eliminar dependencias implícitas de página 1.

## Pasos

1. Buscar `pageNumber/pageIndex/documentId/querySelector/getBoundingClientRect`.
2. Identificar dónde se resuelve página.
3. Asegurar DOM de página con metadata.
4. Asegurar root schema con metadata.
5. Corregir drop para usar página bajo puntero.
6. Corregir render por document/page.
7. Corregir overlays contra rect real.
8. Corregir no-overlap por owner/document/page.

## Parar si

Requiere más de 5 archivos modificados.
```

<a id="file-0042"></a>

### 0042 — `.ai/playbooks/PB-002-selection-transform.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `99838a7af7`
- **Estado:** `completo`

```markdown
# PB-002 — Selection y transform

## Objetivo

Selecto y Moveable solo operan sobre schema roots.

## Pasos

1. Revisar guards.
2. Revisar Selecto targets.
3. Revisar Moveable targets.
4. Excluir options/botón+/toolbar/inputs.
5. Validar shortcuts.
6. Validar multi-select.

## Parar si

Hay que reescribir Moveable/Selecto.
```

<a id="file-0043"></a>

### 0043 — `.ai/playbooks/PB-003-schema-families.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `96f66076fc`
- **Estado:** `completo`

```markdown
# PB-003 — Familias de schemas

## Objetivo

Reducir duplicidad por familia.

## Pasos

1. Revisar schemaTypes/schemaGuards.
2. Revisar factories existentes.
3. Agrupar option-based.
4. Agrupar action-based.
5. Agrupar signing-based.
6. Aplicar value adapters.

## Parar si

Requiere reescribir todos los schemas.
```

<a id="file-0044"></a>

### 0044 — `.ai/playbooks/PB-004-inspector-detailview.md`

- **Lenguaje:** `markdown`
- **Líneas:** `17`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `7c67b7fb4a`
- **Estado:** `completo`

```markdown
# PB-004 — Inspector

## Objetivo

DetailView por contrato/familia.

## Pasos

1. Revisar detailSchemas.
2. Revisar widgets existentes.
3. Mapear secciones por familia.
4. Eliminar switches duplicados.
5. Mantener properties serializables.

## Parar si

Se requiere rediseñar todo RightSidebar.
```

<a id="file-0045"></a>

### 0045 — `.ai/playbooks/PB-005-snapshot-designer.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `03aac6a783`
- **Estado:** `completo`

```markdown
# PB-005 — Snapshot diseñador

## Objetivo

Preservar metadata roundtrip.

## Pasos

1. Revisar snapshotAdapter.
2. Revisar schemaDesignerMeta.
3. Verificar document/page.
4. Verificar owner.
5. Verificar group/options.
6. Verificar selected values.

## Parar si

Se requiere cambiar formato global de snapshot sin migration.
```

<a id="file-0046"></a>

### 0046 — `.ai/playbooks/PB-006-css-visual.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `80d0b9096a`
- **Estado:** `completo`

```markdown
# PB-006 — CSS visual

## Objetivo

Campos compactos, PDF protagonista.

## Pasos

1. Revisar fieldChrome.
2. Revisar tokens.
3. Aplicar data-schema-family/state.
4. Quitar badges técnicos permanentes.
5. Mantener owner color sutil.
6. No tocar Moveable/Selecto.

## Parar si

El bug es de geometría, no CSS.
```

<a id="file-0047"></a>

### 0047 — `.ai/playbooks/PB-007-refactor-solid.md`

- **Lenguaje:** `markdown`
- **Líneas:** `18`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `a4e7f17a1b`
- **Estado:** `completo`

```markdown
# PB-007 — Refactor SOLID/type safety

## Objetivo

Reducir duplicidad y any.

## Pasos

1. Buscar any/casts.
2. Clasificar por familia.
3. Usar type guards.
4. Usar factories/adapters.
5. No cambiar snapshot.
6. No crear clases profundas.

## Parar si

El refactor toca más de un proceso.
```

<a id="file-0048"></a>

### 0048 — `.ai/prompts/create-next-task-card.prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `f1601d9810`
- **Estado:** `completo`

```markdown
# Prompt — Crear nueva task-card

Usar cuando una tarea excede presupuesto.

## Debe incluir

- objetivo;
- alcance;
- no tocar;
- búsqueda permitida;
- archivos candidatos;
- presupuesto;
- validación;
- criterio de parada.
```

<a id="file-0049"></a>

### 0049 — `.ai/prompts/diagnose-only.prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `14`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `664d6ffe0a`
- **Estado:** `completo`

```markdown
# Prompt — Diagnóstico sin modificar

No modificar archivos.

## Salida

``​`md
# Diagnóstico
## Task-card sugerida
## Causa probable
## Archivos candidatos
## Búsquedas sugeridas
## Riesgos
``​`
```

<a id="file-0050"></a>

### 0050 — `.ai/prompts/execute-task-card.prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `23`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `ebd208eda2`
- **Estado:** `completo`

```markdown
# Prompt — Ejecutar task-card

Usa exactamente una task-card.

## Inicio

1. Leer `.ai/ROUTER.md`.
2. Leer `.ai/CONTEXT_BUDGET.md`.
3. Cargar contexto/regla/playbook indicados.
4. Ejecutar búsquedas permitidas.
5. Modificar dentro del presupuesto.
6. Reportar.

## Prohibido

- análisis global;
- leer todos los md;
- exceder 5 archivos modificados;
- tocar fuera del scope.

## Salida

Usar formato de `START_PROMPT.md`.
```

<a id="file-0051"></a>

### 0051 — `.ai/prompts/implement-only.prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `10`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `a9ec2e7558`
- **Estado:** `completo`

```markdown
# Prompt — Implementar sin nueva auditoría

No repitas análisis global. Usa la task-card y aplica cambios mínimos.

## Reglas

- Máximo 5 archivos.
- No tocar fuera del scope.
- No crear tests.
- Reportar validación manual.
```

<a id="file-0052"></a>

### 0052 — `.ai/prompts/update-memory.prompt.md`

- **Lenguaje:** `markdown`
- **Líneas:** `5`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `ac395bf6be`
- **Estado:** `completo`

```markdown
# Prompt — Actualizar memoria

Actualizar `.ai/memory/session-handoff.md`.

No guardar logs largos, stack traces completos ni respuestas enteras de IA.
```

<a id="file-0053"></a>

### 0053 — `.ai/rules/canvas-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `2f4f396556`
- **Estado:** `completo`

```markdown
# Canvas Rules

- Ninguna interacción asume página 1.
- Resolver página bajo puntero.
- Render por documentId + pageNumber.
- Overlays contra rect real.
- No-overlap por owner/document/page.
- No setTimeout para coordenadas.
```

<a id="file-0054"></a>

### 0054 — `.ai/rules/context-budget-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `20`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `2bab2c149b`
- **Estado:** `completo`

```markdown
# Context Budget Rules

## Máximo

``​`txt
1 context
1 rule
1 playbook
1 task-card
2 rg
8 archivos abiertos
5 archivos modificados
``​`

## Prohibido

- leer todos los .md;
- cargar archivos unificados completos;
- buscar indefinidamente;
- ejecutar auditoría general.
```

<a id="file-0055"></a>

### 0055 — `.ai/rules/css-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `6a21d76429`
- **Estado:** `completo`

```markdown
# CSS Rules

- Runtime bajo .sisad-pdfme-root.
- Lab bajo clase propia.
- No body/html.
- No z-index arbitrario.
- No tocar moveable/selecto desde host.
- Usar tokens y fieldChrome.
```

<a id="file-0056"></a>

### 0056 — `.ai/rules/docusign-process-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `13`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b299f50366`
- **Estado:** `completo`

```markdown
# DocuSign-like Rules

Permitido: modelar procesos funcionales.

Prohibido:

- copiar branding;
- copiar CSS;
- copiar HTML/SVG;
- acoplar APIs DocuSign;
- análisis repetitivo externo.

Usar contratos propios de sisad-pdfme.
```

<a id="file-0057"></a>

### 0057 — `.ai/rules/global-designer-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `cff4defb78`
- **Estado:** `completo`

```markdown
# Global Designer Rules

- PDF Designer only.
- No host/business.
- No Uanataca/liveness/API.
- Preserve schema identity and page metadata.
- No parallel runtime.
- No global audit inside a task-card.
```

<a id="file-0058"></a>

### 0058 — `.ai/rules/inspector-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `b45a5f5dda`
- **Estado:** `completo`

```markdown
# Inspector Rules

- DetailView por contrato/familia.
- No switches repetidos.
- No mezclar widgets de schema sin capabilities.
- Propiedades comunes en commonInspectorFields.
- Options editadas en optionPropPanel.
```

<a id="file-0059"></a>

### 0059 — `.ai/rules/moveable-selecto-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.3 KB`
- **SHA1 corto:** `73927ba055`
- **Estado:** `completo`

```markdown
# Moveable / Selecto Rules

## Targets válidos

``​`txt
.sisad-pdfme-ui-custom-selectable[data-schema-id]
``​`

## Excluir

``​`txt
[data-option-id]
[data-role="group-add-option"]
.moveable-control
.moveable-line
.moveable-control-box
input
textarea
[contenteditable="true"]
toolbar
popover
modal
``​`

Moveable transforma solo roots.
```

<a id="file-0060"></a>

### 0060 — `.ai/rules/no-loop-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `12`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `587256a96a`
- **Estado:** `completo`

```markdown
# No-loop Rules

1. No volver a analizar todo el proyecto si existe task-card.
2. No abrir más contexto del permitido.
3. No repetir análisis DocuSign si ya existe contexto.
4. No proponer tocar archivos fuera del scope.
5. No convertir una tarea en auditoría global.
6. No crear nuevas tareas dentro de la implementación; solo reportarlas.
7. Si se detecta bloqueo, parar y entregar diagnóstico.
8. Si se requieren más de 5 archivos modificados, parar y proponer fase 2.
9. Si el error pertenece a otra zona, no corregirlo en esta tarea.
10. Diferenciar siempre: modificado, observado, pendiente.
```

<a id="file-0061"></a>

### 0061 — `.ai/rules/schema-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `5ac35a9ff2`
- **Estado:** `completo`

```markdown
# Schema Rules

- Root = único con data-schema-id.
- Options internas = data-option-id.
- Botón + = data-role group-add-option.
- Options internas no son schemas.
- Preservar owner/page/geometry.
- Usar families y factories.
```

<a id="file-0062"></a>

### 0062 — `.ai/rules/snapshot-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `7`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `41515ae783`
- **Estado:** `completo`

```markdown
# Snapshot Rules

- Snapshot del diseñador único.
- Preservar documentId/pageNumber.
- Preservar groupId/optionId/options/selected values.
- Legacy fallback a página 1 solo si no hay metadata.
- No snapshot paralelo.
```

<a id="file-0063"></a>

### 0063 — `.ai/rules/solid-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `c2e7bd7faa`
- **Estado:** `completo`

```markdown
# SOLID Rules

- SRP: un módulo una responsabilidad.
- OCP: registry/factory/config.
- LSP: plugins cumplen contrato.
- ISP: interfaces pequeñas.
- DIP: depender de contratos.
- No clases profundas.
```

<a id="file-0064"></a>

### 0064 — `.ai/rules/type-safety-rules.md`

- **Lenguaje:** `markdown`
- **Líneas:** `8`
- **Tamaño original:** `0.2 KB`
- **SHA1 corto:** `eca49afaa4`
- **Estado:** `completo`

```markdown
# Type Safety Rules

- No nuevos as any.
- Record<string, any> -> Record<string, unknown> si seguro.
- schema:any -> BaseSchema/SisadSchema si aplica.
- option:any -> OptionItem.
- Usar type guards.
- Usar discriminated unions.
```

<a id="file-0065"></a>

### 0065 — `.ai/task-cards/TASK-001-fix-multipage.md`

- **Lenguaje:** `markdown`
- **Líneas:** `69`
- **Tamaño original:** `2.3 KB`
- **SHA1 corto:** `736e868ad5`
- **Estado:** `completo`

```markdown
# TASK-001 — Corregir regresión multipágina del diseñador

## Alcance

Canvas, Paper, Renderer, StaticSchema, coordinate services, overlays, no-overlap.

## Problema

Comportamientos funcionan en página 1 pero fallan en página 2+.

## No tocar

``​`txt
signingSchemaFactory
approve.ts
decline.ts
attachment.ts
dateSigned.ts
providerRegistry
Form
Viewer
Generator/PDF
StepOne
StepTwo host
ContentCustomForm
Uanataca
externalForms flujo negocio
``​`

## Búsqueda permitida

``​`bash
rg "pageNumber|pageIndex|documentId|currentPage|currentPageIndex|activePage|paperPage|paperRoot|data-paper-page|data-paper-root|querySelector\(|querySelectorAll\(|closest\(|getBoundingClientRect|clientX|clientY|scrollLeft|scrollTop|offsetLeft|offsetTop" src/sisad-pdfme/ui src/sisad-pdfme/shared src/sisad-pdfme/schemas

rg "schemaAutoPlace|schemaCollision|smartPlacement|canvasDropPipeline|resolveCanvasDropTarget|DesignerCoordinateService|coordinateMath|Moveable|Selecto|GroupOptionFloatingAction|SelectionContextToolbar|SchemaDropPlaceholder|SchemaDragPreview" src/sisad-pdfme
``​`

## Archivos candidatos

``​`txt
src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Paper.tsx
src/sisad-pdfme/ui/components/Renderer.tsx
src/sisad-pdfme/ui/components/StaticSchema.tsx
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts
``​`

## Presupuesto

Máximo 8 archivos abiertos. Máximo 5 modificados.

## Validación manual

- Drop en página 2.
- Selección en página 2.
- Move/resize en página 2.
- Botón + en página 2.
- Toolbar en página 2.
- Snapshot conserva página.
```

<a id="file-0066"></a>

### 0066 — `.ai/task-cards/TASK-002-harden-selecto-moveable.md`

- **Lenguaje:** `markdown`
- **Líneas:** `37`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `e7b730b747`
- **Estado:** `completo`

```markdown
# TASK-002 — Endurecer Selecto/Moveable/shortcuts

## Objetivo

Evitar colisiones entre selección, transform, overlays, options, botón + e inputs.

## Contexto

Usar `moveable-selecto-rules.md` y `PB-002-selection-transform.md`.

## Búsqueda permitida

``​`bash
rg "selectableTargetGuards|transformTargetGuards|interactionGuards|Selecto|Moveable|data-option-id|group-add-option|contenteditable|keyboardShortcut|selectionCommands" src/sisad-pdfme/ui src/sisad-pdfme/shared
``​`

## Archivos candidatos

``​`txt
selectableTargetGuards.ts
transformTargetGuards.ts
interactionGuards.ts
interactionState.ts
keyboardShortcutRegistry.ts
useDesignerKeyboardShortcuts.ts
Selecto.tsx
Moveable.tsx
SelectionContextToolbar.tsx
``​`

## Validación

- Options internas no se seleccionan.
- Botón + no se selecciona.
- Toolbar no se selecciona.
- Input/inline edit bloquea shortcuts.
- Multi-select funciona.
```

<a id="file-0067"></a>

### 0067 — `.ai/task-cards/TASK-003-stabilize-option-groups.md`

- **Lenguaje:** `markdown`
- **Líneas:** `32`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `2c068c957e`
- **Estado:** `completo`

```markdown
# TASK-003 — Estabilizar option groups

## Objetivo

checkboxGroup, radioGroup y select/dropdown deben compartir contratos sin duplicidad.

## Reglas

- checkboxGroup = multiple.
- radioGroup = single.
- select/dropdown = single compact.
- options internas no son schemas.
- botón + externo solo para grupos, no select.

## Archivos candidatos

``​`txt
schemas/options/*
schemas/checkbox/index.ts
schemas/checkboxGroup/index.ts
schemas/radioGroup/index.ts
schemas/select/index.ts
GroupOptionFloatingAction.tsx
selectionCommands.ts
``​`

## Validación

- Agregar opción no mueve grupo.
- Botón + fuera de Moveable.
- DetailView edita options.
- Snapshot preserva optionId/selected.
```

<a id="file-0068"></a>

### 0068 — `.ai/task-cards/TASK-004-schema-object-model.md`

- **Lenguaje:** `markdown`
- **Líneas:** `31`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `ba1731f4d7`
- **Estado:** `completo`

```markdown
# TASK-004 — Aplicar modelo de objetos de schemas

## Objetivo

Fortalecer contratos: BaseSchema, SisadSchema, SchemaPlugin, InspectorContract, ValueAdapter.

## Archivos candidatos

``​`txt
schemas/shared/schemaTypes.ts
schemas/shared/schemaGuards.ts
schemas/index.ts
schemas/schemaBuilder.ts
schemas/schemaFamilies.ts
schemas/options/*
schemas/actions/*
schemas/signature/*
schemas/textLike/*
``​`

## No hacer

- No reescribir todos los schemas.
- No cambiar snapshot sin migration.
- No crear clase base profunda.

## Validación

- Menos casts.
- Plugins tipados.
- Families claras.
```

<a id="file-0069"></a>

### 0069 — `.ai/task-cards/TASK-005-reduce-any.md`

- **Lenguaje:** `markdown`
- **Líneas:** `22`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `e13734af8d`
- **Estado:** `completo`

```markdown
# TASK-005 — Reducir any de forma segura

## Objetivo

Reducir `any` sin romper APIs.

## Búsqueda

``​`bash
rg "any|as any|Record<string, any>|Array<any>|Promise<any>" src/sisad-pdfme src/features
``​`

## Reglas

- No nuevos as any.
- Usar unknown + guards.
- Usar BaseSchema/SisadSchema/OptionItem.
- No tocar APIs públicas si no está claro.

## Presupuesto

Máximo 5 archivos modificados.
```

<a id="file-0070"></a>

### 0070 — `.ai/task-cards/TASK-006-improve-inspector-sections.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `4e84d8dce6`
- **Estado:** `completo`

```markdown
# TASK-006 — Mejorar DetailView/Inspector por secciones

## Objetivo

Configurar propiedades por familia tipo DocuSign-like.

## Archivos candidatos

``​`txt
RightSidebar/DetailView/detailSchemas.ts
detailWidgetRegistry.tsx
detailWidgets.tsx
InspectorPrimitives.tsx
commonInspectorFields.ts
optionPropPanel.tsx
signature/propPanel.ts
``​`

## Secciones

basics, content, options, signature, appearance, validation, dataLabel, help, location, autoPlace, permissions, conditional, advanced.

## Validación

Inspector correcto por schema/familia.
```

<a id="file-0071"></a>

### 0071 — `.ai/task-cards/TASK-007-compact-docusign-like-fields.md`

- **Lenguaje:** `markdown`
- **Líneas:** `28`
- **Tamaño original:** `0.6 KB`
- **SHA1 corto:** `26cd800732`
- **Estado:** `completo`

```markdown
# TASK-007 — Visual compacto tipo DocuSign/Wix

## Objetivo

PDF protagonista y schemas como overlays ligeros.

## Archivos candidatos

``​`txt
schemas/shared/fieldChrome.ts
schemas/shared/renderSchemaWithChrome.ts
schemas/shared/schemaDom.ts
ui/styles/tokens.css
ui/styles/sisad-pdfme-global.css
ui/styles/canvas-interactions.css
schemas/options/*
schemas/actions/*
schemas/signature/*
schemas/textLike/*
``​`

## No hacer

No tocar geometría. No tocar Moveable/Selecto. No z-index arbitrario.

## Validación

Campos compactos, ownerColor sutil, sin badges técnicos permanentes.
```

<a id="file-0072"></a>

### 0072 — `.ai/task-cards/TASK-008-clean-feature-wrappers.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `01b3585e41`
- **Estado:** `completo`

```markdown
# TASK-008 — Limpiar wrappers de features/lab

## Objetivo

Reducir archivos triviales en `src/features/pdfcomponent` sin tocar runtime.

## Archivos candidatos

``​`txt
src/features/pdfcomponent/*
src/features/pdfcomponent/ui/primitives.jsx
src/features/pdfcomponent/domain/*
src/features/pdfcomponent/examples/*
``​`

## Reglas

- Fusionar componentes <40 líneas sin estado.
- Eliminar reexports triviales.
- No duplicar canvas/toolbar/inspector.
- Mantener lab separado del runtime.

## Validación

Lab sigue cargando.
```

<a id="file-0073"></a>

### 0073 — `.ai/task-cards/TASK-009-designer-snapshot-roundtrip.md`

- **Lenguaje:** `markdown`
- **Líneas:** `25`
- **Tamaño original:** `0.4 KB`
- **SHA1 corto:** `b25a14b15c`
- **Estado:** `completo`

```markdown
# TASK-009 — Snapshot del diseñador roundtrip

## Objetivo

Guardar/importar conserva metadata del diseñador.

## Archivos candidatos

``​`txt
shared/snapshotAdapter.ts
shared/schemaMigration.ts
shared/schemaDesignerMeta.ts
shared/snapshot.ts
templates/createDefaultTemplate.ts
schemas/options/*
schemas/shared/schemaTypes.ts
``​`

## Validación

- documentId/pageNumber.
- ownerColor.
- groupId/optionId.
- selected values.
- geometry.
```

<a id="file-0074"></a>

### 0074 — `.ai/task-cards/TASK-010-commandbus-actions.md`

- **Lenguaje:** `markdown`
- **Líneas:** `32`
- **Tamaño original:** `0.5 KB`
- **SHA1 corto:** `8b2a75b752`
- **Estado:** `completo`

```markdown
# TASK-010 — CommandBus y acciones del diseñador

## Objetivo

Mutaciones mediante commandBus/selectionCommands.

## Acciones

- addGroupOption;
- delete;
- duplicate;
- copy/paste;
- align;
- distribute;
- transform;
- update property.

## Archivos candidatos

``​`txt
ui/commands/commandBus.ts
ui/commands/designerCommands.ts
selectionCommands.ts
schemaClipboard.ts
SelectionContextToolbar.tsx
CanvasContextMenu.tsx
canvasContextMenuActions.tsx
``​`

## Validación

Componentes visuales disparan comandos, no mutan directo.
```

<a id="file-0075"></a>

### 0075 — `reports/tailwind-migration/line-by-line-style-audit.md`

- **Lenguaje:** `markdown`
- **Líneas:** `227`
- **Tamaño original:** `21.6 KB`
- **SHA1 corto:** `d6e6a2c776`
- **Estado:** `completo`

```markdown
# Auditoría line-by-line — Migración CSS → Tailwind (SISAD-PDFME)

Fecha: 2026-07-08
Autor: arquitecto frontend (revisión Codex sobre código real)
Alcance: clasificación por bloque/selector de todas las hojas CSS reales del proyecto.

## Leyenda de acciones

| Acción | Significado |
|---|---|
| `MIGRATE_JSX` | Mover a `className` Tailwind directo en el componente JSX/TSX |
| `MIGRATE_BRIDGE` | Mover a `@apply` en `src/styles/sisad-tailwind-bridge.css` |
| `KEEP_LEGACY` | Mantener en CSS legacy (geometría, paper, transform, zoom, variables runtime, Ant, Moveable/Selecto) |
| `TOKENIZE` | Consolidar como variable/token (tokens.css o `tailwind.config.js`) |
| `DELETE_DUPLICATE` | Eliminar por duplicada / muerta / cubierta por regla equivalente |
| `SPLIT_RULE` | Dividir porque mezcla layout + visual + estado + geometría |
| `NEEDS_TASK_CARD` | Requiere task-card separada (riesgo alto: canvas/Moveable/Selecto/runtime) |

## Mapa de carga (grafo de imports real)

``​`
index.html         → /src/style.css           (@tailwind base/components/utilities)   ← DUPLICADO
src/main.jsx       → styles/tailwind.css       (@tailwind base/components/utilities)
                   → styles/sisad-tailwind-bridge.css
src/App.jsx        → features/pdfcomponent/labRoutes.css
ui/index.ts        → ui/styles/tokens.css
   & editor/index.ts  ui/styles/sisad-pdfme-runtime.css  →(@import) ui/styles/sisad-pdfme-global.css
                      ui/styles/canvas-interactions.css
(sin import)       → ui/styles/sisad-pdfme-demo.css       ← HUÉRFANO (no cargado)
``​`

**Hallazgos de infraestructura (críticos):**

1. **Doble emisión de Tailwind.** `index.html` enlaza `/src/style.css` (que emite `@tailwind base/components/utilities`) y además `main.jsx` importa `styles/tailwind.css` (idénticas 3 directivas). Tailwind se genera **dos veces**. → `DELETE_DUPLICATE` en `style.css` (neutralizado, `tailwind.css` queda como única fuente).
2. **`sisad-pdfme-demo.css` es huérfano** — no lo importa ningún módulo (solo aparece en `metadata/*` y en el script de migración). → `NEEDS_TASK_CARD` (borrar tras confirmación de owner; carga fuentes de Google que ya provee global.css).
3. **`sisad-pdfme-global.css` (6342 líneas, 173 KB) SÍ está activo**: se carga vía `@import './sisad-pdfme-global.css'` en la línea 1 de `sisad-pdfme-runtime.css`. No es código muerto.
4. **`@apply` en el bridge debe permanecer a nivel raíz (NO dentro de `@layer components`).** Verificado empíricamente: las reglas dentro de `@layer` son purgadas por Tailwind si el content-scanner no detecta la clase; muchos selectores del bridge dependen de clases generadas por el runtime en runtime/`data-*`. Top-level `@apply` se emite siempre (comportamiento actual, sin regresión).

---

## 1) `src/style.css` (3 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo | Destino |
|---|---:|---|---|---|---|
| `@tailwind base/components/utilities` | 1-3 | Config | `DELETE_DUPLICATE` | Duplica `styles/tailwind.css` importado por main.jsx → doble build de Tailwind | Neutralizado a comentario |

## 2) `src/styles/tailwind.css` (3 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo | Destino |
|---|---:|---|---|---|---|
| `@tailwind base/components/utilities` | 1-3 | Config | `KEEP_LEGACY` | Única entrada Tailwind canónica (main.jsx). preflight off vía config | — |

## 3) `src/styles/sisad-tailwind-bridge.css` (157 líneas)

| Selector/Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-root`, `-page`, `-grid`, `-workspace` | 14-28 | B Layout | `MIGRATE_BRIDGE` (hecho) | Layout puro flex/overflow seguro. **Ojo**: `bg-slate-50/900` hardcode en vez de token `bg-sisad-bg` → mejorar a token |
| `.sisad-pdfme-designer-*` root/workspace/stage/canvas | 30-49 | B Layout | `MIGRATE_BRIDGE` (hecho) | flex/min-0/overflow seguro |
| `.sisad-pdfme-ui-control-bar*` cluster/pill/summary | 51-88 | D Chrome | `MIGRATE_BRIDGE` (hecho, parcial) | inline-flex/border/bg/blur OK. Posiciones `top-2/left-1/2/-translate-x-1/2` son seguras (no dependen de coord. runtime) |
| `.sisad-pdfme-designer-left-sidebar*` | 90-116 | E Sidebars | `MIGRATE_BRIDGE` (hecho) | visual/typography seguro. Ancho colapsado permanece en legacy |
| `.sisad-pdfme-option-group-*[data-render-mode]` | 118-137 | I Option groups | `MIGRATE_BRIDGE` (hecho) | Preserva `data-render-mode`/`data-option-labels` |
| `.sisad-pdfme-lab-results-drawer*` | 139-157 | K Lab | `MIGRATE_BRIDGE` (hecho) | drawer visual. `fixed`/`top` geometría queda en labRoutes.css |

**Acción aplicada:** reorganizado en secciones comentadas (A–K) sin `@layer` (decisión de purga). Tokens `bg-sisad-*` preferidos sobre `slate` hardcode donde es seguro.

## 4) `src/sisad-pdfme/ui/styles/tokens.css` (374 líneas) — categoría A

| Bloque | Líneas | Acción | Motivo |
|---|---:|---|---|
| COLOR PALETTE (`--color-*`) | 4-197 | `KEEP_LEGACY` + `TOKENIZE` | Fuente de verdad. Semánticos `--sisad-editor-*` ya mapeados en `tailwind.config.js` (`colors.sisad.*`) |
| SPACING / RADIUS / TYPOGRAPHY | 198-244 | `KEEP_LEGACY` | Escala interna del diseñador. Radius ya mapeado (`rounded-sisad-*`) |
| SHADOW / Z-INDEX / TRANSITION / BLUR | 246-289 | `KEEP_LEGACY` | Shadow mapeado (`shadow-sisad-*`). z-index runtime |
| Dark theme legacy | 291-302 | `NEEDS_TASK_CARD` | Verificar uso real antes de tocar |
| **RUNTIME/PDFME LAYOUT TOKENS** (`--sisad-pdfme-rs-width`, `-ls-width`, `-chrome-z`, `-chrome-height`, `-stage-*`, `-paper-*` implícitos) | 304-334 | `KEEP_LEGACY` (prohibido migrar) | Geometría de paper/sidebars/chrome. Runtime lee estas variables |
| INTERACTION TOKENS (`--moveable-color`, `--schema-tone`, `--wix-*`) | 339-353 | `KEEP_LEGACY` | Moveable/overlays/timing |
| SISAD EDITOR SEMANTIC TOKENS | 355-373 | `KEEP_LEGACY` (fuente de `colors.sisad`) | Puente tokens↔Tailwind. **No** convertir a clases estáticas |

**Veredicto tokens.css: 0 eliminaciones, 0 migraciones a className. Se mantiene íntegro.** El único trabajo de tokenización es ampliar el mapeo en `tailwind.config.js` si se requieren nuevas utilidades (spacing/typography) — task-card opcional.

## 5) `src/features/pdfcomponent/labRoutes.css` (1430 líneas) — categoría K (Lab)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-lab-landing/-page` base + gradientes | 1-35 | K/C | `SPLIT_RULE` → `KEEP_LEGACY` geometría | `min-height:100vh`, `padding clamp()`, radial-gradients, vars `--sisad-pdfme-z-*`, `isolation`. Gradientes multi-capa no valen la pena en `@apply` |
| `.sisad-pdfme-lab-editor-shell/-topbar/-debug` | 37-49 | B Layout | `MIGRATE_JSX` | grid/gap/padding triviales |
| Cards compartidas (hero/toolbar/results/workspace/card) borde+bg+blur | 53-64 | K Visual | `MIGRATE_BRIDGE` | Superficie glassmorphism reutilizable → clase bridge `sisad-pdfme-lab-surface` |
| `.sisad-pdfme-lab-hero` + `[data-density='compact']` | 66-112 | K/L | `SPLIT_RULE` | Layout grid → JSX; `z-index: var(--z-header)` y density-attrs → KEEP |
| `.sisad-pdfme-lab-page-details*` | 114-139 | K Visual | `MIGRATE_JSX` | `<details>` visual + `::-webkit-details-marker` KEEP (pseudo no soportado por @apply) |
| `.sisad-pdfme-lab-page-topbar/-copy/-kicker/h1` | 141-183 | K/B | `SPLIT_RULE` | grid-template-columns con `minmax/fr` → KEEP; typografía → JSX; `clamp()` en h1 → KEEP |
| `.sisad-pdfme-lab-page-rail/-context` | 185-199 | B Layout | `MIGRATE_JSX` | flex/grid seguro |
| `.sisad-pdfme-lab-workspace[data-ux-mode=canvas-first] .section-heading` (sr-only) | 201-211 | B | `MIGRATE_JSX` | patrón `sr-only` de Tailwind exacto → usar `sr-only` |
| `.sisad-pdfme-lab-page-actions*` | 213-256 | K Visual | `MIGRATE_JSX` | flex/pill visual |
| Métricas (`-hero-summary/-metrics/-metric`) scroll-x | 258-318 | K Visual | `SPLIT_RULE` | flex + `scrollbar-width:none` + `::-webkit-scrollbar` KEEP; gradiente card → bridge |
| Colaboración (`-collaboration-*`) barra/chips/select | 320-444 | K Visual | `MIGRATE_JSX` (parcial) | grid/flex/pills. `::-webkit-details-marker` KEEP |
| Chip buttons + tonos (`-chip-button`, `-chip-tone-*`) | 446-501 | K Visual | `MIGRATE_JSX` | Tonos = paleta fija → utilidades Tailwind arbitrary o clases tono. transición KEEP simple |
| Cards de catálogo lab (`-card*`, hover, `::before`) | 503-687 | K/L | `SPLIT_RULE` | Layout → JSX; `::before` overlay + hover transform → KEEP (animación) |
| Toolbar lab (`-toolbar*`) | 689-703 | K | `MIGRATE_JSX` | grid/flex |
| CompactControls (`-compact-controls*`, `-compact-icon-button`) | 693-723 | D/K | `MIGRATE_JSX` | botones icon 32px, estados hover/active |
| **Popover** (`-popover*` panel/section/item/grid) | 725-889 | K/D | `SPLIT_RULE` | `position:absolute; top:42px; right:0; z-index:var(--z-popover)` KEEP; interior visual → JSX/bridge |
| Controles lab (`-control-group/-label/-select/-button/-status`) | 891-950 | K Visual | `MIGRATE_JSX` | inputs/botones visuales |
| Image grid | 952-977 | B/K | `MIGRATE_JSX` | grid auto-fit |
| **Workspace/canvas shell** (`-workspace`, `-canvas-shell`, `-runtime-host`) | 979-1012 | C Canvas | `KEEP_LEGACY` | `min-height: clamp(30rem,72vh,56rem)`, overflow, canvas host. **Geometría — no migrar** |
| Results (`-results*` summary/body/badge) | 1014-1057 | K Visual | `SPLIT_RULE` | visual → JSX; `[open]` state + `::-webkit-details-marker` KEEP |
| Advanced tools `<details>` | 1059-1090 | K Visual | `MIGRATE_JSX` | visual |
| `@media (max-width:900px / 640px)` | 1092-1244 | B/K Responsive | `KEEP_LEGACY` (o MIGRATE_JSX con `md:`/`sm:`) | Media queries complejas; migración a breakpoints Tailwind = task-card |
| **TASK-LAB-001 canvas-first shell** (`[data-ux-mode='canvas-first']` 100dvh grid) | 1246-1276 | C Canvas | `KEEP_LEGACY` (crítico) | `height:100dvh`, `grid-template-rows: auto 1fr`, geometría canvas-first. **No migrar** |
| **TASK-LAB-002 results drawer** (`-results-drawer` fixed) | 1278-1364 | K/C | `SPLIT_RULE` → `KEEP_LEGACY` posición | `position:fixed; top:calc(var(--lab-topbar-height)+…)`, `pointer-events` KEEP; skin visual → bridge (ya en bridge) |
| Compact header hide rules `[data-density='compact'] … {display:none}` | 1366-1376 | K State | `KEEP_LEGACY` | Estado por data-attr, se resuelve mejor en CSS |
| Collaboration popovers compact + recipient-dot/option/status-list | 1378-1430 | K Visual | `MIGRATE_JSX` | visual; `recipient-dot` color viene por style inline (owner color) → no tocar |

**Resumen labRoutes:** ~55 bloques. Geometría canvas-first / drawer / canvas-shell / media queries = KEEP. El resto es visual migrable a JSX/bridge de forma incremental (task-cards LAB por sección para permitir validación visual por ruta).

## 6) `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` (391 líneas, sin contar el @import)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `@import './sisad-pdfme-global.css'` | 1 | infra | `KEEP_LEGACY` | Punto de carga real de global.css |
| Left-sidebar density grids (`[data-left-sidebar-density]` rich/compact/mini) | 3-32 | E Sidebars | `KEEP_LEGACY` | `grid-template-columns`/gap por densidad = geometría de layout condicional |
| List-view density (`-list-view-*`, `[data-list-density]`) | 34-104 | F Inspector | `SPLIT_RULE` | min-w/overflow/ellipsis → bridge; dimensiones px por densidad → KEEP |
| Detail header density (`[data-detail-header-density]`) | 106-119 | F | `KEEP_LEGACY` | estado por data-attr |
| Right-sidebar density switcher | 121-159 | E | `KEEP_LEGACY` | dimensiones/gap por densidad |
| Inspector summary/metric chips | 161-251 | F Inspector | `MIGRATE_BRIDGE` (mayoría) | flex/gap/ellipsis/pill; `.ant-tag`/`.ant-btn` overrides → KEEP (Ant) |
| Left-sidebar dock header/recipient/control-band | 253-346 | E/G | `SPLIT_RULE` | typography/pill → bridge; `owner color` via var → KEEP |
| Stage typography scaling (`.sisad-pdfme-designer-stage …`) | 348-384 | E/F | `MIGRATE_BRIDGE` | font-size overrides; `.ant-input/.ant-select-selector` → KEEP |
| `[data-left-sidebar-variant='compact'] .control-bar { --chrome-height }` | 385-391 | D | `KEEP_LEGACY` | fija variable de chrome (geometría) |

## 7) `src/sisad-pdfme/ui/styles/canvas-interactions.css` (1509 líneas) — categorías C/D/N/L

Contadores: `transform` 45, `translate3d` 8, `scale()` 21, `position:fixed` 3, `position:absolute` 17, `z-index` 14, `pointer-events` 26, `moveable` 1.

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| Cabecera + drag preview/placeholder base | 1-311 | C/N | `KEEP_LEGACY` | `transform: translate3d`, fixed positioning, pointer-events, overlays. **Prohibido migrar** |
| Selection Context Toolbar + micro pill | 312-658 | D Chrome | `SPLIT_RULE` | skin visual (bg/border/radius/shadow) → bridge; `position/transform/z-index` KEEP |
| Inline Metrics | 659-674 | D | `MIGRATE_BRIDGE` | badge visual |
| Inline Edit Overlay | 675-779 | C/N | `KEEP_LEGACY` | overlay de edición sobre coordenadas |
| Snap Feedback | 780-806 | C | `KEEP_LEGACY` | feedback de snap (geometría) |
| Control bar phase states | 807-827 | L/N | `KEEP_LEGACY` | interaction-phase por data-attr |
| Schema Interaction Affordances/Details (hover/active/outline) | 828-957 | C/N | `KEEP_LEGACY` | outline/`schema-tone`, hit-testing visual. **No z-index arbitrario** |
| Interaction/Hover overlays | 958-982 | C/N | `KEEP_LEGACY` | overlays owner-color aware |
| Caption Badge | 983-1060 | D | `SPLIT_RULE` | skin badge → bridge; visibilidad por estado KEEP |
| Schema mini-toolbar | 1061-1148 | D | `SPLIT_RULE` | skin → bridge; posición sobre field KEEP |
| Span Auto Helper | 1124-1148 | B | `MIGRATE_BRIDGE` | helper de layout |
| Canvas Context Menu | 1149-1386 | D | `SPLIT_RULE` | menú flotante: skin → bridge; `position/z-index` KEEP |
| SelectionContextToolbar refinamiento + micro | 1387-1485 | D | `SPLIT_RULE` | idem |
| Option group floating action (botón +) + hide en drag/transform | 1486-1509 | I/N | `KEEP_LEGACY` | Botón `+` NO debe ser target Moveable/Selecto; oculto en drag/transform. **Crítico negocio** |

**Veredicto:** núcleo (overlays/transform/drag/drop/snap/schema affordances/botón +) = KEEP. Solo los *skins* de toolbars/badges/menús flotantes son migrables → task-card con validación de que no cambia hit-testing.

## 8) `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` (6342 líneas) — TODAS las categorías

Clasificación por sección (comentarios reales del archivo). Contadores clave: `transform: scale` 17, `data-canvas-page` 13, `data-paper` 6, `moveable`/`selecto` 9 c/u, `@keyframes` 14, `ant-` 95.

| Sección | Líneas aprox | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `.sisad-pdfme-root` aliases + `box-sizing` reset scoped | 4-46 | A/M | `KEEP_LEGACY` | Aliases de variables + `box-sizing` **scoped** (no global reset → OK) |
| Schema field chrome tokens (`--sisad-schema-*`) | 22-31 | A/H | `KEEP_LEGACY`/`TOKENIZE` | Tokens de chrome de campo (owner color, radius) |
| RadioGroup/CheckboxGroup compacto + botón + | ~694-781 | I Option groups | `KEEP_LEGACY` | Botón `+` `data-role`, celdas dibujadas por plugin. No romper |
| Zoom select compact | 782-988 | D | `SPLIT_RULE` | skin → bridge; Ant select KEEP |
| Tab list icon-only pills + accent | 989-1099 | E/L | `SPLIT_RULE` | skin → bridge; accent line/keyframe KEEP |
| Chip filters | 1100-1234 | G | `MIGRATE_BRIDGE` | pills uniformes |
| Compact mode 2-col + compact card tile + icon/label | 1235-1554 | G Catálogo | `SPLIT_RULE` | layout tile → bridge; `data-view-mode`/`data-schema-*` + owner color KEEP |
| Favorite toggle (estrella) | 1555-1863 | G | `SPLIT_RULE` | skin → bridge; toggle state KEEP |
| Sidebar toggle button base + left | 1864-2131 | E | `SPLIT_RULE` | skin → bridge; ancho colapsado/transform KEEP |
| Ant grid gutters reset + compact ant-form-item | 2132-2286 | M Ant | `KEEP_LEGACY` | Compatibilidad Ant Design |
| Position indicator / overflow badge | 2287-2605 | F | `MIGRATE_BRIDGE` | badges/chips |
| Ant-collapse overrides (schema config) | 2606-3352 | M/F | `KEEP_LEGACY` | Ant compat de alta especificidad |
| Left sidebar compact variant (DocuSign-like) + breakpoints | 3353-3517 | E | `KEEP_LEGACY` | densidad/breakpoints de layout |
| Compact catalog neutraliza owner colors inline | 3518-3568 | G | `KEEP_LEGACY` | interactúa con estilos inline del runtime |
| Compact stage harmonization | 3569-3745 | E/D | `SPLIT_RULE` | skin → bridge; densidad KEEP |
| List view item structure | 3746-3897 | F | `SPLIT_RULE` | estructura flex → bridge; `.ant-btn` dims KEEP |
| Canvas empty state title/hint | 3882-3897 | K | `MIGRATE_BRIDGE` | typografía |
| Documents rail (Header/Empty/Item list) | 3898-4155 | E | `SPLIT_RULE` | skin → bridge; `.ant-btn` specificity KEEP |
| **Global Keyframes** (14 `@keyframes`) | 4161-4302 | L Animaciones | `KEEP_LEGACY` | No eliminar sin buscar referencias; usados por animaciones sidebar/tabs |
| Right sidebar entrance + panel switcher + ripple + active slide | 4303-4460 | E/L | `KEEP_LEGACY` | Animaciones dependientes de estado |
| Detail header card premium + stat cells + context strip | 4461-4722 | F | `SPLIT_RULE` | skin → bridge; animaciones KEEP |
| Section cards staggered + head/body reveal | 4723-4847 | F/L | `KEEP_LEGACY` | animación stagger `nth-child` |
| Align widget / button group / color picker | 4848-5070 | F | `SPLIT_RULE` | grid/skin → bridge; interacción KEEP |
| Schema config widget animations | 5071-5168 | F/L | `KEEP_LEGACY` | animaciones |
| Form fields right sidebar (input focus/stepper/select/checkbox) | 5169-5226 | F/M | `KEEP_LEGACY` | Ant inputs + focus states |
| Right sidebar scrollbar refinement | 5227-5252 | E | `KEEP_LEGACY` | `::-webkit-scrollbar` (pseudo no @apply) |
| Left sidebar toggle / control bar transitions / draggable hover lift | 5253-5341 | D/E/L | `KEEP_LEGACY` | transiciones + transform hover |
| Reduced motion overrides | 5342-5376 | L | `KEEP_LEGACY` | `@media (prefers-reduced-motion)` |
| Compact detail refinements 1-11 (panel switcher, header, section, align, formatter, color, layout) | 5377-5683 | F | `KEEP_LEGACY` | densidad de layout de alta especificidad |
| Reduced-motion additions | 5684-5845 | L | `KEEP_LEGACY` | idem |
| **Schema shared visual chrome** | 5846-5916 | H Field chrome | `NEEDS_TASK_CARD` | Interactúa con `fieldChrome.ts`. Migrar rounded/border/bg pero **preservar** owner color/positioning |
| **Field chrome — generic + FieldChromePolicy (mode-scoped)** TASK-012 | 5917-6016 | H/J | `KEEP_LEGACY` | Modo `form/viewer/pdf`, readonly, invalid. owner tint via var. **No tocar x/y/rotation/required/readonly** |
| text-like by render mode TASK-014 | 6017-6038 | H/J | `KEEP_LEGACY` | modo-específico |
| Option editor widget (propPanel) | 6039-6149 | I | `SPLIT_RULE` | skin editor → bridge; checkbox indicator KEEP |
| **Option group schema root** (reemplaza Object.assign de checkbox/radioGroup) | 6150-6272 | I Option groups | `KEEP_LEGACY` (crítico) | Sizing marker stack, `data-option-id`, marker-only groups, oculta texto en runtime. **Preservar selectedOptionIds/options/groupId** |
| Select propPanel editor | 6273-6295 | I | `SPLIT_RULE` | skin → bridge |
| Note schema (informative) | 6296-6321 | J Runtime | `SPLIT_RULE` | skin → bridge; modo KEEP |
| Attachment schema (dashed border) | 6322-6342 | J Runtime | `SPLIT_RULE` | skin → bridge; input nativo/UI propia KEEP |

**Veredicto global.css:** el archivo mezcla masivamente skin (migrable) con geometría/estado/Ant/animaciones/chrome de campo (KEEP). La migración segura es **por sección con validación visual por ruta**, no en bloque. La reducción de duplicidad real está en los *skins* de sidebars/inspector/badges/toolbars. Todo lo relativo a paper, `data-canvas-page`, `transform: scale`, Moveable/Selecto, botón `+`, field-chrome por modo y option-group root = **KEEP_LEGACY**.

## 9) `src/sisad-pdfme/ui/styles/sisad-pdfme-demo.css` (65 líneas)

| Bloque | Líneas | Categoría | Acción | Motivo |
|---|---:|---|---|---|
| `@import` Google Fonts + tokens | 1-2 | infra | `DELETE_DUPLICATE` | Archivo huérfano (no importado). Fuentes ya en global.css |
| `body`, `.app-shell`, `.main-nav*` | 4-66 | O Muertas | `NEEDS_TASK_CARD` | No referenciado en JSX/TSX activo. Confirmar con owner antes de borrar el archivo completo |

---

## Resumen cuantitativo

| Acción | Bloques (aprox) |
|---|---:|
| `MIGRATE_JSX` | ~18 (lab) |
| `MIGRATE_BRIDGE` | ~16 |
| `KEEP_LEGACY` | ~48 (geometría/paper/Ant/Moveable/Selecto/animaciones/chrome/option-root) |
| `TOKENIZE` | tokens.css íntegro + mapeo config (~2) |
| `DELETE_DUPLICATE` | 3 (style.css, demo @import, doble Tailwind) |
| `SPLIT_RULE` | ~22 |
| `NEEDS_TASK_CARD` | 6 (demo.css, dark tokens, field-chrome shared, canvas-interactions skins, global skins por sección, labRoutes media→breakpoints) |

**Total bloques/selectores-grupo analizados: ~115** distribuidos en 9 archivos.

## Task-cards derivadas (para ejecución con validación visual)

- **TC-CSS-01** — Migrar skins de `labRoutes.css` a JSX/bridge por sección (header, popover, cards, controls) validando `/lab/multi-document-routing`. Mantener canvas-first/drawer/media geometría.
- **TC-CSS-02** — Migrar skins de sidebars/inspector en `global.css` a bridge (`@apply`), validando densidades y Ant compat.
- **TC-CSS-03** — Migrar skins de toolbars/badges/menús flotantes en `canvas-interactions.css` verificando que hit-testing, overlays y botón `+` no cambian.
- **TC-CSS-04** — Field chrome shared (`global.css` 5846-5916 + `fieldChrome.ts`): rounded/border/bg a Tailwind preservando owner color, x/y, required/readonly. Validar Form/Viewer/PDF.
- **TC-CSS-05** — Confirmar y eliminar `sisad-pdfme-demo.css` + dark tokens legacy no usados.
- **TC-CSS-06** — Migrar `@media` de labRoutes a breakpoints Tailwind (`sm:`/`md:`) — opcional, cosmético.
```

<a id="file-0076"></a>

### 0076 — `reports/tailwind-migration/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `4.6 KB`
- **SHA1 corto:** `61e9dcef41`
- **Estado:** `completo`

```markdown
# Tailwind Migration Report

Fecha: 2026-07-08T16:17:36.008Z
Modo: apply
Root: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

## Objetivo

Migración incremental de diseños a Tailwind preservando comportamiento, canvas, geometría, Moveable, Selecto, snapshot y metadata.

## Archivos creados/actualizados

- backup package.json -> .tailwind-migration-backups/20260708-111736/package.json
- update package.json
- unchanged src/main.jsx
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- backup reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css -> .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
- update reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css

## Candidatos CSS generados

- src/sisad-pdfme/ui/styles/tokens.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
  - bloques convertidos: 0
  - declaraciones manuales/unsupported: 0
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
  - bloques convertidos: 772
  - declaraciones manuales/unsupported: 1814
- src/sisad-pdfme/ui/styles/canvas-interactions.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
  - bloques convertidos: 176
  - declaraciones manuales/unsupported: 508
- src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
  - bloques convertidos: 65
  - declaraciones manuales/unsupported: 88
- src/features/pdfcomponent/labRoutes.css → reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
  - bloques convertidos: 203
  - declaraciones manuales/unsupported: 435

## Advertencias

- tailwind.config.js ya existe; revisa manualmente que tenga content y preflight:false.
- postcss.config.js ya existe; revisa manualmente que tenga tailwindcss y autoprefixer.
- No se sobrescribió src/styles/tailwind.css; ya existe.
- No se sobrescribió src/styles/sisad-tailwind-bridge.css; ya existe.

## Próximo paso recomendado

1. Ejecutar la app y validar /lab/multi-document-routing.
2. Comparar visualmente Designer, Form, Viewer y PDF.
3. Migrar por task-card, no todo de golpe.
4. Mantener classNames existentes hasta que Playwright confirme comportamiento.
5. No reemplazar reglas de canvas, Moveable, Selecto ni geometría por Tailwind sin evidencia.

## Validación manual mínima

- Designer mantiene grid, sidebars, toolbar, zoom y selección.
- Form/Viewer siguen filtrando por recipient activo.
- CheckboxGroup/RadioGroup no muestran labels técnicos no deseados.
- Attachment, image, svg, barcode y table conservan comportamiento.
- Página 2+ conserva coordenadas, overlays y toolbar.
- PDF generado no imprime chrome/fondos no deseados.

## Archivos que NO deben tocarse solo por diseño

- Moveable.tsx
- Selecto.tsx
- designerCoordinateService.ts
- schemaCollision.ts
- snapshotAdapter.ts
- generator/pdf-lib
```

<a id="file-0077"></a>

### 0077 — `test-results/standard-fields-standard-f-c4dc3-s-the-expected-schema-types-chromium/error-context.md`

- **Lenguaje:** `markdown`
- **Líneas:** `576`
- **Tamaño original:** `28.7 KB`
- **SHA1 corto:** `8d1e443f41`
- **Estado:** `completo`

```markdown
# Page snapshot

``​`yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]: Lab
          - generic [ref=e9]: Diseñador
        - heading "Multidocumento integral" [level=1] [ref=e10]
      - button "Controles" [ref=e15]:
        - img [ref=e17]
        - text: Controles
    - region "Colaboración del ejemplo" [ref=e20]:
      - generic "Colaboración" [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: Usuario
          - combobox "Seleccionar usuario activo" [ref=e24]:
            - option "Cliente Principal" [selected]
            - option "Avalista"
            - option "Mesa de entrega"
        - button "Usuario activo" [ref=e26]
        - button "Estado" [ref=e28]
  - region "Canvas" [ref=e29]:
    - generic [ref=e30]:
      - heading "Canvas" [level=2] [ref=e31]
      - paragraph [ref=e32]:
        - text: La superficie de edición se monta dentro del runtime de
        - code [ref=e33]: sisad-pdfme
        - text: .
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - button "Cerrar catálogo de campos" [expanded] [ref=e40] [cursor=pointer]:
            - img [ref=e41]
          - generic [ref=e45]:
            - generic [ref=e46]:
              - generic [ref=e47]: Diseñador
              - generic [ref=e48]:
                - generic [ref=e49]: Campos
                - 'generic "Color del destinatario activo #2563EB" [ref=e50]'
            - generic [ref=e51]:
              - tablist "Tipos de campo" [ref=e52]:
                - tab "Campos estándar" [selected] [ref=e53] [cursor=pointer]:
                  - img [ref=e54]
                - tab "Campos personalizados" [ref=e56] [cursor=pointer]:
                  - img [ref=e57]
                - tab "Herramientas de prerrellenado" [ref=e60] [cursor=pointer]:
                  - img [ref=e61]
              - generic [ref=e64]:
                - generic [ref=e65]:
                  - img [ref=e67]
                  - textbox "Buscar campos" [ref=e70]
                - generic [ref=e72]:
                  - button "Todos" [ref=e73] [cursor=pointer]:
                    - generic [ref=e74]: Todos
                  - button "Favoritos (0)" [ref=e75] [cursor=pointer]:
                    - generic [ref=e76]: Favoritos (0)
                  - button "Recientes (0)" [ref=e77] [cursor=pointer]:
                    - generic [ref=e78]: Recientes (0)
                  - button "Vista detalle (lista)" [ref=e79] [cursor=pointer]:
                    - img [ref=e81]
            - generic [ref=e82]:
              - generic [ref=e83]:
                - button "Alternar categoría Firmas" [expanded] [ref=e84] [cursor=pointer]:
                  - generic [ref=e85]: Firmas
                  - generic [ref=e86]: "3"
                - generic [ref=e87]:
                  - generic [ref=e90]:
                    - button "Datesigned" [ref=e91]:
                      - generic "Datesigned" [ref=e93]:
                        - img [ref=e94]
                      - generic [ref=e98]: Datesigned
                    - button "Marcar favorito": ★
                  - generic [ref=e101]:
                    - button "Initials" [ref=e102]:
                      - generic "Initials" [ref=e104]:
                        - img [ref=e105]
                      - generic [ref=e108]: Initials
                    - button "Marcar favorito": ★
                  - generic [ref=e111]:
                    - button "Firma" [ref=e112]:
                      - generic "Firma" [ref=e114]:
                        - img [ref=e115]
                      - generic [ref=e118]: Firma
                    - button "Marcar favorito": ★
              - generic [ref=e119]:
                - button "Alternar categoría Texto" [expanded] [ref=e120] [cursor=pointer]:
                  - generic [ref=e121]: Texto
                  - generic [ref=e122]: "2"
                - generic [ref=e123]:
                  - generic [ref=e126]:
                    - button "Número Número" [ref=e127]:
                      - generic "Número" [ref=e128]
                      - generic [ref=e130]: Número
                    - button "Marcar favorito": ★
                  - generic [ref=e133]:
                    - button "Texto" [ref=e134]:
                      - generic "Texto" [ref=e136]:
                        - img [ref=e137]
                      - generic [ref=e143]: Texto
                    - button "Marcar favorito": ★
              - generic [ref=e144]:
                - button "Alternar categoría Imagen y medios" [expanded] [ref=e145] [cursor=pointer]:
                  - generic [ref=e146]: Imagen y medios
                  - generic [ref=e147]: "2"
                - generic [ref=e148]:
                  - generic [ref=e151]:
                    - button "Imagen" [ref=e152]:
                      - generic "Imagen" [ref=e154]:
                        - img [ref=e155]
                      - generic [ref=e160]: Imagen
                    - button "Marcar favorito": ★
                  - generic [ref=e163]:
                    - button "SVG" [ref=e164]:
                      - generic "SVG" [ref=e166]:
                        - img [ref=e167]
                      - generic [ref=e172]: SVG
                    - button "Marcar favorito": ★
              - generic [ref=e173]:
                - button "Alternar categoría Selecciones" [expanded] [ref=e174] [cursor=pointer]:
                  - generic [ref=e175]: Selecciones
                  - generic [ref=e176]: "4"
                - generic [ref=e177]:
                  - generic [ref=e180]:
                    - button "Casilla" [ref=e181]:
                      - generic "Casilla" [ref=e183]:
                        - img [ref=e184]
                      - generic [ref=e188]: Casilla
                    - button "Marcar favorito": ★
                  - generic [ref=e191]:
                    - button "Grupo de Casillas" [ref=e192]:
                      - generic "Grupo de Casillas" [ref=e194]:
                        - img [ref=e195]
                      - generic [ref=e199]: Grupo de Casillas
                    - button "Marcar favorito": ★
                  - generic [ref=e202]:
                    - button "Opción" [ref=e203]:
                      - generic "Opción" [ref=e205]:
                        - img [ref=e206]
                      - generic [ref=e210]: Opción
                    - button "Marcar favorito": ★
                  - generic [ref=e213]:
                    - button "Lista Desplegable" [ref=e214]:
                      - generic "Lista Desplegable" [ref=e216]:
                        - img [ref=e217]
                      - generic [ref=e220]: Lista Desplegable
                    - button "Marcar favorito": ★
              - generic [ref=e221]:
                - button "Alternar categoría Fecha y Hora" [expanded] [ref=e222] [cursor=pointer]:
                  - generic [ref=e223]: Fecha y Hora
                  - generic [ref=e224]: "3"
                - generic [ref=e225]:
                  - generic [ref=e228]:
                    - button "Fecha" [ref=e229]:
                      - generic "Fecha" [ref=e231]:
                        - img [ref=e232]
                      - generic [ref=e235]: Fecha
                    - button "Marcar favorito": ★
                  - generic [ref=e238]:
                    - button "Fecha Y Hora" [ref=e239]:
                      - generic "Fecha Y Hora" [ref=e241]:
                        - img [ref=e242]
                      - generic [ref=e247]: Fecha Y Hora
                    - button "Marcar favorito": ★
                  - generic [ref=e250]:
                    - button "Hora" [ref=e251]:
                      - generic "Hora" [ref=e253]:
                        - img [ref=e254]
                      - generic [ref=e258]: Hora
                    - button "Marcar favorito": ★
              - generic [ref=e259]:
                - button "Alternar categoría QR y Códigos" [expanded] [ref=e260] [cursor=pointer]:
                  - generic [ref=e261]: QR y Códigos
                  - generic [ref=e262]: "12"
                - generic [ref=e263]:
                  - generic [ref=e266]:
                    - button "Código de barras" [ref=e267]:
                      - generic "Código de barras" [ref=e269]:
                        - img [ref=e270]
                      - generic [ref=e272]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e275]:
                    - button "Código de barras" [ref=e276]:
                      - generic "Código de barras" [ref=e278]:
                        - img [ref=e279]
                      - generic [ref=e281]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e284]:
                    - button "Código de barras" [ref=e285]:
                      - generic "Código de barras" [ref=e287]:
                        - img [ref=e288]
                      - generic [ref=e290]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e293]:
                    - button "Código de barras" [ref=e294]:
                      - generic "Código de barras" [ref=e296]:
                        - img [ref=e297]
                      - generic [ref=e299]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e302]:
                    - button "DataMatrix" [ref=e303]:
                      - generic "DataMatrix" [ref=e305]:
                        - img [ref=e306]
                      - generic [ref=e308]: DataMatrix
                    - button "Marcar favorito": ★
                  - generic [ref=e311]:
                    - button "Código de barras" [ref=e312]:
                      - generic "Código de barras" [ref=e314]:
                        - img [ref=e315]
                      - generic [ref=e317]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e320]:
                    - button "Japan Post" [ref=e321]:
                      - generic "Japan Post" [ref=e323]:
                        - img [ref=e324]
                      - generic [ref=e326]: Japan Post
                    - button "Marcar favorito": ★
                  - generic [ref=e329]:
                    - button "NW7" [ref=e330]:
                      - generic "NW7" [ref=e332]:
                        - img [ref=e333]
                      - generic [ref=e335]: NW7
                    - button "Marcar favorito": ★
                  - generic [ref=e338]:
                    - button "PDF417" [ref=e339]:
                      - generic "PDF417" [ref=e341]:
                        - img [ref=e342]
                      - generic [ref=e344]: PDF417
                    - button "Marcar favorito": ★
                  - generic [ref=e347]:
                    - button "Código QR" [ref=e348]:
                      - generic "Código QR" [ref=e350]:
                        - img [ref=e351]
                      - generic [ref=e358]: Código QR
                    - button "Marcar favorito": ★
                  - generic [ref=e361]:
                    - button "Código de barras" [ref=e362]:
                      - generic "Código de barras" [ref=e364]:
                        - img [ref=e365]
                      - generic [ref=e367]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e370]:
                    - button "Código de barras" [ref=e371]:
                      - generic "Código de barras" [ref=e373]:
                        - img [ref=e374]
                      - generic [ref=e376]: Código de barras
                    - button "Marcar favorito": ★
              - generic [ref=e377]:
                - button "Alternar categoría Estructura" [expanded] [ref=e378] [cursor=pointer]:
                  - generic [ref=e379]: Estructura
                  - generic [ref=e380]: "4"
                - generic [ref=e381]:
                  - generic [ref=e384]:
                    - button "Óvalo" [ref=e385]:
                      - generic "Óvalo" [ref=e387]:
                        - img [ref=e388]
                      - generic [ref=e391]: Óvalo
                    - button "Marcar favorito": ★
                  - generic [ref=e394]:
                    - button "Línea" [ref=e395]:
                      - generic "Línea" [ref=e397]:
                        - img [ref=e398]
                      - generic [ref=e400]: Línea
                    - button "Marcar favorito": ★
                  - generic [ref=e403]:
                    - button "Rectángulo" [ref=e404]:
                      - generic "Rectángulo" [ref=e406]:
                        - img [ref=e407]
                      - generic [ref=e410]: Rectángulo
                    - button "Marcar favorito": ★
                  - generic [ref=e413]:
                    - button "Tabla" [ref=e414]:
                      - generic "Tabla" [ref=e416]:
                        - img [ref=e417]
                      - generic [ref=e420]: Tabla
                    - button "Marcar favorito": ★
              - generic [ref=e421]:
                - button "Alternar categoría Acción" [expanded] [ref=e422] [cursor=pointer]:
                  - generic [ref=e423]: Acción
                  - generic [ref=e424]: "4"
                - generic [ref=e425]:
                  - generic [ref=e428]:
                    - button "Approve" [ref=e429]:
                      - generic "Approve" [ref=e431]:
                        - img [ref=e432]
                      - generic [ref=e436]: Approve
                    - button "Marcar favorito": ★
                  - generic [ref=e439]:
                    - button "Attachment" [ref=e440]:
                      - generic "Attachment" [ref=e442]:
                        - img [ref=e443]
                      - generic [ref=e446]: Attachment
                    - button "Marcar favorito": ★
                  - generic [ref=e449]:
                    - button "Decline" [ref=e450]:
                      - generic "Decline" [ref=e452]:
                        - img [ref=e453]
                      - generic [ref=e458]: Decline
                    - button "Marcar favorito": ★
                  - generic [ref=e461]:
                    - button "Note" [ref=e462]:
                      - generic "Note" [ref=e464]:
                        - img [ref=e465]
                      - generic [ref=e469]: Note
                    - button "Marcar favorito": ★
              - generic [ref=e470]:
                - button "Alternar categoría Destinatario" [expanded] [ref=e471] [cursor=pointer]:
                  - generic [ref=e472]: Destinatario
                  - generic [ref=e473]: "4"
                - generic [ref=e474]:
                  - generic [ref=e477]:
                    - button "Company" [ref=e478]:
                      - generic "Company" [ref=e480]:
                        - img [ref=e481]
                      - generic [ref=e486]: Company
                    - button "Marcar favorito": ★
                  - generic [ref=e489]:
                    - button "Emailaddress" [ref=e490]:
                      - generic "Emailaddress" [ref=e492]:
                        - img [ref=e493]
                      - generic [ref=e497]: Emailaddress
                    - button "Marcar favorito": ★
                  - generic [ref=e500]:
                    - button "Fullname" [ref=e501]:
                      - generic "Fullname" [ref=e503]:
                        - img [ref=e504]
                      - generic [ref=e508]: Fullname
                    - button "Marcar favorito": ★
                  - generic [ref=e511]:
                    - button "Title" [ref=e512]:
                      - generic "Title" [ref=e514]:
                        - img [ref=e515]
                      - generic [ref=e519]: Title
                    - button "Marcar favorito": ★
        - generic [ref=e520]:
          - generic:
            - generic [ref=e522]:
              - generic "Editando" [ref=e523]
              - generic [ref=e524]: Doc · Pág 1/14
            - generic [ref=e526]:
              - button "Página anterior" [disabled] [ref=e527]:
                - generic:
                  - img
              - button "Pág 1/14" [ref=e528] [cursor=pointer]:
                - generic [ref=e529]: Pág 1/14
              - button "Página siguiente" [ref=e530] [cursor=pointer]:
                - img [ref=e532]
            - generic [ref=e535]:
              - button "Guardar" [ref=e536] [cursor=pointer]:
                - img [ref=e538]
                - generic [ref=e542]: Guardar
              - button "Más acciones" [ref=e543] [cursor=pointer]:
                - img [ref=e545]
            - generic [ref=e550]:
              - button "Deshacer" [ref=e551] [cursor=pointer]:
                - img [ref=e553]
              - button "Rehacer" [ref=e556] [cursor=pointer]:
                - img [ref=e558]
              - button "Ajustar página" [ref=e561] [cursor=pointer]:
                - img [ref=e563]
              - generic [ref=e568]:
                - button "Reducir zoom" [ref=e569] [cursor=pointer]:
                  - img [ref=e571]
                - generic [ref=e572] [cursor=pointer]:
                  - generic [ref=e574]:
                    - combobox [ref=e576]
                    - generic "100%" [ref=e577]
                  - generic:
                    - img:
                      - img
                - button "Aumentar zoom" [ref=e578] [cursor=pointer]:
                  - img [ref=e580]
          - button "Ocultar panel derecho" [pressed] [ref=e581]:
            - img [ref=e582]
          - complementary "Panel derecho del diseñador" [ref=e585]:
            - generic [ref=e586]:
              - tablist "Panel derecho" [ref=e588]:
                - tab "Abrir panel Campos" [selected] [ref=e589] [cursor=pointer]:
                  - img [ref=e592]
                - tab "Abrir panel Detalle" [disabled] [ref=e596]:
                  - img [ref=e599]
                - tab "Abrir panel Comentarios" [ref=e600] [cursor=pointer]:
                  - img [ref=e603]
                - tab "Abrir panel Docs" [ref=e605] [cursor=pointer]:
                  - img [ref=e608]
              - generic [ref=e612]:
                - generic [ref=e613]:
                  - generic [ref=e614]:
                    - generic [ref=e615]:
                      - generic [ref=e617]:
                        - strong [ref=e619]: Campos
                        - generic [ref=e621]: 11/11
                      - button "Renombrar" [ref=e624] [cursor=pointer]:
                        - generic [ref=e625]: Renombrar
                    - generic [ref=e626]:
                      - generic [ref=e627]:
                        - img [ref=e629]
                        - textbox "Buscar campo o nombre" [ref=e632]
                      - generic [ref=e635] [cursor=pointer]:
                        - generic [ref=e637]:
                          - combobox [ref=e639]
                          - generic "Todos los tipos" [ref=e640]
                        - generic:
                          - img:
                            - img
                  - separator [ref=e641]
                - generic "Lista de campos del documento" [ref=e642]:
                  - list [ref=e643]:
                    - listitem [ref=e644] [cursor=pointer]:
                      - button "contract_name" [ref=e645]
                      - generic [ref=e646]:
                        - button [ref=e647]:
                          - img [ref=e649]
                        - img [ref=e659]
                        - generic [ref=e665]: contract_name
                    - listitem [ref=e666] [cursor=pointer]:
                      - button "contract_date" [ref=e667]
                      - generic [ref=e668]:
                        - button [ref=e669]:
                          - img [ref=e671]
                        - img [ref=e681]
                        - generic [ref=e687]: contract_date
                    - listitem [ref=e688] [cursor=pointer]:
                      - button "contract_stage" [ref=e689]
                      - generic [ref=e690]:
                        - button [ref=e691]:
                          - img [ref=e693]
                        - img [ref=e703]
                        - generic [ref=e706]: contract_stage
                    - listitem [ref=e707] [cursor=pointer]:
                      - button "approval_mode" [ref=e708]
                      - generic [ref=e709]:
                        - button [ref=e710]:
                          - img [ref=e712]
                        - img [ref=e722]
                        - generic [ref=e726]: approval_mode
                    - listitem [ref=e727] [cursor=pointer]:
                      - button "required_documents" [ref=e728]
                      - generic [ref=e729]:
                        - button [ref=e730]:
                          - img [ref=e732]
                        - img [ref=e742]
                        - generic [ref=e746]: required_documents
                    - listitem [ref=e747] [cursor=pointer]:
                      - button "routing-primary-showcase_attachment" [ref=e748]
                      - generic [ref=e749]:
                        - button [ref=e750]:
                          - img [ref=e752]
                        - img [ref=e762]
                        - generic [ref=e765]: routing-primary-showcase_attachment
                    - listitem [ref=e766] [cursor=pointer]:
                      - button "routing-primary-showcase_approve" [ref=e767]
                      - generic [ref=e768]:
                        - button [ref=e769]:
                          - img [ref=e771]
                        - img [ref=e781]
                        - generic [ref=e785]: routing-primary-showcase_approve
                    - listitem [ref=e786] [cursor=pointer]:
                      - button "routing-primary-showcase_note" [ref=e787]
                      - generic [ref=e788]:
                        - button [ref=e789]:
                          - img [ref=e791]
                        - img [ref=e801]
                        - generic [ref=e805]: routing-primary-showcase_note
                        - img [ref=e807]
                    - listitem [ref=e810] [cursor=pointer]:
                      - button "routing-primary-showcase_decline" [ref=e811]
                      - generic [ref=e812]:
                        - button [ref=e813]:
                          - img [ref=e815]
                        - img [ref=e825]
                        - generic [ref=e830]: routing-primary-showcase_decline
                    - listitem [ref=e831] [cursor=pointer]:
                      - button "routing-primary-showcase_title" [ref=e832]
                      - generic [ref=e833]:
                        - button [ref=e834]:
                          - img [ref=e836]
                        - img [ref=e846]
                        - generic [ref=e850]: routing-primary-showcase_title
                    - listitem [ref=e851] [cursor=pointer]:
                      - button "routing-primary-showcase_emailaddress" [ref=e852]
                      - generic [ref=e853]:
                        - button [ref=e854]:
                          - img [ref=e856]
                        - img [ref=e866]
                        - generic [ref=e870]: routing-primary-showcase_emailaddress
                  - status [ref=e871]
          - generic [ref=e874]:
            - generic [ref=e875]:
              - generic "contract_name" [ref=e877] [cursor=pointer]:
                - generic [ref=e880]: Contrato principal
                - text: contract_name · text
              - generic "contract_date" [ref=e881] [cursor=pointer]:
                - generic [ref=e884]: 2026-05-01
                - text: contract_date · text
              - generic "contract_stage" [ref=e885] [cursor=pointer]:
                - generic [ref=e888]: Pendiente
                - text: contract_stage · select
              - generic "approval_mode" [ref=e889] [cursor=pointer]:
                - radiogroup "Modo de aprobación" [ref=e891]:
                  - generic [ref=e892]:
                    - radio "Firma" [checked] [disabled] [ref=e893]
                    - radio "Revisión" [disabled] [ref=e896]
              - generic "required_documents" [ref=e898] [cursor=pointer]:
                - group "Documentos requeridos" [ref=e900]:
                  - generic [ref=e901]:
                    - checkbox "Cédula" [checked] [disabled] [ref=e902]:
                      - img [ref=e904]
                    - checkbox "RUC" [disabled] [ref=e906]
                    - checkbox "Contrato firmado" [checked] [disabled] [ref=e908]:
                      - img [ref=e910]
                - text: required_documents · checkboxGroup
              - generic "routing-primary-showcase_attachment" [ref=e912] [cursor=pointer]:
                - generic [ref=e915]:
                  - img [ref=e916]
                  - text: Adjuntar archivo
                - text: routing-primary-showcase_attachment · attachment
              - generic "routing-primary-showcase_approve" [ref=e918] [cursor=pointer]:
                - button "Aprobar" [ref=e921]:
                  - img [ref=e922]
                  - text: Aprobar
                - text: routing-primary-showcase_approve · approve
              - generic "Solo lectura" [ref=e924] [cursor=pointer]:
                - generic [ref=e926]: Nota informativa
                - text: solo lectura
              - generic "routing-primary-showcase_decline" [ref=e927] [cursor=pointer]:
                - button "Rechazar" [ref=e930]:
                  - img [ref=e931]
                  - text: Rechazar
                - text: routing-primary-showcase_decline · decline
              - generic "routing-primary-showcase_title" [ref=e934] [cursor=pointer]: routing-primary-showcase_title · title
              - generic "routing-primary-showcase_emailaddress" [ref=e938] [cursor=pointer]: routing-primary-showcase_emailaddress · emailAddress
            - generic [ref=e942]:
              - generic "routing-primary-showcase_company" [ref=e944] [cursor=pointer]: routing-primary-showcase_company · company
              - generic "routing-primary-showcase_fullname" [ref=e948] [cursor=pointer]: routing-primary-showcase_fullname · fullName
              - generic "routing-primary-showcase_table" [ref=e952] [cursor=pointer]:
                - generic [ref=e953]:
                  - generic [ref=e957]: Name
                  - generic [ref=e961]: City
                  - generic [ref=e965]: Description
                  - generic [ref=e969]: Alice
                  - generic [ref=e977]: New York
                  - generic [ref=e985]: Alice is a freelance web designer and developer
                  - generic [ref=e993]: Bob
                  - generic [ref=e1001]: Paris
                  - generic [ref=e1009]: Bob is a freelance illustrator and graphic designer
                - text: routing-primary-showcase_table · table
              - generic "routing-primary-showcase_date" [ref=e1014] [cursor=pointer]: routing-primary-showcase_date · date
              - generic "routing-primary-showcase_datetime" [ref=e1018] [cursor=pointer]: routing-primary-showcase_datetime · dateTime
              - generic "routing-primary-showcase_time" [ref=e1022] [cursor=pointer]: routing-primary-showcase_time · time
            - generic [ref=e1026]:
              - generic "Solo lectura" [ref=e1028] [cursor=pointer]:
                - generic [ref=e1031]: 08/07/2026
                - text: solo lectura
              - generic "routing-primary-showcase_signature" [ref=e1032] [cursor=pointer]: routing-primary-showcase_signature · signature
              - generic "routing-primary-showcase_initials" [ref=e1035] [cursor=pointer]: routing-primary-showcase_initials · initials
              - generic "routing-primary-showcase_code128" [ref=e1038] [cursor=pointer]:
                - img [ref=e1041]
                - text: routing-primary-showcase_code128 · code128
              - generic "routing-primary-showcase_code39" [ref=e1042] [cursor=pointer]:
                - img [ref=e1045]
                - text: routing-primary-showcase_code39 · code39
              - generic "routing-primary-showcase_ean13" [ref=e1046] [cursor=pointer]:
                - img [ref=e1049]
                - text: routing-primary-showcase_ean13 · ean13
            - generic "routing-primary-showcase_ean8" [ref=e1052] [cursor=pointer]:
              - img [ref=e1055]
              - text: routing-primary-showcase_ean8 · ean8
      - status [ref=e1076]
  - region "Resultados":
    - button "Resultados Colapsado" [ref=e1077] [cursor=pointer]:
      - text: Resultados
      - generic [ref=e1078]: Colapsado
``​`
```

<a id="file-0078"></a>

### 0078 — `.tailwind-migration-backups/20260708-111736/reports/tailwind-migration/README.md`

- **Lenguaje:** `markdown`
- **Líneas:** `76`
- **Tamaño original:** `3.4 KB`
- **SHA1 corto:** `c58b615818`
- **Estado:** `completo`

```markdown
# Tailwind Migration Report

Fecha: 2026-07-08T16:17:35.937Z
Modo: apply
Root: /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

## Objetivo

Migración incremental de diseños a Tailwind preservando comportamiento, canvas, geometría, Moveable, Selecto, snapshot y metadata.

## Archivos creados/actualizados

- mkdir reports/tailwind-migration
- mkdir reports/tailwind-migration/candidates
- backup package.json -> .tailwind-migration-backups/20260708-111735/package.json
- update package.json
- update tailwind.config.js
- update postcss.config.js
- mkdir src/styles
- update src/styles/tailwind.css
- update src/styles/sisad-tailwind-bridge.css
- backup src/main.jsx -> .tailwind-migration-backups/20260708-111735/src/main.jsx
- update src/main.jsx
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
- update reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
- update reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css

## Candidatos CSS generados

- src/sisad-pdfme/ui/styles/tokens.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css
  - bloques convertidos: 0
  - declaraciones manuales/unsupported: 0
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css
  - bloques convertidos: 772
  - declaraciones manuales/unsupported: 1814
- src/sisad-pdfme/ui/styles/canvas-interactions.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css
  - bloques convertidos: 176
  - declaraciones manuales/unsupported: 508
- src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css → reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css
  - bloques convertidos: 65
  - declaraciones manuales/unsupported: 88
- src/features/pdfcomponent/labRoutes.css → reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css
  - bloques convertidos: 203
  - declaraciones manuales/unsupported: 435

## Advertencias

- Dependencias Tailwind no instaladas. Ejecuta con --install para instalar tailwindcss postcss autoprefixer.

## Próximo paso recomendado

1. Ejecutar la app y validar /lab/multi-document-routing.
2. Comparar visualmente Designer, Form, Viewer y PDF.
3. Migrar por task-card, no todo de golpe.
4. Mantener classNames existentes hasta que Playwright confirme comportamiento.
5. No reemplazar reglas de canvas, Moveable, Selecto ni geometría por Tailwind sin evidencia.

## Validación manual mínima

- Designer mantiene grid, sidebars, toolbar, zoom y selección.
- Form/Viewer siguen filtrando por recipient activo.
- CheckboxGroup/RadioGroup no muestran labels técnicos no deseados.
- Attachment, image, svg, barcode y table conservan comportamiento.
- Página 2+ conserva coordenadas, overlays y toolbar.
- PDF generado no imprime chrome/fondos no deseados.

## Archivos que NO deben tocarse solo por diseño

- Moveable.tsx
- Selecto.tsx
- designerCoordinateService.ts
- schemaCollision.ts
- snapshotAdapter.ts
- generator/pdf-lib
```

---

## Prompt sugerido para IA

```text
Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.
```

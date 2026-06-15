# Documentación Markdown Unificada

**Carpeta origen:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`  
**Fecha de generación:** `2026-06-15T17:51:06.183Z`  
**Total de archivos incluidos:** `78`  
**Extensiones incluidas:** `.md`

---

# Tabla de contenidos

0001. [AGENTS.md](#archivo-0001)
0002. [CURRENT_STATE.md](#archivo-0002)
0003. [GUARDRAILS.md](#archivo-0003)
0004. [README.md](#archivo-0004)
0005. [START_PROMPT.md](#archivo-0005)
0006. [.ai/CONTEXT_BUDGET.md](#archivo-0006)
0007. [.ai/context-map.md](#archivo-0007)
0008. [.ai/INDEX.md](#archivo-0008)
0009. [.ai/ROUTER.md](#archivo-0009)
0010. [scripts/README.md](#archivo-0010)
0011. [.ai/agents/registry.md](#archivo-0011)
0012. [.ai/architecture/design-patterns-by-process.md](#archivo-0012)
0013. [.ai/architecture/docusign-designer-process-analysis.md](#archivo-0013)
0014. [.ai/architecture/schema-object-model.md](#archivo-0014)
0015. [.ai/architecture/solid-and-oop-guidelines.md](#archivo-0015)
0016. [.ai/context/canvas-multipage-context.md](#archivo-0016)
0017. [.ai/context/commandbus-context.md](#archivo-0017)
0018. [.ai/context/css-visual-context.md](#archivo-0018)
0019. [.ai/context/designer-runtime-context.md](#archivo-0019)
0020. [.ai/context/docusign-like-context.md](#archivo-0020)
0021. [.ai/context/inspector-context.md](#archivo-0021)
0022. [.ai/context/schema-families-context.md](#archivo-0022)
0023. [.ai/context/schema-object-model-context.md](#archivo-0023)
0024. [.ai/context/snapshot-designer-context.md](#archivo-0024)
0025. [.ai/context/solid-oop-context.md](#archivo-0025)
0026. [.ai/context/task-execution-contract.md](#archivo-0026)
0027. [.ai/memory/decisions.md](#archivo-0027)
0028. [.ai/memory/project-memory.md](#archivo-0028)
0029. [.ai/memory/session-handoff.md](#archivo-0029)
0030. [.ai/playbooks/PB-001-canvas-multipage.md](#archivo-0030)
0031. [.ai/playbooks/PB-002-selection-transform.md](#archivo-0031)
0032. [.ai/playbooks/PB-003-schema-families.md](#archivo-0032)
0033. [.ai/playbooks/PB-004-inspector-detailview.md](#archivo-0033)
0034. [.ai/playbooks/PB-005-snapshot-designer.md](#archivo-0034)
0035. [.ai/playbooks/PB-006-css-visual.md](#archivo-0035)
0036. [.ai/playbooks/PB-007-refactor-solid.md](#archivo-0036)
0037. [.ai/prompts/create-next-task-card.prompt.md](#archivo-0037)
0038. [.ai/prompts/diagnose-only.prompt.md](#archivo-0038)
0039. [.ai/prompts/execute-task-card.prompt.md](#archivo-0039)
0040. [.ai/prompts/implement-only.prompt.md](#archivo-0040)
0041. [.ai/prompts/update-memory.prompt.md](#archivo-0041)
0042. [.ai/rules/canvas-rules.md](#archivo-0042)
0043. [.ai/rules/context-budget-rules.md](#archivo-0043)
0044. [.ai/rules/css-rules.md](#archivo-0044)
0045. [.ai/rules/docusign-process-rules.md](#archivo-0045)
0046. [.ai/rules/global-designer-rules.md](#archivo-0046)
0047. [.ai/rules/inspector-rules.md](#archivo-0047)
0048. [.ai/rules/moveable-selecto-rules.md](#archivo-0048)
0049. [.ai/rules/no-loop-rules.md](#archivo-0049)
0050. [.ai/rules/schema-rules.md](#archivo-0050)
0051. [.ai/rules/snapshot-rules.md](#archivo-0051)
0052. [.ai/rules/solid-rules.md](#archivo-0052)
0053. [.ai/rules/type-safety-rules.md](#archivo-0053)
0054. [.ai/task-cards/TASK-001-fix-multipage.md](#archivo-0054)
0055. [.ai/task-cards/TASK-002-harden-selecto-moveable.md](#archivo-0055)
0056. [.ai/task-cards/TASK-003-stabilize-option-groups.md](#archivo-0056)
0057. [.ai/task-cards/TASK-004-schema-object-model.md](#archivo-0057)
0058. [.ai/task-cards/TASK-005-reduce-any.md](#archivo-0058)
0059. [.ai/task-cards/TASK-006-improve-inspector-sections.md](#archivo-0059)
0060. [.ai/task-cards/TASK-007-compact-docusign-like-fields.md](#archivo-0060)
0061. [.ai/task-cards/TASK-008-clean-feature-wrappers.md](#archivo-0061)
0062. [.ai/task-cards/TASK-009-designer-snapshot-roundtrip.md](#archivo-0062)
0063. [.ai/task-cards/TASK-010-commandbus-actions.md](#archivo-0063)
0064. [docs/00-index/README.md](#archivo-0064)
0065. [docs/01-architecture/01-overview.md](#archivo-0065)
0066. [docs/01-architecture/02-ai-execution-model.md](#archivo-0066)
0067. [docs/01-architecture/03-solid-oop-patterns.md](#archivo-0067)
0068. [docs/01-architecture/04-docusign-like-analysis.md](#archivo-0068)
0069. [docs/02-processes/01-canvas-multipage.md](#archivo-0069)
0070. [docs/02-processes/02-selection-transform.md](#archivo-0070)
0071. [docs/02-processes/03-schema-configuration.md](#archivo-0071)
0072. [docs/02-processes/04-snapshot-designer.md](#archivo-0072)
0073. [docs/03-schemas/01-schema-object-model.md](#archivo-0073)
0074. [docs/03-schemas/02-schema-families.md](#archivo-0074)
0075. [docs/03-schemas/03-inspector-sections.md](#archivo-0075)
0076. [docs/03-schemas/04-docusign-field-mapping.md](#archivo-0076)
0077. [docs/04-validation/01-manual-checklists.md](#archivo-0077)
0078. [docs/04-validation/02-regression-matrix.md](#archivo-0078)

---

# Contenido consolidado

---

<a id="archivo-0001"></a>
## Archivo #1: AGENTS.md

- **Ruta relativa:** `AGENTS.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/AGENTS.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# AGENTS.md — Router neutral IA para SISAD PDFME Designer

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/ROUTER.md`.
3. Leer `.ai/CONTEXT_BUDGET.md`.
4. Leer `.ai/memory/project-memory.md`.
5. Seleccionar exactamente 1 task-card.
6. Cargar máximo 1 contexto + 1 regla + 1 playbook.
7. Inspeccionar código real con `rg`.

## Agentes

| Agente | Uso |
|---|---|
| `designer-runtime-agent` | Designer general, estado, composición |
| `canvas-runtime-agent` | Canvas, páginas, coordenadas, drop |
| `moveable-selecto-agent` | Moveable, Selecto, guards, shortcuts |
| `schema-architecture-agent` | schemas, families, registry, factories |
| `inspector-agent` | DetailView, ListView, widgets, inspector contracts |
| `commandbus-agent` | command bus, selectionCommands, undo/redo |
| `snapshot-designer-agent` | snapshot del diseñador, import/export metadata |
| `css-visual-agent` | CSS scoped, field chrome, visual compact |
| `solid-refactor-agent` | SOLID, OOP, type safety, reducción any |
| `docusign-process-agent` | análisis funcional DocuSign-like ya resumido |

## Regla

Un agente no puede cambiar de dominio durante la tarea. Si detecta otro dominio, debe reportar nueva task-card.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0002"></a>
## Archivo #2: CURRENT_STATE.md

- **Ruta relativa:** `CURRENT_STATE.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/CURRENT_STATE.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `43`

### Contenido original

# CURRENT_STATE — SISAD PDFME Designer

## Estado esperado

El diseñador PDF debe soportar:

- múltiples documentos;
- múltiples páginas;
- recipients/owners;
- color por owner;
- schemas estándar;
- grupos de opciones;
- inspector configurable;
- selección simple/múltiple;
- drag/resize/rotate;
- toolbar contextual;
- snapshot del diseñador;
- visual compacto tipo DocuSign/Wix sin copiar marca.

## Riesgos activos conocidos

- Interacciones que solo funcionan en página 1.
- Selecto seleccionando overlays/options.
- Moveable calculando contra página incorrecta.
- Botón + entrando al target transformable.
- No-overlap sin filtrar por owner/document/page.
- Snapshot perdiendo `pageNumber`.
- Uso excesivo de `any`.
- Wrappers triviales y duplicidad en features/lab.
- CSS global afectando Moveable/Selecto.
- Prompts demasiado amplios generando loops.

## Prioridad actual

1. Multipágina.
2. Selecto/Moveable/guards.
3. Option groups.
4. Schema object model.
5. Inspector sections.
6. Visual compact.
7. Type safety/reducción any.
8. Cleanup wrappers.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0003"></a>
## Archivo #3: GUARDRAILS.md

- **Ruta relativa:** `GUARDRAILS.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/GUARDRAILS.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `54`

### Contenido original

# Guardrails globales — SISAD PDFME Designer

## Nunca romper

```txt
schemaUid
documentId
pageNumber
pageIndex
x/y/width/height/rotation
ownerRecipientId
recipientId
ownerColor
recipientColor
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
Snapshot del diseñador
Compatibilidad de Form/Viewer/Generator
```

## Prohibido

- Duplicar canvas.
- Duplicar sidebars internas.
- Duplicar inspector.
- Duplicar toolbar interna.
- Duplicar renderer de schemas.
- Manipular DOM interno desde hosts.
- Crear snapshots paralelos.
- Forzar todo a página 1.
- Resolver geometría con `setTimeout`.
- Resolver hit-testing con `z-index` arbitrario.
- Tocar `.moveable-*` desde CSS host.
- Tocar `.selecto-*` desde CSS host.
- Copiar HTML/CSS/SVG/branding de DocuSign.
- Crear nuevos `as any`.
- Convertir una tarea focal en auditoría global.

## Permitido

- Cambios incrementales.
- Helpers compartidos.
- Contracts.
- Type guards.
- Factories.
- Strategies.
- Adapters.
- Commands.
- State unions.
- Task-cards nuevas si excede presupuesto.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0004"></a>
## Archivo #4: README.md

- **Ruta relativa:** `README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `101`

### Contenido original

# SISAD PDFME Designer — AI Architecture v3 Complete

Generado: `2026-06-15T15:04:39+00:00`

Arquitectura Markdown completa para continuar el desarrollo del **componente diseñador PDF** de `sisad-pdfme`, optimizada para proveedores de IA como Claude, Codex, Copilot, Gemini u otros.

## Alcance estricto

Este paquete se enfoca únicamente en:

```txt
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
```

No se enfoca en:

```txt
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
```

Form/Viewer/Generator solo aparecen como **contrato de compatibilidad** para no romper metadata, snapshot ni schema contracts.

## Objetivo

Evitar que los proveedores de IA entren en loops de análisis, consuman tokens sin sentido o vuelvan a auditar todo el proyecto en cada tarea.

La arquitectura está diseñada para trabajar por:

```txt
Router
→ Context budget
→ Task-card cerrada
→ Playbook focalizado
→ Reglas estrictas
→ Archivos candidatos
→ Criterio de parada
→ Reporte final
```

## Principio rector

No corregir por síntoma. Corregir por proceso:

```txt
Proceso
→ Componentes involucrados
→ Fuente de verdad
→ Estados válidos
→ Datos preservados
→ Validación
→ Implementación mínima
```

## Cómo usar

1. Copia este paquete en la raíz del proyecto.
2. Empieza cada tarea con `START_PROMPT.md`.
3. Selecciona una `task-card` en `.ai/task-cards`.
4. Ejecuta solo esa tarea.
5. Si excede presupuesto, detenerse y crear nueva task-card.

## Instalación

```bash
bash scripts/install-architecture.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Limpieza previa opcional

Incluye scripts seguros para limpiar `.md` anteriores y carpetas vacías:

```bash
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm --backup

bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0005"></a>
## Archivo #5: START_PROMPT.md

- **Ruta relativa:** `START_PROMPT.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/START_PROMPT.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `145`

### Contenido original

# START PROMPT — SISAD PDFME Designer

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas editors, Moveable, Selecto, command bus, snapshot del diseñador, schemas plugins, DetailView, ListView, CSS scoped, SOLID, POO basada en contratos, reducción de `any` y UX funcional tipo DocuSign/Wix.

## Alcance estricto

Trabaja únicamente sobre el componente diseñador PDF:

```txt
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
```

No tocar:

```txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms como flujo de negocio
Form/Viewer/Generator salvo contrato de compatibilidad
```

## Inicio obligatorio

Antes de analizar o modificar, sigue este orden:

```txt
1. Leer .ai/INDEX.md
2. Leer .ai/ROUTER.md
3. Leer .ai/CONTEXT_BUDGET.md
4. Leer .ai/memory/project-memory.md
5. Leer .ai/context-map.md
6. Seleccionar exactamente 1 task-card en .ai/task-cards
7. Cargar solo:
   - 1 contexto
   - 1 regla principal
   - 1 playbook
   - 1 task-card
8. Inspeccionar código real con rg
```

## Presupuesto máximo

No excedas:

```txt
Máximo 2 comandos rg de búsqueda general.
Máximo 8 archivos abiertos.
Máximo 5 archivos modificados.
Máximo 1 proceso corregido por pasada.
Máximo 1 reporte final.
```

Si necesitas más, detente y reporta:

```txt
SE REQUIERE NUEVA TASK-CARD
```

No continúes investigando.

## Regla anti-loop

No repitas análisis global si la task-card ya define el proceso.

No vuelvas a explicar todo DocuSign.

No abras todos los Markdown.

No hagas auditoría general.

No propongas tocar archivos fuera del scope.

No conviertas un bug puntual en refactor completo.

## Datos que nunca deben perderse

Preservar siempre:

```txt
schemaUid
type
documentId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
recipientId
ownerColor
recipientColor
required
readOnly
readonly
locked
hidden
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
defaultValue
options
__designer
```

## Entrega final obligatoria

```md
# Resultado

## Task-card ejecutada
## Contexto cargado
## Proceso afectado
## Diagnóstico corto
## Causa raíz
## Archivos modificados
## Cambios realizados
## Contratos preservados
## Validación manual
## Tests ejecutados o no ejecutados
## Errores externos observados pero no tocados
## Riesgos residuales
## Nueva task-card requerida, si aplica
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0006"></a>
## Archivo #6: .ai/CONTEXT_BUDGET.md

- **Ruta relativa:** `.ai/CONTEXT_BUDGET.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/CONTEXT_BUDGET.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `49`

### Contenido original

# CONTEXT_BUDGET — Presupuesto de tokens y análisis

## Presupuesto fijo por tarea

```txt
1 task-card
1 contexto
1 regla principal
1 playbook
2 comandos rg máximo
8 archivos abiertos máximo
5 archivos modificados máximo
1 proceso por pasada
```

## Criterio de parada

Detenerse si:

```txt
[ ] La solución requiere más de 5 archivos modificados.
[ ] Hay que abrir más de 8 archivos.
[ ] La causa raíz pertenece a otro proceso.
[ ] Hay que tocar host/negocio.
[ ] Hay que tocar Form/Viewer/Generator como implementación.
[ ] Hay que modificar SnapshotAdapter globalmente.
[ ] Hay que ejecutar suite completa.
[ ] Hay que crear una arquitectura nueva.
```

## Qué hacer al detenerse

Entregar:

```md
# Diagnóstico parcial
## Bloqueo
## Por qué excede presupuesto
## Nueva task-card propuesta
## Archivos sugeridos
```

## Prohibido

- "Voy a revisar todo el proyecto".
- "Voy a cargar todos los Markdown".
- "Voy a hacer una auditoría completa" dentro de una task-card.
- Repetir análisis DocuSign si ya existe contexto.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0007"></a>
## Archivo #7: .ai/context-map.md

- **Ruta relativa:** `.ai/context-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0008"></a>
## Archivo #8: .ai/INDEX.md

- **Ruta relativa:** `.ai/INDEX.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/INDEX.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `63`

### Contenido original

# .ai/INDEX.md — Índice mínimo del diseñador

## Carga base obligatoria

```txt
.ai/ROUTER.md
.ai/CONTEXT_BUDGET.md
.ai/memory/project-memory.md
.ai/context-map.md
.ai/agents/registry.md
```

## Flujo

```txt
Mensaje del usuario
→ ROUTER decide dominio
→ seleccionar task-card
→ cargar contexto focal
→ cargar regla principal
→ cargar playbook
→ ejecutar dentro de presupuesto
```

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

```txt
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
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0009"></a>
## Archivo #9: .ai/ROUTER.md

- **Ruta relativa:** `.ai/ROUTER.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/ROUTER.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `53`

### Contenido original

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

```txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms flujo de negocio
```

## Pregunta 3 — ¿Hace falta análisis global?

Respuesta por defecto: NO.

Solo se permite análisis global si el usuario pide explícitamente auditoría general.

## Resultado del router

Antes de modificar, el agente debe declarar:

```md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0010"></a>
## Archivo #10: scripts/README.md

- **Ruta relativa:** `scripts/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/scripts/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `22`

### Contenido original

# Scripts

## Instalar arquitectura

```bash
bash scripts/install-architecture.sh /ruta/proyecto
```

## Eliminar Markdown anteriores

```bash
node scripts/delete-existing-markdown.mjs /ruta/proyecto --dry-run
node scripts/delete-existing-markdown.mjs /ruta/proyecto --confirm --backup
```

## Eliminar carpetas vacías

```bash
bash scripts/clean-empty-dirs.sh /ruta/proyecto --dry-run
bash scripts/clean-empty-dirs.sh /ruta/proyecto --confirm
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0011"></a>
## Archivo #11: .ai/agents/registry.md

- **Ruta relativa:** `.ai/agents/registry.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/registry.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `32`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0012"></a>
## Archivo #12: .ai/architecture/design-patterns-by-process.md

- **Ruta relativa:** `.ai/architecture/design-patterns-by-process.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/design-patterns-by-process.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0013"></a>
## Archivo #13: .ai/architecture/docusign-designer-process-analysis.md

- **Ruta relativa:** `.ai/architecture/docusign-designer-process-analysis.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/docusign-designer-process-analysis.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `51`

### Contenido original

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

```txt
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
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0014"></a>
## Archivo #14: .ai/architecture/schema-object-model.md

- **Ruta relativa:** `.ai/architecture/schema-object-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/schema-object-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `42`

### Contenido original

# Modelo de objetos de schema

## Capas

```txt
Data object
Plugin
Factory
Renderer
ValueAdapter
InspectorContract
PdfCompatibilityContract
SnapshotAdapter
CommandHandlers
```

## Data object

Debe ser serializable.

## Plugin contract

```ts
type SchemaPlugin<TSchema extends SisadSchema> = {
  type: TSchema['type'];
  family: SchemaFamily;
  createDefault(ctx): TSchema;
  renderDesigner(root, schema, ctx): void;
  getCapabilities(schema): SchemaInteractionCapabilities;
};
```

## Inspector contract

```ts
type SchemaInspectorContract = {
  type: string;
  family: SchemaFamily;
  sections: Record<string, boolean>;
};
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0015"></a>
## Archivo #15: .ai/architecture/solid-and-oop-guidelines.md

- **Ruta relativa:** `.ai/architecture/solid-and-oop-guidelines.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/solid-and-oop-guidelines.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `34`

### Contenido original

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

```ts
type TextSchema =
  BaseSchema<'text'>
  & HasAppearance
  & HasValidation
  & HasDataBinding;
```

## Evitar

```ts
class TextSchema extends BaseSchema
```

si el objeto debe serializarse al snapshot.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0016"></a>
## Archivo #16: .ai/context/canvas-multipage-context.md

- **Ruta relativa:** `.ai/context/canvas-multipage-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/canvas-multipage-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `47`

### Contenido original

# Canvas Multipage Context

## Regla central

Ninguna interacción debe asumir página 1.

## Página DOM

Cada página debe tener:

```html
data-paper-page="true"
data-document-id="..."
data-page-number="..."
data-page-index="..."
```

## Schema DOM

Cada schema root debe tener:

```html
data-schema-id="..."
data-schema-uid="..."
data-document-id="..."
data-page-number="..."
data-page-index="..."
```

## Flujo correcto

```txt
pointer/drop
→ resolver página bajo puntero
→ convertir client point a page point
→ crear/update schema con documentId + pageNumber
→ render en página correcta
→ overlay contra rect real
```

## Validación

- Drop en página 2 crea en página 2.
- Selecto ve targets de todas las páginas.
- Moveable transforma contra página dueña.
- Toolbar aparece en la página del schema.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0017"></a>
## Archivo #17: .ai/context/commandbus-context.md

- **Ruta relativa:** `.ai/context/commandbus-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/commandbus-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0018"></a>
## Archivo #18: .ai/context/css-visual-context.md

- **Ruta relativa:** `.ai/context/css-visual-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/css-visual-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `27`

### Contenido original

# CSS Visual Context

## Runtime CSS

Todo bajo:

```css
.sisad-pdfme-root
```

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0019"></a>
## Archivo #19: .ai/context/designer-runtime-context.md

- **Ruta relativa:** `.ai/context/designer-runtime-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/designer-runtime-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `32`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0020"></a>
## Archivo #20: .ai/context/docusign-like-context.md

- **Ruta relativa:** `.ai/context/docusign-like-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/docusign-like-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `27`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0021"></a>
## Archivo #21: .ai/context/inspector-context.md

- **Ruta relativa:** `.ai/context/inspector-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/inspector-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `28`

### Contenido original

# Inspector Context

DetailView/ListView pertenecen al diseñador.

## Secciones canónicas

```txt
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
```

## Regla

El inspector debe decidir por contrato/familia, no por switches repetidos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0022"></a>
## Archivo #22: .ai/context/schema-families-context.md

- **Ruta relativa:** `.ai/context/schema-families-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/schema-families-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `28`

### Contenido original

# Schema Families Context

## Familias

```txt
text-like
option-based
boolean
signing-based
action-based
media
shape
table
advanced
```

## Prioridad

- option-based: checkboxGroup, radioGroup, select/dropdown.
- boolean: checkbox.
- signing-based: signature, initials, dateSigned.
- action-based: approve, decline, attachment, note.
- text-like: text, number, date/time, fullName, email, company, title.

## Regla

Cada familia debe compartir factory, renderer, capabilities y value adapter cuando aplique.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0023"></a>
## Archivo #23: .ai/context/schema-object-model-context.md

- **Ruta relativa:** `.ai/context/schema-object-model-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/schema-object-model-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `34`

### Contenido original

# Schema Object Model Context

## Capas

```txt
Data object
→ Plugin
→ Factory
→ Renderer
→ Value adapter
→ Inspector contract
→ PDF compatibility contract
→ Snapshot adapter
→ Command handlers
```

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0024"></a>
## Archivo #24: .ai/context/snapshot-designer-context.md

- **Ruta relativa:** `.ai/context/snapshot-designer-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/snapshot-designer-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0025"></a>
## Archivo #25: .ai/context/solid-oop-context.md

- **Ruta relativa:** `.ai/context/solid-oop-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/solid-oop-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `40`

### Contenido original

# SOLID / OOP Context

## Enfoque

POO basada en contratos y composición.

Preferir:

```txt
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
```

Evitar:

```txt
class BaseSchema extendida por todo
herencia profunda
Record<string, any>
as any nuevo
mega switch por schema.type
objetos no serializables
```

## SOLID

- SRP: un módulo, una responsabilidad.
- OCP: extender por registry/factory/config.
- LSP: todo plugin cumple contrato base.
- ISP: interfaces pequeñas por capacidad.
- DIP: UI depende de contratos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0026"></a>
## Archivo #26: .ai/context/task-execution-contract.md

- **Ruta relativa:** `.ai/context/task-execution-contract.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/task-execution-contract.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0027"></a>
## Archivo #27: .ai/memory/decisions.md

- **Ruta relativa:** `.ai/memory/decisions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/decisions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `22`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0028"></a>
## Archivo #28: .ai/memory/project-memory.md

- **Ruta relativa:** `.ai/memory/project-memory.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/project-memory.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `41`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0029"></a>
## Archivo #29: .ai/memory/session-handoff.md

- **Ruta relativa:** `.ai/memory/session-handoff.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/session-handoff.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

# Session Handoff

Actualizar al cerrar una sesión.

## Formato

```md
## YYYY-MM-DD
- Task-card:
- Objetivo:
- Archivos modificados:
- Cambios:
- Validación:
- Riesgos:
- Nueva task-card:
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0030"></a>
## Archivo #30: .ai/playbooks/PB-001-canvas-multipage.md

- **Ruta relativa:** `.ai/playbooks/PB-001-canvas-multipage.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-001-canvas-multipage.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0031"></a>
## Archivo #31: .ai/playbooks/PB-002-selection-transform.md

- **Ruta relativa:** `.ai/playbooks/PB-002-selection-transform.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-002-selection-transform.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0032"></a>
## Archivo #32: .ai/playbooks/PB-003-schema-families.md

- **Ruta relativa:** `.ai/playbooks/PB-003-schema-families.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-003-schema-families.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0033"></a>
## Archivo #33: .ai/playbooks/PB-004-inspector-detailview.md

- **Ruta relativa:** `.ai/playbooks/PB-004-inspector-detailview.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-004-inspector-detailview.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0034"></a>
## Archivo #34: .ai/playbooks/PB-005-snapshot-designer.md

- **Ruta relativa:** `.ai/playbooks/PB-005-snapshot-designer.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-005-snapshot-designer.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0035"></a>
## Archivo #35: .ai/playbooks/PB-006-css-visual.md

- **Ruta relativa:** `.ai/playbooks/PB-006-css-visual.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-006-css-visual.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0036"></a>
## Archivo #36: .ai/playbooks/PB-007-refactor-solid.md

- **Ruta relativa:** `.ai/playbooks/PB-007-refactor-solid.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/playbooks/PB-007-refactor-solid.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `19`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0037"></a>
## Archivo #37: .ai/prompts/create-next-task-card.prompt.md

- **Ruta relativa:** `.ai/prompts/create-next-task-card.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/create-next-task-card.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0038"></a>
## Archivo #38: .ai/prompts/diagnose-only.prompt.md

- **Ruta relativa:** `.ai/prompts/diagnose-only.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/diagnose-only.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Prompt — Diagnóstico sin modificar

No modificar archivos.

## Salida

```md
# Diagnóstico
## Task-card sugerida
## Causa probable
## Archivos candidatos
## Búsquedas sugeridas
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0039"></a>
## Archivo #39: .ai/prompts/execute-task-card.prompt.md

- **Ruta relativa:** `.ai/prompts/execute-task-card.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/execute-task-card.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `24`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0040"></a>
## Archivo #40: .ai/prompts/implement-only.prompt.md

- **Ruta relativa:** `.ai/prompts/implement-only.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/implement-only.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `11`

### Contenido original

# Prompt — Implementar sin nueva auditoría

No repitas análisis global. Usa la task-card y aplica cambios mínimos.

## Reglas

- Máximo 5 archivos.
- No tocar fuera del scope.
- No crear tests.
- Reportar validación manual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0041"></a>
## Archivo #41: .ai/prompts/update-memory.prompt.md

- **Ruta relativa:** `.ai/prompts/update-memory.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/update-memory.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Prompt — Actualizar memoria

Actualizar `.ai/memory/session-handoff.md`.

No guardar logs largos, stack traces completos ni respuestas enteras de IA.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0042"></a>
## Archivo #42: .ai/rules/canvas-rules.md

- **Ruta relativa:** `.ai/rules/canvas-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/canvas-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Canvas Rules

- Ninguna interacción asume página 1.
- Resolver página bajo puntero.
- Render por documentId + pageNumber.
- Overlays contra rect real.
- No-overlap por owner/document/page.
- No setTimeout para coordenadas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0043"></a>
## Archivo #43: .ai/rules/context-budget-rules.md

- **Ruta relativa:** `.ai/rules/context-budget-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/context-budget-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

# Context Budget Rules

## Máximo

```txt
1 context
1 rule
1 playbook
1 task-card
2 rg
8 archivos abiertos
5 archivos modificados
```

## Prohibido

- leer todos los .md;
- cargar archivos unificados completos;
- buscar indefinidamente;
- ejecutar auditoría general.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0044"></a>
## Archivo #44: .ai/rules/css-rules.md

- **Ruta relativa:** `.ai/rules/css-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/css-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# CSS Rules

- Runtime bajo .sisad-pdfme-root.
- Lab bajo clase propia.
- No body/html.
- No z-index arbitrario.
- No tocar moveable/selecto desde host.
- Usar tokens y fieldChrome.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0045"></a>
## Archivo #45: .ai/rules/docusign-process-rules.md

- **Ruta relativa:** `.ai/rules/docusign-process-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/docusign-process-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `14`

### Contenido original

# DocuSign-like Rules

Permitido: modelar procesos funcionales.

Prohibido:

- copiar branding;
- copiar CSS;
- copiar HTML/SVG;
- acoplar APIs DocuSign;
- análisis repetitivo externo.

Usar contratos propios de sisad-pdfme.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0046"></a>
## Archivo #46: .ai/rules/global-designer-rules.md

- **Ruta relativa:** `.ai/rules/global-designer-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/global-designer-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Global Designer Rules

- PDF Designer only.
- No host/business.
- No Uanataca/liveness/API.
- Preserve schema identity and page metadata.
- No parallel runtime.
- No global audit inside a task-card.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0047"></a>
## Archivo #47: .ai/rules/inspector-rules.md

- **Ruta relativa:** `.ai/rules/inspector-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/inspector-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Inspector Rules

- DetailView por contrato/familia.
- No switches repetidos.
- No mezclar widgets de schema sin capabilities.
- Propiedades comunes en commonInspectorFields.
- Options editadas en optionPropPanel.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0048"></a>
## Archivo #48: .ai/rules/moveable-selecto-rules.md

- **Ruta relativa:** `.ai/rules/moveable-selecto-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/moveable-selecto-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# Moveable / Selecto Rules

## Targets válidos

```txt
.sisad-pdfme-ui-custom-selectable[data-schema-id]
```

## Excluir

```txt
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
```

Moveable transforma solo roots.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0049"></a>
## Archivo #49: .ai/rules/no-loop-rules.md

- **Ruta relativa:** `.ai/rules/no-loop-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/no-loop-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0050"></a>
## Archivo #50: .ai/rules/schema-rules.md

- **Ruta relativa:** `.ai/rules/schema-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/schema-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Schema Rules

- Root = único con data-schema-id.
- Options internas = data-option-id.
- Botón + = data-role group-add-option.
- Options internas no son schemas.
- Preservar owner/page/geometry.
- Usar families y factories.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0051"></a>
## Archivo #51: .ai/rules/snapshot-rules.md

- **Ruta relativa:** `.ai/rules/snapshot-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/snapshot-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Snapshot Rules

- Snapshot del diseñador único.
- Preservar documentId/pageNumber.
- Preservar groupId/optionId/options/selected values.
- Legacy fallback a página 1 solo si no hay metadata.
- No snapshot paralelo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0052"></a>
## Archivo #52: .ai/rules/solid-rules.md

- **Ruta relativa:** `.ai/rules/solid-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/solid-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# SOLID Rules

- SRP: un módulo una responsabilidad.
- OCP: registry/factory/config.
- LSP: plugins cumplen contrato.
- ISP: interfaces pequeñas.
- DIP: depender de contratos.
- No clases profundas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0053"></a>
## Archivo #53: .ai/rules/type-safety-rules.md

- **Ruta relativa:** `.ai/rules/type-safety-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/type-safety-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Type Safety Rules

- No nuevos as any.
- Record<string, any> -> Record<string, unknown> si seguro.
- schema:any -> BaseSchema/SisadSchema si aplica.
- option:any -> OptionItem.
- Usar type guards.
- Usar discriminated unions.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0054"></a>
## Archivo #54: .ai/task-cards/TASK-001-fix-multipage.md

- **Ruta relativa:** `.ai/task-cards/TASK-001-fix-multipage.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-001-fix-multipage.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `70`

### Contenido original

# TASK-001 — Corregir regresión multipágina del diseñador

## Alcance

Canvas, Paper, Renderer, StaticSchema, coordinate services, overlays, no-overlap.

## Problema

Comportamientos funcionan en página 1 pero fallan en página 2+.

## No tocar

```txt
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
```

## Búsqueda permitida

```bash
rg "pageNumber|pageIndex|documentId|currentPage|currentPageIndex|activePage|paperPage|paperRoot|data-paper-page|data-paper-root|querySelector\(|querySelectorAll\(|closest\(|getBoundingClientRect|clientX|clientY|scrollLeft|scrollTop|offsetLeft|offsetTop" src/sisad-pdfme/ui src/sisad-pdfme/shared src/sisad-pdfme/schemas

rg "schemaAutoPlace|schemaCollision|smartPlacement|canvasDropPipeline|resolveCanvasDropTarget|DesignerCoordinateService|coordinateMath|Moveable|Selecto|GroupOptionFloatingAction|SelectionContextToolbar|SchemaDropPlaceholder|SchemaDragPreview" src/sisad-pdfme
```

## Archivos candidatos

```txt
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
```

## Presupuesto

Máximo 8 archivos abiertos. Máximo 5 modificados.

## Validación manual

- Drop en página 2.
- Selección en página 2.
- Move/resize en página 2.
- Botón + en página 2.
- Toolbar en página 2.
- Snapshot conserva página.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0055"></a>
## Archivo #55: .ai/task-cards/TASK-002-harden-selecto-moveable.md

- **Ruta relativa:** `.ai/task-cards/TASK-002-harden-selecto-moveable.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-002-harden-selecto-moveable.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `38`

### Contenido original

# TASK-002 — Endurecer Selecto/Moveable/shortcuts

## Objetivo

Evitar colisiones entre selección, transform, overlays, options, botón + e inputs.

## Contexto

Usar `moveable-selecto-rules.md` y `PB-002-selection-transform.md`.

## Búsqueda permitida

```bash
rg "selectableTargetGuards|transformTargetGuards|interactionGuards|Selecto|Moveable|data-option-id|group-add-option|contenteditable|keyboardShortcut|selectionCommands" src/sisad-pdfme/ui src/sisad-pdfme/shared
```

## Archivos candidatos

```txt
selectableTargetGuards.ts
transformTargetGuards.ts
interactionGuards.ts
interactionState.ts
keyboardShortcutRegistry.ts
useDesignerKeyboardShortcuts.ts
Selecto.tsx
Moveable.tsx
SelectionContextToolbar.tsx
```

## Validación

- Options internas no se seleccionan.
- Botón + no se selecciona.
- Toolbar no se selecciona.
- Input/inline edit bloquea shortcuts.
- Multi-select funciona.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0056"></a>
## Archivo #56: .ai/task-cards/TASK-003-stabilize-option-groups.md

- **Ruta relativa:** `.ai/task-cards/TASK-003-stabilize-option-groups.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-003-stabilize-option-groups.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `33`

### Contenido original

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

```txt
schemas/options/*
schemas/checkbox/index.ts
schemas/checkboxGroup/index.ts
schemas/radioGroup/index.ts
schemas/select/index.ts
GroupOptionFloatingAction.tsx
selectionCommands.ts
```

## Validación

- Agregar opción no mueve grupo.
- Botón + fuera de Moveable.
- DetailView edita options.
- Snapshot preserva optionId/selected.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0057"></a>
## Archivo #57: .ai/task-cards/TASK-004-schema-object-model.md

- **Ruta relativa:** `.ai/task-cards/TASK-004-schema-object-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-004-schema-object-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `32`

### Contenido original

# TASK-004 — Aplicar modelo de objetos de schemas

## Objetivo

Fortalecer contratos: BaseSchema, SisadSchema, SchemaPlugin, InspectorContract, ValueAdapter.

## Archivos candidatos

```txt
schemas/shared/schemaTypes.ts
schemas/shared/schemaGuards.ts
schemas/index.ts
schemas/schemaBuilder.ts
schemas/schemaFamilies.ts
schemas/options/*
schemas/actions/*
schemas/signature/*
schemas/textLike/*
```

## No hacer

- No reescribir todos los schemas.
- No cambiar snapshot sin migration.
- No crear clase base profunda.

## Validación

- Menos casts.
- Plugins tipados.
- Families claras.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0058"></a>
## Archivo #58: .ai/task-cards/TASK-005-reduce-any.md

- **Ruta relativa:** `.ai/task-cards/TASK-005-reduce-any.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-005-reduce-any.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# TASK-005 — Reducir any de forma segura

## Objetivo

Reducir `any` sin romper APIs.

## Búsqueda

```bash
rg "any|as any|Record<string, any>|Array<any>|Promise<any>" src/sisad-pdfme src/features
```

## Reglas

- No nuevos as any.
- Usar unknown + guards.
- Usar BaseSchema/SisadSchema/OptionItem.
- No tocar APIs públicas si no está claro.

## Presupuesto

Máximo 5 archivos modificados.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0059"></a>
## Archivo #59: .ai/task-cards/TASK-006-improve-inspector-sections.md

- **Ruta relativa:** `.ai/task-cards/TASK-006-improve-inspector-sections.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-006-improve-inspector-sections.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# TASK-006 — Mejorar DetailView/Inspector por secciones

## Objetivo

Configurar propiedades por familia tipo DocuSign-like.

## Archivos candidatos

```txt
RightSidebar/DetailView/detailSchemas.ts
detailWidgetRegistry.tsx
detailWidgets.tsx
InspectorPrimitives.tsx
commonInspectorFields.ts
optionPropPanel.tsx
signature/propPanel.ts
```

## Secciones

basics, content, options, signature, appearance, validation, dataLabel, help, location, autoPlace, permissions, conditional, advanced.

## Validación

Inspector correcto por schema/familia.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0060"></a>
## Archivo #60: .ai/task-cards/TASK-007-compact-docusign-like-fields.md

- **Ruta relativa:** `.ai/task-cards/TASK-007-compact-docusign-like-fields.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-007-compact-docusign-like-fields.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `29`

### Contenido original

# TASK-007 — Visual compacto tipo DocuSign/Wix

## Objetivo

PDF protagonista y schemas como overlays ligeros.

## Archivos candidatos

```txt
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
```

## No hacer

No tocar geometría. No tocar Moveable/Selecto. No z-index arbitrario.

## Validación

Campos compactos, ownerColor sutil, sin badges técnicos permanentes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0061"></a>
## Archivo #61: .ai/task-cards/TASK-008-clean-feature-wrappers.md

- **Ruta relativa:** `.ai/task-cards/TASK-008-clean-feature-wrappers.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-008-clean-feature-wrappers.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# TASK-008 — Limpiar wrappers de features/lab

## Objetivo

Reducir archivos triviales en `src/features/pdfcomponent` sin tocar runtime.

## Archivos candidatos

```txt
src/features/pdfcomponent/*
src/features/pdfcomponent/ui/primitives.jsx
src/features/pdfcomponent/domain/*
src/features/pdfcomponent/examples/*
```

## Reglas

- Fusionar componentes <40 líneas sin estado.
- Eliminar reexports triviales.
- No duplicar canvas/toolbar/inspector.
- Mantener lab separado del runtime.

## Validación

Lab sigue cargando.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0062"></a>
## Archivo #62: .ai/task-cards/TASK-009-designer-snapshot-roundtrip.md

- **Ruta relativa:** `.ai/task-cards/TASK-009-designer-snapshot-roundtrip.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-009-designer-snapshot-roundtrip.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# TASK-009 — Snapshot del diseñador roundtrip

## Objetivo

Guardar/importar conserva metadata del diseñador.

## Archivos candidatos

```txt
shared/snapshotAdapter.ts
shared/schemaMigration.ts
shared/schemaDesignerMeta.ts
shared/snapshot.ts
templates/createDefaultTemplate.ts
schemas/options/*
schemas/shared/schemaTypes.ts
```

## Validación

- documentId/pageNumber.
- ownerColor.
- groupId/optionId.
- selected values.
- geometry.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0063"></a>
## Archivo #63: .ai/task-cards/TASK-010-commandbus-actions.md

- **Ruta relativa:** `.ai/task-cards/TASK-010-commandbus-actions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/task-cards/TASK-010-commandbus-actions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `33`

### Contenido original

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

```txt
ui/commands/commandBus.ts
ui/commands/designerCommands.ts
selectionCommands.ts
schemaClipboard.ts
SelectionContextToolbar.tsx
CanvasContextMenu.tsx
canvasContextMenuActions.tsx
```

## Validación

Componentes visuales disparan comandos, no mutan directo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0064"></a>
## Archivo #64: docs/00-index/README.md

- **Ruta relativa:** `docs/00-index/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/00-index/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `28`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0065"></a>
## Archivo #65: docs/01-architecture/01-overview.md

- **Ruta relativa:** `docs/01-architecture/01-overview.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-architecture/01-overview.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `25`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0066"></a>
## Archivo #66: docs/01-architecture/02-ai-execution-model.md

- **Ruta relativa:** `docs/01-architecture/02-ai-execution-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-architecture/02-ai-execution-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# AI Execution Model

## Problema

Prompts amplios causan loops y consumo excesivo.

## Solución

Task-cards cerradas con presupuesto.

## Modelo

```txt
Router
→ Task-card
→ Contexto
→ Regla
→ Playbook
→ rg
→ Cambios mínimos
→ Reporte
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0067"></a>
## Archivo #67: docs/01-architecture/03-solid-oop-patterns.md

- **Ruta relativa:** `docs/01-architecture/03-solid-oop-patterns.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-architecture/03-solid-oop-patterns.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0068"></a>
## Archivo #68: docs/01-architecture/04-docusign-like-analysis.md

- **Ruta relativa:** `docs/01-architecture/04-docusign-like-analysis.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-architecture/04-docusign-like-analysis.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `24`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0069"></a>
## Archivo #69: docs/02-processes/01-canvas-multipage.md

- **Ruta relativa:** `docs/02-processes/01-canvas-multipage.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-processes/01-canvas-multipage.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `20`

### Contenido original

# Proceso — Canvas multipágina

## Flujo

```txt
event
→ page target
→ coordinate conversion
→ schema metadata
→ render page
→ overlay real rect
```

## Validación

- drop página 2;
- selección página 2;
- move/resize página 2;
- snapshot conserva página.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0070"></a>
## Archivo #70: docs/02-processes/02-selection-transform.md

- **Ruta relativa:** `docs/02-processes/02-selection-transform.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-processes/02-selection-transform.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Proceso — Selection/Transform

Selecto selecciona roots. Moveable transforma roots.

Excluir options, botón +, toolbar, inputs y overlays.

Shortcuts no corren durante inline edit.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0071"></a>
## Archivo #71: docs/02-processes/03-schema-configuration.md

- **Ruta relativa:** `docs/02-processes/03-schema-configuration.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-processes/03-schema-configuration.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Proceso — Configuración de schema

## Flujo

```txt
schema selected
→ inspector contract
→ widget por section
→ command update
→ snapshot state
→ re-render
```

No mutar schema desde widgets sin command/update centralizado.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0072"></a>
## Archivo #72: docs/02-processes/04-snapshot-designer.md

- **Ruta relativa:** `docs/02-processes/04-snapshot-designer.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-processes/04-snapshot-designer.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

# Proceso — Snapshot diseñador

Preserva:

- document/page;
- geometry;
- ownership;
- options;
- selected values;
- __designer.

Roundtrip debe devolver lo mismo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0073"></a>
## Archivo #73: docs/03-schemas/01-schema-object-model.md

- **Ruta relativa:** `docs/03-schemas/01-schema-object-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-schemas/01-schema-object-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Schema Object Model

```txt
BaseSchema
→ Family schema
→ Plugin
→ Factory
→ Renderer
→ ValueAdapter
→ InspectorContract
→ Command handlers
```

Datos serializables. Comportamiento en plugins/adapters.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0074"></a>
## Archivo #74: docs/03-schemas/02-schema-families.md

- **Ruta relativa:** `docs/03-schemas/02-schema-families.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-schemas/02-schema-families.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0075"></a>
## Archivo #75: docs/03-schemas/03-inspector-sections.md

- **Ruta relativa:** `docs/03-schemas/03-inspector-sections.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-schemas/03-inspector-sections.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Inspector Sections

Secciones:

```txt
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
```

Cada familia declara qué secciones usa.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0076"></a>
## Archivo #76: docs/03-schemas/04-docusign-field-mapping.md

- **Ruta relativa:** `docs/03-schemas/04-docusign-field-mapping.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-schemas/04-docusign-field-mapping.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0077"></a>
## Archivo #77: docs/04-validation/01-manual-checklists.md

- **Ruta relativa:** `docs/04-validation/01-manual-checklists.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-validation/01-manual-checklists.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0078"></a>
## Archivo #78: docs/04-validation/02-regression-matrix.md

- **Ruta relativa:** `docs/04-validation/02-regression-matrix.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-validation/02-regression-matrix.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `14`

### Contenido original

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

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

# Estructura de carpetas analizada

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
├── .playwright-mcp
├── AGENTS.md
├── AI-Memory
├── CURRENT_STATE.md
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
├── GUARDRAILS.md
├── metadata
├── public
│   └── templates
├── README.md
├── scripts
│   └── README.md
├── sisad-pdfme.md
├── src
│   ├── features
│   │   └── pdfcomponent
│   │       ├── domain
│   │       ├── examples
│   │       └── ui
│   ├── sisad-pdfme
│   │   ├── assignments
│   │   ├── browser
│   │   ├── canvas
│   │   ├── collaboration
│   │   ├── commands
│   │   ├── comments
│   │   ├── common
│   │   ├── context
│   │   ├── contracts
│   │   ├── converter
│   │   ├── devtools
│   │   ├── documents
│   │   ├── editor
│   │   ├── examples
│   │   │   ├── builders
│   │   │   └── export
│   │   ├── externalForms
│   │   ├── generator
│   │   ├── pdf-lib
│   │   │   ├── api
│   │   │   │   ├── form
│   │   │   │   ├── image
│   │   │   │   └── text
│   │   │   ├── core
│   │   │   │   ├── acroform
│   │   │   │   ├── annotation
│   │   │   │   ├── document
│   │   │   │   ├── embedders
│   │   │   │   ├── interactive
│   │   │   │   ├── objects
│   │   │   │   ├── operators
│   │   │   │   ├── parser
│   │   │   │   ├── streams
│   │   │   │   ├── structures
│   │   │   │   ├── syntax
│   │   │   │   └── writers
│   │   │   ├── types
│   │   │   └── utils
│   │   │       └── elements
│   │   ├── runtime
│   │   ├── schemas
│   │   │   ├── actions
│   │   │   ├── barcodes
│   │   │   ├── checkbox
│   │   │   ├── checkboxGroup
│   │   │   ├── date
│   │   │   ├── graphics
│   │   │   ├── multiVariableText
│   │   │   ├── number
│   │   │   ├── options
│   │   │   ├── propPanel
│   │   │   ├── radioGroup
│   │   │   ├── select
│   │   │   ├── shapes
│   │   │   ├── shared
│   │   │   ├── signature
│   │   │   ├── tables
│   │   │   ├── text
│   │   │   │   └── icons
│   │   │   ├── textLike
│   │   │   └── values
│   │   ├── shared
│   │   ├── templates
│   │   └── ui
│   │       ├── commands
│   │       ├── components
│   │       │   ├── Designer
│   │       │   │   ├── Canvas
│   │       │   │   │   └── overlays
│   │       │   │   ├── Comments
│   │       │   │   ├── RightSidebar
│   │       │   │   │   ├── DetailView
│   │       │   │   │   ├── ListView
│   │       │   │   │   └── shared
│   │       │   │   ├── shared
│   │       │   │   └── Shortcuts
│   │       │   └── shared
│   │       ├── styles
│   │       └── types
│   └── types
├── START_PROMPT.md
├── test-results
└── tests
    ├── playwright
    │   ├── features
    │   │   └── pdfcomponent
    │   │       ├── domain
    │   │       ├── examples
    │   │       └── utils
    │   ├── sisad-pdfme
    │   │   ├── assignments
    │   │   ├── canvas
    │   │   ├── collaboration
    │   │   ├── commands
    │   │   ├── comments
    │   │   ├── common
    │   │   ├── context
    │   │   ├── contracts
    │   │   ├── converter
    │   │   ├── documents
    │   │   ├── editor
    │   │   ├── externalForms
    │   │   ├── generator
    │   │   ├── pdf-lib
    │   │   │   ├── api
    │   │   │   │   ├── form
    │   │   │   │   ├── image
    │   │   │   │   └── text
    │   │   │   ├── core
    │   │   │   │   ├── acroform
    │   │   │   │   ├── annotation
    │   │   │   │   ├── document
    │   │   │   │   ├── embedders
    │   │   │   │   ├── interactive
    │   │   │   │   ├── objects
    │   │   │   │   ├── operators
    │   │   │   │   ├── parser
    │   │   │   │   ├── streams
    │   │   │   │   ├── structures
    │   │   │   │   ├── syntax
    │   │   │   │   └── writers
    │   │   │   ├── types
    │   │   │   └── utils
    │   │   │       └── elements
    │   │   ├── schemas
    │   │   │   ├── barcodes
    │   │   │   ├── checkbox
    │   │   │   ├── checkboxGroup
    │   │   │   ├── date
    │   │   │   ├── graphics
    │   │   │   ├── multiVariableText
    │   │   │   ├── number
    │   │   │   ├── radioGroup
    │   │   │   ├── select
    │   │   │   ├── shapes
    │   │   │   ├── signature
    │   │   │   ├── tables
    │   │   │   └── text
    │   │   │       └── icons
    │   │   ├── shared
    │   │   └── ui
    │   │       ├── commands
    │   │       ├── components
    │   │       │   ├── Designer
    │   │       │   │   ├── Canvas
    │   │       │   │   │   └── overlays
    │   │       │   │   ├── Comments
    │   │       │   │   ├── RightSidebar
    │   │       │   │   │   ├── DetailView
    │   │       │   │   │   ├── ListView
    │   │       │   │   │   └── shared
    │   │       │   │   ├── shared
    │   │       │   │   └── Shortcuts
    │   │       │   └── shared
    │   │       └── types
    │   └── types
    └── unit
        ├── features
        │   └── pdfcomponent
        │       ├── domain
        │       ├── examples
        │       └── utils
        ├── sisad-pdfme
        │   ├── assignments
        │   ├── browser
        │   ├── canvas
        │   ├── collaboration
        │   ├── commands
        │   ├── comments
        │   ├── common
        │   ├── context
        │   ├── contracts
        │   ├── converter
        │   ├── documents
        │   ├── editor
        │   ├── examples
        │   ├── externalForms
        │   ├── generator
        │   ├── pdf-lib
        │   │   ├── api
        │   │   │   ├── form
        │   │   │   ├── image
        │   │   │   └── text
        │   │   ├── core
        │   │   │   ├── acroform
        │   │   │   ├── annotation
        │   │   │   ├── document
        │   │   │   ├── embedders
        │   │   │   ├── interactive
        │   │   │   ├── objects
        │   │   │   ├── operators
        │   │   │   ├── parser
        │   │   │   ├── streams
        │   │   │   ├── structures
        │   │   │   ├── syntax
        │   │   │   └── writers
        │   │   ├── types
        │   │   └── utils
        │   │       └── elements
        │   ├── runtime
        │   ├── schemas
        │   │   ├── actions
        │   │   ├── barcodes
        │   │   ├── checkbox
        │   │   ├── checkboxGroup
        │   │   ├── date
        │   │   ├── graphics
        │   │   ├── multiVariableText
        │   │   ├── number
        │   │   ├── options
        │   │   ├── radioGroup
        │   │   ├── select
        │   │   ├── shapes
        │   │   ├── signature
        │   │   ├── tables
        │   │   └── text
        │   │       └── icons
        │   ├── shared
        │   ├── templates
        │   └── ui
        │       ├── commands
        │       ├── components
        │       │   ├── Designer
        │       │   │   ├── Canvas
        │       │   │   │   └── overlays
        │       │   │   ├── Comments
        │       │   │   ├── RightSidebar
        │       │   │   │   ├── DetailView
        │       │   │   │   ├── ListView
        │       │   │   │   └── shared
        │       │   │   ├── shared
        │       │   │   └── Shortcuts
        │       │   └── shared
        │       └── types
        └── types
```

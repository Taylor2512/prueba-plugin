# Prompt especializado de arranque multiagente — SISAD PDFME UX/QA post‑Tailwind

## Uso

Este documento contiene:

1. El protocolo común obligatorio.
2. La preparación local con `git worktree`.
3. La asignación de responsabilidades sin colisiones.
4. Un prompt específico para:
   - Codex 4.5 mini.
   - Claude 4.8 Outputs.
   - GitHub Copilot Auto.
5. El protocolo de integración y cierre.

Proyecto:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

Plan autoritativo:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md
```

Ruta funcional principal:

```txt
http://localhost:5174/lab/multi-document-routing
```

---

# 1. Preparación local obligatoria

## 1.1. Regla de seguridad

Los tres agentes **no deben trabajar en el mismo checkout**.

Se deben usar worktrees y ramas locales separadas. Todo el trabajo permanece en la máquina local.

No usar:

```txt
git stash
git reset --hard
git clean -fd
git push
git pull
git rebase sobre trabajo no integrado
```

Antes de crear los worktrees, dejar el estado actual guardado en un commit local de checkpoint. No incluir cambios ajenos al proyecto.

Ejemplo:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git status --short

# Crear un checkpoint local solo después de confirmar que los cambios visibles
# corresponden al estado actual del proyecto.
git add -A
git commit -m "chore: checkpoint post-tailwind before multi-agent UX QA"
```

## 1.2. Rama de integración

El checkout principal conserva su rama actual. La rama de integración se crea
como referencia local y se abre únicamente en el worktree de merge.

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git branch ai/uxqa-integration-20260717
```

Si la rama ya existe, no la recrees:

```bash
git show-ref --verify --quiet refs/heads/ai/uxqa-integration-20260717
```

## 1.3. Crear worktrees

Primero crear el worktree de integración; después las tres ramas de trabajo,
todas basadas en el mismo commit de integración.

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend

git -C prueba-plugin worktree add \
  prueba-plugin-merge \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-codex \
  -b ai/codex-uxqa-20260717 \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-claude \
  -b ai/claude-uxqa-20260717 \
  ai/uxqa-integration-20260717

git -C prueba-plugin worktree add \
  prueba-plugin-copilot \
  -b ai/copilot-uxqa-20260717 \
  ai/uxqa-integration-20260717
```

Rutas:

```txt
Codex:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex

Claude:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude

Copilot:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

Integración:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
```

## 1.4. Directorio de coordinación compartida

Crear en el checkout principal:

```bash
mkdir -p \
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717/{locks,handoffs,status}
```

Crear el archivo de propiedad:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717/OWNERSHIP.md
```

Cada agente escribe únicamente su propio archivo:

```txt
status/CODEX.md
status/CLAUDE.md
status/COPILOT.md

handoffs/CODEX-<wave>.md
handoffs/CLAUDE-<wave>.md
handoffs/COPILOT-<wave>.md
```

Ningún agente debe editar el archivo de estado de otro agente.

---

# 2. Prompt común obligatorio para los tres agentes

Pega este bloque al inicio de la sesión de cada agente, seguido del bloque específico de su rol.

```txt
Actúa como integrante de un equipo local de tres agentes para estabilizar SISAD PDFME después de la migración CSS→Tailwind.

PROYECTO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

PLAN AUTORITATIVO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md

RUTA PRINCIPAL
http://localhost:5174/lab/multi-document-routing

OBJETIVO
Implementar el plan existente. La auditoría profunda ya fue realizada.
No vuelvas a auditar todo el proyecto, no generes otro plan maestro y no cargues todos los Markdown.

CONTEXTO MÍNIMO PERMITIDO
1. Leer el plan autoritativo completo una sola vez.
2. Leer AGENTS.md y las reglas estrictamente relacionadas con tu dominio.
3. Leer el archivo OWNERSHIP.md compartido.
4. Abrir únicamente los archivos asignados y sus tests directos.
5. Máximo dos rondas de búsqueda `rg` por tarea.
6. Máximo ocho archivos inspeccionados antes de comenzar a implementar.
7. Si necesitas tocar una ruta no asignada, detente y escribe una solicitud de handoff. No la edites.

REGLAS ABSOLUTAS
- Trabaja únicamente en tu worktree y rama asignada.
- Todo el trabajo es local. No uses web, push, pull ni servicios externos.
- No uses git stash, reset --hard, clean -fd ni rebase destructivo.
- No edites archivos que pertenecen a otro agente.
- No resuelvas conflictos dentro de tu rama modificando el trabajo de otro agente.
- No cambies expected, snapshots o assertions para ocultar una regresión.
- No desactives reglas ESLint, React Hooks o React Compiler para hacer pasar el build.
- No agregues CSS global nuevo.
- No agregues `@apply`.
- No agregues clases visuales a runtimeStyles.ts.
- El skin visual debe vivir en JSX/TSX con Tailwind.
- runtimeStyles.ts solo puede conservar CSS técnico demostrado:
  geometría del stage/canvas/paper, Moveable, Selecto, Scena Guides,
  print, nodos generados por terceros y variables runtime.
- No uses `!important` salvo integración de un tercero demostrada y documentada.
- Tailwind tiene `preflight: false`; usa explícitamente `border-solid`,
  `appearance-none` y resets locales cuando sean necesarios.
- No modifiques pdf-lib, generator, snapshot, coordinates, Moveable o Selecto
  salvo que tu asignación lo indique de forma explícita.
- Preserva testIds, aria-labels, CommandBus, ActionRegistry y contratos públicos.
- Preserva selección, recipient, owner color, documentId, pageNumber, schemaUid,
  locks y metadata.
- No agregues wrappers decorativos ni una segunda fuente de estado.
- Un botón visible debe tener handler real, estado enabled/disabled y razón de bloqueo.
- No cierres una tarea únicamente porque el build pasa.

PROTOCOLO DE INICIO
1. Confirma tu worktree con `pwd`.
2. Ejecuta `git status --short`.
3. Lee el plan autoritativo.
4. Lee OWNERSHIP.md.
5. Crea un lock atómico para tu tarea:

   COORD=/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717
   mkdir "$COORD/locks/<TASK-ID>.lock"

   Si falla porque el directorio existe, no empieces esa tarea.

6. Escribe en tu archivo status:
   - task activa;
   - archivos owned;
   - hora de inicio;
   - tests previstos.

PROTOCOLO DE IMPLEMENTACIÓN
- Implementa cambios pequeños y coherentes.
- Máximo cinco archivos productivos por commit.
- Los tests directos pueden ir en el mismo commit.
- Después de cada cambio relevante ejecuta pruebas focales, no el barrido completo.
- Haz commits atómicos con prefijo:
  fix:
  refactor:
  test:
  chore:
- No mezcles dominios en un mismo commit.

PROTOCOLO DE ENTREGA
Al terminar una wave:
1. Ejecuta lint focal.
2. Ejecuta tests unitarios focales.
3. Ejecuta Playwright focal cuando corresponda.
4. Ejecuta build si tocaste runtime o composición principal.
5. Escribe un handoff con:
   - objetivo;
   - archivos modificados;
   - decisiones;
   - comandos ejecutados;
   - resultados exactos;
   - riesgos;
   - asuntos no resueltos;
   - commit SHA.
6. Elimina tu lock.
7. No hagas merge por tu cuenta, salvo que seas el agente integrador Claude en
   el worktree `prueba-plugin-merge`.

CRITERIO DE PARADA
Detente inmediatamente cuando:
- el cambio requiera un archivo owned por otro agente;
- el contrato del plan resulte ambiguo;
- aparezca una regresión fuera del dominio asignado;
- una prueba falle por un área que no te pertenece;
- necesites más de cinco archivos productivos en el mismo slice.

En esos casos, documenta la dependencia y continúa únicamente con trabajo no bloqueado.
```

---

# 3. Distribución de responsabilidades

## 3.1. Propiedad permanente

| Agente | Dominio principal | No debe tocar |
|---|---|---|
| Codex 4.5 mini | P0 técnico, hooks, runtime, overlays Canvas, interacción y pruebas focales | Shell visual del RightSidebar, LeftSidebar y toolbar global |
| Claude 4.8 Outputs | Arquitectura visual, RightSidebar, DetailView, topbar global, Guardar, DocumentsRail e integración | Limpieza masiva del host lab y archivos owned por Copilot |
| GitHub Copilot Auto | LeftSidebar, host del laboratorio, ESLint/warnings, accesibilidad y pruebas visuales de su dominio | RightSidebar, DetailView, Canvas coordinates y runtime React |

## 3.2. Propiedad de tests

```txt
Codex:
- tests de runtime Form/Viewer;
- hooks;
- Canvas overlay;
- selección/foco;
- owner color y transform cuando se asigne.

Claude:
- right-sidebar-*;
- detail-*;
- documents-rail-*;
- save-toolbar-*;
- sidebar rail derecho.

Copilot:
- left-sidebar-*;
- lab host;
- lint;
- visual baseline general;
- accesibilidad del catálogo;
- tests generated/imports legacy.
```

Ningún archivo de prueba puede ser editado por dos agentes en la misma wave.

---

# 4. Waves de ejecución paralela

# WAVE 1 — Integridad funcional P0

Los tres agentes trabajan en paralelo.

## Codex — W1-CODEX-P0-HOOKS

Owned:

```txt
src/sisad-pdfme/react/SisadPdfmeForm.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx
tests unitarios directos de ambos módulos
tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
```

Objetivos:

```txt
- corregir React Compiler en runtimeConfig;
- corregir hooks condicionales;
- eliminar imports muertos del slice;
- limpiar timers;
- respetar prefers-reduced-motion;
- no cambiar UX fuera del overlay;
- dejar lint focal en cero.
```

No tocar:

```txt
RightSidebar/**
LeftSidebar/**
Designer/index.tsx
CtlBar.tsx
runtimeStyles.ts
```

## Claude — W1-CLAUDE-RS-SCROLL

Owned:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
tests/playwright/right-sidebar-detail-scroll.spec.ts
tests/playwright/right-sidebar-docs-tab.spec.ts
```

Objetivos:

```txt
- restablecer un solo scroll owner por panel;
- garantizar min-h-0/overflow contract completo;
- preservar header y tabs;
- no reiniciar scroll por keypress;
- eliminar overflow horizontal;
- validar Fields, Detail, Docs y Comments;
- no hacer todavía el rediseño profundo de cards.
```

No tocar:

```txt
Designer/index.tsx
CtlBar.tsx
LeftSidebar/**
Canvas/**
runtimeStyles.ts
```

## Copilot — W1-COPILOT-LINT-HOST

Owned:

```txt
eslint.config.cjs
src/features/pdfcomponent/**
tests/**/generated/**
tests que importan wrappers legacy eliminados
```

Exclusiones:

```txt
src/features/pdfcomponent/PdfmeLabPage.jsx
```

solo puede tocarse si el warning o import roto está en ese archivo y el cambio no
afecta layout, configuración runtime ni comportamiento del Designer.

Objetivos:

```txt
- eliminar imports y constantes sin uso;
- corregir el doble reporte no-unused-vars en TS/TSX;
- corregir any en código del host cuando tenga tipo inferible;
- actualizar tests que importan rutas eliminadas;
- no recrear wrappers muertos;
- separar lint:src, lint:tests y lint:generated si el package actual lo permite
  sin romper scripts existentes;
- dejar su slice en cero warnings.
```

No tocar:

```txt
src/sisad-pdfme/ui/components/Designer/**
src/sisad-pdfme/react/**
src/sisad-pdfme/ui/runtimeStyles.ts
```

## Gate Wave 1

Claude, actuando como integrador, usa:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
```

Orden de integración:

```bash
git cherry-pick <CODEX-W1-SHA>
git cherry-pick <COPILOT-W1-SHA>
git cherry-pick <CLAUDE-W1-SHA>
```

Después:

```bash
npm run lint
npm run build
npx vitest run
```

Playwright focal:

```bash
npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium
```

No iniciar Wave 2 hasta integrar Wave 1.

Cada agente actualiza su rama desde la integración mediante merge local.
Los worktrees comparten las referencias del mismo repositorio, por lo que no
hace falta `fetch`:

```bash
git merge ai/uxqa-integration-20260717
```

No rebase.

---

# WAVE 2 — Jerarquía del workspace y diseño principal

## Codex — W2-CODEX-CANVAS-TOOLBAR

Owned:

```txt
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/**
src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts
src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts
tests/playwright/selection-context-toolbar.spec.ts
tests/playwright/detail-dropdown-focus-return.spec.ts
```

Objetivos:

```txt
- evitar que toolbar y métricas cubran schemas;
- preferir posición arriba, flip abajo y clamp;
- excluir toolbar de Selecto;
- no iniciar drag desde acciones;
- restaurar foco al trigger o Canvas;
- no tocar coordinate math, zoom ni Moveable.
```

No tocar:

```txt
Designer/index.tsx
CtlBar.tsx
RightSidebar/**
LeftSidebar/**
```

## Claude — W2-CLAUDE-TOPBAR-SAVE

Owned:

```txt
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/UnitPager.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
componentes directos de SaveAction/GlobalMoreMenu ya existentes
tests/playwright/save-toolbar-no-overlap.spec.ts
tests/playwright/right-sidebar-popover-boundaries.spec.ts
```

Objetivos:

```txt
- crear topbar global de tres columnas;
- sacar Guardar del área del RightSidebar;
- conservar estado Guardado/Guardando/Error;
- mover acciones globales Canvas/documento al menú global;
- dejar menús locales del RightSidebar con acciones locales;
- evitar solapamiento con tabs, rail y navegador;
- mantener CommandBus/ActionRegistry.
```

No crear:

```txt
otro header del host
otro estado de guardado
otro menú global paralelo
```

## Copilot — W2-COPILOT-LEFT-SIDEBAR

Owned:

```txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar/**
src/sisad-pdfme/ui/components/PluginIcon.tsx
tests/playwright/left-sidebar-*.spec.ts
tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
```

Nota:

El spec de drag solo puede ser modificado por Copilot en Wave 2 después de que el
commit de Codex Wave 1 ya esté integrado. No tocar assertions del overlay que
pertenecen a Codex.

Objetivos:

```txt
- una sola superficie por plugin;
- borde neutral por defecto;
- azul solo en hover/focus/drag;
- reducir radio, shadow, padding y altura;
- favoritos compactos;
- mantener list/tiles/icons como decisión del usuario;
- impedir scroll accidental durante drag;
- conservar data-testid y comportamiento DnD.
```

No tocar:

```txt
RightSidebar/**
Canvas/overlays/**
Designer/index.tsx
CtlBar.tsx
```

## Gate Wave 2

Integración:

```bash
git cherry-pick <CODEX-W2-SHA>
git cherry-pick <COPILOT-W2-SHA>
git cherry-pick <CLAUDE-W2-SHA>
```

Pruebas focales:

```bash
npm run lint
npm run build

npx playwright test \
  tests/playwright/selection-context-toolbar.spec.ts \
  tests/playwright/detail-dropdown-focus-return.spec.ts \
  tests/playwright/save-toolbar-no-overlap.spec.ts \
  tests/playwright/right-sidebar-popover-boundaries.spec.ts \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  --project=chromium
```

---

# WAVE 3 — Polish de sidebars y regresiones

## Codex — W3-CODEX-OWNER-TRANSFORM-FOCUS

Owned:

```txt
src/sisad-pdfme/recipients/recipientColorResolver.ts
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
tests de owner color
tests de transformación/page anchors
tests de focus return
```

Objetivos:

```txt
- una fuente de owner color;
- no confundir owner con selected;
- Canvas/ListView/DetailHeader deben resolver el mismo tono;
- no cambiar coordinates para adaptar un expected;
- clasificar transform failures antes de modificar producción;
- reparar focus sin blur global.
```

Si para completar el owner color necesita tocar `ListView Item` o `DetailHeader`,
debe solicitar handoff a Claude y no editar esos archivos.

## Claude — W3-CLAUDE-RIGHT-SIDEBAR-POLISH

Owned:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/**
tests/playwright/right-sidebar-visual-polish.spec.ts
tests/playwright/list-view-regression.spec.ts
tests/playwright/documents-rail-document-page-hierarchy.spec.ts
```

Objetivos:

```txt
- owner accent separado del selected state;
- delete contextual;
- densidades 56/48/40 aproximadas;
- compactar DetailView;
- radios máximos de 12 px;
- sin min-height artificial;
- selectores con popup controlado y focus restore;
- jerarquía documento→páginas;
- upload sin recorte;
- delete dentro de fila;
- tabs sin wrap.
```

No tocar:

```txt
recipient resolvers owned por Codex
LeftSidebar/**
Designer/index.tsx salvo bug demostrado de su Wave 2
```

## Copilot — W3-COPILOT-RAILS-A11Y-VISUAL

Owned:

```txt
componentes de rail compartidos que NO estén dentro de RightSidebar/shared
tests/playwright/sidebar-rail-collapse-actions.spec.ts
tests/playwright/sidebar-collapse-parity.spec.ts
tests/playwright/visual/**
tests de accesibilidad LeftSidebar/lab
src/features/pdfcomponent/**
```

Objetivos:

```txt
- rails de 44 px;
- tooltips y aria-label;
- active indicator común;
- restore de panel solicitado;
- no perder zoom/selección/página;
- actualizar baseline visual solo después de confirmar que el cambio es intencional;
- no modificar expected funcional.
```

Si el rail compartido real está dentro de `RightSidebar/shared`, Claude conserva
ownership y Copilot se limita a tests y host.

## Gate Wave 3

```bash
git cherry-pick <CODEX-W3-SHA>
git cherry-pick <COPILOT-W3-SHA>
git cherry-pick <CLAUDE-W3-SHA>
```

Barrido:

```bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
```

---

# WAVE 4 — runtimeStyles y cierre

Esta wave no se ejecuta en paralelo sobre el mismo archivo.

## Claude — W4-CLAUDE-RUNTIME-STYLES

Único owner:

```txt
src/sisad-pdfme/ui/runtimeStyles.ts
```

Apoyo de lectura:

```txt
Root.tsx
componentes ya migrados
resultados de rg
```

Objetivo:

Clasificar cada bloque:

```txt
KEEP_TECHNICAL
MIGRATE_TO_TAILWIND
DELETE_DEAD
```

Reglas:

```txt
- no mover geometría crítica;
- no mover selectores de nodos de terceros sin reemplazo;
- eliminar skin visual ya expresado en TSX;
- no crear otro archivo CSS;
- no agregar @apply;
- documentar cada bloque técnico que queda.
```

Codex y Copilot no editan código durante este archivo. Pueden ejecutar pruebas y
reportar regresiones desde sus worktrees actualizados.

---

# 5. Prompt específico — Codex 4.5 mini

Pega después del prompt común:

```txt
ROL
Eres el ejecutor técnico focal del equipo.

TU FORTALEZA EN ESTE PLAN
- correcciones pequeñas y verificables;
- hooks;
- memoización;
- overlays del Canvas;
- interacción;
- owner/access resolvers;
- pruebas unitarias y Playwright focales.

NO HAGAS
- rediseño global;
- auditoría arquitectónica;
- refactor masivo;
- cambios de copy o jerarquía visual no indicados;
- edición del RightSidebar o LeftSidebar fuera de tus owned paths.

MÉTODO
1. Lee la wave activa.
2. Reclama el lock.
3. Abre únicamente los archivos owned y tests directos.
4. Reproduce el fallo focal.
5. Implementa la corrección mínima que preserve contratos.
6. Ejecuta lint y tests focales.
7. Crea commit atómico.
8. Entrega handoff con SHA.

PRIORIDAD
Correctitud primero. No intentes mejorar la apariencia fuera de tu scope.

Cuando una prueba revele un problema de otra área, no la adaptes: documenta el
owner correcto y continúa.
```

---

# 6. Prompt específico — Claude 4.8 Outputs

Pega después del prompt común:

```txt
ROL
Eres el arquitecto de UX, responsable del RightSidebar, DetailView, workspace
global y también integrador local de las ramas.

TU FORTALEZA EN ESTE PLAN
- composición visual;
- jerarquía;
- contratos de scroll;
- Tailwind en TSX;
- coordinación entre paneles;
- resolución de conflictos semánticos;
- integración final.

NO HAGAS
- otra auditoría completa;
- un nuevo plan;
- reescritura del Designer;
- cambios amplios en Canvas;
- limpieza de archivos owned por Copilot;
- correcciones de owner resolver owned por Codex sin handoff.

MÉTODO DE IMPLEMENTACIÓN
1. Ejecuta únicamente la wave activa.
2. Mantén una sola fuente de scroll, acciones y estado.
3. Usa Tailwind inline en componentes.
4. Conserva CommandBus, ActionRegistry, testIds y contratos públicos.
5. No crees wrappers visuales sin responsabilidad.
6. Haz commits pequeños.

MÉTODO DE INTEGRACIÓN
Usa exclusivamente:
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge

Antes de cherry-pick:
- lee los tres handoffs;
- confirma que no existen archivos modificados por dos agentes;
- confirma tests focales.

Orden:
1. Codex.
2. Copilot.
3. Claude.

Si aparece un conflicto:
- no elijas automáticamente “ours” o “theirs”;
- resuelve según ownership y plan;
- conserva ambas correcciones cuando sean ortogonales;
- registra la resolución en:
  ai/coordination/uxqa-20260717/handoffs/CLAUDE-INTEGRATION-<wave>.md

Después de integrar:
- ejecuta gate completo de la wave;
- corrige solo fallos de integración;
- no absorbas deuda de otra wave;
- actualiza la rama de integración;
- informa los SHAs integrados.
```

---

# 7. Prompt específico — GitHub Copilot Auto

Pega en Copilot Chat/Agent Mode después del prompt común:

```txt
ROL
Eres el pair programmer de producción para componentes acotados, limpieza de
lint, host del laboratorio, LeftSidebar, accesibilidad y pruebas visuales.

TU FORTALEZA EN ESTE PLAN
- cambios repetitivos y consistentes;
- Tailwind local;
- accesibilidad;
- limpieza de imports;
- ajustes de tests;
- componentes del host;
- LeftSidebar.

NO HAGAS
- análisis de todo el repositorio;
- refactors automáticos fuera de los archivos owned;
- “Fix all” global;
- edición del RightSidebar;
- edición de Canvas coordinates;
- edición del runtime React;
- creación de CSS;
- recreación de wrappers eliminados.

CONFIGURACIÓN DE TRABAJO
Abre únicamente el workspace:
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

Antes de aceptar una edición sugerida:
- verifica la ruta;
- verifica que esté en owned paths;
- revisa el diff;
- rechaza cualquier cambio colateral.

MÉTODO
1. Usa instrucciones precisas por archivo.
2. No generes cambios masivos desde Problems.
3. Corrige warnings por familia.
4. Ejecuta ESLint sobre los archivos modificados.
5. Ejecuta los tests directos.
6. Haz commit atómico.
7. Escribe handoff con SHA.

Para Tailwind:
- una sola superficie visible;
- baja densidad;
- border-solid por preflight false;
- sin shadow permanente;
- sin clases dinámicas que Tailwind no pueda detectar;
- usa mergeClassNames o arrays estáticos existentes.
```

---

# 8. Formato obligatorio de handoff

```md
# HANDOFF — <AGENTE> — <WAVE> — <TASK-ID>

## Estado
completed | blocked | partial

## Commit
<sha>

## Objetivo ejecutado
...

## Archivos modificados
- ruta
- ruta

## Cambios funcionales
- ...

## Cambios visuales
- ...

## Contratos preservados
- selección
- owner
- document routing
- locks
- testIds
- CommandBus

## Validación
```bash
comando
```

Resultado:
```txt
exit code / tests passed / tests failed
```

## Fallos fuera de alcance
- archivo
- owner recomendado
- evidencia

## Riesgos
- ...

## Próximo paso permitido
...
```

---

# 9. Reglas de merge sin colisiones

Antes de integrar una wave:

```bash
git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717
git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717
git diff --name-only ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717
```

Detectar intersecciones:

```bash
comm -12 \
  <(git diff --name-only ai/uxqa-integration-20260717..ai/codex-uxqa-20260717 | sort) \
  <(git diff --name-only ai/uxqa-integration-20260717..ai/claude-uxqa-20260717 | sort)
```

Repetir para los tres pares.

Si existe una intersección no autorizada:

```txt
NO MERGE
```

El agente que no era owner debe revertir únicamente ese archivo en su rama y
volver a entregar un commit limpio.

---

# 10. Criterio de cierre del equipo

La ejecución se considera terminada únicamente cuando:

```txt
[ ] DetailView alcanza la última sección.
[ ] Campos, Detalle, Docs y Comentarios tienen scroll estable.
[ ] Guardar no se solapa con switcher ni rails.
[ ] Menú global y menús locales están separados.
[ ] LeftSidebar no hace parecer seleccionados todos los plugins.
[ ] ListView separa owner, hover, selected, focus y lock.
[ ] DocumentsRail distingue documentos y páginas.
[ ] Toolbar contextual no cubre schemas.
[ ] Rails restauran panel, zoom, página y selección.
[ ] Owner color coincide en Canvas, ListView y DetailHeader.
[ ] npm run lint no tiene errores.
[ ] src no tiene warnings.
[ ] build pasa.
[ ] Vitest pasa.
[ ] Playwright pasa o cada fallo restante tiene owner, evidencia y task-card.
[ ] No se creó CSS visual nuevo.
[ ] runtimeStyles.ts conserva solamente CSS técnico documentado.
```

---

# 11. Mensaje corto de arranque para el equipo

Usar este mensaje en las tres sesiones después de cargar los prompts:

```txt
Inicia la Wave 1 del plan multiagente.

No realices auditoría ni otro plan.
Trabaja solo en tu worktree y owned paths.
Lee el plan autoritativo y OWNERSHIP.md.
Crea tu lock, implementa tu tarea asignada, valida con pruebas focales, crea un
commit atómico y entrega el handoff con SHA.

No hagas merge.
Claude integrará la wave únicamente después de recibir los tres handoffs.
```

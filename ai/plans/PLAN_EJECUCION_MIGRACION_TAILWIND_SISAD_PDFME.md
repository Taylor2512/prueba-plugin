# PLAN DE EJECUCIÓN — Migración total de Tailwind desde CSS hacia JSX/TSX

## 1. Propósito

Completar la migración visual de SISAD PDFME sin repetir análisis ya cerrados, sin ejecutar validaciones costosas después de cada microcambio y sin eliminar CSS técnico necesario.

Este plan parte del estado más reciente disponible:

| Archivo                                       | Estado aproximado reportado |
| --------------------------------------------- | --------------------------: |
| `src/features/pdfcomponent/labRoutes.css`   |                   5 líneas |
| `src/sisad-pdfme/ui/styles/sisad-pdfme.css` |                2484 líneas |
| `src/sisad-pdfme/ui/styles/tokens.css`      |                 323 líneas |
| `src/styles/sisad-tailwind-bridge.css`      |                      vacío |
| `src/style.css`                             |                neutralizado |
| `src/styles/tailwind.css`                   |   fuente única de Tailwind |

Estas cifras deben volver a medirse al comenzar porque el repositorio puede haber cambiado.

## 2. Diagnóstico del retraso

El proceso anterior está demorando por cuatro razones:

1. Se trabaja en componentes individuales o pares de componentes.
2. Se ejecutan build y las mismas pruebas después de cada microcambio.
3. Se vuelve a cargar contexto y documentación en cada turno.
4. Se actualizan task-cards y memoria después de cambios demasiado pequeños.

La solución será trabajar con:

```txt
1 task-card activa
→ paquetes funcionales
→ subpases de máximo 5 archivos
→ validación única al final del paquete
→ actualización documental única
```

## 3. Restricciones del repositorio

La arquitectura IA actual exige:

```txt
una sola task-card activa;
máximo 2 búsquedas globales por subpase;
máximo 8 archivos abiertos;
máximo 5 archivos modificados;
no tocar geometría protegida sin tarea explícita.
```

El plan no elimina estos guardrails. Los usa así:

```txt
Paquete funcional
├── Subpase A: hasta 5 archivos
├── Subpase B: hasta 5 archivos
├── Subpase C: hasta 5 archivos
└── Gate de validación único
```

## 4. Preparación

### 4.1 Cerrar o delimitar la tarea activa

Revisar:

```txt
ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md
```

Decisión:

- Si aún contiene regresiones visuales abiertas, terminar únicamente esos criterios.
- Si el baseline visual ya está recuperado, moverla a completadas.
- Crear una sola tarea activa nueva:

```txt
ai/task-cards/active/TASK-CSS-024-accelerated-tailwind-inline-decommission.md
```

No mantener `TASK-REGRESSION-021` y `TASK-CSS-024` activas simultáneamente.

### 4.2 Crear evidencia inicial

Generar:

```txt
reports/tailwind-migration/accelerated/
├── css-lines-before.txt
├── apply-before.txt
├── selector-inventory.txt
├── constants-consumers.txt
├── migration-map.csv
└── migration-ledger.md
```

### 4.3 Ejecutar inventarios existentes

```bash
node scripts/css-inventory.mjs
node scripts/css-selector-duplicates.mjs
node scripts/css-active-selector-audit.mjs
```

Revisar el script:

```txt
scripts/migrate-design-to-tailwind.mjs
```

Usarlo únicamente si posee modo seguro de reporte o generación de candidatos. No permitir reemplazos automáticos no revisados.

## 5. Matriz de decisión

| Tipo de regla                  | Destino                    |
| ------------------------------ | -------------------------- |
| Flex, grid, gap, padding, skin | JSX/TSX                    |
| Hover, focus, selected local   | JSX/TSX                    |
| Responsive local               | JSX/TSX                    |
| Token compartido               | `tokens.css`             |
| Variable consumida por JS      | `tokens.css` o constante |
| Ant Design descendant selector | CSS técnico               |
| Moveable/Selecto               | CSS técnico               |
| Canvas/paper geometry          | CSS técnico               |
| Print/keyframes                | CSS técnico               |
| Selector sin consumidor        | eliminar con evidencia     |

## 6. Fases y paquetes

---

## FASE A — Inventario y cierre del baseline

### A1. Medición

Ejecutar:

```bash
wc -l \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css

rg -c "@apply" \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css
```

### A2. Auditoría de constantes

Auditar consumidores de:

```txt
DESIGNER_CLASSNAME
UI_CLASSNAME
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
```

Resultado:

```txt
reports/tailwind-migration/accelerated/constants-contract.md
```

Debe indicar para cada constante:

```txt
tipo
consumidores
si afecta geometría
si puede migrarse
si debe conservarse
riesgo
```

### A3. Gate

No modificar UI en esta fase.

Entregable:

```txt
mapa completo priorizado
```

---

## FASE B — RightSidebar residual

El registro muestra que ya se han trabajado:

```txt
SidebarSurfacePrimitives
DocumentsRail
ListViewToolbar
DetailHeaderCard
InspectorPrimitives
CompactConfigPanel
SchemaConnectionsWidget
SchemaOptionsEditor
InspectorDefinitionList
SchemaCollaborationWidget
SchemaConnectionsShared
```

Por tanto, esta fase no debe repetir el diseño de esos componentes. Debe buscar únicamente:

```txt
selectores CSS todavía activos;
media queries asociadas;
duplicados;
descendientes AntD;
componentes no migrados;
regresiones visibles.
```

### B1. ListView

Archivos candidatos:

```txt
RightSidebar/ListView/ListView.tsx
RightSidebar/ListView/Item.tsx
RightSidebar/ListView/SelectableSortableContainer.tsx
RightSidebar/ListView/ListViewDragOverlay.tsx
RightSidebar/ListView/ListViewToolbar.tsx
```

Objetivos:

```txt
fila plana
sin borde negro
sin card anidada
acciones estables
badges compactos
scroll correcto
overlay consistente
```

### B2. DetailView residual

Trabajar por grupos de hasta 5 archivos:

```txt
DetailViewContent
DetailFormSection
detail widgets restantes
primitives no migradas
headers y context strips residuales
```

### B3. Poda CSS del paquete

Eliminar únicamente selectores trasladados o huérfanos demostrados.

### B4. Gate

```bash
npm run build

npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts
```

Criterio de salida:

```txt
RightSidebar visualmente estable;
sin selectores visuales duplicados conocidos;
scroll y tabs intactos.
```

---

## FASE C — LeftSidebar

Esta fase absorbe los pendientes equivalentes a CSS-021 y CSS-022.

### C1. Separar conceptos

No mezclar:

```txt
catalog layout: list / tiles / icons
density: comfortable / compact / minimal
sidebar width
collapsed state
```

### C2. Componentes

Subpase 1:

```txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
```

Subpase 2:

```txt
LeftSidebarCustomPanel.tsx
LeftSidebarCustomFieldModal.tsx
useLeftSidebarCatalogState.ts
SidebarRail.tsx
SidebarCollapseHandle.tsx
```

### C3. Riesgos

Validar:

```txt
scroll durante drag
botón collapse recortado
overflow horizontal
vista compact convertida en una columna
tarjetas anidadas
modo icon-only
persistencia de layout elegido
```

### C4. Gate

```bash
npm run build
```

Ejecutar specs existentes de LeftSidebar y una validación visual de:

```txt
abierto
colapsado
list
tiles
icons
drag activo
```

---

## FASE D — Toolbar, topbar, zoom y rails

### D1. Componentes

```txt
CtlBar.tsx
Designer/index.tsx
UnitPager.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
```

### D2. Contratos

No reemplazar ciegamente:

```txt
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
DEFAULT_MAX_ZOOM
```

### D3. Validaciones

```txt
zoom visible en porcentaje
botones compactos
tooltips
tabs
collapse
navegación de página
preservación del centro del PDF
```

### D4. Gate ampliado

```bash
npm run build
npx playwright test
```

Usar suite amplia porque esta fase toca controles transversales.

---

## FASE E — Lab host

El inventario más reciente reporta `labRoutes.css` con aproximadamente 5 líneas. Por ello esta fase es de verificación, no de refactor grande.

### E1. Comprobar contenido real

```bash
cat src/features/pdfcomponent/labRoutes.css
rg -n "@apply|sisad-pdfme-lab-" src/features/pdfcomponent/labRoutes.css
```

### E2. Decisión

- Si contiene únicamente comentarios: eliminar archivo e import.
- Si contiene reglas residuales: moverlas al componente propietario.
- Si contiene un contrato técnico: documentarlo y conservarlo.

### E3. Componentes

```txt
PdfmeLabPage.jsx
PageHeader.jsx
ResultsPanel.jsx
CompactControls.jsx
PopoverMenu.jsx
CaseCard.jsx
LabLandingPage.jsx
```

### E4. Gate

```bash
npm run build

npx playwright test \
  tests/playwright/multi-document-routing-design.spec.ts \
  tests/playwright/lab-designer-visual-baseline-regression.spec.ts
```

---

## FASE F — Form y Viewer

### F1. Archivos

```txt
Form.tsx
Viewer.tsx
Preview.tsx
RuntimeFormPanel.tsx
Root.tsx
ErrorScreen.tsx
Spinner.tsx
UnitPager.tsx
```

### F2. No tocar

```txt
input mapping
recipient filtering
schema access
validation
snapshot
PDF generation
```

### F3. Validar

```txt
form editable
viewer readonly
required
hidden
readonly
owner filtering
multi-document
responsive
```

### F4. Gate ampliado

```bash
npm run build
npx playwright test
```

---

## FASE G — Poda técnica de `sisad-pdfme.css`

### G1. Auditoría final

Clasificar cada bloque residual:

```txt
ANTD
CANVAS
PAPER
MOVEABLE
SELECTO
DRAG
PRINT
KEYFRAMES
RUNTIME_GLOBAL
ORPHAN
```

### G2. Reorganización

Ordenar el archivo y agregar encabezados claros.

### G3. Prohibición

No mover CSS técnico a JSX solo para reducir líneas.

### G4. Resultado esperado

```txt
sisad-pdfme.css ya no contiene cards, headers, toolbar, sidebars o widgets visuales trasladables;
cada bloque residual tiene una justificación técnica.
```

---

## FASE H — Tokens

### H1. Auditoría de consumidores

Por cada variable:

```bash
rg -n --fixed-strings -- "--token-name" src
```

### H2. Clasificación

```txt
ACTIVE_SHARED
ACTIVE_RUNTIME
ALIAS_REQUIRED
DEPRECATED_WITH_CONSUMERS
ORPHAN
```

### H3. Acción

- Mantener las tres primeras.
- Migrar consumidores antes de eliminar deprecated.
- Eliminar orphan.
- No reemplazar owner colors dinámicos por paleta estática.

---

## FASE I — Cierre y regresión

### I1. Métricas finales

Generar:

```txt
css-lines-after.txt
apply-after.txt
selector-inventory-after.txt
constants-contract-final.md
residual-css-justification.md
migration-summary.md
```

### I2. Comparación

Reportar:

```txt
líneas antes/después
@apply antes/después
selectores eliminados
selectores conservados
componentes migrados
tokens eliminados
CSS técnico residual
```

### I3. QA final

```bash
npm run build
npx playwright test
```

### I4. Revisión manual

Validar en:

```txt
http://localhost:5174/lab/multi-document-routing
```

Escenarios:

```txt
LeftSidebar abierto/colapsado
RightSidebar abierto/colapsado
Campos
Detalle
Docs
Comentarios
selección simple
selección múltiple
drag list
drag canvas
scroll multipágina
zoom
Form
Viewer
ResultsPanel
```

## 7. Criterios de éxito

### Funcionales

```txt
sin regresiones de selección;
sin regresiones de drag;
sin pérdida de scroll;
sin pérdida de acciones;
sin cambios en snapshot;
sin cambios en generator;
```

### Visuales

```txt
densidad consistente;
sin bordes negros inesperados;
sin cards anidadas;
sin iconos recortados;
sin headers duplicados;
sin botones flotantes incoherentes;
```

### Técnicos

```txt
labRoutes.css sin @apply;
sisad-pdfme.css solo con residual técnico;
tokens.css solo con tokens activos;
hooks DESIGNER_CLASSNAME/UI_CLASSNAME conservados;
sin !important nuevo;
sin wrappers decorativos nuevos;
```

## 8. Estimación por paquetes

| Paquete               | Subpases estimados | Gate                      |
| --------------------- | -----------------: | ------------------------- |
| Baseline e inventario |                  1 | reportes                  |
| RightSidebar          |               2–3 | build + 2 specs           |
| LeftSidebar           |                  2 | build + specs del dominio |
| Toolbar/zoom          |               1–2 | build + suite amplia      |
| Lab host              |                  1 | build + 2 specs           |
| Form/Viewer           |               1–2 | build + suite amplia      |
| Poda CSS              |                  2 | build                     |
| Tokens                |                  1 | build                     |
| QA final              |             oi, o1 | suite completa            |

## 9. Regla de continuidad

Después de cada paquete, actualizar una sola vez:

```txt
reports/tailwind-migration/accelerated/migration-ledger.md
ai/task-cards/active/TASK-CSS-024-accelerated-tailwind-inline-decommission.md
```

No actualizar cinco documentos distintos.

No volver a abrir un paquete cerrado salvo que una prueba demuestre una regresión.

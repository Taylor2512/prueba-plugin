# SISAD PDFME — Paquete de tareas: acciones, UI, duplicidad y wrappers

Fecha: 2026-07-15

Este paquete está organizado con la arquitectura real del repo `prueba-plugin`.
No crea carpetas paralelas. Se puede descomprimir sobre la raíz del repositorio para revisar o copiar task-cards, reportes, prompts y scripts sugeridos.

## Diagnóstico ejecutivo

Las capturas muestran que el core ya funciona mejor, pero quedan frentes importantes:

1. **Rail derecho colapsado / panel switcher**
   - El rail colapsado queda visualmente flotante y estrecho.
   - Los iconos de panel no comunican claramente qué panel está activo.
   - El botón Guardar se acerca demasiado al rail derecho.
   - Hay riesgo de solapamiento con la barra lateral del navegador/app.

2. **Acciones sin contrato unificado**
   - Cada botón debe resolver: `visible`, `enabled`, `reason`, `handler`, `testId`, `analytics/event`, `permission`.
   - Todavía hay botones que pueden mostrarse por UI aunque la acción no esté centralizada en CommandBus/ActionRegistry.
   - El objetivo es auditar todos los botones y consolidarlos bajo un mapa único.

3. **Zoom**
   - El menú abre correctamente, pero el trigger puede mostrar `0.9` en vez de `90%`.
   - Debe existir una conversión única entre zoom interno decimal y zoom visible porcentual.

4. **RightSidebar / LeftSidebar**
   - Se observa mejora visual, pero aún hay reglas CSS y wrappers que pueden estar duplicando skin.
   - La migración debe ser Tailwind 3 y no tocar geometría del canvas.

5. **DetailView / estados**
   - Codex avanzó con estados explícitos; falta cerrar consumo único de labels/tones para evitar que reaparezcan estados genéricos como `Bloqueado`.
   - El inspector debe consumir `statusLabel/statusTone` sin reconstruir labels paralelos.

6. **Wrappers innecesarios**
   - Los wrappers públicos (`SisadPdfmeDesigner`, `SisadPdfmeForm`, `SisadPdfmeViewer`) sí son necesarios.
   - Los wrappers internos que solo reenvían props, duplican clases o esconden acciones sin aportar contrato deben ser auditados y reducidos.

## Rutas incluidas

```txt
ai/reports/deep-ui-action-audit-2026-07-15.md
ai/task-cards/active/TASK-ACTIONS-001-button-action-contract-audit.md
ai/task-cards/active/TASK-ACTIONS-002-commandbus-action-registry-unification.md
ai/task-cards/active/TASK-CSS-014-tailwind3-current-ui-dedup-polish.md
ai/task-cards/active/TASK-UI-015-right-left-rail-collapse-polish.md
ai/task-cards/active/TASK-DETAIL-015-access-state-label-sync.md
ai/task-cards/active/TASK-ARCH-004-wrapper-reduction-public-api-hardening.md
ai/task-cards/active/TASK-QA-015-action-coverage-regression-suite.md
ai/task-cards/backlog/TASK-RUNTIME-015-config-hook-visibility-action-map.md
ai/task-cards/backlog/TASK-UI-016-zoom-toolbar-contract.md
ai/context/action-map-context.md
ai/checklists/button-action-contract-checklist.md
ai/prompts/codex-next-pass-actions-ui-dedup.md
docs/03-designer/11-action-contract.md
docs/09-theming/06-tailwind3-selector-dedup-plan.md
scripts/audit-buttons-actions.mjs
scripts/css-active-selector-audit.mjs
```

## Orden recomendado

1. `TASK-ACTIONS-001` — inventariar botones y acciones.
2. `TASK-ACTIONS-002` — unificar ActionRegistry/CommandBus.
3. `TASK-UI-015` — corregir rail colapsado y botones principales.
4. `TASK-CSS-014` — reducir CSS duplicado Tailwind 3 por componente.
5. `TASK-DETAIL-015` — cerrar estados de acceso sin labels paralelos.
6. `TASK-QA-015` — agregar pruebas de cobertura de botones.
7. `TASK-ARCH-004` — reducir wrappers seguros.

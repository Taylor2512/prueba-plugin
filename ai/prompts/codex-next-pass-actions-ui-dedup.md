# Prompt Codex — siguiente pasada UI/actions/dedup

Objetivo:
Auditar y corregir botones, acciones, UI colapsada, duplicidad CSS/Tailwind y wrappers innecesarios en `src/sisad-pdfme`, sin romper la portabilidad del componente.

Proyecto:
`/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`

Antes de editar:
```bash
git status --short
cat ai/start/START.md
cat ai/router/ROUTER.md
cat ai/router/CONTEXT_BUDGET.md
cat ai/memory/project-memory.md
```

Reglas:
- `src/sisad-pdfme` no conoce SISAD-WEB ni ningún host.
- No tocar Moveable.
- No tocar Selecto.
- No tocar geometría PDF/canvas/paper.
- No tocar SnapshotAdapter salvo task-card explícita.
- No tocar Generator/PDF.
- No crear modales paralelos.
- No duplicar recipients ni assignment.
- Tailwind versión 3.
- No usar sintaxis Tailwind 4.
- No crear CSS paralelo.
- No usar reports/candidates como fuente activa.
- No reabrir tareas completed.

Carga de contexto:
```txt
ai/context/action-map-context.md
ai/checklists/button-action-contract-checklist.md
ai/rules/css-migration-rules.md
ai/rules/moveable-selecto-rules.md
ai/playbooks/pb-css-tailwind-migration.md
```

Orden:
1. Ejecutar `TASK-ACTIONS-001`.
2. Solo después, ejecutar `TASK-ACTIONS-002`.
3. Luego `TASK-UI-015`.
4. Luego `TASK-CSS-014`.
5. Luego `TASK-DETAIL-015`.
6. Finalmente `TASK-QA-015`.

Validación mínima por pase:
```bash
npm run build
```

Validación cuando toque UI:
```bash
npx playwright test tests/playwright/canvas-overflow-regression.spec.ts
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
```

Criterio:
No puede quedar ningún botón visible sin handler real, aria-label, testId y estado de acción.

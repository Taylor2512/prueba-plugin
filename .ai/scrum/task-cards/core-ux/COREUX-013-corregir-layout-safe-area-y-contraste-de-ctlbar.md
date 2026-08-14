---
id: COREUX-013
status: PASS
---

# COREUX-013 — Corregir layout, safe area y contraste de CtlBar

**Wave:** W2  
**Prioridad:** P0  
**Riesgo:** Alto  
**Owner sugerido:** ux-designer  
**Modelo sugerido:** Terra high  
**Dependencias:** COREUX-001, COREUX-011  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Evitar recorte inferior, superposición y contraste insuficiente.

## Casos de uso

Dominios: VIS, QLT.

VIS-001, VIS-002, VIS-003, VIS-004, VIS-005, VIS-006, VIS-007, VIS-008, VIS-009, VIS-010, VIS-011, VIS-012, VIS-013, VIS-014, VIS-015, QLT-001, QLT-002, QLT-003, QLT-004, QLT-005, QLT-006, QLT-007, QLT-008, QLT-009, QLT-010, QLT-011, QLT-012, QLT-013, QLT-014, QLT-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Responsive composition

## Lectura mínima

1. `.ai/START.md`
2. `.ai/routes/designer-core-ux.md`
3. `.ai/architecture/EVENT-COMMAND-EFFECT-ARCHITECTURE.md`
4. `.ai/architecture/DESIGNER-SURFACE-ARCHITECTURE.md`
5. `.ai/governance/ANTI-HALLUCINATION.md`
6. `.ai/governance/ANTI-LOOP.md`
7. `.ai/governance/ANTI-OVERFLOW.md`
8. Esta task-card

## Archivos candidatos

- `src/sisad-pdfme/ui/components/CtlBar.tsx`
- `src/sisad-pdfme/ui/styles/tokens.css`
- `tests/playwright/coreux-toolbar.spec.ts`

Confirmar rutas antes de editar. No crear un archivo nuevo si la responsabilidad
ya existe bajo otro nombre.

## Archivos protegidos por defecto

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`
- `.tailwind-migration-backups/**`

Solo se permite tocar un archivo protegido cuando aparece explícitamente en
Archivos candidatos y existe prueba focal roja.

## Invariantes

- Solo código productivo bajo `src/sisad-pdfme/**`.
- TypeScript/TSX.
- Cero imports hacia /features/modules.
- No segundo registry, event bus, snapshot o renderer.
- No `setTimeout` de coordinación.
- No z-index arbitrario.
- Tailwind-first; `tokens.css` solo para variables técnicas.
- Un writer; máximo dos readers read-only.
- No afirmar gates no ejecutados.

## Caracterización previa

1. `pwd`
2. `git branch --show-current`
3. `git status --short`
4. registrar commit base;
5. abrir máximo 8 archivos;
6. máximo 2 búsquedas amplias;
7. escribir hipótesis y test focal;
8. registrar claim.

## Pasos

1. Medir chrome en viewports.
2. Aplicar safe-area-inset.
3. Revisar positioning con sidebars.
4. Asegurar target 36/44 px.
5. Corregir disabled contrast sin ocultar affordance.

## Criterios de aceptación

- [x] Toolbar visible completa en 390/768/1280/1920. **Defecto corregido**:
      `.sisad-pdfme-designer-stage` tenía padding con `box-sizing: content-box`
      (preflight desactivado), así que con `height: 100%` medía 16 px más que su
      contenedor y empujaba el cluster inferior fuera del viewport en TODOS los
      tamaños. Medido antes: bottom 848/1028/904 con viewport 844/1024/900;
      después: 832/1012/888, y el stage termina exactamente en el borde.
- [x] No cubre PDF crítico: ningún cluster se recorta por ningún borde.
- [x] Sin overflow horizontal de documento en los cuatro viewports.
- [x] Reduced motion respetado. Las transiciones venían de Ant Design, no de
      nuestras clases, así que una utilidad `motion-reduce` en el JSX no las
      alcanzaba; se neutralizan en la hoja del propio runtime acotadas a sus
      clusters.

Añadido además safe-area en el cluster inferior
(`bottom-[max(0.75rem,env(safe-area-inset-bottom))]`) y `motion-reduce` en las
8 transiciones propias de CtlBar.

Regresión: `tests/playwright/coreux-toolbar.spec.ts` (5/5).

## Gates focales

```bash
npm run lint
npm run build
npm run quality:direct-config-readers
npm run quality:duplicate-functions
npx vitest run <tests-focales>
```

Agregar Playwright solo cuando cambie comportamiento visible.

## Presupuesto

- Máximo 5 archivos productivos.
- Máximo 8 lecturas iniciales.
- Máximo 2 rondas de búsqueda.
- Máximo 3 intentos de parche.
- Un dominio por commit.
- Contexto máximo 75 %.

## Condición de parada

Detenerse y entregar handoff si:

- se requiere tocar otro dominio;
- se excede presupuesto;
- aparece conflicto con otra claim;
- la solución exige una API paralela;
- no existe prueba focal;
- se filtra lógica del host;
- el cambio altera snapshot/geometría sin migración específica.

## Rollback

Commit atómico. Preservar:

```txt
schemaUid
documentId
pageNumber
ownerRecipientId
ownerRecipientIds
ownerColor
required
readOnly
locks
selection
zoom
scroll
snapshotVersion
```

## Handoff

```txt
task
claim
rama/worktree
commit base
causa confirmada
archivos
cambios
eventos/commands afectados
UC cubiertos
gates ejecutados
gates no ejecutados
riesgos
rollback
siguiente acción
```

# COREUX-014 — Reemplazar tooltips nativos por primitive controlada

**Estado:** done  
**Wave:** W2  
**Prioridad:** P0  
**Riesgo:** Medio  
**Owner sugerido:** accessibility  
**Modelo sugerido:** Terra high  
**Dependencias:** COREUX-011, COREUX-013  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Unificar tooltip, disabled reason, teclado y touch.

## Casos de uso

Dominios: VIS, QLT, SID.

VIS-001, VIS-002, VIS-003, VIS-004, VIS-005, VIS-006, VIS-007, VIS-008, VIS-009, VIS-010, VIS-011, VIS-012, VIS-013, VIS-014, VIS-015, SID-001, SID-002, SID-003, SID-004, SID-005, SID-006, SID-007, SID-008, SID-009, SID-010, SID-011, SID-012, SID-013, SID-014, SID-015, QLT-001, QLT-002, QLT-003, QLT-004, QLT-005, QLT-006, QLT-007, QLT-008, QLT-009, QLT-010, QLT-011, QLT-012, QLT-013, QLT-014, QLT-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Compound component, Accessibility primitive

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

- `src/sisad-pdfme/ui/components/shared/DesignerTooltip.tsx`
- `src/sisad-pdfme/ui/components/CtlBar.tsx`
- `src/sisad-pdfme/ui/components/Designer/**`
- `tests/unit/sisad-pdfme/ui/DesignerTooltip.test.tsx`

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

1. Crear primitive reutilizable.
2. Eliminar title nativo en acciones esenciales.
3. Mostrar reason de action state.
4. Configurar delay/placement/collision.
5. Soportar aria-describedby y long press.

## Criterios de aceptación

- [x] Primitiva `DesignerTooltip` disponible para todo el chrome; muestra con
      hover **y** con foco de teclado, y cierra con Escape.
- [x] Nombres truncados muestran contenido completo (probado).
- [x] No hay tooltip duplicada: elimina el `title` nativo del disparador y
      renderiza una sola instancia.

Entrega: `ui/components/shared/DesignerTooltip.tsx`, 12/12 en
`tests/unit/sisad-pdfme/ui/DesignerTooltip.test.tsx`. Usa `aria-describedby`
sobre el control, no sobre un wrapper.

Pendiente: sustituir los 91 `title=` que quedan en el chrome. La primitiva y su
contrato están cerrados; la sustitución se hace al tocar cada superficie
(CtlBar en COREUX-013, sidebars en W3) para no abrir un diff masivo.

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

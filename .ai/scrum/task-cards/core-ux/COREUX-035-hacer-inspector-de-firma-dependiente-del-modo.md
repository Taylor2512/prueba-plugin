---
id: COREUX-035
status: BACKLOG
---

# COREUX-035 — Hacer inspector de firma dependiente del modo

**Wave:** W4  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** schema-specialist  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-029, COREUX-030  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Mostrar provider/status/capabilities solo cuando corresponda.

## Casos de uso

Dominios: INS, SCH, RUN, EVT.

EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, INS-001, INS-002, INS-003, INS-004, INS-005, INS-006, INS-007, INS-008, INS-009, INS-010, INS-011, INS-012, INS-013, INS-014, INS-015, SCH-001, SCH-002, SCH-003, SCH-004, SCH-005, SCH-006, SCH-007, SCH-008, SCH-009, SCH-010, SCH-011, SCH-012, SCH-013, SCH-014, SCH-015, RUN-001, RUN-002, RUN-003, RUN-004, RUN-005, RUN-006, RUN-007, RUN-008, RUN-009, RUN-010, RUN-011, RUN-012, RUN-013, RUN-014, RUN-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Strategy, Registry

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

- `src/sisad-pdfme/schemas/signature/propPanel.ts`
- `src/sisad-pdfme/config/schemaConfigurationProfile.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**`
- `tests/unit/sisad-pdfme/signature/**`

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

1. Definir visibility por draw/image/p12/provider.
2. Derivar capabilities.
3. Separar dateSigned automático de date manual.
4. Validar required/readOnly.
5. Emitir signature request.

## Criterios de aceptación

- [ ] Draw no muestra provider.
- [ ] Provider inválido falla explicablemente.
- [ ] DateSigned readonly/auto.
- [ ] Sin switches contradictorios.

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

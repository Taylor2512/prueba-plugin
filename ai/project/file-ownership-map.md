# Mapa de propiedad de archivos

## Propiedad lógica estable

| Área | Rutas principales | Agente lógico |
|---|---|---|
| Designer runtime | `src/sisad-pdfme/ui/Designer.tsx`, `ui/components/Designer/index.tsx` | designer-runtime-agent |
| Canvas | `ui/components/Designer/Canvas/**` | canvas-agent |
| Moveable/Selecto | `Canvas/Moveable.tsx`, `Canvas/Selecto.tsx` | interaction-agent |
| Interacción compartida | `ui/components/Designer/shared/interaction*`, `selection*`, `transform*` | interaction-agent |
| Schemas | `src/sisad-pdfme/schemas/**` | schema-agent |
| Inspector | `RightSidebar/DetailView/**` | inspector-agent |
| ListView | `RightSidebar/ListView/**` | inspector-agent |
| Documents/Comments rail | `RightSidebar/DocumentsRail.tsx`, `CommentsRail.tsx` | inspector-agent |
| Colaboración/ownership | `collaboration/**`, `recipients/**`, `schemaOwnershipAppearance.ts` | designer-runtime-agent |
| Labs | `src/features/pdfcomponent/**` | lab-shell-agent |
| Runtime React | `src/sisad-pdfme/react/**`, `runtime/**` | designer-runtime-agent |
| Snapshot | `shared/snapshot*`, metadata/migration | snapshot-agent |
| Generator/PDF | `generator/**`, `pdf-lib/**` | schema-agent con task-card explícita |
| CSS/Tailwind | JSX/TSX visual, `ui/styles/**`, `src/styles/**`, `runtimeStyles.ts` | css-tailwind-agent |
| QA visual | `tests/playwright/**`, baselines | visual-baseline-agent |
| AI docs | `ai/**` | docs-architecture-agent |

## Propiedad de ejecución

La propiedad real de una wave se declara en:

```txt
ai/coordination/worktrees/OWNERSHIP.md
ai/coordination/worktrees/WAVE-<n>.md
```

La asignación de proveedor no cambia el dueño lógico.

## Archivos transversales

Estos archivos requieren ownership exclusivo por wave:

```txt
package.json
package-lock.json
vitest.config.ts
playwright.config.ts
tailwind.config.js
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/runtimeStyles.ts
```

No se modifican en dos ramas durante la misma wave.

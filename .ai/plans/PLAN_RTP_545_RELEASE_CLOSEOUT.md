status: PLAN

# RTP-545 — Plan reducido para cerrar release closeout (slices iniciales)

Objetivo: reducir TS errors a 0 en archivos de la propiedad del proyecto y completar gates mínimos (lint, build, tests focales).

Pasos iniciales (slices)

1) UI Select props (Slice A)
 - Archivos: `SchemaConnectionsWidget.tsx`, `SchemaCollaborationWidget.tsx`, `InspectorPrimitives.tsx`.
 - Cambios: añadir `name?: string` a los tipos `SelectProps` wrapper o crear `FormSelect` que acepte `name` y reutilizar en estos componentes.
 - Status: COMPLETE (FormSelect exists and consumers forward `name`; duplicated owner selector consolidated in SchemaCollaborationWidget)

2) normalizeOptionGroupOptions (Slice B)
 - Archivo: `SchemaOptionsEditor.tsx` y `schemas/options/*`.
 - Cambios: centralizar casteo `unknown[] as OptionItem[]` dentro de `normalizeOptionGroupOptions` y usarlo.
 - Status: IN_PROGRESS (normalizer `normalizeOptionsFromSource` implemented; verify all callers use `normalizeOptionGroupOptions` and remove casts)

3) Zod schema alignment (Slice C)
 - Archivos: `shared/schemaMigration.ts`, `schemas/*`.
 - Cambios: admitir `id?: string` en schemas de UI cuando safe y actualizar productores.
 - Status: TODO (requires schema contract review; low-risk edits prioritized after tests)

Evidencia/PR policy

- Cada slice: max 5 archivos productivos.  
- Ejecutar `npx tsc --noEmit` y `npm test` antes de solicitar revisión.
- Reclamar paths con `scripts/ai/same-repo-coordinator.mjs claim` antes de editar.

Solicito permiso para proceder con Slice A y preparar el patch.

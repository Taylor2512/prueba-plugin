<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Source of truth: .ai/ -->


# Prompt: generate-final-implementation-report

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, editores PDF, canvas interactions, Moveable, Selecto, Playwright, Vitest y diseño de sistemas configurables.

## Objetivo

Generar reporte final con cambios, tests y riesgos.

## Contexto obligatorio

Antes de editar, lee:

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/rules/global-rules.md`
- `.ai/context/recipient-transform-context.md`
- `.ai/architecture/agent-routing.md`

## Archivos candidatos

- `src/sisad-pdfme/context/RecipientContext.ts`
- `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `tests/unit/*`
- `tests/playwright/*`
- `docs/*`

## Reglas específicas

1. Cada usuario/destinatario de pruebas debe tener color único.
2. El color del destinatario activo debe cambiar iconos del catálogo de schemas.
3. El color owner de schemas existentes no debe cambiar al cambiar destinatario activo.
4. Resize, rotate y drag deben funcionar con schema seleccionado.
5. Selecto no debe iniciar selección múltiple durante resize/rotate.
6. Inline edit no debe abrir durante transform activo.
7. Context menu no debe abrir durante transform activo.
8. Shortcuts no deben ejecutarse dentro de inputs, textareas, selects ni contenteditable.
9. No hardcodear colores fuera de fixtures o palette central.
10. No usar delays arbitrarios para arreglar tests.

## Tests mínimos esperados

- Unit test para paleta única.
- Unit test para ownerColor persistido.
- Unit test para normalizeRotate/transform state si aplica.
- Playwright para cambio de destinatario activo y color de iconos.
- Playwright para schema creado conserva ownerColor.
- Playwright para resize/rotate sin colisiones.

## Entregable obligatorio

```md
# Resultado

## Diagnóstico

## Cambios realizados

## Tests agregados o actualizados

## Comandos ejecutados

## Riesgos residuales

## Documentación actualizada
```

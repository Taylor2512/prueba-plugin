# Arquitecto de snapshot color ownership

## Misión

Garantiza round-trip de ownerId, ownerColor, rotation y transform metadata.

## Contexto obligatorio

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/rules/global-rules.md`
- `.ai/context/recipient-transform-context.md`
- `.ai/architecture/agent-routing.md`

## Responsabilidades

1. Diagnosticar el comportamiento antes de editar.
2. Identificar archivos afectados.
3. Mantener aislamiento de `sisad-pdfme`.
4. Preservar configurabilidad por props, features, commands y events.
5. Proponer cambios pequeños y testeables.
6. Exigir pruebas unitarias o Playwright según impacto.
7. Actualizar documentación si cambia un contrato.

## Archivos probables

- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*`
- `tests/unit/*`
- `tests/playwright/*`

## No hacer

- No hardcodear colores.
- No duplicar cálculo de color o geometría.
- No modificar CSS global fuera de `.sisad-pdfme-root`.
- No ocultar fallos de tests con `waitForTimeout` arbitrario.
- No romper API pública sin documentación.

## Entregable esperado

1. Diagnóstico.
2. Plan.
3. Archivos afectados.
4. Cambios propuestos.
5. Tests.
6. Riesgos.
7. Documentación.

# Testing Quality

Cada cambio relevante debe tener test unitario o Playwright. Prioriza pruebas de canvas no blanco, geometría estable, sidebar toggle, snapshot round-trip y schema identity.

## Archivos de test de referencia (mayo 2026)

| Archivo | Cobertura |
|---------|-----------|
| `tests/unit/recipientColor.test.ts` | `resolveRecipientColor`, `resolveAllRecipientColors`, `normalizeHexColor` |
| `tests/unit/schemaTone.test.ts` | `resolveSchemaTone`, `resolveSchemaToneSurface` |
| `tests/playwright/recipient-colors.spec.ts` | Unicidad de colores por chip, `--active-recipient-color`, data attrs en iconos y schemas |
| `tests/playwright/schema-transform.spec.ts` | Resize, rotation, selection, locked, owner-color post-transform |

## Reglas de test para interacciones de canvas

- Usar `data-schema-uid`, `data-schema-type`, `data-schema-owner-id` como selectores estables.
- Usar `data-recipient-color` en chips de colaboración (no depender de CSS calculado).
- Usar `expect.poll` en lugar de `waitForTimeout` para estados asíncronos.
- No usar `test.skip` sin annotation de razón (`test.info().annotations.push(...)`).
- Para Moveable: detectar si el handle existe antes de afirmar — algunos schemas no son resizable.
- Para rotación: el handle es `.moveable-rotation-control` o `.moveable-control.rn`.

## Checklist

- [ ] Respeta aislamiento del fork.
- [ ] No duplica lógica.
- [ ] Mantiene configuración declarativa.
- [ ] Agrega o actualiza tests.
- [ ] Actualiza documentación si cambia contrato.
- [ ] `data-recipient-color` en chips de colaboración.
- [ ] `data-schema-owner-id` / `data-schema-owner-color` en schema wrappers del canvas.
- [ ] Unit tests pasan con `npx vitest run`.
- [ ] Playwright tests arrancan con servidor activo en puerto 5174.

# Skill: Identidad y persistencia de schemas

## Cuándo usar

Usa este skill cuando la tarea afecte `schema-identity-persistence` o componentes relacionados del fork.

## Objetivo

Aplicar cambios seguros, configurables y testeables en `sisad-pdfme`.

## Procedimiento

1. Garantizar schemaUid estable.
2. No usar label como identidad.
3. Preservar documentId y pageIndex.
4. Validar duplicados.
5. Agregar test de migración o round-trip.

## Checklist de salida

- [ ] El cambio mantiene aislamiento.
- [ ] La habilidad sigue siendo configurable.
- [ ] No hay duplicidad innecesaria.
- [ ] Hay validación o test.
- [ ] La documentación fue actualizada si aplica.

## Evidencia sugerida

Incluye comandos ejecutados, archivos modificados y riesgos restantes.

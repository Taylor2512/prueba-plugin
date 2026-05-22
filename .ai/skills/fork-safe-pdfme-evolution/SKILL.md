# Skill: Evolución segura del fork

## Cuándo usar

Usa este skill cuando la tarea afecte `fork-safe-pdfme-evolution` o componentes relacionados del fork.

## Objetivo

Aplicar cambios seguros, configurables y testeables en `sisad-pdfme`.

## Procedimiento

1. Verificar que el cambio no acople `sisad-pdfme` a servicios externos.
2. Comprobar que la habilidad pueda configurarse.
3. Preservar APIs públicas y snapshot.
4. Agregar migración si cambia contrato.
5. Actualizar documentación.

## Checklist de salida

- [ ] El cambio mantiene aislamiento.
- [ ] La habilidad sigue siendo configurable.
- [ ] No hay duplicidad innecesaria.
- [ ] Hay validación o test.
- [ ] La documentación fue actualizada si aplica.

## Evidencia sugerida

Incluye comandos ejecutados, archivos modificados y riesgos restantes.

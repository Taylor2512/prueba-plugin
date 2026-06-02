# Reglas — Standard fields y grupos

1. Todo schema estándar debe tener contrato Designer/Form/Viewer/Generator/Snapshot.
2. `checkboxGroup` y `radioGroup` deben compartir criterios de normalización de opciones sin duplicar contratos incompatibles.
3. El botón `+` debe ser contextual y testeado.
4. No se debe renderizar metadata técnica como contenido final del PDF.
5. `selectedOptionIds`, `selectedOptionId`, `content`, `checked` y `options` no deben divergir.
6. Cada opción debe tener `optionId` estable; no usar label como ID.
7. Cada grupo debe tener `groupId` estable.
8. Duplicar grupo debe generar nuevo `groupId` y nuevos `optionId`.
9. Convertir `checkbox -> checkboxGroup` no debe regenerar `schemaUid` ni perder owner/color/page/document.
10. Todo cambio de contrato requiere test unitario; toda interacción visual requiere Playwright.

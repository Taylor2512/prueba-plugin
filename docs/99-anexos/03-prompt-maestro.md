# Prompt maestro para continuar implementación

> Documentación generada para consumo externo de `sisad-pdfme`.

```text
Actúa como arquitecto principal de sisad-pdfme. Usa esta documentación como guía. El plugin aún no tiene backend real; los ejemplos deben seguir con mocks/local state pero los contratos deben quedar preparados.

Objetivos:
1. Mantener entrypoints públicos y documentados.
2. Asegurar consumo externo de Designer, Form, Viewer, generator y converter.
3. Estabilizar multidocumento con documents, activeDocumentId, schemas, inputs, comments y assignments.
4. Estabilizar multiusuario con owner, color, locks y vista user/global.
5. Permitir edición de plantilla existente con migración de schemaUid/fileId/pageNumber.
6. Reducir redundancia visual y mover estilos inline a tokens/clases.
7. Unificar acciones mediante commandBus/actionRegistry/selectionCommands.
8. Corregir Selecto con zoom/scroll.
9. Corregir viewer/designer para que el paper no cambie tamaño al hacer scroll.
10. Añadir Vitest y Playwright para los flujos críticos.

Entrega: cambios pequeños, archivos tocados, riesgos, tests ejecutados y docs actualizadas.
```

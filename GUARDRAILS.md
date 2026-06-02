# GUARDRAILS.md — Guardrails del proyecto

1. No acoplar `sisad-pdfme` a reglas de negocio SISAD que deban vivir en adaptadores.
2. No copiar marca, CSS propietario ni nombres internos de DocuSign/Wix.
3. No duplicar sidebars, canvas, inspector, command bus, snapshot engine ni renderers.
4. No modificar DOM interno desde `ContentCustomForm` o hosts externos.
5. No romper `.sisad-pdfme-root` como frontera CSS.
6. No usar delays arbitrarios para resolver race conditions de canvas o tests.
7. No perder `schemaUid`, `ownerId`, `ownerColor`, `recipientColor`, `documentId`, `pageNumber`, `rotation`, `groupId`, `optionId` ni metadata `__designer`.
8. No ejecutar shortcuts cuando hay input/textarea/select/contenteditable activo.
9. No permitir transform en schemas locked/readonly.
10. No reescribir `DesignerCoordinateService`, `schemaCollision`, `schemaAutoPlace`, Moveable o Selecto si no hay evidencia reproducible.
11. No cerrar cambios sin build/lint o bloqueo documentado.
12. Si cambia comportamiento visual, agregar Playwright o justificar manual-only.

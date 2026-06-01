# GUARDRAILS.md — Guardrails del proyecto

1. No acoplar `sisad-pdfme` a reglas de negocio SISAD que deban vivir en adaptadores.
2. No duplicar sidebars, canvas, inspector, command bus, snapshot engine ni renderers.
3. No modificar DOM interno desde `ContentCustomForm` o hosts externos.
4. No romper `.sisad-pdfme-root` como frontera CSS.
5. No usar delays arbitrarios para resolver race conditions de canvas o tests.
6. No perder `schemaUid`, `ownerId`, `ownerColor`, `rotation` ni metadata `__designer`.
7. No ejecutar shortcuts cuando hay input/textarea/select/contenteditable activo.
8. No permitir transform en schemas locked/readonly.
9. No cerrar cambios sin build/lint o bloqueo documentado.

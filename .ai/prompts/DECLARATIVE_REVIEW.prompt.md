# Prompt — review de instancia declarativa

Revisa el diff de una task `DECL-*`.

Comprueba:

1. La responsabilidad pertenece al core.
2. No existe duplicación con config/adapters/registry.
3. Definition sigue JSON-safe.
4. Resources y handlers están separados.
5. No se rompieron wrappers bajos.
6. Controlled/uncontrolled no tiene doble fuente.
7. Reassign usa assignableRecipientCount.
8. Snapshot mantiene compatibilidad.
9. Examples no tienen deep imports.
10. Gates citados fueron realmente ejecutados.

Clasifica hallazgos P0/P1/P2 y cita archivo/línea.

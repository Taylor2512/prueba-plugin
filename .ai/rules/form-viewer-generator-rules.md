# Reglas — Form Viewer Generator parity

1. Designer no es suficiente: todo schema estándar debe funcionar en Form, Viewer y Generator.
2. ExternalForms no debe reconstruir renderers manuales.
3. Form debe devolver valores por `schemaUid` o contrato estable.
4. Viewer debe ser readonly y no mutar state.
5. Generator/PDF debe renderizar según el valor final, no solo default.
6. Snapshot debe ser la fuente para recuperar configuración de schema.
7. Si cambia salida de valor, actualizar docs, tests y migración.

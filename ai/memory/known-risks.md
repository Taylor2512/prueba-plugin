# Riesgos conocidos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| IA carga todo el proyecto | Alto consumo de tokens | Router + context budget |
| Prompts globales | Cambios grandes y regresiones | Task-cards cerradas |
| Tailwind pisa geometry | Canvas roto | Mantener geometry legacy |
| Doble fuente CSS | Layout impredecible | Una entrada Tailwind + bridge controlado |
| Baseline visual olvidado | Rediseño accidental | `public/img-version` como referencia |
| Agentes duplican reglas | Alucinaciones/inconsistencias | Adaptadores delgados |
| Agente usa checkout equivocado | Cambios sueltos en main o rama vacía | Verificación obligatoria de `pwd` y rama |
| Coordinación dentro de un worktree | Handoffs invisibles para otros agentes | Coordinación viva en ruta externa |
| Commit invade ownership | Conflictos y regresiones cruzadas | Diff contra main + rechazo antes de cherry-pick |
| Integrador implementa durante gate | Mezcla de responsabilidades | Sesión integradora exclusiva |
| Ramas divergen después de una wave | Próxima integración compleja | Fast-forward main + realineación controlada |
| Tests stale modifican contrato real | Falsos verdes | Prohibido cambiar expected sin evidencia |

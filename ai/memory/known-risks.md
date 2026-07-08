# Riesgos conocidos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| IA carga todo el proyecto | Alto consumo de tokens | Router + context budget |
| Prompts globales | Cambios grandes y regresiones | Task-cards cerradas |
| Tailwind pisa geometry | Canvas roto | Mantener geometry legacy |
| Doble fuente CSS | Layout impredecible | Una entrada Tailwind + bridge controlado |
| Baseline visual olvidado | Rediseño accidental | `public/img-version` como referencia |
| Agentes duplican reglas | Alucinaciones/inconsistencias | Adaptadores delgados |

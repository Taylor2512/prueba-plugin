# Router de agentes

| Dominio | Agente principal | Revisor |
|---|---|---|
| Coordinación | coordinator-agent | architecture-reviewer |
| UX/UI | frontend-ux-agent | visual-reviewer |
| Canvas | canvas-agent | regression-reviewer |
| Interacción | interaction-agent | regression-reviewer |
| Inspector | inspector-agent | visual-reviewer |
| Schemas | schema-agent | test-contract-reviewer |
| Runtime | runtime-agent | public-api-reviewer |
| Adaptación externa | integration-adapter-agent | public-api-reviewer |
| Tailwind/CSS | css-tailwind-agent | css-reviewer |
| Accesibilidad | accessibility-agent | accessibility-reviewer |
| Rendimiento | performance-agent | performance-reviewer |
| Calidad | test-qa-agent | test-contract-reviewer |
| Documentación | documentation-agent | anti-hallucination-reviewer |
| Memoria | memory-agent | documentation-agent |
| Seguridad | security-review-agent | architecture-reviewer |

## Regla

El agente principal implementa. El revisor inspecciona y devuelve hallazgos.

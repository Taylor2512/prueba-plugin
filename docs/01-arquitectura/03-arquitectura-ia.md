# Arquitectura del asistente IA

La arquitectura IA del proyecto se basa en `.ai/`.

## Capas

1. Reglas globales.
2. Contexto del proyecto.
3. Agentes por dominio.
4. Skills reutilizables.
5. Prompts ejecutables.
6. Adaptadores por proveedor.

## Proveedores

- Claude.
- Codex.
- GitHub Copilot.
- Gemini.

## Flujo

```text
Prompt → Orquestador → Agente → Skill → Plan → Código → Tests → Docs
```

## Criterio de éxito

El asistente mejora el fork sin acoplarlo, sin duplicar componentes y sin romper canvas/snapshot/schemas.

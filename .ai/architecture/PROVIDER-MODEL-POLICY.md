# Provider model policy

Los nombres exactos de modelos son configuración operativa, no conocimiento funcional.

La disponibilidad cambia por proveedor, plan, cliente y fecha. Antes de una sesión larga,
usar el selector/model catalog visible en la herramienta.

## Perfiles

### frontier-architecture

Para:
- P0 root-cause;
- arquitectura;
- concurrency;
- multi-user;
- signature;
- seguridad;
- merges complejos;
- review de cambios amplios.

Preferencias actuales:

```text
Codex: GPT-5.6 Sol
Claude: Claude Opus 5
Claude long-running, si está disponible: Claude Fable 5
Copilot manual: GPT-5.6 Sol o Claude Opus 5
```

### balanced-implementation

Para:
- implementación diaria;
- React/UI;
- tests de integración;
- refactors focales;
- documentación técnica compleja.

```text
Codex: GPT-5.6 Terra
Claude: Claude Sonnet 5
Copilot: Auto, GPT-5.6 Terra o Claude Sonnet 5
```

### fast-mechanical

Para:
- tests repetitivos;
- i18n;
- documentación;
- inventarios;
- adapters sencillos;
- lint fixes claramente mecánicos.

```text
Codex: GPT-5.6 Luna
Claude: Claude Haiku 4.5
Copilot: GPT-5.6 Luna / Claude Haiku 4.5 / Auto
```

## Regla

No cambiar a un modelo pequeño para resolver un P0 sólo para ahorrar tokens si ya existe
evidencia de que la tarea requiere razonamiento sistémico.

No usar frontier para renames o inventarios triviales.

## Copilot

Copilot puede disponer de varios modelos y Auto. El repo no hardcodea un único modelo.
`.ai/providers/MODEL-ROUTING.json` expresa preferencias y fallbacks editables.

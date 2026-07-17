# Mapa de ownership

| Área | Rutas | Agente lógico |
|---|---|---|
| Runtime | `react/**`, `runtime/**`, `config/**` | designer-runtime-agent |
| Canvas | `ui/components/Designer/Canvas/**` | canvas-agent |
| Interacción | Moveable, Selecto, `shared/interaction*` | interaction-agent |
| Schemas | `schemas/**` | schema-agent |
| Inspector | `RightSidebar/DetailView/**` | inspector-agent |
| Lista | `RightSidebar/ListView/**` | inspector-agent |
| Rails | DocumentsRail, CommentsRail | inspector-agent |
| Host lab | `features/pdfcomponent/**` | lab-shell-agent |
| Snapshot | snapshot y migration | snapshot-agent |
| Visual | JSX/TSX, tokens, runtimeStyles | css-tailwind-agent |
| Tests | `tests/**` | owner del dominio o test-infrastructure-agent |
| IA docs | `ai/**` | docs-architecture-agent |

## Archivos transversales

```txt
package.json
package-lock.json
vitest.config.ts
playwright.config.ts
tailwind.config.js
Designer/index.tsx
CtlBar.tsx
RightSidebar.tsx
runtimeStyles.ts
```

Tienen owner exclusivo por wave.

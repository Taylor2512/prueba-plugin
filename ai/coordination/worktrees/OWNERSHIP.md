# Ownership multiagente

## Reglas

- Una ruta productiva tiene un solo owner por wave.
- Tests directos pertenecen al mismo owner del dominio.
- Archivos transversales se asignan a un único agente.
- Un agente no corrige rutas ajenas aunque detecte el fallo.
- Las dependencias se documentan en el handoff.
- El integrador rechaza commits fuera de scope.

## Predisposición

| Proveedor | Áreas habituales |
|---|---|
| Codex | core, hooks, Canvas, interacción, resolvers, schemas puros |
| Claude | RightSidebar, DetailView, ListView, topbar, DocumentsRail |
| Copilot | host lab, LeftSidebar, lint, Vitest infra, accesibilidad |

## Archivos exclusivos

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

La wave debe declarar owner antes de editar.

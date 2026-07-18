# SISAD PDFME

SISAD PDFME es un diseñador y runtime PDF para React/Vite con soporte para Designer, Form, Viewer, Generator, múltiples documentos, destinatarios, schemas, snapshot e integración con hosts externos.

## Arquitectura principal

```txt
src/sisad-pdfme/
├── adapters/
├── assignments/
├── browser/
├── collaboration/
├── common/
├── config/
├── contracts/
├── documents/
├── generator/
├── integration/
├── pdf-lib/
├── react/
├── recipients/
├── runtime/
├── schemas/
├── shared/
└── ui/
```

El host de laboratorio vive en `src/features/pdfcomponent/`.

## Desarrollo

```bash
npm install
npm run dev
```

Ruta de referencia:

```txt
http://localhost:5174/lab/multi-document-routing
```

## Validación

```bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
```

## Contrato visual

- Tailwind es la fuente principal del skin en JSX/TSX.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` permanece vacío.
- `tokens.css` conserva tokens compartidos.
- `runtimeStyles.ts` solo conserva CSS técnico demostrado.
- `preflight: false` exige resets locales como `border-solid`, `appearance-none` y `box-border`.
- Moveable, Selecto, guías, impresión, geometría y nodos de terceros requieren tratamiento técnico explícito.

## Documentación

```txt
docs/README.md
ai/README.md
ai/start/START.md
```

## Trabajo multiagente local

El checkout base es `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`.
Los worktrees ya no viven como carpetas hermanas `prueba-plugin-*`; se
rehidratan dentro de `.worktrees/` desde este repositorio principal.

| Rol | Carpeta | Rama |
|---|---|---|
| Main/coordinador | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin` | `main` |
| Integración | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/merge` | `ai/integration` |
| Codex | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex` | `ai/codex` |
| Claude | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude` | `ai/claude` |
| Copilot | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot` | `ai/copilot` |

Si `git worktree list` muestra entradas `prunable` o rutas hermanas antiguas,
la topología está desalineada y debe limpiarse antes de editar. Los worktrees
activos viven en `prueba-plugin/.worktrees/`, están ignorados por Git y
excluidos de scanners, búsquedas y builds.

Abra `SISAD-PDFME-MULTIAGENT.code-workspace` para visualizar main, integración y los tres agentes en una sola ventana de VS Code sin navegar manualmente entre carpetas.

## Portabilidad

```txt
src/sisad-pdfme no importa lógica concreta del host.
El host entrega configuración, adapters, documentos, recipients y callbacks.
```

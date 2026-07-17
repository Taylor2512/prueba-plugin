# Arranque multiagente aislado con worktrees reutilizables — SISAD PDFME

## Decisión operativa

Se vuelve al modelo aislado:

```txt
main/coordinador:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

integración:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
  branch: ai/integration

Codex:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex
  branch: ai/codex

Copilot:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot
  branch: ai/copilot

Claude:
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude
  branch: ai/claude
```

Coordinación compartida fuera del repositorio:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme
```

Plan autoritativo:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/plans/PLAN_MAESTRO_UX_QA_POST_TAILWIND_SISAD_PDFME_2026-07-17.md
```

Ruta principal de integración:

```txt
http://localhost:5174/lab/multi-document-routing
```

---

# 1. Reglas comunes

Pegar al inicio de las tres sesiones:

```txt
Trabajas dentro de un equipo local aislado por worktrees.

No trabajes en:
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

Ese checkout pertenece al coordinador y a main.

Confirma siempre:
pwd
git branch --show-current
git status --short

No hagas:
- git switch a otra rama;
- git merge;
- git cherry-pick;
- git rebase;
- git push;
- git pull;
- git reset --hard;
- git clean;
- git stash;
- npm install;
- npm ci;
- cambios fuera de OWNED paths;
- auditoría completa;
- otro plan maestro;
- cambios de expected/snapshots para ocultar regresiones;
- CSS global, @apply o !important visual.

Sí puedes:
- editar únicamente tus archivos asignados;
- ejecutar ESLint focal;
- ejecutar Vitest focal;
- ejecutar Playwright focal solo en tu puerto asignado;
- crear commits atómicos en tu propia rama;
- escribir tu handoff en la coordinación compartida.

No edites main ni la rama ai/integration.

Máximo cinco archivos productivos por commit.
No mezcles dominios.
No continúes hacia otra wave sin gate de integración.
```

---

# 2. Puertos

```txt
integración: 5174
Codex:       5181
Claude:      5182
Copilot:     5183
```

Los agentes no deben levantar servidores en 5174.

---

# 3. Wave 1.5 — estabilización de pruebas

La consolidación anterior dejó lint y build verdes, pero Vitest todavía reportó
fallos. Antes del rediseño visual se cierra esta wave.

## Codex

Worktree:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex
```

Rama:

```txt
ai/codex
```

OWNED:

```txt
src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts
src/sisad-pdfme/browser/downloads.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/options/**
src/sisad-pdfme/schemas/signature/validation.ts
src/sisad-pdfme/pdf-lib/api/form/**
tests unitarios directos de estas áreas
```

Objetivos:

```txt
- resolveNonOverlappingDropPosition;
- roundtrip CheckboxGroup;
- optionId estable;
- validación provider/P12;
- downloadUrl resistente a mocks;
- ciclo PDFField/PDFButton.
```

Prompt final:

```txt
Inicia Wave 1.5 Codex.

No audites todo el repositorio.
Trabaja únicamente en tu worktree y rama.
Reproduce los fallos focales, corrige contratos reales y deja commits atómicos.
No toques RightSidebar, LeftSidebar, CtlBar, vitest.config.ts ni host lab.

Al terminar escribe:
.../ai-coordination/sisad-pdfme/handoffs/CODEX-W15.md

Incluye SHAs, rutas, comandos y resultados exactos.
Detente después del handoff.
```

## Claude

Worktree:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude
```

Rama:

```txt
ai/claude
```

OWNED:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**
src/sisad-pdfme/schemas/actions/**
src/sisad-pdfme/schemas/schemaFamilies.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/schemas/propPanel/**
src/sisad-pdfme/ui/components/CtlBar.tsx
tests unitarios directos
```

Objetivos:

```txt
- HELP ReferenceError;
- matriz editable;
- propertyMap required/data/validation;
- groupId/groupName/optionsContainer;
- familia action;
- contratos visuales DetailSectionCard;
- clusters CtlBar.
```

Prompt final:

```txt
Inicia Wave 1.5 Claude.

No audites todo el proyecto y no actúes todavía como integrador.
Trabaja solo en tu worktree y owned paths.
Corrige primero contratos funcionales; no hagas polish general.

Al terminar escribe:
.../ai-coordination/sisad-pdfme/handoffs/CLAUDE-W15.md

Incluye SHAs, rutas, comandos y resultados exactos.
Detente después del handoff.
```

## Copilot

Workspace:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot
```

Rama:

```txt
ai/copilot
```

OWNED:

```txt
vitest.config.ts
tests/setup.*
src/features/pdfcomponent/**
tests/unit/features/pdfcomponent/**
tests smoke de App/main/Designer/RightSidebar
```

Objetivos:

```txt
- resolución AntD en Vitest;
- tests stale de CaseGrid/Hero/IconButton;
- imports smoke del host;
- no recrear wrappers muertos;
- no parchear node_modules.
```

Prompt final:

```txt
Inicia Wave 1.5 Copilot.

Abre únicamente el workspace prueba-plugin-copilot.
No uses Fix all global.
No toques DetailView, Canvas, schemas, browser ni pdf-lib.
Corrige infraestructura/tests stale sin recrear wrappers eliminados.

Al terminar crea commits atómicos y escribe:
.../ai-coordination/sisad-pdfme/handoffs/COPILOT-W15.md

Incluye SHAs, rutas, comandos y resultados exactos.
Detente después del handoff.
```

---

# 4. Integración

Solo el worktree:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
```

puede integrar.

Antes:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge
git status --short
git branch --show-current
```

Debe mostrar:

```txt
ai/integration
```

Leer los tres handoffs y revisar archivos:

```bash
git diff --name-only main..ai/codex
git diff --name-only main..ai/copilot
git diff --name-only main..ai/claude
```

Detectar intersecciones antes de cherry-pick.

Orden:

```txt
1. Codex
2. Copilot
3. Claude
```

Aplicar únicamente los SHAs aceptados:

```bash
git cherry-pick <SHA_CODEX_1> [<SHA_CODEX_N>]
git cherry-pick <SHA_COPILOT_1> [<SHA_COPILOT_N>]
git cherry-pick <SHA_CLAUDE_1> [<SHA_CLAUDE_N>]
```

Gate:

```bash
npm run lint
npm run build
npx vitest run
```

Cuando Vitest esté verde:

```bash
npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium
```

No modificar expected ni snapshots durante integración.

---

# 5. Publicar integración en main sin merge conflict

Después del gate verde:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git switch main
git status --short
git merge --ff-only ai/integration
```

Como `ai/integration` parte de main y recibe cherry-picks secuenciales, main
avanza por fast-forward. No se crea merge commit.

Validar:

```bash
git log --oneline --decorate -12
git status --short
```

---

# 6. Reutilizar los mismos worktrees para la siguiente wave

Solo después de que main avance y todos los worktrees estén limpios:

```bash
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex status --short
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot status --short
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude status --short
```

Rebasar las ramas reutilizables al nuevo main mediante reset controlado:

```bash
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex reset --hard main
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot reset --hard main
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude reset --hard main
git -C /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge reset --hard main
```

Este reset solo se ejecuta:

```txt
- después del gate;
- después del fast-forward de main;
- con cada worktree limpio;
- cuando todos los commits aceptados ya están en main.
```

Así las cuatro ramas quedan listas para la siguiente wave sin crear nuevas
ramas ni carpetas.

---

# 7. Wave 2 posterior

```txt
Codex:
Canvas overlays, toolbar contextual y foco.

Claude:
topbar global, Guardar, menú global y RightSidebar shell.

Copilot:
LeftSidebar, catálogo, favoritos y densidad.
```

Se repite el mismo ciclo:

```txt
trabajo aislado
→ commits
→ handoffs
→ cherry-pick en ai/integration
→ gate
→ fast-forward main
→ reset controlado de ramas reutilizables
```

# Realineación multiagente — Wave 1 SISAD PDFME

## Estado confirmado

La Wave 1 no debe integrarse todavía.

### Claude

Estado válido:

- Su corrección de scroll del RightSidebar está aislada y comprometida.
- Ha detenido la integración hasta recibir ramas limpias de Codex y Copilot.
- Debe seguir siendo el único integrador en `prueba-plugin-merge`.

### Codex

Estado inválido:

- Trabajó en el checkout principal.
- No ejecutó su tarea asignada:
  - `SisadPdfmeForm.tsx`;
  - `SchemaDropCommitFlash.tsx`.
- Modificó archivos owned por Claude:
  - RightSidebar;
  - ListView;
  - DetailView.
- Modificó un archivo owned por Copilot:
  - `labExamples.js`.
- Continuó hacia slices visuales y pruebas de DetailView sin cerrar Wave 1.
- No entregó un commit limpio en `ai/codex-uxqa-20260717`.

### Copilot

Estado parcialmente válido:

- El commit `ab52464` está en la rama correcta.
- Corrigió dos tests con imports legacy.
- Su lint focal y dos tests están verdes.
- Todavía no corrigió el bloqueo de build en `labExamples.js`.
- Existe además una sesión que modificó `LeftSidebar.tsx` directamente en main.
  Ese cambio debe quedar en cuarentena hasta Wave 2.

---

# 1. Detener trabajo paralelo

No iniciar Wave 2.

Cerrar o pausar:

- sesión Codex que está en `prueba-plugin`;
- sesión Copilot que está en `prueba-plugin`;
- cualquier terminal que siga modificando main.

Claude permanece detenido hasta recibir los dos handoffs limpios.

---

# 2. Poner en cuarentena los cambios sueltos de main

Ejecutar en:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

Guardar evidencia:

```bash
COORD=/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/coordination/uxqa-20260717

git status --short > "$COORD/status/MAIN-ROGUE-STATUS.txt"
git diff --name-only > "$COORD/status/MAIN-ROGUE-FILES.txt"
git diff --binary > "$COORD/handoffs/MAIN-ROGUE-CHANGES.patch"
```

Revisar:

```bash
cat "$COORD/status/MAIN-ROGUE-FILES.txt"
```

El checkpoint `37291b2` contiene el estado anterior. No usar `reset --hard`.

Restaurar únicamente los archivos tracked modificados después del checkpoint:

```bash
while IFS= read -r file; do
  [ -n "$file" ] && git restore --worktree --staged -- "$file"
done < "$COORD/status/MAIN-ROGUE-FILES.txt"
```

No eliminar:

```txt
ai/coordination/uxqa-20260717/**
```

Los cambios de LeftSidebar quedan preservados dentro del patch y se reconsideran
después del gate de Wave 1.

Confirmar:

```bash
git status --short
```

El checkout principal no debe contener modificaciones productivas sueltas.

---

# 3. Prompt correctivo para Codex

Pegar literalmente en la sesión nueva de Codex:

```txt
REALINEACIÓN OBLIGATORIA — CODEX WAVE 1

Tu ejecución anterior quedó invalidada porque trabajaste en el checkout
principal y editaste dominios de Claude y Copilot.

No continúes desde ~/Documents/Taylor/frontend/prueba-plugin.

WORKTREE OBLIGATORIO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex

RAMA OBLIGATORIA
ai/codex-uxqa-20260717

TAREA ÚNICA
W1-CODEX-P0-HOOKS

ARCHIVOS PRODUCTIVOS OWNED
1. src/sisad-pdfme/react/SisadPdfmeForm.tsx
2. src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx

TESTS DIRECTOS PERMITIDOS
- tests unitarios directos de SisadPdfmeForm/runtime modes.
- tests directos de SchemaDropCommitFlash.
- tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
  solo si necesita una corrección estrictamente relacionada con el overlay.

PROHIBIDO
- RightSidebar/**
- LeftSidebar/**
- DetailView/**
- ListView/**
- DocumentsRail.tsx
- labExamples.js
- Designer/index.tsx
- CtlBar.tsx
- tests de inspector/sidebar
- main
- Wave 2

PASOS
1. `cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex`
2. Confirma:
   `pwd`
   `git branch --show-current`
   `git status --short`
3. La rama debe ser `ai/codex-uxqa-20260717` y debe estar limpia.
4. Corrige el useMemo/React Compiler de SisadPdfmeForm sin desactivar reglas.
5. Corrige el orden incondicional de hooks y timers de
   SchemaDropCommitFlash.
6. Ejecuta:
   `npx eslint <los dos archivos>`
   `npx vitest run <tests focales existentes>`
   `npm run build`
7. Haz un único commit atómico:
   `fix: stabilize form memoization and drop flash hooks`
8. Crea:
   `ai/coordination/uxqa-20260717/handoffs/CODEX-wave1.md`
   incluyendo SHA, archivos, comandos y resultados exactos.
9. Libera el lock.
10. Detente. No continúes con otro slice y no hagas merge.

No reapliques el patch de main. Tu tarea debe implementarse limpiamente desde la
rama Codex.
```

---

# 4. Prompt correctivo para GitHub Copilot

Pegar literalmente en Copilot Agent Mode:

```txt
REALINEACIÓN OBLIGATORIA — COPILOT WAVE 1

WORKSPACE OBLIGATORIO
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot

RAMA
ai/copilot-uxqa-20260717

El commit `ab52464` es válido y debe conservarse.

TAREA RESTANTE ÚNICA
Corregir el bloqueo de build de
src/features/pdfcomponent/labs/examples/labExamples.js.

No supongas que `exampleTemplate.ts` exporta `cloneExample`.
Primero encuentra la API canónica real:

rg -n \
  "export .*cloneExample|function cloneExample|const cloneExample|cloneExample" \
  src/features/pdfcomponent

Inspecciona los exports reales del módulo encontrado.

REGLAS
- No recrear wrappers eliminados.
- No importar un símbolo que el módulo no exporta.
- No tocar RightSidebar, DetailView, LeftSidebar, Canvas ni main.
- No continuar Wave 2.
- No modificar los tests ya comprometidos salvo fallo demostrado.
- No usar un alias o helper nuevo solo para ocultar el error.

VALIDACIÓN
1. ESLint focal de `labExamples.js`.
2. Tests directos del catálogo/export de ejemplos.
3. `npm run build`.
4. Si build pasa, crea un segundo commit:
   `fix: restore canonical lab example clone import`
5. Actualiza `COPILOT-wave1.md` con ambos SHAs:
   - `ab52464`
   - nuevo SHA del build blocker.
6. Libera el lock y detente.

El cambio de LeftSidebar realizado en el checkout principal no forma parte de
Wave 1. No lo reapliques todavía.
```

---

# 5. Prompt de espera e integración para Claude

Pegar literalmente en Claude:

```txt
CLAUDE — INTEGRACIÓN WAVE 1

Tu evaluación es correcta. No inicies Wave 2 y no continúes el polish visual.

Mantén tu rama y commit de scroll sin cambios adicionales.

Espera estos entregables:

CODEX
- commit en ai/codex-uxqa-20260717;
- solo SisadPdfmeForm.tsx y SchemaDropCommitFlash.tsx;
- handoff CODEX-wave1.md;
- lint, tests focales y build.

COPILOT
- commit ab52464;
- segundo commit que corrige de forma canónica labExamples.js;
- handoff COPILOT-wave1.md actualizado;
- build verde.

Antes de integrar ejecuta:

git diff --name-only \
  ai/uxqa-integration-20260717..ai/codex-uxqa-20260717

git diff --name-only \
  ai/uxqa-integration-20260717..ai/copilot-uxqa-20260717

git diff --name-only \
  ai/uxqa-integration-20260717..ai/claude-uxqa-20260717

Rechaza cualquier branch que contenga archivos fuera de ownership.

INTEGRACIÓN EXCLUSIVA
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge

ORDEN
1. cherry-pick commit Codex.
2. cherry-pick ab52464.
3. cherry-pick segundo commit Copilot.
4. cherry-pick tu commit de scroll.

GATE
npm run lint
npm run build
npx vitest run

npx playwright test \
  tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts \
  tests/playwright/right-sidebar-detail-scroll.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts \
  --project=chromium

No modifiques expected ni snapshots para hacer pasar el gate.

Si falla:
- clasifica por commit/domain;
- revierte únicamente el commit culpable si es necesario;
- devuelve el fallo al owner;
- no absorbas trabajo de Wave 2.

Solo después del gate verde declara Wave 1 cerrada.
```

---

# 6. Estado del cambio LeftSidebar hecho en main

El cambio que midió:

```txt
abierto: 212 px
colapsado: 36 px
stage/canvas sin cambio
```

es potencialmente útil, pero fue ejecutado:

- en el checkout principal;
- fuera de la wave asignada;
- sin commit de la rama Copilot Wave 2;
- antes del gate de Wave 1.

No debe perderse ni integrarse ahora.

Después de cerrar Wave 1:

1. Crear un lock de `W2-COPILOT-LEFT-SIDEBAR`.
2. Extraer únicamente el diff de `LeftSidebar.tsx` desde
   `MAIN-ROGUE-CHANGES.patch`.
3. Aplicarlo en `prueba-plugin-copilot`.
4. Revisar el diff.
5. Ejecutar build y pruebas del LeftSidebar.
6. Crear commit de Wave 2.

---

# 7. Criterio para reanudar

No reanudar el trabajo hasta tener:

```txt
[ ] main sin cambios productivos sueltos;
[ ] Codex en su worktree y con commit hooks-only;
[ ] Copilot con ab52464 + fix canónico de labExamples.js;
[ ] Claude con su commit de scroll intacto;
[ ] tres handoffs completos;
[ ] cero intersecciones no autorizadas;
[ ] gate Wave 1 ejecutado en prueba-plugin-merge.
```

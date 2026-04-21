#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE_DIR=".archive/$TIMESTAMP"
DRY_RUN="${DRY_RUN:-0}"

log() {
  printf "\n[%s] %s\n" "$(date +%H:%M:%S)" "$1"
}

run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    printf '[dry-run] %s\n' "$*"
  else
    eval "$@"
  fi
}

safe_mkdir() {
  for dir in "$@"; do
    run "mkdir -p \"$dir\""
  done
}

safe_touch() {
  for file in "$@"; do
    if [[ ! -e "$file" ]]; then
      run "mkdir -p \"$(dirname "$file")\" && touch \"$file\""
    fi
  done
}

safe_write_if_missing() {
  local file="$1"
  local content="$2"
  if [[ ! -e "$file" ]]; then
    run "mkdir -p \"$(dirname "$file")\""
    if [[ "$DRY_RUN" == "1" ]]; then
      printf '[dry-run] create file %s\n' "$file"
    else
      cat > "$file" <<EOF
$content
EOF
    fi
  fi
}

archive_if_exists() {
  local path="$1"
  if [[ -e "$path" ]]; then
    run "mkdir -p \"$ARCHIVE_DIR\""
    run "mv \"$path\" \"$ARCHIVE_DIR/\""
  fi
}

remove_if_exists() {
  local path="$1"
  if [[ -e "$path" ]]; then
    run "rm -rf \"$path\""
  fi
}

log "1) Creando estructura base multi-proveedor de IA"

safe_mkdir \
  ".ai" \
  ".ai/agents" \
  ".ai/skills" \
  ".ai/prompts" \
  ".ai/instructions" \
  ".ai/rules" \
  ".ai/templates" \
  ".ai/context" \
  ".ai/provider-adapters" \
  ".ai/provider-adapters/copilot" \
  ".ai/provider-adapters/codex" \
  ".ai/provider-adapters/claude" \
  ".ai/provider-adapters/gemini" \
  ".ai/provider-adapters/kilo" \
  ".ai/provider-adapters/antigravity" \
  ".github" \
  ".github/agents" \
  ".github/instructions" \
  ".github/prompts" \
  ".github/skills" \
  ".claude" \
  ".claude/agents" \
  ".claude/skills" \
  ".claude/prompts" \
  ".codex" \
  ".codex/agents" \
  ".codex/skills" \
  ".codex/prompts" \
  ".gemini" \
  ".gemini/agents" \
  ".gemini/skills" \
  ".gemini/prompts" \
  ".kilo" \
  ".kilo/agents" \
  ".kilo/skills" \
  ".kilo/prompts" \
  ".antigravity" \
  ".antigravity/agents" \
  ".antigravity/skills" \
  ".antigravity/prompts" \
  "docs/ai" \
  "docs/ai/agents" \
  "docs/ai/skills" \
  "docs/ai/prompts" \
  "docs/ai/instructions"

log "2) Archivando archivos temporales y reportes ruidosos"
archive_if_exists "build.log"
archive_if_exists "codigo-unificado.txt"
archive_if_exists "documentacion-unificada.md"
archive_if_exists "eslint-report.json"
archive_if_exists "lint_output.txt"
archive_if_exists "styles-unificados.css"
archive_if_exists "tmp-basic-designer-after.png"
archive_if_exists "tmp-basic-designer.png"
archive_if_exists "tmp-generator-runtime-after.png"
archive_if_exists "tmp-generator-runtime.png"
archive_if_exists "tmp-landing-after.png"
archive_if_exists "tmp-landing.png"
archive_if_exists "tmp-left-compact-collapsed.png"
archive_if_exists "vendor.txt"

log "3) Eliminando basura regenerable común"
remove_if_exists "dist"
remove_if_exists "test-results"
remove_if_exists ".DS_Store"

log "4) Creando archivos maestros"
safe_write_if_missing "AGENTS.md" "# AGENTS.md

Repositorio con arquitectura PDF platform-first basada en un fork profundo de pdfme.
No tratar este proyecto como pdfme vanilla.
"
safe_write_if_missing ".ai/README.md" "# AI workspace

Estructura neutral para múltiples proveedores:
- Copilot
- Codex
- Claude
- Gemini
- Kilo
- Antigravity
"
safe_write_if_missing ".ai/context/project-overview.md" "# Project overview

Describe aquí la verdad actual del fork, objetivos, restricciones y diferencias respecto a pdfme original.
"
safe_write_if_missing ".ai/context/provider-compatibility.md" "# Provider compatibility

Este repositorio debe mantener prompts y artefactos reutilizables entre distintos proveedores de IA.
"
safe_write_if_missing ".ai/rules/global-rules.md" "# Global rules

1. No asumir que el proyecto sigue siendo pdfme original.
2. Respetar separaciones entre common, schemas, ui, generator y converter.
3. Preferir cambios incrementales con pruebas.
"
safe_write_if_missing ".ai/instructions/editor-platform.instructions.md" "# Editor platform instructions
Define reglas de arquitectura global del editor.
"
safe_write_if_missing ".ai/instructions/designer-runtime.instructions.md" "# Designer runtime instructions
Define reglas del lifecycle de selección, overlays, inspector y canvas.
"
safe_write_if_missing ".ai/instructions/schema-system.instructions.md" "# Schema system instructions
Define reglas para registry, familias de schema y contratos.
"
safe_write_if_missing ".ai/instructions/canvas-first-ux.instructions.md" "# Canvas-first UX instructions
Define reglas inspiradas en Wix para progressive disclosure, ahorro de espacio e inspectores contextuales.
"
safe_write_if_missing ".ai/instructions/testing-quality.instructions.md" "# Testing quality instructions
Toda mejora relevante del editor debe venir con pruebas proporcionales.
"
safe_write_if_missing ".ai/instructions/docs-and-migration.instructions.md" "# Docs and migration instructions
Toda divergencia importante del fork debe documentarse.
"

log "5) Creando subagentes base"
safe_touch \
  ".ai/agents/platform-pdf-architect.agent.md" \
  ".ai/agents/designer-engine-architect.agent.md" \
  ".ai/agents/canvas-runtime-architect.agent.md" \
  ".ai/agents/canvas-overlays-architect.agent.md" \
  ".ai/agents/left-sidebar-catalog-architect.agent.md" \
  ".ai/agents/right-sidebar-inspector-architect.agent.md" \
  ".ai/agents/detail-view-forms-architect.agent.md" \
  ".ai/agents/list-view-interactions-architect.agent.md" \
  ".ai/agents/schema-registry-architect.agent.md" \
  ".ai/agents/schema-rendering-architect.agent.md" \
  ".ai/agents/collaboration-sync-architect.agent.md" \
  ".ai/agents/generator-converter-architect.agent.md" \
  ".ai/agents/design-token-governance.agent.md" \
  ".ai/agents/testing-regression-guardian.agent.md" \
  ".ai/agents/docs-migration-steward.agent.md"

log "6) Creando skills base"
safe_mkdir \
  ".ai/skills/platform-architecture-governance" \
  ".ai/skills/fork-safe-pdfme-evolution" \
  ".ai/skills/public-api-surface-design" \
  ".ai/skills/designer-engine-runtime-state" \
  ".ai/skills/designer-selection-lifecycle" \
  ".ai/skills/canvas-geometry-scaling" \
  ".ai/skills/canvas-overlay-composition" \
  ".ai/skills/moveable-selecto-integration" \
  ".ai/skills/snaplines-guides-behavior" \
  ".ai/skills/catalog-discovery-patterns" \
  ".ai/skills/wix-inspired-left-rail-ux" \
  ".ai/skills/inspector-panel-composition" \
  ".ai/skills/detail-view-sectioning" \
  ".ai/skills/list-view-reorder-patterns" \
  ".ai/skills/schema-registry-extension" \
  ".ai/skills/schema-render-contracts" \
  ".ai/skills/schema-identity-persistence" \
  ".ai/skills/collaboration-state-sync" \
  ".ai/skills/generator-runtime-parity" \
  ".ai/skills/converter-pipeline-integrity" \
  ".ai/skills/design-token-governance" \
  ".ai/skills/css-layering-and-overrides" \
  ".ai/skills/editor-regression-testing" \
  ".ai/skills/playwright-canvas-diagnostics" \
  ".ai/skills/docusign-inspired-product-thinking" \
  ".ai/skills/document-workflow-ux-patterns"

safe_touch \
  ".ai/skills/platform-architecture-governance/SKILL.md" \
  ".ai/skills/fork-safe-pdfme-evolution/SKILL.md" \
  ".ai/skills/public-api-surface-design/SKILL.md" \
  ".ai/skills/designer-engine-runtime-state/SKILL.md" \
  ".ai/skills/designer-selection-lifecycle/SKILL.md" \
  ".ai/skills/canvas-geometry-scaling/SKILL.md" \
  ".ai/skills/canvas-overlay-composition/SKILL.md" \
  ".ai/skills/moveable-selecto-integration/SKILL.md" \
  ".ai/skills/snaplines-guides-behavior/SKILL.md" \
  ".ai/skills/catalog-discovery-patterns/SKILL.md" \
  ".ai/skills/wix-inspired-left-rail-ux/SKILL.md" \
  ".ai/skills/inspector-panel-composition/SKILL.md" \
  ".ai/skills/detail-view-sectioning/SKILL.md" \
  ".ai/skills/list-view-reorder-patterns/SKILL.md" \
  ".ai/skills/schema-registry-extension/SKILL.md" \
  ".ai/skills/schema-render-contracts/SKILL.md" \
  ".ai/skills/schema-identity-persistence/SKILL.md" \
  ".ai/skills/collaboration-state-sync/SKILL.md" \
  ".ai/skills/generator-runtime-parity/SKILL.md" \
  ".ai/skills/converter-pipeline-integrity/SKILL.md" \
  ".ai/skills/design-token-governance/SKILL.md" \
  ".ai/skills/css-layering-and-overrides/SKILL.md" \
  ".ai/skills/editor-regression-testing/SKILL.md" \
  ".ai/skills/playwright-canvas-diagnostics/SKILL.md" \
  ".ai/skills/docusign-inspired-product-thinking/SKILL.md" \
  ".ai/skills/document-workflow-ux-patterns/SKILL.md"

log "7) Creando prompts operativos"
safe_touch \
  ".ai/prompts/audit-platform-boundaries.prompt.md" \
  ".ai/prompts/refactor-designer-engine.prompt.md" \
  ".ai/prompts/stabilize-public-api.prompt.md" \
  ".ai/prompts/optimize-canvas-runtime.prompt.md" \
  ".ai/prompts/implement-overlay-pattern.prompt.md" \
  ".ai/prompts/fix-moveable-selecto-regression.prompt.md" \
  ".ai/prompts/refactor-left-rail-catalog.prompt.md" \
  ".ai/prompts/improve-discovery-mode.prompt.md" \
  ".ai/prompts/refactor-right-inspector-layout.prompt.md" \
  ".ai/prompts/build-detail-section-system.prompt.md" \
  ".ai/prompts/improve-list-view-ux.prompt.md" \
  ".ai/prompts/add-new-schema-family.prompt.md" \
  ".ai/prompts/normalize-schema-contracts.prompt.md" \
  ".ai/prompts/add-prop-panel-for-schema.prompt.md" \
  ".ai/prompts/implement-collaboration-state.prompt.md" \
  ".ai/prompts/add-comments-and-presence.prompt.md" \
  ".ai/prompts/add-editor-regression-tests.prompt.md" \
  ".ai/prompts/create-playwright-canvas-scenarios.prompt.md" \
  ".ai/prompts/validate-runtime-generate-parity.prompt.md" \
  ".ai/prompts/write-architecture-decision-record.prompt.md" \
  ".ai/prompts/document-fork-divergence.prompt.md" \
  ".ai/prompts/generate-migration-guide.prompt.md"

log "8) Creando adaptadores por proveedor"
safe_write_if_missing ".github/README.md" "# GitHub provider adapter
Apunta a los artefactos neutrales en .ai/.
"
safe_write_if_missing ".claude/README.md" "# Claude provider adapter
Apunta a los artefactos neutrales en .ai/.
"
safe_write_if_missing ".codex/README.md" "# Codex provider adapter
Apunta a los artefactos neutrales en .ai/.
"
safe_write_if_missing ".gemini/README.md" "# Gemini provider adapter
Apunta a los artefactos neutrales en .ai/.
"
safe_write_if_missing ".kilo/README.md" "# Kilo provider adapter
Apunta a los artefactos neutrales en .ai/.
"
safe_write_if_missing ".antigravity/README.md" "# Antigravity provider adapter
Apunta a los artefactos neutrales en .ai/.
"

safe_touch \
  ".github/agents/.gitkeep" \
  ".github/instructions/.gitkeep" \
  ".github/prompts/.gitkeep" \
  ".github/skills/.gitkeep" \
  ".claude/agents/.gitkeep" \
  ".claude/skills/.gitkeep" \
  ".claude/prompts/.gitkeep" \
  ".codex/agents/.gitkeep" \
  ".codex/skills/.gitkeep" \
  ".codex/prompts/.gitkeep" \
  ".gemini/agents/.gitkeep" \
  ".gemini/skills/.gitkeep" \
  ".gemini/prompts/.gitkeep" \
  ".kilo/agents/.gitkeep" \
  ".kilo/skills/.gitkeep" \
  ".kilo/prompts/.gitkeep" \
  ".antigravity/agents/.gitkeep" \
  ".antigravity/skills/.gitkeep" \
  ".antigravity/prompts/.gitkeep"

log "9) Creando índices de apoyo"
safe_write_if_missing "docs/ai/README.md" "# Índice AI
Documentación auxiliar para agentes, skills, prompts e instrucciones.
"
safe_write_if_missing "docs/ai/agents/README.md" "# Agents index
"
safe_write_if_missing "docs/ai/skills/README.md" "# Skills index
"
safe_write_if_missing "docs/ai/prompts/README.md" "# Prompts index
"
safe_write_if_missing "docs/ai/instructions/README.md" "# Instructions index
"

log "10) Generando .gitignore auxiliar si falta"
safe_write_if_missing ".ai/.gitignore" "*.tmp
*.bak
"

log "11) Resumen"
echo
echo "Estructura creada correctamente."
echo "Archivos archivados en: $ARCHIVE_DIR (si existían)"
echo
echo "Siguiente paso recomendado:"
echo "1. Revisar AGENTS.md"
echo "2. Rellenar .ai/instructions/*"
echo "3. Rellenar .ai/agents/*"
echo "4. Rellenar .ai/skills/*/SKILL.md"
echo "5. Rellenar .ai/prompts/*"
echo
echo "Modo simulación disponible:"
echo "DRY_RUN=1 bash bootstrap-ai-structure.sh"
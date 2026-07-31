---
id: AIARCH-018
state: backlog
wave: W2
priority: P0
risk: medium
owner: provider-adapter-steward
writer:
readers: []
dependsOn: [AIARCH-003, AIARCH-015, AIARCH-017]
trace:
  useCases: []
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: ai-architecture
  skills: [sisad-ai-architecture]
  requiredSymbols: []
  forbiddenPaths:
    - src/sisad-pdfme/**
  maxFiles: 8
  maxTokens: 12000
---

# AIARCH-018 — Actualizar adapter de Claude

## Activation

Mantener Backlog mientras WIP=3. Activar solo después de reconciliar el sprint
y registrar claim/worktree.

## Objective

Subagents, memory bridge, skills y hooks deterministas.

## Evidence

- latest documentation pack: `documentacion-sisad—pdmfe-web(60).md`
- V7 source map: `.ai/architecture/AI-ASSISTANT-ARCHITECTURE-V7.md`
- official provider findings: `.ai/research/OFFICIAL-PROVIDER-FINDINGS-2026-07-31.md`

## Allowed files

Solo infraestructura IA, documentación y scripts. No código productivo.

## Steps

1. Revalidar baseline y dependencias.
2. Crear characterization check.
3. Aplicar cambio mínimo.
4. Ejecutar validadores focales.
5. Actualizar trazabilidad y migration manifest.
6. Entregar handoff y rollback.

## Acceptance

- [ ] Una fuente canónica por concepto.
- [ ] Presupuesto y context manifest válidos.
- [ ] Sin sobrescribir Scrum/memory sin merge.
- [ ] Adapter/provider drift controlado.
- [ ] Evidencia y gates reales.

## Stop

Detener ante WIP lleno, conflicto de archivos, duplicación de fuente, cambio de
scope o necesidad de tocar producto.

## Rollback

Commit atómico de documentación/scripts; conservar aliases durante una versión.

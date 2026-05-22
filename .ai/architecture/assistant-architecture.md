# Arquitectura del asistente IA para `sisad-pdfme`

## 1. Objetivo

Diseñar una arquitectura de asistencia IA que permita evolucionar `sisad-pdfme` con control, calidad, trazabilidad y bajo riesgo de regresiones.

## 2. Capas del asistente

```text
Usuario
  ↓
Prompt de tarea
  ↓
Root Orchestrator
  ↓
Selección de subagente
  ↓
Carga de skill
  ↓
Plan técnico
  ↓
Implementación
  ↓
Tests
  ↓
Documentación
  ↓
Resumen de cambios
```

## 3. Root Orchestrator

Responsable de:

- Clasificar la tarea.
- Elegir subagente.
- Detectar riesgos.
- Definir alcance.
- Exigir pruebas.
- Exigir documentación si cambia contrato.
- Evitar cambios fuera del dominio.

## 4. Subagentes principales

- `platform-pdf-architect`: visión global del fork.
- `designer-engine-architect`: estado y engine.
- `canvas-runtime-architect`: canvas, coordenadas, zoom, scroll.
- `canvas-overlays-architect`: overlays, toolbar, comments overlay.
- `left-sidebar-catalog-architect`: catálogo, tabs, búsqueda, drag.
- `right-sidebar-inspector-architect`: inspector, detail view, widgets.
- `schema-registry-architect`: schemas, plugins, registry.
- `schema-rendering-architect`: designer/form/viewer renderers.
- `generator-converter-architect`: generator, converter, pdf-lib boundaries.
- `design-system-guardian`: CSS, tokens, compact UI.
- `testing-regression-guardian`: vitest, playwright, runtime guard.
- `docs-migration-steward`: documentación, ADRs, migraciones.
- `prompt-execution-director`: descomposición de tareas para IA.

## 5. Política de edición

El asistente debe preferir:

- Cambios pequeños.
- Refactors incrementales.
- Pruebas por dominio.
- APIs públicas estables.
- Documentación actualizada.
- Migraciones explícitas.

## 6. Política anti regresión

Antes de modificar canvas, sidebars, schemas o snapshot:

1. Identificar pruebas existentes.
2. Agregar prueba si no existe.
3. Ejecutar suite relevante.
4. Revisar render visual si aplica.
5. Actualizar documentación.

## 7. Definición de hecho

Una tarea se considera completa si:

- Implementa el cambio solicitado.
- No rompe contratos públicos.
- Tiene validación.
- Documenta cambios relevantes.
- Mantiene el aislamiento del fork.

# Objetivos del proyecto

## Objetivo general

Construir y estabilizar `sisad-pdfme` como componente diseñador PDF reutilizable, compatible con múltiples documentos, páginas, recipients, schemas estándar, runtime Form/Viewer/Generator y flujo visual tipo DocuSign sin copiar marca ni UI propietaria.

## Objetivos técnicos

- Diseñador multipágina y multidocumento confiable.
- Selección, Moveable, Selecto, shortcuts y overlays estables.
- Schemas configurables por familia.
- Inspector modular y compacto.
- Snapshot roundtrip sin pérdida de metadata.
- Migración visual CSS → Tailwind sin romper geometría.
- Separación entre core `sisad-pdfme` y laboratorios/host.
- Compatibilidad con Codex, Claude y Copilot mediante task-cards.

## Objetivos de IA

- Reducir tokens.
- Evitar loops de análisis.
- Evitar alucinaciones de archivos inexistentes.
- Mantener memoria viva y decisiones registradas.
- Dividir tareas grandes en pasos verificables.

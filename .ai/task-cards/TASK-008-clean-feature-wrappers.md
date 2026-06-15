# TASK-008 — Limpiar wrappers de features/lab

## Objetivo

Reducir archivos triviales en `src/features/pdfcomponent` sin tocar runtime.

## Archivos candidatos

```txt
src/features/pdfcomponent/*
src/features/pdfcomponent/ui/primitives.jsx
src/features/pdfcomponent/domain/*
src/features/pdfcomponent/examples/*
```

## Reglas

- Fusionar componentes <40 líneas sin estado.
- Eliminar reexports triviales.
- No duplicar canvas/toolbar/inspector.
- Mantener lab separado del runtime.

## Validación

Lab sigue cargando.

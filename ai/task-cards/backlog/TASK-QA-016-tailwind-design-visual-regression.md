# TASK-QA-016 — Cerrar regresión visual y ledger Tailwind

## Objetivo

Validar integralmente el diseño corregido y cuantificar la reducción de Tailwind en CSS sin introducir cambios de producto.

## Alcance

- Ruta `/lab/multi-document-routing`.
- Usuarios/propietarios múltiples, documentos múltiples, sidebars y canvas.
- Conteos finales de `@apply`, estilos inline y selectores.

## Fuera de alcance

Implementar arreglos. Cada fallo genera una tarjeta de regresión nueva.

## Archivos candidatos

Máximo 5 archivos de pruebas/baselines/reportes. Código de producto prohibido.

## Archivos prohibidos

Todo `src/**` salvo lectura.

## Pasos

1. Fijar viewport, datos, página y zoom.
2. Capturar estados por propietario y sidebars.
3. Ejecutar auditoría, typecheck, lint y suites focalizadas.
4. Comparar con baseline y registrar excepciones.

## Validación

Checklist completo, cero regresiones críticas y ledger reproducible.

## Criterio de parada

Ante cualquier fallo funcional o visual, no editar producto: crear tarjeta nueva y dejar QA bloqueada.

## Entrega final

Reporte final con capturas, comandos, resultados y deuda remanente priorizada.

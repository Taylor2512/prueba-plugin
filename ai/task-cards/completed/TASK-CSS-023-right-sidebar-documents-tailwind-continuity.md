# TASK-CSS-023 — Restaurar rail de documentos y sidebar derecho

## Objetivo

Corregir densidad, truncado, botones de borrado y selección del rail de documentos, migrando layout estático a JSX/TSX.

## Alcance

- Tabs Campos/Detalle, cabecera Docs y lista de documentos.
- Estado activo, metadatos, botón subir PDF y delete.
- Overflow vertical/horizontal y accesibilidad.

## Fuera de alcance

Carga real del PDF, reordenamiento, inspector interno y poda CSS global.

## Archivos candidatos

Máximo 5: `RightSidebar.tsx`, layout, `DocumentsRail`, toolbar y item de documento; confirmar rutas.

## Archivos prohibidos

Canvas, Renderer, snapshot, generator, `pdf-lib` y LeftSidebar.

## Pasos

1. Reproducir con dos documentos y nombres largos.
2. Migrar layout y estados a clases estáticas.
3. Preservar callbacks y contratos públicos.
4. Verificar colapso y responsive.

## Validación

Typecheck, pruebas del rail, teclado y capturas con documento activo/inactivo.

## Criterio de parada

Detenerse si requiere cambiar lógica de documentos o más de 5 archivos.

## Entrega final

Matriz de estados y evidencia visual.

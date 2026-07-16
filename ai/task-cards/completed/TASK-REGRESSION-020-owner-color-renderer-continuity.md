# TASK-REGRESSION-020 — Restaurar color exterior por propietario

## Objetivo

Restaurar el contrato por el cual cada schema muestra en su chrome exterior el color del propietario y cambia correctamente al cambiar de usuario o reasignar propietario.

## Alcance

- Trazar `ownerId/assignedTo/recipientId` desde datos hasta `Renderer`.
- Unificar la resolución del tono exterior para que no compita `ownerColor` con `schemaTone`.
- Conservar estados selected, hover, read-only y disabled.
- Añadir una prueba focalizada de cambio de usuario/propietario.

## Fuera de alcance

- Migración general de CSS.
- Colores por acción o estado documental.
- Moveable, Selecto, zoom, guías, snapshot y generación PDF.

## Archivos candidatos

Máximo 5: `Renderer.tsx`, `fieldChrome.ts`, `schemaOwnershipAppearance.ts`, fixture de `multiDocumentRouting` y una prueba focalizada. Confirmar rutas reales antes de editar.

## Archivos prohibidos

`sisad-pdfme.css`, `labRoutes.css`, `tokens.css`, motores de geometría, snapshot, generator y `pdf-lib`.

## Pasos

1. Documentar precedencia actual de identificadores y tonos.
2. Reproducir cambio de usuario con dos propietarios de colores distintos.
3. Definir una única función pura de resolución del color exterior.
4. Aplicarla sin cambiar geometría ni DOM.
5. Probar cambio de usuario, selección y fallback sin propietario.

## Validación

- Typecheck y lint focalizado.
- Prueba unitaria/integración de propietario A → B.
- Verificación visual en `/lab/multi-document-routing` con dos usuarios.
- El borde/fondo/acento cambia sin refrescar y conserva contraste legible.

## Criterio de parada

Detenerse si el identificador real no está disponible en el contrato público o si arreglarlo exige modificar más de 5 archivos; crear una tarjeta de contrato de datos.

## Entrega final

Tabla antes/después de resolución de propietario, archivos modificados, pruebas ejecutadas y evidencia visual.

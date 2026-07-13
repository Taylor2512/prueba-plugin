# TASK-LAB-001 — Reubicar el panel de resultados del laboratorio

## Objetivo
Mover `ResultsPanel` fuera de la zona de canvas/zoom y compactar su presentación para que no interfiera con el workspace del laboratorio.

## Alcance
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/labRoutes.css`
- `src/styles/sisad-tailwind-bridge.css`

## Fuera de alcance
- `src/sisad-pdfme/**`
- `Moveable`
- `Selecto`
- `snapshotAdapter`
- `generator`
- `pdf-lib`

## Pasos
1. Convertir el modo drawer en una barra inferior compacta que no cubra el canvas cuando está cerrada.
2. Reducir la altura y densidad del cuerpo de resultados.
3. Ajustar el copy de estado vacío/cerrado a una etiqueta más breve.
4. Verificar que la colocación no rompa el layout del laboratorio.

## Validación
- `npm run lint`
- `npm run build`

## Criterio de parada
- Si hace falta tocar el runtime del diseñador o geometría del canvas, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Validación ejecutada

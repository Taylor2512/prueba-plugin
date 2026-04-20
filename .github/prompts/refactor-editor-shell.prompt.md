# Prompt: Refactor del shell del editor

Actúa como arquitecto frontend senior experto en React, canvas, sisad-pdfme y editores visuales.

## Contexto
Existe un editor PDF construido con React y sisad-pdfme modificado. El estado actual mezcla lógica de laboratorio, runtime del diseñador, resultados de conversión y layout visual. El objetivo es evolucionarlo a un producto con UX compacta tipo Wix.

## Objetivo
Refactorizar el shell principal del editor para separar:
- EditorRail
- TopBar compacta
- ContextDrawer
- BottomResultsDrawer
- Workspace central
- Runtime del editor desacoplado

## Restricciones
- no romper compatibilidad funcional existente
- mantener la base React actual
- no introducir librerías innecesarias
- minimizar cambios fuera del alcance
- conservar nombres semánticos

## Entregables
1. nueva estructura de componentes
2. propuesta de archivos
3. implementación de base
4. criterios de aceptación
5. notas de migración

## Criterios de aceptación
- el canvas gana espacio visible
- los paneles secundarios dejan de ocupar espacio permanente
- las acciones principales siguen accesibles
- el layout queda listo para escalar


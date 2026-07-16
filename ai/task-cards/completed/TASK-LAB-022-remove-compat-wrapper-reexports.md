# TASK-LAB-022 — Deprecar wrappers/re-exports innecesarios

Estado: completed

## Objetivo
Reducir wrappers que no agregan comportamiento.

## Tareas
- Auditar imports de `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js`, `domain/collaborationAppearance.js`.
- Si no hay consumo externo, eliminar.
- Si hay consumo, marcar deprecated y migrar imports.

## Criterios
- Menos archivos de re-export sin pérdida de API usada.

## Cierre
- Se eliminaron wrappers sin consumo real: `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js` y `domain/collaborationAppearance.js`.
- `npm run build` siguió pasando tras la poda.

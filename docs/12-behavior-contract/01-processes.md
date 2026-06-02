# Procesos transversales de SISAD PDFME

## Regla

Todo fix debe mapearse a un proceso. Si un proceso cruza varios componentes, no se corrige solo en el componente visible.

## Procesos principales

| Proceso | Resultado esperado | Componentes |
|---|---|---|
| Inicializar designer | PDFs, recipients, schemas y page stack estables | Designer, Canvas, Snapshot |
| Crear schema | Nuevo schema con owner, color, doc/page y no-overlap | LeftSidebar, schema registry, autoPlace, Renderer |
| Seleccionar schema | activeSchemas sincronizado con Canvas, DetailView y ListView | Renderer, Selecto, Moveable, DetailView |
| Selección múltiple | Acciones operan sobre todos los seleccionados | Selecto, Moveable, Toolbar, selectionCommands |
| Transformar | Drag/resize/rotate sin máscara ni corrupción de coordenadas | Moveable, coordinateService, commandBus |
| Shortcuts | Teclas ejecutan comandos reales y respetan foco | keyboardShortcutRegistry, guards, commandBus |
| Convertir checkbox | checkbox -> checkboxGroup preservando identidad | checkbox plugin, selectionCommands, Snapshot |
| Agregar opción | + agrega option al group sin overlap | group utils, schema plugin, DetailView |
| No-overlap | No hay colisiones por owner/doc/page | schemaCollision, schemaAutoPlace |
| Snapshot | Round-trip sin pérdida de identidad | snapshotAdapter, migration |
| Form/Viewer/PDF | Ejecución coincide con Designer | Form, Viewer, Generator |
| externalForms | Host consume snapshot y runtime | externalFormRunner, ContentCustomForm |

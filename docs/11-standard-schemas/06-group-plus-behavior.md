# Botón + en grupos

## Tabla de comportamiento

| Schema/contexto | Acción del + |
|---|---|
| checkbox | convertir a checkboxGroup |
| checkboxGroup | agregar casilla al mismo grupo |
| radioGroup | agregar opción al mismo grupo |
| select/dropdown | no aplica en canvas; opciones en DetailView |

## Reglas

- No usar eventos custom muertos sin listener.
- No crear schema separado salvo que el contrato lo indique.
- No perder identidad.
- No solapar opciones internas.
- No salir de página.
- No regenerar IDs en cada render.

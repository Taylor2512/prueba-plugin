# Contexto — Form / Viewer / Generator parity

## Principio

Un schema que existe en Designer debe poder ejecutarse en Form, verse en Viewer y renderizarse en PDF sin crear un renderer paralelo en externalForms.

## Matriz mínima

| Schema | Designer | DetailView | Form | Viewer | Generator/PDF | Snapshot |
|---|---|---|---|---|---|---|
| text | input editable | contenido/estilo | escribe texto | muestra texto | imprime texto | content/style |
| number | campo numérico | validación/formato | valida número | muestra valor | imprime valor | min/max/format |
| checkbox | check simple | estado/required | check/uncheck | readonly | check/caja | checked |
| checkboxGroup | grupo multi | opciones/min/max | multiselect | readonly | checks | options/selectedOptionIds |
| radioGroup | grupo exclusivo | opciones/default | selección única | readonly | opción marcada | options/selectedOptionId |
| select | dropdown | options/default | selecciona | readonly | valor | options/value |

## No hacer

- No duplicar inputs manuales en externalForms.
- No depender únicamente de `content` cuando el schema tiene `selectedOptionIds` u `options`.
- No perder compatibilidad con snapshots legacy.

# Form state / echo risks

El snapshot muestra tres capas de estado: clase `Form`, `usePreviewRuntime` y `usePdfmeRuntimeInstance`. Sin origin/revision explícitos, una mutación puede cruzar runtime→host→setInputs→runtime y parecer un input nuevo.

Caso obligatorio de regresión: schema A texto escribe sin blur → schema B radio/checkboxGroup interactúa → A conserva draft/caret/valor. Repetir con host rerender y update externo.

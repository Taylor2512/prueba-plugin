# Prompt — migrar un ejemplo a JSON declarativo

Migra una sola página de `src/examples`.

Objetivo:

```txt
página <= 30 líneas
definition en JSON
montaje mediante SisadPdfmeInstance o ExampleRuntimePage
sin useMemo/useRef/useCallback para orquestación básica
sin deep imports
sin colors/ownership/layout/config merge local
```

Conserva ruta, shell, título y comportamiento visible.

Antes de borrar helpers, confirma que no tienen otros consumidores.

Ejecuta unit test focal y Playwright de la ruta.

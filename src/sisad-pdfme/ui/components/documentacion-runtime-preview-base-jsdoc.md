# Documentación técnica — Runtime / Preview base

## Rol del bloque

Este bloque contiene la base visual y funcional usada por Preview/Form/Viewer en SISAD PDFME. Su propósito es convertir templates en páginas renderizables, montar schemas mediante plugins, controlar zoom/navegación y sincronizar inputs/persistencia/API/Form JSON cuando aplica.

## Fronteras importantes

- `AppContextProvider` publica contexto global: tema, labels, fuentes, plugins y opciones.
- `CtlBar` solo emite callbacks; no modifica template directamente.
- `Paper` calcula y estabiliza páginas, fondos y metadata DOM.
- `Renderer` aísla plugins imperativos dentro de un wrapper controlado por el canvas.
- `Preview` compone el runtime y aplica reglas de visibilidad/acceso antes de renderizar cada schema.
- `usePreviewRuntime` concentra cálculos dinámicos, prefill, persistencia, requests y emisión de eventos runtime.

## Reglas preservadas

- No se cambió comportamiento funcional.
- No se cambiaron nombres de componentes ni exports por defecto.
- No se agregó lógica de negocio del host.
- No se introdujeron z-index hacks ni acoplamientos a Moveable/Selecto fuera del renderer/canvas.

## Recomendaciones de QA

1. Validar Preview con 1/N páginas y 1/N inputs.
2. Validar zoom presets y menú de acciones en anchos `comfortable`, `compact` y `minimal`.
3. Validar staticSchema con basePdf blank.
4. Validar schemas readOnly con placeholders y dateSigned enlazado a signature.
5. Validar que plugins imperativos no acumulen DOM tras cambios de schema/value.
6. Validar persistencia/prefill/API del hook sin sobrescribir valores ya digitados por usuario.

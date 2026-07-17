# Gaps y riesgos detectados

## Gaps confirmados por código/documentación

1. `detachCommentFromField` pasa `schemaUid: ''`, pero el normalizador actual solo aplica `schemaUid` cuando tiene texto. El caso está marcado `it.todo`.
2. El ListView ha mantenido selección local además de `activeSchemaIds`; la suite exige una sola fuente de verdad.
3. Existen riesgos de scroll anidado en RightSidebar. Los E2E verifican un solo propietario scrollable por panel.
4. La densidad histórica `mini` y la actual `minimal` pueden divergir. Los tests responsive cubren 256/318/390 px.
5. El selector de usuario activo puede existir visualmente sin actualizar el registry real. Los tests verifican valor y efecto visible.
6. El cierre de modales AntD puede dejar overlays ocultos y bloquear selección. Los tests de Reasignar/Comentarios verifican recuperación.
7. La migración Tailwind aún conserva `@apply`; el presupuesto evita que aumente y permite reducirlo gradualmente.
8. Algunos specs visuales requieren baseline local y no pueden validarse fuera del repositorio ejecutable.

## Política sugerida

- `todo/fixme`: contrato conocido pero implementación pendiente.
- `skip`: funcionalidad explícitamente deshabilitada por configuración del ejemplo.
- fallo activo: regresión en una funcionalidad que el ejemplo declara habilitada.

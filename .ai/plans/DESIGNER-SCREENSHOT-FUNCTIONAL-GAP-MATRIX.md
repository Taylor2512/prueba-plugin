# Matriz funcional — Designer, exportación y controles de edición

## Propósito

Esta matriz convierte las capturas entregadas y las fuentes de diagnóstico en trabajo ejecutable. Las capturas son evidencia visual; no sustituyen el contrato del core ni autorizan reglas específicas de un host. Cada fila debe terminar en una task card, una prueba reproducible y una evidencia enlazada.

## Evidencia visual consolidada

| Evidencia | Observación | Riesgo que debe cerrarse |
|---|---|---|
| Atajos (capturas 1–5) | Modal largo y desplazable con categorías Global, Selección, Canvas, Campo, Navegación, Vista y Colaboración; incluye `Bloquear / desbloquear (L)` | Acciones declaradas pero no ejecutables, colisiones de teclas, scroll/focus inaccesibles, shortcut de lock sin paridad con el botón |
| Exportación (captura 6) | El navegador descarga `[object Object].pdf`; el PDF contiene marcadores/rectángulos con color | Conversión implícita de `basePdf` a string y fuga de color fuera del renderer principal |
| Designer (capturas 7, 11, 12) | Filas de campos muestran icono de candado y etiqueta `Solo lectura`; existen estados de asignación, detalle, comentarios y selección | No distinguir solo lectura de posición bloqueada ni lock colaborativo; toggle sin persistencia o sin feedback |
| Menú contextual (capturas 8–10) | Acciones Eliminar, Duplicar, Más; dentro de Más aparecen Ocultar, Bloquear posición, Liberar edición, orden e inspector | Menú desalineado con registry/permissions; estados mixtos y acciones que mutan un schema bloqueado |
| Canvas y grupos (capturas 8–9) | Checkbox/radio groups con handles, dimensiones y botón de inserción | Placement ambiguo, identidad tardía, option scope cruzado y regresiones por siblings |

## Contrato de estados de bloqueo

No usar una sola bandera para tres conceptos distintos:

| Estado | Campo/autoridad a confirmar | Qué impide | Qué conserva | UI esperada |
|---|---|---|---|---|
| Solo lectura de contenido | `readOnly`/`readonly` del schema y `SchemaAccessState.readonly` | Edición del valor/properties editables | Selección, inspección, navegación y exportación | Candado cerrado, `Solo lectura`, `aria-pressed=true`; toggle abre/cierra |
| Posición bloqueada | `locked`/`objectLocked` y acciones `lockSchemas`/`unlockSchemas` | Move/resize/delete estructural según policy | Edición de contenido si policy lo permite | `Bloquear posición`/`Desbloquear posición` |
| Lock colaborativo | `schema.state`, `schema.lock`, owner/session y adapter | Edición estructural por otro actor; puede permitir liberar sólo al dueño/policy | Identidad, owner, comentarios, historial | `En edición por…`, `Liberar edición`, razón de disabled |

La tarjeta QH-013 debe fijar nombres definitivos, precedencia, permisos y migración de snapshots. El icono de la fila no puede representar ambiguamente los tres estados.

## Matriz por superficie

| Superficie | Comportamiento requerido | Estado/evidencia actual | Tarea |
|---|---|---|---|
| Toolbar/Control bar | Guardar, deshacer/rehacer, página, zoom, PDF y exportación de template usan commands separados y reportan busy/error | El flujo PDF ya separa `onDownloadPdf` de `onExportTemplate`; falta resolver nombre en Preview/runtime | QH-011, QH-012 |
| Shortcut modal | Registry único, búsqueda, categorías, platform keys, foco inicial, Escape, scroll interno, estados disabled y acción ejecutable | Las capturas muestran el catálogo; la auditoría debe demostrar paridad y accesibilidad | QH-015 |
| LeftSidebar | Registry de schemas con search/filter/favoritos/recientes y drag que crea una instancia nueva con identidad | Existe hardening previo; option groups siguen con diagnóstico pendiente | QH-001–QH-005, QH-017 |
| Canvas | Selección, move/resize, grid/ruler/snap, multi-select, grupos, lock de posición y overlays no contaminan export | Drag de selección ya separado; faltan estados lock y pruebas visuales | QH-013, QH-014, QH-020 |
| RightSidebar | Lista, detalle, comentarios/documentos, assignment, selección; candado de fila activa/desactiva solo lectura sin desmontar el panel | Hay `SchemaAccessState` y badges; falta conectar toggle de UI a command/mutation persistente | QH-013, QH-014, QH-017 |
| Menú `Más` | Todas las acciones vienen de action registry; labels/disabled/tooltip coinciden con policy | Registry ya tiene lock-position/unlock-position; falta cobertura de read-only y estados mixtos | QH-016 |
| Inspector | Propiedades visibles según capability; read-only no se puede editar y ofrece razón; lock position no oculta propiedades permitidas | Capability graph distingue runtime readonly, pero se requiere contrato por schema | QH-013, QH-017 |
| Collaboration | Lock propio/ajeno, owner, liberación, conflictos y sincronización no pisan `readOnly`/`locked` | Adapter y `schemaRuntimeAccess` existen; falta prueba de integración del botón y snapshots | QH-013, QH-014 |
| Preview/Viewer/Form | Render readonly no ejecuta mutaciones; inputs respetan readOnly, hidden, owner y export | Preview fuerza readonly por acceso; falta probar toggle del Designer hasta estos runtimes | QH-014 |
| PDF renderer | Todas las tintas vectoriales/texto/shape/SVG y, si la definición exige “todo color”, raster de imágenes se convierten a grayscale; ningún overlay de editor se exporta | `colorType: grayscale` ya se propaga a exportación; no hay gate explícito para imágenes/renders plugin | QH-012 |
| Artifact download | Nombre derivado de string/objeto `basePdf`, sin `[object Object]`, path/query ni doble extensión | Designer tiene helper string-only; Preview y runtime aún convierten objeto con `String(...)` | QH-011 |

## Flujo de ejecución obligatorio

```text
Intent (click/shortcut) → Policy (capability + access) → Command
→ Mutation (schema/template) → Event (history/collaboration)
→ Effect (render/export/download) → Snapshot (persistencia/evidencia)
```

Una tarjeta no se considera terminada si sólo cambia el icono o el handler local: debe demostrar el recorrido completo y el comportamiento después de recargar, deshacer/rehacer, cambiar de página y exportar.

## Criterios transversales de aceptación

- No aparece `[object Object]` en nombre visible, nombre descargado, telemetry ni error.
- Exportar PDF no incluye overlays, bordes de selección, colores de destinatario ni colores de campos; las imágenes raster se clasifican explícitamente como `grayscale` o `unsupported` antes de afirmar el gate.
- Solo lectura, posición bloqueada y lock colaborativo tienen labels, iconos, `aria-pressed`, tooltips y razones de disabled distintos.
- Toggle de candado funciona desde fila del RightSidebar, inspector, menú `Más` y shortcut `L` con el mismo command id.
- Multi-selección con estados homogéneos/mixtos no pierde selección ni aplica una mutación parcial silenciosa.
- Cada prueba conserva screenshot/video/trace sólo cuando aporta evidencia; no se usan `skip`, sleeps ni timeouts como parche.


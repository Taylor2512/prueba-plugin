# Plan — Designer quality hardening, exportación y controles de edición

## Objetivo

Cerrar la campaña de calidad del Designer y PDFME sin alterar producción cuando la evidencia sólo demuestra un problema del harness. La campaña separa creación, identidad, placement, selección, mutación, historial, aislamiento de siblings, exportación monocromática, nombres de artefacto y los tres tipos de candado. La matriz complementaria [`DESIGNER-SCREENSHOT-FUNCTIONAL-GAP-MATRIX.md`](./DESIGNER-SCREENSHOT-FUNCTIONAL-GAP-MATRIX.md) es la guía de cobertura por superficie.

## Autoridad y alcance

- Fuentes primarias: notas de diagnóstico adjuntas y capturas de Designer/exportación entregadas por el usuario.
- Estado operativo: task cards de `quality-hardening/` y sus evidencias.
- Código reusable: no introducir reglas del host ni IDs globales artificiales.
- Cada defecto de producto confirmado debe permanecer rojo hasta ser corregido; no usar `skip`, timeouts ampliados ni assertions debilitadas.

## Estado inicial confirmado

- Suite observada: 133 E2E, 130 PASS y 3 FAIL.
- Fallos de grupos: el selector actual mezcla “drop no creó” con “creó sin identidad”.
- Fallo de siblings: la ejecución no demuestra rollback; falla antes, en la primera edición inmediata.
- Evidencia funcional adyacente: drag de grupos, add/remove, undo/redo, aislamiento y stress permanecen verdes.
- Hipótesis actual: harness/selector/placement antes que regresión de producto.
- Captura confirmada: el nombre `[object Object].pdf` prueba una conversión de objeto a string en alguna ruta de descarga; Designer ya tiene un helper string-only, pero Preview/runtime aún deben converger a un resolver común.
- Captura confirmada: el PDF observado contiene tintas de color; el flujo principal ya fuerza `grayscale`, pero faltan gates de renderer/plugin e imágenes raster.
- Capturas confirmadas: existe un candado de fila con `Solo lectura`, y el menú `Más` diferencia `Bloquear posición` de `Liberar edición`; se requiere contrato y paridad de commands.

## Orden de ejecución

1. **QH-001 P0** — separar creación e identidad.
2. **QH-002 P0** — repetir los dos rojos y clasificar.
3. **QH-003 P1** — estabilizar placement y fixtures.
4. **QH-004 P1** — comparar contrato semántico de option groups.
5. **QH-005 P1** — cerrar aislamiento `groupId`/`optionId`/historial.
6. **QH-006 P1** — assertions inmediatas de siblings.
7. **QH-007 P1** — helper correcto para `contenteditable="plaintext-only"`.
8. **QH-008 P1 DONE** — drag de RightSidebar desacoplado.
9. **QH-009 P1 DONE** — auditoría Tailwind/CSS técnico.
10. **QH-011 P0 READY** — resolver de nombre de artefacto sin `[object Object]`.
11. **QH-012 P0 READY** — gate PDF completamente monocromático.
12. **QH-013 P0 READY** — contrato de solo lectura, posición y lock colaborativo.
13. **QH-014 P1 BACKLOG** — E2E del candado hasta Preview/Viewer/Form.
14. **QH-015 P1 BACKLOG** — registry, accesibilidad y paridad del panel de atajos.
15. **QH-016 P1 BACKLOG** — menú contextual `Más` y capability policy.
16. **QH-017 P1 BACKLOG** — contrato de filas del RightSidebar.
17. **QH-018 P1 BACKLOG** — diagnóstico y aislamiento de option groups.
18. **QH-019 P1 BACKLOG** — siblings, contenteditable y Number.
19. **QH-020 P1 BACKLOG** — regresión visual/responsive.
20. **QH-021 P2 BACKLOG** — limpieza, migración y observabilidad.
21. **QH-010 P0** — gates finales y evidencia.

## Dependencias

```text
QH-001 → QH-002 → QH-003
QH-001 → QH-004 → QH-005
QH-006 → QH-007
QH-011 → QH-012
QH-013 → QH-014 → QH-020
QH-013 → QH-015 → QH-016
QH-008, QH-013 → QH-017
QH-001–QH-005 → QH-018
QH-006 → QH-019
QH-002, QH-005, QH-007, QH-008, QH-009, QH-012, QH-014, QH-016–QH-020 → QH-010
```

## Política de decisión

1. Total no aumenta: `DROP_NOT_COMMITTED`.
2. Total aumenta pero IDs no: `SCHEMA_CREATED_WITHOUT_IDENTITY`.
3. Total e IDs aumentan: continuar con contrato semántico, no deep equality.
4. Edición inmediata falla: `FIRST_EDIT_DID_NOT_COMMIT`.
5. Sólo una edición previa preservada que luego desaparece prueba `SIBLING_ROLLBACK`.
6. El icono de fila no prueba mutación: la evidencia mínima del candado es command → policy → mutation/event → snapshot → comportamiento en runtime.
7. Un PDF válido no prueba monocromía: el gate debe comprobar crominancia y clasificar imágenes raster.
8. Un nombre legible en UI no prueba el download: comprobar `suggestedFilename` real y telemetry.

## Gates de entrega

Unit focales y suite completa; Playwright Chromium/Firefox/WebKit; E2E de lock/readOnly y descarga; gate de crominancia PDF; `npm run typecheck`; `npx eslint . --max-warnings=0`; `npm test`; `npm run build`; arquitectura; Serena y `git diff --check`.

## Recomendación de ejecución por bloques

### Bloque A — P0 de evidencia reproducible

Ejecutar QH-011, QH-012 y QH-013 primero. Son los riesgos visibles en las capturas y pueden invalidar cualquier aprobación visual posterior. No marcar QH-012 verde hasta cubrir imágenes/plugin renderers.

### Bloque B — interacción y contrato de UI

Con P0 estable, ejecutar QH-014–QH-017. La regla es una sola fuente para command/policy/label; los botones no pueden introducir mutaciones paralelas.

### Bloque C — regresiones existentes

Ejecutar QH-018 y QH-019 con los fixtures diagnósticos originales; conservar clasificación de harness/producto y no reemplazar assertions por esperas.

### Bloque D — evidencia visual y cierre

Ejecutar QH-020, QH-021 y después QH-010. El cierre debe enlazar resultados, traces, snapshots, PDF generado y decisión sobre cada `DESCONOCIDO`.

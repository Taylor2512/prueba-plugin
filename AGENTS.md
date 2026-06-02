# AGENTS.md — Router neutral IA para SISAD PDFME v5

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/memory/project-memory.md`.
3. Leer `.ai/context-map.md`.
4. Seleccionar agente en `.ai/agents/registry.md`.
5. Cargar máximo 1 contexto principal + 2 reglas + 1 prompt al inicio.
6. Inspeccionar código real con `rg` antes de proponer cambios.
7. Si la tarea toca comportamientos transversales, cargar `application-behavior-contract-context.md`.

## Principio rector v5

No se corrige por síntoma. Se corrige por proceso:

```txt
Proceso -> Componentes involucrados -> Fuente de verdad -> Estados válidos -> Datos preservados -> Tests -> Implementación
```

Cada cambio debe declarar si afecta Designer, Canvas, Renderer, Selection, Shortcuts, CommandBus, DetailView, ListView, Snapshot, Form, Viewer, Generator/PDF o externalForms.

## Prioridad del proyecto

- Cada destinatario/usuario debe tener color único y accesible.
- El catálogo de schemas toma el color del destinatario activo solo para schemas nuevos.
- Los schemas ya creados conservan owner/color original.
- Resize, rotate, drag, selección múltiple, Selecto, Moveable y shortcuts deben convivir sin colisiones.
- `text`, `number`, `checkbox`, `checkboxGroup`, `radioGroup`, `select/dropdown`, `signature`, `date`, `image`, `svg`, `barcode/QR`, `table`, `multiVariableText`, `line` y shapes deben tener contrato de Designer, DetailView, Form, Viewer, Generator/PDF y Snapshot.
- El botón `+` debe tener contrato explícito por contexto: convertir checkbox a grupo o agregar opción al grupo existente.
- Ningún schema del mismo owner/destinatario debe quedar superpuesto en el mismo documento/página.
- Si una página no tiene espacio suficiente, se debe distribuir entre páginas/PDFs disponibles o mostrar feedback claro.
- El snapshot debe preservar documentos, páginas, schemas, recipients, assignments, ownerColor, groupId, optionId, selectedOptionIds, rotation, comments y firma.
- `externalForms` debe consumir `Form`/`Viewer` desde `sisad-pdfme`, no crear un renderer paralelo.
- `ContentCustomForm` debe actuar como host de negocio, no como runtime visual.

## Guardrails no negociables

- No acoplar el fork `sisad-pdfme` a lógica SISAD no genérica.
- No copiar marca, CSS propietario ni nombres internos de DocuSign/Wix; solo patrones UX generales.
- No duplicar runtime de canvas, sidebars, inspector, snapshot engine ni schemas.
- No manipular DOM interno del diseñador desde hosts externos.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- No romper geometría de canvas, zoom, scroll, Moveable o Selecto.
- No arreglar page gap/no-overlap/coordenadas con CSS superficial.
- No convertir `externalForms` en renderer paralelo si `Form`/`Viewer` ya cubren el caso.
- Si cambia API pública, data attributes o snapshot, agregar docs y tests.
- Si hay contradicción entre proveedores, prevalece `.ai/`.

## Formato de cierre

```md
## Contexto usado
## Agente/subagente
## Proceso afectado
## Diagnóstico
## Cambios realizados/propuestos
## Contratos preservados
## Validación
## Riesgos residuales
## Documentación/memoria actualizada
```

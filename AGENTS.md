# AGENTS.md — Router neutral IA para SISAD PDFME

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/memory/project-memory.md`.
3. Leer `.ai/context-map.md`.
4. Seleccionar agente en `.ai/agents/registry.md`.
5. Cargar máximo 1 contexto principal + 2 reglas + 1 prompt al inicio.
6. Inspeccionar código real con `rg` antes de proponer cambios.

## Prioridad del proyecto

- Cada destinatario/usuario debe tener color único y accesible.
- El catálogo de schemas debe tomar el color del destinatario activo.
- Los schemas ya creados deben conservar color/owner original.
- Resize, rotate, drag y selección deben convivir sin colisiones.
- `checkboxGroup`, `radioGroup`, `select/dropdown`, `checkbox`, `text` y `number` deben funcionar en Designer, DetailView, Form, Viewer, Generator/PDF y snapshot.
- El botón `+` debe tener contrato explícito por contexto: convertir checkbox a grupo o agregar opción al grupo existente.
- Ningún schema del mismo owner/destinatario debe quedar superpuesto en el mismo documento/página.
- El snapshot debe preservar documentos, páginas, schemas, recipients, assignments, ownerColor, groupId, optionId, selectedOptionIds, rotation, comments y firma.
- `externalForms` debe consumir `Form`/`Viewer` desde `sisad-pdfme`.
- `ContentCustomForm` debe actuar como host de negocio, no como runtime visual.

## Guardrails no negociables

- No acoplar el fork `sisad-pdfme` a lógica SISAD no genérica.
- No copiar marca, CSS propietario ni nombres internos de DocuSign/Wix.
- No duplicar runtime de canvas, sidebars, inspector, snapshot engine ni schemas.
- No manipular DOM interno del diseñador desde hosts externos.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- No romper geometría de canvas, zoom, scroll, Moveable o Selecto.
- No convertir `externalForms` en renderer paralelo si `Form`/`Viewer` ya cubren el caso.
- Si cambia API pública, data attributes o snapshot, agregar docs y tests.
- Si hay contradicción entre proveedores, prevalece `.ai/`.

## Formato de cierre

```md
## Contexto usado
## Agente/subagente
## Diagnóstico
## Cambios realizados/propuestos
## Validación
## Riesgos residuales
## Documentación/memoria actualizada
```

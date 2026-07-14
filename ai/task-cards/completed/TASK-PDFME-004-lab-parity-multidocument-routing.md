# TASK-PDFME-004 — Paridad funcional con lab/multi-document-routing

**Estado:** active  
**Prioridad:** P0  
**Responsable sugerido:** Codex  
**Área:** `src/features/pdfcomponent/labs/examples`, `src/sisad-pdfme`, host apps

## Objetivo

Tomar `http://localhost:5174/lab/multi-document-routing` como contrato funcional de referencia para portar las capacidades al host SISAD-WEB/DigitalAgreements.

## Baseline

El laboratorio usa:
- `defaultMode: "designer"`
- `initialSchemaType: "text"`
- `collaboration` con recipients y colores
- `sessionId`
- `actorId`
- `template`
- `runtimeOptions.activeDocumentId`
- `runtimeOptions.uploadedDocuments`

## Matriz obligatoria

Crear reporte:

```txt
Capacidad | LAB multi-document-routing | SISAD-WEB actual | Estado | Acción
```

Incluir uploadedDocuments, activeDocumentId, callbacks de documentos, collaboration, activeRecipientId, actorId, canEditStructure, schema ownership, SchemaAssignmentDialog, onBulkAssignRecipient, onTemplateChange, identity y Form runtime preview.

## Comandos

```bash
rg -n "multi-document-routing|createLabExample|createCollaboration|multiDocumentRoutingDocuments|multiDocumentRoutingTemplate|runtimeOptions|activeDocumentId|uploadedDocuments" src
rg -n "SchemaAssignmentDialog|onBulkAssignRecipient|schemaAssignmentService|ownerRecipientId|ownerRecipientIds" src/sisad-pdfme
```

## Criterios

- [ ] La tabla LAB vs host está documentada.
- [ ] No se copian fixtures del lab.
- [ ] Solo se portan capacidades reusable.
- [ ] Se detectan diferencias reales antes de modificar.
- [ ] No se crea runtime paralelo.
- [ ] El host puede montar Designer con el mismo contrato semántico del lab.

## Salida esperada

`ai/reports/lab-parity-multidocument-routing.md`

## Cierre parcial (2026-07-14, Claude)

- [x] La tabla LAB vs host está documentada → `ai/reports/lab-parity-multidocument-routing.md`.
- [x] No se copian fixtures del lab (solo se leyó su config como contrato).
- [x] Solo se portan capacidades reusables (registry/wrappers/service, sin lógica SISAD).
- [x] No se crea runtime paralelo (wrappers montan Designer/Form/Viewer reales).
- [x] El host puede montar Designer con el mismo contrato semántico del lab
      (documents/recipients/activeRecipientId/collaboration vía config + props).
- [ ] "Se detectan diferencias reales antes de modificar" en SISAD-WEB: requiere
      auditar `Sisad-Web-FRONTEND` (otro repositorio, no disponible aquí). Los
      comandos rg a ejecutar quedaron en el reporte.

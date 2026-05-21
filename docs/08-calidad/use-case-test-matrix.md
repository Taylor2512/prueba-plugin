# Matriz caso de uso → pruebas (Fase 1)

Estado: auditoría inicial (no implementación masiva aún).  
Leyenda estado: `covered` | `partial` | `missing` | `weak` | `blocked`.

| Caso de uso | Unit test | Component test | E2E test | Estado | Prioridad |
|---|---|---|---|---|---|
| Preparar documento | `sisad-snapshotAdapter.test.ts`, `sisad-templateValidator.test.ts` | parcial (shell/layout) | `pdfme-editor.spec.ts` (docs rail/base) | partial | P0 |
| Agregar campos | `selectionCommands.test.ts`, `schemaClipboard.test.ts` | parcial | `pdfme-editor.spec.ts` add schema | covered | P0 |
| Configurar campos | `detailSchemas.test.ts`, `detailWidgets.test.tsx` | sí | parcial e2e | partial | P1 |
| Asignar destinatario | `collaborationAssignmentsAndComments.test.ts` | parcial | parcial e2e | partial | P0 |
| Cambiar destinatario | `selectionCommands.test.ts` (parcial) | parcial | e2e colaboración | partial | P0 |
| Validar requeridos | `sisad-templateValidator.test.ts` | n/a | no dedicado | partial | P0 |
| Usar atajos | `sisad-keyboardShortcuts.test.ts` | no hook directo completo | e2e shortcuts | covered | P1 |
| Multi-select | `selectionCommands.test.ts` | parcial | e2e shortcuts/canvas | partial | P1 |
| Agrupar | `sisad-schemaGroups.test.ts` | n/a | e2e shortcuts | partial | P1 |
| RadioGroup | `radioGroupSchema.test.ts` | parcial | no dedicado | partial | P0 |
| Firma | `signatureSchema.test.ts`, `sisad-signaturePolicy.test.ts` | parcial | e2e firma básico | partial | P0 |
| Comentarios | `commentModel.test.ts`, `commentsRail.test.tsx` | sí | e2e comment create | partial | P1 |
| Locks | `sisad-lockManager.test.ts`, `schemaLockEvents.test.ts`, `sisad-schemaLockGuard.test.ts` | parcial | e2e lock duro faltante | partial | P0 |
| Export/import snapshot | `sisad-snapshotAdapter.test.ts` | n/a | no flujo e2e dedicado | missing | P0 |
| ExternalForms | sin cobertura directa | n/a | no cobertura | missing | P0 |
| Generator | `generatorHelper.test.ts` | n/a | runtime e2e parcial | partial | P1 |
| Responsive | component tests parciales | parcial | algunos checks en `pdfme-editor.spec.ts` | weak | P2 |
| Error handling | `sisad-canvasRenderState.test.ts`, `sisad-useCanvasRenderState.test.ts` | parcial | no suite dedicada | partial | P1 |

## Hallazgos de bloqueo para próximas fases

- `ExternalForms` (P0) está `missing`.
- snapshot export/import E2E está `missing`.
- locks de interacción en E2E están `partial`.
- hook `useDesignerKeyboardShortcuts` y `keyboardShortcutRegistry` carecen de cobertura directa robusta.

## Orden recomendado para Fase 3+

1. P0 faltantes directos: `externalFormRunner`, snapshot e2e, locks e2e.
2. P1 técnicos: overlay manager, keyboard registry/hook, coordinate math.
3. Fortalecer tests `weak` reemplazando asserts de liveness por asserts de resultado.


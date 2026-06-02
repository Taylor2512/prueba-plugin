# Matriz de regresión conceptual

| Proceso | Riesgo de regresión | Test unitario | Test Playwright | Estado |
|---|---|---|---|---|
| Click simple | Selecciona hijo interno | `selectionCommands.test.ts` | `selection-shortcuts-regression.spec.ts` | missing-test |
| Multi-select | Solo opera sobre un schema | `selectionCommands.test.ts` | `canvas-interactions.spec.ts` | partial |
| Shortcuts | Atajo registrado pero no ejecuta comando | `keyboardShortcutRegistry.test.ts` | `selection-shortcuts-regression.spec.ts` | missing-test |
| Moveable/Selecto | Overlays bloquean eventos | `interactionGuards.test.ts` | `schema-transform.spec.ts` | partial |
| Checkbox -> group | Pierde schemaUid/owner/page | `checkboxConversion.test.ts` | `checkbox-group-docusign-behavior.spec.ts` | partial |
| + group option | Opción se solapa o sale de página | `checkboxGroup.schema.test.ts` | `checkbox-group-docusign-behavior.spec.ts` | partial |
| Radio exclusivity | Varias opciones seleccionadas | `radioGroup.schema.test.ts` | `radio-group-docusign-behavior.spec.ts` | missing-test |
| No-overlap | Solo corre en drop inicial | `schemaCollision.test.ts` | `schema-no-overlap.spec.ts` | partial |
| Page gap | Schema altera page stack | `pageStackLayout.test.ts` | `page-stack-layout.spec.ts` | partial |
| Snapshot | Pierde groups/options | `snapshotAdapter.test.ts` | `snapshot-roundtrip.spec.ts` | partial |
| Form/Viewer/PDF | Designer funciona pero ejecución falla | schema tests | `standard-fields.spec.ts` | partial |
| DetailView | Propiedad edita copia/stale state | `detailView.schemaMatrix.test.ts` | `detail-view-inspector.spec.ts` | partial |
| ListView | Muestra grupos planos | `detailSchemas.test.ts` | `multi-document-routing-design.spec.ts` | missing-test |

# Registry de schemas, familias y plugins

> Documentación generada para consumo externo de `sisad-pdfme`.

## Exports schemas
| Export |
| --- |
| addAlphaToHex |
| barcodes |
| builtInFields |
| builtInPlugins |
| builtInSchemaDefinitions |
| builtInSchemaDefinitionsByType |
| changeSchemas |
| checkbox |
| convertForPdfLayoutProps |
| createDefaultSchema |
| createLucideIcon |
| createSchemaBuilder |
| createSchemaInspectorConfig |
| createSchemaPlugin |
| createSvgStr |
| date |
| dateTime |
| ellipse |
| flatSchemaPlugins |
| flattenSchemaPlugins |
| generateUniqueSchemaName |
| getBuiltInFields |
| getDynamicHeightsForTable |
| getSchemaDefinition |
| getSchemaFamily |
| getSchemaFamilyInspectorPreset |
| getSchemaPluginByType |
| getSchemaTypeInspectorPreset |
| hex2PrintingColor |
| hex2RgbColor |
| image |
| isEditable |
| line |
| listSchemaDefinitions |
| multiVariableText |
| normalizeSchemaFamily |
| radioGroup |
| readFile |
| rectangle |
| registerFieldPlugin |
| registerPlugins |
| resolveSchemaFamily |
| rotatePoint |
| schemaFamilies |
| schemaPlugins |
| select |
| signature |
| svg |
| table |
| time |
| validateSchemaNameUniqueness |

## Inventario por archivo
| Grupo | Archivo | Líneas aprox. |
| --- | --- | --- |
| registry | src/sisad-pdfme/schemas/constants.ts | 3 |
| registry | src/sisad-pdfme/schemas/index.ts | 349 |
| registry | src/sisad-pdfme/schemas/modules.d.ts | 33 |
| registry | src/sisad-pdfme/schemas/schemaBuilder.ts | 92 |
| registry | src/sisad-pdfme/schemas/schemaFamilies.ts | 271 |
| registry | src/sisad-pdfme/schemas/utils.ts | 295 |
| barcodes | src/sisad-pdfme/schemas/barcodes/constants.ts | 21 |
| barcodes | src/sisad-pdfme/schemas/barcodes/helper.ts | 188 |
| barcodes | src/sisad-pdfme/schemas/barcodes/index.ts | 24 |
| barcodes | src/sisad-pdfme/schemas/barcodes/pdfRender.ts | 38 |
| barcodes | src/sisad-pdfme/schemas/barcodes/propPanel.ts | 259 |
| barcodes | src/sisad-pdfme/schemas/barcodes/types.ts | 13 |
| barcodes | src/sisad-pdfme/schemas/barcodes/uiRender.ts | 95 |
| checkbox | src/sisad-pdfme/schemas/checkbox/index.ts | 84 |
| date | src/sisad-pdfme/schemas/date/date.ts | 17 |
| date | src/sisad-pdfme/schemas/date/dateTime.ts | 17 |
| date | src/sisad-pdfme/schemas/date/helper.ts | 497 |
| date | src/sisad-pdfme/schemas/date/time.ts | 17 |
| date | src/sisad-pdfme/schemas/date/types.ts | 20 |
| graphics | src/sisad-pdfme/schemas/graphics/image.ts | 207 |
| graphics | src/sisad-pdfme/schemas/graphics/imagehelper.ts | 157 |
| graphics | src/sisad-pdfme/schemas/graphics/svg.ts | 121 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/helper.ts | 66 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/index.ts | 24 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts | 22 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/propPanel.ts | 167 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/types.ts | 7 |
| multiVariableText | src/sisad-pdfme/schemas/multiVariableText/uiRender.ts | 171 |
| radioGroup | src/sisad-pdfme/schemas/radioGroup/index.ts | 131 |
| select | src/sisad-pdfme/schemas/select/index.ts | 267 |
| shapes | src/sisad-pdfme/schemas/shapes/line.ts | 101 |
| shapes | src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts | 162 |
| signature | src/sisad-pdfme/schemas/signature/index.ts | 312 |
| signature | src/sisad-pdfme/schemas/signature/propPanel.ts | 618 |
| signature | src/sisad-pdfme/schemas/signature/providerRegistry.ts | 217 |
| signature | src/sisad-pdfme/schemas/signature/types.ts | 281 |
| signature | src/sisad-pdfme/schemas/signature/validation.ts | 70 |
| tables | src/sisad-pdfme/schemas/tables/cell.ts | 153 |
| tables | src/sisad-pdfme/schemas/tables/classes.ts | 403 |
| tables | src/sisad-pdfme/schemas/tables/dynamicTemplate.ts | 89 |
| tables | src/sisad-pdfme/schemas/tables/helper.ts | 217 |
| tables | src/sisad-pdfme/schemas/tables/index.ts | 23 |
| tables | src/sisad-pdfme/schemas/tables/pdfRender.ts | 145 |
| tables | src/sisad-pdfme/schemas/tables/propPanel.ts | 123 |
| tables | src/sisad-pdfme/schemas/tables/tableHelper.ts | 279 |
| tables | src/sisad-pdfme/schemas/tables/types.ts | 88 |
| tables | src/sisad-pdfme/schemas/tables/uiRender.ts | 438 |
| text | src/sisad-pdfme/schemas/text/constants.ts | 105 |
| text | src/sisad-pdfme/schemas/text/extraFormatter.ts | 84 |
| text | src/sisad-pdfme/schemas/text/helper.ts | 551 |
| text | src/sisad-pdfme/schemas/text/index.ts | 24 |
| text | src/sisad-pdfme/schemas/text/pdfRender.ts | 240 |
| text | src/sisad-pdfme/schemas/text/propPanel.ts | 187 |
| text | src/sisad-pdfme/schemas/text/types.ts | 31 |
| text | src/sisad-pdfme/schemas/text/uiRender.ts | 289 |
| text | src/sisad-pdfme/schemas/text/icons/index.ts | 31 |

## Crear plugin nuevo
```ts
const myPlugin = createSchemaPlugin({
  type: 'customField',
  family: 'custom',
  propPanel: { defaultSchema, schema },
  ui: async (props) => {},
  pdf: async (props) => {},
});
registerFieldPlugin(myPlugin);
```

## Reglas
- Debe tener defaultSchema completo.
- Debe funcionar en UI y PDF si será generado.
- No debe depender del laboratorio.
- Configuración avanzada debe ir en `__designer`.

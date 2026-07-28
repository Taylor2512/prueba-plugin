# Inspector (RightSidebar / DetailView) — taxonomía única y plan de reestructuración

Estado: **F1 y F2 implementadas**. F3–F5 pendientes (ver §5).
Alcance: `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**` + los mapas de familia en `src/sisad-pdfme/schemas/**` y `src/sisad-pdfme/config/**`.
Fuera de alcance: Canvas, Moveable, Selecto.

---

## 1. Diagnóstico de duplicidad (auditoría del código actual)

### 1.1 Duplicidad conceptual — el mismo concepto en dos secciones

| # | Concepto | Dónde vive hoy | Problema |
|---|---|---|---|
| D1 | Solo lectura | `readOnly` → sección `data`/Interacción ([commonInspectorFields.ts:319](../../src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts)) **y** `editable` sintetizado en `validation`/Reglas de llenado ([detailSchemas.ts:438](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts)) | El mismo concepto, invertido, en dos secciones. La deduplicación de [detailSchemas.ts:470](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts) solo mira `pluginProps`, no el fallback sintetizado |
| D2 | Obligatorio | `required` sintetizado en `validation` ([detailSchemas.ts:446](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts)), `required` de plugin y `mandatory` → `validation` | Tres claves para un concepto. El guard de la línea 469 solo cubre un sentido (`mandatory` si existe `required`), no el inverso |
| D3 | Estado de bloqueo | Chip del header (`buildDetailHeaderSummary`), aviso "editado por otro usuario" ([DetailViewContent.tsx:92](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx)), `statusTags` del panel y el `Select` "Estado" dentro del widget | Cuatro representaciones del mismo estado, dos de ellas editables |
| D4 | Permisos de edición | `editableBySender` / `editableByRecipient` → `collaboration` | Son comportamiento de interacción, no ownership; hoy conviven con lock y owner |

### 1.2 Duplicidad visual — subcards que repiten el título de su sección

| # | Sección | Subcard interna | Evidencia |
|---|---|---|---|
| D5 | "Datos y conexiones" / *Persistencia, JSON y API.* | `CompactConfigPanel` con `title="Datos y conexión"` y `description="Persistencia, JSON y API."` | [SchemaConnectionsWidget.tsx:1045](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx) — descripción **idéntica**, título casi idéntico |
| D6 | "Asignación y bloqueo" / *Permisos, estado y auditoría.* | `CompactConfigPanel` con `title="Estado de acceso"` y `description="Propietario, bloqueo y auditoría"` | [SchemaCollaborationWidget.tsx:240](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx) |

El anidamiento real por sección es: `DetailSectionCard` → `detail-view-form-shell` → `Form.Item` → `CompactConfigPanel` → `Collapse` → `SectionHeader` → controles. **Seis niveles** para llegar a un input.

### 1.3 Acciones dentro de secciones (prohibido por contrato)

| # | Qué | Dónde |
|---|---|---|
| D7 | Botones "Renombrar campo" y "Editar texto" | `InlineEditActionsWidget` inyectado en la sección `general`/Información ([detailSchemas.ts:324](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts)) |
| D8 | Alineación y distribución | `AlignWidget` inyectado siempre en `layout`/Ubicación ([detailSchemas.ts:334](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts)), aunque distribuir exige ≥3 elementos ([AlignWidget.tsx:52](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx)) |
| D9 | "Reasignar" | Trigger del modal dentro de la sección de colaboración — este sí es legítimo (edita ownership en su sección), pero hoy compite con el chip del header |

### 1.4 Causa raíz: la clasificación por tipo está repartida en cuatro listas

Cuatro módulos clasifican los mismos tipos, con conjuntos distintos y sin fuente común. Dos de ellos deciden **qué secciones ve un schema**:

| Módulo | Familias | Qué decide | Divergencia |
|---|---|---|---|
| [detailSectionTaxonomy.ts](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts) `getDetailProfile` | sets propios (`TEXT_LIKE_TYPES`, `OPTION_BASED_TYPES`, `CHECKBOX_TYPES`, `SIGNING_TYPES`, `ACTION_TYPES`, `VISUAL_TYPES`) | **secciones visibles y abiertas** | Mantiene su propia idea de qué es "texto" o "acción" |
| [schemaFamilies.ts](../../src/sisad-pdfme/schemas/schemaFamilies.ts) `resolveSchemaFamily` → `FAMILY_PRESETS` | `text`, `mediaVisual`, `boolean`, `shapeBarcode`, `table` | `propertyMap`, `supportsConnections`, `supportsValidation` | `TEXT_TYPES` incluye `signature`, `attachment`, `approve`…: la firma y las acciones heredan el preset de texto |
| [schemaFamilies.ts](../../src/sisad-pdfme/schemas/schemaFamilies.ts) `resolveSchemaSemanticFamily` | 11 valores semánticos | etiquetado semántico | Es la más fina y correcta de las cuatro, pero el inspector no la usaba |
| [schemaConfigurationProfile.ts](../../src/sisad-pdfme/config/schemaConfigurationProfile.ts) | 9 familias | categoría de catálogo y capacidades de canvas | No afecta a las secciones; su duplicación es de catálogo, no de inspector |

Esto es lo que produce "algunos schemas ven secciones que no les corresponden": el perfil del inspector dice una cosa y el preset de familia otra, y ambos se combinan en [detailSchemas.ts:284](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts).

### 1.5 Dos vocabularios de sección conviviendo

Los campos se enrutan con claves **legacy** (`general`, `layout`, `style`, `data`, `connections`) y luego se traducen a **canónicas** (`identity`, `box`, `appearance`, `behavior`, `dataBindings`) en [detailSchemas.ts:491](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts). Hay una contradicción activa: `LEGACY_TO_CANONICAL_DETAIL_SECTION` mapea `validation → behavior` ([detailSectionTaxonomy.ts:56](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts)), pero el builder enruta los campos de validación a la canónica `validation`. Según el camino que tome un plugin, "Obligatorio" cae en Reglas de llenado o en Interacción.

### 1.6 Legibilidad

- Geometría sin `precision`: `createBoundedNumberField` no la fija, y antd pinta el valor crudo (`6.8792`).
- Etiquetas del formulario a `0.5938rem` ([DetailFormSection.tsx:100](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx)) — por debajo del mínimo legible.
- `AlignWidget` usa `grid-cols-4`; con el sidebar en densidad `minimal` (≤256 px) los botones quedan a 1.75 rem sin aire.

---

## 2. Taxonomía final

Diez secciones, orden estable, una responsabilidad cada una. `contentKey` es variable por familia; el resto es fijo.

| # | Clave | Título | Responsabilidad única | Qué NO admite |
|---|---|---|---|---|
| 0 | `header` | — | Identidad y resumen con chips | Cualquier edición |
| 1 | `identity` | Información del campo | Nombre, etiqueta visible, descripción corta | Bloqueo, validación, color, conexión |
| 2 | `content` | Contenido / Opciones / Acción / Firma / Reglas del archivo | Qué contiene o qué hace el schema | Validación, permisos, geometría |
| 3 | `validation` | Reglas de llenado | **Obligatorio**, patrón, min/max, formato, mensajes | Solo lectura, bloqueo, owner |
| 4 | `behavior` | Interacción | **Solo lectura**, visible/oculto, orientación y espaciado de grupos | Bloqueo colaborativo, obligatorio |
| 5 | `box` | Ubicación y tamaño | X, Y, ancho, alto, rotación | Color, ownership, alineación en selección simple |
| 6 | `dataBindings` | Datos y conexiones | Persistencia, API, JSON, `dataLabel`, `tabLabel`, `fieldKey` | Subcard con el mismo título |
| 7 | `appearance` | Formato | Color, tipografía, opacidad, fondo, borde | Validación, bloqueo |
| 8 | `collaboration` | Asignación y bloqueo | **Owner, lock, reasignar**, auditoría | Solo lectura, obligatorio |
| 9 | `advanced` | Avanzado | UID, documentId, pageNumber, debug | Todo lo anterior |

`comments` se mantiene como sección condicional (solo con hilos existentes), fuera de la numeración porque no participa del contrato de edición.

### Reglas no negociables (verificables por test)

1. `required` / `mandatory` → solo `validation`.
2. `readOnly` / `editable` → solo `behavior`. Se elimina el sintetizado `editable` de `validation`.
3. `locked`, `ownerRecipientId*`, `ownerMode`, `restrictChanges`, `state` → solo `collaboration`.
4. `editableBySender` / `editableByRecipient` → se mueven de `collaboration` a `behavior`.
5. `dataLabel`, `tabLabel`, `fieldKey`, `schemaConnections` → solo `dataBindings`.
6. Color, tipografía, opacidad, fondo, borde → solo `appearance`.
7. `position`, `width`, `height`, `rotate` → solo `box`.
8. Opciones → solo `content` (variante Opciones).
9. Ninguna sección monta acciones de selección (eliminar, duplicar, renombrar, editar texto, alinear en selección simple).
10. Ningún widget monta un `CompactConfigPanel` cuyo título repita el de su sección.

---

## 3. Matriz de secciones por familia

Cinco familias, una sola fuente de verdad. `●` visible y abierta por defecto · `○` visible y colapsada · `—` no se renderiza · `(c)` condicional al contenido.

| Sección | text-like | choice | signature | action | visual |
|---|---|---|---|---|---|
| Información del campo | ● | ● | ● | ● | ● |
| Contenido | ● | — | — | — | — |
| Opciones | — | ● | — | — | — |
| Firma | — | — | ● | — | — |
| Acción / Reglas del archivo | — | — | — | ● | — |
| Visualización | — | — | — | — | ● |
| Reglas de llenado | ● | ○ | ○ | — | — |
| Interacción | ○ | ○ | ○ | ○ | ○ |
| Ubicación y tamaño | ○ | ○ | ○ | ○ | ● |
| Datos y conexiones | ○ | ○ | ○ | ○ | (c) |
| Formato | ○ | ○ | ○ | ○ | ● |
| Asignación y bloqueo | ○ | ○ | ○ | ○ | ○ |
| Comentarios | (c) | (c) | (c) | (c) | (c) |
| Avanzado | ○ | ○ | ○ | ○ | ○ |

### Composición de cada familia

| Familia | Tipos |
|---|---|
| text-like | `text`, `multiVariableText`, `number`, `date`, `dateTime`, `time`, `fullName`, `emailAddress`, `company`, `title` |
| choice | `select`, `dropdown`, `radioGroup`, `checkboxGroup`, `checkbox` |
| signature | `signature`, `initials`, `dateSigned` |
| action | `approve`, `decline`, `attachment`, `note` |
| visual | `image`, `svg`, `table`, `line`, `rectangle`, `ellipse`, y los 12 tipos de código de barras |

### Variantes de la sección `content`

| Familia | Título | Contenido |
|---|---|---|
| text-like | Contenido | placeholder, valor inicial, longitud máxima, máscara |
| choice | Opciones | lista, opción por defecto, orden, alta/baja (`SchemaOptionsEditor`) |
| signature | Firma | modo, proveedor, capacidades y display **solo si el proveedor las expone** |
| action (`attachment`) | Reglas del archivo | tipos, tamaño máximo, número máximo, reemplazo, mostrar nombre/estado |
| action (`approve`/`decline`) | Acción | etiqueta del botón, confirmación, exigir motivo |
| action (`note`) | Contenido | texto de la nota, tono |
| visual | Visualización | ajuste, relación de aspecto (imagen/SVG); contenido y ECC (códigos); columnas y cabecera (tabla) |

### Reglas por familia que hoy se incumplen

- **choice**: `orientation` y `spacing` ya enrutan a Interacción ([optionGroupFactory.ts:414](../../src/sisad-pdfme/schemas/options/optionGroupFactory.ts)) — correcto, no tocar. El riesgo aquí es otro: `isOptionsSectionField` ([detailSchemas.ts:455](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts)) fuerza a Opciones **cualquier** clave o widget que contenga la subcadena `option`, así que un campo futuro tipo `optionalNote` acabaría en la sección equivocada. Sustituir la heurística por una lista explícita.
- **signature**: hereda el preset `text` por `LEGACY_TO_CANONICAL`; debe tener familia propia.
- **action**: hoy ve Reglas de llenado a través del fallback sintetizado; debe dejar de verla (salvo `attachment`, que sí valida el archivo dentro de su propia sección).
- **visual**: no debe ver Reglas de llenado ni placeholder ni máscaras (ya corregido en parte por `VISUAL_TYPES`).

---

## 4. Archivos a modificar

### Núcleo de la taxonomía
| Archivo | Cambio |
|---|---|
| `schemas/schemaFamilies.ts` | Reescribir `FAMILY_PRESETS` a las 5 familias; eliminar `LEGACY_TO_CANONICAL` como mapa de conveniencia y darle familia propia a signature/action |
| `config/schemaConfigurationProfile.ts` | Pasa a **consumir** la familia de `schemaFamilies`, deja de reclasificar |
| `DetailView/detailSectionTaxonomy.ts` | Única fuente de la matriz sección×familia; elimina sus sets propios de tipos |
| `DetailView/inspectorContracts.ts` | Alinear los contratos por tipo con la nueva matriz |

### Enrutado de campos
| Archivo | Cambio |
|---|---|
| `DetailView/detailSchemas.ts` | Vocabulario canónico único (fuera el bucket legacy); quitar `editable` sintetizado (D1); quitar `InlineEditActionsWidget` (D7); `AlignWidget` solo en multiselección (D8); `precision: 2` en geometría (§1.6); nueva sección `content` |
| `schemas/propPanel/commonInspectorFields.ts` | `COMMON_PROPERTY_MAP` en claves canónicas; mover `editableBySender`/`editableByRecipient` a `behavior` |

### Composición visual
| Archivo | Cambio |
|---|---|
| `DetailView/DetailViewContent.tsx` | Orden fijo de la taxonomía; el aviso de bloqueo pasa a chip del header (D3) |
| `DetailView/DetailHeaderCard.tsx` | Chips: selección, tipo, owner, bloqueado, requerido, conectado. Sin edición |
| `DetailView/DetailSectionCard.tsx` | Superficie única por sección; soporte de `chip` de resumen en la cabecera |
| `DetailView/CompactConfigPanel.tsx` | Modo `embedded` sin cabecera propia, para no repetir título dentro de una sección (D5, D6) |
| `DetailView/SchemaConnectionsWidget.tsx` | Consumir el modo `embedded`; empty state = chip + frase + botón |
| `DetailView/SchemaCollaborationWidget.tsx` | Consumir el modo `embedded`; quitar el resumen que duplica el header |
| `DetailView/DetailFormSection.tsx` | Etiquetas a `0.6875rem`; grid de 2 columnas máximo |
| `DetailView/AlignWidget.tsx` | Render nulo con selección simple; `grid-cols-4` → `grid-cols-4/8` según densidad |

### Documentación y contratos
`docs/04-schemas/09-inspector-contract.md`, `docs/03-designer/02-props.md`, `docs/10-testing-qa/02-regression-matrix.md`.

---

## 5. Plan por fases

| Fase | Objetivo | Archivos | Riesgo | Señal de éxito |
|---|---|---|---|---|
| **F1** ✅ | Fuente única de familia + matriz declarativa | `schemaFamilies.ts`, `detailSectionTaxonomy.ts` | Alto (toca clasificación global) | Test de matriz: los 38 tipos resuelven a una familia y a un set de secciones esperado |
| **F2** ✅ | Deduplicación conceptual | `detailSchemas.ts`, `commonInspectorFields.ts` | Medio | Test: ningún concepto aparece en dos secciones para ningún tipo |
| **F3** | Sección `content` por familia | `detailSchemas.ts`, propPanels de cada familia | Medio | Cada familia renderiza su variante con el título correcto |
| **F4** | Composición visual | `DetailSectionCard`, `CompactConfigPanel`, los dos widgets, `DetailFormSection`, `AlignWidget`, `DetailHeaderCard` | Bajo | Nesting ≤3 niveles; sin títulos repetidos; 2 decimales |
| **F5** | QA read/write | — | Bajo | Cada control visible lee, escribe y persiste; single/multi/bloqueado |

F1 y F2 son inseparables: al unificar la familia cambia qué secciones ve cada tipo, y la deduplicación decide qué campo cae en cuál.

---

## 6. Cambios UI/UX concretos

1. **Header**: fila única con punto de color del owner, nombre, tipo, y chips `1 seleccionado` · `Bloqueado` · `Recipient-1` · `Requerido` · `Conectado`. El aviso de bloqueo de `DetailViewContent` desaparece como banner.
2. **Sección**: una superficie. Cabecera con título, subtítulo y chip de resumen opcional; cuerpo directo. Sin `CompactConfigPanel` con cabecera propia dentro.
3. **Empty state de Datos y conexiones**: chip `Sin configurar` + una frase + botón `Configurar conexión`. Nada más.
4. **Geometría**: `precision: 2`, dos columnas (X/Y, Ancho/Alto), rotación oculta si el tipo no la soporta.
5. **Alineación**: solo con 2+ elementos seleccionados; distribución solo con 3+.
6. **Tipografía del formulario**: etiquetas de `0.5938rem` a `0.6875rem`; controles a `1.75rem` de alto mínimo.
7. **Secciones colapsadas**: muestran un chip con lo configurado (`Obligatorio`, `3 opciones`, `API`), para no tener que abrirlas.

---

## 7. Tests

### Nuevos
| Test | Qué fija |
|---|---|
| `inspectorTaxonomyMatrix.test.ts` | Los 38 tipos → familia → secciones visibles/abiertas. Es la matriz de §3 como código |
| `inspectorConceptUniqueness.test.ts` | Para cada tipo, ningún concepto (`required`, `readOnly`, `locked`, `dataLabel`, color, geometría) aparece en dos secciones |
| `inspectorNoActionsInSections.test.ts` | Ninguna sección contiene widgets de acción de selección |
| `detailSectionCard.nesting.test.tsx` | Ninguna sección monta un panel cuyo título coincida con el suyo |

### A actualizar
| Test | Motivo |
|---|---|
| `detailProfilesByType.test.ts` | Las familias cambian de forma (creado en la iteración anterior) |
| `detailSectionTaxonomy.test.ts` | **Ya roto hoy**: importa `getVisibleDetailSections` y `getDefaultOpenSections`, que no existen |
| `detailSchemas.visibility.test.ts` | Cambia el enrutado de campos |
| `captureFieldsContract.test.ts` | Ampliar a las 5 familias |
| `tests/playwright/right-sidebar-*.spec.ts` | Cambian los data-testid de sección |

### Estado tras F1+F2

Implementado:

- `resolveInspectorFamily` en [schemaFamilies.ts](../../src/sisad-pdfme/schemas/schemaFamilies.ts) — única clasificación que decide secciones, derivada de `resolveSchemaSemanticFamily` para no abrir una quinta lista de tipos.
- `INSPECTOR_FAMILY_SECTIONS` en [detailSectionTaxonomy.ts](../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts) — la matriz de §3 como dato; se eliminaron los seis sets de tipos que vivían en ese módulo. Única excepción intrafamiliar: la casilla suelta.
- El fallback `editable` pasa de Reglas de llenado a Interacción; se conserva la clave (`editable`) para no alterar lo que leen el runtime y `isEditable`.
- `editableBySender` / `editableByRecipient` pasan de Asignación y bloqueo a Interacción.

Tests: `inspectorFamilyMatrix.test.ts` (47) e `inspectorConceptUniqueness.test.ts` (21) nuevos; `detailProfilesByType.test.ts`, `detailSchemas.test.ts` y `detailSectionTaxonomy.test.ts` actualizados a la nueva matriz. Suite completa: 1124 pasan y los 15 rojos son exactamente los mismos de antes del cambio.

Pendiente en F1: el preset por `SchemaFamily` sigue decidiendo `supportsConnections`/`supportsValidation` con su propia lista (`TEXT_TYPES` incluye firma y acciones). No se tocó porque gobierna también acciones y estrategias de plugin, que son contrato público. Debe resolverse antes de F3.

### Bloqueo conocido
Los componentes que importan `form-render`/antd no montan en jsdom (`Cannot find module 'antd/es/theme/internal'`), lo que deja `DetailView.test.ts` y `DetailFormSection.test.ts` sin ejecutar. La F4 necesita resolver ese import o cubrirse con Playwright.

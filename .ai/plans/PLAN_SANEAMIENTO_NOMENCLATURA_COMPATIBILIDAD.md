# Plan maestro de saneamiento de nomenclatura y compatibilidad — SISAD PDFME

**Proyecto:** `prueba-plugin`  
**Alcance principal:** `src/sisad-pdfme`, documentación técnica, pruebas y arquitectura IA  
**Objetivo:** eliminar lenguaje artificial o ambiguo basado en `legacy` y `canonical`, retirar compatibilidad obsoleta cuando sea seguro y conservar únicamente migraciones explícitas por versión, protocolo o contrato.

---

## 1. Resumen ejecutivo

El inventario consolidado revisado contiene **166 apariciones** de `legacy` o `canonical` en **41 archivos de código fuente**:

- `legacy`: 153 apariciones.
- `canonical`: 13 apariciones.

La concentración principal está en:

| Archivo | Apariciones | Naturaleza |
|---|---:|---|
| `src/sisad-pdfme/shared/snapshotAdapter.ts` | 57 | migración de snapshots antiguos |
| `src/sisad-pdfme/shared/schemaMigration.ts` | 34 | migración `__designer` → |
| `src/sisad-pdfme/runtime/instanceEventDispatcher.ts` | 7 | puente evento de dominio → callback del host |
| `src/sisad-pdfme/common/comments.ts` | 5 | alias persistido `__commentAnchors` |
| `src/sisad-pdfme/shared/snapshot.ts` | 5 | detección y tipado de versiones antiguas |
| Otros 36 archivos | 58 | aliases, comentarios, providers, inspector y adapters |

Los documentos y reportes contienen muchas más apariciones, pero no todas representan deuda activa. `reporte_diferencias_cambios(30).md` contiene historial de diffs, task-cards eliminadas y texto ya reemplazado; debe tratarse como evidencia histórica, no como fuente para renombrar el runtime.

La sanitización correcta no consiste en ejecutar:

```bash
sed -i 's/legacy/.../g'
sed -i 's/canonical/.../g'
```

Eso rompería imports de terceros, datos persistidos, valores públicos, snapshots y enlaces. La estrategia debe identificar primero **qué significa realmente cada palabra**.

---

## 2. Diagnóstico arquitectónico

### 2.1 Problema de `canonical`

`canonical` se está usando para conceptos diferentes:

- formato resultante de una migración;
- ruta de configuración con mayor precedencia;
- nombre de evento interno;
- sección final del inspector;
- orden normalizado de atajos;
- skill o documento principal;
- estado durable de memoria.

El término no explica el dominio y obliga a leer el contexto para entenderlo. Debe reemplazarse por nombres precisos:

| Significado real | Nombre recomendado |
|---|---|
| valor después de defaults y precedencia | `resolved` |
| ruta destino de una migración | `targetPath` |
| evento interno tipado | `domainEvent` |
| sección final del inspector | `detailSection` o `sectionKey` |
| orden estable para comparar | `normalizedOrder` o `comparisonOrder` |
| fuente principal del repositorio | `primarySource` |
| conocimiento durable | `durableProjectState` |
| formato actual soportado | `currentVersion` o `supportedFormat` |

### 2.2 Problema de `legacy`

`legacy` también mezcla responsabilidades diferentes:

- snapshots sin versión o anteriores a;
- metadata `__designer`;
- callbacks públicos `onX`;
- proveedor WebSocket;
- aliases de configuración;
- valores históricos de firma;
- una ruta oficial de `pdfjs-dist`;
- CSS de backups;
- documentación y task-cards antiguas.

Debe sustituirse por el dato concreto:

| Significado real | Nombre recomendado |
|---|---|
| snapshot anterior a | `preV2Snapshot` |
| contrato de metadata | `designerMetaV2` |
| callback del host | `hostCallback` |
| provider basado en WebSocket | `websocketProvider` |
| ruta de configuración obsoleta | `deprecatedPath` o `sourcePath` |
| valor persistido anterior | `storedV1Value` / `storedValue` |
| alias todavía aceptado | `compatibilityAlias` |
| código cuya eliminación está programada | `deprecated` con fecha y versión |
| import oficial `pdfjs-dist/legacy/...` | mantener literal; ocultarlo tras adapter |

---

## 3. Principios obligatorios

1. **No renombrar por estética sin identificar el contrato.**
2. **Todo formato antiguo debe nombrarse por versión**, no por antigüedad subjetiva.
3. **Todo puente debe nombrar sus extremos.** Ejemplo: `domainEventToHostCallback`.
4. **Todo resolver debe indicar qué resuelve.** Ejemplo: `resolveConfig`, `resolveSignatureModeFromSchema`.
5. **No introducir `modern`, `new`, `old`, `canonical2`, `legacy2` ni equivalentes.**
6. **Los valores persistidos o públicos se migran antes de eliminarse.**
7. **Los imports de terceros no se renombran localmente si la cadena pertenece al paquete.**
8. **Los aliases temporales deben tener `@deprecated`, versión de retiro y prueba de compatibilidad.**
9. **No conservar dos fuentes funcionales de verdad.** La compatibilidad solo existe en la frontera de entrada/salida.
10. **No modificar Moveable, Selecto, geometría, zoom ni PDF interno por una tarea de naming.**

---

## 4. Clasificación obligatoria antes de editar

Cada coincidencia debe clasificarse en una de estas categorías:

### A. Dependencia externa inmutable

Ejemplos:

```text
pdfjs-dist/legacy/build/pdf
pdfjs-dist/legacy/build/pdf.worker.min.js?url
```

Acción:

- conservar el string de import mientras sea la ruta requerida por PDF.js;
- renombrar únicamente wrappers propios, por ejemplo:
  `configurePdfjsLegacyWorker` → `configurePdfjsWorker`;
- documentar la excepción en allowlist;
- no afirmar que se migró a un build moderno sin una prueba browser/Node.

### B. Compatibilidad de datos versionada

Ejemplos:

- snapshot sin `version` o `< 2`;
- `__designer` plano;
- `LegacySchemaPageArray`;
- assignments antiguos;
- `connectivityMapping`.

Acción:

- reemplazar `legacy` por `V1`, `V2`, `preV2` o el número demostrado;
- migrar en el borde de importación;
- convertir inmediatamente a la representación runtime;
- impedir que el resto del sistema conozca el formato anterior.

### C. Bridge de API pública

Ejemplos:

- callbacks `onReady`, `onChange`, `onSave`, `onError`;
- valores públicos de providers;
- exports consumidos por hosts.

Acción:

- renombrar internals por responsabilidad;
- mantener alias exportado con `@deprecated` durante una ventana definida;
- añadir test de paridad;
- retirar el alias solo en cambio mayor o cuando se demuestre que no hay consumidores.

### D. Identificador interno artificial

Ejemplos:

- `CanonicalDetailSection`;
- `canonicalKey`;
- `CANONICAL_DETAIL_SECTION_ORDER`;
- `canonicalName`;
- `handleCanonicalEvent`.

Acción:

- renombrar directamente al concepto de dominio;
- actualizar imports, tests y documentación en la misma task-card;
- no crear aliases si no es API pública.

### E. Historia, backups o salidas generadas

Ejemplos:

- `reporte_diferencias_cambios(30).md`;
- `.tailwind-migration-backups/**`;
- manifests históricos;
- diffs de task-cards eliminadas.

Acción:

- no reescribir historia;
- excluir del contexto operativo y de gates de naming;
- archivar o borrar solo mediante política de retención;
- no contabilizar como deuda runtime.

---

## 5. Matriz de renombramiento prioritaria

### 5.1 Configuración

| Actual | Propuesto | Acción |
|---|---|---|
| `moveLegacyValue` | `migrateConfigPath` | rename interno |
| `canonicalPath` | `targetPath` | rename interno |
| `legacyPath` | `sourcePath` | rename interno |
| `config-legacy-migrated` | `config-path-migrated` | migrar código diagnóstico |
| `config-canonical-wins` | `config-target-path-preserved` | migrar código diagnóstico |
| “config canónica” | “config resuelta” o “config v2” | documentación |
| “alias legacy” | “ruta deprecada” o “alias de compatibilidad” | documentación |

Regla de precedencia expresada sin lenguaje artificial:

```text
defaults
→ preset
→ rutas deprecadas migradas
→ configuración v2 del host
→ overrides del runtime
→ permisos y contexto
```

### 5.2 Snapshots y metadata

| Actual | Propuesto | Acción |
|---|---|---|
| `isLegacySnapshot` | `isPreV2Snapshot` | alias temporal si es público |
| `_extractLegacySchemas` | `_extractV1Schemas` | rename interno |
| `_extractLegacyRecipients` | `_extractV1Recipients` | rename interno |
| `_extractLegacyAssignments` | `_extractV1Assignments` | rename interno |
| `_resolveLegacyConnectivity` | `_resolveV1Connectivity` | rename interno |
| `_resolveLegacySignaturePolicyId` | `_resolveV1SignaturePolicyId` | rename interno |
| `_resolveLegacySignatureMode` | `_resolveV1SignatureMode` | rename interno |
| `legacyMapping` | `connectivityMappingV1` | rename interno |
| `LegacySchemaPageArray` | `SchemaPageArrayV1` | alias temporal si exportado |
| `migrateSchemaToV3(legacy)` | `migrateDesignerMetaToV3(sourceMeta)` | rename |
| `flattenV3ToLegacy` | `serializeDesignerMetaV2` | alias temporal si exportado |
| `legacyOwnerRecipientId` | `ownerRecipientIdV2` | rename interno |
| `legacyLock` | `lockV2` | rename interno |
| `legacyComments` | `commentsV2` | rename interno |
| `legacyAnchors` | `commentAnchorsV2` | rename interno |
| `legacyState` | `stateV2` | rename interno |

### 5.3 Eventos y callbacks

| Actual | Propuesto | Acción |
|---|---|---|
| `CANONICAL_TO_LEGACY_CALLBACK` | `EVENT_TO_HOST_CALLBACK` | rename |
| `LegacyCallbackName` | `HostCallbackName` | rename |
| `legacyPayload` | `hostCallbackPayload` | rename |
| `notifyLegacy` | `notifyHostCallback` | rename |
| `legacy-callback-failed` | `host-callback-failed` | migrar diagnóstico |
| `canonicalName` | `eventName` | rename |
| `toCanonicalPayload` | `toDomainEventPayload` | rename |
| `LEGACY_TYPE_TO_CANONICAL` | `RUNTIME_EVENT_TO_DOMAIN_EVENT` | rename |
| `handleCanonicalEvent` | `handleDomainEvent` | rename |
| `recordCanonicalEvent` | `recordDomainEvent` | rename |
| “adapter legacy onX” | “host callback adapter” | docs/task-cards |

### 5.4 Inspector

| Actual | Propuesto | Acción |
|---|---|---|
| `CanonicalDetailSection` | `DetailSectionKey` | rename interno |
| `LegacyDetailSection` | `PluginSectionKey` | rename interno |
| `CANONICAL_DETAIL_SECTION_ORDER` | `DETAIL_SECTION_ORDER` | rename |
| `CANONICAL_DETAIL_SECTION_LABELS` | `DETAIL_SECTION_LABELS` | rename |
| `canonicalKey` | `sectionKey` | rename |
| “bucket legacy” | “plugin section bucket” | comentario |
| “sección canónica” | “sección del inspector” | comentario |

### 5.5 Colaboración

El provider llamado `legacy` es en realidad un adapter WebSocket.

| Actual | Propuesto | Acción |
|---|---|---|
| `LEGACY_PROVIDER` | `WEBSOCKET_PROVIDER` | rename interno |
| `createLegacyCollaborationProvider` | `createWebSocketCollaborationProvider` | rename |
| `CollaborationProviderName = 'legacy' \| 'yjs'` | `'websocket' \| 'yjs'` | migración pública |
| valor entrante `'legacy'` | alias de compatibilidad hacia `'websocket'` | una ventana |
| documentación “legacy/Yjs” | “WebSocket/Yjs” | rename |

### 5.6 Firma y familias

| Actual | Propuesto |
|---|---|
| `LEGACY_PROVIDER_MODE_MAP` | `SIGNATURE_TYPE_TO_MODE` |
| `resolveLegacySignatureMode` | `resolveSignatureModeFromSchema` |
| `legacyType` | `storedSignatureType` |
| `legacyProvider` | `storedProviderKey` |
| `LegacySchemaFamily` | `SchemaFamilyAlias` |
| `LEGACY_TO_CANONICAL` | `SCHEMA_FAMILY_ALIASES` |

### 5.7 PDF.js

Mantener:

```text
pdfjs-dist/legacy/build/pdf
pdfjs-dist/legacy/build/pdf.worker.min.js?url
pdfjs-dist/legacy/build/pdf.worker.js
```

Renombrar código propio:

| Actual | Propuesto |
|---|---|
| `configurePdfjsLegacyWorker` | `configurePdfjsWorker` |
| comentario “worker legacy usado por SISAD” | “worker de PDF.js usado por el runtime” |

No cambiar el import hasta demostrar que el build alternativo:

- compila en Vite;
- funciona en Safari/Chromium/Firefox;
- funciona en Node;
- mantiene renderizado, worker y rendimiento;
- no rompe tests de conversión.

---

## 6. Plan de ejecución por waves

## Wave 0 — Baseline y clasificación

Crear:

```text
reports/naming-sanitization/
├── occurrence-inventory.json
├── occurrence-inventory.md
├── public-api-impact.md
├── persisted-value-impact.md
├── third-party-exceptions.md
└── rename-map.md
```

Comandos iniciales:

```bash
rg -n -i "\b(legacy|canonical|canonicalize|canonicalized|canonicalization)\b" \
  src tests docs .ai .agents .github scripts

rg -n -i "(Legacy|Canonical|LEGACY|CANONICAL)" src tests

rg -n -i "pdfjs-dist/legacy|__commentAnchors|connectivityMapping|provider:\s*['\"]legacy" \
  src tests docs
```

Antes de editar:

- ejecutar `git status --short`;
- registrar branch/worktree;
- ejecutar lint, TypeScript, unit tests, build y suites focales;
- guardar resultados, incluidos fallos preexistentes.

Cierre:

- todas las coincidencias clasificadas;
- cada símbolo público identificado;
- cada valor persistido identificado;
- ninguna modificación de runtime.

## Wave 1 — Política y gate preventivo

Crear:

```text
.ai/governance/NAMING-COMPATIBILITY-POLICY.md
scripts/quality/audit-compatibility-language.mjs
configs/compatibility-language-allowlist.json
```

El gate debe:

- analizar código propio, tests y documentación activa;
- excluir vendor, generated, reports históricos y backups;
- permitir cadenas externas exactas de PDF.js;
- fallar ante nuevos identificadores `Legacy*`, `Canonical*`, `*Legacy`, `*Canonical`;
- admitir excepciones documentadas con `reason`, `owner` y `removeAfter`.

Cierre:

- el baseline actual se registra;
- nuevas apariciones no autorizadas bloquean CI;
- el gate no falla por `pdfjs-dist/legacy/...`.

## Wave 2 — Renombres internos de bajo riesgo

Alcance:

- inspector;
- action registry;
- keyboard shortcut registry;
- variables locales como `canonical`;
- comentarios y documentación inline.

No tocar:

- exports públicos;
- datos persistidos;
- provider values;
- snapshots.

Cierre:

- cero `canonical` en identifiers internos de esas áreas;
- tests unitarios verdes;
- sin cambio de comportamiento.

## Wave 3 — Configuración/V2

Alcance:

```text
src/sisad-pdfme/config/configMigration.ts
src/sisad-pdfme/config/configValidation.ts
src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts
tests/unit/sisad-pdfme/config/**
```

Tareas:

1. renombrar source/target;
2. renombrar códigos diagnósticos;
3. actualizar docs y tests;
4. confirmar que la entrada no se muta;
5. confirmar que config v2 mantiene precedencia;
6. mantener aliases solo en el migrador.

Cierre:

- ningún componente nuevo lee rutas deprecadas;
- solo `configMigration.ts` conoce aliases anteriores;
- warnings estructurados sin duplicación.

## Wave 4 — Eventos de dominio y callbacks del host

Alcance:

```text
src/sisad-pdfme/runtime/instanceEventDispatcher.ts
src/sisad-pdfme/runtime/runtimeEventBridge.ts
src/sisad-pdfme/contracts/events.ts
src/sisad-pdfme/react/SisadPdfmeDesigner.tsx
tests/unit/sisad-pdfme/runtime/**
```

Tareas:

- aplicar la matriz de eventos;
- mantener callbacks `onX` sin llamarlos “legacy”;
- asegurar una emisión por evento;
- conservar `config.events.onX === false`;
- mantener payload del host separado del evento serializable.

Cierre:

- la UI emite eventos de dominio;
- el adapter del host es el único que conoce callbacks `onX`;
- diagnósticos usan `host-callback-failed`.

## Wave 5 — Snapshots y metadata versionada

Alcance:

```text
src/sisad-pdfme/shared/snapshot.ts
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/shared/schemaMigration.ts
src/sisad-pdfme/shared/schemaDesignerMeta.ts
src/sisad-pdfme/common/schema.ts
src/sisad-pdfme/contracts/assignments.ts
tests/unit/sisad-pdfme/shared/**
```

Tareas:

- renombrar por versión real;
- añadir fixtures/V2/V3/current;
- garantizar import antiguo → runtime actual;
- garantizar snapshot actual → import actual;
- evitar reexportar formatos anteriores salvo necesidad pública;
- marcar aliases exportados con `@deprecated`.

Cierre:

- no se usa `legacy` como sustituto de versión;
- round-trip preserva documentos, páginas, schemas, recipients, owners, options, comments, locks, signature y connectivity;
- snapshot antiguo sigue siendo legible.

## Wave 6 — Provider WebSocket

Alcance:

```text
src/sisad-pdfme/ui/collaboration.ts
src/sisad-pdfme/ui/designerEngine.ts
src/sisad-pdfme/config/configMigration.ts
tests/unit/sisad-pdfme/collaboration/**
```

Tareas:

- introducir `websocket`;
- aceptar temporalmente `legacy` solo al normalizar config;
- emitir warning deprecado una vez;
- serializar únicamente `websocket`;
- actualizar documentación y ejemplos.

Cierre:

- internals no contienen provider `legacy`;
- WebSocket y Yjs mantienen comportamiento;
- alias anterior probado y programado para retiro.

## Wave 7 — Comentarios y aliases persistidos

Alcance:

```text
src/sisad-pdfme/common/comments.ts
src/sisad-pdfme/contracts/comments.ts
tests/unit/sisad-pdfme/comments/**
```

Regla:

- la propiedad persistida `__commentAnchors` puede permanecer durante compatibilidad;
- el código interno debe llamarla `commentAnchorsV1` o `deprecatedCommentAnchors`;
- `pdfComments` debe ser la única representación runtime;
- la escritura doble debe justificarse y tener fecha de retiro.

Cierre:

- lectura de snapshots anteriores;
- escritura actual consistente;
- no duplicar comments count;
- attach/detach preservado.

## Wave 8 — Documentación, skills y task-cards

Renombrar, como mínimo:

```text
docs/11-migraciones/01-legacy-templates.md
→ docs/11-migraciones/01-template-to-current.md

.ai/scrum/task-cards/CONFIG-003-canonicalize-config.md
→ .ai/scrum/task-cards/CONFIG-003-define-config-contract.md

.ai/scrum/task-cards/CONFIG-004-create-legacy-config-migration.md
→ .ai/scrum/task-cards/CONFIG-004-migrate-config-to.md

.ai/scrum/task-cards/COREUX-006-implementar-dispatcher-unico-y-adapter-legacy-onx.md
→ .ai/scrum/task-cards/COREUX-006-implementar-dispatcher-y-host-callback-adapter.md
```

Además:

- columna `canonical` de skills → `primary`;
- “Canonical durable” → “Durable project state”;
- “canonical source” → “primary source”;
- actualizar índices, links, manifests, task index, Scrum y checksums;
- no reescribir reportes históricos.

Cierre:

- enlaces relativos válidos;
- cero nombres activos con `canonicalize` o `legacy` salvo documentos explícitos de migración por versión;
- cero duplicación de instrucciones.

## Wave 9 — Eliminación de compatibilidad obsoleta

Esta wave requiere evidencia de uso.

Para cada alias:

1. buscar imports y consumidores;
2. revisar API pública y bundles;
3. revisar fixtures y snapshots reales;
4. verificar telemetría o integraciones conocidas;
5. marcar fecha de retiro;
6. eliminar en cambio mayor si corresponde.

No eliminar en la misma task-card que introduce la migración, salvo que sea estrictamente interno y tenga cero consumidores.

---

## 7. Task-cards recomendadas

| ID | Objetivo | Riesgo |
|---|---|---|
| NAME-001 | Inventario y clasificación | bajo |
| NAME-002 | Política y gate preventivo | bajo |
| NAME-003 | Saneamiento del inspector | bajo |
| NAME-004 | Config → | medio |
| NAME-005 | Eventos → callbacks del host | medio |
| NAME-006 | Snapshot y metadata por versión | alto |
| NAME-007 | Provider WebSocket/Yjs | alto |
| NAME-008 | Comentarios → runtime | medio |
| NAME-009 | Firma y familias de schema | medio |
| NAME-010 | Documentación y arquitectura IA | bajo |
| NAME-011 | Aliases públicos deprecados | alto |
| NAME-012 | Retiro final de compatibilidad | alto / major |

WIP máximo recomendado: una task-card de escritura y hasta dos revisiones read-only.

---

## 8. Gates obligatorios

### Naming

```bash
node scripts/quality/audit-compatibility-language.mjs --strict
```

Objetivo final en código propio:

- `canonical` en identifiers: 0.
- `legacy` en identifiers: 0.
- apariciones permitidas:
  - imports oficiales de PDF.js;
  - propiedades persistidas cuya migración aún esté activa;
  - textos en tests que demuestran compatibilidad;
  - documentación de migración versionada.

### Calidad

```bash
npm run lint
npm run build
npm run quality:dead-code:ci
npm run quality:duplicates:strict
npm run quality:architecture
```

### Pruebas focales

```bash
npx vitest run tests/unit/sisad-pdfme/config
npx vitest run tests/unit/sisad-pdfme/runtime
npx vitest run tests/unit/sisad-pdfme/shared
npx vitest run tests/unit/sisad-pdfme/comments
npx vitest run tests/unit/sisad-pdfme/collaboration
```

### Playwright

Cubrir:

- importar snapshot antiguo;
- abrir Designer con template migrado;
- Form y Viewer;
- recipients y ownership;
- comentarios;
- evento y callback del host;
- WebSocket/Yjs si existe harness;
- guardado y recarga.

---

## 9. Reglas anti-loop para Codex

- Máximo 2 rondas de búsqueda antes de producir el inventario.
- Máximo 8 archivos abiertos inicialmente.
- Máximo 5 archivos modificados por task-card, salvo task de rename mecánico previamente aprobada.
- No ampliar scope por coincidencias encontradas en otra área.
- No editar reportes históricos.
- No tocar vendor ni backups.
- No mezclar renaming con refactor funcional no necesario.
- No crear wrappers solo para evitar renombrar.
- Si un símbolo es público o persistido y no puede probarse el impacto, detenerse y reportarlo.
- Diferenciar siempre:
  - modificado;
  - migrado;
  - deprecado;
  - conservado por terceros;
  - observado;
  - pendiente;
  - no verificado.

---

## 10. Definition of Done

La sanitización se considera terminada cuando:

- no existen identifiers internos con `canonical` o `legacy`;
- los formatos anteriores están nombrados por versión;
- los bridges están nombrados por origen y destino;
- el provider real se llama `websocket`;
- los callbacks `onX` se llaman callbacks del host;
- `pdfjs-dist/legacy` está aislado y documentado como excepción externa;
- la config v2 es la única representación runtime;
- los snapshots anteriores siguen importándose;
- los exports deprecados tienen ventana de retiro;
- docs, task-cards, skills, índices y manifests están sincronizados;
- lint, build, calidad, unit tests y Playwright focal están verdes;
- el gate impide reintroducir lenguaje ambiguo.

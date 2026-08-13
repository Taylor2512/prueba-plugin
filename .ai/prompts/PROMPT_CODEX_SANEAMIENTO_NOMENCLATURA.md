# Prompt maestro para Codex — Saneamiento de `legacy` y `canonical` en SISAD PDFME

Actúa como arquitecto frontend senior y responsable de migraciones seguras en React, TypeScript, Vite, pdfme, snapshots versionados, APIs públicas y sistemas de plugins.

## Proyecto

```text
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Objetivo

Sanear el proyecto SISAD PDFME para:

1. eliminar nombres artificiales basados en `canonical`;
2. sustituir usos ambiguos de `legacy` por versiones, protocolos o contratos concretos;
3. eliminar código antiguo realmente muerto;
4. migrar compatibilidad todavía necesaria hacia fronteras explícitas;
5. preservar API pública, snapshots, configuración, eventos, comentarios, colaboración y comportamiento visual;
6. impedir que vuelvan a introducirse identifiers ambiguos.

No hagas un reemplazo textual global.

---

## Evidencia inicial

El consolidado actual registra 166 apariciones en 41 archivos de código:

- 153 `legacy`;
- 13 `canonical`.

Concentración:

```text
snapshotAdapter.ts       57
schemaMigration.ts       34
instanceEventDispatcher  7
common/comments.ts       5
shared/snapshot.ts       5
otros 36 archivos        58
```

La documentación y los reportes contienen más coincidencias, pero `reporte_diferencias_cambios(30).md`, backups de Tailwind y manifests históricos no representan runtime activo.

---

## Regla semántica principal

Nunca uses:

```text
legacy
canonical
modern
new
old
canonical2
legacy2
```

como sustitutos de significado.

Usa el concepto real:

```text
V1 / / / preV2
sourcePath / targetPath
resolvedConfig
domainEvent
hostCallback
websocket
detailSection
pluginSection
normalizedOrder
primarySource
durableProjectState
compatibilityAlias
deprecated
```

---

## Clasificación obligatoria

Antes de editar, clasifica cada coincidencia como:

```text
A third-party-fixed
B versioned-data-compatibility
C public-api-bridge
D internal-artificial-name
E historical-generated-backup
```

No mezcles categorías.

### Excepción externa

No modifiques ciegamente:

```text
pdfjs-dist/legacy/build/pdf
pdfjs-dist/legacy/build/pdf.worker.min.js?url
pdfjs-dist/legacy/build/pdf.worker.js
```

Son rutas del paquete. Puedes renombrar wrappers propios:

```text
configurePdfjsLegacyWorker → configurePdfjsWorker
```

pero no cambies el import sin validar browser y Node.

---

## Alcance inicial permitido

### Código

```text
src/sisad-pdfme/config/configMigration.ts
src/sisad-pdfme/shared/snapshot.ts
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/shared/schemaMigration.ts
src/sisad-pdfme/shared/schemaDesignerMeta.ts
src/sisad-pdfme/runtime/instanceEventDispatcher.ts
src/sisad-pdfme/runtime/runtimeEventBridge.ts
src/sisad-pdfme/common/comments.ts
src/sisad-pdfme/contracts/comments.ts
src/sisad-pdfme/contracts/assignments.ts
src/sisad-pdfme/ui/collaboration.ts
src/sisad-pdfme/ui/designerEngine.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts
src/sisad-pdfme/integration/index.ts
```

### Documentación

```text
docs/11-migraciones/**
docs/08-api-reference/**
.ai/scrum/task-cards/CONFIG-003-*
.ai/scrum/task-cards/CONFIG-004-*
.ai/scrum/task-cards/COREUX-006-*
.ai/skills/README.md
.ai/architecture/**
.ai/memory/**
```

### Prohibido sin autorización

```text
src/sisad-pdfme/pdf-lib/**
.moveable*
.selecto*
geometría de Canvas
zoom math
paper positioning
.tailwind-migration-backups/**
reports históricos
reporte_diferencias_cambios(30).md
```

---

## Fase 0 — Baseline

Ejecuta:

```bash
git status --short
git branch --show-current

mkdir -p reports/naming-sanitization

rg -n -i "\b(legacy|canonical|canonicalize|canonicalized|canonicalization)\b" \
  src tests docs .ai .agents .github scripts \
  > reports/naming-sanitization/raw-occurrences.txt

rg -n -i "(Legacy|Canonical|LEGACY|CANONICAL)" src tests \
  > reports/naming-sanitization/symbol-occurrences.txt

rg -n -i "pdfjs-dist/legacy|__commentAnchors|connectivityMapping|provider:\s*['\"]legacy" \
  src tests docs \
  > reports/naming-sanitization/persisted-and-third-party.txt
```

Genera:

```text
reports/naming-sanitization/occurrence-inventory.md
reports/naming-sanitization/rename-map.md
reports/naming-sanitization/public-api-impact.md
reports/naming-sanitization/persisted-value-impact.md
reports/naming-sanitization/third-party-exceptions.md
```

Cada fila:

```text
path
line
symbol/text
category
public?
persisted?
replacement
migration required?
test required
status
```

No edites código hasta cerrar este inventario.

---

## Matriz de renombramiento requerida

### Config

```text
moveLegacyValue               → migrateConfigPath
canonicalPath                 → targetPath
legacyPath                    → sourcePath
config-legacy-migrated        → config-path-migrated
config-canonical-wins         → config-target-path-preserved
```

### Snapshot/meta

```text
isLegacySnapshot              → isPreV2Snapshot
LegacySchemaPageArray         → SchemaPageArrayV1
_extractLegacySchemas         → _extractV1Schemas
_extractLegacyRecipients      → _extractV1Recipients
_extractLegacyAssignments     → _extractV1Assignments
_resolveLegacyConnectivity    → _resolveV1Connectivity
_resolveLegacySignatureMode   → _resolveV1SignatureMode
_resolveLegacySignaturePolicyId → _resolveV1SignaturePolicyId
legacyMapping                 → connectivityMappingV1
migrateSchemaToV3(legacy)     → migrateDesignerMetaToV3(sourceMeta)
flattenV3ToLegacy             → serializeDesignerMetaV2
```

Si una exportación es pública:

```ts
/** @deprecated Use isPreV2Snapshot. Remove in next major. */
export const isLegacySnapshot = isPreV2Snapshot;
```

No mantengas el alias si es estrictamente interno.

### Eventos

```text
CANONICAL_TO_LEGACY_CALLBACK → EVENT_TO_HOST_CALLBACK
LegacyCallbackName           → HostCallbackName
legacyPayload                → hostCallbackPayload
notifyLegacy                 → notifyHostCallback
legacy-callback-failed       → host-callback-failed
canonicalName                → eventName
toCanonicalPayload           → toDomainEventPayload
LEGACY_TYPE_TO_CANONICAL     → RUNTIME_EVENT_TO_DOMAIN_EVENT
handleCanonicalEvent         → handleDomainEvent
recordCanonicalEvent         → recordDomainEvent
```

### Inspector

```text
CanonicalDetailSection              → DetailSectionKey
LegacyDetailSection                 → PluginSectionKey
CANONICAL_DETAIL_SECTION_ORDER      → DETAIL_SECTION_ORDER
CANONICAL_DETAIL_SECTION_LABELS     → DETAIL_SECTION_LABELS
canonicalKey                        → sectionKey
```

### Collaboration

```text
LEGACY_PROVIDER                    → WEBSOCKET_PROVIDER
createLegacyCollaborationProvider → createWebSocketCollaborationProvider
'legacy' provider value           → 'websocket'
```

Acepta `'legacy'` solo en la migración de entrada durante la ventana de compatibilidad. La salida debe usar `'websocket'`.

### Firma/familias

```text
LEGACY_PROVIDER_MODE_MAP    → SIGNATURE_TYPE_TO_MODE
resolveLegacySignatureMode → resolveSignatureModeFromSchema
legacyType                  → storedSignatureType
legacyProvider              → storedProviderKey
LegacySchemaFamily          → SchemaFamilyAlias
LEGACY_TO_CANONICAL         → SCHEMA_FAMILY_ALIASES
```

### PDF.js

```text
configurePdfjsLegacyWorker → configurePdfjsWorker
```

Mantén la ruta externa `pdfjs-dist/legacy/...`.

---

## Orden de ejecución

Trabaja por task-cards independientes:

```text
NAME-001 inventory
NAME-002 policy-and-gate
NAME-003 inspector-internal-renames
NAME-004 config
NAME-005 events-host-callbacks
NAME-006 snapshot-and-designer-meta
NAME-007 websocket-provider
NAME-008 comments-storage
NAME-009 signature-and-family-aliases
NAME-010 docs-and-ai-architecture
NAME-011 deprecated-public-aliases
NAME-012 final-removal
```

No modifiques más de cinco archivos por task-card, salvo renombramiento mecánico explícitamente aprobado después del inventario.

---

## Reglas estrictas

1. No reemplazo global.
2. No eliminar compatibilidad antes de pruebas de caracterización.
3. No ocultar problemas con aliases permanentes.
4. No añadir nuevas capas `compat`, `canonical`, `legacy` sin contrato.
5. La compatibilidad vive solo en import/migration/host adapter.
6. El runtime usa una sola representación.
7. No cambiar comportamiento mientras se renombran internals.
8. No tocar rutas de terceros.
9. No editar historia o backups para mejorar métricas.
10. No mezclar esta tarea con Tailwind, UX o canvas.
11. No usar `any` para acelerar renames.
12. No romper exports `.js` ni aliases de paths.
13. Actualizar tests e imports en el mismo commit.
14. Si no puedes determinar si un símbolo es público o persistido, detente.
15. Registra aliases deprecados con versión de retiro.

---

## Pruebas mínimas

### Config

```text
entrada vacía
solo rutas v2
solo rutas deprecadas
mezcla con conflicto
arrays
funciones/callbacks
no mutación
warnings deduplicados
```

### Snapshot

```text
sin version
snapshot v1
snapshot v2
snapshot actual
multidocumento
multipágina
recipients
assignments
ownership/colors
option groups
comments/anchors
signature
connectivity
```

### Events

```text
listener recibe una vez
callback onX recibe una vez
config false desactiva callback, no evento
listener fallido no bloquea
callback fallido produce diagnóstico
payload del evento sigue serializable
```

### Collaboration

```text
websocket default cuando hay url
yjs local
alias 'legacy' migra a 'websocket'
reconnect
disconnect
event fan-out
```

---

## Gates

```bash
npm run lint
npm run build
npm run quality:dead-code:ci
npm run quality:duplicates:strict
npm run quality:architecture

npx vitest run tests/unit/sisad-pdfme/config
npx vitest run tests/unit/sisad-pdfme/runtime
npx vitest run tests/unit/sisad-pdfme/shared
npx vitest run tests/unit/sisad-pdfme/comments
npx vitest run tests/unit/sisad-pdfme/collaboration

node scripts/quality/audit-compatibility-language.mjs --strict
```

Playwright focal:

```text
Designer importando snapshot antiguo
guardar y recargar
Form/Viewer
recipients/ownership
comments
host callbacks
```

---

## Condiciones de parada

Detente y reporta sin improvisar si:

- el símbolo forma parte de un export público no documentado;
- un valor aparece en snapshots reales;
- el cambio requiere modificar `pdfjs-dist/legacy` sin prueba;
- se necesitan más de dos versiones de compatibilidad simultánea;
- una prueba demuestra comportamiento divergente;
- el rename requiere tocar Canvas/Moveable/Selecto;
- el scope supera la task-card actual.

---

## Formato del reporte final

```markdown
# Resultado

## Baseline
## Renombres aplicados
## Código eliminado
## Compatibilidad conservada
## Aliases deprecados
## Excepciones de terceros
## Archivos modificados
## Tests y gates
## Riesgos
## Pendiente para próxima major
## Memory delta
```

Diferencia explícitamente:

```text
modificado
migrado
deprecado
conservado
observado
pendiente
no verificado
```

No declares “legacy eliminado” si aún existen valores persistidos, aliases públicos o imports oficiales.

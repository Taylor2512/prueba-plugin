# Política de nomenclatura, versiones y compatibilidad

## Propósito

Evitar identifiers ambiguos y compatibilidad indefinida dentro de SISAD PDFME.

## Términos prohibidos en identifiers nuevos

```text
legacy
canonical
modern
new
old
canonical2
legacy2
```

El gate puede permitirlos en:

- strings oficiales de dependencias;
- fixtures de formatos antiguos;
- comentarios de pruebas de migración;
- aliases públicos deprecados durante una ventana;
- documentación histórica no activa.

## Árbol de decisión

### ¿Es un formato de datos anterior?

Usa versión:

```text
SnapshotV1
SchemaPageArrayV1
DesignerMetaV2
migrateV1ToV2
isPreV2Snapshot
```

### ¿Es un valor después de defaults/precedencia?

Usa:

```text
resolvedConfig
resolvedValue
effectivePermissions
```

### ¿Es una ruta de migración?

Usa:

```text
sourcePath
targetPath
deprecatedPath
migrateConfigPath
```

### ¿Es un puente?

Nombra ambos extremos:

```text
domainEventToHostCallback
runtimeEventBridge
websocketCollaborationAdapter
```

### ¿Es una fuente principal?

Usa:

```text
primarySource
projectSource
durableProjectState
activeSkill
```

### ¿Es una normalización para comparación?

Usa:

```text
normalizedShortcut
comparisonOrder
normalizedKey
```

## Ventana de deprecación

Todo alias público temporal debe declarar:

```ts
/**
 * @deprecated Use newName.
 * Introduced compatibility: 2.x
 * Remove after: next major
 */
```

También debe tener:

- test de compatibilidad;
- warning deduplicado solo en development/debug;
- entrada en migration guide;
- owner;
- fecha o versión de retiro.

## Regla de runtime

El runtime no debe bifurcarse:

```text
input antiguo
→ migrator
→ representación runtime única
→ output actual
```

No permitido:

```text
if legacy ...
else canonical ...
```

disperso en componentes, schemas, UI o hooks.

## Rutas de terceros

Las cadenas bajo control de dependencias no se renombran:

```text
pdfjs-dist/legacy/**
```

Se aíslan en adapters y se excluyen por patrón exacto, no por exclusión global de la palabra.

## Documentación

En documentación activa:

- “config canónica” → “config resuelta” o “config v2”.
- “alias legacy” → “ruta deprecada” o “alias de compatibilidad”.
- “canonical source” → “primary source”.
- “legacy handler” → “host callback”.
- “legacy provider” → “WebSocket provider”.

La historia y los diffs no se reescriben.

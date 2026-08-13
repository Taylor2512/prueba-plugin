# Importación segura de una arquitectura

## Problema anterior

Copiar un ZIP completo con `rsync --delete` o sobreescribir `.ai` puede perder:

- `NOW`;
- `CURRENT`;
- `HANDOFF`;
- ledgers;
- evidence;
- trabajo local no publicado.

## Nuevo algoritmo

```text
ZIP/folder
  ↓
safe extraction / scan
  ↓
canonicalize incoming path
  ↓
filter architecture roots
  ↓
skip generated indexes
  ↓
protected hot state? → SKIP
  ↓
missing target? → COPY
  ↓
same hash? → SKIP
  ↓
different hash?
     keep-target (default) → CONFLICT
     prefer-source         → backup target + replace
  ↓
rebuild indexes locally
  ↓
validate
```

El source original nunca se modifica.

Los reemplazos hacen backup en una carpeta hermana del repositorio:

```text
<repo>.architecture-backup-YYYYMMDD-HHMMSS
```

Eso evita guardar backups/versionados dentro de la arquitectura.

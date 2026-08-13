# Manual de comandos

## Diagnóstico

```bash
npm run tools:doctor
```

Escanea nombres, genera índices y valida enlaces/IDs.

## Sanitización

```bash
npm run docs:sanitize
npm run docs:sanitize:apply
```

Dry-run primero. El modo apply:

- renombra rutas versionadas cuando no existe conflicto;
- elimina copias **idénticas** después de backup externo;
- no destruye contenido divergente;
- deja conflictos para reconciliación explícita;
- poda directorios vacíos.

Ejemplos de nombres no permitidos:

```text
brain-v2/
PLAN-V8.md
architecture.version-3.md
README-copy-2.md
CONTRACT-20260813.md   # cuando la fecha es un sufijo de revisión
```

Los identificadores históricos pueden permanecer dentro del Markdown.

## Índice

```bash
npm run docs:index
```

Genera:

```text
.ai/index/architecture/markdown.jsonl
.ai/index/architecture/links.jsonl
.ai/index/architecture/broken-links.jsonl
.ai/index/architecture/orphans.jsonl
.ai/index/architecture/duplicates.json
reports/architecture/summary.json
```

## Navegación

Dry-run:

```bash
npm run docs:links
```

Aplicar:

```bash
npm run docs:links:apply
```

Solo modifica `README.md`/`HOME.md` existentes mediante un bloque administrado.
No crea un README en cada carpeta.

## Duplicidad

```bash
npm run docs:duplicates
```

Detecta:

- duplicados normalizados exactos;
- documentos de la misma familia de nombre con similitud alta;
- familias provenientes de nombres versionados.

## Validación

```bash
npm run docs:validate
```

Falla por:

- nombre/ruta versionada;
- link Markdown roto;
- `id` duplicado.

Orphans y near-duplicates son warnings.

## Importar arquitectura desde ZIP o carpeta

Dry-run:

```bash
node scripts/project-tools.mjs import . \
  --source="/ruta/arquitectura.zip"
```

Aplicar:

```bash
node scripts/project-tools.mjs import . \
  --source="/ruta/arquitectura.zip" \
  --apply
```

Por defecto **mantiene el target** ante conflictos.

Para reemplazar archivos no protegidos:

```bash
node scripts/project-tools.mjs import . \
  --source="/ruta/arquitectura" \
  --conflict=prefer-source \
  --apply
```

Los hot-state files protegidos nunca se reemplazan automáticamente.

## Pipeline completo

```bash
npm run architecture:all
```

Sanitiza → indexa → actualiza navegación → reindexa → valida.


## Interpretación de flags

Estos comandos no necesitan `--apply` porque solo calculan/generan índices:

```bash
npm run docs:index
npm run docs:duplicates
npm run docs:orphans
```

Para importar un ZIP/carpeta, `--source` es obligatorio:

```bash
npm run architecture:import -- \
  --source="/ruta/arquitectura.zip"
```

Aplicar:

```bash
npm run architecture:import -- \
  --source="/ruta/arquitectura.zip" \
  --apply
```

## Resolver un conflicto de nombre estable

Si aparece:

```text
TASK-CARD-V7.md -> TASK-CARD.md
canonical-target-differs
```

el sanitizador NO debe elegir automáticamente.

Revisar:

```bash
git diff --no-index -- \
  .ai/templates/TASK-CARD.md \
  .ai/templates/TASK-CARD-V7.md
```

Integrar manualmente en `.ai/templates/TASK-CARD.md`, verificar el resultado y luego:

```bash
rm .ai/templates/TASK-CARD-V7.md
npm run docs:sanitize
npm run docs:links:apply
npm run docs:validate
```

La historia queda en Git, no en dos plantillas físicas.

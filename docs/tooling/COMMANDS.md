# Manual de comandos de arquitectura/documentación

## Diagnóstico

```bash
npm run tools:doctor
npm run docs:scan
npm run docs:validate
```

`docs:validate` falla por nombre/ruta versionada, link roto o `id` duplicado.
Los orphan se reportan solo para superficies que deben ser navegables; task-cards,
provider profiles, prompts, reports y source-adjacent docs pueden ser hojas válidas.

## Reconciliar nombres modificados

Dry-run:

```bash
npm run docs:paths
```

Aplicar con backup externo:

```bash
npm run docs:paths:apply
```

Usa `config/tooling/architecture-path-aliases.json`. Un alias puede representar
un rename ya aplicado: aun así sirve para actualizar referencias antiguas.

No convierte IDs internos como `RTP-010` o `AIARCH-028`.

## Sanitización de nombres

```bash
npm run docs:sanitize
npm run docs:sanitize:apply
```

Detecta revisión física en paths (`-v2`, `-V7`, `copy`, `backup`, fechas de
revisión, etc.). Git conserva el historial; el filesystem usa nombres
semánticos estables.

## Índice y navegación

```bash
npm run docs:index
npm run docs:links
npm run docs:links:apply
npm run docs:orphans
```

`docs:links` es dry-run. `docs:links:apply` modifica únicamente bloques de
navegación administrados en README/HOME existentes.

## Duplicidad

```bash
npm run docs:duplicates
```

## Importar arquitectura desde ZIP o carpeta

```bash
npm run architecture:import -- --source="/ruta/arquitectura.zip"
npm run architecture:import -- --source="/ruta/arquitectura.zip" --apply
```

El import es conservador y respeta paths protegidos.

## Pipeline completo

Dry-run:

```bash
npm run architecture:all
```

Aplicar:

```bash
npm run architecture:all:apply
```

En modo apply, el pipeline primero reconcilia aliases de paths, después
sanitiza nombres, regenera índice/navegación y valida.

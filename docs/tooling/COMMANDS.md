# Manual de comandos

`package.json` declara una capacidad por CLI, no un alias por combinación. Las
variaciones se pasan como argumentos después de `--`.

| Script | CLI | Ayuda |
|---|---|---|
| `npm test` | `scripts/testing/index.mjs` | `npm test -- help` |
| `npm run quality` | `scripts/quality/index.mjs` | `npm run quality -- help` |
| `npm run docs` | `scripts/project-tools.mjs` | `npm run docs -- doctor .` |
| `npm run architecture` | `scripts/ai/architecture/index.mjs` | `npm run architecture -- help` |
| `npm run maintenance` | `scripts/maintenance/index.mjs` | `npm run maintenance -- help` |

## Testing

```bash
npm test                        # unit + integration (vitest)
npm test -- unit                # tests/unit
npm test -- unit schemas        # tests/unit/behavior/schemas
npm test -- contracts runtime   # tests/unit/contracts/runtime
npm test -- files               # source-contracts generados
npm test -- e2e                 # tests/e2e (chromium por defecto)
npm test -- e2e form --project=firefox

npm test -- audit               # calidad de tests
npm test -- coverage            # cobertura de casos de uso
npm test -- organize            # mapa de migración (--apply para mover)
npm test -- source-tests --apply  # regenera source-contracts y manifest
npm test -- verify --full       # gates por etapas
```

Los E2E corren con **un solo worker**: toda la suite ataca un único servidor de
Vite y montar el Designer es caro; con varios workers el `beforeEach` agotaba el
timeout por contención.

## Calidad

```bash
npm run quality                  # agregado verify
npm run quality -- dead-code
npm run quality -- dead-exports
npm run quality -- duplicates
npm run quality -- cycles
npm run quality -- architecture
```

## Documentación

### Diagnóstico

```bash
npm run docs -- doctor .
npm run docs -- scan .
npm run docs -- validate .
```

`validate` falla por nombre/ruta versionada, link roto o `id` duplicado. Los
orphan se reportan solo para superficies que deben ser navegables; task-cards,
provider profiles, prompts, reports y source-adjacent docs pueden ser hojas
válidas.

### Reconciliar nombres modificados

```bash
npm run docs -- paths .            # dry-run
npm run docs -- paths . --apply    # aplica con backup externo
```

Usa `config/tooling/architecture-path-aliases.json`. Un alias puede representar
un rename ya aplicado: aun así sirve para actualizar referencias antiguas. No
convierte IDs internos como `RTP-010` o `AIARCH-028`.

### Sanitización de nombres

```bash
npm run docs -- sanitize .
npm run docs -- sanitize . --apply
```

Detecta revisión física en paths (`-v2`, `-V7`, `copy`, `backup`, fechas de
revisión, etc.). Git conserva el historial; el filesystem usa nombres semánticos
estables.

### Índice y navegación

```bash
npm run docs -- index .
npm run docs -- links .
npm run docs -- links . --apply
npm run docs -- orphans .
```

`links` es dry-run. Con `--apply` modifica únicamente bloques de navegación
administrados en README/HOME existentes.

### Duplicidad

```bash
npm run docs -- duplicates .
```

## Arquitectura

```bash
npm run architecture -- audit .
npm run architecture -- verify .
npm run architecture -- status .
npm run architecture -- hubs . --apply
npm run architecture -- structure:audit .

npm run docs -- import . --source="/ruta/arquitectura.zip"
npm run docs -- import . --source="/ruta/arquitectura.zip" --apply

npm run docs -- all .           # pipeline dry-run
npm run docs -- all . --apply   # pipeline aplicado
```

El import es conservador y respeta paths protegidos. En modo apply, el pipeline
primero reconcilia aliases de paths, después sanitiza nombres, regenera
índice/navegación y valida.

## Mantenimiento

```bash
npm run maintenance -- audit .
npm run maintenance -- clean . --apply
npm run maintenance -- names .
npm run maintenance -- verify . --full
```

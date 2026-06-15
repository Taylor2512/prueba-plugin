# Scripts

## Instalar arquitectura

```bash
bash scripts/install-architecture.sh /ruta/proyecto
```

## Eliminar Markdown anteriores

```bash
node scripts/delete-existing-markdown.mjs /ruta/proyecto --dry-run
node scripts/delete-existing-markdown.mjs /ruta/proyecto --confirm --backup
```

## Eliminar carpetas vacías

```bash
bash scripts/clean-empty-dirs.sh /ruta/proyecto --dry-run
bash scripts/clean-empty-dirs.sh /ruta/proyecto --confirm
```

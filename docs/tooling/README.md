# Project tooling

Este tooling reemplaza la proliferación de scripts que implementaban parcialmente
las mismas responsabilidades.

## Autoridad

```text
config/tooling/project-tools.config.mjs
        ↓
scripts/project-tools.mjs
        ↓
scripts/tooling/*
        ↓
compatibility wrappers
```

`tools/` queda reservado para analizadores especializados que no forman parte del
ciclo normal del repositorio.

## Diseño

- un solo lector de configuración;
- un solo walker/exclusion model;
- una sola política de nombres;
- un solo índice Markdown;
- una sola resolución de links;
- una sola implementación de duplicidad Markdown;
- una sola importación ZIP/folder;
- dry-run por defecto en operaciones destructivas;
- backup externo antes de reemplazar/eliminar;
- rutas versionadas prohibidas en arquitectura.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Importación segura de una arquitectura](./ARCHITECTURE-IMPORT.md)
- [Reconciliación de paths de arquitectura](./ARCHITECTURE-PATH-RECONCILIATION.md)
- [Manual de comandos](./COMMANDS.md)
- [Sanitización Markdown](./MARKDOWN-SANITIZATION.md)
<!-- project-tools:navigation:end -->

<!-- sisad-architecture-hub:start -->
## Navigation

- [Importación segura de una arquitectura](./ARCHITECTURE-IMPORT.md)
- [Reconciliación de paths de arquitectura](./ARCHITECTURE-PATH-RECONCILIATION.md)
- [Manual de comandos de arquitectura/documentación](./COMMANDS.md)
- [Sanitización Markdown](./MARKDOWN-SANITIZATION.md)

> Managed index. Update source documents, not this list.
<!-- sisad-architecture-hub:end -->

# Source truth

Prioridad:

```text
worktree vivo + Git HEAD
> tests/gates realmente ejecutados
> evidencia de task
> Brain canónico
> context packs/unificados
> documentación histórica
```

Snapshot de referencia recibido el 2026-08-13:

- code: `2026-08-13T17:28:45.926Z`;
- docs: `2026-08-13T17:28:45.409Z`;
- styles: `2026-08-13T17:28:46.337Z`.

SHA-256 de esos inputs:

```text
codigo-frontend-sisad—pdmfe(20260813-172901).md: 03a39f743f59eafe401b1877fa7be539e26606f952e7b329a1cc9688bb3b6334
documentacion-sisad—pdmfe-web(20260813-172900).md: 5773771426466ab2c94080c852fdedd3eb7906552c5eefc913cd40d386486437
styles-sisad—pdmfe(20260813-172900).md: a6b29484c3830f7d35abbbe325c2d3074d41340bcd69c72965fc9fb165ff7943
```

Estos hashes describen los context packs adjuntos, no el HEAD del repositorio.
Antes de modificar producto, confirmar `git status`, branch, HEAD y source vivo.

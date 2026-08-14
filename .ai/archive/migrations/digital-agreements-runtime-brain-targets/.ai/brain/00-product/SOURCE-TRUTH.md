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

Snapshot de referencia suministrado el 2026-08-13:

- code pack: `2026-08-13T21:48:53.383Z`, SHA-256 `b631dfea742311cabbb40ccb23e6749f7be2f29ce86d92dabc749f997f69b6a3`;
- docs pack: `2026-08-13T21:48:52.765Z`, SHA-256 `fdd49cb2883656fae1ab9e8b0662150498eff46a27bd851b6468ef752317ce3b`;
- styles pack: SHA-256 `f40a732b082864e891dbe1b68deadd4b2faf865258d97444ab0288cd607a762c`.

Estos hashes describen context packs, no el HEAD. Antes de modificar producto confirmar
`git status --short`, branch, HEAD y contenido vivo. Source/evidence prevalecen sobre un
ledger desactualizado.

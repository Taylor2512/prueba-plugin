# Migración a worktrees internos

## Decisión

Los worktrees ya no se crean como carpetas hermanas `prueba-plugin-*`. Se ubican bajo:

```txt
prueba-plugin/.worktrees/
```

## Razón

- Visualización unificada en el mismo árbol.
- Apertura mediante workspace multi-root.
- Menos navegación manual.
- Scripts y coordinación accesibles desde main.

## Salvaguarda

La carpeta se ignora por Git y scanners para evitar duplicar el contexto.

## Migración

```bash
./scripts/migrate-sibling-worktrees-to-embedded.sh
```

El script solo mueve worktrees registrados y limpios. No toca clones independientes ni carpetas con cambios.

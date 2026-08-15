# Tooling safe-apply contract

Toda herramienta que modifique filesystem usa dos fases:

```text
PREPARE -> plan serializable create/identical/update/conflict/skip
APPLY   -> ejecuta exactamente el plan validado
```

Reglas:
- dry-run por defecto;
- backup externo antes de overwrite/delete;
- keep-target por defecto en conflicto;
- no partial apply tras detectar conflicto salvo `--new-only` explícito;
- no delete de contenido divergente;
- no path traversal;
- package-script conflict se reporta, no se pisa silenciosamente;
- semantic identifier rename nunca usa global path/text replacement.

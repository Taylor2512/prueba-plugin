# TASK-005 — Reducir any de forma segura

## Objetivo

Reducir `any` sin romper APIs.

## Búsqueda

```bash
rg "any|as any|Record<string, any>|Array<any>|Promise<any>" src/sisad-pdfme src/features
```

## Reglas

- No nuevos as any.
- Usar unknown + guards.
- Usar BaseSchema/SisadSchema/OptionItem.
- No tocar APIs públicas si no está claro.

## Presupuesto

Máximo 5 archivos modificados.

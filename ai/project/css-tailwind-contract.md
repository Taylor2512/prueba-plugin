# Contrato CSS/Tailwind

## Estado

```txt
sisad-pdfme.css: vacío
tokens.css: tokens
tailwind.css: directivas
bridge.css: vacío
```

## Regla

- Skin estático: className.
- Valor dinámico: style.
- CSS técnico: runtimeStyles.
- Tokens: tokens.css.

## Prohibido

- @apply;
- CSS global visual;
- doble fuente className/style;
- recrear labRoutes.css;
- migrar geometría sin pruebas;
- !important visual.

## Preflight false

Usar resets explícitos como `border-solid`, `appearance-none`, `box-border`, `list-none`, `m-0` y `p-0`.

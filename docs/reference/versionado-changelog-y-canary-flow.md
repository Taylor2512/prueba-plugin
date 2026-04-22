# Versionado, changelog y canary flow

## 1. Modelo recomendado

### `0.x`
Evolución rápida, surface API todavía asentándose.

### `1.0.0`
Cuando:
- exports públicos estén estables
- contratos principales cerrados
- ejemplos funcionen
- pipeline de publicación sea reproducible

## 2. Changelog por paquete

Cada paquete debe poder comunicar:
- cambios nuevos
- fixes
- breaking changes
- migraciones

## 3. Changeset ejemplo

```md
---
"@platform/pdf/editor": minor
"@platform/pdf/schemas": patch
---

Agrega soporte para toolbar contextual multinivel y mejora el registro de fields built-in.
```

## 4. Canary

Usar snapshots con nombres como:
- `0.8.0-canary.20260420-1`

## 5. Beta

Para clientes piloto:
- `0.8.0-beta.1`

## 6. Stable

Publicar solo si:
- PRs verdes
- examples verdes
- smoke tests ok
- changelog claro

## 7. Breaking change template

```md
## Breaking changes
- `Designer` fue renombrado a `PdfEditor`
- `@sisad-pdfme/ui` fue reemplazado por `@platform/pdf/editor`

## Migration
Actualiza imports y surface API conforme a la guía de renombre.
```

## 8. Recomendación

Trata `editor`, `contracts` y `schemas` como paquetes más sensibles. Sus breaking changes pesan más que los de helpers internos.

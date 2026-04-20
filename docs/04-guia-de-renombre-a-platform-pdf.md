# Guía de renombre a `platform/pdf`

## 1. Objetivo

Llevar `sisad-pdfme` a una identidad reutilizable/vendible basada en `platform/pdf` sin romper de golpe el repositorio actual.

## 2. Fases recomendadas

### Fase 1 — aliases
Migrar:
- `@sisad-pdfme/common` → `@platform/pdf/core`
- `@sisad-pdfme/ui` → `@platform/pdf/editor`
- `@sisad-pdfme/generator` → `@platform/pdf/generator`
- `@sisad-pdfme/converter` → `@platform/pdf/converter`
- `@sisad-pdfme/schemas` → `@platform/pdf/schemas`

Mantener reexports temporales.

### Fase 2 — carpetas
```text
src/platform/pdf/core
src/platform/pdf/editor
src/platform/pdf/generator
src/platform/pdf/converter
src/platform/pdf/schemas
src/platform/pdf/pdf-lib
```

### Fase 3 — surface API
Cambiar nombres públicos:
- `Designer` → `PdfEditor`
- `Viewer` → `PdfViewer`
- `Form` → `PdfFormView`
- `DesignerEngineBuilder` → `PdfEditorEngineBuilder`

### Fase 4 — CSS
Prefijos:
- `.sisad-pdfme-*` → `.pf-*`
- `--sisad-pdfme-*` → `--pf-*`

### Fase 5 — documentación y ejemplos
Reescribir docs y snippets públicos.

## 3. Tabla sugerida de mapeo

| Actual | Futuro |
|---|---|
| `src/sisad-pdfme/common` | `src/platform/pdf/core` |
| `src/sisad-pdfme/ui` | `src/platform/pdf/editor` |
| `src/features/sisad-pdfme` | `src/features/pdf-studio` |
| `Designer` | `PdfEditor` |
| `Form` | `PdfFormView` |
| `Viewer` | `PdfViewer` |

## 4. Estrategia segura

- crear aliases nuevos primero
- publicar surface API nueva
- dejar compatibilidad por una versión
- remover nombres viejos después

## 5. Ejemplo de Vite

```ts
resolve: {
  alias: {
    "@platform/pdf/core": path.resolve(__dirname, "src/platform/pdf/core"),
    "@platform/pdf/editor": path.resolve(__dirname, "src/platform/pdf/editor"),
    "@platform/pdf/generator": path.resolve(__dirname, "src/platform/pdf/generator"),
    "@platform/pdf/schemas": path.resolve(__dirname, "src/platform/pdf/schemas"),
    "@platform/pdf/converter": path.resolve(__dirname, "src/platform/pdf/converter"),
  }
}
```

## 6. Ejemplo de reexport puente

```ts
export * from "@platform/pdf/editor";
export { PdfEditor as Designer } from "@platform/pdf/editor";
```

## 7. Riesgos

- tests rotos por snapshots o selectores CSS
- imports profundos no migrados
- documentación interna inconsistente
- falsos positivos en renombre masivo

## 8. Recomendación

Usar una migración con:
- script masivo
- dry-run
- rama dedicada
- batería de tests
- checklist manual de imports y estilos

# Paquetización y estructura de módulos

## 1. Punto de partida

El repositorio actual ya tiene una separación bastante útil entre:
- `common`
- `converter`
- `generator`
- `pdf-lib`
- `schemas`
- `ui`
- `features/sisad-pdfme` como aplicación de laboratorio

Esto es una ventaja directa para convertirlo en una plataforma distribuible.

## 2. Objetivo

Separar el sistema en paquetes con responsabilidades claras.

## 3. Estructura objetivo recomendada

```text
packages/
  contracts/
  core/
  editor/
  generator/
  converter/
  schemas/
  collaboration/
  pdf-lib/
  examples/
```

## 4. Equivalencia con la estructura actual

### `contracts`
Debe extraerse de:
- `src/sisad-pdfme/common/types.ts`
- `src/sisad-pdfme/ui/types.ts`
- partes serializables de `schema.ts`, `constants.ts`, `contexts.ts`

### `core`
Debe absorber:
- helpers de dominio
- builder config no visual
- identity, storage config, runtime adapters
- plugin registry base

### `editor`
Debe contener:
- `Designer.tsx`
- `designerEngine.ts`
- `ui/components/*`
- estilos del editor
- runtime de sidebars, overlays, canvas y viewer de edición

### `generator`
Debe quedar orientado a render final PDF.

### `converter`
Debe exponer:
- `pdf2img`
- `pdf2size`
- `img2pdf`
Ya existe una separación browser/node útil para empaquetado.

### `schemas`
Debe actuar como SDK de plugins/fields.

### `collaboration`
Debe aislar:
- sincronización
- locks
- awareness
- comentarios
- bridge con editor

## 5. Recomendación de migración por fases

### Fase A
Crear `packages/` sin mover todavía todo el código.
Usar reexports desde paquetes hacia `src/sisad-pdfme/*`.

### Fase B
Ir moviendo código a paquetes de verdad.

### Fase C
Eliminar rutas antiguas y congelar surface API.

## 6. Reglas para decidir qué pertenece a cada paquete

- si depende de React o DOM -> `editor`
- si es serializable y de dominio -> `contracts` o `core`
- si produce PDF final -> `generator`
- si transforma PDF/imagen -> `converter`
- si registra fields/plugins -> `schemas`
- si sincroniza múltiples usuarios -> `collaboration`

## 7. Anti-patrones

- mezclar tipos de editor dentro de `generator`
- exportar widgets internos del inspector como API pública
- dejar `pdf-lib` profundamente acoplado a `editor`
- hacer que `schemas` dependan de detalles visuales del `RightSidebar`

## 8. Ejemplo de monorepo con workspace

```json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "examples/*"
  ]
}
```

## 9. Ejemplo de paquete `editor`

```json
{
  "name": "@platform/pdf/editor",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 10. Beneficio comercial

Una estructura modular te permite:
- vender módulos separados
- licenciar features enterprise
- ofrecer SDK mínimo o suite completa
- reducir bundle del consumidor
- facilitar white-label y adopción incremental

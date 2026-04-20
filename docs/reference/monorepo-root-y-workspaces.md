# Monorepo root y workspaces

## 1. Meta

Definir una raíz de monorepo preparada para empaquetar `sisad-pdfme` como plataforma modular.

## 2. Estructura propuesta

```text
/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  turbo.json
  .changeset/
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
    editor-basic/
    editor-enterprise/
    generator-node/
```

## 3. Recomendación de gestor

### Mejor opción
`pnpm` por velocidad, symlinks predecibles y buen soporte para workspaces.

### Opción aceptable
`npm workspaces`

### Opción avanzada
`pnpm + turbo`

## 4. Ejemplo de `package.json` raíz

```json
{
  "name": "platform-pdf-monorepo",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "dev:editor-basic": "pnpm --filter editor-basic dev",
    "release:canary": "changeset version --snapshot canary && turbo run build && pnpm -r publish --tag canary --no-git-checks",
    "release:stable": "changeset version && turbo run build && pnpm -r publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "turbo": "^2.0.0",
    "typescript": "^5.6.0"
  }
}
```

## 5. Ejemplo de `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "examples/*"
```

## 6. Ejemplo de `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@platform/pdf/contracts": ["packages/contracts/src/index.ts"],
      "@platform/pdf/core": ["packages/core/src/index.ts"],
      "@platform/pdf/editor": ["packages/editor/src/index.ts"],
      "@platform/pdf/generator": ["packages/generator/src/index.ts"],
      "@platform/pdf/converter": ["packages/converter/src/index.ts"],
      "@platform/pdf/schemas": ["packages/schemas/src/index.ts"],
      "@platform/pdf/collaboration": ["packages/collaboration/src/index.ts"]
    }
  }
}
```

## 7. Ejemplo de `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "lint": {}
  }
}
```

## 8. Decisiones arquitectónicas

- la raíz no debe exportar código de plataforma
- toda lógica reusable debe vivir en `packages/*`
- `examples/*` jamás debe ser dependencia productiva
- la app de laboratorio actual puede migrar a `examples/editor-basic`

## 9. Migración desde el repo actual

### Paso 1
Mantener `src/sisad-pdfme/*` como fuente temporal.

### Paso 2
Crear `packages/*` que reexporten desde `src/sisad-pdfme/*`.

### Paso 3
Mover código poco a poco a `packages/*`.

## 10. Beneficio

Esta raíz deja el proyecto listo para:
- empaquetar módulos por separado
- ejecutar ejemplos reales de consumo
- probar canaries antes de stable
- vender bundles distintos con mínima fricción

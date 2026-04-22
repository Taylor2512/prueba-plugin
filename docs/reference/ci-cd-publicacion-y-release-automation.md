# CI/CD, publicación y release automation

## 1. Pipeline recomendado

### Pull Request
- lint
- typecheck
- unit tests
- build paquetes
- build ejemplos
- smoke import

### Main
- todo lo anterior
- release candidate o canary opcional

### Tag/release
- changelog
- version bump
- build
- publish

## 2. GitHub Actions ejemplo

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

## 3. Job de publicación

```yaml
name: publish

on:
  workflow_dispatch:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://npm.my-company.example/
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm -r publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 4. Release automation con Changesets

Ventajas:
- changelog por paquete
- versionado múltiple
- snapshots/canary
- PR automático de version bump

## 5. Canary flow

- merge a main
- changeset snapshot
- publicar con tag `canary`
- probar examples externos
- promover a `beta` o `latest`

## 6. Artefactos útiles

- bundles dist
- types
- build logs
- example screenshots
- reportes de smoke tests

## 7. Recomendación

Nunca publiques directamente desde una máquina local si quieres vender/reusar la plataforma.

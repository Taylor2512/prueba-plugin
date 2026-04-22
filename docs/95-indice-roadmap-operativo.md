# Índice roadmap operativo

> Estado: roadmap de implementación. Esta tanda aterriza decisiones y artefactos deseados; no representa todavía la estructura real del repositorio.

Esta tanda aterriza la capa anterior en artefactos y decisiones listas para implementación.

## Objetivo

Convertir la documentación conceptual de empaquetado en una guía operativa que sirva para crear una plataforma publicable, con configuración real de monorepo, paquetes, builds, CI/CD y ejemplos consumidores.

## Áreas cubiertas

1. `package.json` raíz y workspaces
2. `package.json` por módulo
3. Configuraciones de build (`tsup`, `vite`, `rollup`)
4. App consumidora de ejemplo
5. Scripts de release, CI y publicación
6. Estrategia de changelog, canary, beta y stable
7. Checklist final de adopción interna y externa

## Archivos incluidos

- [reference/monorepo-root-y-workspaces.md](reference/monorepo-root-y-workspaces.md)
- [reference/package-json-por-paquete.md](reference/package-json-por-paquete.md)
- [reference/configuraciones-de-build-reales.md](reference/configuraciones-de-build-reales.md)
- [reference/consumer-app-y-ejemplos-vivos.md](reference/consumer-app-y-ejemplos-vivos.md)
- [reference/ci-cd-publicacion-y-release-automation.md](reference/ci-cd-publicacion-y-release-automation.md)
- [reference/versionado-changelog-y-canary-flow.md](reference/versionado-changelog-y-canary-flow.md)
- [reference/checklist-de-release-y-soporte.md](reference/checklist-de-release-y-soporte.md)

## Cómo leerla

- La cuarta tanda sigue siendo la verdad del código actual.
- Esta tanda solo sirve para planificar el salto a monorepo, builds y publicación.
- Si ves `workspaces`, `changesets` o paquetes `@platform/pdf/*`, léelo como objetivo futuro.

# CONFIG-001 — Configuración unificada

## Estado

`ready`

## Objetivo

Crear la base del `SisadPdfmeConfigService` sin migrar aún todos los consumidores.

## Alcance

- API pública;
- migración legacy;
- selectors;
- change impact;
- Provider estable.

## No alcance

- reescribir Moveable, Selecto o engine;
- migrar todos los componentes;
- cambiar snapshot.

## Gates

- unit config;
- provider integration;
- public exports;
- build.

# TASK-CANVAS-001 — Proteger overflow/scroll de Canvas post Tailwind

## Estado

completed

## Objetivo

Verificar que utilidades Tailwind no pisen `overflow:auto`, height, scale o page geometry.

## Tareas

- [x] Verificar que el canvas conserva `overflow:auto`.
- [x] Verificar que el stage y el canvas mantienen altura y encaje esperado.
- [x] Verificar que la pila de páginas mantiene el orden vertical.

## No hacer

- No tocar Moveable/Selecto.
- No modificar geometría de páginas o schemas.
- No resolver el overflow con hacks del host.

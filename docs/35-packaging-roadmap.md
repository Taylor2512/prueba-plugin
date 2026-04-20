# Roadmap técnico de empaquetado

## Fase 1 — limpieza contractual
- consolidar tipos
- surface API nueva
- remover imports profundos del consumidor

## Fase 2 — empaquetado interno
- crear entrypoints por módulo
- reexports ordenados
- separar editor/core/contracts

## Fase 3 — build distribuible
- bundles ESM
- d.ts
- sourcemaps
- peer deps claras

## Fase 4 — ejemplos
- integración React mínima
- editor con schemas custom
- persistencia + API + form-json

## Fase 5 — publicación privada
- registry privado o package interno
- versionado semántico
- changelog y notas de migración

## Fase 6 — release comercial
- licencia
- docs públicas
- demo
- ejemplos white-label

## Cierre

La quinta tanda deja una base documental para pasar de repositorio de producto interno a plataforma modular. El siguiente paso lógico es una sexta tanda centrada en:
- entrypoints reales por paquete
- contratos públicos definitivos
- checklist de packaging
- ejemplos listos para npm/private registry

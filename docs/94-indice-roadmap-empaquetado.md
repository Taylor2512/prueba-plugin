# Índice roadmap de empaquetado

> Estado: roadmap operativo. Esta tanda explica cómo debería empaquetarse y publicarse la plataforma; no describe un estado ya implementado.

Esta tanda se enfoca en convertir `sisad-pdfme` en una plataforma distribuible y reusable, con foco en:

1. Empaquetado modular por paquetes
2. Entry points y exports públicos
3. Estrategia ESM/CJS y tipos
4. Ejemplos de consumo externo
5. Publicación en registry privado o npm
6. Checklist de release y soporte

## Archivos incluidos

- `35-packaging-roadmap.md`
- `36-commercial-adoption-checklist.md`
- `37-platform-pdf-migration-plan.md`

## Resultado esperado

Dejar documentado cómo pasar del repositorio actual a una distribución modular estilo:

- `@platform/pdf/editor`
- `@platform/pdf/generator`
- `@platform/pdf/converter`
- `@platform/pdf/schemas`
- `@platform/pdf/contracts`
- `@platform/pdf/collaboration`

## Cómo leerla

- Lee primero la cuarta tanda para distinguir realidad actual de roadmap.
- Usa esta tanda para diseñar empaquetado y publicación futura.
- Si algo describe `packages/*` o exports nuevos, trátalo como propuesta.

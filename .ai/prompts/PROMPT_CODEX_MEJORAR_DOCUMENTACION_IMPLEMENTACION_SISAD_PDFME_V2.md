# Prompt para Codex — Mejorar documentación de implementación SISAD PDFME V2

Trabaja en:

```text
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Objetivo

Integrar el overlay documental V2 y eliminar las contradicciones entre código,
API, ejemplos y guías de portabilidad.

## Lectura obligatoria

```text
src/sisad-pdfme/index.ts
src/sisad-pdfme/integration/index.ts
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
src/sisad-pdfme/integration/resolveSisadPdfmeInstance.ts
src/sisad-pdfme/integration/SisadPdfmeInstance.tsx
src/sisad-pdfme/integration/SisadPdfmeInstanceBundle.ts
src/sisad-pdfme/integration/normalizeHostData.ts
src/sisad-pdfme/adapters/**
src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts
src/sisad-pdfme/react/**
docs/07-integraciones/**
docs/08-api-reference/**
docs/13-ejemplos/**
```

## Reglas

- No modificar código productivo en esta tarea.
- La documentación debe describir la implementación actual.
- No crear una API ficticia para mejorar ejemplos.
- Usar `configurePdfjsWorker`.
- Retirar referencias activas a `configurePdfjsLegacyWorker`.
- No pasar opciones a las factories actuales de adapters.
- Para mappings personalizados, implementar el contrato estructural.
- Diferenciar API raíz, API avanzada e internals.
- Diferenciar bundle y snapshot.
- Explicar estado controlado/no controlado.
- Explicar `id`, `revision` e `instanceKey`.
- Documentar los defaults actuales.
- No duplicar el manual completo en varios archivos.
- Los documentos especializados deben enlazar al manual maestro.
- No afirmar gates no ejecutados.

## Archivos del overlay

Revisa `DOCS-MERGE-MAP.md` y aplica los archivos manteniendo sus rutas relativas.

## Verificación mecánica

```bash
rg "configurePdfjsLegacyWorker" docs README*.md
rg "createRecipientsAdapter.*\{" docs
rg "createDocumentsAdapter.*\{" docs
rg "ui/components/Designer" docs/07-integraciones docs/13-ejemplos
node tools/ai-quality/check-markdown-duplicates.mjs
npm run build
```

## Verificación manual

1. Todos los símbolos documentados existen.
2. Los imports raíz y avanzados son correctos.
3. Los ejemplos de adapters coinciden con las firmas actuales.
4. Multidocumento conserva `document.template`.
5. La precedencia de estado coincide con el resolver.
6. Bundle y snapshot no se presentan como equivalentes.
7. El consumer test incluye Tailwind, worker, PDF y tres runtimes.
8. La documentación no oculta limitaciones reales.

## Entrega

```text
1. archivos reemplazados
2. archivos agregados
3. enlaces corregidos
4. contradicciones eliminadas
5. comandos ejecutados
6. resultados
7. gates no ejecutados
8. limitaciones
9. rollback
10. siguiente task
```

## Condición de parada

Detente si el código contradice la documentación propuesta. Registra la
diferencia y solicita una task separada de código; no alteres la API dentro de
esta tarea documental.

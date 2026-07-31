# ADR — Fachada declarativa `SisadPdfmeInstance`

**Estado:** Propuesto  
**Fecha:** 2026-07-31

## Contexto

Las páginas de `src/examples` montan wrappers de bajo nivel y repiten estado,
callbacks, controller refs, normalización, colors, ownership, template
generation, config composition y event logs.

## Decisión

Crear una fachada de conveniencia `SisadPdfmeInstance` sobre Designer/Form/Viewer.

La definición se divide en:

```txt
definition → JSON-safe
resources  → objetos no serializables
handlers   → callbacks
```

## Consecuencias positivas

- Ejemplos pequeños.
- Integración copy/paste real.
- Menos deep imports.
- Config y action state centralizados.
- Misma definición para Designer/Form/Viewer.
- Mejor contrato para DigitalAgreements y ExternalForms.

## Consecuencias negativas

- Nueva API que debe versionarse.
- Riesgo de convertirse en componente monolítico.
- Requiere política controlado/no controlado.
- Requiere migración de ejemplos y documentación.

## Mitigaciones

- Mantener módulos puros.
- No esconder APIs de bajo nivel.
- Separar definition/resources/handlers.
- Contract tests.
- Diagnostics/explain.
- Límites de archivo y dominio.

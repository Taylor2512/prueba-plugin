# Copilot Instructions

## Fuente de verdad
Todo el workspace de IA vive en `.ai/`. Este archivo resume cómo debe comportarse GitHub Copilot en este proyecto.

## Reglas
- Prioriza cambios locales y pequeños.
- Usa primero el agente adecuado antes de proponer una implementación.
- Revisa skills antes de tocar engine, canvas, selection, schemas o generator.
- Si el cambio toca API pública, documentación o migración, actualiza docs relacionadas.
- Si el cambio toca interacción real del editor, propone cobertura Vitest o Playwright.

## Contexto del producto
Este repositorio es un fork muy evolucionado de pdfme con engine propio, catálogo izquierdo compacto, inspector derecho contextual, overlays de canvas, collaboration, generator, converter y UX inspirada en Wix y DocuSign.

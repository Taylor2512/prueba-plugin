Copilot instructions for prueba-plugin

Visión general
Este repositorio contiene una aplicación React que integra una versión modificada de `sisad-pdfme`.
La interfaz principal es un lienzo (canvas) editable donde predominan las interacciones directas: selección, arrastre, overlays y paneles contextuales. El objetivo UX es un editor tipo Wix: inmediato, directo, con controles contextuales y bajo ruido visual.

Arquitectura objetivo
- `src/sisad-pdfme/*`: adaptadores, runtime y puentes hacia la librería sisad-pdfme modificada.
- `src/components/*`: componentes UI reutilizables y desacoplados del runtime.
- `styles/` y `styles-unificados.css`: tokens y utilidades de presentación.
- `types/`: definiciones públicas y contratos entre la app y `sisad-pdfme`.

Reglas generales para Copilot
- Prioriza cambios locales y no invasivos: preferir adaptadores sobre modificaciones al runtime.
- Preserva contratos públicos en `src/sisad-pdfme` y `types/`.
- Mantén componentes pequeños y con una única responsabilidad.
- Evita soluciones que rompan la accesibilidad o la usabilidad del canvas.

Cómo validar cambios
- Ejecutar la app en modo desarrollo y comprobar interacciones del canvas.
- Ejecutar pruebas unitarias y de integración (`vitest` / `npm test` si aplica).
- Usar Playwright para pruebas E2E y capturas visuales (hay `playwright.config.ts`).

Qué no romper
- No cambiar la API pública del runtime de `sisad-pdfme` sin plan de migración.
- No renombrar tipos en `types/` sin coordinar adaptadores.

Dónde colocar instrucciones y skills
- Instrucciones por ruta: `.github/instructions/*.instructions.md` (ya existen).
- Instrucciones globales: este archivo `.github/copilot-instructions.md`.
- AGENTS.md define el comportamiento esperado del coding agent.
- Skills: `.github/skills/<skill>/SKILL.md` (carpetas con `SKILL.md`).

Uso práctico
Cuando pidas al agente que modifique código, referencia el objetivo (por ejemplo: “Refactoriza `usePdfmeLab.ts` manteniendo compatibilidad con sisad-pdfme modificado”). Copilot debería incluir referencias a este archivo si lo tomó en cuenta.

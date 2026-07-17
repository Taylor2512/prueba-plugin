# OWNERSHIP — UX/QA 2026-07-17

## Agentes y dominios

- CODEX: P0 técnico, hooks, runtime, overlays Canvas, interacción y pruebas focales.
- CLAUDE: arquitectura visual, RightSidebar, DetailView, topbar global, Guardar, DocumentsRail e integración.
- COPILOT: LeftSidebar, host del laboratorio, ESLint/warnings, accesibilidad y pruebas visuales de su dominio.

## Reglas

- Cada agente edita únicamente sus rutas owned por wave.
- Cada agente escribe solo su propio estado y handoffs.
- No se permiten colisiones de ownership sin handoff explícito.

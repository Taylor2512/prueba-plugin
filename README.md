# Arquitectura IA optimizada — SISAD PDFME

Versión: 4.0  
Fecha de referencia: 2026-07-22

Este paquete reorganiza la colaboración entre Codex, Claude y GitHub Copilot alrededor de una única fuente de verdad, carga progresiva de contexto, skills reutilizables, task-cards pequeñas, memoria curada, coordinación Scrum y gates de calidad.

## Objetivos

- Reducir consumo de tokens y relecturas innecesarias.
- Evitar duplicidad en código, estado, contratos, UI, CSS, pruebas, documentación, prompts y tareas.
- Mantener el conocimiento durable sin convertir la memoria en un vertedero de logs.
- Separar planificación, exploración, implementación, validación y revisión.
- Usar el modelo más económico que pueda resolver cada tarea con calidad.
- Proteger canvas, multipágina, snapshots, ownership, grupos de opciones y API pública.

## Inicio

1. Leer `AGENTS.md`.
2. Abrir `.ai/START.md`.
3. Elegir una task-card o crearla con `.ai/templates/TASK-CARD.md`.
4. Aplicar `.ai/MODEL-ROUTER.md`.
5. Cargar solo la ruta, regla, playbook y skill necesarios.
6. Ejecutar gates y actualizar memoria por delta.

## Fuente única de verdad

La carpeta `.ai/` es canónica. `AGENTS.md`, `CLAUDE.md` y `.github/copilot-instructions.md` son adaptadores delgados; no deben copiar el contenido completo de `.ai/`.

## Contenido

- `.ai/`: gobierno, memoria, Scrum, rutas, agentes, playbooks, templates y fuentes.
- `.agents/skills/`: skills en el estándar abierto `SKILL.md`.
- `.github/agents/`: perfiles Markdown para Copilot.
- `.codex/agents/README.md`: plantillas de configuración Codex sin duplicar instrucciones.

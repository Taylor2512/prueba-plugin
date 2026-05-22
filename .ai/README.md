# `.ai` — Workspace neutral de asistencia IA

Esta carpeta contiene la fuente de verdad para modelos de IA que trabajen sobre `sisad-pdfme`.

## Estructura

```text
.ai/
├── agents/          # Subagentes por dominio técnico
├── architecture/    # Arquitectura del asistente IA
├── context/         # Contexto estable del proyecto
├── instructions/    # Reglas de implementación por área
├── prompts/         # Prompts ejecutables por tarea
├── rules/           # Reglas globales
├── skills/          # Skills reutilizables
└── templates/       # Plantillas de reportes y decisiones
```

## Uso

1. El orquestador lee reglas globales.
2. Selecciona un agente.
3. Carga uno o varios skills.
4. Ejecuta un prompt.
5. Valida con tests.
6. Actualiza documentación.

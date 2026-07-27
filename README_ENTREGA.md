# SISAD PDFME — Arquitectura IA V6

Esta entrega reemplaza la arquitectura V5 por una estructura más pequeña en el arranque, más rigurosa en evidencia y más completa para un componente frontend reutilizable.

## Objetivos

- reducir consumo de tokens y reaperturas innecesarias;
- prevenir alucinaciones, ciclos de análisis y desbordamiento de contexto;
- separar memoria durable, estado operativo y evidencia histórica;
- coordinar Codex, Claude Code, GitHub Copilot y otros asistentes sin duplicar reglas;
- mantener un único escritor por parche y varios lectores especializados;
- proteger Canvas, Moveable, Selecto, Snapshot, Generator y la API pública;
- incorporar UX, accesibilidad, responsive, rendimiento, Tailwind, plugins y configuración;
- medir calidad de prompts, tareas, agentes y cambios de código.

## Entrada recomendada

1. Leer `AGENTS.md`.
2. Leer `.ai/START.md`.
3. Seleccionar una task-card en `.ai/tasks/`.
4. Cargar una ruta y una skill, no toda la arquitectura.
5. Confirmar evidencia, alcance, presupuesto y condiciones de parada.
6. Ejecutar, validar, revisar y emitir `MEMORY-DELTA`.

## Diferencia esencial frente a V5

V5 tenía una base correcta, pero seguía fragmentada y carecía de controles explícitos para:

- afirmaciones sin evidencia;
- repetición de búsquedas;
- acumulación silenciosa de contexto;
- memoria obsoleta;
- cambios visuales sin verificación renderizada;
- evaluación de prompts y agentes;
- especialización para arquitectura de librerías frontend.

V6 incorpora esos controles como políticas, plantillas, skills y gates.

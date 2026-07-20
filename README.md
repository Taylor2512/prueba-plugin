# Arquitectura de Agentes IA — SISAD PDFME V4

Este paquete contiene una arquitectura documental completa para coordinar agentes de inteligencia artificial en SISAD PDFME.

La arquitectura se centra en:

- responsabilidades;
- alcance;
- contratos;
- evidencia;
- tareas;
- memoria;
- revisiones;
- handoffs;
- planes;
- prompts;
- skills reutilizables.

No depende de una estructura particular de ramas, repositorios, carpetas de ejecución o herramientas de control de versiones.

## Instalación

Copia la carpeta `ai/` en la raíz del proyecto:

```bash
cp -R ai /ruta/al/proyecto/
```

Punto de entrada:

```txt
ai/START.md
```

## Jerarquía

```txt
ai/
├── governance/
├── router/
├── agents/
├── reviewers/
├── skills/
├── context/
├── rules/
├── playbooks/
├── plans/
├── prompts/
├── tasks/
├── memory/
├── handoffs/
├── reports/
├── checklists/
├── templates/
└── archive/
```

## Principios

1. Una tarea por ejecución.
2. Un agente lógico responsable por dominio.
3. Contexto mínimo.
4. Ownership explícito.
5. Cambios pequeños.
6. Contratos antes que apariencia.
7. Evidencia antes que afirmaciones.
8. Memoria compacta.
9. Historia archivada.
10. No inventar rutas, APIs ni resultados.

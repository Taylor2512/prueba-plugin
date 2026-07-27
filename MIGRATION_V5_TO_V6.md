# Migración V5 → V6

## Conservado

- router por dominio;
- skills bajo demanda;
- memoria por delta;
- Scrum ligero;
- un escritor y varios lectores;
- worktrees para paralelismo;
- gates focales;
- separación owned/vendor/generated.

## Consolidado

- `sisad-dry-refactor` y `sisad-dry-refactoring` se sustituyen por una sola skill;
- las taxonomías duplicadas se concentran en `.ai/architecture/`;
- las políticas de calidad se concentran en `.ai/governance/QUALITY-POLICY.md`;
- `scrum/tasks` y `scrum/task-cards` se sustituyen por `.ai/tasks/`;
- prompts mínimos se reemplazan por contratos ejecutables con entradas, salidas y límites.

## Agregado

- política anti-alucinación;
- ledger de afirmaciones;
- control de overflow con marcas 60/75/85%;
- presupuesto por fase;
- evaluación de prompts y agentes;
- memoria con confianza, procedencia, vigencia y garbage collection;
- roles de UX, accesibilidad, configuración, API pública y rendimiento;
- protocolo de recuperación después de loops o compaction;
- matriz de skills para un componente frontend reutilizable.

## Adopción

1. Copiar V6 sin eliminar V5.
2. Ejecutar auditoría de duplicidad documental.
3. Migrar task-cards activas.
4. Elegir fuentes canónicas.
5. Marcar V5 como histórica.
6. Probar dos tareas pequeñas.
7. Activar gates de advertencia.
8. Activar bloqueos solo después de observar falsos positivos.

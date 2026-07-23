# START — Punto de entrada único

## Secuencia

1. `SCOPE.md`: confirma qué pertenece a SISAD PDFME.
2. `MODEL-ROUTER.md`: selecciona modelo, esfuerzo y número de agentes.
3. `scrum/SPRINT-CURRENT.md`: confirma prioridad y WIP.
4. Task-card: objetivo, archivos, prohibiciones y criterios.
5. `ROUTER.md`: carga solo el contexto necesario.
6. Skill: ejecuta el workflow reutilizable.
7. `governance/QUALITY-GATES.md`: valida.
8. `playbooks/UPDATE-MEMORY.md`: persiste solo el delta durable.

## Regla anti-loop

Si después de dos rondas de búsqueda no aparece evidencia nueva, detén la exploración, resume lo conocido y divide la tarea. No vuelvas a leer documentación global para una task-card ya clasificada.

## Regla anti-duplicidad

Antes de agregar algo nuevo responde:

- ¿Ya existe el concepto?
- ¿Cuál archivo es su propietario?
- ¿Es un clon exacto, estructural, de estado, contrato, UI, mapping o proceso?
- ¿Qué patrón elimina la causa sin crear una abstracción genérica innecesaria?

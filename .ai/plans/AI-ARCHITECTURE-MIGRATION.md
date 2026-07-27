# Migración de arquitectura IA

## Estrategia

- instalar V6 en paralelo;
- mapear cada archivo V5 a su fuente V6;
- migrar tareas activas;
- eliminar duplicaciones;
- probar tareas S;
- medir;
- archivar V5.

## Matriz

| V5 | V6 |
|---|---|
| scrum/task-cards + tasks | `.ai/tasks` |
| políticas duplicadas | `.ai/governance` |
| pattern docs duplicadas | `.ai/architecture` |
| prompts de 3 líneas | prompts con contrato |
| anti-loop básico | anti-loop + evidence delta |
| memoria simple | provenance + TTL + GC |

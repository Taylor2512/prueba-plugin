# Política de contexto

## Progressive disclosure

Cada capa se carga solo cuando responde una pregunta concreta:

1. task-card;
2. ruta;
3. símbolos;
4. pruebas;
5. skill;
6. referencia amplia, solo si sigue una incógnita.

## Evidence packet

Cada investigación devuelve:

- pregunta;
- archivos/símbolos;
- evidencia;
- conclusión;
- confianza;
- incógnitas;
- recomendación;
- siguiente acción.

No devuelve narración de comandos ni copias extensas.

## Contexto prohibido por defecto

- `node_modules`, bundles y cobertura;
- backups y documentos generados;
- conversaciones completas;
- todos los prompts y skills a la vez;
- memoria histórica completa;
- vendor cuando no es el objetivo.

## Invalidación

Un resumen queda obsoleto si cambia el commit base, la ruta propietaria, el contrato público o un test caracterizador.

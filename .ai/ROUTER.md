# ROUTER — Selección de contexto y task-card

## Pregunta 1 — ¿Qué proceso toca?

| Señal del usuario | Task-card |
|---|---|
| página 2 falla, hojas, multipágina, coordenadas, drop | TASK-001 |
| selección, mover, resize, rotate, shortcuts, Selecto, Moveable | TASK-002 |
| checkboxGroup, radioGroup, dropdown, botón +, options | TASK-003 |
| SOLID, POO, objetos, schemas, registry, factories | TASK-004 |
| any, casts, tipos, unknown, guards | TASK-005 |
| DetailView, inspector, propiedades, ListView | TASK-006 |
| diseño, visual, DocuSign-like, field chrome | TASK-007 |
| wrappers, features, archivos triviales | TASK-008 |
| guardar, importar, snapshot, metadata | TASK-009 |
| commandBus, selectionCommands, undo/redo | TASK-010 |

## Pregunta 2 — ¿Qué NO se toca?

Siempre excluir por defecto:

```txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms flujo de negocio
```

## Pregunta 3 — ¿Hace falta análisis global?

Respuesta por defecto: NO.

Solo se permite análisis global si el usuario pide explícitamente auditoría general.

## Resultado del router

Antes de modificar, el agente debe declarar:

```md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
```

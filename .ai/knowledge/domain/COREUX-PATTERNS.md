# Matriz de patrones de diseño

| Problema | Patrón | Aplicación |
|---|---|---|
| creación de schemas | Factory Method / Abstract Factory | factories por familia reutilizadas por catálogo, recipe y controller |
| configuración compleja | Builder + ConfigService | config/engine sin props dispersas |
| tipos extensibles | Registry | schemas, actions, widgets, panels, providers |
| comportamiento por familia | Strategy | inspector, validation, rendering, runtime interaction |
| acceso/visibilidad | Specification / Policy | access state, schema policy, action state |
| operaciones mutables | Command | add/update/delete/page/assignment/view toggles |
| undo/redo | Memento + Command History | snapshots mínimos por comando |
| eventos | Observer/Event Bus | eventos tipados y dispatcher |
| efectos React/DOM | Mediator/Coordinator | foco, scroll, modal, announcements |
| datos del host | Adapter | recipients/documents/persistence/signature |
| API simplificada | Facade | controller y wrappers públicos |
| grupos de opciones | Composite | root schema + options internas |
| chrome visual | Decorator/Policy | owner tone, selection, required, lock |
| modos de interacción | State Machine/Reducer | canvas y superficies responsive |
| snapshots | Memento/versioned serializer | round-trip y migración |

## Regla anti-sobrearquitectura

Crear una abstracción solo cuando:

1. existen dos o más consumidores semánticos;
2. comparten invariantes y ritmo de cambio;
3. reduce fuentes de verdad;
4. tiene contract test;
5. no crea otra API paralela.

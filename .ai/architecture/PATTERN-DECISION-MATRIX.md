# Matriz de patrones

| Problema | Patrón inicial |
|---|---|
| variantes de schema | Factory + Registry |
| comportamiento por familia | Strategy |
| permisos/visibilidad | Policy/Resolver |
| acciones | Command Registry |
| configuración compleja | Facade + selectors |
| estado de interacción | Reducer/State Machine |
| host externo | Adapter |
| UI repetida | composition/primitive |
| pipeline de drop | Pipeline |
| creación paso a paso | Builder |
| eventos desacoplados | EventHub |
| datos derivados React | selector/memoization |

No aplicar patrón sin dos consumidores, nombre de dominio y reducción real de puntos de cambio.

# Taxonomía de duplicidad

Reducir duplicidad no significa solo bajar jscpd.

| Tipo | Síntoma | Solución preferente |
|---|---|---|
| textual | bloques iguales | helper/factory compartida |
| estructural | misma forma con parámetros distintos | Strategy o Factory |
| mapping | adaptación repetida de datos | Adapter |
| registro | switches por tipo | Registry + Factory |
| orquestación | misma secuencia de servicios | Facade / use case |
| estado | booleanos o fuentes paralelas | Reducer / State Machine / selector canónico |
| contrato | tipos casi iguales | tipo base, branded types, schema común |
| UI | mismas superficies con variantes | composición / compound components |
| React logic | effects y handlers repetidos | custom hook con responsabilidad real |
| comandos | acciones dispersas entre toolbar/atajos/menu | Command bus |
| CSS | declaraciones/tokens repetidos | tokens, variantes y utilidades Tailwind |
| pruebas | fixtures/setup duplicados | builders y test harness compartidos |
| documentación | reglas copiadas en varios proveedores | fuente canónica + adapters delgados |
| prompts | prompts maestros con contenido repetido | router + skills progresivas |
| memoria | estado repetido en current, handoff y sprint | propietario único por dato |
| tareas | mismo trabajo en varios agentes | backlog IDs + WIP + worktree ownership |

## No sobre-abstraer

No extraigas coincidencias accidentales. Una abstracción es válida cuando comparte semántica, invariantes y ritmo de cambio; no solo líneas parecidas.

## Gate de creación

Antes de crear un módulo nuevo registra:

1. Concepto de dominio.
2. Propietario actual.
3. Consumidores.
4. Tipo de duplicidad.
5. Patrón elegido.
6. Evidencia de que reduce puntos de cambio.

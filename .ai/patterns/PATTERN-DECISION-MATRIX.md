# Matriz de selección de patrones

1. Empieza con función pura o composición.
2. Usa custom hook solo si existe semántica React compartida.
3. Usa Strategy si las variantes comparten entrada/salida y cambian comportamiento.
4. Usa Factory si la creación depende de tipo/configuración.
5. Combina Factory con Registry cuando terceros puedan extender tipos.
6. Usa Adapter en fronteras de API, snapshot o host.
7. Usa Facade para ocultar una secuencia estable de subsistemas.
8. Usa State Machine/Reducer cuando haya transiciones válidas e inválidas.
9. Usa Command para acciones invocadas desde toolbar, menú, teclado y undo/redo.
10. Usa Policy/Resolver para decisiones puras de acceso, selección o visibilidad.

Rechaza el patrón si no reduce condiciones, puntos de cambio o conocimiento duplicado.

# Task Intake

## Validación operativa

- [ ] ¿El proveedor está en el worktree correcto?
- [ ] ¿La rama coincide con el proveedor?
- [ ] ¿La wave está abierta?
- [ ] ¿Existe una task-card activa?
- [ ] ¿Existe lock externo?
- [ ] ¿Los owned paths están definidos?
- [ ] ¿Los forbidden paths están definidos?
- [ ] ¿Otro agente modifica un archivo transversal?
- [ ] ¿Los tests focales están definidos?
- [ ] ¿La tarea requiere integración o solo implementación?

## Antes de aceptar una tarea

- [ ] ¿Duplica una task-card completed?
- [ ] ¿Reabre una decisión cerrada?
- [ ] ¿Toca Moveable, Selecto, zoom, canvas, snapshot, generator o pdf-lib?
- [ ] ¿Requiere nueva regression task-card?
- [ ] ¿Supera 5 archivos productivos?
- [ ] ¿Necesita `package.json`, configs o runtimeStyles compartidos?

Cuando supera el scope, dividir antes de editar.

## Colisiones

Si dos task-cards incluyen la misma ruta:

1. no iniciar ambas;
2. asignar un único owner;
3. convertir la segunda en dependencia;
4. integrar la primera;
5. realinear ramas;
6. ejecutar la segunda en otra wave o slice.

## Tests

No actualizar expected o snapshots sin documentar:

- contrato anterior;
- comportamiento actual;
- razón de cambio;
- evidencia visual o funcional;
- aprobación del integrador.

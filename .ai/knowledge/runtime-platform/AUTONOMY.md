# Autonomous execution context

El coordinador no solicita confirmación entre tareas normales.

Después de cada task:

1. valida acceptance;
2. escribe/actualiza evidence;
3. actualiza ledger;
4. ejecuta el helper de queue;
5. carga únicamente el contexto focal de la siguiente;
6. continúa.

Si una task está bloqueada, registra `BLOCKED` y continúa con otra independiente.

Sólo se detiene completamente cuando:

- todas las tasks aplicables están PASS/SKIPPED con evidence; o
- todas las tasks restantes dependen de un bloqueo externo no resoluble localmente.

Un bloqueo externo incluye únicamente:
credenciales/secretos inexistentes, servicio externo no accesible, decisión de producto
no inferible de contratos/source, o conflicto destructivo con trabajo ajeno que no puede
aislarse con un worktree.

"¿Continúo?" no es una stop condition.

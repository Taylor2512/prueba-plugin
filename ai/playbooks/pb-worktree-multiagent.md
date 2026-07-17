# Playbook — Ejecución multiagente con worktrees

## Preparación

1. Confirmar que `main` está limpio.
2. Confirmar topología con `git worktree list`.
3. Confirmar que ramas de agentes parten del mismo `main`.
4. Publicar la wave y ownership.
5. Crear locks externos.

## Ejecución

Cada proveedor:

1. valida carpeta/rama;
2. abre una task-card;
3. reproduce fallos focales;
4. implementa;
5. ejecuta ESLint/Vitest focal;
6. crea commits atómicos;
7. escribe handoff;
8. libera lock;
9. se detiene.

## Integración

1. Leer handoffs.
2. Comparar `main..ai/<agente>`.
3. Rechazar rutas no autorizadas.
4. Detectar intersecciones.
5. Cherry-pick por dependencia.
6. Ejecutar lint.
7. Ejecutar build.
8. Ejecutar Vitest.
9. Ejecutar Playwright focal.
10. Registrar gate.

## Publicación

```bash
git merge --ff-only ai/integration
```

## Reutilización

Después de publicar:

1. verificar worktrees limpios;
2. confirmar commits aceptados en `main`;
3. realinear ramas;
4. publicar siguiente wave.

# Checklist — Gate de integración

## Ownership

- [ ] `git diff --name-only main..ai/codex` revisado.
- [ ] `git diff --name-only main..ai/copilot` revisado.
- [ ] `git diff --name-only main..ai/claude` revisado.
- [ ] Sin rutas no autorizadas.
- [ ] Sin intersecciones no aprobadas.

## Calidad

- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run build`.
- [ ] `npx vitest run`.
- [ ] Playwright focal.
- [ ] Sin expected/snapshots alterados para ocultar regresiones.
- [ ] Sin CSS global o `@apply` nuevo.
- [ ] Sin imports rotos o wrappers recreados.

## Publicación

- [ ] Gate documentado.
- [ ] `ai/integration` limpio.
- [ ] `main` limpio.
- [ ] `git merge --ff-only ai/integration`.
- [ ] Ramas de agentes limpias.
- [ ] Realineación controlada.

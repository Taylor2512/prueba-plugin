# Principios de arquitectura

## Responsabilidad única

Cada Markdown tiene una función:

- `context`: qué saber;
- `rules`: qué no romper;
- `playbooks`: cómo ejecutar;
- `task-cards`: qué hacer ahora;
- `memory`: qué recordar;
- `reports`: qué se evidenció;
- `coordination`: cómo cooperan los worktrees;
- `project`: contratos estables.

## Separación de conceptos

No confundir:

```txt
Agente lógico:
  canvas-agent, inspector-agent, schema-agent, etc.

Proveedor ejecutor:
  Codex, Claude, Copilot.

Rol Git:
  implementador, integrador, coordinador/main.
```

El router selecciona dominio y agente lógico; la wave asigna proveedor y worktree.

## Aislamiento

Cada proveedor implementa en su worktree y rama reutilizable.

```txt
ai/codex
ai/copilot
ai/claude
```

Ningún agente implementador toca `main` o `ai/integration`.

## Integración como gate

`ai/integration` es la única rama donde se combinan commits aceptados y se ejecuta el gate global.

`main` no recibe trabajo parcial.

## Main fast-forward only

La publicación se realiza con:

```bash
git merge --ff-only ai/integration
```

No se crean merge commits por wave.

## Ramas reutilizables

Después del gate y fast-forward, las ramas de agentes se realinean con el nuevo `main` únicamente cuando:

- están limpias;
- sus commits aceptados ya están contenidos en `main`;
- no existe trabajo pendiente;
- lo ejecuta el coordinador.

## Anti-duplicidad

- No duplicar reglas en adaptadores raíz.
- No crear otra arquitectura paralela.
- No recrear wrappers retirados.
- No crear otra fuente de estado.
- No mover skin visual a CSS runtime.

## Tailwind-first

- JSX/TSX contiene el skin visual.
- `runtimeStyles.ts` conserva solo CSS técnico demostrado.
- `tokens.css` conserva tokens necesarios.
- `preflight: false` exige resets locales explícitos.

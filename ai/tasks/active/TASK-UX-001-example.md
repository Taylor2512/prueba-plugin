# TASK-UX-001 — Ejemplo de task activa

## Estado

`active`

## Prioridad

`P2`

## Objetivo

Separar visualmente estados default, hover y selected en un catálogo.

## Síntoma

Todos los elementos parecen seleccionados.

## Comportamiento esperado

Solo el elemento realmente seleccionado usa fondo y borde de selección.

## Agente lógico

`frontend-ux-agent`

## Revisor

`visual-reviewer`

## Contexto

`context/css-tailwind-context.md`

## Rules

`rules/frontend-rules.md`
`rules/css-tailwind-rules.md`

## Playbook

`playbooks/ux-improvement.md`

## Owned paths

```txt
componentes del catálogo
tokens relacionados
```

## Forbidden paths

```txt
Canvas
runtime
schemas
```

## Criterios

- default neutral;
- hover visible;
- selected inequívoco;
- favorite independiente;
- owner color independiente.

## Parada

Detenerse si el estado selected proviene de un contrato no documentado.

# HANDOFF — TASK-UX-001

## Estado

`completed`

## Agente

`frontend-ux-agent`

## Objetivo

Separar estados visuales del catálogo.

## Causa raíz

El color de selección se aplicaba como estilo por defecto.

## Archivos modificados

- componente de catálogo;
- tokens de estado.

## Cambios

- default neutral;
- hover separado;
- selected explícito;
- favorite independiente.

## Contratos preservados

- drag;
- favorite callback;
- owner color.

## Evidencia

Comparación visual documentada.

## Riesgos

Verificar otros catálogos que reutilicen el mismo componente.

## Pendiente

Ninguno.

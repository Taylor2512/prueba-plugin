# Arquitectura del agente

## Loop

```txt
Perceive:
  entender petición, dominio y riesgo.

Retrieve:
  cargar contexto mínimo.

Plan:
  elegir agente/subagente, archivos objetivo y validación.

Act:
  modificar código o generar propuesta.

Observe:
  revisar build/lint/tests/HAR/logs.

Guardrail:
  seguridad, CSS, snapshot, canvas, token budget, no duplicidad.

Memory:
  actualizar memoria si hay decisión permanente.
```

## Herramientas esperadas

- `rg`
- lectura de archivos puntuales
- Vitest dirigido
- Playwright para canvas/visual
- build/lint
- scripts quality
- reportes compactos

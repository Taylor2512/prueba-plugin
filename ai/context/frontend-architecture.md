# Frontend Architecture

## Estado

La UI se organiza en Designer, Canvas, sidebars, runtime público, schemas, adapters y host de referencia.

## Fuente de verdad

Código del dominio y contratos públicos actuales.

## Preguntas

- ¿Qué identidad persiste?
- ¿Qué estado es visual y cuál semántico?
- ¿Qué agente es owner?
- ¿Qué dependencia existe?
- ¿Qué evidencia protege el contrato?

## Riesgos

- duplicidad;
- consumo de internals;
- cambio visual que altera negocio;
- estado derivado incorrecto;
- historia obsoleta.

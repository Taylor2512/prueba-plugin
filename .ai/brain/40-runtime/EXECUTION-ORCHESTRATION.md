# Execution orchestration

Execution orchestration es una capa genérica encima del mismo Form runtime.

```text
ExecutionPlan
  -> ExecutionStage[]
      -> ExecutionUnit[]
          -> User × Document × RuntimeSession
              -> SisadPdfmeForm
```

Shapes:
- single = un unit;
- sequential = un unit por stage;
- parallel = varios units en un stage;
- mixed = stages de cardinalidad variable;
- massive = fan-out de muchos units aislados.

El LAB puede simular activación/barriers. Core Form sólo ejecuta el contexto recibido.

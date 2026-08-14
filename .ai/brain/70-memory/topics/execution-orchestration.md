# Execution orchestration memory

Durable facts:

- User es la identidad reusable de interacción.
- Mutable state: RuntimeSession × User × Document.
- Sequential/parallel/mixed/massive son execution shapes, no Form modes.
- Completion es proyección, no truthiness.
- Shared values requieren conflict/revision policy.
- Sequential/parallel unification prefiere canonical data merge + regeneration.
- Massive produce resultados por execution; bundle es explícito.
- No conocimiento de un host concreto en Brain/core.

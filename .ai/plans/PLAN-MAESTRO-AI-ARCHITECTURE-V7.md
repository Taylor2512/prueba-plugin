# Plan maestro V7

## Objetivo

Reducir coste/context rot y mejorar memoria, decisión, trazabilidad y
compatibilidad Codex/Claude/Copilot.

## Waves

```txt
W0 baseline, arranque y routing
W1 context packets, memory y traceability
W2 skills, agents y provider adapters
W3 Scrum, evidence, scripts y evals
W4 migration, dedup, CI y rollout
```

## Camino crítico

```txt
001→002/003/004/005
004+005→006
001→007→008
001→009→010/011/012→013
001→014→015
001→016→017→018/019/020→021
004+009→022→023
005→024
005+013+021+022→025
015+021→026
011+022→027→028
025→029
026+028+029→030
```

## Métricas

- boot packet ≤2.5k;
- diagnóstico típico ≤12k;
- una skill principal;
- ≤2 subagentes readers;
- 0 provider governance duplication;
- 100% task-cards con context manifest;
- 100% cambios funcionales con trace IDs;
- memory index <200 líneas/25KB;
- adapters repo-wide <2 páginas.

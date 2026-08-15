# Autonomous execution contract

El agente principal funciona como coordinator continuo.

## Loop

```text
reconcile live state
 -> choose next unblocked task
 -> characterize
 -> implement smallest authority
 -> focal tests
 -> integration gates
 -> evidence
 -> ledger
 -> next task
```

No pregunta al usuario qué task continuar.

## Decision policy

Cuando hay varias soluciones válidas:
1. contrato existente;
2. menor superficie pública;
3. menor riesgo de migración;
4. reversible;
5. reusable;
6. menos duplicación.

Si una decisión cambia arquitectura pública, escribir ADR/evidence.

## Block policy

Un task bloqueado no detiene todo el programa si existe trabajo independiente.

Sólo solicitar intervención humana por:
- secreto/credencial no disponible;
- requisito externo imposible de simular;
- decisión de producto no derivable de source/contratos;
- conflicto de writers no aislable de forma segura.

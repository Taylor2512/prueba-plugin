# Política de trazabilidad

Todo cambio funcional declara:

```txt
useCaseIds
behaviorIds
methodIds/symbols
eventIds
effectIds
testIds
decisionIds
riskIds
```

## Estados

- `candidate`: heurística o plan.
- `verified`: código/test/review.
- `stale`: base o contrato cambió.
- `deprecated`: reemplazado con enlace.
- `unknown`: sin evidencia.

No inventar precisión. Un método generado heurísticamente no se marca verified
hasta revisión humana o test.

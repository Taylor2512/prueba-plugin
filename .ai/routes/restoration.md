# Ruta — Restauración funcional de SISAD PDFME

## Cuándo usarla

Usar esta ruta cuando una capacidad que antes existía en `src/features/pdfcomponent`
desapareció de los nuevos ejemplos, quedó inaccesible desde la API pública o permanece
implementada internamente pero sin contrato ejecutable.

## Lectura mínima

1. `.ai/START.md`
2. `.ai/governance/ANTI-HALLUCINATION.md`
3. `.ai/governance/ANTI-LOOP.md`
4. `.ai/governance/ANTI-OVERFLOW.md`
5. `.ai/architecture/PUBLIC-API-COMPATIBILITY.md`
6. `.ai/routes/integration.md`
7. `.ai/routes/runtime-snapshot.md`
8. `.ai/routes/schemas.md`
9. `.ai/plans/PLAN_MAESTRO_RESTAURACION_FUNCIONALIDADES_SISAD_PDFME_2026-07-30.md`
10. Una sola task-card `RESTORE-*`

## Skills recomendados

- `.agents/skills/sisad-evidence-grounding/SKILL.md`
- `.agents/skills/sisad-public-api-compatibility/SKILL.md`
- `.agents/skills/sisad-snapshot-compatibility/SKILL.md`
- `.agents/skills/sisad-multi-document-routing/SKILL.md`
- `.agents/skills/sisad-collaboration-assignments/SKILL.md`
- `.agents/skills/sisad-schema-family-refactor/SKILL.md`
- `.agents/skills/sisad-testing-pyramid/SKILL.md`

## Frontera

```txt
src/sisad-pdfme:
  capacidades genéricas y portables

src/examples:
  demostraciones y fixtures

hosts:
  reglas de negocio, endpoints y workflows externos
```

## Regla de clasificación

Cada función eliminada debe marcarse como:

```txt
CORE
HOST_EXAMPLE
DUPLICADA_EN_CORE
NO_RESTAURAR
DESCONOCIDO
```

`DESCONOCIDO` bloquea implementación hasta obtener evidencia.

## Protecciones

No restaurar archivos completos desde `src/features/pdfcomponent`.
No introducir dependencias desde `src/sisad-pdfme` hacia `src/examples`.
No tocar Moveable, Selecto, coordinate math, generator o snapshot sin task-card focal.

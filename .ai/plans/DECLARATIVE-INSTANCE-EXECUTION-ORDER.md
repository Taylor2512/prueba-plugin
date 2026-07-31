# Orden de ejecución — instancias declarativas

## Secuencia crítica

```text
DECL-001 → DECL-002/003 → DECL-004 → DECL-005
→ DECL-006/007/009
→ DECL-008/010/011/012/013
→ DECL-014/015/016
→ DECL-017 → DECL-018/019/020/022
→ DECL-021/023 → DECL-024 → DECL-025
→ DECL-026/027
→ DECL-028 → DECL-029 → DECL-030/031
→ DECL-032
→ DECL-033/034/035
→ DECL-036
```

## Paralelismo permitido

- DECL-002 y DECL-003 pueden ejecutarse en worktrees separados.
- DECL-007 y DECL-009 pueden ejecutarse después de los contratos base.
- DECL-011 y DECL-012 pueden ejecutarse en paralelo.
- DECL-014 y DECL-016 pueden ejecutarse en paralelo.
- DECL-018, DECL-019 y DECL-022 pueden ejecutarse en paralelo después del state model.
- DECL-030 y DECL-031 pueden ejecutarse en paralelo con writers distintos.
- DECL-033, DECL-034 y DECL-035 pueden ejecutarse en paralelo.

WIP máximo: 3. Solo una tarea de riesgo Muy alto en progreso.
